
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/context/AuthContext';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  address?: string;
  phone?: string;
  acceptTerms: boolean;
}

const Register = () => {
  const { register: registerUser, loading } = useAuth();
  const [isRestaurant, setIsRestaurant] = useState(false);
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>();
  
  const password = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data.name, data.email, data.password, isRestaurant);
      navigate(isRestaurant ? '/restaurant/dashboard' : '/menu');
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="heading-lg mb-2">Create an account</h1>
            <p className="text-muted-foreground">
              Sign up to start ordering delicious food
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
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder={isRestaurant ? "Restaurant name" : "Your name"}
                  {...register('name', {
                    required: 'Name is required',
                  })}
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
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: value =>
                      value === password || 'Passwords do not match',
                  })}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                )}
              </div>

              {!isRestaurant && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address (optional)</Label>
                    <Input
                      id="address"
                      placeholder="Delivery address"
                      {...register('address')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone (optional)</Label>
                    <Input
                      id="phone"
                      placeholder="Phone number"
                      {...register('phone')}
                    />
                  </div>
                </>
              )}

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="acceptTerms"
                  {...register('acceptTerms', {
                    required: 'You must accept the terms and conditions',
                  })}
                />
                <Label htmlFor="acceptTerms" className="text-sm">
                  I agree to the{' '}
                  <a href="#" className="text-primary hover:underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-primary hover:underline">
                    Privacy Policy
                  </a>
                </Label>
              </div>
              {errors.acceptTerms && (
                <p className="text-sm text-red-500">{errors.acceptTerms.message}</p>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Already have an account?</span>{' '}
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
