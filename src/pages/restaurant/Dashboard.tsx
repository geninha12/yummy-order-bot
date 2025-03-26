
import React from 'react';
import { 
  BarChart3, 
  DollarSign, 
  ShoppingBag, 
  TrendingUp, 
  Users, 
  Clock,
  ArrowUpRight
} from 'lucide-react';
import RestaurantLayout from '@/components/layout/RestaurantLayout';
import StatsCard from '@/components/restaurant/StatsCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useOrders } from '@/context/OrderContext';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const { orders, orderStats } = useOrders();
  
  // Get recent orders
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime())
    .slice(0, 5);
  
  // Get daily sales data for the chart
  const getDailySalesData = () => {
    const today = new Date();
    const data = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const dailyOrders = orders.filter(order => {
        const orderDate = new Date(order.placedAt);
        return orderDate.toDateString() === date.toDateString();
      });
      
      const dailyTotal = dailyOrders.reduce((sum, order) => sum + order.total, 0);
      
      data.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        sales: dailyTotal,
      });
    }
    
    return data;
  };
  
  const salesData = getDailySalesData();
  
  // Calculate stats
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(
    order => order.status === 'placed' || order.status === 'preparing'
  ).length;
  
  return (
    <RestaurantLayout>
      <div className="grid gap-6 animate-fade-in">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Revenue"
            value={`$${orderStats.total.toFixed(2)}`}
            icon={<DollarSign className="text-muted-foreground h-5 w-5" />}
            change={{ value: 12.5, trend: 'up' }}
          />
          <StatsCard
            title="Total Orders"
            value={totalOrders.toString()}
            icon={<ShoppingBag className="text-muted-foreground h-5 w-5" />}
            change={{ value: 8.2, trend: 'up' }}
          />
          <StatsCard
            title="Pending Orders"
            value={pendingOrders.toString()}
            icon={<Clock className="text-muted-foreground h-5 w-5" />}
          />
          <StatsCard
            title="Happy Customers"
            value="92%"
            icon={<Users className="text-muted-foreground h-5 w-5" />}
            change={{ value: 3.1, trend: 'up' }}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-base font-medium">Daily Sales</CardTitle>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <Link to="/restaurant/analytics">
                  View All <ArrowUpRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={salesData}
                    margin={{
                      top: 10,
                      right: 10,
                      left: 0,
                      bottom: 20,
                    }}
                  >
                    <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip
                      formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Sales']}
                    />
                    <Bar
                      dataKey="sales"
                      fill="hsl(var(--primary))"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-base font-medium">Recent Orders</CardTitle>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <Link to="/restaurant/orders">
                  View All <ArrowUpRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div>
                        <div className="font-medium">#{order.id.slice(-4)} - {order.userName}</div>
                        <div className="text-sm text-muted-foreground">
                          {order.items.length} items · ${order.total.toFixed(2)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div 
                          className={`
                            px-2 py-1 text-xs font-medium rounded-full
                            ${order.status === 'placed' ? 'bg-blue-100 text-blue-800' : ''}
                            ${order.status === 'preparing' ? 'bg-yellow-100 text-yellow-800' : ''}
                            ${order.status === 'ready' ? 'bg-green-100 text-green-800' : ''}
                            ${order.status === 'delivered' ? 'bg-purple-100 text-purple-800' : ''}
                            ${order.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                          `}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </div>
                        <Link to={`/restaurant/orders/${order.id}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <ArrowUpRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No recent orders found
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </RestaurantLayout>
  );
};

export default Dashboard;
