
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MenuItem, Ingredient } from '@/context/MenuContext';

interface MenuItemFormProps {
  initialData?: Partial<MenuItem>;
  onSubmit: (data: Omit<MenuItem, 'id'>) => void;
  onCancel: () => void;
}

const MenuItemForm: React.FC<MenuItemFormProps> = ({
  initialData,
  onSubmit,
  onCancel
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      price: initialData?.price || 0,
      image: initialData?.image || '',
      category: initialData?.category || '',
    }
  });

  const [ingredients, setIngredients] = useState<Omit<Ingredient, 'id'>[]>(
    initialData?.ingredients?.map(ing => ({
      name: ing.name,
      price: ing.price,
      available: ing.available
    })) || []
  );

  const [newIngredient, setNewIngredient] = useState({
    name: '',
    price: 0,
    available: true
  });

  const addIngredient = () => {
    if (newIngredient.name.trim() === '') return;
    
    setIngredients([...ingredients, { ...newIngredient }]);
    setNewIngredient({
      name: '',
      price: 0,
      available: true
    });
  };

  const removeIngredient = (index: number) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients.splice(index, 1);
    setIngredients(updatedIngredients);
  };

  const handleFormSubmit = (data: any) => {
    onSubmit({
      ...data,
      price: parseFloat(data.price),
      ingredients: ingredients.map((ing, index) => ({
        ...ing,
        id: `ing-${Date.now()}-${index}`,
      })),
      available: true
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Item Name</Label>
            <Input
              id="name"
              {...register('name', { required: 'Item name is required' })}
              placeholder="e.g. Classic Burger"
              className="mt-1"
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="price">Price ($)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              {...register('price', { required: 'Price is required' })}
              placeholder="9.99"
              className="mt-1"
            />
            {errors.price && (
              <p className="text-sm text-red-500 mt-1">{errors.price.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              {...register('category', { required: 'Category is required' })}
              placeholder="e.g. Burgers, Pizza, Drinks"
              className="mt-1"
            />
            {errors.category && (
              <p className="text-sm text-red-500 mt-1">{errors.category.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="image">Image URL</Label>
            <Input
              id="image"
              {...register('image', { required: 'Image URL is required' })}
              placeholder="https://example.com/image.jpg"
              className="mt-1"
            />
            {errors.image && (
              <p className="text-sm text-red-500 mt-1">{errors.image.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description', { required: 'Description is required' })}
              placeholder="Describe your menu item..."
              className="mt-1 h-24"
            />
            {errors.description && (
              <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
            )}
          </div>

          <div>
            <Label>Additional Ingredients</Label>
            <div className="mt-2 space-y-3">
              <div className="flex gap-2">
                <Input
                  placeholder="Ingredient name"
                  value={newIngredient.name}
                  onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })}
                />
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Price"
                  value={newIngredient.price}
                  onChange={(e) => setNewIngredient({ ...newIngredient, price: parseFloat(e.target.value) || 0 })}
                  className="w-24"
                />
                <Button type="button" onClick={addIngredient} size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2 max-h-40 overflow-y-auto">
                {ingredients.map((ingredient, index) => (
                  <div key={index} className="flex items-center justify-between bg-secondary p-2 rounded">
                    <span>{ingredient.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">${ingredient.price.toFixed(2)}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeIngredient(index)}
                        className="h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData?.id ? 'Update Item' : 'Add Item'}
        </Button>
      </div>
    </form>
  );
};

export default MenuItemForm;
