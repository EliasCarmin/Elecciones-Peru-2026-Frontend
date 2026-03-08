import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { analytics } from './services/analytics';
import LoadingScreen from './components/LoadingScreen';
import Header from './components/Header';
import Footer from './components/Footer';
import CandidateDetail from './components/CandidateDetail';
import HomePage from './pages/HomePage';
import VotingPage from './pages/VotingPage';
import ResultsPage from './pages/ResultsPage';
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

    // Initialize Analytics session
    analytics.initSession();

    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <AnimatePresence mode="wait">
        {loading && (
          <LoadingScreen onLoadingComplete={() => setLoading(false)} />
        )}
      </AnimatePresence>

      {!loading && (
        <div className="min-h-screen bg-white">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<HomePage onSelectCandidate={setSelectedCandidate} />} />
              <Route path="/votar" element={<VotingPage onVoteCompleted={handleVoteCompleted} />} />
              <Route path="/resultados" element={<ResultsPage refreshResults={refreshResults} />} />
            </Routes>
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
    </Router>
  );
}

export default App;
