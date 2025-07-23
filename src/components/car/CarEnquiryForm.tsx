
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Send, Loader2 } from 'lucide-react';
import emailjs from 'emailjs-com';

// Validation schema
const enquiryFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z.string().min(10, { message: 'Please enter a valid phone number' }),
  message: z.string().min(10, { message: 'Please enter a message of at least 10 characters' }),
});

type FormValues = z.infer<typeof enquiryFormSchema>;

interface CarEnquiryFormProps {
  carId: string;
  carMake: string;
  carModel: string;
}

const CarEnquiryForm = ({ carId, carMake, carModel }: CarEnquiryFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(enquiryFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      message: `I am interested in the ${carMake} ${carModel}. Please contact me with more information.`,
    },
  });
  
  const onSubmit = async (data: FormValues) => {
    console.log('Car enquiry form submitted with data:', data);
    
    setIsSubmitting(true);
    
    try {
      console.log('Sending car enquiry email via EmailJS...');
      
      const templateParams = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
        car_make: carMake,
        car_model: carModel,
        car_id: carId,
        subject: `Car Enquiry: ${carMake} ${carModel}`,
        to_email: 'wedocheapies@gmail.com'
      };

      console.log('Car enquiry template params:', templateParams);

      const result = await emailjs.send(
        'service_cz6ciqr',
        'template_bxr6qwp',
        templateParams,
        'v45OHiYFLR8w-026V'
      );

      console.log('Car enquiry EmailJS result:', result);
      
      form.reset();
      toast({
        title: "Enquiry Sent",
        description: "Thank you for your enquiry. We will contact you shortly.",
      });
    } catch (error) {
      console.error("Error sending car enquiry email:", error);
      toast({
        title: "Error",
        description: "There was a problem sending your enquiry. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Enquire About This Vehicle</h3>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your full name" {...field} />
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
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Enter your email" {...field} />
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
                  <Input type="tel" placeholder="Enter your phone number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Your message..."
                    className="min-h-[100px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-dealership-secondary text-dealership-primary hover:bg-dealership-secondary/90"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Enquiry
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CarEnquiryForm;
