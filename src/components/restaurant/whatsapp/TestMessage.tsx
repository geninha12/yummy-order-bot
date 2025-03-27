
import React, { useState } from 'react';
import { Send, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useWhatsApp } from '@/context/WhatsAppContext';
import { toast } from 'sonner';

const TestMessage: React.FC = () => {
  const { isConnected, isLoading, sendTestMessage } = useWhatsApp();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const formatPhoneNumber = (number: string) => {
    // Remove qualquer caractere que não seja dígito
    const digits = number.replace(/\D/g, '');
    
    // Certificar que o número tem o formato correto (remover o '+' se existir e garantir que tem código do país)
    if (digits.startsWith('55')) {
      return digits;
    } else {
      return `55${digits}`;
    }
  };

  const handleSendTest = async () => {
    if (!phoneNumber.trim() || !message.trim()) {
      toast.error('Por favor, preencha o número e a mensagem');
      return;
    }
    
    setIsSending(true);
    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);
      await sendTestMessage(formattedPhone, message);
      toast.success(`Mensagem enviada para ${phoneNumber}`);
      setMessage('');
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      toast.error('Não foi possível enviar a mensagem. Verifique o console para mais detalhes.');
    } finally {
      setIsSending(false);
    }
  };

  if (!isConnected) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Enviar Mensagem de Teste</CardTitle>
        <CardDescription>
          Teste o envio de mensagens para verificar sua conexão
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1">Número de Telefone</label>
            <Input
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="5511999887766"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Incluir código do país e DDD, ex: 5511999887766 (sem o '+')
            </p>
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Mensagem</label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Digite sua mensagem de teste aqui..."
              rows={3}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button
          onClick={handleSendTest}
          disabled={isLoading || isSending || !phoneNumber.trim() || !message.trim()}
          className="w-full"
        >
          {isSending ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Send className="h-4 w-4 mr-2" />
          )}
          Enviar Mensagem de Teste
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TestMessage;
