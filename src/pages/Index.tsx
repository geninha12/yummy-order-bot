
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, TruckIcon, Utensils, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';
import { useMenu } from '@/context/MenuContext';

const Index = () => {
  const { menuItems } = useMenu();
  
  // Pick some featured menu items
  const featuredItems = menuItems.slice(0, 3);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gray-50 overflow-hidden">
        <div className="container mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10 animate-fade-in">
            <h1 className="heading-xl mb-4 text-center md:text-left">
              Comida Deliciosa <br />
              <span className="text-primary">Entregue na Sua Porta</span>
            </h1>
            <p className="text-muted-foreground mb-8 max-w-md text-center md:text-left">
              Peça dos seus restaurantes favoritos e desfrute da conveniência da entrega em casa. Rápido, fresco e sempre no horário.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link to="/cardapio">
                <Button size="lg" className="w-full sm:w-auto">
                  Peça Agora
                </Button>
              </Link>
              <Link to="/cadastro">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Junte-se ao YummyOrder
                </Button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 relative animate-fade-in">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1565299585323-38d6b0865b47?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80"
                alt="Comida Deliciosa"
                className="rounded-lg shadow-xl"
              />
              <div className="absolute -bottom-4 -left-4 bg-white p-3 rounded-lg shadow-lg flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <TruckIcon className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="text-sm font-medium">Entrega Rápida</div>
                  <div className="text-xs text-muted-foreground">30 min ou menos</div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-white p-3 rounded-lg shadow-lg">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-medium ml-1">4.9</span>
                </div>
                <div className="text-xs text-muted-foreground text-center mt-1">Melhor Avaliado</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="heading-lg text-center mb-12">Como Funciona</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center animate-fade-in">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <Utensils className="h-8 w-8 text-primary" />
              </div>
              <h3 className="heading-sm mb-2">Escolha sua Comida</h3>
              <p className="text-muted-foreground">
                Navegue pelo nosso cardápio e escolha seus pratos favoritos dos melhores restaurantes.
              </p>
            </div>
            <div className="flex flex-col items-center text-center animate-fade-in">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <CreditCard className="h-8 w-8 text-primary" />
              </div>
              <h3 className="heading-sm mb-2">Pagamento Fácil</h3>
              <p className="text-muted-foreground">
                Pague online ou em dinheiro na entrega. Aceitamos todas as principais formas de pagamento.
              </p>
            </div>
            <div className="flex flex-col items-center text-center animate-fade-in">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <TruckIcon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="heading-sm mb-2">Entrega Rápida</h3>
              <p className="text-muted-foreground">
                Sua comida será entregue na sua porta em 30 minutos ou menos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Menu */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="heading-lg">Cardápio em Destaque</h2>
            <Link to="/cardapio" className="text-primary flex items-center hover:underline">
              Ver Tudo <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredItems.map((item) => (
              <Link to="/cardapio" key={item.id}>
                <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow animate-fade-in">
                  <div className="h-48 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between mb-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <span className="font-bold">R${item.price.toFixed(2)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="heading-lg mb-4">Pronto para Pedir?</h2>
          <p className="max-w-xl mx-auto mb-8">
            Navegue pelo nosso extenso cardápio e peça seus pratos favoritos para entrega ou retirada.
            Rápido, fresco e conveniente.
          </p>
          <Link to="/cardapio">
            <Button size="lg" variant="secondary">
              Comece a Pedir
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
