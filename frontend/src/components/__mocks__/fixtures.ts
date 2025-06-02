export const mockCoins = [
  { id: "bitcoin", symbol: "BTC", name: "Bitcoin", current_price: 30000 },
  { id: "ethereum", symbol: "ETH", name: "Ethereum", current_price: 2000 },
];

export const mockPriceMap = {
  bitcoin: 30000,
  ethereum: 2000,
};

export const mockCoinContextValue = {
  coins: mockCoins,
  originalCoins: mockCoins,
  priceMap: mockPriceMap,
  loading: false,
  error: null,
  search: "",
  setSearch: () => {},
};
