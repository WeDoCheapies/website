
import React, { useState, useEffect } from 'react';
import { WashType } from '@/services/washService';
import { Skeleton } from '@/components/ui/skeleton';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  ToggleGroup,
  ToggleGroupItem
} from '@/components/ui/toggle-group';

interface WashTypeSelectProps {
  washTypes: WashType[];
  onSelect: (washTypeId: string, carType: 'small' | 'bakkie_suv', price: number) => void;
  isLoading?: boolean;
}

const WashTypeSelect: React.FC<WashTypeSelectProps> = ({ 
  washTypes = [], 
  onSelect, 
  isLoading = false 
}) => {
  const [selectedWashType, setSelectedWashType] = useState<WashType | null>(null);
  const [carType, setCarType] = useState<'small' | 'bakkie_suv'>('small');

  useEffect(() => {
    if (selectedWashType) {
      const price = carType === 'small' 
        ? selectedWashType.price_small_car 
        : selectedWashType.price_bakkie_suv;

      onSelect(selectedWashType.id, carType, price);
    }
  }, [selectedWashType, carType, onSelect]);

  useEffect(() => {
    if (washTypes.length === 0) {
      setSelectedWashType(null);
    }
  }, [washTypes]);

  if (isLoading) {
    return <Skeleton className="h-10 w-full" />;
  }

  const getSelectedPrice = () => {
    if (!selectedWashType) return 0;
    return carType === 'small' 
      ? selectedWashType.price_small_car 
      : selectedWashType.price_bakkie_suv;
  };

  return (
    <div className="space-y-6 p-4">
      <div className="space-y-3 text-center">
        <h3 className="text-sm font-semibold text-gray-700">Vehicle Type</h3>
        <ToggleGroup 
          type="single" 
          value={carType}
          onValueChange={(value) => {
            if (value) setCarType(value as 'small' | 'bakkie_suv');
          }} 
          className="flex justify-center gap-4"
        >
          <ToggleGroupItem value="small" aria-label="Small Car" className="px-4 py-2 rounded-md border">
            Small Car
          </ToggleGroupItem>
          <ToggleGroupItem value="bakkie_suv" aria-label="Bakkie/SUV" className="px-4 py-2 rounded-md border">
            Bakkie/SUV
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="space-y-3 text-center">
        <h3 className="text-sm font-semibold text-gray-700">Wash Package</h3>
        <Select
          value={selectedWashType?.id || ""}
          onValueChange={(value) => {
            const selected = washTypes.find(type => type.id === value);
            if (selected) {
              setSelectedWashType(selected);
            }
          }}
        >
          <SelectTrigger className="w-full h-12 rounded-md border shadow-sm">
            <SelectValue placeholder="Select wash type..." />
          </SelectTrigger>
          <SelectContent className="bg-white max-h-80 overflow-y-auto">
            <SelectGroup>
              {washTypes.length > 0 ? (
                washTypes.map((washType) => (
                  <SelectItem 
                    key={washType.id} 
                    value={washType.id}
                    className="py-3 cursor-pointer hover:bg-gray-50 focus:bg-gray-100"
                  >
                    <div className="flex flex-col">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-base">{washType.name}</span>
                        <span className="text-carwash-secondary font-semibold ml-2">
                          R{carType === 'small' ? washType.price_small_car : washType.price_bakkie_suv}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">{washType.description}</div>
                    </div>
                  </SelectItem>
                ))
              ) : (
                <div className="px-4 py-6 text-sm text-muted-foreground">
                  No wash types available. Please add wash types in the Wash Types Management page.
                </div>
              )}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {selectedWashType && (
        <div className="mt-4 p-4 border rounded-md bg-slate-50 shadow-sm transition-all animate-fade-in text-center">
          <p className="font-medium text-lg text-carwash-primary">
            Price: <span className="text-carwash-secondary font-semibold">R{getSelectedPrice()}</span>
          </p>
          <p className="text-sm text-gray-600 mt-1">{selectedWashType.description}</p>
        </div>
      )}

      {washTypes.length === 0 && (
        <div className="p-4 border border-dashed rounded-md bg-gray-50 text-center">
          <p className="text-sm text-muted-foreground">
            No wash types available. Please add wash types in the Wash Types Management page.
          </p>
        </div>
      )}
    </div>
  );
};

export default WashTypeSelect;
