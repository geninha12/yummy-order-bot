
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Sobre = () => {
  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Sobre o YummyOrder</h1>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Nossa História</CardTitle>
              <CardDescription>Como tudo começou</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Fundado em 2023, o YummyOrder nasceu da paixão por conectar pessoas a restaurantes incríveis. 
                Nossa missão é proporcionar a melhor experiência gastronômica sem que você precise sair de casa.
              </p>
              <p className="text-muted-foreground">
                O que começou como uma pequena startup logo se transformou em uma plataforma completa de pedidos 
                online, com centenas de restaurantes parceiros e milhares de clientes satisfeitos.
              </p>
            </CardContent>
          </Card>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Nossa Missão</CardTitle>
              <CardDescription>O que nos move</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                No YummyOrder, acreditamos que a comida tem o poder de unir pessoas. Nossa missão é conectar 
                clientes aos seus pratos favoritos com apenas alguns cliques, garantindo uma experiência 
                conveniente, rápida e satisfatória para todos os envolvidos.
              </p>
            </CardContent>
          </Card>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Nossos Valores</CardTitle>
              <CardDescription>Princípios que guiam nossas decisões</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><span className="font-medium text-foreground">Qualidade:</span> Comprometimento com a excelência em cada pedido.</li>
                <li><span className="font-medium text-foreground">Conveniência:</span> Tornar o processo de pedido o mais simples possível.</li>
                <li><span className="font-medium text-foreground">Comunidade:</span> Apoiar restaurantes locais e fortalecer a economia local.</li>
                <li><span className="font-medium text-foreground">Inovação:</span> Buscar constantemente novas formas de melhorar nossa plataforma.</li>
                <li><span className="font-medium text-foreground">Sustentabilidade:</span> Compromisso com práticas ambientalmente responsáveis.</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Nossa Equipe</CardTitle>
              <CardDescription>As pessoas por trás do YummyOrder</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Nossa equipe é formada por apaixonados por tecnologia, comida e experiências incríveis. 
                Trabalhamos diariamente para tornar o YummyOrder a melhor plataforma de delivery do Brasil.
              </p>
              <p className="text-muted-foreground">
                Estamos sempre em busca de talentos que compartilhem nossa paixão e visão. Se você se identifica 
                com nossos valores, confira nossas oportunidades de carreira.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Sobre;
