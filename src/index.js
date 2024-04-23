import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './AuthProvider';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
    <AuthProvider>
      <div className="image-container"></div>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
reportWebVitals();
