import { TrendingUp, TrendingDown } from 'lucide-react';

export const StatsCard = ({ title, value, trend, delta }: { 
  title: string;
  value: string | number;
  trend: string;
  delta?: number;
}) => {
  return (
    <div className="border rounded-xl p-6 bg-background shadow-sm">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <span className="text-xs text-muted-foreground">Last {trend}</span>
      </div>
      <div className="mt-4 flex items-baseline gap-2">
        <div className="text-3xl font-bold">{value}</div>
        {delta && (
          <div className={`flex items-center text-sm ${
            delta > 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {delta > 0 ? (
              <TrendingUp className="w-4 h-4 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 mr-1" />
            )}
            {Math.abs(delta)}%
          </div>
        )}
      </div>
    </div>
  );
};