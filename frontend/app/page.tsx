import CalculatorTabs from '@/components/CalculatorTabs'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Financial Calculators
          </h1>
          <p className="text-gray-600">
            Plan your financial goals with professional-grade calculators
          </p>
        </header>
        
        <CalculatorTabs />
      </div>
    </main>
  )
}
