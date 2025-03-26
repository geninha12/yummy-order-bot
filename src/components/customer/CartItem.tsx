
import React from 'react';
import { Minus, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CartItem as CartItemType, useCart } from '@/context/CartContext';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateItemQuantity, removeItem } = useCart();

  const calculateItemTotal = () => {
    const basePrice = item.price;
    const addonsPrice = item.selectedOptions.reduce((sum, opt) => sum + opt.price, 0);
    return (basePrice + addonsPrice) * item.quantity;
  };

  return (
    <div className="flex py-4 border-b border-gray-200 animate-fade-in">
      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="ml-4 flex flex-1 flex-col">
        <div className="flex justify-between">
          <div>
            <h3 className="text-base font-medium">{item.name}</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              ${item.price.toFixed(2)}
              {item.selectedOptions.length > 0 && (
                <span> + ${item.selectedOptions.reduce((sum, opt) => sum + opt.price, 0).toFixed(2)} add-ons</span>
              )}
            </p>
            {item.selectedOptions.length > 0 && (
              <p className="mt-1 text-xs text-muted-foreground">
                {item.selectedOptions.map(opt => opt.name).join(', ')}
              </p>
            )}
          </div>
          <p className="text-sm font-medium">
            ${calculateItemTotal().toFixed(2)}
          </p>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="text-sm w-4 text-center">{item.quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-red-500"
            onClick={() => removeItem(item.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
