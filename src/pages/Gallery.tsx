
import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

// Gallery data (sample)
const galleryImages = [
  {
    id: 1,
    src: '/lovable-uploads/e23808b8-bfde-4972-8f76-ba2c33711641.png',
    alt: 'Honda Brio',
    category: 'Vehicles'
  },
  {
    id: 2,
    src: '/lovable-uploads/8ee45be3-2fff-46de-a4a8-c926a6a12793.png',
    alt: 'Toyota Hilux',
    category: 'Vehicles'
  },
  {
    id: 3,
    src: '/lovable-uploads/cbc20160-8c1a-46a3-ac5c-3c3b100da141.png',
    alt: 'Mercedes-Benz SLK',
    category: 'Vehicles'
  },
  {
    id: 4,
    src: '/lovable-uploads/0e0e3b8c-be0a-4a64-a652-679c9e6c1ae0.png',
    alt: 'Chevrolet Spark',
    category: 'Vehicles'
  },
  {
    id: 5,
    src: '/lovable-uploads/ca74d3e2-e86d-46e1-90f1-42ef7322c714.png',
    alt: 'Volkswagen Polo',
    category: 'Vehicles'
  },
  {
    id: 6,
    src: '/lovable-uploads/d126d8c7-cb3b-4e23-bc21-e662ee514274.png',
    alt: 'Toyota Fortuner',
    category: 'Vehicles'
  },
  {
    id: 7,
    src: '/lovable-uploads/1dd40d96-361f-4c12-81f4-126540c39a9f.png',
    alt: 'We Do Cheapies Dealership',
    category: 'Dealership'
  }
];

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<{
    src: string;
    alt: string;
  } | null>(null);
  
  const [activeCategory, setActiveCategory] = useState<string>('All');
  
  const categories = ['All', ...new Set(galleryImages.map(img => img.category))];
  
  const filteredImages = activeCategory === 'All'
    ? galleryImages
    : galleryImages.filter(img => img.category === activeCategory);

  return (
    <Layout>
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-4">Gallery</h1>
            <p className="text-lg text-gray-300 mb-4">A showcase of our vehicles and dealership</p>
            <div className="w-24 h-1 bg-dealership-secondary mb-6"></div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {categories.map((category) => (
              <Button
                key={category}
                onClick={() => setActiveCategory(category)}
                variant={activeCategory === category ? "default" : "outline"}
                className={activeCategory === category ? "bg-dealership-secondary text-dealership-primary hover:bg-dealership-secondary/90" : ""}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredImages.map((image) => (
              <div 
                key={image.id}
                className="aspect-square relative overflow-hidden rounded-lg shadow-md cursor-pointer hover:scale-[1.02] transition-transform"
                onClick={() => setSelectedImage({
                  src: image.src,
                  alt: image.alt
                })}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity flex items-end">
                  <div className="p-4 w-full bg-black bg-opacity-50 text-white">
                    <p className="font-semibold">{image.alt}</p>
                    <p className="text-sm opacity-80">{image.category}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Image Modal */}
          {selectedImage && (
            <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
              <div className="relative max-w-4xl max-h-[90vh] w-full">
                <Button 
                  variant="outline"
                  size="icon"
                  className="absolute -top-12 right-0 text-white bg-transparent border-white hover:bg-white hover:text-black"
                  onClick={() => setSelectedImage(null)}
                >
                  <X className="h-6 w-6" />
                </Button>
                <img
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  className="w-full h-auto max-h-[80vh] object-contain"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Gallery;
