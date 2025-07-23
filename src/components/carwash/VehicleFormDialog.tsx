
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { Vehicle } from "@/services/vehicleService";

const formSchema = z.object({
  make: z.string().optional(),
  model: z.string().optional(),
  year: z.number().min(1900).max(new Date().getFullYear() + 1).optional().or(z.literal("")),
  color: z.string().optional(),
  registration: z.string().min(1, { message: "Registration is required." }),
  is_primary: z.boolean().default(false),
});

type VehicleFormValues = z.infer<typeof formSchema>;

interface VehicleFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: VehicleFormValues) => void;
  initialData?: Vehicle | null;
  isEditing?: boolean;
  isSubmitting?: boolean;
  isFirstVehicle?: boolean;
}

const VehicleFormDialog: React.FC<VehicleFormDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEditing = false,
  isSubmitting = false,
  isFirstVehicle = false,
}) => {
  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      make: initialData?.make || "",
      model: initialData?.model || "",
      year: initialData?.year || "",
      color: initialData?.color || "",
      registration: initialData?.registration || "",
      is_primary: initialData?.is_primary || isFirstVehicle,
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        make: initialData?.make || "",
        model: initialData?.model || "",
        year: initialData?.year || "",
        color: initialData?.color || "",
        registration: initialData?.registration || "",
        is_primary: initialData?.is_primary || isFirstVehicle,
      });
    }
  }, [isOpen, initialData, isFirstVehicle, form]);

  const handleSubmit = (values: VehicleFormValues) => {
    const submitData = {
      ...values,
      year: values.year === "" ? undefined : Number(values.year),
    };
    onSubmit(submitData);
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Vehicle" : "Add Vehicle"}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="registration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Registration Number *</FormLabel>
                  <FormControl>
                    <Input placeholder="AB 12 CD GP" {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="make"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Make</FormLabel>
                    <FormControl>
                      <Input placeholder="Toyota" {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model</FormLabel>
                    <FormControl>
                      <Input placeholder="Corolla" {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="2020"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <Input placeholder="White" {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="is_primary"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isSubmitting || isFirstVehicle}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Set as primary vehicle
                    </FormLabel>
                    {isFirstVehicle && (
                      <p className="text-xs text-muted-foreground">
                        First vehicle will be set as primary automatically
                      </p>
                    )}
                  </div>
                </FormItem>
              )}
            />
            
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-carwash-secondary text-carwash-primary hover:bg-carwash-secondary/90 mb-2 sm:mb-0"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditing ? "Saving..." : "Adding..."}
                  </>
                ) : (
                  isEditing ? "Save Changes" : "Add Vehicle"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default VehicleFormDialog;
