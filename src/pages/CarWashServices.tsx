
import React from 'react';
import CarWashLayout from '@/components/carwash/CarWashLayout';
import { Check } from 'lucide-react';
import ContactButtons from '@/components/ui/ContactButtons';
import Disclaimer from '@/components/carwash/Disclaimer';
import { carWashServices } from '@/data/carWashServices';

const CarWashServices = () => {
  // Function to get features from description
  const getFeatures = (description: string): string[] => {
    return description.split('. ').filter(Boolean);
  };

  return (
    <CarWashLayout>
      {/* Header */}
      <section className="pt-32 pb-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-carwash-text mb-4">Our Services</h1>
            <p className="text-lg text-carwash-muted mb-4">Professional car cleaning at affordable prices</p>
            <div className="mt-4 w-24 h-1 bg-carwash-secondary mx-auto"></div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {carWashServices.map((washType) => {
              const features = getFeatures(washType.description);
              
              return (
                <div
                  key={washType.id}
                  className={`bg-white rounded-lg shadow-lg overflow-hidden relative border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                    washType.popular ? "border-carwash-secondary shadow-orange-100" : "border-carwash-border"
                  }`}
                >
                  {washType.popular && (
                    <div className="absolute top-0 right-0 bg-carwash-secondary text-white px-3 py-1 text-xs font-bold rounded-bl-lg z-10">
                      POPULAR
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-carwash-text text-center mb-2">
                      {washType.name}
                    </h3>
                    <p className="text-carwash-secondary font-bold text-center text-xl mb-2">
                      R{washType.price}
                    </p>
                    <p className="text-carwash-muted text-center mb-4 text-sm">
                      Professional car cleaning service
                    </p>

                    <div className="mt-4">
                      <ul className="space-y-2">
                        {features.map((feature, i) => (
                          <li key={i} className="flex items-start text-carwash-text text-sm">
                            <Check
                              size={14}
                              className="text-carwash-secondary mr-2 mt-0.5 shrink-0"
                            />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-16">
            <Disclaimer collapsible={true} className="max-w-3xl mx-auto" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-carwash-text mb-4">Ready to Book Your Car Wash?</h2>
            <p className="text-lg text-carwash-muted mb-8">
              Visit us today or call us to schedule an appointment
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

export default CarWashServices;
