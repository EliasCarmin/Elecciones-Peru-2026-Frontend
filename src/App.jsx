import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import LoadingScreen from './components/LoadingScreen';
import Header from './components/Header';
import Hero from './components/Hero';
import CandidatesSection from './components/CandidatesSection';
import VersusSection from './components/VersusSection';

import Footer from './components/Footer';
import candidatesData from './data/candidates.json';
import './index.css';

function App() {
  const [loading, setLoading] = useState(true);









  useEffect(() => {
    // Simulate initial loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3500);

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
            <VersusSection candidates={candidatesData} />

          </main>
          <Footer />
        </div>
      )}
    </>
  );
}

export default App;
