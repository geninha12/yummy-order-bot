
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Phone } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  RadioGroup,
  RadioGroupItem
} from "@/components/ui/radio-group";
import Layout from '@/components/layout/Layout';
import OrderSummary from '@/components/customer/OrderSummary';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useOrders } from '@/context/OrderContext';
import { toast } from "sonner";

interface CheckoutFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  paymentMethod: 'credit' | 'paypal' | 'cash';
  notes?: string;
}

const Checkout = () => {
  const { user } = useAuth();
  const { items, subtotal, deliveryFee, total, clearCart } = useCart();
  const { placeOrder, getOrderById } = useOrders();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      paymentMethod: 'credit',
    },
  });

  const paymentMethod = watch('paymentMethod');

  const onSubmit = (data: CheckoutFormData) => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      try {
        const orderId = placeOrder({
          userId: user?.id || 'guest',
          userName: data.name,
          userEmail: data.email,
          userPhone: data.phone,
          userAddress: data.address,
          items: [...items],
          subtotal,
          deliveryFee,
          total,
          paymentMethod: data.paymentMethod === 'credit' 
            ? 'Credit Card' 
            : data.paymentMethod === 'paypal'
            ? 'PayPal'
            : 'Cash on Delivery',
          notes: data.notes,
        });

        // Buscar o pedido completo para enviar para impressão
        const newOrder = getOrderById(orderId);
        
        if (newOrder) {
          // Disparar um evento para notificar sobre o novo pedido
          const newOrderEvent = new CustomEvent('new-order-received', { 
            detail: newOrder 
          });
          window.dispatchEvent(newOrderEvent);
        }

        clearCart();
        toast.success('Order placed successfully!');
        navigate(`/order-confirmation/${orderId}`);
      } catch (error) {
        toast.error('There was a problem placing your order');
        console.error(error);
      } finally {
        setIsProcessing(false);
      }
    }, 1500);
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4 animate-fade-in">
        <div className="flex items-center mb-6">
          <Link to="/cart" className="flex items-center text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span>Back to cart</span>
          </Link>
        </div>

        <h1 className="heading-lg mb-6">Checkout</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-lg font-medium mb-4">Delivery Information</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      {...register('name', { required: 'Name is required' })}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500">{errors.name.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register('email', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address',
                        },
                      })}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      {...register('phone', { required: 'Phone number is required' })}
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-500">{errors.phone.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="address">Delivery Address</Label>
                    <Textarea
                      id="address"
                      {...register('address', { required: 'Address is required' })}
                    />
                    {errors.address && (
                      <p className="text-sm text-red-500">{errors.address.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="notes">Order Notes (optional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Special instructions for delivery"
                      {...register('notes')}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-lg font-medium mb-4">Payment Method</h2>
                
                <RadioGroup
                  defaultValue="credit"
                  onValueChange={(value) => setValue('paymentMethod', value as any)}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-muted">
                    <RadioGroupItem value="credit" id="credit" />
                    <Label htmlFor="credit" className="cursor-pointer flex-1">
                      <div className="flex items-center">
                        <CreditCard className="h-5 w-5 mr-2" />
                        <span>Credit Card</span>
                      </div>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-muted">
                    <RadioGroupItem value="paypal" id="paypal" />
                    <Label htmlFor="paypal" className="cursor-pointer flex-1">
                      <div className="flex items-center">
                        <img 
                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/124px-PayPal.svg.png"
                          alt="PayPal"
                          className="h-5 mr-2"
                        />
                        <span>PayPal</span>
                      </div>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-muted">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash" className="cursor-pointer flex-1">
                      <div className="flex items-center">
                        <Phone className="h-5 w-5 mr-2" />
                        <span>Cash on Delivery</span>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>

                {paymentMethod === 'credit' && (
                  <div className="mt-4 p-4 bg-muted rounded">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          placeholder="0000 0000 0000 0000"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="cardName">Name on Card</Label>
                        <Input
                          id="cardName"
                          placeholder="John Doe"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input
                          id="expiry"
                          placeholder="MM/YY"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                        />
                      </div>
                    </div>
                    <p className="mt-4 text-xs text-muted-foreground">
                      This is a demo application. No actual payment will be processed.
                    </p>
                  </div>
                )}
              </div>

              <div className="md:hidden mb-6">
                <OrderSummary showActions={false} />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : `Complete Order - $${total.toFixed(2)}`}
              </Button>
            </form>
          </div>

          <div className="hidden md:block">
            <div className="sticky top-20">
              <h2 className="text-lg font-medium mb-4">Order Summary</h2>
              <OrderSummary showActions={false} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
