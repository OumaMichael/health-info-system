"use client"

import { useState } from "react"

const EnrollClient = ({ client, programs = [], onEnroll }) => {
  const [selectedProgram, setSelectedProgram] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedProgram) return

    setLoading(true)
    setError(null)

    try {
      await onEnroll(client.id, selectedProgram)
      setSelectedProgram("")
    } catch (err) {
      setError("Failed to enroll client. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (programs.length === 0) {
    return (
      <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
        <p className="text-gray-400">This client is already enrolled in all available programs or no programs exist.</p>
      </div>
    )
  }

  return (
    <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-2">Select Program</label>
          <select
            className="w-full p-2 border rounded bg-gray-700 text-white border-gray-600 focus:outline-none focus:border-blue-500"
            value={selectedProgram}
            onChange={(e) => setSelectedProgram(e.target.value)}
            required
          >
            <option value="">Select a program</option>
            {programs.map((program) => (
              <option key={program.id} value={program.id}>
                {program.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 w-full"
          disabled={loading || !selectedProgram}
        >
          {loading ? "Enrolling..." : "Enroll Client"}
        </button>
      </form>
    </div>
  )
}

export default EnrollClient
