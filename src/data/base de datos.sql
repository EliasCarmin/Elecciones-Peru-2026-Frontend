-- =============================================
-- BASE DE DATOS DE ANALÍTICA ELECTORAL
-- =============================================
-- Objetivo: Rastrear el User Journey completo, detectar fraudes en simulacros 
-- y analizar comportamiento sin comprometer datos sensibles.

-- Habilitar extensión para generar UUIDs (identificadores únicos universales)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. TABLA MAESTRA DE CANDIDATOS
-- =============================================
CREATE TABLE candidatos (
    id SERIAL PRIMARY KEY,
    nombre_apellido VARCHAR(100) NOT NULL,
    partido VARCHAR(100),
    slug VARCHAR(100) UNIQUE, -- Para URLs amigables (ej: /candidato/juan-perez)
    foto_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 2. TABLA DE SESIONES (Contexto del Usuario)
-- =============================================
-- Una sesión agrupa todos los eventos de una visita. 
-- Aquí guardamos la "huella" técnica para no repetirla en cada click.
CREATE TABLE sesiones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Identificación Anónima
    ip_hash VARCHAR(64) NOT NULL, -- Hash de la IP para geolocalización aproximada sin guardar la IP real
    
    -- Fingerprint del Navegador
    -- COMPOSICIÓN DEL HASH: SHA256(User-Agent + Timezone + ScreenRes + Language)
    -- IMPORTANTE: No guardar los datos crudos de resolución/timezone para cumplir con privacidad.
    fingerprint_hash VARCHAR(64), 
    
    -- Metadatos del Dispositivo (Parsados del User-Agent)
    user_agent TEXT,            -- Se guarda para depuración, pero el análisis primario usa los campos desglosados
    device_type VARCHAR(20),    -- 'mobile', 'desktop', 'tablet'
    os VARCHAR(50),             -- 'Android', 'Windows', 'iOS'
    browser VARCHAR(50),        -- 'Chrome', 'Safari'
    
    -- Atribución (¿De dónde vienen?)
    referrer TEXT,              -- URL de donde vino el usuario
    utm_source VARCHAR(50),     -- Campaña: facebook, google, newsletter
    utm_medium VARCHAR(50),     -- Medio: cpc, banner, email
    utm_campaign VARCHAR(50),   -- Nombre de la campaña
    
    -- Geolocalización (Derivada de IP antes de hashear o procesada en backend)
    city VARCHAR(100),
    country VARCHAR(5),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_active_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para búsqueda rápida de sesiones
CREATE INDEX idx_sesiones_created ON sesiones(created_at);
CREATE INDEX idx_sesiones_fingerprint ON sesiones(fingerprint_hash);
CREATE INDEX idx_sesiones_ip_hash ON sesiones(ip_hash);

-- =============================================
-- 3. TABLA DE EVENTOS (El "Clickstream")
-- =============================================
-- Registra CADA acción que realiza el usuario en la página.
CREATE TABLE eventos (
    id BIGSERIAL PRIMARY KEY,
    session_id UUID REFERENCES sesiones(id) ON DELETE CASCADE, -- Si se borra la sesión, se borran sus eventos
    
    -- Tipos de eventos estandarizados:
    -- 'page_view'      : Carga de una página
    -- 'click'          : Click en un elemento
    -- 'scroll'         : Scroll profundo (25%, 50%, 100%)
    -- 'video_play'     : Reproducción de video
    -- 'compare'        : Uso del comparador
    -- 'search'         : Búsqueda interna
    event_type VARCHAR(50) NOT NULL, 
    
    -- Nombre específico del evento
    -- Ej: 'click_whatsapp_keiko', 'view_profile_urresti', 'scroll_home_50'
    event_name VARCHAR(100) NOT NULL,
    
    -- Contexto
    url_path VARCHAR(255),  -- En qué URL ocurrió (/candidatos, /versus)
    entity_id INT,          -- ID de la entidad relacionada (Id del candidato, Id de noticia)
    entity_type VARCHAR(20),-- 'candidato', 'partido', 'noticia'
    
    -- Datos extra en formato JSON para flexibilidad total
    -- Ej: { "scroll_depth": 85, "search_term": "seguridad", "prev_candidate": 4 }
    metadata JSONB,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para análisis de eventos
CREATE INDEX idx_eventos_session ON eventos(session_id);
CREATE INDEX idx_eventos_type_name ON eventos(event_type, event_name);
CREATE INDEX idx_eventos_created ON eventos(created_at DESC);

-- =============================================
-- 4. TABLA DE VOTOS (Simulacro)
-- =============================================
-- Separada de eventos para mayor seguridad y validación estricta
CREATE TABLE votos (
    id SERIAL PRIMARY KEY,
    candidato_id INT REFERENCES candidatos(id),
    session_id UUID REFERENCES sesiones(id),
    
    -- Redundancia de seguridad para auditoría rápida
    ip_hash VARCHAR(64) NOT NULL,
    fingerprint_hash VARCHAR(64) NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- REGLA DE NEGOCIO:
    -- Impedir múltiples votos desde la misma sesión a nivel de base de datos
    CONSTRAINT unique_vote_session UNIQUE (session_id)
);

-- Comentarios de documentación
COMMENT ON COLUMN sesiones.fingerprint_hash IS 'Hash SHA256 generado desde: User-Agent + Timezone + ScreenRes + Language';
COMMENT ON TABLE eventos IS 'Bitácora inmutable de acciones del usuario para análisis de comportamiento (Behavioral Analytics)';
