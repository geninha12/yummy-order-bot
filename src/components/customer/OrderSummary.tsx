
import React from 'react';
import { useCart } from '@/context/CartContext';

interface OrderSummaryProps {
  showActions?: boolean;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ showActions = true }) => {
  const { subtotal, deliveryFee, total } = useCart();

  return (
    <div className="rounded-lg bg-secondary p-6">
      <h2 className="text-lg font-medium mb-4">Order Summary</h2>
      
      <div className="space-y-2 border-b border-gray-200 pb-4">
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Delivery Fee</span>
          <span>${deliveryFee.toFixed(2)}</span>
        </div>
      </div>
      
      <div className="flex justify-between font-medium text-lg pt-3">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>
      
      {showActions && (
        <p className="text-xs text-muted-foreground mt-3">
          Taxes included if applicable. Delivery time is estimated and may vary depending on your location.
        </p>
      )}
    </div>
  );
};

export default OrderSummary;
