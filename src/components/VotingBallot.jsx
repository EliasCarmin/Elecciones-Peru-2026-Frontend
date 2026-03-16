import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Block definitions ────────────────────────────────────────────────────────
const BLOCKS = [
    {
        key: 'presidente',
        label: 'PRESIDENTE Y VICEPRESIDENTES',
        subLabel: 'Marque sobre la imagen del candidato o símbolo de su partido',
        headerBg: 'bg-[#e8dfc8]',
        rowBg:    'bg-[#f5f0e8]',
        border:   'border-[#c8b896]',
        accentCls:'text-[#6b4f1a]',
        isPresidente: true,
    },
    {
        key: 'senNacional',
        label: 'SENADORES',
        subLabel: 'A NIVEL NACIONAL',
        subLabel2: 'Voto Preferencial — Marque sobre el símbolo y escriba el N.º',
        headerBg: 'bg-[#c8dfc8]',
        rowBg:    'bg-[#eef4ee]',
        border:   'border-[#8fbe8f]',
        accentCls:'text-[#1a5c1a]',
        ring:     'focus:ring-green-300',
    },
    {
        key: 'senUniverso',
        label: 'SENADORES',
        subLabel: 'UNIVERSO',
        subLabel2: 'Voto Preferencial',
        headerBg: 'bg-[#f5d9a8]',
        rowBg:    'bg-[#fdf3e7]',
        border:   'border-[#e8b86d]',
        accentCls:'text-[#7a4100]',
        ring:     'focus:ring-orange-300',
    },
    {
        key: 'diputados',
        label: 'DIPUTADOS',
        subLabel: 'UNIVERSO',
        subLabel2: 'Marque y escriba N.º (1-30)',
        headerBg: 'bg-[#c4d0ec]',
        rowBg:    'bg-[#eef1f8]',
        border:   'border-[#849ed4]',
        accentCls:'text-[#1a2f6b]',
        ring:     'focus:ring-blue-300',
    },
    {
        key: 'parlamento',
        label: 'PARLAMENTO ANDINO',
        subLabel: 'Voto Preferencial',
        subLabel2: 'Marque sobre el símbolo y escriba el N.º',
        headerBg: 'bg-[#dfc4ec]',
        rowBg:    'bg-[#f5eef8]',
        border:   'border-[#b87ed4]',
        accentCls:'text-[#4a1a6b]',
        ring:     'focus:ring-purple-300',
    },
];

