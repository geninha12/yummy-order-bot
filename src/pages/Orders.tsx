
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';
import { useOrders } from '@/context/OrderContext';
import { useAuth } from '@/context/AuthContext';

const Orders = () => {
  const { user } = useAuth();
  const { getOrdersByUser } = useOrders();
  
  const userOrders = user ? getOrdersByUser(user.id) : [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'placed':
        return 'bg-blue-100 text-blue-800';
      case 'preparing':
        return 'bg-yellow-100 text-yellow-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'delivered':
        return 'bg-purple-100 text-purple-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4 animate-fade-in">
        <h1 className="heading-lg mb-6">Your Orders</h1>

        {userOrders.length > 0 ? (
          <div className="grid gap-6">
            {userOrders.map((order) => (
              <Link 
                key={order.id} 
                to={`/orders/${order.id}`}
                className="block bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <div className="mb-2 md:mb-0">
                      <div className="text-sm text-muted-foreground">Order ID</div>
                      <div className="font-medium">#{order.id.slice(-6)}</div>
                    </div>
                    
                    <div className="mb-2 md:mb-0">
                      <div className="text-sm text-muted-foreground">Date</div>
                      <div className="font-medium">{formatDate(order.placedAt)}</div>
                    </div>
                    
                    <div className="mb-2 md:mb-0">
                      <div className="text-sm text-muted-foreground">Total</div>
                      <div className="font-medium">${order.total.toFixed(2)}</div>
                    </div>
                    
                    <div className="mb-2 md:mb-0">
                      <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </div>
                    </div>
                    
                    <div className="md:ml-4">
                      <Button variant="ghost" size="sm">
                        View Details <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="text-sm text-muted-foreground mb-2">Items</div>
                    <div className="text-sm">
                      {order.items.map((item, index) => (
                        <span key={item.id}>
                          {item.quantity}x {item.name}
                          {index < order.items.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 max-w-md mx-auto">
            <div className="bg-muted inline-flex rounded-full p-4 mb-4">
              <ShoppingBag className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="heading-md mb-2">No orders yet</h2>
            <p className="text-muted-foreground mb-6">
              You haven't placed any orders yet. Start ordering delicious food now!
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

export default Orders;
