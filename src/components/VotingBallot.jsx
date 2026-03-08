import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const VotingBallot = ({ candidates, onVoteCompleted }) => {
    const [selectedId, setSelectedId] = useState(null);
    const [hasVoted, setHasVoted] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [preferences, setPreferences] = useState({}); // { candidateId: { sen: ['', ''], con: ['', ''] } }

    useEffect(() => {
        const vote = localStorage.getItem('peru_2026_vote');
        if (vote) {
            setHasVoted(true);
            setSelectedId(parseInt(vote));
        }
    }, []);

    const handleSelect = (candidateId) => {
        if (hasVoted) return;
        setSelectedId(prev => prev === candidateId ? null : candidateId);
    };

    const handlePreferenceChange = (candidateId, type, index, value) => {
        if (hasVoted) return;
        // Only allow numbers
        const cleanValue = value.replace(/[^0-9]/g, '');
        setPreferences(prev => ({
            ...prev,
            [candidateId]: {
                ...prev[candidateId] || { sen: ['', ''], con: ['', ''] },
                [type]: (prev[candidateId]?.[type] || ['', '']).map((v, i) => i === index ? cleanValue : v)
            }
        }));
    };

    const handleConfirmVote = () => {
        if (!selectedId || hasVoted) return;
        localStorage.setItem('peru_2026_vote', selectedId);
        setHasVoted(true);
        setShowConfirm(false);
        if (onVoteCompleted) onVoteCompleted(selectedId);
        import('../services/analytics').then(({ analytics }) => {
            analytics.trackEvent('vote', 'cast_vote', null, selectedId);
        });
    };

    // ---- Voted State ----
    if (hasVoted) {
        const votedCandidate = candidates.find(c => c.id === selectedId);
        return (
            <div className="py-10 flex justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-lg w-full bg-white rounded-3xl shadow-2xl border border-green-100 p-10 text-center"
                >
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">¡Voto Emitido!</h2>
                    {votedCandidate && (
                        <p className="text-gray-500 mb-4">Votaste por <span className="font-bold text-gray-800">{votedCandidate.nombre}</span></p>
                    )}
                    <p className="text-gray-500 text-sm">Tu participación ha sido registrada. Solo se permite un voto por dispositivo.</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="py-4">
            {/* BALLOT */}
            <div className="overflow-x-auto rounded-2xl shadow-2xl border border-gray-300">
                <div className="min-w-[950px] bg-white font-sans">

                    {/* BALLOT HEADER */}
                    <div className="border-b-4 border-gray-900 flex items-center justify-between px-6 py-3 bg-white">
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Escudo_de_armas_del_Per%C3%BA.svg/200px-Escudo_de_armas_del_Per%C3%BA.svg.png"
                            alt="Escudo Perú"
                            className="h-16 w-auto"
                        />
                        <div className="text-center">
                            <h1 className="text-2xl font-black tracking-widest text-gray-900 uppercase">Cédula de Sufragio</h1>
                            <p className="text-xs font-bold tracking-widest text-gray-600 uppercase">Elecciones Generales 2026 — Simulacro</p>
                        </div>
                        <div className="h-14 w-14 rounded-full border-2 border-gray-300 bg-gray-100 flex items-center justify-center text-2xl">
                            🦙
                        </div>
                    </div>

                    {/* ANNEXE LABEL */}
                    <div className="bg-gray-900 text-white text-center text-[10px] font-bold tracking-widest py-1.5 uppercase">
                        PRESIDENTE Y VICEPRESIDENTE — MARQUE CON UNA CRUZ (+) O UN ASPA (×)
                    </div>

                    {/* COLUMN HEADERS */}
                    <div className="grid grid-cols-[1fr_100px_130px_130px] border-b-2 border-gray-900 text-center text-[10px] font-black uppercase tracking-wide">
                        <div className="py-2 px-4 border-r border-gray-400 bg-gray-50 flex items-center text-gray-800">
                            CANDIDATO / PARTIDO
                        </div>
                        <div className="bg-red-50 border-r border-gray-400 flex flex-col items-center">
                            <div className="py-1 px-2 border-b border-red-100 w-full">PRESIDENTE</div>
                            <div className="py-1 text-[8px] font-normal text-gray-400">VOTO</div>
                        </div>
                        <div className="bg-amber-50 border-r border-gray-400 flex flex-col items-center">
                            <div className="py-1 px-2 border-b border-amber-100 w-full">SENADORES</div>
                            <div className="py-1 text-[8px] font-normal text-gray-400">VOTO PREFERENCIAL</div>
                        </div>
                        <div className="bg-blue-50 flex flex-col items-center">
                            <div className="py-1 px-2 border-b border-blue-100 w-full">CONGRESO</div>
                            <div className="py-1 text-[8px] font-normal text-gray-400">VOTO PREFERENCIAL</div>
                        </div>
                    </div>

                    {/* CANDIDATE ROWS */}
                    {candidates.map((candidate, index) => {
                        const isSelected = selectedId === candidate.id;
                        const candPrefs = preferences[candidate.id] || { sen: ['', ''], con: ['', ''] };

                        return (
                            <div
                                key={candidate.id}
                                className={`grid grid-cols-[1fr_100px_130px_130px] border-b border-gray-300 transition-colors text-sm
                                    ${isSelected ? 'bg-red-50' : index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}
                                    ${!hasVoted ? 'cursor-pointer hover:bg-red-50/60' : 'cursor-default'}
                                `}
                                onClick={() => handleSelect(candidate.id)}
                            >
                                {/* Candidate Info */}
                                <div className="py-2 px-3 border-r border-gray-300 flex items-center gap-3">
                                    <div className="relative flex-shrink-0">
                                        <img
                                            src={candidate.image_url}
                                            alt={candidate.nombre}
                                            className="w-12 h-14 object-cover object-top border border-gray-200 rounded"
                                            onError={(e) => { e.target.src = 'https://via.placeholder.com/48x56?text=?'; }}
                                        />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="font-black text-gray-400 text-[9px] uppercase tracking-wider truncate">{candidate.partido}</span>
                                        <span className="font-bold text-gray-900 text-sm leading-tight">{candidate.nombre}</span>
                                    </div>
                                    {candidate.logo_partido && (
                                        <img
                                            src={candidate.logo_partido}
                                            alt={`Logo ${candidate.partido}`}
                                            className="ml-auto w-10 h-10 object-contain flex-shrink-0"
                                            onError={(e) => { e.target.style.display = 'none'; }}
                                        />
                                    )}
                                </div>

                                {/* Presidential Vote Cell */}
                                <div className="border-r border-gray-300 flex items-center justify-center bg-inherit">
                                    <div
                                        className={`w-12 h-12 border-2 rounded flex items-center justify-center text-2xl font-black transition-all
                                            ${isSelected
                                                ? 'border-red-600 bg-red-600 text-white shadow-inner'
                                                : 'border-gray-400 bg-white text-transparent'
                                            }`}
                                    >
                                        {isSelected ? '✕' : ''}
                                    </div>
                                </div>

                                {/* Senator Preference Cell */}
                                <div className="border-r border-gray-300 flex items-center justify-center gap-1.5 py-2">
                                    {[0, 1].map(idx => (
                                        <input
                                            key={idx}
                                            type="text"
                                            maxLength={2}
                                            className="w-8 h-10 border border-gray-400 bg-white rounded text-center font-bold text-lg focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-200 uppercase"
                                            value={candPrefs.sen[idx]}
                                            onChange={(e) => handlePreferenceChange(candidate.id, 'sen', idx, e.target.value)}
                                            onClick={(e) => e.stopPropagation()}
                                            disabled={hasVoted}
                                        />
                                    ))}
                                </div>

                                {/* Congress Preference Cell */}
                                <div className="flex items-center justify-center gap-1.5 py-2">
                                    {[0, 1].map(idx => (
                                        <input
                                            key={idx}
                                            type="text"
                                            maxLength={2}
                                            className="w-8 h-10 border border-gray-400 bg-white rounded text-center font-bold text-lg focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-200 uppercase"
                                            value={candPrefs.con[idx]}
                                            onChange={(e) => handlePreferenceChange(candidate.id, 'con', idx, e.target.value)}
                                            onClick={(e) => e.stopPropagation()}
                                            disabled={hasVoted}
                                        />
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ACTION BAR */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-gray-500 italic">
                    {selectedId
                        ? `Seleccionaste a: ${candidates.find(c => c.id === selectedId)?.nombre}`
                        : 'Haz clic en la fila del candidato para marcar el voto presidencial.'}
                </p>
                <button
                    onClick={() => selectedId && setShowConfirm(true)}
                    disabled={!selectedId}
                    className={`px-10 py-3.5 rounded-full font-black text-lg transition-all shadow-lg
                        ${selectedId
                            ? 'bg-peru-red text-white hover:bg-red-700 shadow-red-200 hover:scale-105 active:scale-95'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                >
                    Confirmar Voto ✓
                </button>
            </div>

            {/* CONFIRM MODAL */}
            <AnimatePresence>
                {showConfirm && (
                    <motion.div
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowConfirm(false)}
                    >
                        <motion.div
                            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={e => e.stopPropagation()}
                        >
                            <h3 className="text-2xl font-black text-gray-900 mb-2 text-center">¿Confirmas tu voto?</h3>
                            {(() => {
                                const c = candidates.find(x => x.id === selectedId);
                                return c ? (
                                    <div className="flex items-center gap-4 bg-red-50 border border-red-100 rounded-2xl p-4 my-4">
                                        <img src={c.image_url} alt={c.nombre} className="w-16 h-20 object-cover object-top rounded-xl border border-red-200" />
                                        <div>
                                            <p className="text-xs font-bold text-red-400 uppercase tracking-widest">{c.partido}</p>
                                            <p className="text-xl font-black text-gray-900">{c.nombre}</p>
                                        </div>
                                    </div>
                                ) : null;
                            })()}
                            <p className="text-gray-500 text-sm text-center mb-6">Esta acción no se puede deshacer. Solo se permite un voto por dispositivo.</p>
                            <div className="flex gap-3">
                                <button onClick={() => setShowConfirm(false)} className="flex-1 py-3 rounded-full border-2 border-gray-300 font-bold text-gray-600 hover:bg-gray-50 transition-all">
                                    Cancelar
                                </button>
                                <button onClick={handleConfirmVote} className="flex-1 py-3 rounded-full bg-peru-red text-white font-black hover:bg-red-700 transition-all shadow-lg shadow-red-200">
                                    ¡Votar!
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default VotingBallot;
