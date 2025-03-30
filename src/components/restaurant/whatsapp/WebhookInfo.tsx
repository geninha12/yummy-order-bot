
import React, { useState, useEffect } from 'react';
import { Copy, CheckCircle2, RefreshCw, Globe, LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';
import { 
  getWebhookData, 
  getWebhookConfig, 
  updateWebhookConfig 
} from '@/utils/webhookInterceptor';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

const WebhookInfo = () => {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [ngrokUrl, setNgrokUrl] = useState('');
  const [verifyToken, setVerifyToken] = useState('');
  const [phoneNumberId, setPhoneNumberId] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [lastVerification, setLastVerification] = useState<Date | null>(null);
  const [isGeneratingToken, setIsGeneratingToken] = useState(false);
  const [useNgrok, setUseNgrok] = useState(false);
  const [activeTab, setActiveTab] = useState('configuration');

  useEffect(() => {
    // Obter URL do webhook com base na URL atual
    const baseUrl = window.location.origin;
    setWebhookUrl(`${baseUrl}/api/whatsapp/webhook`);
    
    // Obter configurações do webhook
    const config = getWebhookConfig();
    setVerifyToken(config.verifyToken);
    setPhoneNumberId(config.phoneNumberId);
    setNgrokUrl(config.ngrokUrl || '');
    setUseNgrok(config.useNgrok || false);
    
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

  const handleNgrokUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setNgrokUrl(url);
    updateWebhookConfig({ ngrokUrl: url });
  };

  const toggleNgrok = (checked: boolean) => {
    setUseNgrok(checked);
    updateWebhookConfig({ useNgrok: checked });
    toast.success(checked 
      ? 'Modo de desenvolvimento com ngrok ativado' 
      : 'Modo de desenvolvimento com ngrok desativado');
  };

  const getEffectiveWebhookUrl = () => {
    if (useNgrok && ngrokUrl) {
      // Se estiver usando ngrok, construir a URL completa
      try {
        // Garantir que a URL do ngrok é válida
        const ngrokUrlObj = new URL(ngrokUrl);
        return `${ngrokUrl.replace(/\/$/, '')}/api/whatsapp/webhook`;
      } catch (e) {
        // Se a URL for inválida, mostrar um erro e usar a URL padrão
        console.error('URL do ngrok inválida:', ngrokUrl);
        return webhookUrl;
      }
    }
    return webhookUrl;
  };

  const verifyWebhook = () => {
    const effectiveUrl = getEffectiveWebhookUrl();
    // Simular verificação do webhook
    fetch(`${effectiveUrl}?hub.mode=subscribe&hub.verify_token=${verifyToken}&hub.challenge=CHALLENGE_ACCEPTED`)
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="px-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="configuration">Configuração</TabsTrigger>
            <TabsTrigger value="development">Desenvolvimento</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="configuration" className="space-y-4">
          <CardContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="webhookUrl">URL do Webhook</Label>
              <div className="flex">
                <Input
                  id="webhookUrl"
                  value={getEffectiveWebhookUrl()}
                  readOnly
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="ml-2"
                  onClick={() => copyToClipboard(getEffectiveWebhookUrl(), 'URL copiada para a área de transferência')}
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
        </TabsContent>
        
        <TabsContent value="development" className="space-y-4">
          <CardContent className="space-y-4 pt-4">
            <Alert variant="info" className="bg-blue-50 border-blue-200">
              <Globe className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-700">
                Para testar o webhook localmente com o WhatsApp, você precisa expor seu servidor 
                local à internet usando uma ferramenta como o ngrok.
              </AlertDescription>
            </Alert>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="useNgrok" className="font-medium">
                Usar ngrok para desenvolvimento
              </Label>
              <Switch 
                id="useNgrok" 
                checked={useNgrok} 
                onCheckedChange={toggleNgrok} 
              />
            </div>
            
            {useNgrok && (
              <div className="space-y-2">
                <Label htmlFor="ngrokUrl">URL do Ngrok</Label>
                <div className="flex">
                  <Input
                    id="ngrokUrl"
                    value={ngrokUrl}
                    onChange={handleNgrokUrlChange}
                    placeholder="Ex: https://abcd-123-456-789.ngrok.io"
                    className="flex-1"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Digite a URL base do seu túnel ngrok (ex: https://abcd-123-456-789.ngrok.io)
                </p>
              </div>
            )}
            
            <div className="space-y-2 pt-2">
              <div className="flex justify-between items-center">
                <Label>Webhook URL Efetiva</Label>
                <Badge variant={useNgrok ? "success" : "secondary"}>
                  {useNgrok ? 'ngrok' : 'padrão'}
                </Badge>
              </div>
              <div className="flex">
                <Input
                  value={getEffectiveWebhookUrl()}
                  readOnly
                  className="flex-1 bg-muted"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="ml-2"
                  onClick={() => copyToClipboard(getEffectiveWebhookUrl(), 'URL efetiva copiada')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2 pt-4">
              <h3 className="text-sm font-semibold">Como usar o ngrok:</h3>
              <ol className="text-sm text-muted-foreground list-decimal list-inside space-y-2">
                <li>Instale o ngrok em sua máquina local</li>
                <li>Execute sua aplicação Lovable localmente (porta 8080)</li>
                <li>Inicie o túnel ngrok: <code className="bg-muted px-1 rounded">ngrok http 8080</code></li>
                <li>Copie a URL HTTPS fornecida pelo ngrok e cole no campo acima</li>
                <li>Ative o modo ngrok</li>
                <li>Use a URL efetiva ao configurar o webhook no WhatsApp</li>
              </ol>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-end">
            <Button 
              variant="default" 
              onClick={verifyWebhook}
              disabled={!useNgrok || !ngrokUrl}
            >
              <LinkIcon className="h-4 w-4 mr-2" />
              Testar Conexão Ngrok
            </Button>
          </CardFooter>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default WebhookInfo;
