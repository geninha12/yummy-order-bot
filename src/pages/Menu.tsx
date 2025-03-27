
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import MenuItemBR from '@/components/customer/MenuItemBR';
import { useMenu } from '@/context/MenuContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Menu = () => {
  const { menuItems, categories } = useMenu();
  const [activeCategory, setActiveCategory] = useState<string | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = menuItems
    .filter(item => item.available)
    .filter(item => 
      activeCategory === 'all' || item.category === activeCategory
    )
    .filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4 animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="heading-lg mb-2">Nosso Cardápio</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore nossa ampla variedade de pratos deliciosos, feitos com ingredientes frescos
            e disponíveis para entrega diretamente em sua casa.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Pesquisar no cardápio..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex overflow-x-auto pb-2 md:pb-0 gap-2">
              <Button
                variant={activeCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveCategory('all')}
                className="whitespace-nowrap"
              >
                Todos os Itens
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={activeCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveCategory(category)}
                  className="whitespace-nowrap"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Menu Items */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <MenuItemBR key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum item encontrado. Por favor, tente outra pesquisa.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Menu;
