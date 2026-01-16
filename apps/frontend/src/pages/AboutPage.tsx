import React from 'react';

export function AboutPage() {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">About Crypture</h1>
      <div className="prose max-w-none">
        <p className="mb-4">
          Crypture is a simple and intuitive crypto portfolio tracker that helps you keep track of your cryptocurrency investments.
        </p>
        <p className="mb-4">
          Features include:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Track multiple cryptocurrencies in one place</li>
          <li>View real-time portfolio value</li>
          <li>Monitor price changes and performance</li>
        </ul>
        <p>
          Start by adding your first asset to track its performance over time.
        </p>
      </div>
    </div>
  );
}

export default AboutPage;
