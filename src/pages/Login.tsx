
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
        navigate('/restaurante/painel');
      } else {
        navigate('/cardapio');
      }
    } catch (error) {
      toast.error('Email ou senha inválidos. Tente restaurant@example.com / password ou customer@example.com / password');
    }
  };

  const handleGuestLogin = () => {
    loginAsGuest();
    navigate('/cardapio');
  };

  return (
    <Layout>
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="heading-lg mb-2">Bem-vindo de volta</h1>
            <p className="text-muted-foreground">
              Entre na sua conta para continuar
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
                Cliente
              </button>
              <button
                className={`flex-1 py-2 text-center border-b-2 transition-colors ${
                  isRestaurant ? 'border-primary text-primary font-medium' : 'border-transparent'
                }`}
                onClick={() => setIsRestaurant(true)}
              >
                Restaurante
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Digite seu email"
                  {...register('email', {
                    required: 'Email é obrigatório',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Endereço de email inválido',
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Senha</Label>
                  <Link
                    to="/esqueci-senha"
                    className="text-xs text-primary hover:underline"
                  >
                    Esqueceu a senha?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite sua senha"
                  {...register('password', {
                    required: 'Senha é obrigatória',
                    minLength: {
                      value: 6,
                      message: 'Senha deve ter pelo menos 6 caracteres',
                    },
                  })}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Entrando...' : 'Entrar'}
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
                  Continuar como Visitante
                </Button>
              </div>
            )}

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Não tem uma conta?</span>{' '}
              <Link to="/cadastro" className="text-primary hover:underline">
                Cadastre-se
              </Link>
            </div>
          </div>

          <div className="mt-4 text-center text-xs text-muted-foreground">
            <p>Credenciais para demonstração:</p>
            <p>Restaurante: restaurant@example.com / password</p>
            <p>Cliente: customer@example.com / password</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
