import { motion } from 'framer-motion';

const FloatingNewsButton = ({ onClick }) => {
    return (
        <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClick}
            className="fixed bottom-6 left-6 z-40 bg-gray-900 text-white p-4 rounded-full shadow-2xl flex items-center gap-2 group overflow-hidden border-2 border-white/20 hover:bg-peru-red transition-colors duration-300"
            title="Ver contexto histórico"
        >
            <span className="text-2xl">🗞️</span>
            <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap font-bold text-sm">
                Contexto Político
            </span>
        </motion.button>
    );
};

export default FloatingNewsButton;
