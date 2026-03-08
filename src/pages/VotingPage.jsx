import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { analytics } from '../services/analytics';
import VotingBallot from '../components/VotingBallot';
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
                <div className="text-center mb-8">
                    <span className="text-peru-red font-bold tracking-widest uppercase text-sm">Simulacro Electoral</span>
                    <h2 className="text-4xl font-black text-gray-900 mt-2 mb-3">Emite tu Voto</h2>
                    <p className="text-gray-500 max-w-xl mx-auto text-base">
                        Selecciona al candidato de tu preferencia. En dispositivos móviles puedes deslizar la cédula horizontalmente.
                    </p>
                </div>
                <VotingBallot candidates={candidatesData} onVoteCompleted={onVoteCompleted} />
            </div>
        </motion.div>
    );
};

export default VotingPage;
