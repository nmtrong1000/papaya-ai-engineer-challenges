import { plans } from './data/plans'
import { ComparisonTable } from './components/ComparisonTable'

function App() {
  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <ComparisonTable plans={plans} />
    </div>
  )
}

export default App
