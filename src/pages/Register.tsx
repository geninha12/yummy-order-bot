
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
      navigate(isRestaurant ? '/restaurante/painel' : '/cardapio');
    } catch (error) {
      console.error('Erro no cadastro:', error);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="heading-lg mb-2">Criar uma conta</h1>
            <p className="text-muted-foreground">
              Cadastre-se para começar a pedir comidas deliciosas
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
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  placeholder={isRestaurant ? "Nome do restaurante" : "Seu nome"}
                  {...register('name', {
                    required: 'Nome é obrigatório',
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
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Crie uma senha"
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirme sua senha"
                  {...register('confirmPassword', {
                    required: 'Por favor confirme sua senha',
                    validate: value =>
                      value === password || 'As senhas não coincidem',
                  })}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                )}
              </div>

              {!isRestaurant && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="address">Endereço (opcional)</Label>
                    <Input
                      id="address"
                      placeholder="Endereço de entrega"
                      {...register('address')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone (opcional)</Label>
                    <Input
                      id="phone"
                      placeholder="Número de telefone"
                      {...register('phone')}
                    />
                  </div>
                </>
              )}

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="acceptTerms"
                  {...register('acceptTerms', {
                    required: 'Você deve aceitar os termos e condições',
                  })}
                />
                <Label htmlFor="acceptTerms" className="text-sm">
                  Eu concordo com os{' '}
                  <a href="#" className="text-primary hover:underline">
                    Termos de Serviço
                  </a>{' '}
                  e{' '}
                  <a href="#" className="text-primary hover:underline">
                    Política de Privacidade
                  </a>
                </Label>
              </div>
              {errors.acceptTerms && (
                <p className="text-sm text-red-500">{errors.acceptTerms.message}</p>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Criando Conta...' : 'Criar Conta'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Já tem uma conta?</span>{' '}
              <Link to="/entrar" className="text-primary hover:underline">
                Entrar
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
