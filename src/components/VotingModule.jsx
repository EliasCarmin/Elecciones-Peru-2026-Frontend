import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const VotingModule = ({ candidates, onVoteCompleted }) => {
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [hasVoted, setHasVoted] = useState(false);

    useEffect(() => {
        const vote = localStorage.getItem('peru_2026_vote');
        if (vote) {
            setHasVoted(true);
        }
    }, []);

    const handleVote = (candidateId) => {
        if (hasVoted) return;
        localStorage.setItem('peru_2026_vote', candidateId);
        setHasVoted(true);
        if (onVoteCompleted) onVoteCompleted(candidateId);
    };

    if (hasVoted) {
        return (
            <div id="votar" className="py-20 px-6 text-center bg-gray-50">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="p-10 bg-white rounded-3xl shadow-xl border border-red-100"
                    >
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">¡Gracias por participar!</h2>
                        <p className="text-lg text-gray-600 mb-8">
                            Tu voto ha sido registrado correctamente. Recuerda que solo se permite un voto por dispositivo para mantener la integridad del simulacro.
                        </p>
                        <a
                            href="#resultados"
                            className="inline-block bg-red-600 text-white px-8 py-3 rounded-full font-bold hover:bg-red-700 transition shadow-lg"
                        >
                            Ver Resultados Actuales
                        </a>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <section id="votar" className="py-20 px-6 bg-gray-50">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <span className="text-red-600 font-bold tracking-widest uppercase text-sm">Simulacro Electoral</span>
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-2 mb-4">Emite tu Voto</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                        Selecciona al candidato de tu preferencia en este simulacro virtual. Tu participación nos ayuda a proyectar el sentimiento ciudadano.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {candidates.map((candidate) => (
                        <motion.div
                            key={candidate.id}
                            whileHover={{ y: -5 }}
                            className={`relative overflow-hidden rounded-2xl bg-white shadow-md border-2 transition-all cursor-pointer ${selectedCandidate === candidate.id ? 'border-red-600 ring-2 ring-red-100' : 'border-transparent hover:border-red-200'
                                }`}
                            onClick={() => setSelectedCandidate(candidate.id)}
                        >
                            <div className="aspect-[3/4] overflow-hidden">
                                <img
                                    src={candidate.image_url}
                                    alt={candidate.nombre}
                                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                />
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                                    <h3 className="text-white font-bold text-lg leading-tight">{candidate.nombre}</h3>
                                    <p className="text-red-400 font-medium text-sm">{candidate.partido}</p>
                                </div>
                            </div>
                            <div className="p-4">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleVote(candidate.id);
                                    }}
                                    className={`w-full py-2.5 rounded-xl font-bold transition-all ${selectedCandidate === candidate.id
                                            ? 'bg-red-600 text-white shadow-md shadow-red-200'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    Votar por {candidate.nombre.split(' ')[0]}
                                </button>
                            </div>
                            {selectedCandidate === candidate.id && (
                                <div className="absolute top-3 right-3 bg-red-600 text-white p-1.5 rounded-full shadow-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default VotingModule;
