
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SendIcon, AlertCircle, InfoIcon } from 'lucide-react';
import { toast } from 'sonner';
import { sendTestMessageToWebhook, getWebhookConfig } from '@/utils/webhookInterceptor';
import { useWhatsApp } from '@/context/WhatsAppContext';
import { Alert, AlertDescription } from '@/components/ui/alert';

const TestMessage = () => {
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { isConnected, sendTestMessage } = useWhatsApp();
  const webhookConfig = getWebhookConfig();
  const useNgrok = webhookConfig.useNgrok && webhookConfig.ngrokUrl;

  const formatPhoneNumber = (phoneNumber: string): string => {
    // Remove any non-digit characters
    let cleaned = phoneNumber.replace(/\D/g, '');
    
    // Ensure it has country code (add 55 for Brazil if not present)
    if (cleaned.length >= 10 && !cleaned.startsWith('55')) {
      cleaned = '55' + cleaned;
    }
    
    console.log(`[TestMessage] Formatado: ${cleaned} (original: ${phoneNumber})`);
    return cleaned;
  };

  const isValidPhoneNumber = (phoneNumber: string): boolean => {
    return /^\d{10,15}$/.test(phoneNumber);
  };

  const handleSend = async () => {
    if (!phone || !message) {
      toast.error('Por favor, preencha o número de telefone e a mensagem');
      return;
    }

    // Validate and format phone number
    const formattedPhone = formatPhoneNumber(phone);
    
    if (!isValidPhoneNumber(formattedPhone)) {
      toast.error('Número de telefone inválido. Use apenas números (10-15 dígitos)');
      return;
    }

    setIsSending(true);
    console.log(`[TestMessage] Iniciando envio para ${formattedPhone}`, { 
      isConnected, 
      useNgrok,
      webhookUrl: useNgrok ? webhookConfig.ngrokUrl : 'padrão' 
    });

    try {
      // First simulate the message receipt locally (for testing)
      const { messageId } = sendTestMessageToWebhook(
        formattedPhone,
        message
      );
      
      console.log('[TestMessage] Mensagem simulada enviada com ID:', messageId);
      
      // Now try to send the actual message via WhatsApp
      if (isConnected) {
        try {
          console.log('[TestMessage] Tentando enviar mensagem real via WhatsApp API');
          const result = await sendTestMessage(formattedPhone, message);
          console.log('[TestMessage] Resposta do envio real:', result);
          
          toast.success(useNgrok 
            ? 'Mensagem enviada com sucesso via ngrok!' 
            : 'Mensagem enviada para o WhatsApp com sucesso!');
        } catch (whatsappError) {
          console.error('[TestMessage] Erro ao enviar mensagem pelo WhatsApp:', whatsappError);
          const errorMessage = whatsappError instanceof Error ? whatsappError.message : 'Erro desconhecido';
          console.error('[TestMessage] Detalhes do erro:', errorMessage);
          
          // Em ambiente ngrok, este erro pode ser normal se o webhook ainda não estiver configurado
          if (useNgrok) {
            toast.info('Simulação local concluída. Confira se seu túnel ngrok está ativo e configurado no WhatsApp para receber mensagens reais.');
          } else {
            toast.error(`Falha ao enviar pelo WhatsApp: ${errorMessage}`);
          }
        }
      } else {
        console.log('[TestMessage] WhatsApp não conectado, apenas simulação local foi realizada');
        toast.info('Simulação local concluída (WhatsApp não conectado)');
      }
      
      // Clear message field after sending
      setMessage('');
    } catch (error) {
      console.error('[TestMessage] Erro ao enviar mensagem:', error);
      toast.error('Erro ao enviar mensagem de teste');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enviar Mensagem de Teste</CardTitle>
        <CardDescription>
          Simule o recebimento de uma mensagem do WhatsApp para testar seu fluxo
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isConnected && (
          <Alert variant="warning" className="bg-yellow-50 border-yellow-200">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-700">
              O WhatsApp não está conectado. A mensagem será apenas simulada localmente.
            </AlertDescription>
          </Alert>
        )}

        {isConnected && useNgrok && (
          <Alert className="bg-blue-50 border-blue-200">
            <InfoIcon className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-700">
              Modo ngrok ativo. As mensagens reais serão enviadas através do seu túnel ngrok.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="phone">Número de Telefone</Label>
          <Input
            id="phone"
            placeholder="Ex: 5511999999999"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Use o formato completo com código do país (ex: 5511999999999)
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Mensagem</Label>
          <Textarea
            id="message"
            placeholder="Digite a mensagem que o cliente enviaria..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleSend}
          disabled={isSending || !phone || !message}
        >
          {isSending ? (
            'Enviando...'
          ) : (
            <>
              <SendIcon className="h-4 w-4 mr-2" />
              Enviar Mensagem de Teste
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TestMessage;
