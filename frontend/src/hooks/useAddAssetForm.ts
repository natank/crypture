import { useState } from "react";
import { CoinInfo } from "@services/coinService";
import { validateAsset } from "@utils/validateAsset";
import { validateQuantity } from "@utils/validateQuantity";
import { type PortfolioAsset, type PortfolioState } from "./usePortfolioState";
import { useNotifications } from "./useNotifications";
import toast from "react-hot-toast";

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
  const [showLargeQuantityWarning, setShowLargeQuantityWarning] = useState(false);
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

    // Check for large quantity - require confirmation (Phase 6)
    const LARGE_QUANTITY_THRESHOLD = 1000000;
    if (parsedQuantity > LARGE_QUANTITY_THRESHOLD) {
      setShowLargeQuantityWarning(true);
      return;
    }

    // Check for dust amount warning (non-blocking)
    const quantityValidation = validateQuantity(quantity);
    if (quantityValidation.warning && parsedQuantity < 0.00000001) {
      toast(quantityValidation.warning, {
        icon: '⚠️',
        duration: 5000,
      });
    }

    await performSubmit(parsedQuantity);
  };

  const performSubmit = async (parsedQuantity: number) => {
    if (!selectedCoin) {
      setError("Please select an asset");
      return;
    }

    setLoading(true);
    try {
      // Check if asset already exists in portfolio
      const existingAsset = portfolio?.find(
        (asset) => asset.coinInfo.id === selectedCoin.id
      );

      onSubmit({ coinInfo: selectedCoin, quantity: parsedQuantity });
      
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

  const handleConfirmLargeQuantity = () => {
    const parsedQuantity = parseFloat(quantity);
    setShowLargeQuantityWarning(false);
    // Use setTimeout to ensure state updates before submission
    setTimeout(() => {
      performSubmit(parsedQuantity);
    }, 0);
  };

  const handleCancelLargeQuantity = () => {
    setShowLargeQuantityWarning(false);
    // Keep modal open so user can fix the value
  };

  return {
    selectedCoin,
    setSelectedCoin,
    quantity,
    setQuantity,
    loading,
    error,
    handleSubmit,
    showLargeQuantityWarning,
    handleConfirmLargeQuantity,
    handleCancelLargeQuantity,
  };
}
