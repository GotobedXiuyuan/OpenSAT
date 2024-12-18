import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const CLERK_PUBLISHABLE_KEY = 'pk_test_cG93ZXJmdWwtb3Bvc3N1bS04Ny5jbGVyay5hY2NvdW50cy5kZXYk';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <App />
    </ClerkProvider>
);

reportWebVitals();