import { ReactNode } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '../../lib/utils';

interface StatsCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  trend?: 'day' | 'week' | 'month' | 'year';
  delta?: number;
  className?: string;
}

export const StatsCard = ({
  title,
  value,
  icon,
  trend = 'week',
  delta = 0,
  className,
}: StatsCardProps) => {
  const isPositive = delta >= 0;
  
  return (
    <div className={cn(
      "relative overflow-hidden rounded-xl p-6 shadow-lg backdrop-blur-sm transition-all hover:shadow-xl",
      className
    )}>
      <div className="flex items-center gap-4">
        <div className="rounded-xl bg-white/10 p-3">
          {icon}
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-300">{title}</h3>
          <p className="mt-1 text-2xl font-bold text-white">{value}</p>
        </div>
      </div>
      
      {delta !== 0 && (
        <div className="absolute bottom-3 right-6 flex items-center gap-1 rounded-full bg-gray-800/50 px-2 py-1 text-xs font-medium">
          {isPositive ? (
            <ArrowUp className="h-3 w-3 text-green-400" />
          ) : (
            <ArrowDown className="h-3 w-3 text-red-400" />
          )}
          <span className={cn(
            isPositive ? "text-green-400" : "text-red-400"
          )}>
            {Math.abs(delta).toFixed(1)}%
          </span>
          <span className="text-gray-400">vs last {trend}</span>
        </div>
      )}
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 h-16 w-16 translate-x-8 -translate-y-8 transform rounded-full bg-white/5 blur-2xl" />
      <div className="absolute bottom-0 left-0 h-20 w-20 -translate-x-10 translate-y-10 transform rounded-full bg-white/5 blur-3xl" />
    </div>
  );
};