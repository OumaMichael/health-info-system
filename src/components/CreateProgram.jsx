"use client"

import { useState } from "react"

const CreateProgram = ({ onCreate }) => {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) return

    setLoading(true)
    setError(null)

    try {
      await onCreate({ name, description })
      setName("")
      setDescription("")
    } catch (err) {
      setError("Failed to create program. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Create New Health Program</h2>

      {error && <p className="text-red-500 mb-4 p-3 bg-red-900/30 rounded-md">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4 bg-gray-800 p-6 rounded-lg border border-gray-700">
        <div>
          <label className="block text-sm mb-1">Program Name</label>
          <input
            type="text"
            className="w-full p-2 border rounded bg-gray-700 text-white border-gray-600 focus:outline-none focus:border-blue-500"
            placeholder="e.g., TB Prevention, Malaria Control, HIV Treatment"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Program Description</label>
          <textarea
            className="w-full p-2 border rounded bg-gray-700 text-white border-gray-600 focus:outline-none focus:border-blue-500"
            placeholder="Describe the health program and its objectives..."
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
          disabled={loading || !name.trim()}
        >
          {loading ? "Creating..." : "Create Program"}
        </button>
      </form>
    </div>
  )
}

export default CreateProgram
