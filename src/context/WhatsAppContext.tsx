
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from "sonner";

// Tipos para a API do WhatsApp
export type WhatsAppFlowTrigger = 'welcome' | 'customer_request' | 'abandoned_cart' | 'order_update';

export type WhatsAppMessageType = 'text' | 'template' | 'image' | 'button' | 'list';

export type WhatsAppFlowNode = {
  id: string;
  type: WhatsAppMessageType;
  content: string;
  buttons?: { id: string; text: string; action: string }[];
  nextNodeId?: string;
  position: { x: number; y: number };
  metadata?: Record<string, any>;
};

export type WhatsAppFlow = {
  id: string;
  name: string;
  description: string;
  trigger: WhatsAppFlowTrigger;
  active: boolean;
  nodes: WhatsAppFlowNode[];
  edges: { id: string; source: string; target: string }[];
  createdAt: string;
  updatedAt: string;
};

export type WhatsAppContact = {
  id: string;
  phoneNumber: string;
  name: string;
  lastInteraction: string;
};

type WhatsAppContextType = {
  isConnected: boolean;
  isLoading: boolean;
  connectionError: string | null;
  accountInfo: { id: string; name: string } | null;
  flows: WhatsAppFlow[];
  contacts: WhatsAppContact[];
  connectWhatsApp: (token: string, phoneNumberId: string) => Promise<void>;
  disconnectWhatsApp: () => void;
  createFlow: (flow: Omit<WhatsAppFlow, 'id' | 'createdAt' | 'updatedAt'>) => Promise<WhatsAppFlow>;
  updateFlow: (id: string, updates: Partial<Omit<WhatsAppFlow, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<WhatsAppFlow>;
  deleteFlow: (id: string) => Promise<void>;
  activateFlow: (id: string) => Promise<void>;
  deactivateFlow: (id: string) => Promise<void>;
  sendTestMessage: (phoneNumber: string, message: string) => Promise<void>;
};

const WhatsAppContext = createContext<WhatsAppContextType | undefined>(undefined);

// Dados de exemplo
const sampleFlows: WhatsAppFlow[] = [
  {
    id: 'flow-1',
    name: 'Boas-vindas',
    description: 'Fluxo de boas-vindas para novos clientes',
    trigger: 'welcome',
    active: true,
    nodes: [
      {
        id: 'node-1',
        type: 'text',
        content: 'Olá! Bem-vindo ao {{restaurant_name}}! É um prazer tê-lo como cliente. Como podemos ajudar hoje?',
        position: { x: 100, y: 100 },
        nextNodeId: 'node-2'
      },
      {
        id: 'node-2',
        type: 'button',
        content: 'Escolha uma opção:',
        buttons: [
          { id: 'btn-1', text: 'Ver Cardápio', action: 'SHOW_MENU' },
          { id: 'btn-2', text: 'Fazer Pedido', action: 'MAKE_ORDER' },
          { id: 'btn-3', text: 'Falar com Atendente', action: 'TALK_TO_AGENT' }
        ],
        position: { x: 400, y: 100 }
      }
    ],
    edges: [
      { id: 'edge-1', source: 'node-1', target: 'node-2' }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'flow-2',
    name: 'Carrinho Abandonado',
    description: 'Lembrete para clientes que abandonaram o carrinho',
    trigger: 'abandoned_cart',
    active: false,
    nodes: [
      {
        id: 'node-1',
        type: 'text',
        content: 'Olá {{customer_name}}! Notamos que você deixou alguns itens no seu carrinho. Deseja concluir seu pedido?',
        position: { x: 100, y: 100 },
        nextNodeId: 'node-2'
      },
      {
        id: 'node-2',
        type: 'button',
        content: 'Escolha uma opção:',
        buttons: [
          { id: 'btn-1', text: 'Concluir Pedido', action: 'COMPLETE_ORDER' },
          { id: 'btn-2', text: 'Limpar Carrinho', action: 'CLEAR_CART' }
        ],
        position: { x: 400, y: 100 }
      }
    ],
    edges: [
      { id: 'edge-1', source: 'node-1', target: 'node-2' }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const sampleContacts: WhatsAppContact[] = [
  {
    id: 'contact-1',
    phoneNumber: '+5511999887766',
    name: 'João Silva',
    lastInteraction: new Date(Date.now() - 86400000).toISOString() // 1 dia atrás
  },
  {
    id: 'contact-2',
    phoneNumber: '+5511988776655',
    name: 'Maria Oliveira',
    lastInteraction: new Date(Date.now() - 3600000).toISOString() // 1 hora atrás
  }
];

export const WhatsAppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [accountInfo, setAccountInfo] = useState<{ id: string; name: string } | null>(null);
  const [flows, setFlows] = useState<WhatsAppFlow[]>(sampleFlows);
  const [contacts, setContacts] = useState<WhatsAppContact[]>(sampleContacts);

  // Verificar se existem credenciais armazenadas ao iniciar
  useEffect(() => {
    const storedToken = localStorage.getItem('whatsapp_token');
    const storedPhoneNumberId = localStorage.getItem('whatsapp_phone_id');
    
    if (storedToken && storedPhoneNumberId) {
      connectWhatsApp(storedToken, storedPhoneNumberId).catch(() => {
        // Tokens podem ter expirado
        localStorage.removeItem('whatsapp_token');
        localStorage.removeItem('whatsapp_phone_id');
      });
    }
  }, []);

  const connectWhatsApp = async (token: string, phoneNumberId: string) => {
    setIsLoading(true);
    setConnectionError(null);
    
    try {
      // Em uma implementação real, aqui faríamos uma chamada à API do WhatsApp
      // para verificar as credenciais
      
      // Simulando uma chamada à API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Verificação simulada das credenciais
      if (token && phoneNumberId) {
        setIsConnected(true);
        setAccountInfo({
          id: phoneNumberId,
          name: 'YummyOrder WhatsApp Business'
        });
        
        // Armazenar credenciais para uso futuro
        localStorage.setItem('whatsapp_token', token);
        localStorage.setItem('whatsapp_phone_id', phoneNumberId);
        
        toast.success('WhatsApp conectado com sucesso!');
      } else {
        throw new Error('Credenciais inválidas');
      }
    } catch (error) {
      setConnectionError('Não foi possível conectar ao WhatsApp. Verifique suas credenciais.');
      toast.error('Erro ao conectar com WhatsApp');
      console.error('Erro ao conectar com WhatsApp:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWhatsApp = () => {
    setIsConnected(false);
    setAccountInfo(null);
    localStorage.removeItem('whatsapp_token');
    localStorage.removeItem('whatsapp_phone_id');
    toast.success('WhatsApp desconectado com sucesso!');
  };

  const createFlow = async (flowData: Omit<WhatsAppFlow, 'id' | 'createdAt' | 'updatedAt'>): Promise<WhatsAppFlow> => {
    // Simulando criação de fluxo
    const newFlow: WhatsAppFlow = {
      ...flowData,
      id: `flow-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setFlows(prev => [newFlow, ...prev]);
    toast.success('Fluxo criado com sucesso!');
    return newFlow;
  };

  const updateFlow = async (id: string, updates: Partial<Omit<WhatsAppFlow, 'id' | 'createdAt' | 'updatedAt'>>): Promise<WhatsAppFlow> => {
    const updatedFlows = flows.map(flow => {
      if (flow.id === id) {
        const updatedFlow = {
          ...flow,
          ...updates,
          updatedAt: new Date().toISOString()
        };
        return updatedFlow;
      }
      return flow;
    });
    
    setFlows(updatedFlows);
    
    const updatedFlow = updatedFlows.find(flow => flow.id === id);
    if (!updatedFlow) throw new Error('Fluxo não encontrado');
    
    toast.success('Fluxo atualizado com sucesso!');
    return updatedFlow;
  };

  const deleteFlow = async (id: string): Promise<void> => {
    setFlows(prev => prev.filter(flow => flow.id !== id));
    toast.success('Fluxo excluído com sucesso!');
  };

  const activateFlow = async (id: string): Promise<void> => {
    await updateFlow(id, { active: true });
  };

  const deactivateFlow = async (id: string): Promise<void> => {
    await updateFlow(id, { active: false });
  };

  const sendTestMessage = async (phoneNumber: string, message: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Simulando envio de mensagem
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`Mensagem enviada para ${phoneNumber}`);
      
      // Adicionando ou atualizando um contato na lista
      const existingContactIndex = contacts.findIndex(contact => contact.phoneNumber === phoneNumber);
      
      if (existingContactIndex >= 0) {
        const updatedContacts = [...contacts];
        updatedContacts[existingContactIndex] = {
          ...updatedContacts[existingContactIndex],
          lastInteraction: new Date().toISOString()
        };
        setContacts(updatedContacts);
      } else {
        setContacts(prev => [
          {
            id: `contact-${Date.now()}`,
            phoneNumber,
            name: `Cliente ${phoneNumber.slice(-4)}`,
            lastInteraction: new Date().toISOString()
          },
          ...prev
        ]);
      }
    } catch (error) {
      toast.error('Erro ao enviar mensagem');
      console.error('Erro ao enviar mensagem:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <WhatsAppContext.Provider
      value={{
        isConnected,
        isLoading,
        connectionError,
        accountInfo,
        flows,
        contacts,
        connectWhatsApp,
        disconnectWhatsApp,
        createFlow,
        updateFlow,
        deleteFlow,
        activateFlow,
        deactivateFlow,
        sendTestMessage
      }}
    >
      {children}
    </WhatsAppContext.Provider>
  );
};

export const useWhatsApp = () => {
  const context = useContext(WhatsAppContext);
  if (context === undefined) {
    throw new Error('useWhatsApp must be used within a WhatsAppProvider');
  }
  return context;
};
