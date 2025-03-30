
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
import { SendIcon, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { sendTestMessageToWebhook } from '@/utils/webhookInterceptor';
import { useWhatsApp } from '@/context/WhatsAppContext';
import { Alert, AlertDescription } from '@/components/ui/alert';

const TestMessage = () => {
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { isConnected, sendTestMessage } = useWhatsApp();

  const handleSend = async () => {
    if (!phone || !message) {
      toast.error('Por favor, preencha o número de telefone e a mensagem');
      return;
    }

    // Validar formato do telefone (formato simples)
    const cleanPhone = phone.replace(/\D/g, '');
    if (!/^\d{10,15}$/.test(cleanPhone)) {
      toast.error('Número de telefone inválido. Use apenas números (10-15 dígitos)');
      return;
    }

    setIsSending(true);

    try {
      // Primeiro vamos simular o recebimento da mensagem localmente (para testes)
      const { messageId } = sendTestMessageToWebhook(
        cleanPhone,
        message
      );
      
      console.log('Mensagem simulada enviada com ID:', messageId);
      
      // Agora vamos tentar enviar a mensagem real pelo WhatsApp
      if (isConnected) {
        try {
          await sendTestMessage(cleanPhone, message);
          toast.success('Mensagem enviada para o WhatsApp com sucesso!');
        } catch (whatsappError) {
          console.error('Erro ao enviar mensagem pelo WhatsApp:', whatsappError);
          toast.error('Falha ao enviar pelo WhatsApp: ' + (whatsappError instanceof Error ? whatsappError.message : 'Erro desconhecido'));
        }
      } else {
        toast.info('Simulação local concluída (WhatsApp não conectado)');
      }
      
      // Limpar formulário
      setMessage('');
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
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
