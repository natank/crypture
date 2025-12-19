import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ComparisonTable } from "@components/CoinComparison/ComparisonTable";
import type { CoinDetails } from "types/market";

const createMockCoinDetails = (overrides: Partial<CoinDetails> = {}): CoinDetails => ({
  id: "bitcoin",
  symbol: "btc",
  name: "Bitcoin",
  image: {
    thumb: "https://example.com/btc-thumb.png",
    small: "https://example.com/btc-small.png",
    large: "https://example.com/btc-large.png",
  },
  description: { en: "Bitcoin description" },
  links: {
    homepage: ["https://bitcoin.org"],
    whitepaper: "https://bitcoin.org/whitepaper.pdf",
    blockchain_site: ["https://blockchain.info"],
    twitter_screen_name: "bitcoin",
    subreddit_url: "https://reddit.com/r/bitcoin",
    repos_url: { github: ["https://github.com/bitcoin/bitcoin"] },
  },
  categories: ["Cryptocurrency"],
  market_cap_rank: 1,
  market_data: {
    current_price: { usd: 50000 },
    market_cap: { usd: 1000000000000 },
    total_volume: { usd: 50000000000 },
    high_24h: { usd: 51000 },
    low_24h: { usd: 49000 },
    price_change_percentage_24h: 5.5,
    price_change_percentage_7d: 10.2,
    price_change_percentage_30d: 15.3,
    ath: { usd: 69000 },
    ath_date: { usd: "2021-11-10T00:00:00.000Z" },
    ath_change_percentage: { usd: -27.5 },
    atl: { usd: 67 },
    atl_date: { usd: "2013-07-05T00:00:00.000Z" },
    atl_change_percentage: { usd: 74527 },
    circulating_supply: 19000000,
    total_supply: 21000000,
    max_supply: 21000000,
  },
  ...overrides,
});

const mockBitcoin = createMockCoinDetails();
const mockEthereum = createMockCoinDetails({
  id: "ethereum",
  symbol: "eth",
  name: "Ethereum",
  image: {
    thumb: "https://example.com/eth-thumb.png",
    small: "https://example.com/eth-small.png",
    large: "https://example.com/eth-large.png",
  },
  market_cap_rank: 2,
  market_data: {
    current_price: { usd: 3000 },
    market_cap: { usd: 400000000000 },
    total_volume: { usd: 20000000000 },
    high_24h: { usd: 3100 },
    low_24h: { usd: 2900 },
    price_change_percentage_24h: -2.5,
    price_change_percentage_7d: 8.1,
    price_change_percentage_30d: 12.0,
    ath: { usd: 4800 },
    ath_date: { usd: "2021-11-10T00:00:00.000Z" },
    ath_change_percentage: { usd: -37.5 },
    atl: { usd: 0.42 },
    atl_date: { usd: "2015-10-20T00:00:00.000Z" },
    atl_change_percentage: { usd: 714185 },
    circulating_supply: 120000000,
    total_supply: null,
    max_supply: null,
  },
});

describe("ComparisonTable", () => {
  it("renders loading state when isLoading and no coins", () => {
    render(<ComparisonTable coins={[]} isLoading={true} />);

    expect(screen.getByTestId("comparison-table-loading")).toBeInTheDocument();
    const skeletons = document.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("renders nothing when no coins and not loading", () => {
    const { container } = render(<ComparisonTable coins={[]} isLoading={false} />);

    expect(container.firstChild).toBeNull();
  });

  it("renders table with coin headers", () => {
    render(<ComparisonTable coins={[mockBitcoin, mockEthereum]} isLoading={false} />);

    expect(screen.getByTestId("comparison-table")).toBeInTheDocument();
    expect(screen.getByText("Bitcoin")).toBeInTheDocument();
    expect(screen.getByText("Ethereum")).toBeInTheDocument();
  });

  it("renders all metric labels", () => {
    render(<ComparisonTable coins={[mockBitcoin]} isLoading={false} />);

    expect(screen.getByText("Price")).toBeInTheDocument();
    expect(screen.getByText("Market Cap")).toBeInTheDocument();
    expect(screen.getByText("24h Volume")).toBeInTheDocument();
    expect(screen.getByText("24h Change")).toBeInTheDocument();
    expect(screen.getByText("7d Change")).toBeInTheDocument();
    expect(screen.getByText("30d Change")).toBeInTheDocument();
    expect(screen.getByText("All-Time High")).toBeInTheDocument();
    expect(screen.getByText("All-Time Low")).toBeInTheDocument();
    expect(screen.getByText("Circulating Supply")).toBeInTheDocument();
    expect(screen.getByText("Total Supply")).toBeInTheDocument();
    expect(screen.getByText("Max Supply")).toBeInTheDocument();
  });

  it("formats currency values correctly", () => {
    render(<ComparisonTable coins={[mockBitcoin]} isLoading={false} />);

    // Price should be formatted as currency
    expect(screen.getByText("$50,000.00")).toBeInTheDocument();
  });

  it("formats percentage values correctly", () => {
    render(<ComparisonTable coins={[mockBitcoin]} isLoading={false} />);

    // 24h change should be formatted as percentage
    expect(screen.getByText("5.50%")).toBeInTheDocument();
  });

  it("highlights best performer with success styling", () => {
    render(<ComparisonTable coins={[mockBitcoin, mockEthereum]} isLoading={false} />);

    // Bitcoin has higher price, should be highlighted
    // Find the cell with Bitcoin's price that has success styling
    const priceCells = screen.getAllByText("$50,000.00");
    const bitcoinPriceCell = priceCells[0].closest("td");
    expect(bitcoinPriceCell).toHaveClass("text-success");
  });

  it("shows negative percentages with error styling", () => {
    render(<ComparisonTable coins={[mockEthereum]} isLoading={false} />);

    // Ethereum has negative 24h change
    const negativeChange = screen.getByText("-2.50%");
    expect(negativeChange.closest("td")).toHaveClass("text-error");
  });

  it("shows positive percentages with success styling", () => {
    render(<ComparisonTable coins={[mockBitcoin]} isLoading={false} />);

    // Bitcoin has positive 24h change
    const positiveChange = screen.getByText("5.50%");
    expect(positiveChange.closest("td")).toHaveClass("text-success");
  });

  it("renders coin images in headers", () => {
    render(<ComparisonTable coins={[mockBitcoin, mockEthereum]} isLoading={false} />);

    const images = document.querySelectorAll("thead img");
    expect(images).toHaveLength(2);
  });

  it("handles null supply values gracefully", () => {
    render(<ComparisonTable coins={[mockEthereum]} isLoading={false} />);

    // Ethereum has null total_supply and max_supply
    const naCells = screen.getAllByText("N/A");
    expect(naCells.length).toBeGreaterThanOrEqual(2);
  });

  it("has accessible table heading", () => {
    render(<ComparisonTable coins={[mockBitcoin]} isLoading={false} />);

    expect(screen.getByText("Comparison Table")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Comparison Table" })).toBeInTheDocument();
  });
});
