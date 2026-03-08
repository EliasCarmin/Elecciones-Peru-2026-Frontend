import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { analytics } from '../services/analytics';
import VotingModule from '../components/VotingModule';
import candidatesData from '../data/candidates.json';

const VotingPage = ({ onVoteCompleted }) => {
    useEffect(() => {
        analytics.trackEvent('page_view', 'view_voting', '/votar');
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pt-10"
        >
            <div className="container mx-auto px-4 py-12">
                <h2 className="text-4xl font-bold text-center mb-8">Emite tu Voto</h2>
                <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
                    Tu participación es fundamental. Selecciona al candidato que mejor represente tus intereses para el Perú.
                </p>
                <VotingModule candidates={candidatesData} onVoteCompleted={onVoteCompleted} />
            </div>
        </motion.div>
    );
};

export default VotingPage;
