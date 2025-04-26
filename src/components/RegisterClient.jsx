"use client"

import { useState } from "react"

const RegisterClient = ({ setActivePage, onClientRegistered }) => {
  const [client, setClient] = useState({
    first_name: "",
    last_name: "",
    date_of_birth: "",
    gender: "",
    contact_number: "",
    address: "",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setClient((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch("http://localhost:5000/api/clients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(client),
      })

      if (!response.ok) {
        throw new Error("Failed to register client")
      }

      setSuccess(true)
      if (onClientRegistered) onClientRegistered()

      setClient({
        first_name: "",
        last_name: "",
        date_of_birth: "",
        gender: "",
        contact_number: "",
        address: "",
      })

      // Redirect to clients list after 2 seconds
      setTimeout(() => {
        setActivePage("clients")
      }, 2000)
    } catch (err) {
      console.error(err)
      setError("Failed to register client. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Register New Client</h2>

      {error && <p className="text-red-500 mb-4 p-3 bg-red-900/30 rounded-md">{error}</p>}
      {success && <p className="text-green-400 mb-4 p-3 bg-green-900/30 rounded-md">Client registered successfully!</p>}

      <form onSubmit={handleSubmit} className="space-y-4 bg-gray-800 p-6 rounded-lg border border-gray-700">
        <div>
          <label className="block text-sm mb-1">First Name</label>
          <input
            name="first_name"
            type="text"
            placeholder="First Name"
            className="w-full p-2 border rounded bg-gray-700 text-white border-gray-600 focus:outline-none focus:border-blue-500"
            value={client.first_name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Last Name</label>
          <input
            name="last_name"
            type="text"
            placeholder="Last Name"
            className="w-full p-2 border rounded bg-gray-700 text-white border-gray-600 focus:outline-none focus:border-blue-500"
            value={client.last_name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Date of Birth</label>
          <input
            name="date_of_birth"
            type="date"
            className="w-full p-2 border rounded bg-gray-700 text-white border-gray-600 focus:outline-none focus:border-blue-500"
            value={client.date_of_birth}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Gender</label>
          <select
            name="gender"
            className="w-full p-2 border rounded bg-gray-700 text-white border-gray-600 focus:outline-none focus:border-blue-500"
            value={client.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">Contact Number</label>
          <input
            name="contact_number"
            type="tel"
            placeholder="Contact Number"
            className="w-full p-2 border rounded bg-gray-700 text-white border-gray-600 focus:outline-none focus:border-blue-500"
            value={client.contact_number}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Address</label>
          <textarea
            name="address"
            placeholder="Address"
            rows="3"
            className="w-full p-2 border rounded bg-gray-700 text-white border-gray-600 focus:outline-none focus:border-blue-500"
            value={client.address}
            onChange={handleChange}
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register Client"}
        </button>
      </form>
    </div>
  )
}

export default RegisterClient
