
import React from 'react';
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  change?: {
    value: number;
    trend: 'up' | 'down' | 'neutral';
  };
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  change
}) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p className="text-xs flex items-center mt-1">
            {change.trend === 'up' && (
              <ArrowUpIcon className="h-3 w-3 text-green-600 mr-1" />
            )}
            {change.trend === 'down' && (
              <ArrowDownIcon className="h-3 w-3 text-red-600 mr-1" />
            )}
            <span 
              className={
                change.trend === 'up' 
                  ? 'text-green-600' 
                  : change.trend === 'down' 
                  ? 'text-red-600' 
                  : 'text-muted-foreground'
              }
            >
              {change.value}% from last period
            </span>
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;
