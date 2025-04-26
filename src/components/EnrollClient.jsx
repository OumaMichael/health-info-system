
// components/EnrollClient.js
import React, { useState, useEffect } from 'react';

function EnrollClient() {
  const [clients, setClients] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Fetch clients and programs
    const fetchData = async () => {
      try {
        const [clientsResponse, programsResponse] = await Promise.all([
          fetch('http://localhost:5000/api/clients'),
          fetch('http://localhost:5000/api/programs')
        ]);
        
        const clientsData = await clientsResponse.json();
        const programsData = await programsResponse.json();
        
        if (!clientsResponse.ok) {
          throw new Error('Failed to fetch clients');
        }
        if (!programsResponse.ok) {
          throw new Error('Failed to fetch programs');
        }
        
        setClients(clientsData);
        setPrograms(programsData);
      } catch (err) {
        setError(err.message);
      }
    };
    
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const response = await fetch('http://localhost:5000/api/enrollments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientId: selectedClient,
          programId: selectedProgram
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to enroll client');
      }
      
      setSuccess(true);
      setSelectedClient('');
      setSelectedProgram('');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">Enroll Client in Program</h2>
      
      {error && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>}
      {success && <div className="bg-green-100 text-green-700 p-3 mb-4 rounded">Client enrolled successfully!</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2">Select Client</label>
          <select
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Select a client</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>{client.fullName}</option>
            ))}
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block mb-2">Select Program</label>
          <select
            value={selectedProgram}
            onChange={(e) => setSelectedProgram(e.target.value)}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Select a program</option>
            {programs.map(program => (
              <option key={program.id} value={program.id}>{program.name}</option>
            ))}
          </select>
        </div>
        
        <button
          type="submit"
          className="w-full bg-gray-500 text-white p-2 rounded"
          disabled={isLoading}
        >
          {isLoading ? 'Enrolling...' : 'Enroll Client in Program'}
        </button>
      </form>
    </div>
  );
}

export default EnrollClient;
