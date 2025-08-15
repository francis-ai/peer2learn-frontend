import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { StudentAuthProvider } from './context/studentAuthContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <StudentAuthProvider>
      <App />
    </StudentAuthProvider>
  </React.StrictMode>
);
