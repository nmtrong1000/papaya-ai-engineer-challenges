import { useState } from 'react'
import { plans } from './data/plans'
import { ComparisonTable } from './components/ComparisonTable'

function App() {
  const [compareMode, setCompareMode] = useState(false)

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="flex justify-end mb-4">
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
  )
}

export default App
