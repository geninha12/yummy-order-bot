
import React from 'react';
import { Order } from '@/context/OrderContext';
import { CheckIcon, Clock } from 'lucide-react';

interface OrderTrackerProps {
  order: Order;
}

const OrderTracker: React.FC<OrderTrackerProps> = ({ order }) => {
  const steps = [
    { id: 'placed', label: 'Order Placed' },
    { id: 'preparing', label: 'Preparing' },
    { id: 'ready', label: 'Ready for Delivery' },
    { id: 'delivered', label: 'Delivered' },
  ];
  
  // Define the current step index
  const currentStepIndex = steps.findIndex(step => step.id === order.status);
  const isCancelled = order.status === 'cancelled';

  return (
    <div className="py-4">
      <h2 className="text-lg font-medium mb-6">Order Status</h2>
      
      {isCancelled ? (
        <div className="p-4 bg-red-50 text-red-700 rounded-md">
          <p className="font-medium">Order Cancelled</p>
          <p className="text-sm mt-1">This order has been cancelled.</p>
        </div>
      ) : (
        <div className="relative">
          {/* Progress bar */}
          <div className="absolute top-5 left-5 right-5 h-0.5 bg-gray-200">
            <div
              className="absolute h-0.5 bg-primary transition-all duration-500"
              style={{
                width: `${
                  currentStepIndex === -1 ? 0 : (currentStepIndex / (steps.length - 1)) * 100
                }%`,
              }}
            />
          </div>
          
          {/* Steps */}
          <div className="relative flex justify-between">
            {steps.map((step, index) => {
              const isComplete = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;
              
              return (
                <div key={step.id} className="flex flex-col items-center">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      isComplete
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-400'
                    } ${isCurrent ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                  >
                    {isComplete ? (
                      <CheckIcon className="h-5 w-5" />
                    ) : (
                      <Clock className="h-5 w-5" />
                    )}
                  </div>
                  <div className="text-xs font-medium mt-2 text-center">{step.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      <div className="mt-8">
        <h3 className="text-sm font-medium">Order Details</h3>
        <div className="mt-2 text-sm">
          <div className="flex justify-between py-1">
            <span className="text-muted-foreground">Order ID</span>
            <span className="font-medium">#{order.id.slice(-6)}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-muted-foreground">Date</span>
            <span className="font-medium">
              {new Date(order.placedAt).toLocaleDateString()}
            </span>
          </div>
          {order.estimatedDelivery && (
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground">Est. Delivery</span>
              <span className="font-medium">
                {new Date(order.estimatedDelivery).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          )}
          <div className="flex justify-between py-1">
            <span className="text-muted-foreground">Payment</span>
            <span className="font-medium">{order.paymentMethod}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracker;
