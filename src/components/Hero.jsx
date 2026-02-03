import { motion } from 'framer-motion';

const Hero = ({ candidatesCount = 11 }) => {
    return (
        <section className="relative py-12 md:py-20 lg:py-28 overflow-hidden">
            <div className="absolute inset-0 gradient-peru opacity-5"></div>
            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    className="text-center max-w-4xl mx-auto"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <motion.h2
                        className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        Candidatos Presidenciales{' '}
                        <span className="text-peru-red">Perú 2026</span>
                    </motion.h2>
                    <motion.p
                        className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                    >
                        Información detallada sobre los candidatos a la presidencia del Perú.
                        Conoce sus trayectorias, propuestas y controversias.
                    </motion.p>

                    <motion.div
                        className="flex flex-wrap justify-center gap-4 mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                    >
                        <a
                            href="https://drive.google.com/drive/folders/1xhiZa8KnOqpbEltYsSUZeXifeAogoaKj?usp=sharing"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 bg-red-100 border-2 border-peru-red text-peru-red hover:bg-red-200 px-8 py-4 rounded-full font-bold shadow-lg transition-all transform hover:scale-105 active:scale-95"
                        >
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M13 9V3.5L18.5 9M6 2c-1.11 0-2 .89-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6H6z" />
                            </svg>
                            <span>Información</span>
                        </a>
                        <a
                            href="#votar"
                            className="flex items-center gap-3 bg-peru-red hover:bg-red-700 text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-peru-red/20 transition-all transform hover:scale-105 active:scale-95 animate-bounce-subtle"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            <span>Votar Ahora</span>
                        </a>
                    </motion.div>

                    <motion.div
                        className="flex flex-wrap justify-center gap-4 md:gap-8 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.7 }}
                    >
                        <div className="bg-white rounded-lg shadow-peru p-4 md:p-6 min-w-[120px]">
                            <div className="text-3xl md:text-4xl font-bold text-peru-red">{candidatesCount}</div>
                            <div className="text-sm md:text-base text-gray-600 mt-1">Candidatos</div>
                        </div>
                        <div className="bg-white rounded-lg shadow-peru p-4 md:p-6 min-w-[120px]">
                            <div className="text-3xl md:text-4xl font-bold text-peru-red">2026</div>
                            <div className="text-sm md:text-base text-gray-600 mt-1">Elecciones</div>
                        </div>
                        <div className="bg-white rounded-lg shadow-peru p-4 md:p-6 min-w-[120px]">
                            <div className="text-3xl md:text-4xl font-bold text-peru-red">100%</div>
                            <div className="text-sm md:text-base text-gray-600 mt-1">Transparencia</div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
