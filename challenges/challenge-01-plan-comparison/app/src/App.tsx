import { useState } from 'react'
import { plans } from './data/plans'
import { ComparisonTable } from './components/ComparisonTable'

function App() {
  const [compareMode, setCompareMode] = useState(false)

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Insurance Plan Tiers</h1>
            <p className="text-sm text-gray-500 mt-1">
              Compare coverage, limits, and pricing across our three plan tiers.
            </p>
          </div>
          <button
            onClick={() => setCompareMode(v => !v)}
            className={`shrink-0 min-w-[130px] px-4 py-2 text-sm font-medium rounded-lg border transition-colors cursor-pointer ${
              compareMode
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {compareMode ? 'Hide Rankings' : 'Compare'}
          </button>
        </header>
        <ComparisonTable plans={plans} compareMode={compareMode} />
      </div>
    </div>
  )
}

export default App
