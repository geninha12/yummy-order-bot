
import React, { useState } from 'react';
import { Info, Copy, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useWhatsApp } from '@/context/WhatsAppContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const WebhookInfo: React.FC = () => {
  const { isConnected, generateVerificationToken, verificationToken } = useWhatsApp();
  const [isGeneratingToken, setIsGeneratingToken] = useState(false);
  
  if (!isConnected) {
    return null;
  }

  // URL do webhook deve ser a URL de seu aplicativo seguida de um endpoint para webhooks
  const webhookUrl = `${window.location.origin}/api/whatsapp/webhook`;

  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(message);
    }).catch(() => {
      toast.error('Não foi possível copiar para a área de transferência');
    });
  };

  const handleGenerateToken = async () => {
    setIsGeneratingToken(true);
    try {
      await generateVerificationToken();
      toast.success('Token de verificação gerado com sucesso!');
    } catch (error) {
      toast.error('Erro ao gerar token de verificação');
    } finally {
      setIsGeneratingToken(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium flex items-center">
          <Info className="mr-2 h-5 w-5 text-blue-500" />
          Configuração de Webhooks
        </CardTitle>
        <CardDescription>
          Configure webhooks para receber mensagens e atualizações do WhatsApp
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-sm font-medium mb-2">URL do Webhook</h3>
          <div className="flex items-center">
            <code className="p-2 bg-muted rounded text-xs flex-1 overflow-x-auto">
              {webhookUrl}
            </code>
            <Button 
              variant="ghost" 
              size="icon" 
              className="ml-2" 
              onClick={() => copyToClipboard(webhookUrl, 'URL do webhook copiada!')}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Use esta URL no painel de desenvolvedores do Facebook para configurar os webhooks.
          </p>
        </div>

        <div>
          <Label htmlFor="verification-token" className="text-sm font-medium">Token de Verificação</Label>
          <div className="flex items-center mt-2">
            <Input 
              id="verification-token"
              value={verificationToken || ''} 
              readOnly 
              className="text-xs font-mono"
              placeholder="Clique em 'Gerar Token' para criar um token de verificação"
            />
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-2 whitespace-nowrap" 
              onClick={handleGenerateToken}
              disabled={isGeneratingToken}
            >
              {isGeneratingToken ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Gerando...
                </>
              ) : (
                'Gerar Token'
              )}
            </Button>
            {verificationToken && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="ml-2" 
                onClick={() => copyToClipboard(verificationToken, 'Token de verificação copiado!')}
              >
                <Copy className="h-4 w-4" />
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Este token é usado para verificar a autenticidade das solicitações de webhook. 
            Forneça-o na configuração do webhook no painel do Facebook Developers.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Passos para Configuração</h3>
          <ol className="text-xs space-y-2 pl-5 list-decimal">
            <li>Acesse o <a href="https://developers.facebook.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">Facebook Developers</a></li>
            <li>Navegue até seu aplicativo</li>
            <li>Vá para Configurações &gt; WhatsApp &gt; Webhooks</li>
            <li>Configure a URL do webhook e seu token de verificação</li>
            <li>Selecione os campos de webhook necessários (mensagens, notificações de entrega, etc)</li>
          </ol>
        </div>

        <div className="bg-blue-50 p-3 rounded-md">
          <p className="text-xs text-blue-700">
            <strong>Nota:</strong> Você precisará de um domínio público para receber webhooks. 
            Em ambiente de desenvolvimento, utilize ferramentas como ngrok para expor seu servidor local.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WebhookInfo;
