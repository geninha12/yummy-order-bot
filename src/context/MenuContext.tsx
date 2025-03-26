
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from "sonner";

export type Ingredient = {
  id: string;
  name: string;
  price: number;
  available: boolean;
};

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  ingredients: Ingredient[];
  available: boolean;
};

type MenuContextType = {
  menuItems: MenuItem[];
  categories: string[];
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => void;
  removeMenuItem: (id: string) => void;
  getMenuItemById: (id: string) => MenuItem | undefined;
  getMenuItemsByCategory: (category: string) => MenuItem[];
};

const MenuContext = createContext<MenuContextType | undefined>(undefined);

// Sample data
const sampleMenuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Classic Burger',
    description: 'Juicy beef patty with lettuce, tomato, and special sauce on a brioche bun.',
    price: 10.99,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
    category: 'Burgers',
    ingredients: [
      { id: '101', name: 'Extra Cheese', price: 1.50, available: true },
      { id: '102', name: 'Bacon', price: 2.00, available: true },
      { id: '103', name: 'Avocado', price: 1.75, available: true },
      { id: '104', name: 'Jalapeños', price: 0.75, available: true },
    ],
    available: true
  },
  {
    id: '2',
    name: 'Veggie Bowl',
    description: 'Fresh mixed vegetables with quinoa and homemade dressing.',
    price: 9.99,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
    category: 'Healthy',
    ingredients: [
      { id: '201', name: 'Grilled Chicken', price: 3.00, available: true },
      { id: '202', name: 'Tofu', price: 2.50, available: true },
      { id: '203', name: 'Extra Avocado', price: 1.75, available: true },
    ],
    available: true
  },
  {
    id: '3',
    name: 'Margherita Pizza',
    description: 'Traditional pizza with tomato sauce, mozzarella cheese, and basil.',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
    category: 'Pizza',
    ingredients: [
      { id: '301', name: 'Extra Cheese', price: 2.00, available: true },
      { id: '302', name: 'Pepperoni', price: 2.50, available: true },
      { id: '303', name: 'Mushrooms', price: 1.50, available: true },
      { id: '304', name: 'Olives', price: 1.00, available: true },
    ],
    available: true
  },
  {
    id: '4',
    name: 'Chicken Alfredo',
    description: 'Creamy alfredo sauce with grilled chicken over fettuccine pasta.',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
    category: 'Pasta',
    ingredients: [
      { id: '401', name: 'Extra Sauce', price: 1.00, available: true },
      { id: '402', name: 'Broccoli', price: 1.50, available: true },
      { id: '403', name: 'Parmesan Cheese', price: 1.00, available: true },
    ],
    available: true
  },
  {
    id: '5',
    name: 'Coca-Cola',
    description: 'Classic refreshing cola drink.',
    price: 2.99,
    image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
    category: 'Drinks',
    ingredients: [],
    available: true
  },
  {
    id: '6',
    name: 'Fresh Lemonade',
    description: 'Homemade lemonade with real lemons and a hint of mint.',
    price: 3.99,
    image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
    category: 'Drinks',
    ingredients: [],
    available: true
  }
];

export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(sampleMenuItems);

  const addMenuItem = (item: Omit<MenuItem, 'id'>) => {
    const newItem = {
      ...item,
      id: `item-${Date.now()}`,
    };
    
    setMenuItems(prevItems => [...prevItems, newItem]);
    toast.success(`${item.name} added to menu`);
  };

  const updateMenuItem = (id: string, updates: Partial<MenuItem>) => {
    setMenuItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, ...updates } : item
      )
    );
    toast.success(`Menu item updated`);
  };

  const removeMenuItem = (id: string) => {
    const itemToRemove = menuItems.find(item => item.id === id);
    setMenuItems(prevItems => prevItems.filter(item => item.id !== id));
    
    if (itemToRemove) {
      toast.success(`${itemToRemove.name} removed from menu`);
    }
  };

  const getMenuItemById = (id: string) => {
    return menuItems.find(item => item.id === id);
  };

  const getMenuItemsByCategory = (category: string) => {
    return menuItems.filter(item => item.category === category);
  };

  // Extract unique categories
  const categories = Array.from(new Set(menuItems.map(item => item.category)));

  return (
    <MenuContext.Provider
      value={{
        menuItems,
        categories,
        addMenuItem,
        updateMenuItem,
        removeMenuItem,
        getMenuItemById,
        getMenuItemsByCategory,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
};
