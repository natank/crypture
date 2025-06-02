import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import DeleteConfirmationModal from "@components/DeleteConfirmationModal";

const meta: Meta<typeof DeleteConfirmationModal> = {
  title: "Modals/DeleteConfirmationModal",
  component: DeleteConfirmationModal,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof DeleteConfirmationModal>;

const mockConfirm = () => console.log("Confirmed deletion");
const mockCancel = () => console.log("Cancelled deletion");

export const Open: Story = {
  render: () => (
    <DeleteConfirmationModal
      isOpen={true}
      assetName="Bitcoin"
      onConfirm={mockConfirm}
      onCancel={mockCancel}
    />
  ),
};

export const Closed: Story = {
  render: () => (
    <DeleteConfirmationModal
      isOpen={false}
      assetName="Ethereum"
      onConfirm={mockConfirm}
      onCancel={mockCancel}
    />
  ),
};
