
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Layout from '@/components/layout/Layout';
import { toast } from "sonner";
import { useAuth } from '@/context/AuthContext';

interface LoginFormData {
  email: string;
  password: string;
}

const Login = () => {
  const { login, loginAsGuest, loading } = useAuth();
  const [isRestaurant, setIsRestaurant] = useState(false);
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      
      // Navigate based on the user type
      // In a real app, this would happen after checking the user type from the response
      if (data.email === 'restaurant@example.com') {
        navigate('/restaurant/dashboard');
      } else {
        navigate('/menu');
      }
    } catch (error) {
      toast.error('Invalid email or password. Try restaurant@example.com / password or customer@example.com / password');
    }
  };

  const handleGuestLogin = () => {
    loginAsGuest();
    navigate('/menu');
  };

  return (
    <Layout>
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="heading-lg mb-2">Welcome back</h1>
            <p className="text-muted-foreground">
              Sign in to your account to continue
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
            <div className="flex mb-6">
              <button
                className={`flex-1 py-2 text-center border-b-2 transition-colors ${
                  !isRestaurant ? 'border-primary text-primary font-medium' : 'border-transparent'
                }`}
                onClick={() => setIsRestaurant(false)}
              >
                Customer
              </button>
              <button
                className={`flex-1 py-2 text-center border-b-2 transition-colors ${
                  isRestaurant ? 'border-primary text-primary font-medium' : 'border-transparent'
                }`}
                onClick={() => setIsRestaurant(true)}
              >
                Restaurant
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            {!isRestaurant && (
              <div className="mt-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleGuestLogin}
                  disabled={loading}
                >
                  Continue as Guest
                </Button>
              </div>
            )}

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Don't have an account?</span>{' '}
              <Link to="/register" className="text-primary hover:underline">
                Sign up
              </Link>
            </div>
          </div>

          <div className="mt-4 text-center text-xs text-muted-foreground">
            <p>Demo credentials:</p>
            <p>Restaurant: restaurant@example.com / password</p>
            <p>Customer: customer@example.com / password</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
