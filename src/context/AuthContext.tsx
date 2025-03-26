
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from "sonner";

type User = {
  id: string;
  name: string;
  email: string;
  address?: string;
  phone?: string;
  isRestaurant: boolean;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginAsGuest: () => void;
  register: (name: string, email: string, password: string, isRestaurant: boolean) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    
    try {
      // In a real app, this would be an API call
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // For demo, we're using hardcoded users
      if (email === 'restaurant@example.com' && password === 'password') {
        const userData = {
          id: '1',
          name: 'Restaurant Demo',
          email: 'restaurant@example.com',
          isRestaurant: true
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        toast.success('Logged in as restaurant');
      } else if (email === 'customer@example.com' && password === 'password') {
        const userData = {
          id: '2',
          name: 'John Customer',
          email: 'customer@example.com',
          address: '123 Main St',
          phone: '555-123-4567',
          isRestaurant: false
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        toast.success('Logged in as customer');
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      toast.error('Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginAsGuest = () => {
    const guestUser = {
      id: `guest-${Date.now()}`,
      name: 'Guest User',
      email: '',
      isRestaurant: false
    };
    setUser(guestUser);
    localStorage.setItem('user', JSON.stringify(guestUser));
    toast.success('Continuing as guest');
  };

  const register = async (name: string, email: string, password: string, isRestaurant: boolean) => {
    setLoading(true);
    
    try {
      // In a real app, this would be an API call
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const userData = {
        id: `user-${Date.now()}`,
        name,
        email,
        isRestaurant
      };
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      toast.success('Registration successful!');
    } catch (error) {
      toast.error('Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginAsGuest, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
