
import React, { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWhatsApp, WhatsAppFlow, WhatsAppFlowTrigger } from '@/context/WhatsAppContext';
import FlowDesigner from './FlowDesigner';
import { useForm } from 'react-hook-form';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

interface FlowEditorProps {
  flow?: WhatsAppFlow;
  onBack: () => void;
}

const flowSchema = z.object({
  name: z.string().min(3, { message: 'Nome deve ter pelo menos 3 caracteres' }),
  description: z.string().min(10, { message: 'Descrição deve ter pelo menos 10 caracteres' }),
  trigger: z.enum(['welcome', 'customer_request', 'abandoned_cart', 'order_update']),
  active: z.boolean().default(true)
});

const FlowEditor: React.FC<FlowEditorProps> = ({ flow, onBack }) => {
  const { createFlow, updateFlow } = useWhatsApp();
  const [nodes, setNodes] = useState(flow?.nodes || []);
  const [edges, setEdges] = useState(flow?.edges || []);
  
  const form = useForm<z.infer<typeof flowSchema>>({
    resolver: zodResolver(flowSchema),
    defaultValues: {
      name: flow?.name || '',
      description: flow?.description || '',
      trigger: (flow?.trigger as WhatsAppFlowTrigger) || 'welcome',
      active: flow?.active !== undefined ? flow.active : true
    }
  });

  const handleSaveFlow = async (formValues: z.infer<typeof flowSchema>) => {
    if (nodes.length === 0) {
      alert('Seu fluxo precisa ter pelo menos uma mensagem. Adicione elementos no editor de fluxo.');
      return;
    }
    
    try {
      if (flow) {
        // Atualizar fluxo existente
        await updateFlow(flow.id, {
          ...formValues,
          nodes,
          edges
        });
      } else {
        // Criar novo fluxo
        await createFlow({
          ...formValues,
          nodes,
          edges
        });
      }
      onBack();
    } catch (error) {
      console.error('Erro ao salvar fluxo:', error);
    }
  };

  const handleFlowDesignerSave = (updatedNodes: typeof nodes, updatedEdges: typeof edges) => {
    setNodes(updatedNodes);
    setEdges(updatedEdges);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" onClick={onBack} className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar
          </Button>
          <h2 className="text-xl font-bold">
            {flow ? `Editar: ${flow.name}` : 'Novo Fluxo de Mensagens'}
          </h2>
        </div>
        <Button onClick={form.handleSubmit(handleSaveFlow)}>
          <Save className="h-4 w-4 mr-2" />
          Salvar Fluxo
        </Button>
      </div>
      
      <Form {...form}>
        <form className="space-y-4">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Fluxo</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ex: Boas-vindas ao Cliente" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="trigger"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gatilho</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um gatilho" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="welcome">Boas-vindas</SelectItem>
                      <SelectItem value="customer_request">Solicitação do Cliente</SelectItem>
                      <SelectItem value="abandoned_cart">Carrinho Abandonado</SelectItem>
                      <SelectItem value="order_update">Atualização de Pedido</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Quando este fluxo de mensagens será ativado
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field} 
                    placeholder="Uma breve descrição do propósito deste fluxo de mensagens" 
                    rows={3}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      
      <div className="border rounded-lg bg-white p-4">
        <h3 className="font-medium mb-4">Editor de Fluxo</h3>
        <FlowDesigner 
          nodes={nodes}
          edges={edges}
          onSave={handleFlowDesignerSave}
        />
      </div>
    </div>
  );
};

export default FlowEditor;
