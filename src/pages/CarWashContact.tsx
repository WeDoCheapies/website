
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import CarWashLayout from '@/components/carwash/CarWashLayout';
import SectionHeading from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from "@/hooks/use-toast";
import { Phone, Mail, MapPin, Send, Loader2, Clock } from 'lucide-react';
import emailjs from 'emailjs-com';

type ContactFormData = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

const CarWashContact = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: ContactFormData) => {
    console.log('Form submitted with data:', data);
    
    setIsSubmitting(true);
    
    try {
      console.log('Sending email via EmailJS...');
      
      // EmailJS parameters
      const templateParams = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        subject: data.subject,
        message: data.message,
        to_email: 'hamzah.mainstreetcarwash@gmail.com'
      };

      console.log('Template params:', templateParams);

      const result = await emailjs.send(
        'service_cz6ciqr',
        'template_bxr6qwp',
        templateParams,
        'v45OHiYFLR8w-026V'
      );
      
      console.log('EmailJS result:', result);
      
      toast({
        title: "Message Sent",
        description: "Thank you for reaching out. We'll get back to you soon!",
      });
      
      reset();
    } catch (error) {
      console.error("Error sending email:", error);
      toast({
        title: "Error",
        description: "There was a problem sending your message. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CarWashLayout>
      {/* Header */}
      <section className="pt-32 pb-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeading 
            title="Contact Us" 
            subtitle="Get in touch with our team"
            alignment="center"
            isCarWash={true}
          />
        </div>
      </section>
      
      {/* Contact Form and Info */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-lg border border-carwash-border p-8 shadow-lg">
              <h3 className="text-2xl font-semibold text-carwash-text mb-6">Send us a message</h3>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-carwash-text mb-1">Your Name <span className="text-red-500">*</span></label>
                    <Input 
                      id="name"
                      placeholder="John Doe"
                      {...register("name", { required: "Name is required" })}
                      className={`border-carwash-border focus:border-carwash-secondary ${errors.name ? "border-red-500" : ""}`}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-carwash-text mb-1">Email <span className="text-red-500">*</span></label>
                    <Input 
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      {...register("email", { 
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address"
                        }
                      })}
                      className={`border-carwash-border focus:border-carwash-secondary ${errors.email ? "border-red-500" : ""}`}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-carwash-text mb-1">Phone Number</label>
                    <Input 
                      id="phone"
                      placeholder="+27 12 345 6789"
                      {...register("phone")}
                      className="border-carwash-border focus:border-carwash-secondary"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-carwash-text mb-1">Subject <span className="text-red-500">*</span></label>
                    <Input 
                      id="subject"
                      placeholder="Booking Inquiry"
                      {...register("subject", { required: "Subject is required" })}
                      className={`border-carwash-border focus:border-carwash-secondary ${errors.subject ? "border-red-500" : ""}`}
                    />
                    {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-carwash-text mb-1">Message <span className="text-red-500">*</span></label>
                    <Textarea
                      id="message"
                      placeholder="Write your message here..."
                      rows={5}
                      {...register("message", { required: "Message is required" })}
                      className={`border-carwash-border focus:border-carwash-secondary ${errors.message ? "border-red-500" : ""}`}
                    />
                    {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-carwash-secondary hover:bg-carwash-accent text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </div>
            
            {/* Contact Info */}
            <div>
              <div className="bg-white rounded-lg p-8 border border-carwash-border shadow-lg">
                <h3 className="text-2xl font-semibold mb-6 text-carwash-text">Contact Information</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <MapPin className="text-carwash-secondary mr-3 h-6 w-6 shrink-0" />
                    <div>
                      <h4 className="font-medium mb-1 text-carwash-text">Address</h4>
                      <p className="text-carwash-muted">
                        <a 
                          href="https://www.google.com/maps/place/We+Do+Cheapies/@-26.4212642,29.0906497,17z/data=!3m1!4b1!4m6!3m5!1s0x1eeb17ba360eba83:0x11c8d90d1cfcc1c3!8m2!3d-26.4212642!4d29.0932246!16s%2Fg%2F11ycfqmsn5?entry=ttu&g_ep=EgoyMDI1MDUyMS4wIKXMDSoASAFQAw%3D%3D" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          24 Voortrekker Rd, Kinross, Mpumalanga
                        </a>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Phone className="text-carwash-secondary mr-3 h-6 w-6 shrink-0" />
                    <div>
                      <h4 className="font-medium mb-1 text-carwash-text">Phone</h4>
                      <p className="text-carwash-muted">
                        <a href="tel:+27713126153" className="hover:underline">+27 71 312 6153</a>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Mail className="text-carwash-secondary mr-3 h-6 w-6 shrink-0" />
                    <div>
                      <h4 className="font-medium mb-1 text-carwash-text">Email</h4>
                      <p className="text-carwash-muted">
                        <a href="mailto:hamzah.mainstreetcarwash@gmail.com" className="hover:underline">hamzah.mainstreetcarwash@gmail.com</a>
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-3 text-carwash-text flex items-center">
                    <Clock className="text-carwash-secondary mr-2 h-5 w-5" />
                    Business Hours
                  </h3>
                  <ul className="space-y-2 text-carwash-muted">
                    <li className="flex justify-between">
                      <span>Sunday:</span>
                      <span>9 am–5 pm</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Mon - Thu:</span>
                      <span>8:30 am–5 pm</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Friday:</span>
                      <span>8:30 am–12:30 pm, 1:30–5 pm</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Saturday:</span>
                      <span>8:30 am–5 pm</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              {/* Map */}
              <div className="mt-8 h-80 bg-gray-200 rounded-lg overflow-hidden border border-carwash-border shadow-lg">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3581.5311915116295!2d29.069356576420122!3d-26.142487177238858!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1ee902ecc503e097%3A0x286ee1e6cea83f70!2s24%20Voortrekker%20Rd%2C%20Kinross%2C%202270!5e0!3m2!1sen!2sza!4v1707077834727!5m2!1sen!2sza"
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  loading="lazy"
                  title="Main Street Car Wash Location"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>
    </CarWashLayout>
  );
};

export default CarWashContact;
