
// Este arquivo configura um interceptor para simular o comportamento de API
// em ambiente de desenvolvimento

// Inicializa o interceptor para capturar solicitações para a rota do webhook
export const initWebhookInterceptor = () => {
  // Verificar se estamos em ambiente de browser
  if (typeof window === 'undefined') return;

  console.log('Inicializando interceptor de webhook WhatsApp...');
  
  // Este script simula um endpoint de API em desenvolvimento
  // Em produção, você teria uma rota de API real no backend
  
  // Interceptar requisições fetch para o endpoint do webhook
  const originalFetch = window.fetch;
  window.fetch = async function(input, init) {
    const url = input instanceof Request ? input.url : input.toString();
    
    // Verificar se a solicitação é para nosso endpoint de webhook
    if (url.includes('/api/whatsapp/webhook')) {
      console.log(`Interceptando solicitação para ${url}`);
      
      // Extrair método, corpo e parâmetros da consulta
      const method = init?.method || 'GET';
      const body = init?.body ? JSON.parse(init.body.toString()) : undefined;
      
      // Extrair parâmetros de consulta
      const queryParams = {};
      const urlObj = new URL(url, window.location.origin);
      urlObj.searchParams.forEach((value, key) => {
        queryParams[key] = value;
      });
      
      // Gerar ID único para esta solicitação
      const requestId = Date.now().toString();
      
      // Enviar mensagem para o componente do webhook processar
      window.postMessage({
        type: 'whatsapp-webhook-request',
        requestId,
        method,
        query: queryParams,
        body
      }, '*');
      
      // Aguardar resposta do componente
      return new Promise(resolve => {
        const handleResponse = (event) => {
          if (
            event.data &&
            event.data.type === 'whatsapp-webhook-response' &&
            event.data.requestId === requestId
          ) {
            // Remover o listener após receber a resposta
            window.removeEventListener('message', handleResponse);
            
            // Criar resposta simulada
            const { status, body } = event.data.response;
            resolve(new Response(JSON.stringify(body), {
              status,
              headers: { 'Content-Type': 'application/json' }
            }));
          }
        };
        
        // Adicionar listener para aguardar a resposta
        window.addEventListener('message', handleResponse);
      });
    }
    
    // Para outras solicitações, usar fetch normal
    return originalFetch.apply(this, [input, init]);
  };
  
  console.log('Interceptor de webhook WhatsApp inicializado com sucesso!');
};
