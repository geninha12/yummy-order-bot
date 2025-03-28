
import React, { useState, useEffect } from 'react';
import { Search, Printer } from 'lucide-react';
import RestaurantLayout from '@/components/layout/RestaurantLayout';
import OrderCard from '@/components/restaurant/OrderCard';
import PrinterConfig from '@/components/restaurant/PrinterConfig';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Order, OrderStatus, useOrders } from '@/context/OrderContext';
import { toast } from 'sonner';

const OrderManagement = () => {
  const { orders, updateOrderStatus } = useOrders();
  const [searchQuery, setSearchQuery] = useState('');
  const [showPrinterConfig, setShowPrinterConfig] = useState(false);

  const statusCounts = {
    all: orders.length,
    placed: orders.filter(order => order.status === 'placed').length,
    preparing: orders.filter(order => order.status === 'preparing').length,
    ready: orders.filter(order => order.status === 'ready').length,
    delivered: orders.filter(order => order.status === 'delivered').length,
    cancelled: orders.filter(order => order.status === 'cancelled').length,
  };

  const filterOrdersByStatus = (status: string): Order[] => {
    return orders
      .filter(order => 
        status === 'all' || order.status === status
      )
      .filter(order =>
        order.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime());
  };

  const handleUpdateStatus = (id: string, status: OrderStatus) => {
    updateOrderStatus(id, status);
  };

  // Adicionar evento para imprimir quando um novo pedido chegar
  useEffect(() => {
    const handleNewOrder = (event: CustomEvent<Order>) => {
      const order = event.detail;
      // Verificar se a impressão automática está ativada
      const autoPrint = localStorage.getItem('printer_auto_print') === 'true';
      if (autoPrint) {
        toast.info(`Imprimindo pedido #${order.id.slice(-4)} automaticamente`);
      }
    };
    
    window.addEventListener('new-order-received' as any, handleNewOrder as EventListener);
    
    return () => {
      window.removeEventListener('new-order-received' as any, handleNewOrder as EventListener);
    };
  }, []);

  // Função para lidar com o clique em "Imprimir" na lista de pedidos
  const handlePrintOrder = (order: Order) => {
    // Disparar um evento CustomEvent com os detalhes do pedido
    const printEvent = new CustomEvent('print-order', { 
      detail: order 
    });
    window.dispatchEvent(printEvent);
    
    toast.success(`Pedido #${order.id.slice(-4)} enviado para impressão`);
  };

  return (
    <RestaurantLayout>
      <div className="animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Order Management</h1>
          
          <Dialog open={showPrinterConfig} onOpenChange={setShowPrinterConfig}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Printer className="h-4 w-4" />
                Configurar Impressora
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Configuração de Impressora</DialogTitle>
                <DialogDescription>
                  Configure sua impressora térmica para automatizar os pedidos
                </DialogDescription>
              </DialogHeader>
              <PrinterConfig 
                onPrinterTest={() => {
                  setShowPrinterConfig(false);
                  setTimeout(() => {
                    toast.success('Teste de impressora concluído. A impressora está funcionando corretamente.');
                  }, 1000);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search orders by ID or customer name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Tabs defaultValue="all">
          <TabsList className="mb-6 w-full justify-start">
            <TabsTrigger value="all" className="relative">
              All
              <span className="ml-1 bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs">
                {statusCounts.all}
              </span>
            </TabsTrigger>
            <TabsTrigger value="placed" className="relative">
              New
              {statusCounts.placed > 0 && (
                <span className="ml-1 bg-blue-100 text-blue-800 rounded-full px-2 py-0.5 text-xs">
                  {statusCounts.placed}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="preparing" className="relative">
              Preparing
              {statusCounts.preparing > 0 && (
                <span className="ml-1 bg-yellow-100 text-yellow-800 rounded-full px-2 py-0.5 text-xs">
                  {statusCounts.preparing}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="ready" className="relative">
              Ready
              {statusCounts.ready > 0 && (
                <span className="ml-1 bg-green-100 text-green-800 rounded-full px-2 py-0.5 text-xs">
                  {statusCounts.ready}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="delivered" className="relative">
              Delivered
              {statusCounts.delivered > 0 && (
                <span className="ml-1 bg-purple-100 text-purple-800 rounded-full px-2 py-0.5 text-xs">
                  {statusCounts.delivered}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="cancelled" className="relative">
              Cancelled
              {statusCounts.cancelled > 0 && (
                <span className="ml-1 bg-red-100 text-red-800 rounded-full px-2 py-0.5 text-xs">
                  {statusCounts.cancelled}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {['all', 'placed', 'preparing', 'ready', 'delivered', 'cancelled'].map((status) => (
            <TabsContent key={status} value={status} className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filterOrdersByStatus(status).map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onUpdateStatus={handleUpdateStatus}
                    onPrint={() => handlePrintOrder(order)}
                  />
                ))}
                {filterOrdersByStatus(status).length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <p className="text-muted-foreground">No orders found.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </RestaurantLayout>
  );
};

export default OrderManagement;
