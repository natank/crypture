import { CoinProvider } from "@context/CoinProvider";
import "./App.css";
import PortfolioPage from "@pages/PortfolioPage";

function App() {
  return (
    <CoinProvider>
      <PortfolioPage />
    </CoinProvider>
  );
}

export default App;
