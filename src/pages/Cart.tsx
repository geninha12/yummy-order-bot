
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';
import CartItem from '@/components/customer/CartItem';
import OrderSummary from '@/components/customer/OrderSummary';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

const Cart = () => {
  const { items, clearCart, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const handleCheckout = () => {
    if (items.length === 0) return;
    navigate('/checkout');
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4 animate-fade-in">
        <div className="flex items-center mb-6">
          <Link to="/menu" className="flex items-center text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span>Back to menu</span>
          </Link>
        </div>

        <h1 className="heading-lg mb-6">Your Cart</h1>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Cart Items ({items.length})</h2>
                <Button variant="ghost" size="sm" onClick={clearCart}>
                  Clear Cart
                </Button>
              </div>

              <div className="divide-y divide-gray-200">
                {items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            </div>

            <div className="md:col-span-1">
              <OrderSummary />
              
              <Button
                className="w-full mt-4"
                size="lg"
                disabled={items.length === 0}
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </Button>
              
              <div className="mt-4 text-center">
                <Link to="/menu" className="text-primary hover:underline text-sm">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 max-w-md mx-auto">
            <div className="bg-muted inline-flex rounded-full p-4 mb-4">
              <ShoppingCart className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="heading-md mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link to="/menu">
              <Button size="lg">Browse Menu</Button>
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Cart;
