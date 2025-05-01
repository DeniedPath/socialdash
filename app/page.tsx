import BasicDashboard from './components/dashboard'

export default function HomePage() {
  return (
      <main className="min-h-screen bg-gray-50 p-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>
        <BasicDashboard />
      </main>
  )
}
