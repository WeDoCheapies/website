
import React, { useState, useEffect } from "react";
import { Car, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Vehicle, vehicleService } from "@/services/vehicleService";

interface VehicleSelectProps {
  customerId: string;
  selectedVehicleId?: string;
  onSelect: (vehicleId: string) => void;
  isLoading?: boolean;
}

const VehicleSelect: React.FC<VehicleSelectProps> = ({
  customerId,
  selectedVehicleId,
  onSelect,
  isLoading = false,
}) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(true);

  useEffect(() => {
    loadVehicles();
  }, [customerId]);

  const loadVehicles = async () => {
    setIsLoadingVehicles(true);
    try {
      const data = await vehicleService.getCustomerVehicles(customerId);
      setVehicles(data);
      
      // Auto-select primary vehicle if no selection made
      if (!selectedVehicleId && data.length > 0) {
        const primaryVehicle = data.find(v => v.is_primary) || data[0];
        onSelect(primaryVehicle.id);
      }
    } finally {
      setIsLoadingVehicles(false);
    }
  };

  if (isLoadingVehicles) {
    return (
      <div className="flex flex-col items-center py-6">
        <Loader2 className="h-6 w-6 animate-spin text-carwash-secondary mb-2" />
        <p className="text-sm text-muted-foreground">Loading vehicles...</p>
      </div>
    );
  }

  if (vehicles.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center py-8">
          <Car className="h-8 w-8 text-gray-400 mb-2" />
          <p className="text-gray-500 text-center text-sm">No vehicles found</p>
          <p className="text-xs text-gray-400 text-center mt-1">
            Please add a vehicle first
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-gray-700">Select Vehicle</h4>
      <div className="space-y-2">
        {vehicles.map((vehicle) => (
          <Card
            key={vehicle.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedVehicleId === vehicle.id
                ? "border-carwash-secondary bg-carwash-secondary/10"
                : "border-gray-200 hover:border-carwash-secondary/50"
            }`}
            onClick={() => onSelect(vehicle.id)}
          >
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h5 className="text-sm font-medium">
                      {vehicle.make && vehicle.model 
                        ? `${vehicle.make} ${vehicle.model}` 
                        : vehicle.registration}
                    </h5>
                    {vehicle.is_primary && (
                      <Badge variant="secondary" className="text-xs">
                        Primary
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-gray-600">
                    <p>Registration: {vehicle.registration}</p>
                    {vehicle.year && vehicle.color && (
                      <p>{vehicle.year} • {vehicle.color}</p>
                    )}
                  </div>
                </div>
                <div className="ml-3">
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    selectedVehicleId === vehicle.id
                      ? "border-carwash-secondary bg-carwash-secondary"
                      : "border-gray-300"
                  }`}>
                    {selectedVehicleId === vehicle.id && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VehicleSelect;
