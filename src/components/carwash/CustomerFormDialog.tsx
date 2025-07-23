
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CustomerProfileForm from "./CustomerProfileForm";

interface CustomerFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  initialData?: {
    id?: string;
    name: string;
    phone: string;
    email: string;
    wash_count?: number;
    last_visit?: string;
    free_wash?: boolean;
  };
  isEditing?: boolean;
  isSubmitting?: boolean;
}

const CustomerFormDialog: React.FC<CustomerFormDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEditing = false,
  isSubmitting = false,
}) => {
  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Customer" : "Add New Customer"}</DialogTitle>
        </DialogHeader>
        <CustomerProfileForm
          initialData={initialData}
          onSubmit={onSubmit}
          onCancel={handleClose}
          isEditing={isEditing}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CustomerFormDialog;
