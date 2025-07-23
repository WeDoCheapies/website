
import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import SectionHeading from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Mail, Phone, Send, Loader2 } from 'lucide-react';
import ContactButtons from '@/components/ui/ContactButtons';
import emailjs from 'emailjs-com';

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    
    setIsSubmitting(true);

    try {
      console.log('Sending email via EmailJS...');
      
      const templateParams = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        to_email: 'wedocheapies@gmail.com'
      };

      console.log('Template params:', templateParams);

      const result = await emailjs.send(
        'service_r4il797',
        'template_6icxakb',
        templateParams,
        'AwVjWC3Zh6MBylwH-'
      );

      console.log('EmailJS result:', result);

      toast({
        title: "Message Sent",
        description: "Thank you for contacting us. We'll get back to you shortly.",
      });

      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
      });
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
    <Layout>
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-4">Contact Us</h1>
            <p className="text-lg text-gray-300 mb-4">Get in touch with our team</p>
            <div className="w-24 h-1 bg-dealership-secondary mb-6"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold mb-6 text-gray-800">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-dealership-secondary p-3 rounded-full">
                    <Phone className="h-6 w-6 text-dealership-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Phone</h4>
                    <p className="text-gray-600 mt-1">
                      <a href="tel:+27713126153" className="hover:underline">+27 71 312 6153</a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-dealership-secondary p-3 rounded-full">
                    <Mail className="h-6 w-6 text-dealership-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Email</h4>
                    <p className="text-gray-600 mt-1">
                      <a href="mailto:wedocheapies@gmail.com" className="hover:underline">wedocheapies@gmail.com</a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-dealership-secondary p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-dealership-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Location</h4>
                    <p className="text-gray-600 mt-1">
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
              </div>
              
              <div className="mt-6">
                <ContactButtons />
              </div>

              {/* Map */}
              <div className="mt-8 rounded-lg overflow-hidden h-[300px] border border-gray-200">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3577.133835732697!2d29.090649715616776!3d-26.421264183364345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1eeb17ba360eba83%3A0x11c8d90d1cfcc1c3!2sWe%20Do%20Cheapies!5e0!3m2!1sen!2sus!4v1652428791551!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="We Do Cheapies Location"
                ></iframe>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold mb-6 text-gray-800">Send Us a Message</h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    required
                    placeholder="Write your message here..."
                  />
                </div>
                
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
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
