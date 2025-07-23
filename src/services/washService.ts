import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface WashType {
  id: string;
  name: string;
  description: string;
  price_small_car: number;
  price_bakkie_suv: number;
  created_at?: string;
  updated_at?: string;
}

export interface Vehicle {
  id: string;
  make: string | null;
  model: string | null;
  registration: string;
  color: string | null;
  year: number | null;
}

export interface Wash {
  id: string;
  customer_id: string;
  wash_type_id: string;
  car_type: 'small' | 'bakkie_suv';
  price: number;
  performed_at: string;
  was_free: boolean;
  added_by?: string;
  created_at?: string;
  updated_at?: string;
  vehicle_id?: string;
  wash_type?: WashType;
  vehicle?: Vehicle;
}

export const washService = {
  // Get all wash types
  async getWashTypes(): Promise<WashType[]> {
    try {
      console.log('Fetching wash types...');
      const { data, error } = await supabase
        .from("wash_types")
        .select("*")
        .order("price_small_car");

      if (error) {
        console.error('Error fetching wash types:', error);
        toast({
          variant: "destructive",
          description: `Error fetching wash types: ${error.message}`
        });
        return [];
      }
      
      console.log('Wash types fetched successfully:', data);
      return data || [];
    } catch (error: any) {
      console.error('Error in getWashTypes:', error);
      toast({
        variant: "destructive",
        description: `Error fetching wash types: ${error.message}`
      });
      return [];
    }
  },

  // Add a new wash type
  async addWashType(washType: {
    name: string,
    description: string,
    price_small_car: number,
    price_bakkie_suv: number
  }): Promise<WashType | null> {
    try {
      const { data, error } = await supabase
        .from("wash_types")
        .insert(washType)
        .select()
        .single();

      if (error) throw error;
      
      toast({
        description: "Wash type added successfully"
      });
      
      return data;
    } catch (error: any) {
      console.error('Error adding wash type:', error);
      toast({
        variant: "destructive",
        description: `Error adding wash type: ${error.message}`
      });
      return null;
    }
  },

  // Update existing wash type
  async updateWashType(washType: {
    id: string,
    name: string,
    description: string,
    price_small_car: number,
    price_bakkie_suv: number
  }): Promise<WashType | null> {
    try {
      const { id, ...updateData } = washType;
      
      const { data, error } = await supabase
        .from("wash_types")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      
      toast({
        description: "Wash type updated successfully"
      });
      
      return data;
    } catch (error: any) {
      console.error('Error updating wash type:', error);
      toast({
        variant: "destructive",
        description: `Error updating wash type: ${error.message}`
      });
      return null;
    }
  },

  // Delete a wash type
  async deleteWashType(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("wash_types")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      toast({
        description: "Wash type deleted successfully"
      });
      
      return true;
    } catch (error: any) {
      console.error('Error deleting wash type:', error);
      toast({
        variant: "destructive",
        description: `Error deleting wash type: ${error.message}`
      });
      return false;
    }
  },

  // Get washes for a specific customer
  async getCustomerWashes(customerId: string): Promise<Wash[]> {
    try {
      console.log('Fetching washes for customer:', customerId);
      const { data, error } = await supabase
        .from("washes")
        .select(`
          *,
          wash_type:wash_type_id(id, name, description, price_small_car, price_bakkie_suv),
          vehicle:vehicle_id(id, make, model, registration, color, year)
        `)
        .eq("customer_id", customerId)
        .order("performed_at", { ascending: false });

      if (error) {
        console.error('Error fetching customer washes:', error);
        throw error;
      }
      
      console.log('Customer washes fetched successfully:', data);
      
      // Ensure car_type is properly typed
      return data.map(wash => ({
        ...wash,
        car_type: wash.car_type as 'small' | 'bakkie_suv'
      })) || [];
    } catch (error: any) {
      console.error('Error in getCustomerWashes:', error);
      toast({
        variant: "destructive",
        description: `Error fetching customer washes: ${error.message}`
      });
      return [];
    }
  },

  // Add a new wash for a customer
  async addWash(wash: {
    customer_id: string,
    wash_type_id: string,
    car_type: 'small' | 'bakkie_suv',
    price: number,
    was_free: boolean,
    vehicle_id?: string
  }): Promise<Wash | null> {
    try {
      // Validate input parameters
      if (!wash.customer_id) {
        console.error('Missing customer_id in addWash');
        throw new Error('Customer ID is required');
      }
      if (!wash.wash_type_id) {
        console.error('Missing wash_type_id in addWash');
        throw new Error('Wash type ID is required');
      }
      if (!wash.car_type) {
        console.error('Missing car_type in addWash');
        throw new Error('Car type is required');
      }
      if (typeof wash.price !== 'number') {
        console.error('Invalid price in addWash:', wash.price);
        throw new Error('Valid price is required');
      }

      console.log('Starting addWash process with data:', JSON.stringify(wash, null, 2));
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error('Error getting user:', userError);
        throw userError;
      }
      console.log('User authenticated:', userData.user.id);

      console.log('Inserting wash record...');
      const { data, error } = await supabase
        .from("washes")
        .insert({
          customer_id: wash.customer_id,
          wash_type_id: wash.wash_type_id,
          car_type: wash.car_type,
          price: wash.price,
          was_free: wash.was_free,
          vehicle_id: wash.vehicle_id,
          performed_at: new Date().toISOString(),
          added_by: userData.user.id
        })
        .select(`
          *,
          wash_type:wash_type_id(id, name, description, price_small_car, price_bakkie_suv),
          vehicle:vehicle_id(id, make, model, registration, color, year)
        `)
        .single();

      if (error) {
        console.error('Error inserting wash:', error);
        throw error;
      }

      console.log('Wash record inserted successfully:', data);

      // Only update customer wash count if it's NOT a free wash
      if (!wash.was_free) {
        console.log('Updating customer wash count for non-free wash');
        
        console.log('Calling increment_counter RPC...');
        const { data: incrementResult, error: rpcError } = await supabase.rpc('increment_counter', {
          row_id: wash.customer_id
        });
        
        if (rpcError) {
          console.error('Error incrementing wash count:', rpcError);
          throw rpcError;
        }
        console.log('Increment counter RPC completed successfully');
        
        console.log('Updating customer last visit timestamp...');
        const { error: updateError } = await supabase
          .from("customers")
          .update({
            last_visit: new Date().toISOString()
          })
          .eq("id", wash.customer_id);

        if (updateError) {
          console.error('Error updating customer last visit:', updateError);
          throw updateError;
        }
        console.log('Customer last visit updated successfully');
      } else {
        console.log('Processing free wash...');
        const { error: updateVisitError } = await supabase
          .from("customers")
          .update({
            last_visit: new Date().toISOString(),
            wash_count: 0,
            last_redeemed_at: new Date().toISOString()
          })
          .eq("id", wash.customer_id);

        if (updateVisitError) {
          console.error('Error updating customer after free wash:', updateVisitError);
          throw updateVisitError;
        }
        console.log('Customer updated successfully after free wash');
      }

      toast({
        description: "Wash added successfully"
      });

      return {
        ...data,
        car_type: data.car_type as 'small' | 'bakkie_suv'
      };
    } catch (error: any) {
      console.error('Error in addWash:', error);
      toast({
        variant: "destructive",
        description: `Error adding wash: ${error.message}`
      });
      return null;
    }
  },

  // Get a wash by ID with joined wash type and vehicle
  async getWashById(id: string): Promise<Wash | null> {
    try {
      console.log('Fetching wash by ID:', id);
      const { data, error } = await supabase
        .from("washes")
        .select(`
          *,
          wash_type:wash_type_id(id, name, description, price_small_car, price_bakkie_suv),
          vehicle:vehicle_id(id, make, model, registration, color, year)
        `)
        .eq("id", id)
        .single();

      if (error) {
        console.error('Error fetching wash by ID:', error);
        throw error;
      }
      
      console.log('Wash fetched successfully:', data);
      
      // Ensure car_type is properly typed
      return {
        ...data,
        car_type: data.car_type as 'small' | 'bakkie_suv'
      };
    } catch (error: any) {
      console.error('Error in getWashById:', error);
      toast({
        variant: "destructive",
        description: `Error fetching wash: ${error.message}`
      });
      return null;
    }
  },
};
