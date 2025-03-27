
import React, { useState } from 'react';
import { Smartphone, Link2Off, Link2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useWhatsApp } from '@/context/WhatsAppContext';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const connectionSchema = z.object({
  token: z.string().min(1, { message: 'Token é obrigatório' }),
  phoneNumberId: z.string().min(1, { message: 'ID do número é obrigatório' })
});

const WhatsAppConnection: React.FC = () => {
  const { isConnected, isLoading, connectionError, accountInfo, connectWhatsApp, disconnectWhatsApp } = useWhatsApp();
  const [isEditing, setIsEditing] = useState(false);
  
  const form = useForm<z.infer<typeof connectionSchema>>({
    resolver: zodResolver(connectionSchema),
    defaultValues: {
      token: '',
      phoneNumberId: ''
    }
  });

  const onSubmit = async (values: z.infer<typeof connectionSchema>) => {
    await connectWhatsApp(values.token, values.phoneNumberId);
    setIsEditing(false);
  };

  const handleDisconnect = () => {
    disconnectWhatsApp();
  };

  if (isConnected && !isEditing) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium flex items-center">
            <Smartphone className="mr-2 h-5 w-5 text-primary" />
            WhatsApp Conectado
          </CardTitle>
          <CardDescription>
            Sua conta do WhatsApp Business está conectada e pronta para enviar mensagens.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">ID da Conta:</span>
              <span className="text-sm">{accountInfo?.id}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Nome da Conta:</span>
              <span className="text-sm">{accountInfo?.name}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2 pt-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
          >
            Editar Conexão
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDisconnect}
          >
            <Link2Off className="mr-2 h-4 w-4" />
            Desconectar
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">
          {isConnected ? 'Editar Conexão WhatsApp' : 'Conectar ao WhatsApp'}
        </CardTitle>
        <CardDescription>
          {isConnected 
            ? 'Atualize suas credenciais do WhatsApp Business API' 
            : 'Conecte sua conta do WhatsApp Business API para enviar mensagens automáticas'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="token"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Token de Acesso</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" placeholder="EAAQcE2oPc3UBO70HdlecYd..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phoneNumberId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID do Número do WhatsApp</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="165041781891..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {connectionError && (
              <div className="text-destructive text-sm mt-2">{connectionError}</div>
            )}
            
            <div className="flex justify-end space-x-2 pt-2">
              {isConnected && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsEditing(false)}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
              )}
              <Button type="submit" disabled={isLoading}>
                <Link2 className="mr-2 h-4 w-4" />
                {isConnected ? 'Atualizar Conexão' : 'Conectar'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default WhatsAppConnection;
