import { useState } from "react";
import { CoinInfo } from "@services/coinService";
import { validateAsset } from "@utils/validateAsset";
import type { PortfolioAsset } from "@hooks/useUIState";

/**
 * Custom hook to manage Add Asset form logic.
 *
 * @param onSubmit - Callback to submit a new PortfolioAsset
 * @param onClose - Callback to close the modal
 */
export function useAddAssetForm(
  onSubmit: (asset: PortfolioAsset) => void,
  onClose: () => void
) {
  const [selectedCoin, setSelectedCoin] = useState<CoinInfo | null>(null);
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    const parsedQuantity = parseFloat(quantity);

    const result = validateAsset({
      ...selectedCoin,
      quantity: parsedQuantity,
    });

    if (!result.valid) {
      setError(result.errors.map((e) => e.message).join(" "));
      return;
    }

    setLoading(true);
    try {
      onSubmit({ ...selectedCoin!, quantity: parsedQuantity });
      onClose();
    } catch {
      setError("Failed to add asset. Please try again.");
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
