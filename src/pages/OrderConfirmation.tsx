
import React, { useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';
import OrderTracker from '@/components/customer/OrderTracker';
import { useOrders } from '@/context/OrderContext';

const OrderConfirmation = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { getOrderById } = useOrders();
  const navigate = useNavigate();

  const order = getOrderById(orderId || '');

  // If no order found, redirect to home
  useEffect(() => {
    if (!order) {
      navigate('/');
    }
  }, [order, navigate]);

  if (!order) {
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4 animate-fade-in">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="bg-green-100 text-green-600 rounded-full p-3 inline-flex mb-4">
              <Check className="h-6 w-6" />
            </div>
            <h1 className="heading-lg mb-2">Order Confirmed!</h1>
            <p className="text-muted-foreground">
              Your order has been successfully placed and will be delivered soon.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
            <div className="p-6 border-b">
              <div className="flex flex-col md:flex-row justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Order ID</p>
                  <p className="font-medium">#{order.id.slice(-6)}</p>
                </div>
                <div className="mt-4 md:mt-0">
                  <p className="text-sm text-muted-foreground">Order Date</p>
                  <p className="font-medium">
                    {new Date(order.placedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="mt-4 md:mt-0">
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="font-medium">${order.total.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <h2 className="text-lg font-medium mb-4">Order Details</h2>
              
              <div className="space-y-3 mb-6">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <div className="flex">
                      <span className="text-muted-foreground mr-2">{item.quantity}x</span>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        {item.selectedOptions.length > 0 && (
                          <p className="text-xs text-muted-foreground">
                            {item.selectedOptions.map(opt => opt.name).join(', ')}
                          </p>
                        )}
                      </div>
                    </div>
                    <p className="font-medium">
                      ${((item.price + item.selectedOptions.reduce((sum, opt) => sum + opt.price, 0)) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span>Delivery Fee</span>
                  <span>${order.deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium text-lg mt-2">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
            <div className="p-6">
              <OrderTracker order={order} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
            <div className="p-6">
              <h2 className="text-lg font-medium mb-4">Delivery Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Full Name</p>
                  <p className="font-medium">{order.userName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{order.userEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{order.userPhone || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium">{order.userAddress || 'Not provided'}</p>
                </div>
                {order.notes && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-muted-foreground">Order Notes</p>
                    <p className="font-medium">{order.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link to="/menu">
              <Button className="mr-4">
                Order More Food
              </Button>
            </Link>
            <Link to={`/orders/${order.id}`}>
              <Button variant="outline">
                Track Order <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderConfirmation;
