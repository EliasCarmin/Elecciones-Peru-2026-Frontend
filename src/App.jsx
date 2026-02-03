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
import candidatesData from './data/candidates.json';
import './index.css';

function App() {
  const [loading, setLoading] = useState(true);
  const [refreshResults, setRefreshResults] = useState(0);

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
            <CandidatesSection candidates={candidatesData} />
            <VotingModule candidates={candidatesData} onVoteCompleted={handleVoteCompleted} />
            <VotingResults candidates={candidatesData} key={refreshResults} />
            <VersusSection candidates={candidatesData} />

          </main>
          <Footer />
        </div>
      )}
    </>
  );
}

export default App;