// ─── Main Component ───────────────────────────────────────────────────────────
const VotingBallot = ({ candidates, onVoteCompleted }) => {
    // selections: { blockKey: candidateId | null }
    const [selections, setSelections] = useState({
        presidente: null, senNacional: null, senUniverso: null, diputados: null, parlamento: null,
    });
    // preferences: { blockKey: { candidateId: [string, string] } }
    const [preferences, setPreferences] = useState({});
    const [hasVoted, setHasVoted] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('peru_2026_ballot');
        if (saved) {
            const parsed = JSON.parse(saved);
            setSelections(parsed.selections || {});
            setPreferences(parsed.preferences || {});
            setHasVoted(true);
        }
    }, []);

    const handleSelect = (blockKey, candidateId) => {
        if (hasVoted) return;
        setSelections(prev => ({
            ...prev,
            [blockKey]: prev[blockKey] === candidateId ? null : candidateId,
        }));
    };

    const handlePrefChange = (blockKey, candidateId, idx, value) => {
        if (hasVoted) return;
        const clean = value.replace(/[^0-9]/g, '');
        // Clamp 1-30
        const num = parseInt(clean, 10);
        const clamped = !clean ? '' : num > 30 ? '30' : num < 1 ? '1' : String(num);
        setPreferences(prev => {
            const blockPrefs = prev[blockKey] || {};
            const candPrefs = blockPrefs[candidateId] || ['', ''];
            const newCandPrefs = [...candPrefs];
            newCandPrefs[idx] = value === '' ? '' : clamped;
            return {
                ...prev,
                [blockKey]: { ...blockPrefs, [candidateId]: newCandPrefs },
            };
        });
    };

    const hasAnySelection = Object.values(selections).some(v => v !== null);

    const handleConfirmVote = () => {
        if (!hasAnySelection || hasVoted) return;
        const payload = { selections, preferences };
        localStorage.setItem('peru_2026_ballot', JSON.stringify(payload));
        // Legacy compat
        if (selections.presidente) localStorage.setItem('peru_2026_vote', selections.presidente);
        setHasVoted(true);
        setShowConfirm(false);
        if (onVoteCompleted) onVoteCompleted(selections.presidente);
        import('../services/analytics').then(({ analytics }) => {
            analytics.trackEvent('vote', 'cast_ballot', null, selections.presidente);
        });
    };

    // ── Voted state ──────────────────────────────────────────────────────────
    if (hasVoted) {
        const presidenCand = candidates.find(c => c.id === selections.presidente);
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
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">¡Cédula Emitida!</h2>
                    {presidenCand && (
                        <div className="flex items-center gap-3 justify-center my-4 bg-gray-50 rounded-2xl p-4">
                            <img src={presidenCand.image_url} alt={presidenCand.nombre}
                                className="w-14 h-18 object-cover object-top rounded-xl border" />
                            <div className="text-left">
                                <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">{presidenCand.partido}</p>
                                <p className="font-black text-gray-900">{presidenCand.nombre}</p>
                                <p className="text-xs text-gray-500">Voto Presidencial</p>
                            </div>
                        </div>
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
                <div className="min-w-[1350px] bg-[#f0ece0] font-sans select-none">

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

                    {/* ── BLOCK COLUMN HEADERS ── */}
                    <div className="grid grid-cols-[200px_1fr_1fr_1fr_1fr_1fr] border-b-2 border-gray-800">
                        <div className="bg-[#e0d8c0] border-r-2 border-gray-800 flex items-center justify-center p-3">
                            <span className="text-[10px] font-black uppercase tracking-widest text-center text-[#4a3a10]">PARTIDO /<br/>CANDIDATO</span>
                        </div>
                        {BLOCKS.map(block => (
                            <div key={block.key} className={`${block.headerBg} border-r border-gray-500 last:border-r-0 flex flex-col items-center justify-center p-3 text-center min-h-[80px]`}>
                                <p className={`text-[11px] font-black uppercase tracking-wider leading-tight ${block.accentCls}`}>{block.label}</p>
                                {block.subLabel  && <p className={`text-[9px] font-bold uppercase mt-0.5 ${block.accentCls} opacity-90`}>{block.subLabel}</p>}
                                {block.subLabel2 && <p className="text-[8px] font-medium text-gray-500 mt-0.5 leading-snug">{block.subLabel2}</p>}
                            </div>
                        ))}
                    </div>

                    {/* ── CANDIDATE ROWS ── */}
                    {candidates.map((candidate, index) => {
                        return (
                            <div
                                key={candidate.id}
                                className={`grid grid-cols-[200px_1fr_1fr_1fr_1fr_1fr] border-b border-gray-300 transition-all duration-150
                                    ${index % 2 === 0 ? 'bg-white/60' : 'bg-[#f5f0e4]/50'}
                                `}
                            >
                                {/* ── Candidate info ── */}
                                <div className="py-3 px-3 border-r-2 border-gray-700 flex flex-col justify-center gap-0.5">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 truncate leading-tight">{candidate.partido}</p>
                                    <p className="text-[12px] font-black text-gray-900 leading-tight">{candidate.nombre}</p>
                                </div>

                                {/* ── BLOCK CELLS ── */}
                                {BLOCKS.map(block => {
                                    const isSelected = selections[block.key] === candidate.id;
                                    const prefValue  = preferences[block.key]?.[candidate.id] ?? '';

                                    if (block.isPresidente) {
                                        // ── PRESIDENTIAL: photo + logo, click marks with X overlay ──
                                        return (
                                            <div
                                                key={block.key}
                                                className={`${block.rowBg} border-r border-gray-300 flex items-center justify-center gap-2 px-3 py-3 ${!hasVoted ? 'cursor-pointer' : 'cursor-default'}`}
                                                onClick={() => handleSelect(block.key, candidate.id)}
                                            >
                                                {/* Candidate photo with X overlay */}
                                                <div className="relative flex-shrink-0 group">
                                                    <img
                                                        src={candidate.image_url}
                                                        alt={candidate.nombre}
                                                        className={`w-12 h-14 object-cover object-top rounded-lg border-2 transition-all duration-300 ${isSelected ? 'border-red-500 opacity-60' : 'border-gray-200 hover:border-red-300'}`}
                                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/48x56?text=?'; }}
                                                    />
                                                    {isSelected && (
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <span className="text-4xl font-black text-red-600 drop-shadow-lg leading-none">✕</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Party logo with X overlay */}
                                                {candidate.logo_partido && (
                                                    <div className="relative flex-shrink-0">
                                                        <div className={`w-12 h-12 bg-white rounded-lg border-2 p-0.5 flex items-center justify-center transition-all duration-300 ${isSelected ? 'border-red-500 opacity-60' : 'border-gray-200 hover:border-red-300'}`}>
                                                            <img
                                                                src={candidate.logo_partido}
                                                                alt=""
                                                                className="w-full h-full object-contain"
                                                                onError={(e) => { e.target.parentElement.style.display = 'none'; }}
                                                            />
                                                        </div>
                                                        {isSelected && (
                                                            <div className="absolute inset-0 flex items-center justify-center">
                                                                <span className="text-3xl font-black text-red-600 drop-shadow-lg leading-none">✕</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    }

                                    // ── NON-PRESIDENTIAL: logo (clickable ✕) + number input ──
                                    return (
                                        <div
                                            key={block.key}
                                            className={`${block.rowBg} border-r border-gray-300 last:border-r-0 flex items-center justify-center gap-2 px-3 py-3`}
                                        >
                                            {/* Party logo — click to mark/unmark */}
                                            <div
                                                className={`relative flex-shrink-0 ${!hasVoted ? 'cursor-pointer' : 'cursor-default'}`}
                                                onClick={() => handleSelect(block.key, candidate.id)}
                                            >
                                                <div className={`w-12 h-12 bg-white rounded-lg border-2 p-0.5 flex items-center justify-center transition-all duration-300
                                                    ${isSelected ? 'border-red-500 opacity-60' : `${block.border} hover:border-red-300`}`}
                                                >
                                                    {candidate.logo_partido ? (
                                                        <img
                                                            src={candidate.logo_partido}
                                                            alt=""
                                                            className="w-full h-full object-contain"
                                                            onError={(e) => { e.target.parentElement.style.display = 'none'; }}
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-gray-100 rounded" />
                                                    )}
                                                </div>
                                                {isSelected && (
                                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                        <span className="text-3xl font-black text-red-600 drop-shadow-lg leading-none">✕</span>
                                                    </div>
                                                )}
                                            </div>

                                        {/* Preference numbers (1-30) - TWO BOXES */}
                                        <div className="flex flex-col gap-1">
                                            {[0, 1].map(idx => (
                                                <input
                                                    key={idx}
                                                    type="text"
                                                    inputMode="numeric"
                                                    maxLength={2}
                                                    placeholder="N.º"
                                                    className={`w-9 h-7 border-2 border-gray-300 bg-white rounded text-center font-black text-[10px] transition-all focus:outline-none focus:ring-2 ${block.ring} placeholder:text-gray-200`}
                                                    value={preferences[block.key]?.[candidate.id]?.[idx] ?? ''}
                                                    onChange={(e) => handlePrefChange(block.key, candidate.id, idx, e.target.value)}
                                                    onClick={(e) => e.stopPropagation()}
                                                    disabled={hasVoted}
                                                />
                                            ))}
                                        </div>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ── SELECTION SUMMARY ── */}
            {hasAnySelection && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-2"
                >
                    {BLOCKS.map(block => {
                        const cand = candidates.find(c => c.id === selections[block.key]);
                        return (
                            <div key={block.key} className={`${block.rowBg} border ${block.border} rounded-2xl p-3 text-center`}>
                                <p className={`text-[9px] font-black uppercase tracking-widest ${block.accentCls} mb-1`}>{block.label}</p>
                                {cand ? (
                                    <>
                                        <img src={cand.image_url} alt={cand.nombre} className="w-10 h-12 object-cover object-top rounded-lg mx-auto mb-1 border border-white" />
                                        <p className="text-[10px] font-black text-gray-800 leading-tight truncate">{cand.nombre}</p>
                                    </>
                                ) : (
                                    <p className="text-[10px] text-gray-400 italic">Sin selección</p>
                                )}
                            </div>
                        );
                    })}
                </motion.div>
            )}

            {/* ── ACTION BAR ── */}
            <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-6 bg-gray-50 p-8 rounded-3xl border border-gray-100">
                <div>
                    <p className="text-gray-900 font-black text-lg">
                        {hasAnySelection ? `${Object.values(selections).filter(Boolean).length} de 5 bloques seleccionados` : 'Marca tu voto en cada bloque'}
                    </p>
                    <p className="text-gray-500 text-sm font-medium mt-0.5">
                        Haz clic sobre la foto o logo del candidato para marcarlo con una ✕. Cada bloque es independiente.
                    </p>
                </div>
                <button
                    onClick={() => hasAnySelection && setShowConfirm(true)}
                    disabled={!hasAnySelection}
                    className={`min-w-[240px] px-10 py-5 rounded-2xl font-black text-xl transition-all shadow-xl tracking-tight
                        ${hasAnySelection
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
                            className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl"
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={e => e.stopPropagation()}
                        >
                            <h3 className="text-2xl font-black text-gray-900 mb-4 text-center">¿Confirmas tu cédula?</h3>
                            <div className="grid grid-cols-1 gap-2 mb-6">
                                {BLOCKS.map(block => {
                                    const c = candidates.find(x => x.id === selections[block.key]);
                                    return (
                                        <div key={block.key} className={`flex items-center gap-3 ${block.rowBg} border ${block.border} rounded-xl p-3`}>
                                            <div className={`w-2 h-8 rounded-full ${block.headerBg}`} />
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-[9px] font-black uppercase tracking-widest ${block.accentCls}`}>{block.label}</p>
                                                <p className="text-sm font-black text-gray-800 truncate">{c ? c.nombre : <span className="text-gray-400 font-medium italic">Sin selección</span>}</p>
                                            </div>
                                            {c && <img src={c.logo_partido} alt="" className="w-8 h-8 object-contain flex-shrink-0" onError={e => e.target.style.display='none'} />}
                                        </div>
                                    );
                                })}
                            </div>
                            <p className="text-gray-500 text-sm text-center mb-6">Esta acción no se puede deshacer. Solo se permite un voto por dispositivo.</p>
                            <div className="flex gap-3">
                                <button onClick={() => setShowConfirm(false)} className="flex-1 py-3 rounded-full border-2 border-gray-300 font-bold text-gray-600 hover:bg-gray-50 transition-all">
                                    Cancelar
                                </button>
                                <button onClick={handleConfirmVote} className="flex-1 py-3 rounded-full bg-peru-red text-white font-black hover:bg-red-700 transition-all shadow-lg shadow-red-200">
                                    ¡Emitir Cédula!
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
