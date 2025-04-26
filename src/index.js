import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './App.css';
import './components.css';
import App from './App';


// Create a root for rendering React components
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the App component in the root
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
