
import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import RestaurantLayout from '@/components/layout/RestaurantLayout';
import MenuItemCard from '@/components/restaurant/MenuItemCard';
import MenuItemForm from '@/components/restaurant/MenuItemForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MenuItem, useMenu } from '@/context/MenuContext';
import { toast } from "sonner";

const MenuManagement = () => {
  const { menuItems, categories, addMenuItem, updateMenuItem, removeMenuItem } = useMenu();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | 'all'>('all');

  const handleAddNewItem = () => {
    setEditingItem(null);
    setIsDialogOpen(true);
  };

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const handleDeleteItem = (id: string) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      removeMenuItem(id);
    }
  };

  const handleToggleAvailability = (id: string, available: boolean) => {
    updateMenuItem(id, { available });
  };

  const handleSaveItem = (itemData: Omit<MenuItem, 'id'>) => {
    if (editingItem) {
      updateMenuItem(editingItem.id, itemData);
      toast.success('Menu item updated successfully');
    } else {
      addMenuItem(itemData);
      toast.success('New menu item added successfully');
    }
    setIsDialogOpen(false);
  };

  const filteredItems = menuItems
    .filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(item => 
      categoryFilter === 'all' || item.category === categoryFilter
    );

  return (
    <RestaurantLayout>
      <div className="animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Menu Management</h1>
          <Button onClick={handleAddNewItem}>
            <Plus className="h-4 w-4 mr-2" /> Add New Item
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={categoryFilter}
            onValueChange={(value) => setCategoryFilter(value)}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              onEdit={handleEditItem}
              onDelete={handleDeleteItem}
              onToggleAvailability={handleToggleAvailability}
            />
          ))}
          {filteredItems.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No menu items found. Add your first item or adjust your search.</p>
            </div>
          )}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
            </DialogTitle>
          </DialogHeader>
          <MenuItemForm
            initialData={editingItem || undefined}
            onSubmit={handleSaveItem}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </RestaurantLayout>
  );
};

export default MenuManagement;
