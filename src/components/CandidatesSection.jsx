import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CandidateCard from './CandidateCard';
import CandidateDetail from './CandidateDetail';

const CandidatesSection = ({ candidates }) => {
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [visibleCount, setVisibleCount] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');

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

                <div className="mb-12 max-w-xl mx-auto">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Buscar candidato por nombre o partido..."
                            className="w-full px-6 py-4 rounded-full border-2 border-gray-200 focus:border-peru-red focus:outline-none text-lg shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <span className="absolute right-6 top-1/2 transform -translate-y-1/2 text-2xl">
                            🔍
                        </span>
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
