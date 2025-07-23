
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  car_registration?: string;
  wash_count: number;
  last_visit?: string;
  last_redeemed_at?: string;
  free_wash?: boolean; // derived from wash_count
  created_at?: string;
  updated_at?: string;
  created_by?: string;
}

export const customerService = {
  // Get all customers
  async getCustomers(): Promise<Customer[]> {
    try {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .order("name");

      if (error) throw error;

      // Derive free_wash property based on wash_count
      return data.map(customer => ({
        ...customer,
        free_wash: customer.wash_count >= 6
      }));
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: `Error fetching customers: ${error.message}`
      });
      return [];
    }
  },

  // Add new customer
  async addCustomer(customer: Omit<Customer, 'id' | 'wash_count' | 'free_wash' | 'created_at' | 'updated_at' | 'created_by'>): Promise<Customer | null> {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      
      const { data, error } = await supabase
        .from("customers")
        .insert({
          name: customer.name,
          phone: customer.phone,
          email: customer.email,
          car_registration: customer.car_registration,
          wash_count: 0,
          last_visit: new Date().toISOString(),
          created_by: userData.user.id
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        description: "Customer added successfully"
      });

      return { ...data, free_wash: false };
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: `Error adding customer: ${error.message}`
      });
      return null;
    }
  },

  // Update customer
  async updateCustomer(customer: Partial<Customer> & { id: string }): Promise<Customer | null> {
    try {
      const { data, error } = await supabase
        .from("customers")
        .update({
          name: customer.name,
          phone: customer.phone,
          email: customer.email,
          car_registration: customer.car_registration
        })
        .eq("id", customer.id)
        .select()
        .single();

      if (error) throw error;

      toast({
        description: "Customer updated successfully"
      });

      return { ...data, free_wash: data.wash_count >= 6 };
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: `Error updating customer: ${error.message}`
      });
      return null;
    }
  },

  // Add wash
  async addWash(id: string): Promise<Customer | null> {
    try {
      // Get current customer to check wash count
      const { data: currentCustomer, error: fetchError } = await supabase
        .from("customers")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;

      const newWashCount = currentCustomer.wash_count + 1;
      
      const { data, error } = await supabase
        .from("customers")
        .update({
          wash_count: newWashCount,
          last_visit: new Date().toISOString()
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      toast({
        description: "Wash added successfully"
      });

      return { ...data, free_wash: data.wash_count >= 6 };
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: `Error adding wash: ${error.message}`
      });
      return null;
    }
  },

  // Remove wash
  async removeWash(id: string): Promise<Customer | null> {
    try {
      // Get current customer to check wash count
      const { data: currentCustomer, error: fetchError } = await supabase
        .from("customers")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;

      // Don't allow wash count to go below 0
      if (currentCustomer.wash_count <= 0) {
        toast({
          variant: "destructive",
          description: "Wash count is already at 0"
        });
        return currentCustomer;
      }

      const newWashCount = currentCustomer.wash_count - 1;
      
      const { data, error } = await supabase
        .from("customers")
        .update({
          wash_count: newWashCount,
          last_visit: new Date().toISOString()
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      toast({
        description: "Wash removed successfully"
      });

      return { ...data, free_wash: data.wash_count >= 6 };
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: `Error removing wash: ${error.message}`
      });
      return null;
    }
  },

  // Redeem free wash
  async redeemFreeWash(id: string): Promise<Customer | null> {
    try {
      // Get current customer to check wash count
      const { data: currentCustomer, error: fetchError } = await supabase
        .from("customers")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;

      // Validate they have exactly 6 washes
      if (currentCustomer.wash_count < 6) {
        toast({
          variant: "destructive",
          description: "Customer does not have enough washes to redeem a free wash"
        });
        return null;
      }

      // Reset wash count and record redemption
      const { data, error } = await supabase
        .from("customers")
        .update({
          wash_count: 0,
          last_redeemed_at: new Date().toISOString(),
          last_visit: new Date().toISOString()
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      toast({
        description: "Free wash redeemed successfully"
      });

      return { ...data, free_wash: false };
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: `Error redeeming free wash: ${error.message}`
      });
      return null;
    }
  },

  // Delete customer
  async deleteCustomer(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("customers")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        description: "Customer deleted successfully"
      });

      return true;
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: `Error deleting customer: ${error.message}`
      });
      return false;
    }
  }
};
