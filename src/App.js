"use client"


import "./App.css"
import { useState, useEffect } from "react"
import SidebarLink from "./components/SidebarLink"
import Dashboard from "./components/Dashboard"
import ProgramsList from "./components/ProgramsList"
import CreateProgram from "./components/CreateProgram"
import SearchClients from "./components/SearchClients"
import RegisterClient from "./components/RegisterClient"
import ClientProfile from "./components/ClientProfile"
import EnrollClient from "./components/EnrollClient"

const API_URL = "http://localhost:5000/api"

function App() {
  const [activePage, setActivePage] = useState("dashboard")
  const [clientId, setClientId] = useState(null)
  const [clients, setClients] = useState([])
  const [programs, setPrograms] = useState([])
  const [selectedClient, setSelectedClient] = useState(null)
  const [stats, setStats] = useState({ totalClients: 0, totalPrograms: 0 })

  // Fetch programs
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await fetch(`${API_URL}/programs`)
        if (response.ok) {
          const data = await response.json()
          setPrograms(data)
          setStats((prev) => ({ ...prev, totalPrograms: data.length }))
        }
      } catch (error) {
        console.error("Error fetching programs:", error)
      }
    }

    fetchPrograms()
  }, [])

  // Fetch clients
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch(`${API_URL}/clients`)
        if (response.ok) {
          const data = await response.json()
          setClients(data)
          setStats((prev) => ({ ...prev, totalClients: data.length }))
        }
      } catch (error) {
        console.error("Error fetching clients:", error)
      }
    }

    fetchClients()
  }, [])

  // Fetch client details when clientId changes
  useEffect(() => {
    if (clientId) {
      const fetchClientDetails = async () => {
        try {
          const response = await fetch(`${API_URL}/clients/${clientId}`)
          if (response.ok) {
            const data = await response.json()
            setSelectedClient(data)
          }
        } catch (error) {
          console.error("Error fetching client details:", error)
        }
      }

      fetchClientDetails()
    }
  }, [clientId])

  // Handle program creation
  const handleCreateProgram = async (programData) => {
    try {
      const response = await fetch(`${API_URL}/programs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(programData),
      })

      if (response.ok) {
        const newProgram = await response.json()
        setPrograms([...programs, newProgram])
        setStats((prev) => ({ ...prev, totalPrograms: prev.totalPrograms + 1 }))
        setActivePage("programs")
      }
    } catch (error) {
      console.error("Error creating program:", error)
    }
  }

  // Handle client search
  const handleSearchClients = async (query) => {
    try {
      const response = await fetch(`${API_URL}/clients?search=${query}`)
      if (response.ok) {
        const data = await response.json()
        setClients(data)
      }
    } catch (error) {
      console.error("Error searching clients:", error)
    }
  }

  // Handle client enrollment
  const handleEnrollClient = async (clientId, programId) => {
    try {
      const response = await fetch(`${API_URL}/clients/${clientId}/enroll`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ program_id: Number.parseInt(programId) }),
      })

      if (response.ok) {
        // Refresh client details to show updated enrollments
        const clientResponse = await fetch(`${API_URL}/clients/${clientId}`)
        if (clientResponse.ok) {
          const updatedClient = await clientResponse.json()
          setSelectedClient(updatedClient)
          setActivePage("clientProfile")
        }
      }
    } catch (error) {
      console.error("Error enrolling client:", error)
    }
  }

  // Handle client selection
  const handleSelectClient = (id) => {
    setClientId(id)
    setActivePage("clientProfile")
  }

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <Dashboard setActivePage={setActivePage} stats={stats} />
      case "programs":
        return <ProgramsList programs={programs} />
      case "createProgram":
        return <CreateProgram onCreate={handleCreateProgram} />
      case "clients":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Clients</h2>
            <SearchClients onSearch={handleSearchClients} />
            <div className="mt-6">
              {clients.length > 0 ? (
                <div className="grid gap-4">
                  {clients.map((client) => (
                    <div
                      key={client.id}
                      className="p-4 bg-gray-800 rounded-lg border border-gray-700 cursor-pointer hover:bg-gray-700"
                      onClick={() => handleSelectClient(client.id)}
                    >
                      <h3 className="font-bold">
                        {client.first_name} {client.last_name}
                      </h3>
                      <p className="text-sm text-gray-400">
                        Gender: {client.gender} | DOB: {client.date_of_birth}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No clients found.</p>
              )}
            </div>
          </div>
        )
      case "registerClient":
        return (
          <RegisterClient
            setActivePage={setActivePage}
            onClientRegistered={() => {
              // Refresh clients list after registration
              fetch(`${API_URL}/clients`)
                .then((res) => res.json())
                .then((data) => {
                  setClients(data)
                  setStats((prev) => ({ ...prev, totalClients: data.length }))
                })
            }}
          />
        )
      case "clientProfile":
        return (
          <div className="p-6">
            {selectedClient ? (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold">Client Profile</h2>
                  <button
                    className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                    onClick={() => setActivePage("enrollClient")}
                  >
                    Enroll in Program
                  </button>
                </div>
                <ClientProfile client={selectedClient} />
              </>
            ) : (
              <p className="text-gray-400">Loading client profile...</p>
            )}
          </div>
        )
      case "enrollClient":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Enroll Client in Program</h2>
            {selectedClient && (
              <>
                <div className="mb-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
                  <h3 className="font-bold">
                    {selectedClient.first_name} {selectedClient.last_name}
                  </h3>
                  <p className="text-sm text-gray-400">
                    Gender: {selectedClient.gender} | DOB: {selectedClient.date_of_birth}
                  </p>
                </div>
                <EnrollClient
                  client={selectedClient}
                  programs={programs.filter(
                    (program) => !selectedClient.enrolled_programs?.some((ep) => ep.id === program.id),
                  )}
                  onEnroll={handleEnrollClient}
                />
              </>
            )}
          </div>
        )
      default:
        return <Dashboard setActivePage={setActivePage} stats={stats} />
    }
  }

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="w-52 border-r border-gray-800">
        <div className="p-4 border-b border-gray-800 font-bold">Health Management</div>
        <nav className="p-2">
          <SidebarLink
            active={activePage === "dashboard"}
            onClick={() => setActivePage("dashboard")}
            icon="home"
            text="Dashboard"
          />
          <SidebarLink
            active={activePage === "programs"}
            onClick={() => setActivePage("programs")}
            icon="clipboard"
            text="Programs"
          />
          <SidebarLink
            active={activePage === "createProgram"}
            onClick={() => setActivePage("createProgram")}
            icon="plus-circle"
            text="Create Program"
          />
          <SidebarLink
            active={activePage === "clients"}
            onClick={() => setActivePage("clients")}
            icon="users"
            text="Clients"
          />
          <SidebarLink
            active={activePage === "registerClient"}
            onClick={() => setActivePage("registerClient")}
            icon="user-plus"
            text="Register Client"
          />
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">{renderPage()}</div>
    </div>
  )
}

export default App
