import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const VersusSection = ({ candidates }) => {
    // Start empty
    const [selectedIds, setSelectedIds] = useState([]);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const selectedCandidates = useMemo(() => {
        // Map ids to full objects, ensuring order is maintained or just pushing found ones
        return selectedIds.map(id => candidates.find(c => c.id === id)).filter(Boolean);
    }, [selectedIds, candidates]);

    const filteredCandidates = useMemo(() => {
        return candidates.filter(c =>
            (!searchTerm || c.nombre.toLowerCase().includes(searchTerm.toLowerCase())) &&
            !selectedIds.includes(c.id)
        );
    }, [candidates, searchTerm, selectedIds]);

    const handleAddSlot = () => {
        setSearchTerm('');
        setIsSearchOpen(true);
    };

    const handleSelectCandidate = (id) => {
        if (selectedIds.length < 3) {
            const newSelectedIds = [...selectedIds, id];
            setSelectedIds(newSelectedIds);

            // Analytics: Track candidate added to versus
            const candidate = candidates.find(c => c.id === id);
            if (candidate) {
                // Construct state: [Name1, Name2, null]
                const versusState = newSelectedIds.map(sid => {
                    const c = candidates.find(cand => cand.id === sid);
                    return c ? c.nombre : null;
                });
                // Pad with nulls
                while (versusState.length < 3) versusState.push(null);

                import('../services/analytics').then(({ analytics }) => {
                    analytics.trackEvent('compare', 'add_to_versus', null, candidate.id, {
                        candidate_name: candidate.nombre,
                        versus_state: versusState
                    });
                });
            }
        }
        setIsSearchOpen(false);
        setSearchTerm('');
    };

    const handleRemoveCandidate = (id) => {
        setSelectedIds(prev => prev.filter(currId => currId !== id));
    };

    // Helper data extraction (reused logic)
    const getLegalInfo = (candidate) => {
        let procesadas = 0;
        let enProceso = 0;
        let acusacionesArr = [];

        if (candidate.procesos) {
            procesadas = candidate.procesos.denuncias_procesadas || 0;
            enProceso = candidate.procesos.denuncias_en_proceso || 0;
            acusacionesArr = candidate.procesos.acusaciones || [];
        } else if (candidate.controversias) {
            procesadas = candidate.controversias.denuncias_procesadas || 0;
            enProceso = candidate.controversias.denuncias_en_proceso || 0;
            acusacionesArr = candidate.controversias.acusaciones || [];
        }
        return { procesadas, enProceso, countAcusaciones: acusacionesArr.length };
    };

    const getCargos = (candidate) => {
        if (candidate.cargos_principales?.length > 0) return candidate.cargos_principales[0];
        if (candidate.trayectoria_politica?.cargos_publicos?.length > 0) {
            const c = candidate.trayectoria_politica.cargos_publicos[0];
            return typeof c === 'string' ? c : `${c.cargo} (${c.periodo})`;
        }
        return "Sin información";
    };

    // Prepare chart data
    const chartData = [
        { name: 'Procesadas', ...selectedCandidates.reduce((acc, c) => ({ ...acc, [c.nombre.split(' ')[0]]: getLegalInfo(c).procesadas }), {}) },
        { name: 'En Proceso', ...selectedCandidates.reduce((acc, c) => ({ ...acc, [c.nombre.split(' ')[0]]: getLegalInfo(c).enProceso }), {}) },
    ];

    const colors = ['#e11d48', '#d97706', '#2563eb']; // Red, Amber, Blueish

    return (
        <section className="py-12 md:py-20 bg-gray-900 text-white min-h-screen">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">
                        Versus de <span className="text-peru-red">Candidatos</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Selecciona hasta 3 candidatos para comparar su trayectoria legal y política.
                    </p>
                </div>

                {/* SLOTS SELECTION AREA */}
                <div className="flex flex-wrap justify-center gap-4 mb-16 relative">
                    {/* Visual Cue for first usage */}
                    {selectedCandidates.length === 0 && (
                        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 md:translate-x-20 md:-top-10 z-10 pointer-events-none animate-bounce">
                            <div className="bg-white text-gray-900 px-4 py-2 rounded-full font-bold shadow-lg flex items-center gap-2">
                                <span>👆</span> ¡Comienza agregando un candidato!
                            </div>
                            <div className="w-0 h-0 border-l-[10px] border-l-transparent border-t-[10px] border-t-white border-r-[10px] border-r-transparent mx-auto"></div>
                        </div>
                    )}

                    {/* Render existing slots */}
                    {selectedCandidates.map((candidate) => (
                        <motion.div
                            key={candidate.id}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="relative w-32 md:w-40 flex flex-col items-center group"
                        >
                            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-gray-700 group-hover:border-peru-red transition-colors shadow-lg bg-gray-800">
                                <img
                                    src={candidate.image_url || candidate.img}
                                    alt={candidate.nombre}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <p className="mt-2 text-sm font-bold text-center leading-tight">{candidate.nombre.split(' ')[0]} {candidate.nombre.split(' ')[1]}</p>
                            <button
                                onClick={() => handleRemoveCandidate(candidate.id)}
                                className="absolute -top-1 -right-1 bg-red-600 rounded-full p-1 shadow-md hover:bg-red-700 transition-colors"
                            >
                                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </motion.div>
                    ))}

                    {/* Empty Slots */}
                    {Array.from({ length: 3 - selectedCandidates.length }).map((_, idx) => (
                        <div key={`empty-${idx}`} className="w-32 md:w-40 flex flex-col items-center justify-center">
                            <button
                                onClick={handleAddSlot}
                                className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-dashed border-gray-700 flex items-center justify-center hover:border-gray-500 hover:bg-gray-800 transition-all group"
                            >
                                <span className="text-4xl text-gray-700 group-hover:text-gray-500">+</span>
                            </button>
                            <p className="mt-2 text-sm text-gray-500 font-medium">Agregar Candidato</p>
                        </div>
                    ))}
                </div>

                {/* SEARCH MODAL */}
                <AnimatePresence>
                    {isSearchOpen && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                            onClick={() => setIsSearchOpen(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                                className="bg-gray-800 w-full max-w-lg rounded-2xl border border-gray-700 shadow-2xl overflow-hidden"
                                onClick={e => e.stopPropagation()}
                            >
                                <div className="p-6 border-b border-gray-700">
                                    <h3 className="text-xl font-bold text-white mb-4">Seleccionar Candidato</h3>
                                    <input
                                        autoFocus
                                        type="text"
                                        placeholder="Buscar..."
                                        className="w-full bg-gray-900 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-peru-red"
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <div className="max-h-80 overflow-y-auto">
                                    {filteredCandidates.map(c => (
                                        <button
                                            key={c.id}
                                            className="w-full text-left px-6 py-4 hover:bg-gray-700 flex items-center gap-4 transition-colors border-b border-gray-700/5 last:border-0"
                                            onClick={() => handleSelectCandidate(c.id)}
                                        >
                                            <div className="w-10 h-10 rounded-full bg-gray-600 overflow-hidden">
                                                <img src={c.image_url || c.img} className="w-full h-full object-cover" alt="" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-white">{c.nombre}</p>
                                                <p className="text-xs text-gray-400">{c.partido}</p>
                                            </div>
                                        </button>
                                    ))}
                                    {searchTerm && filteredCandidates.length === 0 && (
                                        <div className="p-8 text-center text-gray-500">No se encontraron resultados</div>
                                    )}
                                </div>
                                <div className="p-4 bg-gray-900 border-t border-gray-700 flex justify-end">
                                    <button onClick={() => setIsSearchOpen(false)} className="text-gray-400 hover:text-white font-medium">Cancelar</button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* COMPARISON MATRIX & CHARTS */}
                {selectedCandidates.length > 0 && (
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* CHART SECTION (Left on large screens) */}
                        <div className="lg:col-span-1 bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
                            <h3 className="text-xl font-bold mb-6 text-center text-gray-200">Resumen Legal</h3>
                            <div className="h-64 w-full">
                                <ResponsiveContainer>
                                    <BarChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                        <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                                        <YAxis stroke="#9ca3af" fontSize={12} />
                                        <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }} cursor={{ fill: '#374151', opacity: 0.2 }} />
                                        {selectedCandidates.map((c, i) => (
                                            <Bar key={c.id} dataKey={c.nombre.split(' ')[0]} fill={colors[i % colors.length]} radius={[4, 4, 0, 0]} />
                                        ))}
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* MATRIX SECTION */}
                        <div className="lg:col-span-2 bg-gray-800/50 rounded-2xl border border-gray-700 overflow-hidden">
                            {/* Scroll container for mobile */}
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[600px]">
                                    <thead>
                                        <tr className="bg-gray-900/50 border-b border-gray-700">
                                            <th className="p-4 text-left w-1/4 text-gray-400 font-medium text-sm uppercase tracking-wider">Métrica</th>
                                            {selectedCandidates.map(c => (
                                                <th key={c.id} className="p-4 text-center w-1/4">
                                                    <span className="text-white font-bold block">{c.nombre.split(' ')[0]}</span>
                                                </th>
                                            ))}
                                            {/* Fill empty columns if less than 3 */}
                                            {Array.from({ length: 3 - selectedCandidates.length }).map((_, i) => <th key={i} className="p-4 w-1/4"></th>)}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700">
                                        <tr>
                                            <td className="p-4 text-gray-300 font-medium">Partido Político</td>
                                            {selectedCandidates.map(c => (
                                                <td key={c.id} className="p-4 text-center text-sm text-gray-400">{c.partido}</td>
                                            ))}
                                            {Array.from({ length: 3 - selectedCandidates.length }).map((_, i) => <td key={i}></td>)}
                                        </tr>
                                        <tr>
                                            <td className="p-4 text-gray-300 font-medium">Cargo Principal</td>
                                            {selectedCandidates.map(c => (
                                                <td key={c.id} className="p-4 text-center text-sm text-gray-400">{getCargos(c)}</td>
                                            ))}
                                            {Array.from({ length: 3 - selectedCandidates.length }).map((_, i) => <td key={i}></td>)}
                                        </tr>
                                        <tr>
                                            <td className="p-4 text-gray-300 font-medium flex items-center gap-2">
                                                ⚖️ Denuncias Procesadas
                                            </td>
                                            {selectedCandidates.map(c => {
                                                const { procesadas } = getLegalInfo(c);
                                                return (
                                                    <td key={c.id} className="p-4 text-center">
                                                        <span className={`text-xl font-bold ${procesadas > 0 ? 'text-amber-500' : 'text-green-500'}`}>
                                                            {procesadas}
                                                        </span>
                                                    </td>
                                                )
                                            })}
                                            {Array.from({ length: 3 - selectedCandidates.length }).map((_, i) => <td key={i}></td>)}
                                        </tr>
                                        <tr>
                                            <td className="p-4 text-gray-300 font-medium flex items-center gap-2">
                                                ⚠️ En Proceso
                                            </td>
                                            {selectedCandidates.map(c => {
                                                const { enProceso } = getLegalInfo(c);
                                                return (
                                                    <td key={c.id} className="p-4 text-center">
                                                        <span className={`text-xl font-bold ${enProceso > 0 ? 'text-orange-500' : 'text-green-500'}`}>
                                                            {enProceso}
                                                        </span>
                                                    </td>
                                                )
                                            })}
                                            {Array.from({ length: 3 - selectedCandidates.length }).map((_, i) => <td key={i}></td>)}
                                        </tr>
                                        <tr>
                                            <td className="p-4 text-gray-300 font-medium flex items-center gap-2">
                                                📋 Acusaciones
                                            </td>
                                            {selectedCandidates.map(c => {
                                                const { countAcusaciones } = getLegalInfo(c);
                                                return (
                                                    <td key={c.id} className="p-4 text-center">
                                                        <span className={`text-lg font-bold text-gray-200`}>
                                                            {countAcusaciones}
                                                        </span>
                                                    </td>
                                                )
                                            })}
                                            {Array.from({ length: 3 - selectedCandidates.length }).map((_, i) => <td key={i}></td>)}
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default VersusSection;
