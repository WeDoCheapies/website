
import Layout from '@/components/layout/Layout';
import SectionHeading from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Phone, Settings, Wrench } from 'lucide-react';

const Services = () => {
  return (
    <Layout>
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeading
            title="Our Services"
            subtitle="Comprehensive automotive solutions for your needs"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {/* Car Sales */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-dealership-secondary h-20 flex items-center justify-center">
                <Settings className="h-12 w-12 text-dealership-primary" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3">Car Sales</h3>
                <p className="text-gray-600 mb-4">
                  Browse our selection of quality used vehicles at affordable prices. Each vehicle undergoes 
                  a thorough inspection to ensure reliability and performance.
                </p>
                <Button asChild className="w-full bg-dealership-secondary text-dealership-primary hover:bg-dealership-secondary/90">
                  <Link to="/inventory">View Inventory</Link>
                </Button>
              </div>
            </div>
            
            {/* Car Buying */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-dealership-secondary h-20 flex items-center justify-center">
                <Phone className="h-12 w-12 text-dealership-primary" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3">Car Buying</h3>
                <p className="text-gray-600 mb-4">
                  Looking to sell your vehicle? We offer competitive cash offers for your car. 
                  Our process is straightforward and hassle-free.
                </p>
                <Button asChild className="w-full bg-dealership-secondary text-dealership-primary hover:bg-dealership-secondary/90">
                  <Link to="/car-trade">Sell Your Car</Link>
                </Button>
              </div>
            </div>
            
            {/* Vehicle Financing */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-dealership-secondary h-20 flex items-center justify-center">
                <Wrench className="h-12 w-12 text-dealership-primary" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3">Vehicle Financing</h3>
                <p className="text-gray-600 mb-4">
                  We work with various financial institutions to help you secure the best financing 
                  options for your new vehicle purchase.
                </p>
                <Button asChild className="w-full bg-dealership-secondary text-dealership-primary hover:bg-dealership-secondary/90">
                  <Link to="/finance">Finance Options</Link>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Additional Services Section */}
          <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">Additional Services</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold mb-3">Vehicle Registration</h4>
                <p className="text-gray-600">
                  We assist with all vehicle registration and licensing requirements, making the process 
                  seamless for our customers.
                </p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold mb-3">Vehicle Inspection</h4>
                <p className="text-gray-600">
                  Our team conducts thorough vehicle inspections to ensure all vehicles meet safety standards 
                  and are in good condition.
                </p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold mb-3">Insurance Assistance</h4>
                <p className="text-gray-600">
                  We can help you find suitable insurance options for your newly purchased vehicle.
                </p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold mb-3">Car Wash Services</h4>
                <p className="text-gray-600">
                  We offer premium car wash services to keep your vehicle looking its best. Visit our car wash section for more details.
                </p>
                <Button asChild variant="link" className="mt-2 p-0 text-dealership-secondary">
                  <Link to="/car-wash">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Contact CTA */}
          <div className="mt-12 bg-dealership-primary rounded-lg shadow-lg p-8 text-center">
            <h3 className="text-2xl font-bold mb-3 text-white">Have Questions About Our Services?</h3>
            <p className="text-white mb-6 max-w-2xl mx-auto">
              Our team is ready to assist you with any inquiries you may have about our services. 
              Contact us today for more information.
            </p>
            <Button asChild className="bg-dealership-secondary text-dealership-primary hover:bg-dealership-secondary/90">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Services;
