// src/App.tsx
import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ComparisonTable from './components/ComparisonTable';
import { ComparisonResponse, SelectionState } from './types';
import { fetchComparisonDetails } from './services/api';

const App: React.FC = () => {
  const [comparisonData, setComparisonData] = useState<ComparisonResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCompare = async (sel1: SelectionState, sel2: SelectionState) => {
    setIsLoading(true);
    setComparisonData(null);
    try {
      const data = await fetchComparisonDetails(sel1, sel2);
      setComparisonData(data);
    } catch (error) {
      console.error('Error fetching comparison details:', error);
      alert('Failed to fetch comparison details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-sky-50 overflow-hidden font-sans text-slate-900">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar onCompare={handleCompare} isLoading={isLoading} />
        <main className="flex-1 overflow-auto p-4 md:p-8 lg:p-10 relative">
          <div className="max-w-6xl mx-auto pb-10">
            <div className="mb-4 md:mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Comparison Result</h2>
              <p className="text-sm text-slate-500">
                Detailed breakdown of features and specifications.
              </p>
            </div>

            {isLoading && (
              <div className="absolute inset-0 bg-sky-50/70 backdrop-blur-sm z-20 flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
                  <p className="text-blue-700 font-semibold text-sm">
                    Fetching comparison data...
                  </p>
                </div>
              </div>
            )}

            <ComparisonTable data={comparisonData} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
