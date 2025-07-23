
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Droplet, Car, Check, Star, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CarWashLayout from '@/components/carwash/CarWashLayout';
import SectionHeading from '@/components/ui/SectionHeading';
import ContactButtons from '@/components/ui/ContactButtons';
import Disclaimer from '@/components/carwash/Disclaimer';
import { carWashServices } from '@/data/carWashServices';

const CarWash = () => {
  // Filter to show only Basic Wash, Classic Wash, and Premium Wash on homepage
  const displayWashTypes = carWashServices.filter(service => 
    ['basic-wash', 'classic-wash', 'premium-wash'].includes(service.id)
  );

  const getIconForService = (name: string) => {
    if (name.toLowerCase().includes('exterior') || name.toLowerCase().includes('wash & go')) {
      return <Droplet size={32} className="text-carwash-secondary" />;
    } else if (name.toLowerCase().includes('vacuum') || name.toLowerCase().includes('wash')) {
      return <Car size={32} className="text-carwash-secondary" />;
    } else {
      return <Star size={32} className="text-carwash-secondary" />;
    }
  };

  return (
    <CarWashLayout>
      {/* Hero Section */}
      <section 
        className="h-screen relative flex items-center"
        style={{
          backgroundImage: `url(/2.jpg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Enhanced mobile overlay with bottom fade */}
        <div className="absolute inset-0 bg-black/40 md:bg-black/30"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 md:hidden"></div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-2xl text-center md:text-left" data-aos="fade-right">
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 animate-fade-in leading-tight">
              Main Street <span className="text-carwash-secondary">Car Wash</span>
            </h1>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-medium text-white mb-4 md:mb-6">
              Your car's dirty little secret!
            </h2>
            <div className="max-w-xs sm:max-w-sm md:max-w-lg mx-auto md:mx-0">
              <p className="text-base md:text-lg text-gray-200 mb-8 md:mb-8 leading-relaxed">
                WE OFFER A VARIETY OF VEHICLE CLEANING AND DETAILING SERVICES
              </p>
            </div>
            
            {/* Enhanced mobile buttons with improved spacing and touch targets */}
            <div className="flex flex-col gap-3 mb-12 items-center md:items-start md:flex-row md:gap-4 md:mb-8">
              <Button asChild size="lg" className="w-full sm:w-80 md:w-auto bg-carwash-secondary hover:bg-carwash-accent text-white font-bold shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 rounded-lg py-4 px-8 min-h-[44px]">
                <Link to="/car-wash/services">
                  Our Services
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full sm:w-80 md:w-auto border-2 border-carwash-secondary text-white hover:bg-carwash-secondary hover:text-white font-bold transition-all duration-300 bg-transparent backdrop-blur-sm rounded-lg py-4 px-8 min-h-[44px]">
                <Link to="/car-wash/loyalty">
                  Loyalty Program
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            
            <ContactButtons 
              phoneNumber="071 312 6153" 
              whatsappNumber="071 312 6153"
              alignment="center"
              isCarWash={true}
            />
          </div>
        </div>
        
        {/* Animated scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="animate-bounce">
            <ChevronDown className="h-8 w-8 text-white opacity-80" />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center text-carwash-text mb-2">Our Services</h2>
          <p className="text-xl text-center text-carwash-muted mb-8">Professional car cleaning at affordable prices</p>
          <div className="w-24 h-1 bg-carwash-secondary mx-auto mb-12"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {displayWashTypes.map((washType) => {
              const features = washType.description.split('. ').filter(Boolean);
              
              return (
                <div
                  key={washType.id}
                  className={`bg-white rounded-lg shadow-lg overflow-hidden relative h-full flex flex-col border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                    washType.popular ? "border-carwash-secondary shadow-orange-100" : "border-carwash-border"
                  }`}
                >
                  {washType.popular && (
                    <div className="absolute top-0 right-0 bg-carwash-secondary text-white px-4 py-1 text-sm font-bold rounded-bl-lg">
                      POPULAR
                    </div>
                  )}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-center mb-6">
                      <div className="w-16 h-16 bg-carwash-secondary/10 rounded-full flex items-center justify-center">
                        {getIconForService(washType.name)}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-carwash-text text-center mb-4">
                      {washType.name}
                    </h3>
                    <p className="text-carwash-secondary font-bold text-center text-2xl mb-6">
                      R{washType.price}
                    </p>
                    <div className="flex-1">
                      <ul className="space-y-3">
                        {features.map((feature, i) => (
                          <li key={i} className="flex items-center text-carwash-text">
                            <Check size={16} className="text-carwash-secondary mr-2 shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-6 pt-4 border-t border-carwash-border">
                      <Link 
                        to="/car-wash/services" 
                        className="block text-center py-2 bg-carwash-secondary text-white rounded-md hover:bg-carwash-accent transition-colors font-medium"
                      >
                        Learn More
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-12 text-center">
            <Link 
              to="/car-wash/services"
              className="inline-flex items-center text-carwash-secondary hover:text-carwash-accent font-medium transition-colors"
            >
              View All Services
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          
          <div className="mt-12">
            <Disclaimer collapsible={true} className="max-w-3xl mx-auto" />
          </div>
        </div>
      </section>
      
      {/* Loyalty Program Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-carwash-text mb-6">Loyalty Program</h2>
              
              <div className="space-y-4">
                <p className="text-carwash-muted">
                  As a valued customer, you can join our loyalty program and earn rewards for every wash.
                  After just 6 washes, you'll receive a FREE exterior wash – our way of saying thank you
                  for your continued support.
                </p>
                
                <h3 className="text-lg font-semibold text-carwash-text">How It Works:</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="bg-carwash-secondary text-white rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5 mr-3 text-sm font-bold">1</div>
                    <p className="text-carwash-muted">Sign up for our loyalty program in person at Main Street Car Wash</p>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-carwash-secondary text-white rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5 mr-3 text-sm font-bold">2</div>
                    <p className="text-carwash-muted">Our staff will register you in our system and track your visits</p>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-carwash-secondary text-white rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5 mr-3 text-sm font-bold">3</div>
                    <p className="text-carwash-muted">Complete 6 car washes (any service level qualifies)</p>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-carwash-secondary text-white rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5 mr-3 text-sm font-bold">4</div>
                    <p className="text-carwash-muted">Receive a complimentary exterior wash on your next visit</p>
                  </li>
                </ul>
                
                <div className="mt-8">
                  <Button asChild className="bg-carwash-secondary hover:bg-carwash-accent text-white shadow-lg">
                    <Link to="/car-wash/loyalty">
                      Learn More About Rewards
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg overflow-hidden shadow-xl p-8 border border-carwash-border">
              <img 
                src="/lovable-uploads/fec2a49c-b102-4788-8d97-a494921755a0.png" 
                alt="Car Wash Loyalty" 
                className="w-full h-auto object-cover rounded-lg shadow-md"
              />
              <h3 className="text-2xl font-bold text-carwash-text mt-6 mb-4 text-center">Loyalty Program</h3>
              <p className="text-carwash-muted text-center">
                Complete 6 washes for a FREE wash.<br />
                Join in person at our location. No app download required!
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Gallery Preview */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeading
            title="Car Wash Gallery"
            subtitle="See our facility and sparkling clean results"
            alignment="center"
            isCarWash={true}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
            <div className="relative group overflow-hidden rounded-lg h-60 border border-carwash-border hover:shadow-lg transition-all">
              <img 
                src="/lovable-uploads/0c9bda8d-8607-4099-988a-e8733b9bca11.png" 
                alt="Main Street Car Wash Services Board" 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <div className="p-4">
                  <h4 className="text-white font-bold">Our Services Board</h4>
                </div>
              </div>
            </div>
            <div className="relative group overflow-hidden rounded-lg h-60 border border-carwash-border hover:shadow-lg transition-all">
              <img 
                src="/lovable-uploads/635b8771-eb1a-4b4c-994a-dd5fd97a7bbd.png" 
                alt="Premium Car Wash Service" 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <div className="p-4">
                  <h4 className="text-white font-bold">Premium Car Service</h4>
                </div>
              </div>
            </div>
            <div className="relative group overflow-hidden rounded-lg h-60 border border-carwash-border hover:shadow-lg transition-all">
              <img 
                src="/lovable-uploads/b6165639-1ff7-4227-8012-937d77caa482.png" 
                alt="Professional Car Washing" 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <div className="p-4">
                  <h4 className="text-white font-bold">Professional Car Washing</h4>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Button asChild className="bg-carwash-secondary hover:bg-carwash-accent text-white shadow-lg">
              <Link to="/car-wash/gallery">
                View Full Gallery
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-carwash-text mb-4">Ready for a Sparkling Clean Car?</h2>
            <p className="text-lg text-carwash-muted mb-8">
              Visit us today at Main Street Car Wash in Kinross, or call us to learn more about our services.
            </p>
            <ContactButtons 
              phoneNumber="071 312 6153" 
              whatsappNumber="071 312 6153"
              alignment="center"
              isCarWash={true}
            />
          </div>
        </div>
      </section>
    </CarWashLayout>
  );
};

export default CarWash;
