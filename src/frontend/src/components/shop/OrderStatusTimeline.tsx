import { Check } from 'lucide-react';
import { OrderStatus } from '../../backend';

interface OrderStatusTimelineProps {
  currentStatus: OrderStatus;
}

const statuses = [
  { key: 'processing', label: 'Processing' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'delivered', label: 'Delivered' },
];

export default function OrderStatusTimeline({ currentStatus }: OrderStatusTimelineProps) {
  const currentIndex = statuses.findIndex(s => s.key === currentStatus);

  return (
    <div className="flex items-center justify-between relative">
      <div className="absolute top-5 left-0 right-0 h-0.5 bg-border" />
      <div
        className="absolute top-5 left-0 h-0.5 bg-primary transition-all duration-500"
        style={{ width: `${(currentIndex / (statuses.length - 1)) * 100}%` }}
      />
      {statuses.map((status, index) => {
        const isComplete = index <= currentIndex;
        return (
          <div key={status.key} className="flex flex-col items-center gap-2 relative z-10">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                isComplete ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}
            >
              {isComplete && <Check className="w-5 h-5" />}
            </div>
            <span className={`text-xs font-medium ${isComplete ? 'text-primary' : 'text-muted-foreground'}`}>
              {status.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
