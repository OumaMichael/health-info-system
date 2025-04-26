
// components/SearchClients.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function SearchClients() {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClients = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch('http://localhost:5000/api/clients');
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch clients');
        }
        
        setClients(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchClients();
  }, []);

  const filteredClients = clients.filter(client => 
    client.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Search Clients</h2>
      
      <div className="mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="Search by client name..."
        />
      </div>
      
      {error && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>}
      
      {isLoading ? (
        <div>Loading clients...</div>
      ) : filteredClients.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Name</th>
                <th className="border p-2 text-left">Age</th>
                <th className="border p-2 text-left">Gender</th>
                <th className="border p-2 text-left">Contact</th>
                <th className="border p-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map(client => (
                <tr key={client.id}>
                  <td className="border p-2">{client.fullName}</td>
                  <td className="border p-2">{client.age}</td>
                  <td className="border p-2">{client.gender}</td>
                  <td className="border p-2">{client.contactInfo}</td>
                  <td className="border p-2">
                    <Link to={`/client/${client.id}`} className="text-blue-600 hover:underline">
                      View Profile
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-4">No clients found</div>
      )}
    </div>
  );
}

export default SearchClients;

