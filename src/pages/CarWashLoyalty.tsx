
import CarWashLayout from '@/components/carwash/CarWashLayout';
import SectionHeading from '@/components/ui/SectionHeading';
import { Star, Award, Gift, Check } from 'lucide-react';

const CarWashLoyalty = () => {
  return (
    <CarWashLayout>
      <div className="pt-24 pb-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeading
            title="Wash More, Get Rewarded!"
            subtitle="Our simple loyalty program rewards you for choosing us"
            alignment="center"
            isCarWash={true}
          />

          {/* Main card with loyalty program details */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mt-8 border border-carwash-border">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-8">
                <h2 className="text-2xl font-bold mb-4 text-carwash-text">How Our Loyalty Program Works</h2>
                <p className="text-carwash-muted mb-6">
                  At Main Street Car Wash, we appreciate our loyal customers. Our simple loyalty program 
                  rewards you for choosing us for your car washing needs. No complicated apps or points 
                  systems – just straightforward rewards!
                </p>
                
                <div className="space-y-6">
                  <div className="flex">
                    <div className="mr-4 bg-carwash-secondary text-white w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                      <span className="font-bold">1</span>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1 text-carwash-text">Sign Up In Person</h3>
                      <p className="text-carwash-muted">Visit our location and ask our staff to sign you up for the loyalty program. We'll collect your basic contact information.</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="mr-4 bg-carwash-secondary text-white w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                      <span className="font-bold">2</span>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1 text-carwash-text">We Track Your Washes</h3>
                      <p className="text-carwash-muted">Every time you visit, we'll record your wash in our system. No need to carry a physical card or download an app.</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="mr-4 bg-carwash-secondary text-white w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                      <span className="font-bold">3</span>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1 text-carwash-text">Earn Free Washes</h3>
                      <p className="text-carwash-muted">After every 6 washes (any service level qualifies), you'll receive a complimentary Exterior Wash on your next visit.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-carwash-secondary to-carwash-accent text-white p-8 flex flex-col justify-center">
                <div className="text-center">
                  <div className="inline-block bg-white/20 p-4 rounded-full mb-6">
                    <Star className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-8">Loyalty Program</h3>
                  <div className="rounded-lg overflow-hidden bg-white/10 p-4">
                    <img 
                      src="/lovable-uploads/fec2a49c-b102-4788-8d97-a494921755a0.png" 
                      alt="Car Wash Facility" 
                      className="max-w-full h-auto object-cover rounded-lg"
                    />
                  </div>
                  <p className="mt-6 text-white/90 text-sm">
                    Complete 6 washes for a FREE Exterior Wash.
                    Our staff will keep track of your progress when you visit.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="mt-16">
            <SectionHeading
              title="Loyalty Program Benefits"
              subtitle="More than just free washes"
              alignment="center"
              isCarWash={true}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div className="bg-white rounded-lg shadow-md p-6 text-center border border-carwash-border">
                <div className="inline-block p-3 bg-carwash-secondary/10 rounded-full mb-4">
                  <Gift className="h-8 w-8 text-carwash-secondary" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-carwash-text">Free Washes</h3>
                <p className="text-carwash-muted">
                  Earn a free exterior wash after every 6 visits, regardless of which service you choose.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 text-center border border-carwash-border">
                <div className="inline-block p-3 bg-carwash-secondary/10 rounded-full mb-4">
                  <Award className="h-8 w-8 text-carwash-secondary" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-carwash-text">Priority Service</h3>
                <p className="text-carwash-muted">
                  Loyalty members receive priority scheduling during our busiest times.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 text-center border border-carwash-border">
                <div className="inline-block p-3 bg-carwash-secondary/10 rounded-full mb-4">
                  <Star className="h-8 w-8 text-carwash-secondary" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-carwash-text">Exclusive Offers</h3>
                <p className="text-carwash-muted">
                  Receive special promotions and seasonal discounts only available to loyalty program members.
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16">
            <SectionHeading
              title="Frequently Asked Questions"
              subtitle="Everything you need to know about our loyalty program"
              alignment="center"
              isCarWash={true}
            />

            <div className="bg-white rounded-lg shadow-lg overflow-hidden mt-8 border border-carwash-border">
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center text-carwash-text">
                    <Check size={18} className="text-carwash-secondary mr-2" />
                    How do I sign up for the loyalty program?
                  </h3>
                  <p className="pl-6 text-carwash-muted">
                    Simply visit our location and ask one of our staff members to sign you up. We'll collect your name and phone number to track your visits.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center text-carwash-text">
                    <Check size={18} className="text-carwash-secondary mr-2" />
                    Do all car wash services count toward my loyalty rewards?
                  </h3>
                  <p className="pl-6 text-carwash-muted">
                    Yes, all car wash services count as a visit, from a basic exterior wash to a full valet service.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center text-carwash-text">
                    <Check size={18} className="text-carwash-secondary mr-2" />
                    How long do I have to use my free wash?
                  </h3>
                  <p className="pl-6 text-carwash-muted">
                    Your free wash reward does not expire. Once earned, you can claim it on any future visit at your convenience.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center text-carwash-text">
                    <Check size={18} className="text-carwash-secondary mr-2" />
                    Can I upgrade my free exterior wash to a different service?
                  </h3>
                  <p className="pl-6 text-carwash-muted">
                    Yes, you can upgrade your free exterior wash to any of our premium services by paying just the price difference.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center text-carwash-text">
                    <Check size={18} className="text-carwash-secondary mr-2" />
                    What if I forget to mention I'm a loyalty member when I visit?
                  </h3>
                  <p className="pl-6 text-carwash-muted">
                    If you forget to mention you're a loyalty member, just let us know on your next visit with your receipt, and we'll add the missing visit to your loyalty count.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Join Today Section */}
          <div className="mt-16">
            <div className="bg-gradient-to-r from-carwash-secondary to-carwash-accent rounded-lg shadow-lg overflow-hidden">
              <div className="p-8 text-center">
                <h2 className="text-2xl font-bold text-white mb-4">Join Our Loyalty Program Today!</h2>
                <p className="text-white/90 mb-6">
                  Visit Main Street Car Wash at 24 Voortrekker Rd, Kinross and ask our friendly staff about enrolling in our loyalty program. Start earning rewards with your very first wash!
                </p>
                <div className="inline-flex items-center justify-center bg-white text-carwash-text px-6 py-3 rounded-lg font-bold">
                  No App Required • Simple to Join • Great Rewards
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CarWashLayout>
  );
};

export default CarWashLoyalty;
