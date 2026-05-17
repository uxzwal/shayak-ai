/**
 * Sahayak AI - React Entry Point
 * Initializes the React application with Tailwind CSS
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Create root and render app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register custom service worker for offline support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register(`${process.env.PUBLIC_URL}/service-worker.js`)
      .catch(error => {
        console.error('Service worker registration failed:', error);
      });
  });
}
