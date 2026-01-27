import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const VersusSection = ({ candidates }) => {
    // State for selected candidates (default to first 3)
    const [selectedIds, setSelectedIds] = useState(candidates.slice(0, 3).map(c => c.id));

    if (!candidates || candidates.length === 0) return null;

    const selectedCandidates = useMemo(() =>
        candidates.filter(c => selectedIds.includes(c.id)),
        [selectedIds, candidates]);

    const [searchQuery, setSearchQuery] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const filteredCandidates = useMemo(() => {
        return candidates.filter(c =>
            c.nombre.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !selectedIds.includes(c.id)
        );
    }, [candidates, searchQuery, selectedIds]);

    const addCandidate = (id) => {
        if (selectedIds.length >= 3) return;
        setSelectedIds(prev => [...prev, id]);
        setSearchQuery('');
        setIsDropdownOpen(false);
    };

    const removeCandidate = (id) => {
        if (selectedIds.length <= 1) return;
        setSelectedIds(prev => prev.filter(item => item !== id));
    };

    // Prepare comparison data for controversial metrics
    const comparisonData = [
        {
            metric: 'Denuncias Procesadas',
            ...selectedCandidates.reduce((acc, candidate) => {
                const name = candidate.nombre ? candidate.nombre.split(' ')[0] : `Candidato ${candidate.id}`;
                acc[name] = candidate.procesos?.denuncias_procesadas || 0;
                return acc;
            }, {})
        },
        {
            metric: 'Denuncias en Proceso',
            ...selectedCandidates.reduce((acc, candidate) => {
                const name = candidate.nombre ? candidate.nombre.split(' ')[0] : `Candidato ${candidate.id}`;
                acc[name] = candidate.procesos?.denuncias_en_proceso || 0;
                return acc;
            }, {})
        },
        {
            metric: 'Total Acusaciones',
            ...selectedCandidates.reduce((acc, candidate) => {
                const name = candidate.nombre ? candidate.nombre.split(' ')[0] : `Candidato ${candidate.id}`;
                acc[name] = candidate.procesos?.acusaciones?.length || 0;
                return acc;
            }, {})
        }
    ];

    const colors = ['#D91023', '#FF4757', '#FF6B81'];

    return (
        <section className="py-12 md:py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-hidden">
            <div className="container mx-auto px-4">
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                        Comparación de <span className="text-peru-red">Candidatos</span>
                    </h2>
                    <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                        Selecciona hasta 3 candidatos para comparar sus métricas y trayectoria
                    </p>
                </motion.div>

                {/* Scalable Candidate Selector */}
                <div className="max-w-2xl mx-auto mb-16 px-4 relative">
                    {/* Selected Chips */}
                    <div className="flex flex-wrap gap-2 mb-4 justify-center">
                        <AnimatePresence>
                            {selectedCandidates.map((candidate, index) => (
                                <motion.div
                                    key={candidate.id}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="flex items-center gap-2 px-4 py-2 bg-peru-red rounded-full text-sm font-bold shadow-lg"
                                >
                                    <div
                                        className="w-2 h-2 rounded-full bg-white"
                                    ></div>
                                    {candidate.nombre.split(' ')[0]}
                                    <button
                                        onClick={() => removeCandidate(candidate.id)}
                                        className="hover:text-red-200 transition-colors ml-1"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Search Bar */}
                    <div className="relative">
                        <div className="relative group">
                            <input
                                type="text"
                                placeholder={selectedIds.length >= 3 ? "Límite alcanzado (máx 3)" : "Buscar candidato..."}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setIsDropdownOpen(true)}
                                disabled={selectedIds.length >= 3}
                                className={`w-full bg-white/10 border-2 border-white/20 rounded-2xl px-6 py-4 outline-none focus:border-peru-red/50 transition-all text-lg ${selectedIds.length >= 3 ? 'opacity-50 cursor-not-allowed' : 'group-hover:bg-white/15'
                                    }`}
                            />
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>

                        {/* Dropdown */}
                        <AnimatePresence>
                            {isDropdownOpen && searchQuery && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute z-50 w-full mt-2 bg-gray-800 border-2 border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto"
                                >
                                    {filteredCandidates.length > 0 ? (
                                        filteredCandidates.map(candidate => (
                                            <button
                                                key={candidate.id}
                                                onClick={() => addCandidate(candidate.id)}
                                                className="w-full text-left px-6 py-4 hover:bg-white/10 transition-colors flex items-center justify-between group"
                                            >
                                                <div>
                                                    <p className="font-bold text-white group-hover:text-peru-red transition-colors">{candidate.nombre}</p>
                                                    <p className="text-sm text-gray-400">{candidate.partido}</p>
                                                </div>
                                                <svg className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity text-peru-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                </svg>
                                            </button>
                                        ))
                                    ) : (
                                        <div className="px-6 py-8 text-center text-gray-500 italic">
                                            No se encontraron candidatos
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Click away to close dropdown */}
                    {isDropdownOpen && (
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsDropdownOpen(false)}
                        ></div>
                    )}
                </div>

                {/* Comparison UI */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedIds.join(',')}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4 }}
                    >
                        {/* Main Comparison Chart */}
                        <div className="bg-white rounded-2xl p-6 md:p-8 mb-8 shadow-2xl">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                                Análisis Comparativo de Procesos Legales
                            </h3>
                            <div className="h-[400px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={comparisonData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="metric" stroke="#374151" />
                                        <YAxis stroke="#374151" />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#fff', border: '2px solid #D91023', color: '#000' }}
                                            itemStyle={{ color: '#000' }}
                                        />
                                        <Legend />
                                        {selectedCandidates.map((candidate, index) => {
                                            const name = candidate.nombre ? candidate.nombre.split(' ')[0] : `Candidato ${candidate.id}`;
                                            return (
                                                <Bar
                                                    key={candidate.id}
                                                    dataKey={name}
                                                    fill={colors[index % colors.length]}
                                                    radius={[8, 8, 0, 0]}
                                                />
                                            );
                                        })}
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Individual Comparison Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {selectedCandidates.map((candidate, index) => {
                                const name = candidate.nombre ? candidate.nombre.split(' ')[0] : `Candidato ${candidate.id}`;
                                return (
                                    <motion.div
                                        key={candidate.id}
                                        className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border-2 border-white/10 relative overflow-hidden group"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <div
                                            className="absolute top-0 right-0 w-32 h-32 bg-peru-red opacity-10 blur-3xl -mr-16 -mt-16 group-hover:opacity-20 transition-opacity"
                                        ></div>

                                        <div className="flex items-center gap-3 mb-6 relative z-10">
                                            <div
                                                className="w-4 h-4 rounded-full"
                                                style={{ backgroundColor: colors[index % colors.length] }}
                                            ></div>
                                            <h3 className="text-2xl font-bold">{name}</h3>
                                        </div>

                                        <div className="space-y-4 relative z-10">
                                            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                                <p className="text-sm text-gray-400 mb-1">Denuncias Procesadas</p>
                                                <p className="text-4xl font-black text-peru-red">
                                                    {candidate.procesos?.denuncias_procesadas || 0}
                                                </p>
                                            </div>

                                            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                                <p className="text-sm text-gray-400 mb-1">En Proceso</p>
                                                <p className="text-4xl font-black text-peru-red">
                                                    {candidate.procesos?.denuncias_en_proceso || 0}
                                                </p>
                                            </div>

                                            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                                <p className="text-sm text-gray-400 mb-1">Acusaciones</p>
                                                <p className="text-4xl font-black text-peru-red">
                                                    {candidate.procesos?.acusaciones?.length || 0}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Global Summary */}
                <motion.div
                    className="mt-16 bg-gradient-to-r from-peru-red/10 to-transparent backdrop-blur-md rounded-2xl p-8 border border-peru-red/20"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <p className="text-5xl font-black text-peru-red">
                                {candidates.reduce((sum, c) => sum + (c.procesos?.denuncias_procesadas || 0), 0)}
                            </p>
                            <p className="text-sm text-gray-400 mt-2 uppercase tracking-widest font-bold">Total Denuncias</p>
                        </div>
                        <div className="text-center">
                            <p className="text-5xl font-black text-peru-red">
                                {candidates.reduce((sum, c) => sum + (c.procesos?.denuncias_en_proceso || 0), 0)}
                            </p>
                            <p className="text-sm text-gray-400 mt-2 uppercase tracking-widest font-bold">En Proceso</p>
                        </div>
                        <div className="text-center">
                            <p className="text-5xl font-black text-peru-red">
                                {candidates.reduce((sum, c) => sum + (c.procesos?.acusaciones?.length || 0), 0)}
                            </p>
                            <p className="text-sm text-gray-400 mt-2 uppercase tracking-widest font-bold">Acusaciones</p>
                        </div>
                        <div className="text-center">
                            <p className="text-5xl font-black text-white">
                                {candidates.length}
                            </p>
                            <p className="text-sm text-gray-400 mt-2 uppercase tracking-widest font-bold">Candidatos</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default VersusSection;
