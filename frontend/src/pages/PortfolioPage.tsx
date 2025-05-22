import React, { useState } from "react";

export default function PortfolioPage() {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <main className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Total Portfolio Value */}
      <header>
        <h1 className="text-xl font-semibold text-gray-900">
          💰 Total Portfolio Value: $0.00
        </h1>
      </header>

      {/* Sort/Filter Bar */}
      <section className="flex flex-wrap items-center gap-4 mb-4">
        <div className="relative w-full sm:w-64">
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
            🔍
          </span>
          <input
            type="text"
            placeholder="Filter assets..."
            className="pl-10 pr-3 py-2 border border-gray-200 rounded-md w-full text-base text-gray-900 placeholder:text-gray-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="sort-order" className="text-base text-gray-700">
            Sort:
          </label>
          <select
            id="sort-order"
            className="px-3 py-2 border border-gray-200 rounded-md bg-white text-base sm:w-48 w-full"
          >
            <option>Value ⬇</option>
            <option>Value ⬆</option>
            <option>Name A–Z</option>
            <option>Name Z–A</option>
          </select>
        </div>
      </section>

      {/* Asset List */}
      <section className="divide-y divide-gray-200">
        <div className="flex justify-between items-center py-2">
          <div>
            <div className="text-base font-medium text-gray-900">BTC</div>
            <div className="text-sm text-gray-600">Qty: 0.5</div>
          </div>
          <div className="text-right">
            <div className="text-base font-semibold">$30,000</div>
            <div className="text-base font-semibold">$15,000</div>
          </div>
          <button
            aria-label="Delete BTC"
            className="p-2 rounded-full text-red-600 hover:bg-gray-100"
          >
            🗑️
          </button>
        </div>
      </section>

      {/* Footer Action Buttons */}
      <footer className="flex gap-4 justify-end mt-4">
        <button
          onClick={() => setModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          ➕ Add Asset
        </button>
        <button className="bg-gray-100 text-gray-900 px-4 py-2 rounded-md hover:bg-gray-200">
          📄 Export
        </button>
        <button className="bg-gray-100 text-gray-900 px-4 py-2 rounded-md hover:bg-gray-200">
          📅 Import
        </button>
      </footer>

      {/* Stub Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white p-6 rounded-2xl shadow-lg max-w-md mx-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Add Crypto Asset
            </h2>
            <p className="text-sm text-gray-500">(Modal stub)</p>
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setModalOpen(false)}
                className="bg-gray-100 text-gray-900 px-4 py-2 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
