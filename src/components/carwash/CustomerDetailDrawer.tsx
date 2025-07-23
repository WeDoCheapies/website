import React, { useState, useEffect, useCallback } from "react";
import { Edit, Droplet, X, Loader2, Minus, Trash2, Check, Calendar, Clock, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import WashTypeSelect from "./WashTypeSelect";
import WashHistoryTable from "./WashHistoryTable";
import WashReceiptDialog from "./WashReceiptDialog";
import VehicleManagement from "./VehicleManagement";
import VehicleSelect from "./VehicleSelect";
import { washService, WashType } from "@/services/washService";
import { toast } from "@/hooks/use-toast";
import { debounce } from "@/lib/utils";

interface CustomerDetailDrawerProps {
  customer: {
    id: string;
    name: string;
    phone: string;
    email: string;
    wash_count: number;
    last_visit?: string;
    free_wash: boolean;
  };
  open: boolean;
  onClose: () => void;
  onEdit: () => void;
  onAddWash: () => void;
  onRemoveWash?: () => void;
  onRedeemFreeWash?: () => void;
  onDeleteCustomer?: () => void;
  isProcessing?: boolean;
}

const CustomerDetailDrawer: React.FC<CustomerDetailDrawerProps> = ({
  customer,
  open,
  onClose,
  onEdit,
  onAddWash,
  onRemoveWash,
  onRedeemFreeWash,
  onDeleteCustomer,
  isProcessing = false,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [washTypes, setWashTypes] = useState<WashType[]>([]);
  const [isLoadingWashTypes, setIsLoadingWashTypes] = useState(false);
  const [selectedWashTypeId, setSelectedWashTypeId] = useState<string>('');
  const [selectedCarType, setSelectedCarType] = useState<'small' | 'bakkie_suv'>('small');
  const [selectedPrice, setSelectedPrice] = useState<number>(0);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
  const [isLoadingWashes, setIsLoadingWashes] = useState(false);
  const [washes, setWashes] = useState<any[]>([]);
  const [receiptWashId, setReceiptWashId] = useState<string | undefined>();
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  const [isSubmittingWash, setIsSubmittingWash] = useState(false);
  const [isRedeemingFreeWash, setIsRedeemingFreeWash] = useState(false);
  const [useModal, setUseModal] = useState(true);

  useEffect(() => {
    if (open) {
      loadWashTypes();
      loadWashHistory();
      // Reset selected wash type when opening the drawer
      setSelectedWashTypeId('');
      setSelectedPrice(0);
      setSelectedVehicleId('');
    }
  }, [open, customer.id]);

  const loadWashTypes = async () => {
    if (!open) return;
    
    try {
      setIsLoadingWashTypes(true);
      console.log('Fetching wash types...');
      const data = await washService.getWashTypes();
      console.log('Loaded wash types:', data);
      setWashTypes(data || []);
    } catch (error) {
      console.error('Error loading wash types:', error);
      toast({
        variant: "destructive",
        description: "Failed to load wash types. Please try again."
      });
      setWashTypes([]);
    } finally {
      setIsLoadingWashTypes(false);
    }
  };

  const loadWashHistory = async () => {
    if (!customer.id || !open) return;
    
    setIsLoadingWashes(true);
    try {
      const data = await washService.getCustomerWashes(customer.id);
      setWashes(data || []);
    } catch (error) {
      console.error('Error loading wash history:', error);
      toast({
        variant: "destructive",
        description: "Failed to load wash history. Please try again."
      });
      setWashes([]);
    } finally {
      setIsLoadingWashes(false);
    }
  };

  const handleDeleteRequest = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    setIsDeleteDialogOpen(false);
    if (onDeleteCustomer) {
      onDeleteCustomer();
    }
  };

  const handleWashTypeSelect = (washTypeId: string, carType: 'small' | 'bakkie_suv', price: number) => {
    console.log('Selected wash type:', washTypeId, carType, price);
    setSelectedWashTypeId(washTypeId);
    setSelectedCarType(carType);
    setSelectedPrice(price);
  };

  const handleVehicleSelect = (vehicleId: string) => {
    console.log('Selected vehicle:', vehicleId);
    setSelectedVehicleId(vehicleId);
  };

  // Use debounce to prevent multiple submissions
  const debouncedAddWash = useCallback(
    debounce(async (e?: React.FormEvent) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      
      if (!selectedWashTypeId) {
        toast({
          variant: "destructive",
          description: "Please select a wash type first."
        });
        return;
      }

      try {
        setIsSubmittingWash(true);
        
        console.log('Adding wash with:', {
          customer_id: customer.id,
          wash_type_id: selectedWashTypeId,
          car_type: selectedCarType,
          price: selectedPrice,
          was_free: false,
          vehicle_id: selectedVehicleId || undefined
        });
        
        // Add the wash record
        const newWash = await washService.addWash({
          customer_id: customer.id,
          wash_type_id: selectedWashTypeId,
          car_type: selectedCarType,
          price: selectedPrice,
          was_free: false,
          vehicle_id: selectedVehicleId || undefined
        });

        if (newWash) {
          // Refresh wash history
          loadWashHistory();
          // Call the original onAddWash to update customer's wash count
          onAddWash();
          
          // Reset selection
          setSelectedWashTypeId('');
          setSelectedPrice(0);
          setSelectedVehicleId('');
          
          // Show receipt
          setReceiptWashId(newWash.id);
          setIsReceiptOpen(true);
          
          // Switch to history tab
          setActiveTab("history");
        }
      } catch (error) {
        console.error('Error adding wash:', error);
        toast({
          variant: "destructive",
          description: "Failed to add wash. Please try again."
        });
      } finally {
        setIsSubmittingWash(false);
      }
    }, 500),
    [customer.id, selectedWashTypeId, selectedCarType, selectedPrice, selectedVehicleId, onAddWash]
  );

  // Use debounce to prevent multiple submissions
  const debouncedRedeemFreeWash = useCallback(
    debounce(async (e?: React.FormEvent) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      
      if (!selectedWashTypeId) {
        toast({
          variant: "destructive",
          description: "Please select a wash type first."
        });
        return;
      }

      if (!onRedeemFreeWash) {
        toast({
          variant: "destructive",
          description: "Cannot redeem free wash at this time."
        });
        return;
      }

      try {
        setIsRedeemingFreeWash(true);
        
        console.log('Redeeming free wash with:', {
          customer_id: customer.id,
          wash_type_id: selectedWashTypeId,
          car_type: selectedCarType,
          price: selectedPrice,
          was_free: true,
          vehicle_id: selectedVehicleId || undefined
        });
        
        // Add the wash record as free
        const newWash = await washService.addWash({
          customer_id: customer.id,
          wash_type_id: selectedWashTypeId,
          car_type: selectedCarType,
          price: selectedPrice,
          was_free: true,
          vehicle_id: selectedVehicleId || undefined
        });

        if (newWash) {
          // Refresh wash history
          loadWashHistory();
          // Call the original onRedeemFreeWash to reset customer's wash count
          onRedeemFreeWash();
          
          // Reset selection
          setSelectedWashTypeId('');
          setSelectedPrice(0);
          setSelectedVehicleId('');
          
          // Show receipt
          setReceiptWashId(newWash.id);
          setIsReceiptOpen(true);
          
          toast({
            description: "Free wash redeemed successfully."
          });
          
          // Switch to history tab to show the new entry
          setActiveTab("history");
        }
      } catch (error) {
        console.error('Error redeeming free wash:', error);
        toast({
          variant: "destructive",
          description: "Failed to redeem free wash. Please try again."
        });
      } finally {
        setIsRedeemingFreeWash(false);
      }
    }, 500),
    [customer.id, selectedWashTypeId, selectedCarType, selectedPrice, selectedVehicleId, onRedeemFreeWash]
  );

  const handleAddWash = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    debouncedAddWash(e);
  };

  const handleRedeemFreeWash = (e?: React.FormEvent) => {
    debouncedRedeemFreeWash(e);
  };

  const handlePrintReceipt = (washId: string) => {
    setReceiptWashId(washId);
    setIsReceiptOpen(true);
  };

  const customerDetails = (
    <>
      <Tabs defaultValue="info" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-6 w-full">
          <TabsTrigger value="info" className="text-sm font-medium">Info</TabsTrigger>
          <TabsTrigger value="vehicles" className="text-sm font-medium">Vehicles</TabsTrigger>
          <TabsTrigger value="wash" className="text-sm font-medium">New Wash</TabsTrigger>
          <TabsTrigger value="history" className="text-sm font-medium">History</TabsTrigger>
        </TabsList>
        
        {/* Info Tab */}
        <TabsContent value="info" className="space-y-6 mt-2">
          {/* Customer Status Card */}
          <Card className={customer.free_wash ? "border-yellow-300 bg-yellow-50 shadow-sm" : "bg-gray-50 shadow-sm"}>
            <CardContent className="p-5 flex flex-col items-center">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-3">Loyalty Status</h3>
                <div className="flex items-center justify-center">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-8 h-8 rounded-full mx-1.5 border-2 flex items-center justify-center transition-all ${
                        i < customer.wash_count 
                          ? 'bg-carwash-secondary border-carwash-secondary scale-110' 
                          : 'bg-gray-100 border-gray-300'
                      }`}
                    >
                      {i < customer.wash_count && <Check className="h-4 w-4 text-carwash-primary" />}
                    </div>
                  ))}
                </div>
                <p className="mt-3 font-medium text-base">{customer.wash_count}/6 Washes</p>
                
                {customer.free_wash && onRedeemFreeWash && (
                  <div className="mt-4 flex flex-col items-center">
                    <Badge className="mb-3 py-1.5 px-3 bg-yellow-500 hover:bg-yellow-600 animate-pulse text-white">
                      Free Wash Available
                    </Badge>
                    
                    <Button 
                      onClick={() => setActiveTab("wash")}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white py-3 mt-2 w-full sm:w-auto"
                    >
                      <Gift className="h-5 w-5 mr-2" />
                      Select Wash Type to Redeem
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Customer Details */}
          <div className="space-y-5 p-4 bg-white rounded-md border">
            <h3 className="text-lg font-medium mb-4">Customer Information</h3>
            
            <div className="space-y-5">
              <div className="p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-500 mb-1">Phone Number</p>
                <p className="font-medium text-base">{customer.phone}</p>
              </div>
              
              <div className="p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-500 mb-1">Email Address</p>
                <p className="font-medium text-base">{customer.email}</p>
              </div>
              
              <div className="p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-500 mb-1">Last Visit</p>
                <p className="font-medium text-base">
                  {customer.last_visit 
                    ? new Date(customer.last_visit).toLocaleDateString() 
                    : "No visits recorded"}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-3 pt-4 border-t">
            {onRemoveWash && (
              <Button 
                onClick={onRemoveWash}
                className="bg-gray-200 text-gray-800 hover:bg-gray-300 py-2.5"
                disabled={isProcessing || customer.wash_count <= 0}
              >
                {isProcessing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Minus className="h-4 w-4 mr-2" />}
                Remove Wash
              </Button>
            )}
            
            <Button 
              onClick={onEdit}
              className="bg-carwash-primary text-black hover:bg-carwash-primary/90 py-2.5"
              disabled={isProcessing}
            >
              {isProcessing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Edit className="h-4 w-4 mr-2" />}
              Edit Customer
            </Button>
            
            {onDeleteCustomer && (
              <Button 
                onClick={handleDeleteRequest}
                variant="destructive"
                disabled={isProcessing}
                className="py-2.5"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Customer
              </Button>
            )}
          </div>
        </TabsContent>

        {/* Vehicles Tab */}
        <TabsContent value="vehicles" className="mt-2">
          <VehicleManagement 
            customerId={customer.id} 
            onVehicleChange={loadWashHistory}
          />
        </TabsContent>
        
        {/* New Wash Tab */}
        <TabsContent value="wash" className="space-y-6 mt-2">
          <h3 className="text-lg font-medium">Add New Wash</h3>
          
          <form onSubmit={handleAddWash} className="space-y-6">
            {/* Vehicle Selection */}
            <VehicleSelect
              customerId={customer.id}
              selectedVehicleId={selectedVehicleId}
              onSelect={handleVehicleSelect}
            />

            {/* Wash Type Selection */}
            {isLoadingWashTypes ? (
              <div className="flex flex-col items-center py-6">
                <Loader2 className="h-8 w-8 animate-spin text-carwash-secondary mb-2" />
                <p className="text-sm text-muted-foreground">Loading wash types...</p>
              </div>
            ) : (
              <div className="max-h-[300px] overflow-y-auto border rounded-md">
                <WashTypeSelect 
                  washTypes={washTypes}
                  onSelect={handleWashTypeSelect}
                  isLoading={isLoadingWashTypes}
                />
              </div>
            )}
            
            {/* Price Preview */}
            {selectedWashTypeId && (
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mt-4">
                <p className="text-sm text-gray-500 mb-2">Price Preview</p>
                <p className="text-xl font-bold text-green-700">R{selectedPrice}</p>
              </div>
            )}
            
            <div className="flex flex-col space-y-3 pt-4 border-t">
              <Button 
                type="submit"
                className="bg-carwash-secondary text-carwash-primary hover:bg-carwash-secondary/90 py-3 text-base font-medium"
                disabled={isSubmittingWash || !selectedWashTypeId || washTypes.length === 0}
              >
                {isSubmittingWash ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : <Droplet className="h-5 w-5 mr-2" />}
                Add Regular Wash
              </Button>
              
              {customer.free_wash && onRedeemFreeWash && (
                <Button 
                  type="button"
                  onClick={handleRedeemFreeWash}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white py-3 text-base font-medium"
                  disabled={isRedeemingFreeWash || !selectedWashTypeId || washTypes.length === 0}
                >
                  {isRedeemingFreeWash ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : <Check className="h-5 w-5 mr-2" />}
                  Redeem Free Wash
                </Button>
              )}
            </div>
          </form>
        </TabsContent>
        
        {/* History Tab */}
        <TabsContent value="history" className="mt-2">
          <h3 className="text-lg font-medium mb-4">Wash History</h3>
          
          <WashHistoryTable 
            washes={washes}
            isLoading={isLoadingWashes}
            onPrintReceipt={handlePrintReceipt}
          />
        </TabsContent>
      </Tabs>
      
      <div className="mt-8">
        <Button 
          variant="outline" 
          onClick={onClose}
          disabled={isProcessing || isSubmittingWash || isRedeemingFreeWash}
          className="w-full py-2.5"
        >
          <X className="h-4 w-4 mr-2" /> Close
        </Button>
      </div>
    </>
  );

  return (
    <>
      {useModal ? (
        <Dialog open={open} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-[80%] sm:h-[85vh] overflow-y-auto p-6">
            <DialogHeader className="border-b pb-4 mb-6">
              <DialogTitle className="text-xl font-bold">{customer.name}</DialogTitle>
            </DialogHeader>
            {customerDetails}
          </DialogContent>
        </Dialog>
      ) : (
        <Sheet open={open} onOpenChange={onClose}>
          <SheetContent className="sm:max-w-xl md:max-w-2xl overflow-y-auto p-6">
            <SheetHeader className="border-b pb-4 mb-6">
              <SheetTitle className="text-xl font-bold">{customer.name}</SheetTitle>
            </SheetHeader>
            {customerDetails}
          </SheetContent>
        </Sheet>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {customer.name}'s customer record and all associated loyalty data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 text-white hover:bg-red-700"
              disabled={isProcessing}
            >
              {isProcessing ? 
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...</> : 
                "Delete Customer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Receipt Dialog */}
      <WashReceiptDialog
        washId={receiptWashId}
        customer={customer}
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
      />
    </>
  );
};

export default CustomerDetailDrawer;
