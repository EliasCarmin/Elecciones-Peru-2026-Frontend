import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Color palette per block ───────────────────────────────────────────────
const BLOCKS = [
    {
        key: 'presidente',
        label: 'PRESIDENTE Y VICEPRESIDENTES',
        subLabel: 'Marque con una cruz (+) o un aspa (×) dentro del recuadro del símbolo y fotografía',
        bg: 'bg-[#f5f0e8]',
        headerBg: 'bg-[#e8dfc8]',
        border: 'border-[#c8b896]',
        accent: 'text-[#6b4f1a]',
        inputFocus: 'focus:border-[#8b6914]',
        isPresidente: true,
    },
    {
        key: 'senNacional',
        label: 'SENADORES',
        subLabel: 'A NIVEL NACIONAL',
        subLabel2: 'VOTO PREFERENCIAL — Marque con una cruz (+) o un aspa (×) dentro del recuadro del símbolo de su preferencia',
        bg: 'bg-[#eef4ee]',
        headerBg: 'bg-[#c8dfc8]',
        border: 'border-[#8fbe8f]',
        accent: 'text-[#1a5c1a]',
        inputFocus: 'focus:border-[#2d8c2d]',
    },
    {
        key: 'senUniverso',
        label: 'SENADORES',
        subLabel: 'UNIVERSO',
        subLabel2: 'VOTO PREFERENCIAL',
        bg: 'bg-[#fdf3e7]',
        headerBg: 'bg-[#f5d9a8]',
        border: 'border-[#e8b86d]',
        accent: 'text-[#7a4100]',
        inputFocus: 'focus:border-[#c96a00]',
    },
    {
        key: 'diputados',
        label: 'DIPUTADOS',
        subLabel: 'UNIVERSO',
        subLabel2: 'Marque y escriba',
        bg: 'bg-[#eef1f8]',
        headerBg: 'bg-[#c4d0ec]',
        border: 'border-[#849ed4]',
        accent: 'text-[#1a2f6b]',
        inputFocus: 'focus:border-[#2741b8]',
    },
    {
        key: 'parlamento',
        label: 'PARLAMENTO ANDINO',
        subLabel: 'VOTO PREFERENCIAL',
        subLabel2: 'Marque con una cruz (+) o un aspa (×) dentro del recuadro del símbolo de su preferencia',
        bg: 'bg-[#f5eef8]',
        headerBg: 'bg-[#dfc4ec]',
        border: 'border-[#b87ed4]',
        accent: 'text-[#4a1a6b]',
        inputFocus: 'focus:border-[#8a2be2]',
    },
];

// ─── Vote Box ───────────────────────────────────────────────────────────────
const VoteBox = ({ isSelected, blockBg }) => (
    <div className={`w-10 h-10 border-2 border-gray-400 rounded flex items-center justify-center font-black text-2xl transition-all duration-300 ${isSelected ? 'bg-red-600 border-red-600 text-white shadow-md' : `${blockBg} bg-white`}`}>
        {isSelected ? '✕' : ''}
    </div>
);

// ─── Preference Input ────────────────────────────────────────────────────────
const PrefInput = ({ value, onChange, onClick, disabled, focusClass }) => (
    <input
        type="text"
        inputMode="numeric"
        maxLength={2}
        placeholder=""
        className={`w-8 h-9 border border-gray-400 bg-white rounded text-center font-black text-base focus:outline-none focus:ring-2 transition-all ${focusClass}`}
        value={value}
        onChange={onChange}
        onClick={onClick}
        disabled={disabled}
    />
);

