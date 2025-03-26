
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Menu, ShoppingCart, User, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navigationLinks = user?.isRestaurant
    ? [
        { name: 'Painel', path: '/restaurante/painel' },
        { name: 'Cardápio', path: '/restaurante/cardapio' },
        { name: 'Pedidos', path: '/restaurante/pedidos' },
        { name: 'Relatórios', path: '/restaurante/relatorios' },
      ]
    : [
        { name: 'Início', path: '/' },
        { name: 'Cardápio', path: '/cardapio' },
        { name: 'Sobre', path: '/sobre' },
        { name: 'Contato', path: '/contato' },
      ];

  const accountLinks = user
    ? [
        { name: 'Perfil', path: user.isRestaurant ? '/restaurante/perfil' : '/perfil' },
        { name: 'Pedidos', path: '/pedidos' },
      ]
    : [
        { name: 'Entrar', path: '/entrar' },
        { name: 'Cadastro', path: '/cadastro' },
      ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <h1 className="text-xl font-bold text-primary">YummyOrder</h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navigationLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors duration-200 hover:text-primary ${
                isActive(link.path) ? 'text-primary' : 'text-foreground'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <>
              <div className="text-sm font-medium">Olá, {user.name}</div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/entrar">
                <Button variant="ghost" size="sm">
                  Entrar
                </Button>
              </Link>
              <Link to="/cadastro">
                <Button size="sm">Cadastrar</Button>
              </Link>
            </div>
          )}

          {!user?.isRestaurant && (
            <Link to="/carrinho" className="relative">
              <Button variant="outline" size="icon">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-4">
          {!user?.isRestaurant && (
            <Link to="/carrinho" className="relative">
              <Button variant="outline" size="icon">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>
          )}
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>YummyOrder</SheetTitle>
              </SheetHeader>
              <div className="py-4">
                <nav className="flex flex-col space-y-4">
                  {navigationLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`text-base py-2 px-4 rounded-md transition-colors duration-200 ${
                        isActive(link.path)
                          ? 'bg-secondary text-primary font-medium'
                          : 'text-foreground hover:bg-secondary'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  ))}
                  <div className="border-t border-gray-200 my-2 pt-2">
                    {user ? (
                      <>
                        <div className="px-4 py-2 text-sm font-medium">
                          Conectado como {user.name}
                        </div>
                        {accountLinks.map((link) => (
                          <Link
                            key={link.path}
                            to={link.path}
                            className="block py-2 px-4 text-base rounded-md hover:bg-secondary"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {link.name}
                          </Link>
                        ))}
                        <button
                          className="w-full text-left py-2 px-4 text-base rounded-md text-red-600 hover:bg-red-50 mt-2 flex items-center"
                          onClick={() => {
                            handleLogout();
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          <LogOut className="h-4 w-4 mr-2" /> Sair
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/entrar"
                          className="block py-2 px-4 text-base rounded-md hover:bg-secondary"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <User className="h-4 w-4 mr-2 inline-block" /> Entrar
                        </Link>
                        <Link
                          to="/cadastro"
                          className="block py-2 px-4 text-base rounded-md font-medium text-primary"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Cadastrar
                        </Link>
                      </>
                    )}
                  </div>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
