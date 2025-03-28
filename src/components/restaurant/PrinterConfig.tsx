
import React, { useState, useEffect } from 'react';
import { Printer, RefreshCw, Settings, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Order } from '@/context/OrderContext';

interface PrinterConfigProps {
  onPrinterTest?: () => void;
}

// Tipos de impressoras suportadas
const PRINTER_MODELS = [
  { value: 'epson', label: 'Epson TM-T20' },
  { value: 'bematech', label: 'Bematech MP-4200 TH' },
  { value: 'elgin', label: 'Elgin i9' },
  { value: 'custom', label: 'Outro modelo (ESC/POS)' }
];

// Interfaces de comunicação suportadas
const CONNECTION_TYPES = [
  { value: 'usb', label: 'USB' },
  { value: 'network', label: 'Rede (TCP/IP)' },
  { value: 'bluetooth', label: 'Bluetooth' },
  { value: 'serial', label: 'Serial' }
];

const PrinterConfig: React.FC<PrinterConfigProps> = ({ onPrinterTest }) => {
  const [printerModel, setPrinterModel] = useState<string>(
    localStorage.getItem('printer_model') || 'epson'
  );
  const [connectionType, setConnectionType] = useState<string>(
    localStorage.getItem('printer_connection') || 'usb'
  );
  const [ipAddress, setIpAddress] = useState<string>(
    localStorage.getItem('printer_ip') || ''
  );
  const [port, setPort] = useState<string>(
    localStorage.getItem('printer_port') || '9100'
  );
  const [autoPrint, setAutoPrint] = useState<boolean>(
    localStorage.getItem('printer_auto_print') === 'true'
  );
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isTesting, setIsTesting] = useState<boolean>(false);

  // Salvar configurações quando mudarem
  useEffect(() => {
    localStorage.setItem('printer_model', printerModel);
    localStorage.setItem('printer_connection', connectionType);
    localStorage.setItem('printer_ip', ipAddress);
    localStorage.setItem('printer_port', port);
    localStorage.setItem('printer_auto_print', String(autoPrint));
  }, [printerModel, connectionType, ipAddress, port, autoPrint]);

  // Simular conexão com a impressora
  const connectPrinter = () => {
    // Em um app real, aqui você faria a comunicação com a impressora
    // usando bibliotecas como node-escpos, printer, etc.
    
    // Esta é uma simulação
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: 'Conectando à impressora...',
        success: () => {
          setIsConnected(true);
          return 'Impressora conectada com sucesso!';
        },
        error: 'Falha ao conectar à impressora.',
      }
    );
  };

  // Testar impressão
  const testPrinter = () => {
    if (!isConnected) {
      toast.error('Conecte a impressora primeiro!');
      return;
    }

    setIsTesting(true);
    
    // Simulação de teste de impressão
    setTimeout(() => {
      // Aqui seria o código real para imprimir um ticket de teste
      const testOrder: Order = {
        id: 'test-1234',
        userId: 'test',
        userName: 'Cliente Teste',
        userEmail: 'teste@exemplo.com',
        userPhone: '(11) 98765-4321',
        items: [
          {
            id: 'item-1',
            productId: '1',
            name: 'X-Tudo',
            price: 25.90,
            quantity: 1,
            image: '',
            selectedOptions: [
              { ingredientId: '101', name: 'Queijo extra', price: 3.00 }
            ]
          },
          {
            id: 'item-2',
            productId: '2',
            name: 'Refrigerante',
            price: 6.00,
            quantity: 1,
            image: '',
            selectedOptions: []
          }
        ],
        subtotal: 34.90,
        deliveryFee: 5.00,
        total: 39.90,
        status: 'placed',
        placedAt: new Date().toISOString(),
        paymentMethod: 'Credit Card',
        notes: 'Teste de impressão'
      };
      
      if (onPrinterTest) {
        onPrinterTest();
      }
      
      printOrder(testOrder);
      setIsTesting(false);
      toast.success('Teste de impressão enviado com sucesso!');
    }, 2000);
  };

  // Função para imprimir um pedido
  const printOrder = (order: Order) => {
    // Esta função seria implementada com o código real para imprimir
    // usando a biblioteca de impressão térmica apropriada
    
    console.log('Imprimindo pedido:', order);
    console.log('Usando modelo:', printerModel);
    console.log('Conexão:', connectionType);
    
    // Simulação do conteúdo do ticket
    const ticket = `
----------------------------------
      PEDIDO #${order.id.slice(-4)}
----------------------------------
Data: ${new Date(order.placedAt).toLocaleString()}
Cliente: ${order.userName}
Telefone: ${order.userPhone}
----------------------------------
ITENS:
${order.items.map(item => `
${item.quantity}x ${item.name}
   ${item.selectedOptions.map(opt => `   + ${opt.name}`).join('\n')}
   R$ ${(item.price * item.quantity).toFixed(2)}
`).join('')}
----------------------------------
Subtotal: R$ ${order.subtotal.toFixed(2)}
Taxa de entrega: R$ ${order.deliveryFee.toFixed(2)}
TOTAL: R$ ${order.total.toFixed(2)}
----------------------------------
Pagamento: ${order.paymentMethod}
${order.notes ? `\nObservações: ${order.notes}` : ''}
----------------------------------
         Obrigado!
----------------------------------
`;
    
    console.log('Conteúdo do ticket:');
    console.log(ticket);
    
    // Em uma implementação real, você enviaria este conteúdo para a impressora
  };

  // Escuta por novos pedidos para impressão automática
  useEffect(() => {
    if (!autoPrint || !isConnected) return;
    
    const handleNewOrder = (event: CustomEvent<Order>) => {
      const order = event.detail;
      toast.info(`Imprimindo pedido #${order.id.slice(-4)} automaticamente`);
      printOrder(order);
    };
    
    // Adicionar listener para o evento de novo pedido
    window.addEventListener('new-order-received' as any, handleNewOrder as EventListener);
    
    return () => {
      window.removeEventListener('new-order-received' as any, handleNewOrder as EventListener);
    };
  }, [autoPrint, isConnected]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium flex items-center">
          <Printer className="mr-2 h-5 w-5 text-green-500" />
          Configuração de Impressora Térmica
        </CardTitle>
        <CardDescription>
          Configure sua impressora térmica para imprimir pedidos automaticamente
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="printer-model">Modelo da Impressora</Label>
          <Select 
            value={printerModel} 
            onValueChange={setPrinterModel}
          >
            <SelectTrigger id="printer-model">
              <SelectValue placeholder="Selecione o modelo" />
            </SelectTrigger>
            <SelectContent>
              {PRINTER_MODELS.map(model => (
                <SelectItem key={model.value} value={model.value}>
                  {model.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="connection-type">Tipo de Conexão</Label>
          <Select 
            value={connectionType} 
            onValueChange={setConnectionType}
          >
            <SelectTrigger id="connection-type">
              <SelectValue placeholder="Selecione o tipo de conexão" />
            </SelectTrigger>
            <SelectContent>
              {CONNECTION_TYPES.map(conn => (
                <SelectItem key={conn.value} value={conn.value}>
                  {conn.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {connectionType === 'network' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ip-address">Endereço IP</Label>
              <Input 
                id="ip-address" 
                placeholder="192.168.1.100" 
                value={ipAddress}
                onChange={(e) => setIpAddress(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="port">Porta</Label>
              <Input 
                id="port" 
                placeholder="9100" 
                value={port}
                onChange={(e) => setPort(e.target.value)}
              />
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="auto-print">Impressão Automática</Label>
            <p className="text-xs text-muted-foreground">
              Imprimir pedidos automaticamente ao recebê-los
            </p>
          </div>
          <Switch 
            id="auto-print" 
            checked={autoPrint}
            onCheckedChange={setAutoPrint}
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <Button 
            variant={isConnected ? "outline" : "default"}
            onClick={connectPrinter}
            className="flex-1"
          >
            {isConnected ? (
              <>
                <Check className="h-4 w-4 mr-2 text-green-500" />
                Conectado
              </>
            ) : (
              <>
                <Settings className="h-4 w-4 mr-2" />
                Conectar Impressora
              </>
            )}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={testPrinter} 
            disabled={!isConnected || isTesting}
            className="flex-1"
          >
            {isTesting ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Testando...
              </>
            ) : (
              'Imprimir Teste'
            )}
          </Button>
        </div>
        
        <div className="bg-yellow-50 p-3 rounded-md mt-2">
          <p className="text-xs text-yellow-700">
            <strong>Nota:</strong> Para usar impressoras térmicas, você pode precisar de drivers específicos ou
            bibliotecas adicionais. Em ambiente web, recomenda-se usar uma aplicação local para intermediar
            a comunicação com a impressora.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PrinterConfig;
