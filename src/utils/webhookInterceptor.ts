
// Este arquivo configura um interceptor para simular o comportamento de API
// em ambiente de desenvolvimento

// Configurações do webhook
interface WebhookConfig {
  verifyToken: string;
  phoneNumberId: string;
  ngrokUrl?: string;
  useNgrok?: boolean;
}

// Armazenamento de dados do webhook
const webhookData = {
  isVerified: false,
  lastVerification: null as Date | null,
  receivedMessages: [] as any[],
  config: {
    verifyToken: 'yummy_webhook_verify_token',
    phoneNumberId: '123456789012345',
    ngrokUrl: '',
    useNgrok: false
  } as WebhookConfig
};

// Verificar se estamos em desenvolvimento
const isDevelopment = () => {
  return process.env.NODE_ENV === 'development' || 
         window.location.hostname === 'localhost' || 
         window.location.hostname.includes('127.0.0.1') ||
         window.location.hostname.includes('lovable');
};

// Inicializa o interceptor para capturar solicitações para a rota do webhook
export const initWebhookInterceptor = () => {
  // Verificar se estamos em ambiente de browser
  if (typeof window === 'undefined') return;

  console.log('[WebhookInterceptor] Inicializando interceptor de webhook WhatsApp...');
  
  // Expor dados do webhook na janela para depuração
  (window as any).webhookData = webhookData;
  
  // Verificar se o fetch já foi interceptado para evitar interceptação múltipla
  if ((window as any).__whatsappInterceptorInitialized) {
    console.log('[WebhookInterceptor] Interceptor já inicializado, pulando...');
    return;
  }
  
  // Marcar como inicializado
  (window as any).__whatsappInterceptorInitialized = true;
  
  // Carregar configurações do localStorage
  tryLoadConfigFromStorage();
  
  // Interceptar requisições fetch para o endpoint do webhook
  const originalFetch = window.fetch;
  window.fetch = async function(input, init) {
    const url = input instanceof Request ? input.url : input.toString();
    
    console.log(`[WebhookInterceptor] Requisição detectada para: ${url}`);
    
    // Se estamos em desenvolvimento e usando ngrok, não interceptamos chamadas externas reais
    // para permitir que as chamadas cheguem ao ngrok e voltem para o aplicativo local
    if (webhookData.config.useNgrok && webhookData.config.ngrokUrl) {
      // Se a URL contém ngrok, deixamos passar sem interceptar
      if (url.includes('ngrok')) {
        console.log('[WebhookInterceptor] Requisição para ngrok detectada, passando sem interceptar');
        return originalFetch.apply(this, [input, init]);
      }
    }
    
    // Detectar chamadas à API do Graph do Facebook
    if (url.includes('graph.facebook.com')) {
      console.log('[WebhookInterceptor] Detectada chamada à API do Facebook Graph');
      
      // Se for uma requisição para verificar número ou enviar mensagem (simulando ambiente de desenvolvimento)
      if (url.includes('/messages')) {
        console.log('[WebhookInterceptor] Simulando envio de mensagem WhatsApp');
        
        // Extrair corpo da requisição
        const body = init?.body ? JSON.parse(init.body.toString()) : {};
        console.log('[WebhookInterceptor] Corpo da requisição:', body);
        
        // Validar parâmetros importantes
        if (!body.to) {
          console.error('[WebhookInterceptor] Erro: Número de telefone (to) ausente no corpo da requisição');
          return Promise.resolve(new Response(JSON.stringify({
            error: {
              message: "Missing required parameter: to",
              type: "OAuthException",
              code: 100,
              error_subcode: 2018341,
              fbtrace_id: "fake_trace_id"
            }
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          }));
        }
        
        if (!body.text?.body && body.type === 'text') {
          console.error('[WebhookInterceptor] Erro: Conteúdo da mensagem ausente no corpo da requisição');
          return Promise.resolve(new Response(JSON.stringify({
            error: {
              message: "Missing required parameter: text.body",
              type: "OAuthException",
              code: 100,
              error_subcode: 2018341,
              fbtrace_id: "fake_trace_id"
            }
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          }));
        }
        
        // Em desenvolvimento, retorna resposta simulada
        // Em produção ou modo ngrok, deixa a requisição seguir para a API real
        if (isDevelopment() && !webhookData.config.useNgrok) {
          // Simular resposta bem-sucedida
          const messageId = `wamid.${Date.now()}`;
          console.log(`[WebhookInterceptor] Mensagem simulada com sucesso, ID: ${messageId}`);
          
          return Promise.resolve(new Response(JSON.stringify({
            messaging_product: "whatsapp",
            contacts: [{ input: body.to, wa_id: body.to }],
            messages: [{ id: messageId }]
          }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          }));
        } else {
          console.log('[WebhookInterceptor] Modo real: passando requisição para a API do WhatsApp');
        }
      }
      
      // Se for uma requisição para obter informações da conta
      if (url.match(/\/v\d+\.\d+\/\d+\?fields=/)) {
        console.log('[WebhookInterceptor] Simulando obtenção de informações da conta WhatsApp');
        
        if (isDevelopment() && !webhookData.config.useNgrok) {
          // Retorna dados simulados de uma conta WhatsApp
          return Promise.resolve(new Response(JSON.stringify({
            verified_name: "Lovable Restaurant",
            status: "connected",
            quality_rating: "GREEN"
          }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          }));
        }
      }
    }
    
    // Verificar se a solicitação é para nosso endpoint de webhook
    if (url.includes('/api/whatsapp/webhook')) {
      console.log(`[WebhookInterceptor] Interceptando solicitação para ${url}`);
      
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
      
      // Lógica específica para o método GET (verificação do webhook)
      if (method === 'GET') {
        const mode = queryParams['hub.mode'];
        const token = queryParams['hub.verify_token'];
        const challenge = queryParams['hub.challenge'];
        
        console.log('[WebhookInterceptor] Verificação de webhook detectada:', { mode, token, challenge });
        
        if (mode === 'subscribe' && token === webhookData.config.verifyToken) {
          console.log('[WebhookInterceptor] Webhook verificado com sucesso!');
          webhookData.isVerified = true;
          webhookData.lastVerification = new Date();
          
          // Responder com o desafio para confirmar a verificação
          return Promise.resolve(new Response(challenge, {
            status: 200,
            headers: { 'Content-Type': 'text/plain' }
          }));
        } else {
          console.error('[WebhookInterceptor] Falha na verificação do webhook: token inválido');
          return Promise.resolve(new Response('Forbidden', {
            status: 403,
            headers: { 'Content-Type': 'text/plain' }
          }));
        }
      }
      
      // Lógica específica para o método POST (recebimento de mensagens)
      if (method === 'POST' && body) {
        console.log('[WebhookInterceptor] Mensagem webhook recebida:', body);
        
        // Verificar se é uma notificação válida do WhatsApp Business
        if (body.object === 'whatsapp_business_account') {
          // Armazenar mensagens recebidas
          const entries = body.entry || [];
          let hasMessages = false;
          
          entries.forEach(entry => {
            const changes = entry.changes || [];
            
            changes.forEach(change => {
              if (change.field === 'messages') {
                const messages = change.value.messages || [];
                
                if (messages.length > 0) {
                  hasMessages = true;
                  // Armazenar mensagens para processamento
                  webhookData.receivedMessages.push(...messages);
                  
                  // Enviar evento para o componente do WhatsApp processar
                  window.dispatchEvent(new CustomEvent('whatsapp-webhook-message', {
                    detail: { messages, metadata: change.value }
                  }));
                }
              }
            });
          });
          
          if (hasMessages) {
            console.log('[WebhookInterceptor] Novas mensagens processadas com sucesso');
          } else {
            console.log('[WebhookInterceptor] Solicitação de webhook sem mensagens para processar');
          }
          
          // Responder com status 200 para confirmar recebimento
          return Promise.resolve(new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          }));
        } else {
          // Não é um evento do WhatsApp
          console.error('[WebhookInterceptor] Solicitação inválida: não é um evento do WhatsApp');
          return Promise.resolve(new Response(JSON.stringify({ 
            error: 'Invalid request. Expected WhatsApp Business Account notification' 
          }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' }
          }));
        }
      }
      
      // Enviar mensagem para o componente do webhook processar (legado)
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
    console.log(`[WebhookInterceptor] Passando requisição para fetch original: ${url}`);
    return originalFetch.apply(this, [input, init]);
  };
  
  console.log('[WebhookInterceptor] Interceptor de webhook WhatsApp inicializado com sucesso!');
};

// Tenta carregar configurações do localStorage
const tryLoadConfigFromStorage = () => {
  try {
    const storedConfig = localStorage.getItem('whatsapp_webhook_config');
    if (storedConfig) {
      const parsedConfig = JSON.parse(storedConfig);
      webhookData.config = { ...webhookData.config, ...parsedConfig };
      console.log('[WebhookInterceptor] Configurações carregadas do localStorage:', webhookData.config);
    }
  } catch (e) {
    console.error('[WebhookInterceptor] Erro ao carregar configurações do localStorage:', e);
  }
};

// Salva configurações no localStorage
const saveConfigToStorage = () => {
  try {
    localStorage.setItem('whatsapp_webhook_config', JSON.stringify(webhookData.config));
    console.log('[WebhookInterceptor] Configurações salvas no localStorage');
  } catch (e) {
    console.error('[WebhookInterceptor] Erro ao salvar configurações no localStorage:', e);
  }
};

// Função para obter os dados do webhook
export const getWebhookData = () => {
  return webhookData;
};

// Função para enviar uma mensagem simulada para o webhook
export const sendTestMessageToWebhook = (phone: string, text: string) => {
  const timestamp = new Date().getTime() / 1000;
  const messageId = `wamid.${Date.now()}`;
  
  console.log(`[WebhookInterceptor] Simulando mensagem do número: ${phone}`);
  
  const simulatedWebhookData = {
    object: "whatsapp_business_account",
    entry: [{
      id: "WHATSAPP_BUSINESS_ACCOUNT_ID",
      changes: [{
        value: {
          messaging_product: "whatsapp",
          metadata: {
            display_phone_number: "5511999999999",
            phone_number_id: webhookData.config.phoneNumberId
          },
          contacts: [{
            profile: {
              name: `Cliente ${phone.slice(-4)}`
            },
            wa_id: phone
          }],
          messages: [{
            id: messageId,
            from: phone,
            timestamp: timestamp,
            type: "text",
            text: {
              body: text
            }
          }]
        },
        field: "messages"
      }]
    }]
  };
  
  console.log(`[WebhookInterceptor] Enviando payload simulado:`, simulatedWebhookData);
  
  // Enviar esta solicitação para o nosso próprio interceptor
  fetch('/api/whatsapp/webhook', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(simulatedWebhookData)
  }).then(response => {
    console.log('[WebhookInterceptor] Resposta da simulação:', response.status);
    // Dispatchar um evento para notificar sobre a mensagem simulada
    window.dispatchEvent(new CustomEvent('whatsapp-webhook-message', {
      detail: {
        messages: [{
          id: messageId,
          from: phone,
          timestamp: timestamp,
          type: "text",
          text: {
            body: text
          }
        }],
        metadata: {
          display_phone_number: "5511999999999",
          phone_number_id: webhookData.config.phoneNumberId
        }
      }
    }));
  }).catch(error => {
    console.error('[WebhookInterceptor] Erro ao simular mensagem:', error);
  });
  
  return { messageId, timestamp };
};

// Exportar configurações do webhook
export const getWebhookConfig = () => {
  return { ...webhookData.config };
};

// Atualizar configurações do webhook
export const updateWebhookConfig = (newConfig: Partial<WebhookConfig>) => {
  webhookData.config = { ...webhookData.config, ...newConfig };
  saveConfigToStorage();
  return { ...webhookData.config };
};
