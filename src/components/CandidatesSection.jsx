import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CandidateCard from './CandidateCard';
import CandidateDetail from './CandidateDetail';

const CandidatesSection = ({ candidates }) => {
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [visibleCount, setVisibleCount] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');

    const [showDropdown, setShowDropdown] = useState(false);
    const searchRef = useRef(null);

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Analytics: Track search term with debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchTerm.length > 2) {
                import('../services/analytics').then(({ analytics }) => {
                    analytics.trackEvent('search', 'user_search', null, null, { term: searchTerm });
                });
            }
        }, 1500); // 1.5s debounce

        return () => clearTimeout(timer);
    }, [searchTerm]);

    const handleSelectCandidate = (candidate) => {
        setSelectedCandidate(candidate);

        // Analytics: Track search result selection
        import('../services/analytics').then(({ analytics }) => {
            analytics.trackEvent('click', 'select_search_result', null, candidate.id, {
                candidate_name: candidate.nombre,
                term_used: searchTerm
            });
        });

        setSearchTerm('');
        setShowDropdown(false);
    };

    const filteredCandidates = candidates.filter(candidate => {
        const term = searchTerm.toLowerCase();
        return (
            candidate.nombre.toLowerCase().includes(term) ||
            candidate.partido.toLowerCase().includes(term)
        );
    });

    const visibleCandidates = filteredCandidates.slice(0, visibleCount);

    return (
        <section className="py-12 md:py-20 bg-gray-50">
            <div className="container mx-auto px-4">
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                        Los <span className="text-peru-red">Candidatos</span>
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Conoce en detalle a cada uno de los candidatos presidenciales
                    </p>
                </motion.div>

                <div className="mb-12 max-w-xl mx-auto relative z-30" ref={searchRef}>
                    <div className="relative group">
                        <input
                            type="text"
                            placeholder="Buscar candidato por nombre o partido..."
                            className="w-full px-6 py-4 rounded-full border-2 border-gray-200 focus:border-peru-red focus:outline-none text-lg shadow-sm transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onFocus={() => setShowDropdown(true)}
                            onClick={() => setShowDropdown(true)}
                        />
                        <span className="absolute right-6 top-1/2 transform -translate-y-1/2 text-2xl text-gray-400">
                            🔍
                        </span>

                        {/* Dropdown Autocomplete */}
                        <AnimatePresence>
                            {showDropdown && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden max-h-80 overflow-y-auto"
                                >
                                    {filteredCandidates.slice(0, 10).map(candidate => (
                                        <button
                                            key={candidate.id}
                                            onClick={() => handleSelectCandidate(candidate)}
                                            className="w-full text-left px-6 py-3 hover:bg-red-50 transition-colors flex items-center gap-3 border-b border-gray-50 last:border-0"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                                                <img
                                                    src={candidate.image_url || candidate.img}
                                                    alt={candidate.nombre}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-800">{candidate.nombre}</p>
                                                <p className="text-xs text-gray-500">{candidate.partido}</p>
                                            </div>
                                        </button>
                                    ))}
                                    {filteredCandidates.length === 0 && (
                                        <div className="p-4 text-center text-gray-500 italic">
                                            No se encontraron resultados
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 md:gap-8 justify-center">
                    {visibleCandidates.map((candidate, index) => (
                        <motion.div
                            key={candidate.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <CandidateCard
                                candidate={candidate}
                                onClick={() => setSelectedCandidate(candidate)}
                            />
                        </motion.div>
                    ))}
                </div>

                {visibleCount < filteredCandidates.length && (
                    <div className="text-center mt-12 px-4 sm:px-0">
                        <button
                            onClick={() => setVisibleCount(prev => prev + 5)}
                            className="w-full sm:w-auto bg-white border-2 border-peru-red text-peru-red hover:bg-peru-red hover:text-white px-8 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105 shadow-md"
                        >
                            Ver más candidatos ({Math.min(5, filteredCandidates.length - visibleCount)} más)
                        </button>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {selectedCandidate && (
                    <CandidateDetail
                        candidate={selectedCandidate}
                        onClose={() => setSelectedCandidate(null)}
                    />
                )}
            </AnimatePresence>
        </section>
    );
};

export default CandidatesSection;
