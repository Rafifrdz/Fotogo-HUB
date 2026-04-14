import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { FrameProvider } from './context/FrameContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <FrameProvider>
        <App />
      </FrameProvider>
    </AuthProvider>
  </StrictMode>,
);
