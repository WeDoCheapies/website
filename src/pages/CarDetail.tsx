
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import Layout from '@/components/layout/Layout';
import ContactButtons from '@/components/ui/ContactButtons';
import CarEnquiryForm from '@/components/car/CarEnquiryForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { carService, Car } from '@/services/carService';
import { toast } from '@/hooks/use-toast';

const CarDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const isMobile = useIsMobile();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchCarDetails() {
      if (!id) return;
      
      try {
        setLoading(true);
        const carData = await carService.getCar(id);
        setCar(carData);
        console.log("Car data loaded:", carData);
      } catch (error) {
        console.error("Error fetching car details:", error);
        setError("Failed to load vehicle details. Please try again later.");
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load vehicle details",
        });
      } finally {
        setLoading(false);
      }
    }
    
    fetchCarDetails();
  }, [id]);
  
  if (loading) {
    return (
      <Layout>
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Loading...</h2>
              <p className="text-gray-600 mb-6">Please wait while we load the vehicle details.</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (error || !car) {
    return (
      <Layout>
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Vehicle Not Found</h2>
              <p className="text-gray-600 mb-6">The vehicle you're looking for could not be found.</p>
              <Button asChild>
                <Link to="/inventory">Back to Inventory</Link>
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  // Functions for image carousel
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === car.image_urls.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? car.image_urls.length - 1 : prevIndex - 1
    );
  };

  // Format the price with commas
  const formattedPrice = car.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return (
    <Layout>
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          {/* Breadcrumb */}
          <div className="mb-6">
            <nav className="text-white text-sm">
              <ol className="flex items-center space-x-2">
                <li>
                  <Link to="/" className="hover:text-dealership-secondary">Home</Link>
                </li>
                <li className="flex items-center">
                  <span className="mx-2">/</span>
                  <Link to="/inventory" className="hover:text-dealership-secondary">Inventory</Link>
                </li>
                <li className="flex items-center">
                  <span className="mx-2">/</span>
                  <span className="text-dealership-secondary">{car.make} {car.model}</span>
                </li>
              </ol>
            </nav>
          </div>

          {/* Car Details Section */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Image Carousel */}
              <div className="relative">
                <img 
                  src={car.image_urls && car.image_urls.length > 0 ? car.image_urls[currentImageIndex] : car.image_url} 
                  alt={`${car.make} ${car.model}`}
                  className="w-full h-full object-cover md:min-h-[400px]"
                />
                
                {car.image_urls && car.image_urls.length > 1 && (
                  <>
                    <button 
                      onClick={prevImage} 
                      className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black/50 p-2 rounded-r text-white hover:bg-black/70 transition-colors"
                    >
                      <ArrowLeft size={20} />
                    </button>
                    <button 
                      onClick={nextImage} 
                      className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black/50 p-2 rounded-l text-white hover:bg-black/70 transition-colors"
                    >
                      <ArrowRight size={20} />
                    </button>
                    
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                      {car.image_urls.map((_, index) => (
                        <button 
                          key={index} 
                          onClick={() => setCurrentImageIndex(index)}
                          className={`h-2 w-2 rounded-full ${index === currentImageIndex ? 'bg-dealership-secondary' : 'bg-white/70'}`}
                          aria-label={`View image ${index + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
              
              {/* Car Information */}
              <div className="p-6">
                <h1 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900">
                  {car.make} {car.model}
                </h1>
                <p className="text-xl md:text-2xl font-bold text-dealership-secondary mb-4">
                  R{formattedPrice}
                </p>
                
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-6">
                  <div>
                    <span className="text-gray-500 block">Year:</span>
                    <span className="font-medium">{car.year}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Mileage:</span>
                    <span className="font-medium">{car.mileage.toLocaleString()} km</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Transmission:</span>
                    <span className="font-medium">{car.transmission}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Fuel Type:</span>
                    <span className="font-medium">{car.fuel_type}</span>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Description</h3>
                <p className="text-gray-700 mb-6">{car.description || "No description available for this vehicle."}</p>
                
                <div className="flex flex-col space-y-4">
                  <ContactButtons 
                    carDetails={{
                      make: car.make,
                      model: car.model,
                      year: car.year
                    }}
                  />
                </div>
              </div>
            </div>
            
            {/* Additional Details Tabs */}
            <div className="border-t border-gray-200">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Vehicle Features</h3>
                {car.features && car.features.length > 0 ? (
                  <ul className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {car.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-gray-700">
                        <span className="w-2 h-2 bg-dealership-secondary rounded-full mr-2"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No specific features listed for this vehicle.</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Back to Inventory Button */}
          <div className="mt-8">
            <Button asChild variant="outline">
              <Link to="/inventory" className="flex items-center">
                <ArrowLeft className="mr-2" size={16} />
                Back to Inventory
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CarDetail;
