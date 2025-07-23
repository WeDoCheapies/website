
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { carService } from "@/services/carService";
import { toast } from "@/hooks/use-toast";
import { X, Plus, Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface AddCarDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (car: any) => void;
}

const AddCarDialog = ({ isOpen, onClose, onSubmit }: AddCarDialogProps) => {
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: new Date().getFullYear(),
    price: "",
    mileage: "",
    fuel_type: "Petrol",
    transmission: "Manual",
    color: "",
    description: "",
    status: "Available",
    features: [] as string[],
    featured: false
  });
  
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [featureInput, setFeatureInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData({ ...formData, [name]: checked });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setImageFiles(prev => [...prev, ...files]);
      
      // Generate previews
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };
  
  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    
    // Revoke object URL to prevent memory leaks
    URL.revokeObjectURL(imagePreviews[index]);
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const addFeature = () => {
    if (featureInput.trim() && !formData.features.includes(featureInput.trim())) {
      setFormData({
        ...formData,
        features: [...formData.features, featureInput.trim()]
      });
      setFeatureInput("");
    }
  };

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrls: string[] = [];
      if (imageFiles.length > 0) {
        imageUrls = await carService.uploadCarImages(imageFiles);
      }

      const carData = {
        ...formData,
        year: Number(formData.year),
        price: Number(formData.price),
        mileage: Number(formData.mileage),
        image_urls: imageUrls,
        image_url: imageUrls.length > 0 ? imageUrls[0] : ""
      };

      onSubmit(carData);
      
      // Clean up previews
      imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to add car",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl md:max-w-2xl lg:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Car</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Make */}
            <div>
              <Label htmlFor="make">Make *</Label>
              <Input
                id="make"
                name="make"
                value={formData.make}
                onChange={handleChange}
                placeholder="e.g. Toyota"
                required
              />
            </div>

            {/* Model */}
            <div>
              <Label htmlFor="model">Model *</Label>
              <Input
                id="model"
                name="model"
                value={formData.model}
                onChange={handleChange}
                placeholder="e.g. Corolla"
                required
              />
            </div>

            {/* Year */}
            <div>
              <Label htmlFor="year">Year *</Label>
              <Input
                id="year"
                name="year"
                type="number"
                value={formData.year}
                onChange={handleChange}
                min="1900"
                max={new Date().getFullYear() + 1}
                required
              />
            </div>

            {/* Price */}
            <div>
              <Label htmlFor="price">Price (R) *</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                min="0"
                placeholder="e.g. 150000"
                required
              />
            </div>

            {/* Mileage */}
            <div>
              <Label htmlFor="mileage">Mileage (km) *</Label>
              <Input
                id="mileage"
                name="mileage"
                type="number"
                value={formData.mileage}
                onChange={handleChange}
                min="0"
                placeholder="e.g. 80000"
                required
              />
            </div>

            {/* Fuel Type */}
            <div>
              <Label htmlFor="fuel_type">Fuel Type *</Label>
              <select
                id="fuel_type"
                name="fuel_type"
                value={formData.fuel_type}
                onChange={handleChange}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                required
              >
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Electric">Electric</option>
              </select>
            </div>

            {/* Transmission */}
            <div>
              <Label htmlFor="transmission">Transmission *</Label>
              <select
                id="transmission"
                name="transmission"
                value={formData.transmission}
                onChange={handleChange}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                required
              >
                <option value="Manual">Manual</option>
                <option value="Automatic">Automatic</option>
                <option value="Semi-Automatic">Semi-Automatic</option>
              </select>
            </div>

            {/* Color */}
            <div>
              <Label htmlFor="color">Color *</Label>
              <Input
                id="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                placeholder="e.g. White"
                required
              />
            </div>

            {/* Status */}
            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="Available">Available</option>
                <option value="Reserved">Reserved</option>
                <option value="Sold">Sold</option>
              </select>
            </div>
            
            {/* Featured toggle */}
            <div className="flex items-center space-x-2">
              <Switch 
                id="featured" 
                checked={formData.featured}
                onCheckedChange={(checked) => handleSwitchChange("featured", checked)}
              />
              <Label htmlFor="featured">Featured on Homepage</Label>
            </div>

            {/* Features */}
            <div className="md:col-span-2">
              <Label htmlFor="features">Car Features</Label>
              <div className="flex space-x-2">
                <Input
                  id="feature-input"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  placeholder="e.g. Leather Seats"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addFeature();
                    }
                  }}
                />
                <Button 
                  type="button" 
                  onClick={addFeature}
                  variant="secondary"
                  className="shrink-0"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.features.map((feature, index) => (
                  <div 
                    key={index}
                    className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded flex items-center"
                  >
                    {feature}
                    <button 
                      type="button"
                      className="ml-1 text-blue-800 hover:text-blue-900 focus:outline-none"
                      onClick={() => removeFeature(index)}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {formData.features.length === 0 && (
                  <p className="text-xs text-gray-500">No features added yet. Add some features to highlight this vehicle.</p>
                )}
              </div>
            </div>
            
            {/* Image Upload */}
            <div className="md:col-span-2">
              <Label htmlFor="car-images">Car Images</Label>
              <Input
                id="car-images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
              />
              <p className="text-xs text-gray-500 mt-1">
                You can select multiple images. The first image will be used as the main image.
              </p>
              
              {/* Image previews */}
              {imagePreviews.length > 0 && (
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-video border rounded overflow-hidden">
                        <img 
                          src={preview} 
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-sm hover:bg-red-600 focus:outline-none"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </button>
                      {index === 0 && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs py-1 px-2">
                          Main Image
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Additional details about this vehicle..."
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-dealership-secondary text-dealership-primary hover:bg-dealership-secondary/90"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Add Car"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCarDialog;
