import { useState } from 'react'
import { plans } from './data/plans'
import { ComparisonTable } from './components/ComparisonTable'

function App() {
  const [compareMode, setCompareMode] = useState(false)

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Insurance Plan Tiers</h1>
          <button
            onClick={() => setCompareMode(v => !v)}
            className={`min-w-[130px] px-4 py-2 text-sm font-medium rounded-lg border transition-colors cursor-pointer ${
              compareMode
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {compareMode ? 'Hide Rankings' : 'Compare'}
          </button>
        </div>
        <ComparisonTable plans={plans} compareMode={compareMode} />
      </div>
    </div>
  )
}

export default App
