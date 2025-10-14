import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { StudentAuthProvider } from './context/studentAuthContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <StudentAuthProvider>
      <App />
    </StudentAuthProvider>
  </React.StrictMode>
);
