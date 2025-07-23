import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Star, LogOut, Droplet, Printer, Loader2, Settings } from 'lucide-react';
import CustomerFormDialog from '@/components/carwash/CustomerFormDialog';
import CustomerDetailDrawer from '@/components/carwash/CustomerDetailDrawer';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Customer, customerService } from '@/services/customerService';
import { supabase } from '@/integrations/supabase/client';
import AdminProfile from '@/components/admin/AdminProfile';
import WashReceiptDialog from '@/components/carwash/WashReceiptDialog';
import { Wash, washService } from '@/services/washService';
import { Link } from 'react-router-dom';

const CarWashAdmin = () => {
  const { signOut, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCustomerDrawerOpen, setIsCustomerDrawerOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdminProfileOpen, setIsAdminProfileOpen] = useState(false);
  const [latestWash, setLatestWash] = useState<Wash | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  // Customer data
  const [customers, setCustomers] = useState<Customer[]>([]);

  // Load customers from Supabase
  const loadCustomers = async () => {
    setIsLoading(true);
    const data = await customerService.getCustomers();
    setCustomers(data);
    setIsLoading(false);
  };

  // Load customers on component mount
  useEffect(() => {
    loadCustomers();

    // Set up realtime subscription for customers
    const customerChannel = supabase
      .channel('public:customers')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'customers' },
        payload => {
          console.log('Customer update:', payload);
          
          if (payload.eventType === 'INSERT') {
            const newCustomer = payload.new as Customer;
            setCustomers(prevCustomers => {
              // Check if customer already exists to avoid duplicates
              if (!prevCustomers.some(c => c.id === newCustomer.id)) {
                // Add free_wash property
                const customerWithFreeWash = {
                  ...newCustomer,
                  free_wash: newCustomer.wash_count >= 6
                };
                return [...prevCustomers, customerWithFreeWash];
              }
              return prevCustomers;
            });
          } 
          else if (payload.eventType === 'UPDATE') {
            const updatedCustomer = payload.new as Customer;
            setCustomers(prevCustomers =>
              prevCustomers.map(customer =>
                customer.id === updatedCustomer.id
                  ? { ...updatedCustomer, free_wash: updatedCustomer.wash_count >= 6 }
                  : customer
              )
            );
            
            // Update selected customer if it's the one being updated
            if (selectedCustomer && selectedCustomer.id === updatedCustomer.id) {
              setSelectedCustomer({
                ...updatedCustomer,
                free_wash: updatedCustomer.wash_count >= 6
              });
            }
          } 
          else if (payload.eventType === 'DELETE') {
            const deletedCustomer = payload.old as Customer;
            setCustomers(prevCustomers => 
              prevCustomers.filter(customer => customer.id !== deletedCustomer.id)
            );
            
            // Close drawer if the deleted customer is currently selected
            if (selectedCustomer && selectedCustomer.id === deletedCustomer.id) {
              setIsCustomerDrawerOpen(false);
              setSelectedCustomer(null);
            }
          }
        }
      )
      .subscribe();

    // Set up realtime subscription for washes
    const washChannel = supabase
      .channel('public:washes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'washes' },
        payload => {
          console.log('New wash added:', payload);
          // Store the latest wash for receipt printing
          if (payload.eventType === 'INSERT') {
            const newWash = payload.new as Wash;
            setLatestWash(newWash);
          }
        }
      )
      .subscribe();

    // Clean up subscription when component unmounts
    return () => {
      supabase.removeChannel(customerChannel);
      supabase.removeChannel(washChannel);
    };
  }, []);

  // Handle adding new customer
  const handleAddCustomer = async (values: any) => {
    setIsProcessing(true);
    const newCustomer = await customerService.addCustomer({
      name: values.name,
      phone: values.phone,
      email: values.email,
    });
    
    if (newCustomer) {
      setIsAddDialogOpen(false);
    }
    setIsProcessing(false);
  };

  // Handle editing customer
  const handleEditCustomer = async (values: any) => {
    if (!selectedCustomer) return;
    
    setIsProcessing(true);
    const updatedCustomer = await customerService.updateCustomer({
      id: selectedCustomer.id,
      name: values.name,
      phone: values.phone,
      email: values.email,
    });
    
    if (updatedCustomer) {
      setIsEditDialogOpen(false);
    }
    setIsProcessing(false);
  };

  // Handle adding wash
  const handleAddWash = async (customerId: string) => {
    // Only refresh customers, do not add a wash here!
    await loadCustomers();
  };

  // Handle remove wash
  const handleRemoveWash = async (customerId: string) => {
    setIsProcessing(true);
    await customerService.removeWash(customerId);
    setIsProcessing(false);
  };

  // Handle redeem free wash
  const handleRedeemFreeWash = async (customerId: string) => {
    setIsProcessing(true);
    const updatedCustomer = await customerService.redeemFreeWash(customerId);
    
    if (updatedCustomer) {
      // Close drawer after redeeming
      setIsCustomerDrawerOpen(false);
    }
    setIsProcessing(false);
  };

  // Handle row click to view customer details
  const handleRowClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsCustomerDrawerOpen(true);
  };

  // Handle delete customer
  const handleDeleteCustomer = async () => {
    if (!selectedCustomer) return;
    
    setIsProcessing(true);
    const success = await customerService.deleteCustomer(selectedCustomer.id);
    
    if (success) {
      setIsCustomerDrawerOpen(false);
      setSelectedCustomer(null);
    }
    setIsProcessing(false);
  };

  // Filter customers based on search query
  const filteredCustomers = customers.filter(customer => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      customer.name.toLowerCase().includes(searchTerm) ||
      customer.phone.includes(searchTerm) ||
      customer.email.toLowerCase().includes(searchTerm)
    );
  });

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <header className="bg-carwash-primary text-white shadow-md sticky top-0 z-50 min-h-[72px]">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Droplet className="h-6 w-6 text-black mr-2" />
            <h1 className="text-xl text-black font-bold">Main Street Car Wash Loyalty System</h1>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-black hidden md:inline-block mr-2">
              {user?.email}
            </span>
            
            <Link to="/car-wash/admin/wash-types">
              <Button 
                variant="secondary" 
                className="bg-carwash-secondary text-carwash-primary hover:bg-carwash-secondary/90"
              >
                <Settings className="h-4 w-4 mr-1" /> Wash Types
              </Button>
            </Link>
            
            <Button 
              variant="ghost" 
              className="text-black" 
              onClick={() => setIsAdminProfileOpen(true)}
            >
              <Settings className="h-5 w-5" />
            </Button>
            
            <Button variant="ghost" onClick={signOut} className="text-black">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-700">Total Customers</h3>
            <p className="text-3xl font-bold mt-2">{customers.length}</p>
            <p className="text-sm text-gray-500 mt-1">Loyalty program members</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-700">Free Washes Available</h3>
            <p className="text-3xl font-bold mt-2">{customers.filter(c => c.free_wash).length}</p>
            <p className="text-sm text-gray-500 mt-1">Customers eligible for rewards</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-700">Total Washes</h3>
            <p className="text-3xl font-bold mt-2">{customers.reduce((sum, c) => sum + c.wash_count, 0)}</p>
            <p className="text-sm text-gray-500 mt-1">Tracked wash services</p>
          </div>
        </div>

        {/* Customer Management */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <h2 className="text-xl font-semibold">Loyalty Program Members</h2>
              <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search customers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
                <Button 
                  className="bg-carwash-secondary text-carwash-primary hover:bg-carwash-secondary/90"
                  onClick={() => setIsAddDialogOpen(true)}
                >
                  <Plus className="h-5 w-5 mr-1" />
                  Add New Customer
                </Button>
              </div>
            </div>
          </div>

          {/* Customer Table */}
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="p-8 text-center">
                <Loader2 className="h-8 w-8 mx-auto text-carwash-secondary animate-spin" />
                <p className="mt-4 text-gray-500">Loading customers...</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wash Count</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Visit</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredCustomers.length > 0 ? (
                    filteredCustomers.map((customer) => (
                      <tr 
                        key={customer.id} 
                        className={`hover:bg-gray-50 cursor-pointer transition-colors ${customer.free_wash ? 'bg-yellow-50' : ''}`}
                        onClick={() => handleRowClick(customer)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{customer.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-700">{customer.phone}</div>
                          <div className="text-sm text-gray-500">{customer.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {[...Array(6)].map((_, i) => (
                              <div
                                key={i}
                                className={`w-5 h-5 rounded-full mr-1 border ${
                                  i < customer.wash_count 
                                    ? 'bg-carwash-secondary border-carwash-secondary' 
                                    : 'bg-gray-100 border-gray-300'
                                }`}
                              />
                            ))}
                            <span className="ml-2 text-sm font-medium">{customer.wash_count}/6</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {customer.last_visit 
                            ? new Date(customer.last_visit).toLocaleDateString() 
                            : "No visits recorded"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {customer.free_wash ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 animate-pulse">
                              <Star className="h-3 w-3 mr-1" /> Free Wash Available
                            </span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                              Earning
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                        {searchQuery ? 
                          "No customers found matching your search." : 
                          "No customers added yet. Add your first customer!"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* Table Pagination */}
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{filteredCustomers.length}</span> of{" "}
              <span className="font-medium">{customers.length}</span> customers
            </div>
          </div>
        </div>
      </div>

      {/* Add Customer Modal */}
      <CustomerFormDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={handleAddCustomer}
        isSubmitting={isProcessing}
      />

      {/* Edit Customer Modal */}
      <CustomerFormDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSubmit={handleEditCustomer}
        initialData={selectedCustomer ? {
          id: selectedCustomer.id,
          name: selectedCustomer.name,
          phone: selectedCustomer.phone,
          email: selectedCustomer.email,
          wash_count: selectedCustomer.wash_count,
          free_wash: selectedCustomer.free_wash,
          last_visit: selectedCustomer.last_visit
        } : undefined}
        isEditing={true}
        isSubmitting={isProcessing}
      />

      {/* Customer Detail Drawer */}
      {selectedCustomer && (
        <CustomerDetailDrawer
          customer={{
            id: selectedCustomer.id,
            name: selectedCustomer.name,
            phone: selectedCustomer.phone,
            email: selectedCustomer.email,
            wash_count: selectedCustomer.wash_count,
            last_visit: selectedCustomer.last_visit,
            free_wash: selectedCustomer.free_wash
          }}
          open={isCustomerDrawerOpen}
          onClose={() => setIsCustomerDrawerOpen(false)}
          onEdit={() => {
            setIsCustomerDrawerOpen(false);
            setIsEditDialogOpen(true);
          }}
          onAddWash={() => handleAddWash(selectedCustomer.id)}
          onRemoveWash={() => handleRemoveWash(selectedCustomer.id)}
          onRedeemFreeWash={selectedCustomer.free_wash ? () => handleRedeemFreeWash(selectedCustomer.id) : undefined}
          onDeleteCustomer={() => handleDeleteCustomer()}
          isProcessing={isProcessing}
        />
      )}
      
      {/* Admin Profile Dialog */}
      <AdminProfile
        isOpen={isAdminProfileOpen}
        onClose={() => setIsAdminProfileOpen(false)}
      />
    </div>
  );
};

export default CarWashAdmin;
