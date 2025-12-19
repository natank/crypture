import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from "@pages/LandingPage";
import PortfolioPage from "@pages/PortfolioPage";
import { AboutPage } from "@pages/AboutPage";
import { MarketPage } from "@pages/MarketPage";
import CoinDetailPage from "@pages/CoinDetailPage";
import CoinComparisonPage from "@pages/CoinComparisonPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/market" element={<MarketPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/coin/:coinId" element={<CoinDetailPage />} />
        <Route path="/compare" element={<CoinComparisonPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
