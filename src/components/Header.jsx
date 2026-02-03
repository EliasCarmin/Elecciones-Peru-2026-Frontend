import { motion } from 'framer-motion';

const Header = () => {
    return (
        <motion.header
            className="sticky top-0 z-40 bg-white shadow-peru"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
        >
            <div className="container mx-auto px-4 py-4 md:py-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-12 md:h-16 gradient-peru rounded-full"></div>
                        <div>
                            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
                                Elecciones Perú <span className="text-peru-red">2026</span>
                            </h1>
                            <p className="text-xs md:text-sm text-gray-600">Conoce a los candidatos</p>
                        </div>
                    </div>
                    <nav className="hidden md:flex items-center gap-6">
                        <a href="#votar" className="text-gray-600 hover:text-red-600 font-bold transition-colors">Votar</a>
                        <a href="#resultados" className="text-gray-600 hover:text-red-600 font-bold transition-colors">Resultados</a>
                        <div className="flex items-center gap-0 ml-4">
                            <div className="w-8 h-9 bg-peru-red"></div>
                            <div className="w-8 h-9 bg-white shadow-inner"></div>
                            <div className="w-8 h-9 bg-peru-red"></div>
                        </div>
                    </nav>
                </div>
            </div>
        </motion.header>
    );
};

export default Header;
