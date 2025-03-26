
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Menu as MenuIcon, 
  ShoppingBag, 
  BarChart3, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

interface RestaurantLayoutProps {
  children: React.ReactNode;
}

const RestaurantLayout: React.FC<RestaurantLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const sidebarLinks = [
    { name: 'Dashboard', path: '/restaurant/dashboard', icon: LayoutDashboard },
    { name: 'Menu Management', path: '/restaurant/menu', icon: MenuIcon },
    { name: 'Orders', path: '/restaurant/orders', icon: ShoppingBag },
    { name: 'Analytics', path: '/restaurant/analytics', icon: BarChart3 },
    { name: 'Settings', path: '/restaurant/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <div className="p-4 flex items-center justify-between border-b border-gray-200">
          {!collapsed && (
            <Link to="/restaurant/dashboard" className="text-xl font-bold text-primary">
              YummyOrder
            </Link>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto"
          >
            {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </Button>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {sidebarLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-md transition-colors",
                    isActive(link.path) 
                      ? "bg-primary text-primary-foreground" 
                      : "text-foreground hover:bg-secondary"
                  )}
                >
                  <link.icon className={cn("h-5 w-5", collapsed ? "mx-auto" : "mr-3")} />
                  {!collapsed && <span>{link.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <Button 
            variant="ghost" 
            className={cn(
              "w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700",
              collapsed && "justify-center"
            )} 
            onClick={handleLogout}
          >
            <LogOut className={cn("h-5 w-5", collapsed ? "mx-auto" : "mr-2")} />
            {!collapsed && <span>Log out</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 py-4 px-6">
          <h1 className="text-xl font-bold">{
            sidebarLinks.find(link => isActive(link.path))?.name || 'Dashboard'
          }</h1>
        </header>
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default RestaurantLayout;
