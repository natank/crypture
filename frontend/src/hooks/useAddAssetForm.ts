import { useState } from "react";
import { CoinInfo } from "@services/coinService";
import { validateAsset } from "@utils/validateAsset";
import { type PortfolioAsset, type PortfolioState } from "./usePortfolioState";
import { useNotifications } from "./useNotifications";

/**
 * Custom hook to manage Add Asset form logic.
 *
 * @param onSubmit - Callback to submit a new PortfolioAsset
 * @param onClose - Callback to close the modal
 * @param portfolio - Current portfolio state to check for existing assets
 */
export function useAddAssetForm(
  onSubmit: (asset: PortfolioAsset) => void,
  onClose: () => void,
  portfolio?: PortfolioState
) {
  const [selectedCoin, setSelectedCoin] = useState<CoinInfo | null>(null);
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const notifications = useNotifications();

  const handleSubmit = async () => {
    setError(null);
    const parsedQuantity = parseFloat(quantity);

    const result = validateAsset({
      ...selectedCoin,
      quantity: parsedQuantity,
    });

    if (!result.valid) {
      const errorMessage = result.errors.map((e) => e.message).join(" ");
      setError(errorMessage);
      notifications.error(`✗ ${errorMessage}`);
      return;
    }

    setLoading(true);
    try {
      // Check if asset already exists in portfolio
      const existingAsset = portfolio?.find(
        (asset) => asset.coinInfo.id === selectedCoin!.id
      );

      onSubmit({ coinInfo: selectedCoin!, quantity: parsedQuantity });
      
      // Show appropriate success message
      const symbol = selectedCoin!.symbol.toUpperCase();
      if (existingAsset) {
        const newTotal = existingAsset.quantity + parsedQuantity;
        notifications.success(
          `✓ Added ${parsedQuantity} ${symbol} (Total: ${newTotal} ${symbol})`
        );
      } else {
        notifications.success(
          `✓ Added ${parsedQuantity} ${symbol} to your portfolio`
        );
      }
      
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to add asset. Please try again.";
      setError(errorMessage);
      notifications.error(`✗ ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return {
    selectedCoin,
    setSelectedCoin,
    quantity,
    setQuantity,
    loading,
    error,
    handleSubmit,
  };
}
