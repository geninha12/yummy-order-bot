
import React, { useState } from 'react';
import RestaurantLayout from '@/components/layout/RestaurantLayout';
import WhatsAppConnection from '@/components/restaurant/whatsapp/WhatsAppConnection';
import TestMessage from '@/components/restaurant/whatsapp/TestMessage';
import FlowList from '@/components/restaurant/whatsapp/FlowList';
import FlowEditor from '@/components/restaurant/whatsapp/FlowEditor';
import { useWhatsApp, WhatsAppFlow } from '@/context/WhatsAppContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

enum ViewState {
  LIST,
  EDIT,
  NEW
}

const WhatsApp: React.FC = () => {
  const { isConnected } = useWhatsApp();
  const [viewState, setViewState] = useState<ViewState>(ViewState.LIST);
  const [selectedFlow, setSelectedFlow] = useState<WhatsAppFlow | undefined>(undefined);
  const [activeTab, setActiveTab] = useState('flows');

  const handleEditFlow = (flow: WhatsAppFlow) => {
    setSelectedFlow(flow);
    setViewState(ViewState.EDIT);
  };

  const handleNewFlow = () => {
    setSelectedFlow(undefined);
    setViewState(ViewState.NEW);
  };

  const handleBackToList = () => {
    setViewState(ViewState.LIST);
    setSelectedFlow(undefined);
  };

  if (viewState === ViewState.EDIT || viewState === ViewState.NEW) {
    return (
      <RestaurantLayout>
        <FlowEditor 
          flow={selectedFlow} 
          onBack={handleBackToList} 
        />
      </RestaurantLayout>
    );
  }

  return (
    <RestaurantLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="md:w-2/3">
            <WhatsAppConnection />
          </div>
          <div className="md:w-1/3">
            <TestMessage />
          </div>
        </div>

        {isConnected && (
          <Tabs 
            defaultValue="flows" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="mb-4">
              <TabsTrigger value="flows">Fluxos de Mensagens</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="analytics">Análises</TabsTrigger>
            </TabsList>
            
            <TabsContent value="flows">
              <FlowList onEdit={handleEditFlow} onAdd={handleNewFlow} />
            </TabsContent>
            
            <TabsContent value="templates">
              <div className="flex items-center justify-center h-64 bg-muted/30 rounded-lg border border-dashed">
                <p className="text-muted-foreground">
                  Gerenciamento de templates em breve...
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="analytics">
              <div className="flex items-center justify-center h-64 bg-muted/30 rounded-lg border border-dashed">
                <p className="text-muted-foreground">
                  Análises e relatórios em breve...
                </p>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </RestaurantLayout>
  );
};

export default WhatsApp;
