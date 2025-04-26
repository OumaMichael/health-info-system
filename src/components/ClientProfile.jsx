// components/ClientProfile.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function ClientProfile() {
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiEndpoint, setApiEndpoint] = useState('');

  useEffect(() => {
    const fetchClientData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const [clientResponse, enrollmentsResponse] = await Promise.all([
          fetch(`http://localhost:5000/api/clients/${id}`),
          fetch(`http://localhost:5000/api/clients/${id}/programs`)
        ]);
        
        const clientData = await clientResponse.json();
        const enrollmentsData = await enrollmentsResponse.json();
        
        if (!clientResponse.ok) {
          throw new Error(clientData.message || 'Failed to fetch client data');
        }
        if (!enrollmentsResponse.ok) {
          throw new Error(enrollmentsData.message || 'Failed to fetch enrollment data');
        }
        
        setClient(clientData);
        setEnrollments(enrollmentsData);
        setApiEndpoint(`http://localhost:5000/api/clients/${id}`);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchClientData();
  }, [id]);

  if (isLoading) {
    return <div className="text-center py-8">Loading client profile...</div>;
  }

  if (error) {
    return <div className="bg-red-100 text-red-700 p-4 rounded">{error}</div>;
  }

  if (!client) {
    return <div className="text-center py-8">Client not found</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Client Profile</h2>
      
      <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-6">
        <h3 className="text-xl font-semibold mb-4">{client.fullName}</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Age</p>
            <p>{client.age}</p>
          </div>
          <div>
            <p className="text-gray-600">Gender</p>
            <p>{client.gender}</p>
          </div>
          <div>
            <p className="text-gray-600">Contact Information</p>
            <p>{client.contactInfo}</p>
          </div>
        </div>
      </div>
      
      <h3 className="text-xl font-semibold mb-4">Enrolled Programs</h3>
      
      {enrollments.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Program Name</th>
                <th className="border p-2 text-left">Description</th>
                <th className="border p-2 text-left">Enrollment Date</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.map(enrollment => (
                <tr key={enrollment.id}>
                  <td className="border p-2">{enrollment.programName}</td>
                  <td className="border p-2">{enrollment.programDescription}</td>
                  <td className="border p-2">{new Date(enrollment.enrollmentDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-4 bg-gray-50 rounded">Not enrolled in any programs</div>
      )}
      
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-2">API Access</h3>
        <p className="mb-2">Client data can be accessed via API at:</p>
        <div className="bg-gray-100 p-3 rounded font-mono text-sm">
          {apiEndpoint}
        </div>
      </div>
    </div>
  );
}

export default ClientProfile;