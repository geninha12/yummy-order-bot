
import React, { useState } from 'react';
import { Plus, Minus, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MenuItem as MenuItemType } from '@/context/MenuContext';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Checkbox
} from "@/components/ui/checkbox";
import { Label } from '@/components/ui/label';

interface MenuItemProps {
  item: MenuItemType;
}

const MenuItemBR = ({ item }: MenuItemProps) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Array<{ id: string, name: string, price: number }>>([]);

  const incrementQuantity = () => setQuantity(q => q + 1);
  const decrementQuantity = () => setQuantity(q => (q > 1 ? q - 1 : 1));

  const totalPrice = (
    item.price + selectedOptions.reduce((sum, option) => sum + option.price, 0)
  ) * quantity;

  const handleOptionChange = (option: { id: string, name: string, price: number }, checked: boolean) => {
    if (checked) {
      setSelectedOptions(prev => [...prev, option]);
    } else {
      setSelectedOptions(prev => prev.filter(o => o.id !== option.id));
    }
  };

  const handleAddToCart = () => {
    const customItem = {
      ...item,
      quantity,
      selectedOptions
    };
    
    addToCart(customItem);
    toast.success('Item adicionado ao carrinho!');
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow animate-scale-in">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={item.image} 
          alt={item.name}
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
        />
        {item.discount > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            {item.discount}% OFF
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-medium">{item.name}</h3>
            <p className="text-xs text-muted-foreground">{item.category}</p>
          </div>
          <div className="text-right">
            <div className="font-bold">R${item.price.toFixed(2)}</div>
            {item.discount > 0 && (
              <div className="text-xs line-through text-muted-foreground">
                R${(item.price / (1 - item.discount / 100)).toFixed(2)}
              </div>
            )}
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {item.description}
        </p>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button className="w-full">
              Adicionar ao Carrinho
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-4/5 overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="text-xl">{item.name}</SheetTitle>
            </SheetHeader>
            
            <div className="py-4">
              <div className="aspect-[16/9] overflow-hidden rounded-md mb-4">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <p className="text-muted-foreground mb-6">
                {item.description}
              </p>
              
              {item.ingredients.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium uppercase text-muted-foreground mb-3">
                    Escolha seus Adicionais
                  </h3>
                  <div className="space-y-2">
                    {item.ingredients.map((option) => (
                      <div key={option.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Checkbox 
                            id={option.id} 
                            onCheckedChange={(checked) => 
                              handleOptionChange(option, checked as boolean)
                            }
                          />
                          <Label htmlFor={option.id} className="text-sm font-normal">
                            {option.name}
                          </Label>
                        </div>
                        <div className="text-sm">
                          + R${option.price.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mb-6">
                <h3 className="text-sm font-medium uppercase text-muted-foreground mb-3">
                  Quantidade
                </h3>
                <div className="flex border rounded-md w-max">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={decrementQuantity}
                    className="text-muted-foreground"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <div className="flex items-center justify-center w-12">
                    {quantity}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={incrementQuantity}
                    className="text-muted-foreground"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <SheetFooter className="pt-2 border-t">
              <div className="w-full flex flex-col gap-4">
                <div className="flex justify-between text-lg font-medium">
                  <span>Total:</span>
                  <span>R${totalPrice.toFixed(2)}</span>
                </div>
                <Button onClick={handleAddToCart} size="lg" className="w-full">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Adicionar ao Carrinho
                </Button>
              </div>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default MenuItemBR;
