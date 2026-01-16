import React, { useState } from "react";
import { AddAssetModal } from "@components/AddAssetModal";
import { PortfolioAsset } from "@hooks/usePortfolioState";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { CoinInfo } from "@services/coinService";

const meta: Meta<typeof AddAssetModal> = {
  title: "Modals/AddAssetModal",
  component: AddAssetModal,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof AddAssetModal>;

const mockAddAsset = (asset: PortfolioAsset) => {
  console.log("Mock Add Asset:", asset);
};

const mockOnClose = () => {
  console.log("Modal closed");
};

const mockCoins: CoinInfo[] = [
  {
    id: "bitcoin",
    symbol: "btc",
    name: "Bitcoin",
    current_price: 30000,
  },
  {
    id: "ethereum",
    symbol: "eth",
    name: "Ethereum",
    current_price: 2000,
  },
];

export const Default: Story = {
  render: () => {
    const [search, setSearch] = useState("");
    return (
      <AddAssetModal
        onClose={mockOnClose}
        addAsset={mockAddAsset}
        coins={mockCoins}
        search={search}
        setSearch={setSearch}
      />
    );
  },
};

export const WithError: Story = {
  render: () => {
    const [search, setSearch] = useState("");
    return (
      <AddAssetModal
        onClose={mockOnClose}
        addAsset={() => {
          throw new Error("Invalid asset quantity");
        }}
        coins={mockCoins}
        search={search}
        setSearch={setSearch}
      />
    );
  },
};

export const LoadingState: Story = {
  render: () => {
    const [search, setSearch] = useState("");
    return (
      <AddAssetModal
        onClose={mockOnClose}
        addAsset={async () => {
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }}
        coins={[]}
        search={search}
        setSearch={setSearch}
      />
    );
  },
};

export const CoinFetchError: Story = {
  render: () => {
    const [search, setSearch] = useState("");
    return (
      <AddAssetModal
        onClose={mockOnClose}
        addAsset={mockAddAsset}
        coins={[]} // no coins
        search={search}
        setSearch={setSearch}
      />
    );
  },
};
