import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { analytics } from './services/analytics';
import LoadingScreen from './components/LoadingScreen';
import Header from './components/Header';
import Hero from './components/Hero';
import CandidatesSection from './components/CandidatesSection';
import VersusSection from './components/VersusSection';

import Footer from './components/Footer';
import VotingModule from './components/VotingModule';
import VotingResults from './components/VotingResults';
import MatchQuiz from './components/MatchQuiz';
import CandidateDetail from './components/CandidateDetail';
import candidatesData from './data/candidates.json';
import './index.css';

function App() {
  const [loading, setLoading] = useState(true);
  const [refreshResults, setRefreshResults] = useState(0);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const handleVoteCompleted = () => {
    setRefreshResults(prev => prev + 1);
  };

  useEffect(() => {
    // Simulate initial loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3500);

    // Initialize Analytics
    analytics.initSession().then(() => {
      analytics.trackEvent('page_view', 'view_home', '/');
    });

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && (
          <LoadingScreen onLoadingComplete={() => setLoading(false)} />
        )}
      </AnimatePresence>

      {!loading && (
        <div className="min-h-screen bg-white">
          <Header />
          <main>
            <Hero candidatesCount={candidatesData.length} />
            <MatchQuiz candidates={candidatesData} onSelectCandidate={setSelectedCandidate} />
            <CandidatesSection
              candidates={candidatesData}
              onSelectCandidate={setSelectedCandidate}
            />
            <VotingModule candidates={candidatesData} onVoteCompleted={handleVoteCompleted} />
            <VotingResults candidates={candidatesData} key={refreshResults} />
            <VersusSection candidates={candidatesData} />
          </main>
          <Footer />

          {/* Global Candidate Detail Overlay */}
          <AnimatePresence>
            {selectedCandidate && (
              <CandidateDetail
                candidate={selectedCandidate}
                onClose={() => setSelectedCandidate(null)}
              />
            )}
          </AnimatePresence>
        </div>
      )}
    </>
  );
}

export default App;
