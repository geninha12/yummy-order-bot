
import React, { useState } from 'react';
import { CalendarIcon } from 'lucide-react';
import RestaurantLayout from '@/components/layout/RestaurantLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';
import { useOrders, Order } from '@/context/OrderContext';

const Analytics = () => {
  const { orders, getOrdersByDateRange } = useOrders();
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  const getFilteredOrders = (): Order[] => {
    if (selectedPeriod === 'custom' && dateRange.from && dateRange.to) {
      return getOrdersByDateRange(dateRange.from, dateRange.to);
    }

    const today = new Date();
    const periodMap: { [key: string]: number } = {
      day: 1,
      week: 7,
      month: 30,
      year: 365,
    };

    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - (periodMap[selectedPeriod] || 7));

    return getOrdersByDateRange(startDate, today);
  };

  const filteredOrders = getFilteredOrders();

  // Generate sales data
  const generateSalesData = () => {
    if (selectedPeriod === 'day') {
      // Hourly data for today
      const data = Array(24)
        .fill(0)
        .map((_, i) => ({ name: `${i}:00`, sales: 0 }));
      
      filteredOrders.forEach(order => {
        const date = new Date(order.placedAt);
        const hour = date.getHours();
        data[hour].sales += order.total;
      });
      
      return data;
    } else if (selectedPeriod === 'week') {
      // Daily data for this week
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const data = days.map(day => ({ name: day, sales: 0 }));
      
      filteredOrders.forEach(order => {
        const date = new Date(order.placedAt);
        const day = date.getDay();
        data[day].sales += order.total;
      });
      
      return data;
    } else if (selectedPeriod === 'month') {
      // Group by day of month
      const today = new Date();
      const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
      
      const data = Array(daysInMonth)
        .fill(0)
        .map((_, i) => ({ name: `${i + 1}`, sales: 0 }));
      
      filteredOrders.forEach(order => {
        const date = new Date(order.placedAt);
        const day = date.getDate();
        data[day - 1].sales += order.total;
      });
      
      return data;
    } else if (selectedPeriod === 'year') {
      // Monthly data for this year
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const data = months.map(month => ({ name: month, sales: 0 }));
      
      filteredOrders.forEach(order => {
        const date = new Date(order.placedAt);
        const month = date.getMonth();
        data[month].sales += order.total;
      });
      
      return data;
    } else if (selectedPeriod === 'custom') {
      // Group by day for custom range
      if (!dateRange.from || !dateRange.to) return [];
      
      const days: { [key: string]: { name: string; sales: number } } = {};
      
      filteredOrders.forEach(order => {
        const date = new Date(order.placedAt);
        const dayStr = format(date, 'yyyy-MM-dd');
        const displayDate = format(date, 'MMM d');
        
        if (!days[dayStr]) {
          days[dayStr] = { name: displayDate, sales: 0 };
        }
        
        days[dayStr].sales += order.total;
      });
      
      return Object.values(days);
    }
    
    return [];
  };

  // Generate category data for pie chart
  const generateCategoryData = () => {
    const categories: { [key: string]: number } = {};
    
    filteredOrders.forEach(order => {
      order.items.forEach(item => {
        const categoryMap: { [key: string]: string } = {
          'Burgers': 'Burgers',
          'Pizza': 'Pizza',
          'Healthy': 'Healthy',
          'Pasta': 'Pasta',
          'Drinks': 'Drinks',
        };
        
        const category = categoryMap[item.name.includes('Burger') ? 'Burgers' : 
                            item.name.includes('Pizza') ? 'Pizza' : 
                            item.name.includes('Veggie') ? 'Healthy' : 
                            item.name.includes('Alfredo') ? 'Pasta' : 'Drinks'];
        
        if (!categories[category]) {
          categories[category] = 0;
        }
        
        categories[category] += item.price * item.quantity;
      });
    });
    
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  };

  // Calculate overview stats
  const calculateStats = () => {
    const totalSales = filteredOrders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = filteredOrders.length;
    const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
    
    return {
      totalSales,
      totalOrders,
      averageOrderValue,
    };
  };

  const salesData = generateSalesData();
  const categoryData = generateCategoryData();
  const stats = calculateStats();

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <RestaurantLayout>
      <div className="animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Analytics</h1>
          
          {selectedPeriod === 'custom' && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start text-left">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          )}
        </div>

        <Tabs defaultValue="week" onValueChange={setSelectedPeriod} className="mb-6">
          <TabsList>
            <TabsTrigger value="day">Today</TabsTrigger>
            <TabsTrigger value="week">This Week</TabsTrigger>
            <TabsTrigger value="month">This Month</TabsTrigger>
            <TabsTrigger value="year">This Year</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalSales.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {selectedPeriod === 'day' ? 'Today' :
                 selectedPeriod === 'week' ? 'This week' :
                 selectedPeriod === 'month' ? 'This month' :
                 selectedPeriod === 'year' ? 'This year' :
                 'Selected period'}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {selectedPeriod === 'day' ? 'Today' :
                 selectedPeriod === 'week' ? 'This week' :
                 selectedPeriod === 'month' ? 'This month' :
                 selectedPeriod === 'year' ? 'This year' :
                 'Selected period'}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.averageOrderValue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {selectedPeriod === 'day' ? 'Today' :
                 selectedPeriod === 'week' ? 'This week' :
                 selectedPeriod === 'month' ? 'This month' :
                 selectedPeriod === 'year' ? 'This year' :
                 'Selected period'}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle>Sales Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={salesData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Sales']} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="sales"
                      name="Sales"
                      stroke="hsl(var(--primary))"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sales by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Sales']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </RestaurantLayout>
  );
};

export default Analytics;
