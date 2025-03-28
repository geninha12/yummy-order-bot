
import React from 'react';

// Este componente serve como endpoint para webhooks do WhatsApp
// Na versão de produção, este seria um arquivo de API no backend
export default function WhatsAppWebhook() {
  // Esta função seria executada no servidor em um ambiente de produção
  // Para ambiente de desenvolvimento, podemos simular com um handler de API
  React.useEffect(() => {
    // Registrar um handler para interceptar solicitações a esta rota
    const handleWebhookRequest = async (event: MessageEvent) => {
      // Verificar se a mensagem é para este endpoint
      if (event.data && event.data.type === 'whatsapp-webhook-request') {
        const { method, query, body } = event.data;
        
        let response;
        
        // Verificação do webhook (GET request)
        if (method === 'GET') {
          // Obter token de verificação do localStorage
          const storedToken = localStorage.getItem('whatsapp_verification_token');
          
          // Verificar se o hub.verify_token corresponde ao token armazenado
          if (query['hub.verify_token'] === storedToken) {
            // Responder com o desafio para confirmar a verificação
            response = {
              status: 200,
              body: query['hub.challenge']
            };
            console.log('Webhook verificado com sucesso!');
          } else {
            // Token inválido
            response = {
              status: 403,
              body: 'Token de verificação inválido'
            };
            console.error('Falha na verificação do webhook: token inválido');
          }
        } 
        // Recebimento de mensagens (POST request)
        else if (method === 'POST') {
          // Processar as mensagens recebidas
          console.log('Mensagem recebida via webhook:', body);
          
          // Aqui você processaria as mensagens e enviaria para o componente apropriado
          // Por exemplo, salvar no localStorage ou disparar um evento personalizado
          
          // Emitir evento com os dados da mensagem para que outros componentes possam reagir
          const webhookEvent = new CustomEvent('whatsapp-message-received', { 
            detail: body 
          });
          window.dispatchEvent(webhookEvent);
          
          response = {
            status: 200,
            body: 'EVENT_RECEIVED'
          };
        } else {
          response = {
            status: 405,
            body: 'Método não permitido'
          };
        }
        
        // Enviar resposta de volta para o interceptor
        window.postMessage({ 
          type: 'whatsapp-webhook-response',
          requestId: event.data.requestId,
          response
        }, '*');
      }
    };
    
    // Adicionar listener para mensagens
    window.addEventListener('message', handleWebhookRequest);
    
    return () => {
      window.removeEventListener('message', handleWebhookRequest);
    };
  }, []);
  
  return (
    <div className="hidden">
      {/* Este componente não renderiza nada visível */}
      {/* Em produção, esta seria uma rota de API, não um componente React */}
    </div>
  );
}
