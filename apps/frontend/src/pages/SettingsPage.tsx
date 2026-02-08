import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CategorySettings } from '@components/settings/CategorySettings';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'categories' | 'general'>('categories');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/portfolio" 
            className="text-brand-primary hover:text-brand-primary/80 text-sm font-medium mb-4 inline-block"
          >
            ← Back to Portfolio
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Customize your portfolio experience
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('categories')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'categories'
                  ? 'border-brand-primary text-brand-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              Categories
            </button>
            <button
              onClick={() => setActiveTab('general')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'general'
                  ? 'border-brand-primary text-brand-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              General
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          {activeTab === 'categories' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                Category Display Settings
              </h2>
              <CategorySettings />
            </div>
          )}

          {activeTab === 'general' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                General Settings
              </h2>
              <div className="text-gray-600 dark:text-gray-300">
                <p>More settings coming soon...</p>
                <p className="mt-2 text-sm">
                  Currently you can customize how categories are displayed in your portfolio composition.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
