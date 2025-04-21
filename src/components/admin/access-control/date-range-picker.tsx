'use client';

import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { Calendar } from 'lucide-react';
import { Button } from '../../ui/button';
import { Calendar as CalendarUI } from '../../ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../ui/popover';

export const DatePickerWithRange = ({
  dateRange,
  onDateRangeChange,
  className,
}: {
  dateRange?: DateRange;
  onDateRangeChange: (range: DateRange | undefined) => void;
  className?: string;
}) => {
  return (
    <div className={className}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal"
          >
            <Calendar className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, 'MMM dd, yyyy')} -{' '}
                  {format(dateRange.to, 'MMM dd, yyyy')}
                </>
              ) : (
                format(dateRange.from, 'MMM dd, yyyy')
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <CalendarUI
            mode="range"
            selected={dateRange}
            onSelect={onDateRangeChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};