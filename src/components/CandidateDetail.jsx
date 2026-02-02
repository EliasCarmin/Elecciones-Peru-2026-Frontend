import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';

const CandidateDetail = ({ candidate, onClose }) => {
    const [imageError, setImageError] = useState(false);
    const [activeTab, setActiveTab] = useState('perfil');

    if (!candidate) return null;

    // Analytics: Track time on page
    useEffect(() => {
        const startTime = Date.now();

        return () => {
            const timeSpent = Date.now() - startTime;
            // Only track if spent more than 1 second to avoid accidental clicks
            if (timeSpent > 1000) {
                import('../services/analytics').then(({ analytics }) => {
                    analytics.trackEvent('view', 'view_candidate_detail_time', null, candidate.id, {
                        candidate_name: candidate.nombre,
                        duration_ms: timeSpent,
                        duration_sec: Math.round(timeSpent / 1000)
                    });
                });
            }
        };
    }, [candidate.id]); // Reset if candidate changes

    if (!candidate) return null;

    // Helper to get consistent data
    const getLegalInfo = () => {
        let procesadas = 0;
        let enProceso = 0;
        let acusacionesArr = [];
        let controversiasArr = [];

        if (candidate.procesos) {
            procesadas = candidate.procesos.denuncias_procesadas || 0;
            enProceso = candidate.procesos.denuncias_en_proceso || 0;
            acusacionesArr = candidate.procesos.acusaciones || [];
        }

        if (candidate.controversias) {
            if (!procesadas) procesadas = candidate.controversias.denuncias_procesadas || 0;
            if (!enProceso) enProceso = candidate.controversias.denuncias_en_proceso || 0;
            if (acusacionesArr.length === 0) acusacionesArr = candidate.controversias.acusaciones || [];
        }

        if (candidate.controversias_relevantes) {
            controversiasArr = candidate.controversias_relevantes;
        }

        return { procesadas, enProceso, acusacionesArr, controversiasArr };
    };

    const { procesadas, enProceso, acusacionesArr, controversiasArr } = getLegalInfo();

    const economicData = candidate.perfil_economico ? [
        { name: 'Ingresos', value: (candidate.perfil_economico.ingresos_anuales_soles || 0) / 1000000, label: 'Millones S/' },
        { name: 'Patrimonio', value: (candidate.perfil_economico.patrimonio_bienes_soles || 0) / 1000000, label: 'Millones S/' }
    ] : [];

    const tabs = [
        { id: 'perfil', label: '👤 Perfil', color: 'border-blue-500 text-blue-600' },
        { id: 'legal', label: '⚖️ Legal', color: 'border-peru-red text-peru-red' },
        { id: 'economia', label: '💰 Economía', color: 'border-yellow-500 text-yellow-600' },
        { id: 'positivo', label: '✨ Positivo', color: 'border-green-500 text-green-600' }
    ];

    return (
        <motion.div
            className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <div className="min-h-screen px-4 py-8 flex items-center justify-center">
                <motion.div
                    className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full overflow-hidden relative"
                    initial={{ scale: 0.9, y: 50 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 50 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Hero Header */}
                    <div className="relative h-72 md:h-80">
                        <div className="absolute inset-0 bg-gray-900">
                            {!imageError ? (
                                <img
                                    src={candidate.image_url || candidate.img}
                                    alt={candidate.nombre}
                                    className="w-full h-full object-cover opacity-60"
                                    onError={() => setImageError(true)}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-6xl">🇵🇪</div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col md:flex-row items-end gap-6">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="w-32 h-32 rounded-2xl border-4 border-white shadow-xl overflow-hidden bg-white flex-shrink-0"
                            >
                                <img
                                    src={candidate.image_url || candidate.img}
                                    className="w-full h-full object-cover"
                                    onError={(e) => e.target.style.display = 'none'}
                                />
                            </motion.div>
                            <div className="mb-2 text-white">
                                <h2 className="text-4xl md:text-5xl font-black mb-2">{candidate.nombre}</h2>
                                <p className="text-xl md:text-2xl font-light opacity-90">{candidate.partido}</p>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 bg-black/20 hover:bg-black/40 text-white p-3 rounded-full backdrop-blur-md transition-all group"
                        >
                            <svg className="w-6 h-6 group-hover:rotate-90 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Navigation */}
                    <div className="flex overflow-x-auto border-b border-gray-100 bg-white sticky top-0 z-20 px-6 pt-4">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-6 py-4 font-bold text-sm md:text-base transition-all border-b-4 whitespace-nowrap ${activeTab === tab.id ? tab.color : 'border-transparent text-gray-400 hover:text-gray-600'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="p-6 md:p-10 bg-gray-50 min-h-[400px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {activeTab === 'perfil' && (
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                                <h3 className="font-bold text-gray-900 text-lg mb-4">Datos Personales</h3>
                                                <dl className="grid grid-cols-1 gap-4">
                                                    <div>
                                                        <dt className="text-sm text-gray-500">Lugar de Nacimiento</dt>
                                                        <dd className="font-medium text-gray-900">{candidate.origen?.lugar_nacimiento || 'No especificado'}</dd>
                                                    </div>
                                                    <div>
                                                        <dt className="text-sm text-gray-500">Fecha de Nacimiento</dt>
                                                        <dd className="font-medium text-gray-900">{candidate.origen?.fecha_nacimiento || 'No especificado'}</dd>
                                                    </div>
                                                </dl>
                                            </div>
                                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                                <h3 className="font-bold text-gray-900 text-lg mb-4">Experiencia Política</h3>
                                                <ul className="space-y-3">
                                                    {candidate.candidaturas_presidenciales?.map((c, i) => (
                                                        <li key={i} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                                                            <span className="font-bold text-gray-700">{c.anio}</span>
                                                            <span className="text-sm text-gray-500">{c.resultado}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {/* Sources / Drive Section */}
                                            {candidate.fuentes && candidate.fuentes.length > 0 && (
                                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mt-6">
                                                    <h3 className="font-bold text-gray-900 text-lg mb-4">📚 Fuentes y Documentos</h3>
                                                    <div className="space-y-3">
                                                        {candidate.fuentes.map((fuente, idx) => (
                                                            <a
                                                                key={idx}
                                                                href={fuente.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                onClick={() => {
                                                                    import('../services/analytics').then(({ analytics }) => {
                                                                        analytics.trackEvent('click', 'open_source_drive', null, candidate.id, {
                                                                            candidate_name: candidate.nombre,
                                                                            source_title: fuente.titulo,
                                                                            url: fuente.url
                                                                        });
                                                                    });
                                                                }}
                                                                className="flex items-center gap-3 p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-peru-red hover:bg-red-50 transition-all group cursor-pointer"
                                                            >
                                                                <span className="text-2xl">📄</span>
                                                                <div className="flex-1">
                                                                    <p className="font-semibold text-gray-900 group-hover:text-peru-red transition-colors">
                                                                        {fuente.titulo}
                                                                    </p>
                                                                    <p className="text-xs text-gray-500">Clic para abrir documento</p>
                                                                </div>
                                                                <span className="text-gray-400 group-hover:text-peru-red">↗</span>
                                                            </a>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                            <h3 className="font-bold text-gray-900 text-lg mb-4">Cargos Principales</h3>
                                            <div className="space-y-4">
                                                {candidate.cargos_principales?.map((cargo, i) => (
                                                    <div key={i} className="flex gap-4 items-start">
                                                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                                                        <p className="text-gray-700 leading-relaxed">{cargo}</p>
                                                    </div>
                                                )) || <p className="text-gray-400 italic">No hay cargos registrados</p>}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'legal' && (
                                    <div className="space-y-8">
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="bg-red-50 p-6 rounded-2xl text-center border border-red-100">
                                                <p className="text-4xl font-black text-red-600 mb-1">{procesadas}</p>
                                                <p className="text-xs uppercase font-bold text-red-400 tracking-wider">Procesadas</p>
                                            </div>
                                            <div className="bg-orange-50 p-6 rounded-2xl text-center border border-orange-100">
                                                <p className="text-4xl font-black text-orange-600 mb-1">{enProceso}</p>
                                                <p className="text-xs uppercase font-bold text-orange-400 tracking-wider">En Proceso</p>
                                            </div>
                                            <div className="bg-gray-100 p-6 rounded-2xl text-center border border-gray-200">
                                                <p className="text-4xl font-black text-gray-600 mb-1">{acusacionesArr.length}</p>
                                                <p className="text-xs uppercase font-bold text-gray-400 tracking-wider">Acusaciones</p>
                                            </div>
                                        </div>

                                        {(acusacionesArr.length > 0 || controversiasArr.length > 0) ? (
                                            <div className="grid md:grid-cols-2 gap-8">
                                                {acusacionesArr.length > 0 && (
                                                    <div>
                                                        <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">⚠️ Acusaciones</h4>
                                                        <ul className="space-y-2">
                                                            {acusacionesArr.map((item, i) => (
                                                                <li key={i} className="bg-white p-4 rounded-xl border-l-4 border-red-500 shadow-sm text-sm text-gray-700">
                                                                    {item}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                                {controversiasArr.length > 0 && (
                                                    <div>
                                                        <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">🚨 Controversias</h4>
                                                        <ul className="space-y-2">
                                                            {controversiasArr.map((item, i) => (
                                                                <li key={i} className="bg-white p-4 rounded-xl border-l-4 border-orange-500 shadow-sm text-sm text-gray-700">
                                                                    {item}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
                                                <span className="text-4xl mb-2 block">✅</span>
                                                <p className="text-gray-500">No se registran acusaciones ni controversias mayores.</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'economia' && (
                                    <div className="grid md:grid-cols-2 gap-8 items-center">
                                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
                                            <h3 className="font-bold text-gray-900 mb-6 text-center">Resumen Financiero (Millones S/)</h3>
                                            <div className="h-64">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart data={economicData}>
                                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                                        <YAxis axisLine={false} tickLine={false} />
                                                        <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                                                        <Bar dataKey="value" fill="#d97706" radius={[4, 4, 0, 0]} barSize={50} />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="bg-blue-50 p-6 rounded-2xl">
                                                <p className="text-sm text-blue-600 font-bold uppercase mb-1">Total Bienes Inmuebles</p>
                                                <p className="text-3xl font-black text-gray-900">{candidate.perfil_economico?.inmuebles || 0}</p>
                                            </div>
                                            <div className="bg-indigo-50 p-6 rounded-2xl">
                                                <p className="text-sm text-indigo-600 font-bold uppercase mb-1">Total Vehículos</p>
                                                <p className="text-3xl font-black text-gray-900">{candidate.perfil_economico?.vehiculos || 0}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'positivo' && (
                                    <div className="space-y-6">
                                        {candidate.aspectos_positivos?.map((aspecto, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ x: -20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ delay: i * 0.1 }}
                                                className="flex gap-4 p-4 bg-green-50 rounded-2xl border border-green-100 items-start"
                                            >
                                                <div className="w-8 h-8 rounded-full bg-green-200 flex items-center justify-center text-green-700 font-bold flex-shrink-0">✓</div>
                                                <p className="text-gray-800 text-lg">{aspecto}</p>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default CandidateDetail;
