import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { ZeroProvider } from "@rocicorp/zero";
import { zero } from './lib/zero';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ZeroProvider zero={zero}>
      <App />
    </ZeroProvider>
  </StrictMode>
);