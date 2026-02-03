import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const VotingResults = ({ candidates }) => {
    // Simulating existing votes (mock data)
    const baseVotes = useMemo(() => {
        return {
            1: 1542, // Acuña
            2: 2105, // Keiko
            3: 890,  // López-Chau
            4: 1230, // Williams
            5: 750,  // Paz de la Barra
            6: 620,  // Sánchez
            7: 430,  // Molinelli
            8: 980,  // Belmont
            9: 310,  // Valderrama
            10: 450, // Belaúnde
            11: 120, // Grozo
            12: 1840 // Álvarez
        };
    }, []);

    const voteFromStorage = localStorage.getItem('peru_2026_vote');

    const results = useMemo(() => {
        const data = candidates.map(c => {
            let total = baseVotes[c.id] || 0;
            if (voteFromStorage && parseInt(voteFromStorage) === c.id) {
                total += 1;
            }
            return {
                ...c,
                totalVotes: total
            };
        });

        const grandTotal = data.reduce((acc, curr) => acc + curr.totalVotes, 0);

        return data
            .map(c => ({
                ...c,
                percentage: ((c.totalVotes / grandTotal) * 100).toFixed(1)
            }))
            .sort((a, b) => b.totalVotes - a.totalVotes);
    }, [candidates, baseVotes, voteFromStorage]);

    return (
        <section id="resultados" className="py-20 px-6 bg-white">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-16">
                    <span className="text-red-600 font-bold tracking-widest uppercase text-sm">Estado de la Opinión</span>
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-2 mb-4">Resultados en Tiempo Real</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                        Estos porcentajes reflejan la intención de voto acumulada en nuestro simulador digital.
                    </p>
                </div>

                <div className="space-y-8">
                    {results.map((candidate, index) => (
                        <div key={candidate.id} className="relative">
                            <div className="flex justify-between items-end mb-2 px-1">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-red-100 shadow-sm flex-shrink-0">
                                        <img src={candidate.image_url} alt={candidate.nombre} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold text-red-600 uppercase tracking-tight">{candidate.partido}</span>
                                        <h4 className="text-gray-900 font-bold leading-none">{candidate.nombre}</h4>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-2xl font-black text-gray-900">{candidate.percentage}%</span>
                                    <p className="text-[10px] text-gray-500 font-medium uppercase tracking-tighter">del total de votos</p>
                                </div>
                            </div>

                            <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden shadow-inner">
                                <motion.div
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${candidate.percentage}%` }}
                                    transition={{ duration: 1.5, ease: "easeOut", delay: index * 0.1 }}
                                    className={`h-full rounded-full ${index === 0 ? 'bg-gradient-to-r from-red-500 to-red-700' :
                                            index === 1 ? 'bg-gradient-to-r from-red-400 to-red-600' :
                                                index === 2 ? 'bg-gradient-to-r from-red-300 to-red-500' :
                                                    'bg-gray-400'
                                        } relative`}
                                >
                                    {index < 3 && (
                                        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] bg-[length:20px_20px] opacity-20 animate-[pulse_3s_infinite]" />
                                    )}
                                </motion.div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 p-6 bg-red-50 rounded-2xl border border-red-100 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-center md:text-left">
                        <h4 className="text-red-900 font-bold text-xl">¿Aún no has participado?</h4>
                        <p className="text-red-700">Tu opinión es fundamental para este ejercicio ciudadano.</p>
                    </div>
                    <a
                        href="#votar"
                        className="whitespace-nowrap bg-red-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-red-700 transition transform hover:scale-105 shadow-lg shadow-red-200"
                    >
                        Quiero votar ahora
                    </a>
                </div>
            </div>
        </section>
    );
};

export default VotingResults;
