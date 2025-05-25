import { AddAssetModal } from "@components/AddAssetModal";
import { usePortfolio } from "@hooks/usePortfolio";
import { useRef, useState } from "react";

export default function PortfolioPage() {
  const { portfolio, addAsset } = usePortfolio();
  const [showModal, setShowModal] = useState(false);
  const addButtonRef = useRef<HTMLButtonElement | null>(null);
  const handleCloseModal = () => {
    setShowModal(false);
    setTimeout(() => {
      addButtonRef.current?.focus();
    }, 0); // let modal fully unmount before focusing
  };
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6 bg-white">
      <header role="banner">
        <h1 className="text-xl font-semibold text-gray-900">
          💰 Total Portfolio Value
        </h1>
      </header>

      <main role="main" className="space-y-6">
        {/* 🔍 Filter & Sort */}
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="flex flex-col sm:block">
            <label
              htmlFor="filter-assets"
              className="block text-sm font-medium text-gray-700"
            >
              Filter assets
            </label>
            <input
              id="filter-assets"
              type="text"
              placeholder="Filter assets..."
              className="px-3 py-2 border border-gray-200 rounded-md w-full sm:w-64 placeholder:text-gray-700"
              data-testid="filter-input"
            />
          </div>

          <div className="flex items-center gap-2">
            <label
              htmlFor="sort-assets"
              className="block text-sm font-medium text-gray-700"
            >
              Sort by
            </label>
            <select
              id="sort-assets"
              className="px-3 py-2 border border-gray-200 rounded-md bg-white sm:w-48 w-full text-gray-900"
              data-testid="sort-dropdown"
            >
              <option>Sort by Value ⬇</option>
              <option>Sort by Value ⬆</option>
              <option>Name A–Z</option>
              <option>Name Z–A</option>
            </select>
          </div>
        </div>

        {/* 📋 Asset List Header + Add Button */}
        <div className="flex justify-between items-center">
          <h2 className="text-base font-medium text-gray-900">Your Assets</h2>
          <button
            ref={addButtonRef}
            onClick={() => setShowModal(true)}
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
              <div
                key={asset.id}
                className="flex justify-between items-center py-2"
              >
                <div>
                  <div className="text-base font-medium text-gray-900">
                    {asset.symbol.toUpperCase()} ({asset.name})
                  </div>
                  <div className="text-sm text-gray-800">
                    Qty: {asset.quantity}
                  </div>
                </div>
                <div className="text-right text-sm text-gray-900 italic">
                  Price: — <br />
                  Total: —
                </div>
                <button
                  className="p-2 rounded-full hover:bg-gray-100 text-red-600"
                  aria-label={`Delete ${asset.symbol.toUpperCase()}`}
                  title={`Delete ${asset.symbol.toUpperCase()}`}
                >
                  🗑️
                </button>
              </div>
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
      {showModal && (
        <AddAssetModal onClose={handleCloseModal} addAsset={addAsset} />
      )}
    </div>
  );
}
