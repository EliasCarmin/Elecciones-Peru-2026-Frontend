import { useEffect } from 'react';
import { analytics } from '../services/analytics';
import Hero from '../components/Hero';
import MatchQuiz from '../components/MatchQuiz';
import CandidatesSection from '../components/CandidatesSection';
import VersusSection from '../components/VersusSection';
import candidatesData from '../data/candidates.json';

const HomePage = ({ onSelectCandidate }) => {
    useEffect(() => {
        analytics.trackEvent('page_view', 'view_home', '/');
    }, []);

    return (
        <>
            <Hero candidatesCount={candidatesData.length} />
            <CandidatesSection
                candidates={candidatesData}
                onSelectCandidate={onSelectCandidate}
            />
            <MatchQuiz candidates={candidatesData} onSelectCandidate={onSelectCandidate} />
            <VersusSection candidates={candidatesData} />
        </>
    );
};

export default HomePage;
