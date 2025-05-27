import { PortfolioPageProvider } from "@context/portfolioPageContext";
import "./App.css";
import PortfolioPage from "@pages/PortfolioPage";

function App() {
  console.log("in App!!");
  return (
    <PortfolioPageProvider>
      <PortfolioPage />
    </PortfolioPageProvider>
  );
}

export default App;
