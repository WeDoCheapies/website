
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Car } from "@/services/carService";
import { Edit, Trash2, Image, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";

interface CarInventoryTableProps {
  cars: Car[];
  loading: boolean;
  onEdit: (car: Car) => void;
  onDelete: (id: string, imageUrls?: string[]) => void;
}

const CarInventoryTable = ({
  cars,
  loading,
  onEdit,
  onDelete,
}: CarInventoryTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedImageUrls, setSelectedImageUrls] = useState<string[]>([]);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const itemsPerPage = 10;

  // Calculate pagination
  const indexOfLastCar = currentPage * itemsPerPage;
  const indexOfFirstCar = indexOfLastCar - itemsPerPage;
  const currentCars = cars.slice(indexOfFirstCar, indexOfLastCar);
  const totalPages = Math.ceil(cars.length / itemsPerPage);

  // Format price with commas
  const formatPrice = (price: number) => {
    return "R" + price.toLocaleString();
  };

  const openGallery = (imageUrls: string[]) => {
    setSelectedImageUrls(imageUrls);
    setCurrentImageIndex(0);
    setGalleryOpen(true);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === selectedImageUrls.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? selectedImageUrls.length - 1 : prev - 1
    );
  };

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Make & Model
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Year
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mileage
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-dealership-secondary"></div>
                    <span className="ml-2">Loading...</span>
                  </div>
                </td>
              </tr>
            ) : currentCars.length > 0 ? (
              currentCars.map((car) => (
                <tr key={car.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-16 h-12 relative bg-gray-200 rounded overflow-hidden cursor-pointer group"
                         onClick={() => {
                           // If car has multiple images use those, otherwise use the single image_url
                           const images = (car.image_urls && car.image_urls.length > 0) 
                             ? car.image_urls 
                             : (car.image_url ? [car.image_url] : []);
                           if (images.length > 0) {
                             openGallery(images);
                           }
                         }}
                    >
                      {car.image_url || (car.image_urls && car.image_urls.length > 0) ? (
                        <>
                          <img
                            src={(car.image_urls && car.image_urls.length > 0) ? car.image_urls[0] : car.image_url}
                            alt={`${car.make} ${car.model}`}
                            className="w-full h-full object-cover"
                          />
                          {((car.image_urls && car.image_urls.length > 1) || (car.image_url && car.image_urls && car.image_urls.length > 0)) && (
                            <div className="absolute bottom-0 right-0 bg-black bg-opacity-60 text-white text-xs p-1 rounded-tl">
                              <Image size={12} className="inline mr-1" />
                              {(car.image_urls?.length || 1)}
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                            <Image className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          No image
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium">{car.make}</div>
                    <div className="text-gray-500">{car.model}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{car.year}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatPrice(Number(car.price))}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{car.mileage.toLocaleString()} km</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      <div>{car.fuel_type}</div>
                      <div>{car.transmission}</div>
                      <div>{car.color}</div>
                      {car.features && car.features.length > 0 && (
                        <div className="mt-1">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            {car.features.length} features
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        car.status === "Available"
                          ? "bg-green-100 text-green-800"
                          : car.status === "Reserved"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {car.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-blue-600 hover:text-blue-900 hover:bg-blue-100"
                        onClick={() => onEdit(car)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-600 hover:text-red-900 hover:bg-red-100"
                        onClick={() => onDelete(car.id, car.image_urls)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                  No cars found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <div className="text-sm text-gray-700">
            Showing{" "}
            <span className="font-medium">
              {indexOfFirstCar + 1}-
              {Math.min(indexOfLastCar, cars.length)}
            </span>{" "}
            of <span className="font-medium">{cars.length}</span> cars
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Image Gallery Dialog */}
      <Dialog open={galleryOpen} onOpenChange={setGalleryOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogTitle className="flex justify-between items-center">
            <span>Image Gallery</span>
            <DialogClose className="w-6 h-6 rounded-full hover:bg-gray-200 flex items-center justify-center">
              <X className="h-4 w-4" />
            </DialogClose>
          </DialogTitle>
          <div className="relative">
            {selectedImageUrls.length > 0 && (
              <div className="relative aspect-video">
                <img
                  src={selectedImageUrls[currentImageIndex]}
                  alt={`Gallery image ${currentImageIndex + 1}`}
                  className="object-contain w-full h-full"
                />
                {selectedImageUrls.length > 1 && (
                  <>
                    <Button
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-2"
                      onClick={prevImage}
                      variant="ghost"
                      size="icon"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                        <path d="m15 18-6-6 6-6"/>
                      </svg>
                    </Button>
                    <Button
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-2"
                      onClick={nextImage}
                      variant="ghost"
                      size="icon"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                        <path d="m9 18 6-6-6-6"/>
                      </svg>
                    </Button>
                  </>
                )}
              </div>
            )}
            <div className="flex justify-center mt-4 gap-2 overflow-x-auto pb-2">
              {selectedImageUrls.map((url, index) => (
                <div
                  key={index}
                  className={`w-16 h-12 rounded overflow-hidden cursor-pointer border-2 ${
                    index === currentImageIndex ? 'border-dealership-secondary' : 'border-transparent'
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <img
                    src={url}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CarInventoryTable;
