
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MenuItem as MenuItemType, Ingredient } from '@/context/MenuContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CartItemOption, useCart } from '@/context/CartContext';

interface MenuItemProps {
  item: MenuItemType;
}

const MenuItem: React.FC<MenuItemProps> = ({ item }) => {
  const { addItem } = useCart();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);

  const handleAddToCart = () => {
    const selectedOptions: CartItemOption[] = item.ingredients
      .filter(ing => selectedIngredients.includes(ing.id))
      .map(ing => ({
        ingredientId: ing.id,
        name: ing.name,
        price: ing.price
      }));

    addItem({
      productId: item.id,
      name: item.name,
      price: item.price,
      quantity,
      image: item.image,
      selectedOptions
    });

    setIsDialogOpen(false);
    setQuantity(1);
    setSelectedIngredients([]);
  };

  const toggleIngredient = (id: string) => {
    setSelectedIngredients(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const calculateTotal = () => {
    const basePrice = item.price * quantity;
    const addonsPrice = item.ingredients
      .filter(ing => selectedIngredients.includes(ing.id))
      .reduce((sum, ing) => sum + ing.price, 0) * quantity;
    
    return basePrice + addonsPrice;
  };

  if (!item.available) {
    return null;
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <Card className="overflow-hidden h-full transition-all duration-200 hover:shadow-md animate-fade-in">
        <div className="relative h-48 overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
        <CardHeader className="p-4 pb-0">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">{item.name}</CardTitle>
              <CardDescription className="mt-1">{item.category}</CardDescription>
            </div>
            <div className="text-lg font-bold">${item.price.toFixed(2)}</div>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <DialogTrigger asChild>
            <Button className="w-full">
              <Plus className="h-4 w-4 mr-2" /> Add to Cart
            </Button>
          </DialogTrigger>
        </CardFooter>
      </Card>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{item.name}</DialogTitle>
          <DialogDescription>
            Customize your order
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="aspect-video overflow-hidden rounded-md">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </div>

          <p className="text-sm">{item.description}</p>

          {item.ingredients.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2">Add extra ingredients</h3>
              <div className="space-y-2">
                {item.ingredients.map((ing) => (
                  <div key={ing.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={ing.id}
                        checked={selectedIngredients.includes(ing.id)}
                        onCheckedChange={() => toggleIngredient(ing.id)}
                      />
                      <Label htmlFor={ing.id} className="text-sm">
                        {ing.name}
                      </Label>
                    </div>
                    <span className="text-sm">+${ing.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-sm font-medium mb-2">Quantity</h3>
            <div className="flex items-center space-x-3">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                disabled={quantity <= 1}
              >
                -
              </Button>
              <span className="w-8 text-center">{quantity}</span>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </Button>
            </div>
          </div>

          <div className="flex justify-between items-center border-t pt-4">
            <div className="text-sm font-medium">Total:</div>
            <div className="text-lg font-bold">${calculateTotal().toFixed(2)}</div>
          </div>

          <Button
            className="w-full"
            onClick={handleAddToCart}
          >
            Add to Cart - ${calculateTotal().toFixed(2)}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MenuItem;
