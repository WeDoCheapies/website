
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';

interface FilterValues {
  make: string;
  priceMin: string;
  priceMax: string;
  yearMin: string;
  yearMax: string;
}

interface MobileFilterProps {
  filters: FilterValues;
  onFilterChange: (key: string, value: string) => void;
  onClearFilters: () => void;
  uniqueMakes: string[];
}

const MobileFilter = ({ filters, onFilterChange, onClearFilters, uniqueMakes }: MobileFilterProps) => {
  const [open, setOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState<FilterValues>(filters);

  // Handle local filter changes
  const handleLocalFilterChange = (key: string, value: string) => {
    setTempFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Apply filters and close sheet
  const applyFilters = () => {
    // Apply each filter individually
    Object.entries(tempFilters).forEach(([key, value]) => {
      onFilterChange(key, value);
    });
    setOpen(false);
  };

  // Reset filters
  const resetFilters = () => {
    const emptyFilters = {
      make: '',
      priceMin: '',
      priceMax: '',
      yearMin: '',
      yearMax: '',
    };
    setTempFilters(emptyFilters);
    onClearFilters();
  };

  return (
    <>
      <Button 
        onClick={() => setOpen(true)} 
        variant="outline" 
        className="flex items-center gap-2 md:hidden w-full mb-4"
      >
        <Filter size={18} />
        Filter Vehicles
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="h-[80vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-center">
              Filter Inventory
            </SheetTitle>
          </SheetHeader>

          <div className="py-4 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Make</label>
              <select
                value={tempFilters.make}
                onChange={(e) => handleLocalFilterChange('make', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-dealership-secondary"
              >
                <option value="">All Makes</option>
                {uniqueMakes.map((make) => (
                  <option key={make} value={make}>
                    {make}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <input
                    type="number"
                    placeholder="Min Price"
                    value={tempFilters.priceMin}
                    onChange={(e) => handleLocalFilterChange('priceMin', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-dealership-secondary"
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="number"
                    placeholder="Max Price"
                    value={tempFilters.priceMax}
                    onChange={(e) => handleLocalFilterChange('priceMax', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-dealership-secondary"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year Range</label>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <input
                    type="number"
                    placeholder="Min Year"
                    value={tempFilters.yearMin}
                    onChange={(e) => handleLocalFilterChange('yearMin', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-dealership-secondary"
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="number"
                    placeholder="Max Year"
                    value={tempFilters.yearMax}
                    onChange={(e) => handleLocalFilterChange('yearMax', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-dealership-secondary"
                  />
                </div>
              </div>
            </div>
          </div>

          <SheetFooter className="flex flex-col space-y-2 sm:space-y-0">
            <Button onClick={applyFilters} className="w-full bg-dealership-secondary text-dealership-primary hover:bg-dealership-secondary/90">
              Apply Filters
            </Button>
            <Button onClick={resetFilters} variant="outline" className="w-full">
              Clear All Filters
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default MobileFilter;
