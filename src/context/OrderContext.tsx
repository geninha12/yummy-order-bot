
import React, { createContext, useState, useContext } from 'react';
import { toast } from "sonner";
import { CartItem } from './CartContext';

export type OrderStatus = 'placed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

export type Order = {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone?: string;
  userAddress?: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  placedAt: string;
  estimatedDelivery?: string;
  paymentMethod: string;
  notes?: string;
};

type OrderStats = {
  total: number;
  today: number;
  week: number;
  month: number;
};

type OrderContextType = {
  orders: Order[];
  placeOrder: (order: Omit<Order, 'id' | 'placedAt' | 'status'>) => string;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  getOrderById: (id: string) => Order | undefined;
  getOrdersByUser: (userId: string) => Order[];
  getOrdersByStatus: (status: OrderStatus) => Order[];
  orderStats: OrderStats;
  getOrdersByDateRange: (start: Date, end: Date) => Order[];
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

// Sample data
const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
const lastWeek = new Date(today);
lastWeek.setDate(lastWeek.getDate() - 7);

const sampleOrders: Order[] = [
  {
    id: 'order-1',
    userId: '2',
    userName: 'John Customer',
    userEmail: 'customer@example.com',
    userPhone: '555-123-4567',
    userAddress: '123 Main St, Anytown, USA',
    items: [
      {
        id: 'item-1',
        productId: '1',
        name: 'Classic Burger',
        price: 10.99,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
        selectedOptions: [
          { ingredientId: '101', name: 'Extra Cheese', price: 1.50 },
          { ingredientId: '102', name: 'Bacon', price: 2.00 }
        ]
      },
      {
        id: 'item-2',
        productId: '5',
        name: 'Coca-Cola',
        price: 2.99,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
        selectedOptions: []
      }
    ],
    subtotal: 31.96,
    deliveryFee: 4.99,
    total: 36.95,
    status: 'delivered',
    placedAt: today.toISOString(),
    estimatedDelivery: new Date(today.getTime() + 30 * 60000).toISOString(),
    paymentMethod: 'Credit Card',
    notes: 'Please ring the doorbell'
  },
  {
    id: 'order-2',
    userId: 'guest-123',
    userName: 'Guest User',
    userEmail: 'guest@example.com',
    userPhone: '555-987-6543',
    userAddress: '456 Elm St, Anytown, USA',
    items: [
      {
        id: 'item-3',
        productId: '3',
        name: 'Margherita Pizza',
        price: 12.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
        selectedOptions: [
          { ingredientId: '301', name: 'Extra Cheese', price: 2.00 }
        ]
      }
    ],
    subtotal: 14.99,
    deliveryFee: 4.99,
    total: 19.98,
    status: 'preparing',
    placedAt: yesterday.toISOString(),
    estimatedDelivery: new Date(yesterday.getTime() + 45 * 60000).toISOString(),
    paymentMethod: 'Cash on Delivery',
    notes: ''
  },
  {
    id: 'order-3',
    userId: '2',
    userName: 'John Customer',
    userEmail: 'customer@example.com',
    userPhone: '555-123-4567',
    userAddress: '123 Main St, Anytown, USA',
    items: [
      {
        id: 'item-4',
        productId: '4',
        name: 'Chicken Alfredo',
        price: 14.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
        selectedOptions: []
      },
      {
        id: 'item-5',
        productId: '6',
        name: 'Fresh Lemonade',
        price: 3.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
        selectedOptions: []
      }
    ],
    subtotal: 18.98,
    deliveryFee: 4.99,
    total: 23.97,
    status: 'placed',
    placedAt: new Date().toISOString(),
    paymentMethod: 'PayPal',
    notes: 'Extra napkins please'
  }
];

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(sampleOrders);

  const placeOrder = (orderData: Omit<Order, 'id' | 'placedAt' | 'status'>) => {
    const newOrder: Order = {
      ...orderData,
      id: `order-${Date.now()}`,
      placedAt: new Date().toISOString(),
      status: 'placed'
    };
    
    setOrders(prevOrders => [newOrder, ...prevOrders]);
    toast.success('Order placed successfully');
    return newOrder.id;
  };

  const updateOrderStatus = (id: string, status: OrderStatus) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === id ? { ...order, status } : order
      )
    );
    toast.success(`Order status updated to ${status}`);
  };

  const getOrderById = (id: string) => {
    return orders.find(order => order.id === id);
  };

  const getOrdersByUser = (userId: string) => {
    return orders.filter(order => order.userId === userId);
  };

  const getOrdersByStatus = (status: OrderStatus) => {
    return orders.filter(order => order.status === status);
  };

  const getOrdersByDateRange = (start: Date, end: Date) => {
    return orders.filter(order => {
      const orderDate = new Date(order.placedAt);
      return orderDate >= start && orderDate <= end;
    });
  };

  // Calculate order statistics
  const orderStats: OrderStats = {
    total: orders.reduce((sum, order) => sum + order.total, 0),
    today: orders
      .filter(order => {
        const orderDate = new Date(order.placedAt);
        return orderDate.toDateString() === today.toDateString();
      })
      .reduce((sum, order) => sum + order.total, 0),
    week: orders
      .filter(order => {
        const orderDate = new Date(order.placedAt);
        const diffTime = Math.abs(today.getTime() - orderDate.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7;
      })
      .reduce((sum, order) => sum + order.total, 0),
    month: orders
      .filter(order => {
        const orderDate = new Date(order.placedAt);
        return (
          orderDate.getMonth() === today.getMonth() &&
          orderDate.getFullYear() === today.getFullYear()
        );
      })
      .reduce((sum, order) => sum + order.total, 0),
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        placeOrder,
        updateOrderStatus,
        getOrderById,
        getOrdersByUser,
        getOrdersByStatus,
        orderStats,
        getOrdersByDateRange
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
