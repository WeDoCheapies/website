
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import AdminLayout from "@/components/layout/AdminLayout";
import CarInventoryTable from "@/components/dealership/CarInventoryTable";
import CarFilters from "@/components/dealership/CarFilters";
import AddCarDialog from "@/components/dealership/AddCarDialog";
import EditCarDialog from "@/components/dealership/EditCarDialog";
import { Car, carService } from "@/services/carService";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, LogOut } from "lucide-react";

const DealershipAdmin = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState<any>({});
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const { signOut } = useAuth();

  useEffect(() => {
    loadCars();
  }, []);

  useEffect(() => {
    // Apply filters client-side for quick filtering
    if (cars.length) {
      applyFilters();
    }
  }, [filters, cars]);

  const loadCars = async () => {
    try {
      setLoading(true);
      const loadedCars = await carService.getCars();
      setCars(loadedCars);
      setFilteredCars(loadedCars);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to load cars",
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...cars];

    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      result = result.filter(
        (car) =>
          car.make.toLowerCase().includes(term) ||
          car.model.toLowerCase().includes(term) ||
          car.year.toString().includes(term)
      );
    }

    if (filters.status && filters.status !== "All") {
      result = result.filter((car) => car.status === filters.status);
    }

    if (filters.make) {
      result = result.filter((car) => car.make === filters.make);
    }

    setFilteredCars(result);
  };

  const handleAddCar = async (newCar: any) => {
    try {
      await carService.createCar(newCar);
      toast({
        title: "Success",
        description: "Car added successfully",
      });
      loadCars();
      setIsAddDialogOpen(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to add car",
      });
    }
  };

  const handleEditCar = async (id: string, updatedCar: Partial<Car>) => {
    try {
      await carService.updateCar(id, updatedCar);
      toast({
        title: "Success",
        description: "Car updated successfully",
      });
      loadCars();
      setIsEditDialogOpen(false);
      setSelectedCar(null);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update car",
      });
    }
  };

  const handleDeleteCar = async (id: string, imageUrls?: string[]) => {
    if (!window.confirm("Are you sure you want to delete this car?")) {
      return;
    }

    try {
      // Delete the car images first if they exist
      if (imageUrls && imageUrls.length > 0) {
        await carService.deleteCarImages(imageUrls);
      } else if (selectedCar?.image_url) {
        await carService.deleteCarImage(selectedCar.image_url);
      }
      
      await carService.deleteCar(id);
      toast({
        title: "Success",
        description: "Car deleted successfully",
      });
      loadCars();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete car",
      });
    }
  };

  const openEditDialog = (car: Car) => {
    setSelectedCar(car);
    setIsEditDialogOpen(true);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <AdminLayout>
      {/* Admin Header */}
      <header className="bg-dealership-primary text-white shadow">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/671a3e7f-2f7e-4017-820a-8f9ade87a7f5.png" 
              alt="We Do Cheapies" 
              className="h-10 mr-3" 
              loading="eager"
            />
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
          </div>
          <Button variant="outline" className="text-white bg-dealership-primary/80 border-white hover:bg-dealership-primary/80" onClick={handleSignOut}>
            <LogOut className="h-5 w-5 mr-1" />
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-700">Total Inventory</h3>
            <p className="text-3xl font-bold mt-2">{cars.length}</p>
            <p className="text-sm text-gray-500 mt-1">Vehicles in stock</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-700">Available</h3>
            <p className="text-3xl font-bold mt-2">
              {cars.filter((car) => car.status === "Available").length}
            </p>
            <p className="text-sm text-gray-500 mt-1">Vehicles for sale</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-700">Sold</h3>
            <p className="text-3xl font-bold mt-2">
              {cars.filter((car) => car.status === "Sold").length}
            </p>
            <p className="text-sm text-gray-500 mt-1">Vehicles sold</p>
          </div>
        </div>

        {/* Car Management */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <h2 className="text-xl font-semibold">Car Inventory</h2>
              <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0">
                <Button 
                  className="bg-dealership-secondary text-dealership-primary hover:bg-dealership-secondary/90"
                  onClick={() => setIsAddDialogOpen(true)}
                >
                  <Plus className="h-5 w-5 mr-1" />
                  Add New Car
                </Button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="p-4 border-b border-gray-200">
            <CarFilters onFilterChange={setFilters} makes={Array.from(new Set(cars.map(car => car.make)))} />
          </div>

          {/* Car Table */}
          <CarInventoryTable 
            cars={filteredCars} 
            loading={loading} 
            onEdit={openEditDialog} 
            onDelete={handleDeleteCar} 
          />
        </div>
      </div>

      {/* Add Car Dialog */}
      <AddCarDialog 
        isOpen={isAddDialogOpen} 
        onClose={() => setIsAddDialogOpen(false)} 
        onSubmit={handleAddCar} 
      />

      {/* Edit Car Dialog */}
      {selectedCar && (
        <EditCarDialog 
          isOpen={isEditDialogOpen} 
          onClose={() => {
            setIsEditDialogOpen(false);
            setSelectedCar(null);
          }} 
          car={selectedCar}
          onSubmit={(updatedCar) => handleEditCar(selectedCar.id, updatedCar)} 
        />
      )}
    </AdminLayout>
  );
};

export default DealershipAdmin;
