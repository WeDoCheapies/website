
import { useState } from 'react';
import CarWashLayout from '@/components/carwash/CarWashLayout';
import SectionHeading from '@/components/ui/SectionHeading';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CarWashGallery = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const galleryImages = [
    {
      src: "/lovable-uploads/5983e68c-913c-40da-88fa-449d07f4d194.png",
      alt: "Main Street Car Wash Entrance",
      category: "facility"
    },
    {
      src: "/lovable-uploads/0c9bda8d-8607-4099-988a-e8733b9bca11.png",
      alt: "Car Wash Services Board",
      category: "facility"
    },
    {
      src: "/lovable-uploads/635b8771-eb1a-4b4c-994a-dd5fd97a7bbd.png",
      alt: "Premium Porsche Service",
      category: "results"
    },
    {
      src: "/lovable-uploads/688039b0-2bf0-4a9e-86b0-d700106285cf.png",
      alt: "Mercedes Benz Cleaning",
      category: "results"
    },
    {
      src: "/lovable-uploads/6f10579a-8be0-424a-979b-717d53f39ceb.png",
      alt: "BMW X5 Professional Wash",
      category: "results"
    },
    {
      src: "/lovable-uploads/fec2a49c-b102-4788-8d97-a494921755a0.png",
      alt: "Premium Car Detail Work",
      category: "results"
    },
    {
      src: "/IMG-20250524-WA0035.jpg",
      alt: "Car Wash Service",
      category: "results"
    },
    {
      src: "/IMG-20250524-WA0039.jpg",
      alt: "Car Wash Service",
      category: "results"
    },
    {
      src: "/IMG-20250524-WA0040.jpg",
      alt: "Car Wash Service",
      category: "results"
    },
    {
      src: "/IMG-20250524-WA0041.jpg",
      alt: "Car Wash Service",
      category: "results"
    },
    {
      src: "/IMG-20250524-WA0042.jpg",
      alt: "Car Wash Service",
      category: "results"
    },
    {
      src: "/IMG-20250524-WA0043.jpg",
      alt: "Car Wash Service",
      category: "results"
    },
    {
      src: "/IMG-20250524-WA0044.jpg",
      alt: "Car Wash Service",
      category: "results"
    },
    {
      src: "/IMG-20250524-WA0045.jpg",
      alt: "Car Wash Service",
      category: "results"
    },
    {
      src: "/IMG-20250524-WA0046.jpg",
      alt: "Car Wash Service",
      category: "results"
    },
    {
      src: "/IMG-20250524-WA0047.jpg",
      alt: "Car Wash Service",
      category: "results"
    },
    {
      src: "/IMG-20250524-WA0048.jpg",
      alt: "Car Wash Service",
      category: "results"
    },
    {
      src: "/IMG-20250524-WA0049.jpg",
      alt: "Car Wash Service",
      category: "results"
    },
    {
      src: "/IMG-20250524-WA0050.jpg",
      alt: "Car Wash Service",
      category: "results"
    },
    {
      src: "/IMG-20250524-WA0051.jpg",
      alt: "Car Wash Service",
      category: "results"
    },
    {
      src: "/IMG-20250524-WA0052.jpg",
      alt: "Car Wash Service",
      category: "results"
    },
    {
      src: "/IMG-20250524-WA0053.jpg",
      alt: "Car Wash Service",
      category: "results"
    },
    {
      src: "/IMG-20250524-WA0054.jpg",
      alt: "Car Wash Service",
      category: "results"
    }
  ];

  const [filter, setFilter] = useState('all');
  
  const filteredImages = filter === 'all' 
    ? galleryImages 
    : galleryImages.filter(image => image.category === filter);

  return (
    <CarWashLayout>
      <div className="pt-24 pb-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeading
            title="Car Wash Gallery"
            subtitle="See our facility and our sparkling clean results"
            isCarWash={true}
          />

          {/* Filter buttons */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-gray-100 rounded-lg overflow-hidden border border-carwash-border">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 font-medium transition-all ${filter === 'all' ? 'bg-carwash-secondary text-white' : 'text-carwash-text hover:bg-gray-200'}`}
              >
                All Photos
              </button>
              <button
                onClick={() => setFilter('facility')}
                className={`px-4 py-2 font-medium transition-all ${filter === 'facility' ? 'bg-carwash-secondary text-white' : 'text-carwash-text hover:bg-gray-200'}`}
              >
                Our Facility
              </button>
              <button
                onClick={() => setFilter('results')}
                className={`px-4 py-2 font-medium transition-all ${filter === 'results' ? 'bg-carwash-secondary text-white' : 'text-carwash-text hover:bg-gray-200'}`}
              >
                Clean Results
              </button>
            </div>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredImages.map((image, index) => (
              <div 
                key={index} 
                className="relative group cursor-pointer overflow-hidden rounded-lg aspect-square bg-gray-100 border border-carwash-border hover:shadow-lg transition-all duration-300"
                onClick={() => setSelectedImage(image.src)}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-4">
                    <h4 className="text-white font-medium">{image.alt}</h4>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Image Modal */}
          {selectedImage && (
            <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
              <div className="relative max-w-4xl max-h-[90vh] w-full">
                <button 
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-4 right-4 bg-white rounded-full p-1 text-gray-900 hover:bg-gray-100 transition-colors"
                >
                  <X size={24} />
                </button>
                <img
                  src={selectedImage}
                  alt="Enlarged view"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          )}

          {/* No Results Message */}
          {filteredImages.length === 0 && (
            <div className="bg-white rounded-lg p-8 text-center border border-carwash-border">
              <h3 className="text-xl font-semibold mb-2 text-carwash-text">No images found</h3>
              <p className="text-carwash-muted">Try selecting a different filter</p>
            </div>
          )}

          {/* More Photos Coming Soon */}
          <div className="mt-16 text-center">
            <h3 className="text-xl font-semibold text-carwash-text mb-2">More Photos Coming Soon</h3>
            <p className="text-carwash-muted mb-6">We're constantly updating our gallery with new images of our work!</p>
            
            <Button 
              className="bg-carwash-secondary hover:bg-carwash-accent text-white shadow-lg"
              onClick={() => window.location.href = '/car-wash/services'}
            >
              View Our Services
            </Button>
          </div>
        </div>
      </div>
    </CarWashLayout>
  );
};

export default CarWashGallery;
