
import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useWhatsApp } from '@/context/WhatsAppContext';

const TestMessage: React.FC = () => {
  const { isConnected, isLoading, sendTestMessage } = useWhatsApp();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');

  const handleSendTest = async () => {
    if (!phoneNumber.trim() || !message.trim()) return;
    
    await sendTestMessage(phoneNumber, message);
    setMessage('');
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
              placeholder="+5511999887766"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Incluir código do país e DDD, ex: +5511999887766
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
          disabled={isLoading || !phoneNumber.trim() || !message.trim()}
          className="w-full"
        >
          <Send className="h-4 w-4 mr-2" />
          Enviar Mensagem de Teste
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TestMessage;
