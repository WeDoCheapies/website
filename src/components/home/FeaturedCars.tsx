
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { Car, carService } from '@/services/carService';

const FeaturedCars = () => {
  // Fetch featured cars from Supabase using React Query
  const { data: featuredCars = [], isLoading, error } = useQuery({
    queryKey: ['featuredCars'],
    queryFn: async () => {
      // Get cars that are both featured and available
      const allCars = await carService.getCars({ status: 'Available' });
      return allCars.filter(car => car.featured === true);
    }
  });

  // Format price with commas
  const formatPrice = (price: number | undefined) => {
    if (price === undefined || price === null) {
      return '0';
    }
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-dealership-secondary" />
        <span className="ml-2">Loading featured vehicles...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8">
        <p className="text-center text-red-500">There was an error loading featured vehicles.</p>
      </div>
    );
  }

  if (featuredCars.length === 0) {
    return (
      <div className="py-8">
        <p className="text-center">No featured vehicles currently available.</p>
        <p className="text-center mt-2">
          <Link to="/inventory" className="text-dealership-secondary hover:underline">
            View all inventory
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredCars.map((car) => (
          <div key={car.id} className="car-card bg-white rounded-lg overflow-hidden shadow-lg transform transition duration-300 hover:scale-105">
            <div className="relative">
              <img
                src={car.image_url || (car.image_urls && car.image_urls.length > 0 ? car.image_urls[0] : '/placeholder.svg')}
                alt={`${car.make} ${car.model}`}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-0 right-0 bg-dealership-secondary text-dealership-primary p-2 font-bold">
                R{formatPrice(Number(car.price))}
              </div>
              <div className="absolute top-0 left-0 bg-black bg-opacity-70 text-white p-2 font-bold">
                Featured
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-bold">
                {car.make} {car.model}
              </h3>
              <div className="flex justify-between text-gray-600 mt-2">
                <span>{car.year}</span>
                <span>{car.mileage?.toLocaleString()} km</span>
              </div>
              <div className="mt-4">
                <Link
                  to={`/inventory/${car.id}`}
                  className="block text-center py-2 bg-dealership-primary text-white rounded hover:bg-dealership-primary/90 transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center mt-8">
        <Link
          to="/inventory"
          className="inline-block px-6 py-3 bg-dealership-secondary text-dealership-primary font-bold rounded-lg hover:bg-dealership-secondary/90 transition-colors"
        >
          View All Inventory
        </Link>
      </div>
    </div>
  );
};

export default FeaturedCars;
