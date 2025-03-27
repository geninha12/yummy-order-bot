
import React, { useState } from 'react';
import { 
  MessageSquare, 
  PlusCircle, 
  MoreVertical, 
  Edit, 
  Trash, 
  Power, 
  PowerOff,
  ArrowRightLeft 
} from 'lucide-react';
import { useWhatsApp, WhatsAppFlow } from '@/context/WhatsAppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface FlowListProps {
  onEdit: (flow: WhatsAppFlow) => void;
  onAdd: () => void;
}

const FlowList: React.FC<FlowListProps> = ({ onEdit, onAdd }) => {
  const { flows, activateFlow, deactivateFlow, deleteFlow } = useWhatsApp();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedFlowId, setSelectedFlowId] = useState<string | null>(null);

  const handleDeleteClick = (flowId: string) => {
    setSelectedFlowId(flowId);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedFlowId) {
      await deleteFlow(selectedFlowId);
      setDeleteConfirmOpen(false);
      setSelectedFlowId(null);
    }
  };

  const handleToggleActive = async (flowId: string, currentActive: boolean) => {
    if (currentActive) {
      await deactivateFlow(flowId);
    } else {
      await activateFlow(flowId);
    }
  };

  const getTriggerLabel = (trigger: string) => {
    switch (trigger) {
      case 'welcome':
        return 'Boas-vindas';
      case 'customer_request':
        return 'Solicitação do Cliente';
      case 'abandoned_cart':
        return 'Carrinho Abandonado';
      case 'order_update':
        return 'Atualização de Pedido';
      default:
        return trigger;
    }
  };

  const getLastUpdated = (date: string) => {
    return format(new Date(date), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Fluxos de Mensagens</h2>
        <Button onClick={onAdd}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Novo Fluxo
        </Button>
      </div>
      
      {flows.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <MessageSquare className="h-10 w-10 text-muted-foreground mb-4" />
            <CardTitle className="text-xl mb-2">Nenhum fluxo criado</CardTitle>
            <CardDescription className="mb-4">
              Crie seu primeiro fluxo de mensagens para automatizar a comunicação com seus clientes.
            </CardDescription>
            <Button onClick={onAdd}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Criar Primeiro Fluxo
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {flows.map((flow) => (
            <Card key={flow.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{flow.name}</CardTitle>
                    <CardDescription className="line-clamp-2 mt-1">
                      {flow.description}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(flow)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleToggleActive(flow.id, flow.active)}>
                        {flow.active ? (
                          <>
                            <PowerOff className="h-4 w-4 mr-2" />
                            Desativar
                          </>
                        ) : (
                          <>
                            <Power className="h-4 w-4 mr-2" />
                            Ativar
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleDeleteClick(flow.id)}
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <ArrowRightLeft className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span className="text-muted-foreground">Gatilho:</span>
                    </div>
                    <Badge variant="outline">{getTriggerLabel(flow.trigger)}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <MessageSquare className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span className="text-muted-foreground">Mensagens:</span>
                    </div>
                    <span>{flow.nodes.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge variant={flow.active ? "default" : "secondary"}>
                      {flow.active ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm pt-2 border-t mt-2">
                    <span className="text-xs text-muted-foreground">Última atualização:</span>
                    <span className="text-xs">{getLastUpdated(flow.updatedAt)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Este fluxo será permanentemente excluído
              de nossos servidores.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FlowList;