// ─── Main Component ──────────────────────────────────────────────────────────
const VotingBallot = ({ candidates, onVoteCompleted }) => {
    const [selectedId, setSelectedId] = useState(null);
    const [hasVoted, setHasVoted] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    // preferences: { candidateId: { senNacional: ['',''], senUniverso: ['',''], diputados: ['',''], parlamento: ['',''] } }
    const [preferences, setPreferences] = useState({});

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

    const handlePrefChange = (candidateId, blockKey, idx, value) => {
        if (hasVoted) return;
        const clean = value.replace(/[^0-9]/g, '');
        setPreferences(prev => {
            const old = prev[candidateId] || {};
            const oldArr = old[blockKey] || ['', ''];
            return {
                ...prev,
                [candidateId]: {
                    ...old,
                    [blockKey]: oldArr.map((v, i) => i === idx ? clean : v),
                }
            };
        });
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

    // ── Voted state ──────────────────────────────────────────────────────────
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
                        <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

    // ── Ballot ───────────────────────────────────────────────────────────────
    return (
        <div className="py-4">
            <div className="overflow-x-auto rounded-3xl shadow-2xl border-2 border-gray-300">
                <div className="min-w-[1300px] bg-[#f0ece0] font-sans">

                    {/* ── MAIN HEADER ── */}
                    <div className="border-b-4 border-gray-800 flex items-center justify-between px-8 py-5 bg-white">
                        <img src="/escudo.png" alt="Escudo Perú" className="h-20 w-auto object-contain" />
                        <div className="text-center">
                            <h1 className="text-3xl font-black tracking-[0.25em] text-gray-900 uppercase">Cédula de Sufragio</h1>
                            <p className="text-[11px] font-bold tracking-[0.2em] text-gray-500 uppercase mt-1">Elecciones Generales 2026 — Simulacro</p>
                        </div>
                        <div className="h-16 w-16 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center text-3xl">
                            🦙
                        </div>
                    </div>

                    {/* ── COLUMN GROUP HEADER (5 blocks) ── */}
                    <div className="grid grid-cols-[240px_1fr_1fr_1fr_1fr_1fr] border-b-2 border-gray-800">
                        {/* Candidate column label */}
                        <div className="bg-[#e0d8c0] border-r-2 border-gray-800 flex items-center justify-center p-3">
                            <span className="text-[10px] font-black uppercase tracking-widest text-center text-[#4a3a10]">CANDIDATO<br/>PARTIDO</span>
                        </div>
                        {/* 5 block headers */}
                        {BLOCKS.map((block) => (
                            <div key={block.key} className={`${block.headerBg} border-r border-gray-400 last:border-r-0 flex flex-col items-center justify-center p-3 text-center`}>
                                <p className={`text-[11px] font-black uppercase tracking-wider leading-tight ${block.accent}`}>{block.label}</p>
                                {block.subLabel && <p className={`text-[9px] font-bold uppercase tracking-wide mt-1 ${block.accent} opacity-80`}>{block.subLabel}</p>}
                                {block.subLabel2 && <p className="text-[8px] font-medium text-gray-500 mt-1 leading-snug">{block.subLabel2}</p>}
                            </div>
                        ))}
                    </div>

                    {/* ── CANDIDATE ROWS ── */}
                    {candidates.map((candidate, index) => {
                        const isSelected = selectedId === candidate.id;
                        const prefs = preferences[candidate.id] || {};

                        return (
                            <div
                                key={candidate.id}
                                className={`grid grid-cols-[240px_1fr_1fr_1fr_1fr_1fr] border-b border-gray-300 transition-all duration-200
                                    ${index % 2 === 0 ? 'bg-white/70' : 'bg-[#f5f0e4]/60'}
                                    ${isSelected ? 'outline outline-2 outline-red-400 z-10 relative' : ''}
                                    ${!hasVoted ? 'cursor-pointer hover:brightness-95' : 'cursor-default'}
                                `}
                                onClick={() => handleSelect(candidate.id)}
                            >
                                {/* ── Candidate info column ── */}
                                <div className="py-3 px-3 border-r-2 border-gray-700 flex flex-col justify-center gap-0.5">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 truncate leading-tight">{candidate.partido}</p>
                                    <p className="text-[11px] font-black text-gray-900 leading-tight">{candidate.nombre}</p>
                                </div>

                                {/* ── 5 BLOCKS ── */}
                                {BLOCKS.map((block) => {
                                    const prefArr = prefs[block.key] || ['', ''];
                                    return (
                                        <div
                                            key={block.key}
                                            className={`${block.bg} border-r border-gray-300 last:border-r-0 flex items-center justify-center gap-2 px-3 py-3`}
                                        >
                                            {/* Party logo / symbol */}
                                            {candidate.logo_partido ? (
                                                <div className="flex-shrink-0 bg-white rounded border border-gray-200 p-0.5">
                                                    <img
                                                        src={candidate.logo_partido}
                                                        alt=""
                                                        className="w-8 h-8 object-contain"
                                                        onError={(e) => { e.target.parentElement.style.display = 'none'; }}
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-8 h-8 bg-gray-100 rounded border border-gray-200 flex-shrink-0" />
                                            )}

                                            {/* Main vote box */}
                                            <div
                                                className={`w-10 h-10 border-2 rounded flex items-center justify-center font-black text-xl transition-all duration-300 flex-shrink-0
                                                    ${isSelected
                                                        ? 'bg-red-600 border-red-600 text-white shadow-md'
                                                        : `bg-white ${block.border} hover:border-red-300`
                                                    }`}
                                                onClick={() => handleSelect(candidate.id)}
                                            >
                                                {isSelected ? '✕' : ''}
                                            </div>

                                            {/* Preferential inputs (not for 'presidente' since they have no pref vote) */}
                                            {!block.isPresidente && (
                                                <input
                                                    type="text"
                                                    inputMode="numeric"
                                                    maxLength={2}
                                                    className={`w-9 h-10 border border-gray-400 bg-white rounded text-center font-black text-sm focus:outline-none focus:ring-2 transition-all ${block.inputFocus}`}
                                                    value={(prefs[block.key] || [''])[0]}
                                                    onChange={(e) => handlePrefChange(candidate.id, block.key, 0, e.target.value)}
                                                    onClick={(e) => e.stopPropagation()}
                                                    disabled={hasVoted}
                                                />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ── ACTION BAR ── */}
            <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-6 bg-gray-50 p-8 rounded-3xl border border-gray-100">
                <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm transition-all
                        ${selectedId ? 'bg-peru-red text-white scale-110' : 'bg-gray-200 text-gray-400'}`}>
                        {selectedId ? '✓' : '!'}
                    </div>
                    <div>
                        <p className="text-gray-900 font-black text-xl">
                            {selectedId ? candidates.find(c => c.id === selectedId)?.nombre : 'Selecciona a tu candidato'}
                        </p>
                        <p className="text-gray-500 text-sm font-medium">
                            {selectedId
                                ? 'Puedes ingresar tus votos preferenciales en los cuadros de cada sección.'
                                : 'Haz clic en la fila del candidato para marcar tu voto presidencial.'}
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => selectedId && setShowConfirm(true)}
                    disabled={!selectedId}
                    className={`min-w-[240px] px-10 py-5 rounded-2xl font-black text-xl transition-all shadow-xl tracking-tight
                        ${selectedId
                            ? 'bg-peru-red text-white hover:bg-red-700 shadow-red-500/20 hover:scale-[1.02] active:scale-95'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                >
                    Confirmar Voto ✓
                </button>
            </div>

            {/* ── CONFIRM MODAL ── */}
            <AnimatePresence>
                {showConfirm && (
                    <motion.div
                        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
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
