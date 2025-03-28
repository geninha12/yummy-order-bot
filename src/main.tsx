
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { initWebhookInterceptor } from './utils/webhookInterceptor';

// Inicializar o interceptor de webhook em ambiente de desenvolvimento
initWebhookInterceptor();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="color-theme">
      <App />
      <Toaster />
    </ThemeProvider>
  </React.StrictMode>,
);
