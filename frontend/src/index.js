import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Google Analytics
const GA_MEASUREMENT_ID = 'G-J60109867M';

const script = document.createElement('script');
script.async = true;
script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
document.head.appendChild(script);

window.dataLayer = window.dataLayer || [];

function gtag() {
  window.dataLayer.push(arguments);
}

gtag('js', new Date());
gtag('config', GA_MEASUREMENT_ID);

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
