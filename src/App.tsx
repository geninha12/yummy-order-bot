
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { MenuProvider } from "@/context/MenuContext";
import { OrderProvider } from "@/context/OrderContext";
import { WhatsAppProvider } from "@/context/WhatsAppContext";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Orders from "./pages/Orders";
import Sobre from "./pages/Sobre";
import Contato from "./pages/Contato";

// Restaurant Pages
import Dashboard from "./pages/restaurant/Dashboard";
import MenuManagement from "./pages/restaurant/MenuManagement";
import OrderManagement from "./pages/restaurant/OrderManagement";
import Analytics from "./pages/restaurant/Analytics";
import WhatsApp from "./pages/restaurant/WhatsApp";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <MenuProvider>
        <CartProvider>
          <OrderProvider>
            <WhatsAppProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  {/* Rotas Públicas */}
                  <Route path="/" element={<Index />} />
                  <Route path="/entrar" element={<Login />} />
                  <Route path="/cadastro" element={<Register />} />
                  <Route path="/cardapio" element={<Menu />} />
                  <Route path="/carrinho" element={<Cart />} />
                  <Route path="/finalizar-pedido" element={<Checkout />} />
                  <Route path="/confirmacao-pedido/:orderId" element={<OrderConfirmation />} />
                  <Route path="/pedidos" element={<Orders />} />
                  <Route path="/pedidos/:orderId" element={<OrderConfirmation />} />
                  <Route path="/sobre" element={<Sobre />} />
                  <Route path="/contato" element={<Contato />} />
                  
                  {/* Rotas Administrativas do Restaurante */}
                  <Route path="/restaurante/painel" element={<Dashboard />} />
                  <Route path="/restaurante/cardapio" element={<MenuManagement />} />
                  <Route path="/restaurante/pedidos" element={<OrderManagement />} />
                  <Route path="/restaurante/relatorios" element={<Analytics />} />
                  <Route path="/restaurante/whatsapp" element={<WhatsApp />} />
                  
                  {/* Rota de Erro */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </WhatsAppProvider>
          </OrderProvider>
        </CartProvider>
      </MenuProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
