
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Vehicle {
  id: string;
  customer_id: string;
  make?: string;
  model?: string;
  year?: number;
  color?: string;
  registration: string;
  is_primary: boolean;
  created_at?: string;
  updated_at?: string;
}

export const vehicleService = {
  // Get all vehicles for a customer
  async getCustomerVehicles(customerId: string): Promise<Vehicle[]> {
    try {
      console.log('Fetching vehicles for customer:', customerId);
      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .eq("customer_id", customerId)
        .order("is_primary", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) {
        console.error('Error fetching customer vehicles:', error);
        throw error;
      }
      
      console.log('Customer vehicles fetched successfully:', data);
      return data || [];
    } catch (error: any) {
      console.error('Error in getCustomerVehicles:', error);
      toast({
        variant: "destructive",
        description: `Error fetching vehicles: ${error.message}`
      });
      return [];
    }
  },

  // Add a new vehicle
  async addVehicle(vehicle: {
    customer_id: string;
    make?: string;
    model?: string;
    year?: number;
    color?: string;
    registration: string;
    is_primary?: boolean;
  }): Promise<Vehicle | null> {
    try {
      console.log('Adding vehicle:', vehicle);
      
      // If this is being set as primary, unset other primary vehicles first
      if (vehicle.is_primary) {
        await this.unsetPrimaryVehicles(vehicle.customer_id);
      }
      
      const { data, error } = await supabase
        .from("vehicles")
        .insert(vehicle)
        .select()
        .single();

      if (error) {
        console.error('Error adding vehicle:', error);
        throw error;
      }
      
      console.log('Vehicle added successfully:', data);
      toast({
        description: "Vehicle added successfully"
      });
      
      return data;
    } catch (error: any) {
      console.error('Error in addVehicle:', error);
      toast({
        variant: "destructive",
        description: `Error adding vehicle: ${error.message}`
      });
      return null;
    }
  },

  // Update vehicle
  async updateVehicle(vehicle: {
    id: string;
    make?: string;
    model?: string;
    year?: number;
    color?: string;
    registration: string;
    is_primary?: boolean;
  }): Promise<Vehicle | null> {
    try {
      console.log('Updating vehicle:', vehicle);
      
      const { id, ...updateData } = vehicle;
      
      // If this is being set as primary, unset other primary vehicles first
      if (vehicle.is_primary) {
        const currentVehicle = await this.getVehicleById(id);
        if (currentVehicle) {
          await this.unsetPrimaryVehicles(currentVehicle.customer_id, id);
        }
      }
      
      const { data, error } = await supabase
        .from("vehicles")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error('Error updating vehicle:', error);
        throw error;
      }
      
      console.log('Vehicle updated successfully:', data);
      toast({
        description: "Vehicle updated successfully"
      });
      
      return data;
    } catch (error: any) {
      console.error('Error in updateVehicle:', error);
      toast({
        variant: "destructive",
        description: `Error updating vehicle: ${error.message}`
      });
      return null;
    }
  },

  // Delete vehicle
  async deleteVehicle(id: string): Promise<boolean> {
    try {
      console.log('Deleting vehicle:', id);
      
      const { error } = await supabase
        .from("vehicles")
        .delete()
        .eq("id", id);

      if (error) {
        console.error('Error deleting vehicle:', error);
        throw error;
      }
      
      console.log('Vehicle deleted successfully');
      toast({
        description: "Vehicle deleted successfully"
      });
      
      return true;
    } catch (error: any) {
      console.error('Error in deleteVehicle:', error);
      toast({
        variant: "destructive",
        description: `Error deleting vehicle: ${error.message}`
      });
      return false;
    }
  },

  // Get vehicle by ID
  async getVehicleById(id: string): Promise<Vehicle | null> {
    try {
      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error in getVehicleById:', error);
      return null;
    }
  },

  // Set vehicle as primary
  async setPrimaryVehicle(vehicleId: string, customerId: string): Promise<boolean> {
    try {
      // First, unset all primary vehicles for this customer
      await this.unsetPrimaryVehicles(customerId);
      
      // Then set this vehicle as primary
      const { error } = await supabase
        .from("vehicles")
        .update({ is_primary: true })
        .eq("id", vehicleId);

      if (error) throw error;
      
      toast({
        description: "Primary vehicle updated"
      });
      
      return true;
    } catch (error: any) {
      console.error('Error setting primary vehicle:', error);
      toast({
        variant: "destructive",
        description: `Error setting primary vehicle: ${error.message}`
      });
      return false;
    }
  },

  // Helper function to unset primary vehicles
  async unsetPrimaryVehicles(customerId: string, exceptId?: string): Promise<void> {
    try {
      let query = supabase
        .from("vehicles")
        .update({ is_primary: false })
        .eq("customer_id", customerId);
      
      if (exceptId) {
        query = query.neq("id", exceptId);
      }
      
      const { error } = await query;
      if (error) throw error;
    } catch (error: any) {
      console.error('Error unsetting primary vehicles:', error);
      // Don't show toast for this helper function
    }
  }
};
