
import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Car, Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import VehicleFormDialog from "./VehicleFormDialog";
import { Vehicle, vehicleService } from "@/services/vehicleService";
import { toast } from "@/hooks/use-toast";

interface VehicleManagementProps {
  customerId: string;
  onVehicleChange?: () => void;
}

const VehicleManagement: React.FC<VehicleManagementProps> = ({
  customerId,
  onVehicleChange,
}) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadVehicles();
  }, [customerId]);

  const loadVehicles = async () => {
    setIsLoading(true);
    try {
      const data = await vehicleService.getCustomerVehicles(customerId);
      setVehicles(data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddVehicle = async (vehicleData: any) => {
    setIsProcessing(true);
    try {
      const newVehicle = await vehicleService.addVehicle({
        customer_id: customerId,
        ...vehicleData,
        is_primary: vehicles.length === 0 || vehicleData.is_primary, // First vehicle is always primary
      });
      
      if (newVehicle) {
        await loadVehicles();
        setIsAddDialogOpen(false);
        if (onVehicleChange) onVehicleChange();
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEditVehicle = async (vehicleData: any) => {
    if (!selectedVehicle) return;
    
    setIsProcessing(true);
    try {
      const updatedVehicle = await vehicleService.updateVehicle({
        id: selectedVehicle.id,
        ...vehicleData,
      });
      
      if (updatedVehicle) {
        await loadVehicles();
        setIsEditDialogOpen(false);
        setSelectedVehicle(null);
        if (onVehicleChange) onVehicleChange();
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteVehicle = async () => {
    if (!vehicleToDelete) return;
    
    setIsDeleting(true);
    try {
      const success = await vehicleService.deleteVehicle(vehicleToDelete.id);
      if (success) {
        await loadVehicles();
        setVehicleToDelete(null);
        if (onVehicleChange) onVehicleChange();
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSetPrimary = async (vehicle: Vehicle) => {
    if (vehicle.is_primary) return;
    
    const success = await vehicleService.setPrimaryVehicle(vehicle.id, customerId);
    if (success) {
      await loadVehicles();
      if (onVehicleChange) onVehicleChange();
    }
  };

  const openEditDialog = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsEditDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center py-6">
        <Loader2 className="h-8 w-8 animate-spin text-carwash-secondary mb-2" />
        <p className="text-sm text-muted-foreground">Loading vehicles...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Customer Vehicles</h3>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-carwash-secondary text-carwash-primary hover:bg-carwash-secondary/90"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Vehicle
        </Button>
      </div>

      {vehicles.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center py-8">
            <Car className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 text-center">No vehicles added yet</p>
            <p className="text-sm text-gray-400 text-center mt-1">
              Add a vehicle to get started
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {vehicles.map((vehicle) => (
            <Card key={vehicle.id} className={vehicle.is_primary ? "border-carwash-secondary" : ""}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">
                        {vehicle.make && vehicle.model 
                          ? `${vehicle.make} ${vehicle.model}` 
                          : vehicle.registration}
                      </h4>
                      {vehicle.is_primary && (
                        <Badge className="bg-carwash-secondary text-carwash-primary">
                          <Star className="h-3 w-3 mr-1" />
                          Primary
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>Registration:</strong> {vehicle.registration}</p>
                      {vehicle.year && <p><strong>Year:</strong> {vehicle.year}</p>}
                      {vehicle.color && <p><strong>Color:</strong> {vehicle.color}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!vehicle.is_primary && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetPrimary(vehicle)}
                      >
                        <Star className="h-3 w-3 mr-1" />
                        Set Primary
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(vehicle)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setVehicleToDelete(vehicle)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Vehicle Dialog */}
      <VehicleFormDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={handleAddVehicle}
        isSubmitting={isProcessing}
        isFirstVehicle={vehicles.length === 0}
      />

      {/* Edit Vehicle Dialog */}
      <VehicleFormDialog
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setSelectedVehicle(null);
        }}
        onSubmit={handleEditVehicle}
        initialData={selectedVehicle}
        isEditing={true}
        isSubmitting={isProcessing}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!vehicleToDelete} onOpenChange={() => setVehicleToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Vehicle</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this vehicle? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteVehicle}
              className="bg-red-600 text-white hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Vehicle"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default VehicleManagement;
