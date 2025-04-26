"use client"
import QuickActionCard from "./QuickActionCard"

function Dashboard({ setActivePage, stats }) {
  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg text-gray-400">Total Clients</h3>
          <p className="text-4xl font-bold mt-2">{stats.totalClients}</p>
          <button onClick={() => setActivePage("clients")} className="text-blue-400 mt-4 hover:underline">
            View Clients
          </button>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg text-gray-400">Health Programs</h3>
          <p className="text-4xl font-bold mt-2">{stats.totalPrograms}</p>
          <button onClick={() => setActivePage("programs")} className="text-blue-400 mt-4 hover:underline">
            View Programs
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickActionCard
            icon="user-plus"
            title="Register Client"
            description="Add a new client to the system"
            onClick={() => setActivePage("registerClient")}
          />
          <QuickActionCard
            icon="plus-circle"
            title="Create Program"
            description="Create a new health program"
            onClick={() => setActivePage("createProgram")}
          />
          <QuickActionCard
            icon="search"
            title="Search Clients"
            description="Find and manage clients"
            onClick={() => setActivePage("clients")}
          />
          <QuickActionCard
            icon="list"
            title="View Programs"
            description="Manage health programs"
            onClick={() => setActivePage("programs")}
          />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
