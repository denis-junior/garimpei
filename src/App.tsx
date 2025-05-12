import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuctionProvider } from './context/AuctionContext';
import Header from './components/Header';
import Footer from './components/Footer';
import AuctionViewerPage from './pages/AuctionViewerPage';
import ProducerPage from './pages/ProducerPage';
import UserProfilePage from './pages/UserProfilePage';
import AuctionDetailPage from './pages/AuctionDetailPage';

function App() {
  return (
    <AuctionProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-50">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<AuctionViewerPage />} />
              <Route path="/producer" element={<ProducerPage />} />
              <Route path="/profile" element={<UserProfilePage />} />
              <Route path="/auction/:id" element={<AuctionDetailPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuctionProvider>
  );
}

export default App;