import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { analytics } from '../services/analytics';
import VotingResults from '../components/VotingResults';
import candidatesData from '../data/candidates.json';

const ResultsPage = ({ refreshResults }) => {
    useEffect(() => {
        analytics.trackEvent('page_view', 'view_results', '/resultados');
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pt-10"
        >
            <div className="container mx-auto px-4 py-12">
                <h2 className="text-4xl font-bold text-center mb-4">Resultados en Tiempo Real</h2>
                <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
                    Conoce cómo van las preferencias de la comunidad. Datos actualizados constantemente.
                </p>
                <VotingResults candidates={candidatesData} key={refreshResults} />
            </div>
        </motion.div>
    );
};

export default ResultsPage;
