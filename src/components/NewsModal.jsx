import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { analytics } from '../services/analytics';

const NewsModal = ({ isOpen, onClose }) => {
    useEffect(() => {
        if (isOpen) {
            analytics.trackEvent('view', 'open_news_modal', null, null, { title: 'Década de Cambios en el Poder Ejecutivo' });
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.9, y: 20, opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="bg-[#fcf8f1] max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl border-t-8 border-peru-red relative"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header Aesthetic */}
                    <div className="p-6 border-b-2 border-dashed border-gray-300 text-center">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Edición Especial</span>
                            <span className="text-xs font-bold uppercase tracking-widest text-gray-500">{new Date().toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-serif font-black text-gray-900 leading-tight mb-2">
                            Década de Cambios en el Poder Ejecutivo Peruano (2016-2026)
                        </h2>
                        <div className="w-24 h-1 bg-peru-red mx-auto mt-4"></div>
                    </div>

                    {/* Content */}
                    <div className="p-8 font-serif leading-relaxed text-gray-800 space-y-4">
                        <p className="text-sm font-bold text-peru-red mb-2 uppercase tracking-wide">LIMA, Perú — Reporte Especial</p>

                        <p className="text-lg first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:text-peru-red">
                            En la última década, el Perú ha vivido una de sus etapas más turbulentas en la historia política moderna. Desde julio de 2016 hasta febrero de 2026, al menos 8 personas han ejercido la Presidencia de la República (contando mandatarios interinos tras vacancias y destituciones), reflejo de una profunda inestabilidad institucional.
                        </p>

                        <p>
                            Entre estos líderes estuvieron Pedro Pablo Kuczynski, Martín Vizcarra, Manuel Merino, Francisco Sagasti, Pedro Castillo, Dina Boluarte, José Jerí y José María Balcázar — muchos de ellos ocupando el cargo por cortos periodos debido a renuncias, vacancias o censuras del Congreso.
                        </p>

                        <p className="bg-gray-100 p-4 border-l-4 border-gray-400 italic">
                            Esta volatilidad también se trasladó al Gabinete Ministerial, con una alta rotación de ministros y equipos ministeriales. Por ejemplo, solo entre 2021 y 2025 se registraron alrededor de 169 nombramientos de ministros ante la constante reorganización de carteras y reemplazos de titulares.
                        </p>

                        <p>
                            Este dinámico escenario político ha marcado la gestión del Ejecutivo peruano, donde el recambio frecuente de altos cargos refleja desafíos persistentes de gobernabilidad y coordinación institucional.
                        </p>

                        {/* Bibliography */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Bibliografía (APA)</h3>
                            <ul className="text-[10px] space-y-2 text-gray-500 list-disc pl-4">
                                <li>El Popular. (2026, 17 de febrero). ¿Cuántos presidentes ha tenido el Perú en los últimos 10 años?</li>
                                <li>Jujuy Times. (2026). Perú y la crisis institucional: ocho presidentes en una década.</li>
                                <li>El Comercio. (2025, 23 de octubre). La herencia de Castillo y Boluarte: Perú registra casi 170 ministros en cuatro años.</li>
                                <li>AP News. (2026, Febrero). José María Balcázar becomes Peru’s eighth president in a decade.</li>
                            </ul>
                        </div>
                    </div>

                    {/* Footer / Close Button */}
                    <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-center">
                        <button
                            onClick={onClose}
                            className="bg-gray-900 text-white px-8 py-2 rounded font-bold hover:bg-peru-red transition-colors duration-300 uppercase tracking-widest text-xs"
                        >
                            Continuar a la plataforma
                        </button>
                    </div>

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 text-2xl font-bold"
                    >
                        ×
                    </button>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default NewsModal;
