
import Layout from '@/components/layout/Layout';
import ContactButtons from '@/components/ui/ContactButtons';
import { MapPin, Mail, Clock, Phone } from 'lucide-react';

const About = () => {
  return (
    <Layout>
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-4">About We Do Cheapies</h1>
                <p className="text-lg text-gray-300 mb-4">Your trusted car dealership in Kinross</p>
                <div className="w-24 h-1 bg-dealership-secondary mb-6"></div>
              </div>
              
              <div className="text-white space-y-4">
                <p>
                  We Do Cheapies is a premier car dealership located in Kinross, South Africa, 
                  specializing in quality used vehicles at competitive prices. Established with the 
                  mission to provide reliable cars and exceptional customer service, we've built a 
                  reputation for honesty and integrity in the auto industry.
                </p>
                
                <p>
                  We understand that buying a car is a significant investment, which is why we 
                  thoroughly inspect and verify the history of every vehicle on our lot. Our team 
                  of experienced professionals is committed to helping you find the perfect car 
                  that fits your needs and budget.
                </p>
                
                <p>
                  In addition to our car sales, we also offer car buying services where we provide 
                  competitive cash offers for your vehicle. Our process is straightforward and 
                  hassle-free, ensuring you get the best value for your car.
                </p>
              </div>
              
              <div className="mt-8">
                <ContactButtons 
                  phoneNumber="071 312 6153" 
                  whatsappNumber="071 312 6153" 
                  alignment="left"
                />
              </div>
            </div>
            
            <div>
              <img 
                src="/lovable-uploads/1dd40d96-361f-4c12-81f4-126540c39a9f.png" 
                alt="We Do Cheapies Dealership" 
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
