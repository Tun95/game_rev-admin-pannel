import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import { ContextProvider } from './context/Context';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ContextProvider>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </ContextProvider>
);


