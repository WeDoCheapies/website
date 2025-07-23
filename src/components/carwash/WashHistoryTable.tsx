
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Printer, Calendar, Clock, Check } from 'lucide-react';
import { Wash } from '@/services/washService';
import { formatDate } from '@/lib/formatDate';

interface WashHistoryTableProps {
  washes: Wash[];
  isLoading: boolean;
  onPrintReceipt: (washId: string) => void;
}

const WashHistoryTable: React.FC<WashHistoryTableProps> = ({ 
  washes,
  isLoading,
  onPrintReceipt
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-carwash-secondary" />
      </div>
    );
  }

  if (washes.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No wash history available.
      </div>
    );
  }

  // Format date for better display
  const formatWashDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      dateStr: date.toLocaleDateString('en-ZA', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }),
      timeStr: date.toLocaleTimeString('en-ZA', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  };

  return (
    <div className="w-full overflow-auto">
      <div className="rounded-md border">
        <Table>
          <TableCaption>Customer wash history</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Date/Time</TableHead>
              <TableHead>Wash Type</TableHead>
              <TableHead>Car Type</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Receipt</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {washes.map((wash, index) => {
              const { dateStr, timeStr } = formatWashDate(wash.performed_at);
              
              return (
                <TableRow 
                  key={wash.id} 
                  className={`hover:bg-slate-50 ${index !== washes.length - 1 ? 'border-b' : ''} ${wash.was_free ? 'bg-yellow-50' : ''}`}
                >
                  <TableCell className="py-4">
                    <div className="flex flex-col">
                      <div className="flex items-center text-sm font-medium">
                        <Calendar className="h-3.5 w-3.5 mr-1.5 text-carwash-primary" />
                        {dateStr}
                      </div>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <Clock className="h-3 w-3 mr-1.5" />
                        {timeStr}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="font-medium">{wash.wash_type?.name || "Unknown"}</div>
                    <div className="text-xs text-gray-500 mt-1 max-w-36 line-clamp-2">
                      {wash.wash_type?.description}
                    </div>
                  </TableCell>
                  <TableCell className="py-4 capitalize">
                    {wash.car_type === 'small' ? 'Small Car' : 'Bakkie/SUV'}
                  </TableCell>
                  <TableCell className="py-4 font-medium">
                    R{wash.price}
                  </TableCell>
                  <TableCell className="py-4">
                    {wash.was_free ? (
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300 flex items-center whitespace-nowrap animate-pulse">
                        <Check className="h-3.5 w-3.5 mr-1" />
                        Free Wash
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-green-50 text-green-800 border-green-300 whitespace-nowrap">
                        Paid
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="py-4 text-right">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => onPrintReceipt(wash.id)}
                      className="whitespace-nowrap"
                    >
                      <Printer className="h-4 w-4 mr-1" />
                      Print
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default WashHistoryTable;
