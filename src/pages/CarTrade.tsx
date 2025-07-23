
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Layout from '@/components/layout/Layout';
import SectionHeading from '@/components/ui/SectionHeading';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Check, Send, Loader2 } from 'lucide-react';
import emailjs from 'emailjs-com';

// Validation schema
const carTradeFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z.string().min(10, { message: 'Please enter a valid phone number' }),
  carMake: z.string().min(1, { message: 'Car make is required' }),
  carModel: z.string().min(1, { message: 'Car model is required' }),
  year: z.string().min(4, { message: 'Please enter a valid year' }).max(4),
  mileage: z.string().min(1, { message: 'Mileage is required' }),
  condition: z.string().min(1, { message: 'Please describe the condition of your car' }),
  additionalInfo: z.string().optional(),
});

type FormValues = z.infer<typeof carTradeFormSchema>;

const CarTrade = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(carTradeFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      carMake: '',
      carModel: '',
      year: '',
      mileage: '',
      condition: '',
      additionalInfo: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    console.log('Car trade form submitted with data:', data);
    
    setIsSubmitting(true);
    
    try {
      console.log('Sending car trade email via EmailJS...');
      
      const templateParams = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        car_make: data.carMake,
        car_model: data.carModel,
        year: data.year,
        mileage: data.mileage,
        condition: data.condition,
        additional_info: data.additionalInfo || 'None provided',
        subject: `Car Trade Request: ${data.carMake} ${data.carModel} ${data.year}`,
        message: `Car Trade Request Details:
        
Vehicle: ${data.carMake} ${data.carModel} (${data.year})
Mileage: ${data.mileage} km
Condition: ${data.condition}
Additional Info: ${data.additionalInfo || 'None provided'}`,
        to_email: 'wedocheapies@gmail.com'
      };

      console.log('Car trade template params:', templateParams);

      const result = await emailjs.send(
        'service_r4il797',
        'template_kwas1k7',
        templateParams,
        'AwVjWC3Zh6MBylwH-'
      );

      console.log('Car trade EmailJS result:', result);
      
      setIsSubmitted(true);
      toast({
        title: "Application Submitted",
        description: "We have received your car trade request. Our team will contact you shortly.",
      });
    } catch (error) {
      console.error("Error sending car trade email:", error);
      toast({
        title: "Error",
        description: "There was a problem submitting your application. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-4">Sell Your Car</h1>
            <p className="text-lg text-gray-300 mb-4">Get a competitive cash offer for your vehicle</p>
            <div className="w-24 h-1 bg-dealership-secondary mb-6"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {!isSubmitted ? (
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-6">Vehicle Information</h3>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        </div>
                        
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
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="carMake"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Car Make</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., Toyota, Honda, Ford" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="carModel"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Car Model</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., Corolla, Civic, Focus" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="year"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Year</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., 2018" {...field} maxLength={4} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="mileage"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Mileage (km)</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., 85000" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="condition"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Vehicle Condition</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Please describe the current condition of your vehicle, any issues, accidents, etc."
                                  className="min-h-[100px]"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="additionalInfo"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Additional Information (Optional)</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Any additional details you'd like to share"
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
                              Submitting...
                            </>
                          ) : (
                            <>
                              <Send className="mr-2 h-4 w-4" />
                              Submit Application
                            </>
                          )}
                        </Button>
                      </form>
                    </Form>
                  </div>
                ) : (
                  <div className="p-8 text-center animate-fade-in">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check size={32} className="text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Application Submitted</h2>
                    <p className="text-gray-600 mb-6">
                      Thank you for your car trade application. Our team will evaluate your vehicle and contact you shortly with an offer.
                    </p>
                    <Button asChild className="bg-dealership-secondary text-dealership-primary hover:bg-dealership-secondary/90">
                      <a href="/">Return to Home</a>
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Benefits Sidebar */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">Why Sell to Us?</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-4 h-4 bg-dealership-secondary rounded-full"></div>
                  </div>
                  <div className="ml-3">
                    <h4 className="font-semibold">We buy cars for cash 💸💵</h4>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-4 h-4 bg-dealership-secondary rounded-full"></div>
                  </div>
                  <div className="ml-3">
                    <h4 className="font-semibold">All trade-in’s are welcome</h4>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-4 h-4 bg-dealership-secondary rounded-full"></div>
                  </div>
                  <div className="ml-3">
                    <h4 className="font-semibold">Free evaluation</h4>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-4 h-4 bg-dealership-secondary rounded-full"></div>
                  </div>
                  <div className="ml-3">
                    <h4 className="font-semibold">Best cash prices on all vehicles</h4>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CarTrade;
