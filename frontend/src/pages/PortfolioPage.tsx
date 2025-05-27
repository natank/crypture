import { AddAssetModal } from "@components/AddAssetModal";
import AssetRow from "@components/AssetRow";
import FilterSortControls from "@components/FilterSortControls";
import PortfolioHeader from "@components/PortfolioHeader";
import { usePortfolioState } from "@hooks/usePortfolioState";
import { useState } from "react";

export default function PortfolioPage() {
  const {
    portfolio,
    addAsset,
    showModal,
    openModal,
    closeModal,
    addButtonRef,
  } = usePortfolioState();

  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("value-desc");

  const handleDeleteAsset = (id: string) => {
    // 🔜 Replace with real delete logic (e.g., from usePortfolioState)
    console.log("delete asset", id);
  };
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6 bg-white">
      <PortfolioHeader totalValue={null} />

      <main role="main" className="space-y-6">
        {/* 🔍 Filter & Sort */}
        <FilterSortControls
          filter={filter}
          onFilterChange={setFilter}
          sort={sort}
          onSortChange={setSort}
        />

        {/* 📋 Asset List Header + Add Button */}
        <div className="flex justify-between items-center">
          <h2 className="text-base font-medium text-gray-900">Your Assets</h2>
          <button
            ref={addButtonRef}
            onClick={openModal}
            className="bg-blue-100 text-blue-900 font-button px-4 py-2 rounded-md hover:bg-blue-200"
            data-testid="add-asset-button"
          >
            ➕ Add Asset
          </button>
        </div>

        {/* 📊 Asset List */}
        <div className="divide-y divide-gray-200">
          {portfolio.length === 0 ? (
            <div className="text-gray-800 italic">
              No assets yet. Add one to begin.
            </div>
          ) : (
            portfolio.map((asset) => (
              <AssetRow
                key={asset.id}
                asset={asset}
                onDelete={handleDeleteAsset}
              />
            ))
          )}
        </div>

        {/* 📤 Footer Action Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            className="bg-gray-100 text-gray-900 font-button px-4 py-2 rounded-md hover:bg-gray-200"
            data-testid="export-button"
            aria-label="Export Portfolio"
          >
            📤 Export
          </button>
          <button
            className="bg-gray-100 text-gray-900 font-button px-4 py-2 rounded-md hover:bg-gray-200"
            data-testid="import-button"
            aria-label="Import Portfolio"
          >
            📥 Import
          </button>
        </div>
      </main>

      {/* ➕ Add Asset Modal */}
      {showModal && <AddAssetModal onClose={closeModal} addAsset={addAsset} />}
    </div>
  );
}
