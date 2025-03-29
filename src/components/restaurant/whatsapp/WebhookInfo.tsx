
import React, { useState, useEffect } from 'react';
import { Copy, CheckCircle2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from 'sonner';
import { getWebhookData, getWebhookConfig, updateWebhookConfig } from '@/utils/webhookInterceptor';

const WebhookInfo = () => {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [verifyToken, setVerifyToken] = useState('');
  const [phoneNumberId, setPhoneNumberId] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [lastVerification, setLastVerification] = useState<Date | null>(null);
  const [isGeneratingToken, setIsGeneratingToken] = useState(false);

  useEffect(() => {
    // Obter URL do webhook com base na URL atual
    const baseUrl = window.location.origin;
    setWebhookUrl(`${baseUrl}/api/whatsapp/webhook`);
    
    // Obter configurações do webhook
    const config = getWebhookConfig();
    setVerifyToken(config.verifyToken);
    setPhoneNumberId(config.phoneNumberId);
    
    // Verificar status
    const webhookData = getWebhookData();
    setIsVerified(webhookData.isVerified);
    setLastVerification(webhookData.lastVerification);
    
    // Configurar atualizações periódicas
    const intervalId = setInterval(() => {
      const data = getWebhookData();
      setIsVerified(data.isVerified);
      setLastVerification(data.lastVerification);
    }, 2000);
    
    return () => clearInterval(intervalId);
  }, []);

  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success(message))
      .catch(() => toast.error('Falha ao copiar para a área de transferência'));
  };

  const generateRandomToken = () => {
    setIsGeneratingToken(true);
    
    // Gerar token aleatório
    const randomBytes = new Uint8Array(16);
    window.crypto.getRandomValues(randomBytes);
    const newToken = Array.from(randomBytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    setVerifyToken(newToken);
    updateWebhookConfig({ verifyToken: newToken });
    setIsGeneratingToken(false);
    
    toast.success('Novo token de verificação gerado');
  };

  const handlePhoneNumberIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPhoneNumberId = e.target.value;
    setPhoneNumberId(newPhoneNumberId);
    updateWebhookConfig({ phoneNumberId: newPhoneNumberId });
  };

  const verifyWebhook = () => {
    // Simular verificação do webhook
    fetch(`${webhookUrl}?hub.mode=subscribe&hub.verify_token=${verifyToken}&hub.challenge=CHALLENGE_ACCEPTED`)
      .then(response => {
        if (response.ok) {
          return response.text();
        }
        throw new Error(`Falha na verificação. Status: ${response.status}`);
      })
      .then(data => {
        if (data === 'CHALLENGE_ACCEPTED') {
          toast.success('Webhook verificado com sucesso!');
        } else {
          toast.error(`Resposta inesperada: ${data}`);
        }
      })
      .catch(error => {
        toast.error(`Erro ao verificar webhook: ${error.message}`);
      });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          Configuração do Webhook
          {isVerified && (
            <CheckCircle2 className="h-5 w-5 ml-2 text-green-500" />
          )}
        </CardTitle>
        <CardDescription>
          Configure o webhook do WhatsApp para receber mensagens
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="webhookUrl">URL do Webhook</Label>
          <div className="flex">
            <Input
              id="webhookUrl"
              value={webhookUrl}
              readOnly
              className="flex-1"
            />
            <Button
              variant="outline"
              size="icon"
              className="ml-2"
              onClick={() => copyToClipboard(webhookUrl, 'URL copiada para a área de transferência')}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {isVerified 
              ? `Última verificação: ${lastVerification?.toLocaleString() || 'Nunca'}` 
              : 'Webhook não verificado'}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="verifyToken">Token de Verificação</Label>
          <div className="flex">
            <Input
              id="verifyToken"
              value={verifyToken}
              readOnly
              className="flex-1"
            />
            <Button
              variant="outline"
              size="icon"
              className="ml-2"
              onClick={() => copyToClipboard(verifyToken, 'Token copiado para a área de transferência')}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumberId">ID do Número de Telefone</Label>
          <Input
            id="phoneNumberId"
            value={phoneNumberId}
            onChange={handlePhoneNumberIdChange}
            placeholder="Ex: 123456789012345"
          />
          <p className="text-xs text-muted-foreground">
            ID do seu número do WhatsApp Business API
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="flex flex-col space-y-2 w-full">
          <p className="text-sm text-muted-foreground">
            Para usar este webhook no Meta Developers:
          </p>
          <ol className="text-sm text-muted-foreground list-decimal list-inside space-y-1">
            <li>Copie a URL e o token de verificação</li>
            <li>Adicione a URL ao seu aplicativo no Meta Developers</li>
            <li>Use o token quando configurar o webhook</li>
            <li>Selecione os campos: messages, message_deliveries, message_reads</li>
          </ol>
        </div>
        <div className="flex justify-between w-full">
          <Button
            variant="outline"
            onClick={generateRandomToken}
            disabled={isGeneratingToken}
          >
            {isGeneratingToken ? 'Gerando...' : 'Gerar Novo Token'}
          </Button>
          <Button onClick={verifyWebhook}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Verificar Webhook
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default WebhookInfo;
