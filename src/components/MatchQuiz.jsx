import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const questions = [
    {
        id: 1,
        text: "¿Cuál consideras que es el problema más urgente a resolver en el Perú?",
        options: [
            { text: "Inseguridad Ciudadana", category: "seguridad" },
            { text: "Economía y Desempleo", category: "economia" },
            { text: "Corrupción Estatal", category: "anticorrupcion" },
            { text: "Salud y Educación", category: "social" }
        ]
    },
    {
        id: 2,
        text: "¿Qué enfoque de seguridad prefieres?",
        options: [
            { text: "Mano dura y control estricto (Plan Bukele)", category: "mano_dura" },
            { text: "Reforma policial e inteligencia estratégica", category: "inteligencia" },
            { text: "Prevención social y oportunidades juveniles", category: "social" },
            { text: "Lucha contra la corrupción en la justicia", category: "anticorrupcion" }
        ]
    },
    {
        id: 3,
        text: "¿Cómo debería impulsarse la economía?",
        options: [
            { text: "Apoyo masivo a emprendedores e informales", category: "emprendimiento" },
            { text: "Fomento de la gran inversión y minería fuerte", category: "inversion" },
            { text: "Redistribución directa de la riqueza (Canon a la gente)", category: "redistribucion" },
            { text: "Fortalecimiento de los derechos laborales y sindicatos", category: "social" }
        ]
    },
    {
        id: 4,
        text: "Sobre la trayectoria del candidato, ¿qué valoras más?",
        options: [
            { text: "Experiencia técnica y académica", category: "tecnico" },
            { text: "Liderazgo firme y trayectoria militar", category: "militar" },
            { text: "Experiencia en gestión municipal o regional", category: "gestion" },
            { text: "Renovación total y caras nuevas (Outsiders)", category: "nuevo" }
        ]
    }
];

const MatchQuiz = ({ candidates, onSelectCandidate }) => {
    const [currentStep, setCurrentStep] = useState(0); // 0: Start, 1-4: Questions, 5: Results
    const [answers, setAnswers] = useState([]);
    const [matches, setMatches] = useState([]);

    const handleAnswer = (category) => {
        const newAnswers = [...answers, category];
        setAnswers(newAnswers);

        if (currentStep < questions.length) {
            setCurrentStep(currentStep + 1);
        } else {
            calculateResults(newAnswers);
        }
    };

    const calculateResults = (finalAnswers) => {
        // Simple matching logic: count occurrences of categories in candidate features
        // Note: In a real app, this would be more complex and data-driven
        const scores = candidates.map(candidate => {
            let score = 0;
            const profile = JSON.stringify(candidate).toLowerCase();

            finalAnswers.forEach(ans => {
                if (profile.includes(ans)) score += 2;
                // Heuristics based on known profiles
                if (ans === 'mano_dura' && (profile.includes('bukele') || profile.includes('punitivo'))) score += 5;
                if (ans === 'anticorrupcion' && profile.includes('anticorrupción')) score += 3;
                if (ans === 'tecnico' && profile.includes('tecnocrático')) score += 3;
                if (ans === 'militar' && profile.includes('militar')) score += 5;
                if (ans === 'emprendimiento' && profile.includes('emprendedor')) score += 4;
            });

            return { candidate, score };
        });

        const topMatches = scores
            .sort((a, b) => b.score - a.score)
            .slice(0, 3)
            .filter(m => m.score > 0);

        setMatches(topMatches);
        setCurrentStep(questions.length + 1);
    };

    const resetQuiz = () => {
        setCurrentStep(0);
        setAnswers([]);
        setMatches([]);
    };

    return (
        <section id="match" className="py-20 px-6 bg-gradient-to-b from-white to-red-50 overflow-hidden">
            <div className="max-w-4xl mx-auto">
                <AnimatePresence mode="wait">
                    {currentStep === 0 && (
                        <motion.div
                            key="start"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="text-center bg-white p-12 rounded-3xl shadow-2xl border border-red-100"
                        >
                            <span className="text-peru-red font-black text-6xl mb-6 block">⚡</span>
                            <h2 className="text-4xl font-black text-gray-900 mb-4">Match Electoral 2026</h2>
                            <p className="text-lg text-gray-600 mb-10">
                                ¿No sabes por quién votar? Responde 4 preguntas rápidas y descubre qué candidatos se alinean mejor con tus prioridades y visión de país.
                            </p>
                            <button
                                onClick={() => setCurrentStep(1)}
                                className="bg-peru-red text-white px-10 py-4 rounded-full font-bold text-xl hover:bg-red-700 transition-all shadow-xl shadow-red-200 transform hover:scale-105"
                            >
                                Empezar Test
                            </button>
                        </motion.div>
                    )}

                    {currentStep > 0 && currentStep <= questions.length && (
                        <motion.div
                            key={`q-${currentStep}`}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl border border-red-50 relative"
                        >
                            <div className="absolute top-0 left-0 h-2 bg-red-100 w-full rounded-t-3xl overflow-hidden">
                                <motion.div 
                                    className="h-full bg-peru-red"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(currentStep / questions.length) * 100}%` }}
                                />
                            </div>
                            
                            <p className="text-peru-red font-bold mb-2">Pregunta {currentStep} de {questions.length}</p>
                            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">{questions[currentStep - 1].text}</h3>
                            
                            <div className="grid grid-cols-1 gap-4">
                                {questions[currentStep - 1].options.map((opt, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleAnswer(opt.category)}
                                        className="text-left px-8 py-5 rounded-2xl border-2 border-gray-100 hover:border-peru-red hover:bg-red-50 transition-all group"
                                    >
                                        <span className="font-semibold text-gray-700 group-hover:text-peru-red text-lg">{opt.text}</span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {currentStep > questions.length && (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center"
                        >
                            <h2 className="text-3xl font-black text-gray-900 mb-2">Tus Mejores Coincidencias</h2>
                            <p className="text-gray-600 mb-10">Basado en tus respuestas, estos candidatos podrían interesarte:</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                                {matches.map(({ candidate, score }, idx) => (
                                    <motion.div
                                        key={candidate.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.2 }}
                                        className="bg-white p-6 rounded-3xl shadow-xl border border-red-50 relative overflow-hidden group cursor-pointer"
                                        onClick={() => onSelectCandidate(candidate)}
                                    >
                                        <div className="absolute top-0 right-0 bg-peru-red text-white px-4 py-1 rounded-bl-xl font-bold text-sm">
                                            #{idx + 1} Match
                                        </div>
                                        <div className="w-24 h-24 mx-auto rounded-full overflow-hidden mb-4 border-4 border-red-50 group-hover:border-peru-red transition-all">
                                            <img src={candidate.image_url} alt={candidate.nombre} className="w-full h-full object-cover" />
                                        </div>
                                        <h4 className="font-bold text-gray-900 text-lg leading-tight mb-1">{candidate.nombre}</h4>
                                        <p className="text-xs text-peru-red font-bold uppercase mb-4">{candidate.partido}</p>
                                        <button className="text-sm font-bold text-gray-400 hover:text-peru-red transition-colors">
                                            Ver perfil →
                                        </button>
                                    </motion.div>
                                ))}
                            </div>

                            <button
                                onClick={resetQuiz}
                                className="text-gray-400 font-bold hover:text-peru-red transition-colors flex items-center gap-2 mx-auto"
                            >
                                ↺ Repetir Test
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
};

export default MatchQuiz;
