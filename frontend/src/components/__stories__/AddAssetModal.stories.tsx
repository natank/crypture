import React from "react";
import { AddAssetModal } from "@components/AddAssetModal";
import { PortfolioAsset } from "@hooks/usePortfolioState";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { MockCoinProvider } from "@components/__mocks__/MockCoinProvider";

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

export const Default: Story = {
  render: () => (
    <MockCoinProvider>
      <AddAssetModal onClose={mockOnClose} addAsset={mockAddAsset} />
    </MockCoinProvider>
  ),
};

export const WithError: Story = {
  render: () => (
    <MockCoinProvider>
      <AddAssetModal
        onClose={mockOnClose}
        addAsset={() => {
          throw new Error("Invalid asset quantity");
        }}
      />
    </MockCoinProvider>
  ),
};

export const LoadingState: Story = {
  render: () => (
    <MockCoinProvider value={{ loading: true, coins: [] }}>
      <AddAssetModal
        onClose={mockOnClose}
        addAsset={async () => {
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }}
      />
    </MockCoinProvider>
  ),
};

export const CoinFetchError: Story = {
  render: () => (
    <MockCoinProvider value={{ error: "Failed to fetch coins", coins: [] }}>
      <AddAssetModal onClose={mockOnClose} addAsset={mockAddAsset} />
    </MockCoinProvider>
  ),
};
