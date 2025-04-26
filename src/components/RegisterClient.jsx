// components/RegisterClient.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RegisterClient() {
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    gender: '',
    contactInfo: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5000/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to register client');
      }
      
      // Navigate to the client profile page
      navigate(`/client/${data.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">Register New Client</h2>
      
      {error && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Enter client's full name"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block mb-2">Age</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Enter age"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block mb-2">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block mb-2">Contact Information</label>
          <input
            type="text"
            name="contactInfo"
            value={formData.contactInfo}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Phone number or email"
            required
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-black text-white p-2 rounded"
          disabled={isLoading}
        >
          {isLoading ? 'Registering...' : 'Register Client'}
        </button>
      </form>
    </div>
  );
}

export default RegisterClient;

