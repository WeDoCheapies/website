import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Car, CircleDollarSign, Search, CarFront } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';
import ContactButtons from '@/components/ui/ContactButtons';
import SectionHeading from '@/components/ui/SectionHeading';
import FeaturedCars from '@/components/home/FeaturedCars';

const Home = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section 
        className="relative bg-dealership-primary flex items-center min-h-screen py-0"
        style={{
          backgroundImage: `linear-gradient(rgba(26, 31, 44, 0.75), rgba(26, 31, 44, 0.85)), url('/lovable-uploads/ca74d3e2-e86d-46e1-90f1-42ef7322c714.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '100vh'
        }}
      >
        <div className="container mx-auto px-4 md:px-6 relative z-10 flex flex-col justify-center h-full">
          <div className="max-w-2xl mx-auto text-center" data-aos="fade-right">
            <h1 className="text-2xl md:text-5xl lg:text-6xl font-bold text-white mb-1 md:mb-4 animate-fade-in">
              We Do <span className="text-dealership-secondary">Cheapies</span>
            </h1>
            <h2 className="text-lg md:text-3xl font-medium text-white mb-2 md:mb-6">
              We Buy & Sell Cars for Cash
            </h2>
            <p className="text-sm md:text-lg text-gray-300 mb-20 md:mb-8">
              Quality used cars at affordable prices in Kinross, South Africa. Browse our inventory or get a free evaluation for your vehicle.
            </p>
            <div className="flex flex-col gap-2 mb-3 md:mb-8">
              <Button asChild size="lg" className="bg-dealership-secondary text-dealership-primary font-medium hover:bg-dealership-secondary/90 shadow-md py-2 h-auto">
                <Link to="/inventory" className="flex items-center justify-center">
                  View Inventory
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            <div className="mt-2">
              <ContactButtons 
                phoneNumber="071 312 6153" 
                whatsappNumber="071 312 6153"
                alignment="center"
                isMobileCompact={true}
              />
            </div>
          </div>
        </div>
        <div className="absolute bottom-4 left-0 right-0 flex justify-center animate-bounce">
          <a href="#services" className="text-white p-2">
            <ArrowRight className="transform rotate-90 h-6 w-6" />
          </a>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeading 
            title="Our Services"
            subtitle="Everything you need for your vehicle journey"
            alignment="center"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {/* Car Sales */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:-translate-y-2 flex flex-col">
              <div className="h-48 bg-dealership-primary flex items-center justify-center">
                <Car size={80} className="text-dealership-secondary" />
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-xl font-bold mb-3">Car Sales</h3>
                <p className="text-gray-600 mb-4 flex-grow">Browse our extensive inventory of quality used vehicles. All makes and models available at competitive prices.</p>
                <Link to="/inventory" className="text-dealership-secondary font-medium flex items-center hover:underline mt-auto">
                  View Inventory
                  <ArrowRight size={16} className="ml-1" />
                </Link>
              </div>
            </div>
            
            {/* Car Buying */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:-translate-y-2 flex flex-col">
              <div className="h-48 bg-dealership-primary flex items-center justify-center">
                <CircleDollarSign size={80} className="text-dealership-secondary" />
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-xl font-bold mb-3">We Buy Cars</h3>
                <p className="text-gray-600 mb-4 flex-grow">Sell your car to us for cash. Get a free evaluation.</p>
                <Link to="/about" className="text-dealership-secondary font-medium flex items-center hover:underline mt-auto">
                  Get Evaluation
                  <ArrowRight size={16} className="ml-1" />
                </Link>
              </div>
            </div>
            
            {/* Car Wash */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:-translate-y-2 flex flex-col">
              <div className="h-48 bg-carwash-primary flex items-center justify-center">
                <CarFront size={80} className="text-carwash-secondary" />
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-xl font-bold mb-3">Car Wash Services</h3>
                <p className="text-gray-600 mb-4 flex-grow">Keep your vehicle looking its best with our professional car wash services at Main Street Car Wash.</p>
                <Link to="/car-wash" className="text-carwash-secondary font-medium flex items-center hover:underline mt-auto">
                  Explore Services
                  <ArrowRight size={16} className="ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Cars Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">Featured Vehicles</h2>
            <p className="text-gray-600 mt-2">Hand-picked quality vehicles at competitive prices</p>
          </div>
          
          <FeaturedCars />
        </div>
      </section>
      
      {/* CTA Section */}
      <section 
        className="py-20 bg-dealership-primary relative"
        style={{
          backgroundImage: `linear-gradient(rgba(26, 31, 44, 0.85), rgba(26, 31, 44, 0.9)), url('/lovable-uploads/d7a5d118-d06a-4761-9827-3866d737cb79.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Looking to Sell Your Car?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              We buy cars for cash. Free evaluation. All trade-in’s are welcome.
            </p>
            <div className="flex justify-center">
              <Button asChild size="lg" className="bg-dealership-secondary text-dealership-primary hover:bg-dealership-secondary/90">
                <Link to="/car-trade">
                  Learn More
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
