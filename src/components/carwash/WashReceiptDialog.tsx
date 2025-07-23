
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Loader2, Printer, RotateCcw, Home } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Wash, WashType, washService } from '@/services/washService';
import { Customer } from '@/services/customerService';
import { formatDate } from '@/lib/formatDate';
import { useNavigate } from 'react-router-dom';

interface WashReceiptDialogProps {
  isOpen: boolean;
  onClose: () => void;
  washData?: Wash;
  customer?: Customer;
  washType?: WashType;
  washId?: string;
}

const WashReceiptDialog = ({
  isOpen,
  onClose,
  washData,
  customer,
  washType,
  washId
}: WashReceiptDialogProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isPrinting, setIsPrinting] = useState(false);
  const [currentDate] = useState(new Date());
  const [loadedWashData, setLoadedWashData] = useState<Wash | undefined>(washData);
  const [loadedWashType, setLoadedWashType] = useState<WashType | undefined>(washType);
  const [isLoading, setIsLoading] = useState(false);
  
  // Load wash data if washId is provided
  useEffect(() => {
    const loadData = async () => {
      if (washId && !washData) {
        setIsLoading(true);
        try {
          const wash = await washService.getWashById(washId);
          if (wash) {
            setLoadedWashData(wash);
            setLoadedWashType(wash.wash_type);
          }
        } catch (error) {
          console.error("Failed to load wash data:", error);
        } finally {
          setIsLoading(false);
        }
      } else if (washData) {
        setLoadedWashData(washData);
        setLoadedWashType(washType);
      }
    };
    
    loadData();
  }, [washId, washData, washType]);
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Format date string
  const formatDateStr = (date: Date) => {
    return date.toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  // Format time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-ZA', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Use either the loaded data or the directly provided data
  const displayWashData = loadedWashData || washData;
  const displayWashType = loadedWashType || washType;
  const washPrice = displayWashData?.price || (displayWashType ? 
    (displayWashType.price_small_car || displayWashType.price_bakkie_suv || 0) : 0);

  // Get vehicle registration from wash data
  const getVehicleRegistration = () => {
    if (displayWashData?.vehicle) {
      return displayWashData.vehicle.registration;
    }
    return "N/A";
  };

  // Thermal receipt printer implementation
  const handleThermalPrint = () => {
    if (!displayWashData || !customer) return;
    
    setIsPrinting(true);
    
    try {
      // Open a new window for the receipt
      const printWindow = window.open('', '_blank', 'width=280,height=500');
      
      if (!printWindow) {
        toast({
          variant: "destructive",
          title: "Pop-up blocked",
          description: "Please allow pop-ups to print receipts"
        });
        setIsPrinting(false);
        return;
      }
      
      // Create the receipt HTML content optimized for thermal printers
      const receiptDate = new Date(displayWashData.created_at || displayWashData.performed_at);
      const vehicleRegistration = getVehicleRegistration();
      const thermalStyles = `
        <style>
          @page {
            size: 80mm auto;
            margin: 0;
          }
          body {
            width: 72mm;
            max-width: 72mm;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            margin: 0;
            padding: 0 4mm;
            text-align: left;
            line-height: 1.2;
          }
          .receipt {
            padding: 2mm 0;
          }
          .header {
            text-align: center;
            margin-bottom: 4mm;
          }
          .logo {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 2mm;
          }
          .logo-img {
            max-width: 60mm;
            height: auto;
            margin-bottom: 2mm;
          }
          .address {
            margin-bottom: 2mm;
          }
          .divider {
            border-top: 1px dashed #000;
            margin: 2mm 0;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 1mm;
          }
          .total {
            font-weight: bold;
            margin-top: 2mm;
          }
          .footer {
            text-align: center;
            margin-top: 4mm;
            font-size: 10px;
          }
          .center {
            text-align: center;
          }
          .loyalty {
            text-align: center;
            margin: 3mm 0;
          }
          .disclaimer {
            font-size: 10px;
            font-weight: normal;
            line-height: 1.3;
            margin-top: 4mm;
            text-align: center;
          }
          .disclaimer-divider {
            border-top: 1px dashed #000;
            margin: 3mm 0 2mm 0;
          }
          .thanks {
            text-align: center;
            font-weight: bold;
            margin: 4mm 0 2mm;
          }
        </style>
      `;
      
      const receiptHTML = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Wash Receipt</title>
            ${thermalStyles}
          </head>
          <body>
            <div class="receipt">
              <div class="header">
                <img src="/lovable-uploads/0adce92b-8870-4146-8305-eef55ad6c57c.png" alt="Main Street Car Wash" class="logo-img" />
                <div class="address">24 Voortrekker Rd, Kinross</div>
                <div>Tel: 071 312 6153</div>
              </div>
              
              <div class="divider"></div>
              
              <div class="info-row">
                <span>Receipt #:</span>
                <span>${displayWashData.id.substring(0, 8).toUpperCase()}</span>
              </div>
              
              <div class="info-row">
                <span>Date:</span>
                <span>${formatDateStr(receiptDate)}</span>
              </div>
              
              <div class="info-row">
                <span>Time:</span>
                <span>${formatTime(receiptDate)}</span>
              </div>
              
              <div class="divider"></div>
              
              <div class="info-row">
                <span>Customer:</span>
                <span>${customer.name}</span>
              </div>
              
              <div class="info-row">
                <span>Vehicle:</span>
                <span>${vehicleRegistration}</span>
              </div>
              
              <div class="info-row">
                <span>Service:</span>
                <span>${displayWashType?.name || "Car Wash"}</span>
              </div>
              
              <div class="info-row total">
                <span>Total:</span>
                <span>${formatCurrency(washPrice)}</span>
              </div>
              
              <div class="divider"></div>
              
              <div class="loyalty">
                <div><strong>Loyalty Program Status</strong></div>
                <div>Wash Count: ${customer.wash_count}/6</div>
                ${customer.free_wash ? '<div><strong>You have earned a FREE wash!</strong></div>' : ''}
              </div>
              
              <div class="thanks">Thank you for your business!</div>
              
              <div class="disclaimer-divider"></div>
              
              <div class="disclaimer">
                <div><strong>DISCLAIMER:</strong></div>
                <div>Main Street Car Wash is not responsible</div>
                <div>for any loss or damage to vehicles,</div>
                <div>including interior & exterior. Items</div>
                <div>left behind are at customer's own risk.</div>
              </div>
              
              <div class="disclaimer-divider"></div>
            </div>
          </body>
        </html>
      `;
      
      // Write the receipt content to the new window
      printWindow.document.write(receiptHTML);
      printWindow.document.close();
      
      // Wait for images to load before printing
      setTimeout(() => {
        printWindow.print();
        
        // Close the print window after a delay
        setTimeout(() => {
          printWindow.close();
          setIsPrinting(false);
          
          toast({
            title: "Receipt sent to printer",
            description: "The receipt has been sent to your thermal printer."
          });
        }, 1000);
      }, 500);
      
    } catch (error) {
      console.error('Printing error:', error);
      setIsPrinting(false);
      
      toast({
        variant: "destructive",
        title: "Print error",
        description: "There was a problem printing the receipt."
      });
    }
  };

  // Handle silent print on first load
  useEffect(() => {
    if (isOpen && displayWashData && customer && !isLoading) {
      // You can uncomment this for auto-printing in kiosk mode
      // handleThermalPrint();
    }
  }, [isOpen, displayWashData, customer, isLoading]);
  
  const handlePrintAnother = () => {
    handleThermalPrint();
  };
  
  const handleReturnToDashboard = () => {
    onClose();
    navigate('/car-wash/admin');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Wash Receipt</DialogTitle>
        </DialogHeader>
        
        <div id="receipt-print-content" className="mt-4">
          {(displayWashData || isLoading) && customer ? (
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="receipt-header text-center mb-6">
                <div className="flex justify-center mb-2">
                  <img 
                    src="/lovable-uploads/0adce92b-8870-4146-8305-eef55ad6c57c.png" 
                    alt="Main Street Car Wash" 
                    className="h-12" 
                  />
                </div>
                <h3 className="text-xl font-bold">Main Street Car Wash</h3>
                <p className="text-sm text-gray-600">24 Voortrekker Rd, Kinross</p>
                <p className="text-sm text-gray-600">Tel: 071 312 6153</p>
              </div>
              
              {isLoading ? (
                <div className="text-center py-4">
                  <Loader2 className="animate-spin h-8 w-8 mx-auto" />
                  <p className="mt-2 text-gray-500">Loading receipt data...</p>
                </div>
              ) : displayWashData ? (
                <div className="receipt-content space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Receipt #:</span>
                    <span>{displayWashData.id.substring(0, 8).toUpperCase()}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Date:</span>
                    <span>{formatDateStr(new Date(displayWashData.created_at || displayWashData.performed_at))}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Time:</span>
                    <span>{formatTime(new Date(displayWashData.created_at || displayWashData.performed_at))}</span>
                  </div>
                  
                  <div className="border-t border-dashed border-gray-200 pt-4 mt-4">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Customer:</span>
                      <span>{customer.name}</span>
                    </div>
                    
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Vehicle:</span>
                      <span>{getVehicleRegistration()}</span>
                    </div>
                    
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Service:</span>
                      <span>{displayWashType?.name || "Car Wash"}</span>
                    </div>
                    
                    <div className="flex justify-between font-bold">
                      <span>Total:</span>
                      <span>{formatCurrency(washPrice)}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500">No wash data available</p>
                </div>
              )}
              
              <div className="mt-6 pt-4 border-t border-dashed border-gray-200">
                <div className="text-center text-sm">
                  <p className="font-medium">Loyalty Program Status</p>
                  <p>Wash Count: {customer.wash_count}/6</p>
                  {customer.free_wash && (
                    <p className="text-carwash-secondary font-bold mt-2">
                      You have earned a FREE wash!
                    </p>
                  )}
                  <p className="mt-4">Thank you for your business!</p>
                </div>
                
                <div className="mt-4 text-xs text-gray-600 border-t border-dashed border-gray-200 pt-4">
                  <div className="text-center">
                    <p className="font-bold mb-2">DISCLAIMER:</p>
                    <p>Main Street Car Wash is not responsible for any loss or damage to vehicles, including interior & exterior.</p>
                    <p className="mt-1">Items left behind are at customer's own risk.</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Loader2 className="animate-spin h-8 w-8 mx-auto" />
              <p className="mt-4">Loading receipt data...</p>
            </div>
          )}
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row justify-end gap-2">
          <div className="flex flex-col sm:flex-row w-full gap-2">
            <Button 
              variant="outline" 
              onClick={handleReturnToDashboard}
              className="w-full sm:w-auto"
            >
              <Home className="mr-2 h-4 w-4" />
              Return to Dashboard
            </Button>
            
            <Button
              variant="secondary"
              onClick={handlePrintAnother}
              disabled={!displayWashData || isPrinting}
              className="w-full sm:w-auto"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Print Another
            </Button>
            
            <Button
              onClick={handleThermalPrint}
              disabled={!displayWashData || isPrinting}
              className="bg-carwash-secondary text-carwash-primary hover:bg-carwash-secondary/90 w-full sm:w-auto"
            >
              {isPrinting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Printing...
                </>
              ) : (
                <>
                  <Printer className="mr-2 h-4 w-4" />
                  Print Thermal Receipt
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WashReceiptDialog;
