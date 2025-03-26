
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

const Contato = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui seria implementada a lógica de envio do formulário
    console.log('Formulário de contato enviado');
  };

  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Entre em Contato</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <Phone className="mr-2 h-5 w-5 text-accent" /> Telefone
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">(11) 4002-8922</p>
                <p className="text-muted-foreground">(11) 99876-5432</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <Mail className="mr-2 h-5 w-5 text-accent" /> Email
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">contato@yummyorder.com</p>
                <p className="text-muted-foreground">suporte@yummyorder.com</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5 text-accent" /> Endereço
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Av. Paulista, 1000</p>
                <p className="text-muted-foreground">São Paulo, SP - 01310-100</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Envie uma Mensagem</CardTitle>
                <CardDescription>
                  Preencha o formulário abaixo e entraremos em contato o mais breve possível.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Nome</Label>
                      <Input id="name" placeholder="Seu nome completo" />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="seu@email.com" />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="subject">Assunto</Label>
                      <Input id="subject" placeholder="Sobre o que você quer falar?" />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="message">Mensagem</Label>
                      <Textarea 
                        id="message" 
                        placeholder="Como podemos ajudar?" 
                        className="min-h-[120px]" 
                      />
                    </div>
                  </div>
                </form>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full">Enviar Mensagem</Button>
              </CardFooter>
            </Card>
            
            <div>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="mr-2 h-5 w-5 text-accent" /> Horário de Atendimento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Segunda - Sexta</span>
                      <span>08:00 - 20:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sábado</span>
                      <span>09:00 - 18:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Domingo</span>
                      <span>10:00 - 16:00</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>FAQ</CardTitle>
                  <CardDescription>
                    Perguntas frequentes
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium">Quanto tempo leva para receber meu pedido?</h3>
                    <p className="text-sm text-muted-foreground">
                      O tempo de entrega varia conforme o restaurante e sua localização, 
                      mas geralmente leva entre 30 e 60 minutos.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium">Como faço para me tornar um restaurante parceiro?</h3>
                    <p className="text-sm text-muted-foreground">
                      Para se tornar um parceiro, acesse a seção "Para Restaurantes" 
                      e preencha o formulário de cadastro.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium">Quais são as formas de pagamento aceitas?</h3>
                    <p className="text-sm text-muted-foreground">
                      Aceitamos cartões de crédito, débito, vale-refeição e pagamento em dinheiro na entrega.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contato;
