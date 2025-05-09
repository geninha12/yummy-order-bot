
import React from 'react';
import { Button } from '@/components/ui/button';
import { Order, OrderStatus } from '@/context/OrderContext';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Printer } from 'lucide-react';

interface OrderCardProps {
  order: Order;
  onUpdateStatus: (id: string, status: OrderStatus) => void;
  onPrint?: (id: string) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onUpdateStatus, onPrint }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const statusColors: Record<OrderStatus, string> = {
    placed: 'bg-blue-100 text-blue-800',
    preparing: 'bg-yellow-100 text-yellow-800',
    ready: 'bg-green-100 text-green-800',
    delivered: 'bg-purple-100 text-purple-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  const statusOptions: { value: OrderStatus; label: string }[] = [
    { value: 'placed', label: 'Recebido' },
    { value: 'preparing', label: 'Preparando' },
    { value: 'ready', label: 'Pronto' },
    { value: 'delivered', label: 'Entregue' },
    { value: 'cancelled', label: 'Cancelado' }
  ];

  const translateStatus = (status: OrderStatus) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option ? option.label : status;
  };

  return (
    <Card className="animate-scale-in">
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm font-medium">Pedido #{order.id.slice(-4)}</div>
          <div className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[order.status]}`}>
            {translateStatus(order.status)}
          </div>
        </div>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium">{order.userName}</h3>
            <p className="text-xs text-muted-foreground">{order.userPhone}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold">R${order.total.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">{formatDate(order.placedAt)}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-1 mb-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <div className="flex gap-2">
                <span>{item.quantity}x</span>
                <div>
                  <div>{item.name}</div>
                  {item.selectedOptions.length > 0 && (
                    <div className="text-xs text-muted-foreground">
                      {item.selectedOptions.map(opt => opt.name).join(', ')}
                    </div>
                  )}
                </div>
              </div>
              <div className="text-sm">R${((item.price + item.selectedOptions.reduce((sum, opt) => sum + opt.price, 0)) * item.quantity).toFixed(2)}</div>
            </div>
          ))}
        </div>
        
        <div className="text-xs space-y-1 border-t border-dashed border-gray-200 pt-2">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>R${order.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Entrega:</span>
            <span>R${order.deliveryFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-medium">
            <span>Total:</span>
            <span>R${order.total.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex flex-col gap-2">
        <div className="w-full">
          <div className="text-xs font-medium uppercase text-muted-foreground mb-1">
            Atualizar Status
          </div>
          <Select
            defaultValue={order.status}
            onValueChange={(value) => onUpdateStatus(order.id, value as OrderStatus)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2 mt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => {
              // Placeholder para integração com WhatsApp
              const phone = order.userPhone?.replace(/[^0-9]/g, '') || '';
              const message = `Olá ${order.userName}, o status do seu pedido #${order.id.slice(-4)} foi atualizado para: ${translateStatus(order.status)}`;
              window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`);
            }}
          >
            Contato via WhatsApp
          </Button>
          
          {onPrint && (
            <Button 
              variant="secondary" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={() => onPrint(order.id)}
            >
              <Printer className="h-4 w-4" />
              Imprimir
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default OrderCard;
