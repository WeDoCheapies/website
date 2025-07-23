
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/layout/Layout';
import SectionHeading from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, X, Loader2 } from 'lucide-react';
import MobileFilter from '@/components/inventory/MobileFilter';
import { useIsMobile } from '@/hooks/use-mobile';
import { Car, carService } from '@/services/carService';

const Inventory = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    make: '',
    priceMin: '',
    priceMax: '',
    yearMin: '',
    yearMax: '',
  });
  const isMobile = useIsMobile();

  // Fetch cars from Supabase using React Query
  const { data: cars = [], isLoading, error } = useQuery({
    queryKey: ['cars'],
    queryFn: () => carService.getCars({ status: 'Available' }),
  });

  // Filter cars based on search and filters
  const filteredCars = cars.filter(car => {
    const matchesSearch = 
      car.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.model.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesMake = !filters.make || car.make === filters.make;
    const matchesPriceMin = !filters.priceMin || Number(car.price) >= Number(filters.priceMin);
    const matchesPriceMax = !filters.priceMax || Number(car.price) <= Number(filters.priceMax);
    const matchesYearMin = !filters.yearMin || car.year >= Number(filters.yearMin);
    const matchesYearMax = !filters.yearMax || car.year <= Number(filters.yearMax);
    
    return matchesSearch && matchesMake && matchesPriceMin && matchesPriceMax && matchesYearMin && matchesYearMax;
  });

  // Get unique makes for filter dropdown
  const uniqueMakes = [...new Set(cars.map(car => car.make))];

  // Handle filter changes
  const handleFilterChange = (key: string, value: string) => {
    setFilters({
      ...filters,
      [key]: value
    });
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setFilters({
      make: '',
      priceMin: '',
      priceMax: '',
      yearMin: '',
      yearMax: '',
    });
  };

  // Format price with commas - Updated to handle undefined values
  const formatPrice = (price: number | undefined) => {
    if (price === undefined || price === null) {
      return '0';
    }
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="pt-24 pb-16 min-h-screen">
          <div className="container mx-auto px-4 md:px-6 flex justify-center items-center">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin mx-auto text-dealership-secondary" />
              <p className="mt-4 text-xl text-white">Loading inventory...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="pt-24 pb-16 min-h-screen">
          <div className="container mx-auto px-4 md:px-6">
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
              <p>There was an error loading the inventory. Please try again later.</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-4">Our Inventory</h1>
            <p className="text-lg text-gray-300 mb-4">Browse our selection of quality used vehicles</p>
            <div className="w-24 h-1 bg-dealership-secondary mb-6"></div>
          </div>

          {/* Search */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-grow relative">
                <Input
                  type="text"
                  placeholder="Search by make or model..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-2.5"
                  >
                    <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
            </div>

            {/* Mobile Filter */}
            <MobileFilter 
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={clearFilters}
              uniqueMakes={uniqueMakes}
            />

            {/* Desktop Filter Controls */}
            <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Make</label>
                <select
                  value={filters.make}
                  onChange={(e) => handleFilterChange('make', e.target.value)}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
                <input
                  type="number"
                  placeholder="Min Price"
                  value={filters.priceMin}
                  onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-dealership-secondary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
                <input
                  type="number"
                  placeholder="Max Price"
                  value={filters.priceMax}
                  onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-dealership-secondary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Year</label>
                <input
                  type="number"
                  placeholder="Min Year"
                  value={filters.yearMin}
                  onChange={(e) => handleFilterChange('yearMin', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-dealership-secondary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Year</label>
                <input
                  type="number"
                  placeholder="Max Year"
                  value={filters.yearMax}
                  onChange={(e) => handleFilterChange('yearMax', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-dealership-secondary"
                />
              </div>
            </div>
          </div>

          {/* Results count */}
          <div className="mb-6">
            <p className="text-white">
              Showing {filteredCars.length} {filteredCars.length === 1 ? 'vehicle' : 'vehicles'}
            </p>
          </div>

          {/* Car Grid */}
          {filteredCars.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
              {filteredCars.map((car) => (
                <div key={car.id} className="car-card bg-white rounded-lg overflow-hidden shadow-lg">
                  <div className="relative">
                    <img
                      src={car.image_url || (car.image_urls && car.image_urls.length > 0 ? car.image_urls[0] : '/placeholder.svg')}
                      alt={`${car.make} ${car.model}`}
                      className="w-full h-36 sm:h-48 object-cover"
                    />
                    <div className="absolute top-0 right-0 bg-dealership-secondary text-dealership-primary p-1 sm:p-2 font-bold text-xs sm:text-sm">
                      R{formatPrice(Number(car.price))}
                    </div>
                  </div>
                  <div className="p-2 sm:p-4">
                    <h3 className="text-sm sm:text-lg font-bold truncate">
                      {car.make} {car.model}
                    </h3>
                    <div className="flex justify-between text-gray-600 text-xs sm:text-sm mt-1 sm:mt-2">
                      <span>{car.year}</span>
                      <span>{car.mileage?.toLocaleString()} km</span>
                    </div>
                    <div className="mt-2 sm:mt-4">
                      <Link
                        to={`/inventory/${car.id}`}
                        className="w-full inline-block text-center py-1 sm:py-2 bg-dealership-primary text-white rounded text-sm hover:bg-dealership-primary/90 transition-colors"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg text-center">
              <h3 className="text-xl font-semibold mb-2">No vehicles found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search criteria or clear filters</p>
              <Button onClick={clearFilters} variant="default" className="bg-dealership-secondary text-dealership-primary hover:bg-dealership-secondary/90">
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Inventory;
