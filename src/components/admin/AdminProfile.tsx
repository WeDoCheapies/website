
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface AdminProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminProfile: React.FC<AdminProfileProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("account");
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Admin Profile</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger value="account" className="flex-1">
              Account
            </TabsTrigger>
          </TabsList>

          <TabsContent value="account" className="py-4 space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Account Details</h3>
              
              <div className="space-y-3 mt-4">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Account ID</p>
                  <p className="font-medium text-xs truncate">{user?.id}</p>
                </div>
              </div>

              <Button 
                variant="destructive" 
                className="mt-6 w-full"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AdminProfile;
