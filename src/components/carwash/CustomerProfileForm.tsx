
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  email: z.string().email({ message: "Please enter a valid email address." }).optional().or(z.literal('')),
});

type CustomerFormValues = z.infer<typeof formSchema>;

interface CustomerProfileFormProps {
  initialData?: {
    id?: string;
    name: string;
    phone: string;
    email: string;
    wash_count?: number;
    last_visit?: string;
    free_wash?: boolean;
  };
  onSubmit: (values: CustomerFormValues) => void;
  onCancel: () => void;
  isEditing?: boolean;
  isSubmitting?: boolean;
}

const CustomerProfileForm: React.FC<CustomerProfileFormProps> = ({
  initialData = {
    name: "",
    phone: "",
    email: "",
  },
  onSubmit,
  onCancel,
  isEditing = false,
  isSubmitting = false,
}) => {
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData.name,
      phone: initialData.phone,
      email: initialData.email,
    },
  });

  const handleSubmit = (values: CustomerFormValues) => {
    try {
      onSubmit(values);
    } catch (error) {
      toast({
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} disabled={isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="078 123 4567" {...field} disabled={isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="example@email.com" type="email" {...field} disabled={isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
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
              isEditing ? "Save Changes" : "Add Customer"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CustomerProfileForm;
