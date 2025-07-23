// Fix TypeScript errors by ensuring all required properties are present in function calls
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2, ArrowLeft, Plus, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

// WashType interface
interface WashType {
  id: string;
  name: string;
  description: string;
  price_small_car: number;
  price_bakkie_suv: number;
  created_at?: string;
  updated_at?: string;
}

// WashType service
const washTypeService = {
  async getWashTypes(): Promise<WashType[]> {
    const { data, error } = await supabase
      .from('wash_types')
      .select('*')
      .order('name');
    
    if (error) {
      console.error("Error fetching wash types:", error);
      throw error;
    }
    
    return data || [];
  },
  
  async addWashType(washType: Omit<WashType, 'id' | 'created_at' | 'updated_at'>): Promise<WashType> {
    const { data, error } = await supabase
      .from('wash_types')
      .insert([washType])
      .select()
      .single();
    
    if (error) {
      console.error("Error adding wash type:", error);
      throw error;
    }
    
    return data as WashType;
  },
  
  async updateWashType(washType: WashType): Promise<WashType> {
    const { data, error } = await supabase
      .from('wash_types')
      .update({
        name: washType.name,
        description: washType.description,
        price_small_car: washType.price_small_car,
        price_bakkie_suv: washType.price_bakkie_suv
      })
      .eq('id', washType.id)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating wash type:", error);
      throw error;
    }
    
    return data as WashType;
  },
  
  async deleteWashType(id: string): Promise<void> {
    const { error } = await supabase
      .from('wash_types')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Error deleting wash type:", error);
      throw error;
    }
  }
};

// Main component
const WashTypeManagement: React.FC = () => {
  const { user } = useAuth();
  const [washTypes, setWashTypes] = useState<WashType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [selectedWashType, setSelectedWashType] = useState<WashType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formData, setFormData] = useState<Omit<WashType, 'id' | 'created_at' | 'updated_at'>>({
    name: '',
    description: '',
    price_small_car: 0,
    price_bakkie_suv: 0
  });

  // Fetch wash types on component mount
  useEffect(() => {
    const loadWashTypes = async () => {
      try {
        setIsLoading(true);
        const data = await washTypeService.getWashTypes();
        setWashTypes(data);
      } catch (error) {
        toast({
          variant: "destructive",
          description: "Failed to load wash types"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadWashTypes();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('price') ? parseFloat(value) || 0 : value
    }));
  };

  const handleEdit = (washType: WashType) => {
    setSelectedWashType(washType);
    setFormData({
      name: washType.name,
      description: washType.description,
      price_small_car: washType.price_small_car,
      price_bakkie_suv: washType.price_bakkie_suv
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (washType: WashType) => {
    setSelectedWashType(washType);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.description || formData.price_small_car <= 0 || formData.price_bakkie_suv <= 0) {
      toast({
        variant: "destructive",
        description: "Please fill in all fields with valid values"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      if (selectedWashType) {
        // Update
        const updatedWashType = await washTypeService.updateWashType({
          id: selectedWashType.id,
          name: formData.name,
          description: formData.description,
          price_small_car: formData.price_small_car,
          price_bakkie_suv: formData.price_bakkie_suv
        });
        
        setWashTypes(prev => prev.map(wt => wt.id === updatedWashType.id ? updatedWashType : wt));
        
        toast({
          description: `Wash type "${updatedWashType.name}" has been updated`
        });
      } else {
        // Create
        const newWashType = await washTypeService.addWashType({
          name: formData.name,
          description: formData.description,
          price_small_car: formData.price_small_car,
          price_bakkie_suv: formData.price_bakkie_suv
        });
        
        setWashTypes(prev => [...prev, newWashType]);
        
        toast({
          description: `New wash type "${newWashType.name}" has been added`
        });
      }
      
      // Reset and close dialog
      resetForm();
      setIsDialogOpen(false);
      
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: selectedWashType ? "Failed to update wash type" : "Failed to add wash type"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedWashType) return;
    
    try {
      setIsSubmitting(true);
      await washTypeService.deleteWashType(selectedWashType.id);
      setWashTypes(prev => prev.filter(wt => wt.id !== selectedWashType.id));
      
      toast({
        description: `Wash type "${selectedWashType.name}" has been deleted`
      });
      
      setIsDeleteDialogOpen(false);
      setSelectedWashType(null);
      
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to delete wash type. It may be in use by existing wash records."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price_small_car: 0,
      price_bakkie_suv: 0
    });
    setSelectedWashType(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0 flex items-center">
            <Link to="/car-wash/admin" className="mr-4">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Admin
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Wash Types Management</h1>
          </div>
          <Button 
            onClick={() => {
              resetForm();
              setIsDialogOpen(true);
            }}
            className="bg-carwash-secondary text-carwash-primary hover:bg-carwash-secondary/90"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add New Wash Type
          </Button>
        </div>

        {/* Wash Types Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">
              <Loader2 className="h-8 w-8 mx-auto text-carwash-secondary animate-spin" />
              <p className="mt-4 text-gray-500">Loading wash types...</p>
            </div>
          ) : (
            <Table>
              <TableCaption>List of car wash packages and their prices</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Small Car Price</TableHead>
                  <TableHead className="text-right">Bakkie/SUV Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {washTypes.length > 0 ? (
                  washTypes.map((washType) => (
                    <TableRow key={washType.id}>
                      <TableCell className="font-medium">{washType.name}</TableCell>
                      <TableCell className="max-w-[300px] truncate">{washType.description}</TableCell>
                      <TableCell className="text-right">R{washType.price_small_car.toFixed(2)}</TableCell>
                      <TableCell className="text-right">R{washType.price_bakkie_suv.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(washType)}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDelete(washType)}>
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No wash types found. Add your first wash type!
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {selectedWashType ? `Edit Wash Type: ${selectedWashType.name}` : 'Add New Wash Type'}
            </DialogTitle>
            <DialogDescription>
              {selectedWashType ? 'Update the details of this wash type' : 'Enter the details for a new wash type'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Wash Type Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Basic Wash"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe what's included in this wash type..."
                  required
                  className="min-h-[100px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price_small_car">Small Car Price (R)</Label>
                  <Input
                    id="price_small_car"
                    name="price_small_car"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price_small_car}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price_bakkie_suv">Bakkie/SUV Price (R)</Label>
                  <Input
                    id="price_bakkie_suv"
                    name="price_bakkie_suv"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price_bakkie_suv}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  resetForm();
                  setIsDialogOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting} 
                className="bg-carwash-secondary hover:bg-carwash-secondary/90 text-carwash-primary"
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {selectedWashType ? 'Save Changes' : 'Add Wash Type'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Wash Type</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedWashType?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={confirmDelete}
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WashTypeManagement;
