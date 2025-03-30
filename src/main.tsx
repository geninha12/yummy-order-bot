
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { initWebhookInterceptor } from './utils/webhookInterceptor';

// Inicializar o interceptor de webhook em ambiente de desenvolvimento
console.log('[Main] Iniciando aplicação...');
console.log('[Main] Ambiente:', process.env.NODE_ENV);

// Preparar para uso com ngrok
const isLocalDevelopment = () => {
  return process.env.NODE_ENV === 'development' || 
         window.location.hostname === 'localhost' || 
         window.location.hostname.includes('127.0.0.1');
};

try {
  console.log('[Main] Tentando inicializar interceptor de webhook...');
  
  if (isLocalDevelopment()) {
    console.log('[Main] Detectado ambiente de desenvolvimento local. Interceptor será inicializado.');
    initWebhookInterceptor();
    console.log('[Main] Interceptor inicializado com sucesso');
    
    // Log de ajuda para ambiente de desenvolvimento
    console.log('[Main] IMPORTANTE: Para testar com ngrok, siga estas etapas:');
    console.log('[Main] 1. Execute o ngrok: ngrok http 8080');
    console.log('[Main] 2. Copie a URL HTTPS fornecida pelo ngrok');
    console.log('[Main] 3. Configure-a na seção de Desenvolvimento do painel Webhook');
    console.log('[Main] 4. Configure o webhook no painel do Meta Developers com a URL do ngrok');
  } else {
    console.log('[Main] Ambiente de produção detectado. O interceptor não é necessário.');
  }
} catch (error) {
  console.error('[Main] Erro ao inicializar interceptor de webhook:', error);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="color-theme">
      <App />
      <Toaster />
    </ThemeProvider>
  </React.StrictMode>,
);
