import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="text-5xl">🔐</span>
          <h1 className="text-4xl sm:text-5xl font-bold font-brand">Crypture</h1>
        </div>
        <p className="text-lg text-white/80 mb-10">
          Track your crypto portfolio clearly. Simple. Fast. Accessible.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            to="/portfolio"
            className="bg-white text-slate-900 font-semibold px-6 py-3 rounded-lg shadow hover:shadow-md focus-ring tap-44"
          >
            View Portfolio
          </Link>
          <Link
            to="/about"
            className="border border-white/30 text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/10 focus-ring tap-44"
          >
            About
          </Link>
        </div>
      </section>
    </main>
  );
}
