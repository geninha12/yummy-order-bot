
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link2 } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const connectionSchema = z.object({
  token: z.string().min(1, { message: 'Token é obrigatório' }),
  phoneNumberId: z.string().min(1, { message: 'ID do número é obrigatório' }),
  appId: z.string().optional(),
  appSecret: z.string().optional(),
});

type ConnectionFormProps = {
  onSubmit: (values: z.infer<typeof connectionSchema>) => Promise<void>;
  onCancel?: () => void;
  isLoading: boolean;
  connectionError: string | null;
  isConnected: boolean;
};

const ConnectionForm: React.FC<ConnectionFormProps> = ({ 
  onSubmit, 
  onCancel, 
  isLoading, 
  connectionError,
  isConnected 
}) => {
  const form = useForm<z.infer<typeof connectionSchema>>({
    resolver: zodResolver(connectionSchema),
    defaultValues: {
      token: '',
      phoneNumberId: '',
      appId: '',
      appSecret: ''
    }
  });

  const handleSubmit = async (values: z.infer<typeof connectionSchema>) => {
    await onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
        
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="webhooks-config">
            <AccordionTrigger className="text-sm font-medium">
              Configurações Avançadas (Webhooks)
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                <FormField
                  control={form.control}
                  name="appId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID do Aplicativo</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="12345678901234" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="appSecret"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chave Secreta do Aplicativo</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" placeholder="abcdef1234567890" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        {connectionError && (
          <div className="text-destructive text-sm mt-2">{connectionError}</div>
        )}
        
        <div className="flex justify-end space-x-2 pt-2">
          {isConnected && onCancel && (
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
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
  );
};

export default ConnectionForm;
