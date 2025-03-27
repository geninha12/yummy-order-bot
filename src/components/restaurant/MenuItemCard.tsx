
import React from 'react';
import { Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MenuItem } from '@/context/MenuContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface MenuItemCardProps {
  item: MenuItem;
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
  onToggleAvailability: (id: string, available: boolean) => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  onEdit,
  onDelete,
  onToggleAvailability
}) => {
  return (
    <Card className={`overflow-hidden transition-all duration-200 ${!item.available && 'opacity-60'}`}>
      <div className="relative h-48 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-2 right-2 flex gap-1">
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 bg-white/70 backdrop-blur-sm hover:bg-white"
            onClick={() => onEdit(item)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 bg-white/70 backdrop-blur-sm hover:bg-white text-red-500 hover:text-red-700"
            onClick={() => onDelete(item.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{item.name}</CardTitle>
            <CardDescription className="mt-1">{item.category}</CardDescription>
          </div>
          <div className="text-lg font-bold">R${item.price.toFixed(2)}</div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
        
        {item.ingredients.length > 0 && (
          <div className="mt-3">
            <h4 className="text-xs font-medium uppercase text-muted-foreground mb-2">
              Adicionais Disponíveis
            </h4>
            <div className="text-sm">
              {item.ingredients.slice(0, 3).map((ing, index) => (
                <span key={ing.id} className="text-xs">
                  {ing.name}
                  {index < Math.min(item.ingredients.length, 3) - 1 && ', '}
                </span>
              ))}
              {item.ingredients.length > 3 && (
                <span className="text-xs text-muted-foreground"> +{item.ingredients.length - 3} mais</span>
              )}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Button
          variant="ghost"
          size="sm"
          className={`flex items-center gap-1 ${
            item.available ? 'text-green-600 hover:text-green-700' : 'text-red-500 hover:text-red-600'
          }`}
          onClick={() => onToggleAvailability(item.id, !item.available)}
        >
          {item.available ? (
            <>
              <ToggleRight className="h-4 w-4" />
              <span>Disponível</span>
            </>
          ) : (
            <>
              <ToggleLeft className="h-4 w-4" />
              <span>Indisponível</span>
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MenuItemCard;
