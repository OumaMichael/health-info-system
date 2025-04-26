// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import RegisterClient from './components/RegisterClient';
import CreateProgram from './components/CreateProgram';
import EnrollClient from './components/EnrollClient';
import SearchClients from './components/SearchClients';
import ClientProfile from './components/ClientProfile';

function App() {
  return (
    <Router>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Health Information System</h1>
        
        <nav className="flex justify-center mb-8">
          <div className="flex space-x-4">
            <Link to="/register" className="bg-gray-200 px-4 py-2 rounded">Register Client</Link>
            <Link to="/create-program" className="bg-gray-200 px-4 py-2 rounded">Create Program</Link>
            <Link to="/enroll" className="bg-gray-200 px-4 py-2 rounded">Enroll Client</Link>
            <Link to="/search" className="bg-gray-200 px-4 py-2 rounded">Search Clients</Link>
          </div>
        </nav>
        
        <Routes>
          <Route path="/register" element={<RegisterClient />} />
          <Route path="/create-program" element={<CreateProgram />} />
          <Route path="/enroll" element={<EnrollClient />} />
          <Route path="/search" element={<SearchClients />} />
          <Route path="/client/:id" element={<ClientProfile />} />
          <Route path="/" element={<div className="text-center">Welcome to the Health Information System</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;