"use client"

import { useState } from "react"

const SearchClients = ({ onSearch }) => {
  const [query, setQuery] = useState("")

  const handleSearch = (e) => {
    e.preventDefault()
    onSearch(query)
  }

  return (
    <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
      <form onSubmit={handleSearch} className="flex items-center space-x-2">
        <input
          type="text"
          className="flex-grow p-2 border rounded bg-gray-700 text-white border-gray-600 focus:outline-none focus:border-blue-500"
          placeholder="Search clients by name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Search
        </button>
      </form>
    </div>
  )
}

export default SearchClients
