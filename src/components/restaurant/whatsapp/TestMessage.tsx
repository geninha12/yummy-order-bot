
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
import { SendIcon } from 'lucide-react';
import { toast } from 'sonner';
import { sendTestMessageToWebhook } from '@/utils/webhookInterceptor';

const TestMessage = () => {
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSend = () => {
    if (!phone || !message) {
      toast.error('Por favor, preencha o número de telefone e a mensagem');
      return;
    }

    // Validar formato do telefone (formato simples)
    if (!/^\d{10,15}$/.test(phone.replace(/\D/g, ''))) {
      toast.error('Número de telefone inválido. Use apenas números (10-15 dígitos)');
      return;
    }

    setIsSending(true);

    try {
      // Enviar mensagem de teste para o interceptor do webhook
      const { messageId } = sendTestMessageToWebhook(
        phone.replace(/\D/g, ''),
        message
      );
      
      toast.success('Mensagem de teste enviada com sucesso!');
      console.log('Mensagem enviada com ID:', messageId);
      
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
