
import { Link } from 'react-router-dom';
import { Phone, MapPin, Mail, Instagram, Facebook, Clock } from 'lucide-react';
import Disclaimer from '@/components/carwash/Disclaimer';

interface FooterProps {
  isCarWash?: boolean;
}

const Footer = ({ isCarWash = false }: FooterProps) => {
  const themeClass = isCarWash ? 'bg-gray-900' : 'bg-dealership-primary';
  const accentClass = isCarWash ? 'text-carwash-secondary' : 'text-dealership-secondary';
  const accentBgClass = isCarWash ? 'bg-carwash-secondary' : 'bg-dealership-secondary';
  const businessName = isCarWash ? 'Main Street Car Wash' : 'We Do Cheapies';
  const emailAddress = isCarWash ? 'hamzah.mainstreetcarwash@gmail.com' : 'wedocheapies@gmail.com';
  
  // Social media links based on business type
  const socialLinks = isCarWash ? {
    instagram: 'https://www.instagram.com/mainstreet_carwash/',
    facebook: 'https://www.facebook.com/share/15XYX1s2DH/'
  } : {
    instagram: 'https://www.instagram.com/wedocheapies.co.za',
    facebook: 'https://www.facebook.com/p/WE-Do-Cheapies-coza-100063897132120/'
  };
  
  return (
    <footer className={`${themeClass} text-white pt-12 pb-6`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div>
            <h3 className={`text-xl font-bold mb-4 border-b ${isCarWash ? 'border-carwash-secondary' : 'border-dealership-secondary'} pb-2`}>Contact Us</h3>
            <ul className="space-y-3">
              <li>
                <a href="tel:+27713126153" className="flex items-center gap-3 hover:underline">
                  <Phone className={accentClass} size={18} />
                  <span>+27 71 312 6153</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://www.google.com/maps/place/We+Do+Cheapies/@-26.4212642,29.0906497,17z/data=!3m1!4b1!4m6!3m5!1s0x1eeb17ba360eba83:0x11c8d90d1cfcc1c3!8m2!3d-26.4212642!4d29.0932246!16s%2Fg%2F11ycfqmsn5?entry=ttu&g_ep=EgoyMDI1MDUyMS4wIKXMDSoASAFQAw%3D%3D" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-3 hover:underline"
                >
                  <MapPin className={accentClass} size={18} />
                  <span>24 Voortrekker Rd, Kinross, Mpumalanga</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${emailAddress}`} className="flex items-center gap-3 hover:underline">
                  <Mail className={accentClass} size={18} />
                  <span>{emailAddress}</span>
                </a>
              </li>
            </ul>
            <div className="mt-6">
              <h4 className="font-medium mb-2">Follow Us:</h4>
              <div className="flex space-x-3">
                <a 
                  href={socialLinks.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={`${accentBgClass} p-2 rounded-full hover:opacity-80 transition-opacity`}
                >
                  <Instagram size={18} className="text-white" />
                </a>
                <a 
                  href={socialLinks.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={`${accentBgClass} p-2 rounded-full hover:opacity-80 transition-opacity`}
                >
                  <Facebook size={18} className="text-white" />
                </a>
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div>
            <h3 className={`text-xl font-bold mb-4 border-b ${isCarWash ? 'border-carwash-secondary' : 'border-dealership-secondary'} pb-2`}>Business Hours</h3>
            <ul className="space-y-2">
              <li className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Clock className={accentClass} size={16} />
                  <span>Sunday:</span>
                </div>
                <span>{isCarWash ? '9 am–5 pm' : 'Closed'}</span>
              </li>
              <li className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Clock className={accentClass} size={16} />
                  <span>Monday:</span>
                </div>
                <span>8:30 am–5 pm</span>
              </li>
              <li className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Clock className={accentClass} size={16} />
                  <span>Tuesday:</span>
                </div>
                <span>8:30 am–5 pm</span>
              </li>
              <li className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Clock className={accentClass} size={16} />
                  <span>Wednesday:</span>
                </div>
                <span>8:30 am–5 pm</span>
              </li>
              <li className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Clock className={accentClass} size={16} />
                  <span>Thursday:</span>
                </div>
                <span>8:30 am–5 pm</span>
              </li>
              <li className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Clock className={accentClass} size={16} />
                  <span>Friday:</span>
                </div>
                <div className="text-right">
                  <span>8:30 am–12:30 pm</span>
                  <br />
                  <span>1:30–5 pm</span>
                </div>
              </li>
              <li className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Clock className={accentClass} size={16} />
                  <span>Saturday:</span>
                </div>
                <span>{isCarWash ? '8:30 am–5 pm' : '8:30 am–1 pm'}</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className={`text-xl font-bold mb-4 border-b ${isCarWash ? 'border-carwash-secondary' : 'border-dealership-secondary'} pb-2`}>Quick Links</h3>
            <ul className="space-y-2">
              {isCarWash ? (
                <>
                  <li>
                    <Link to="/car-wash" className="hover:underline">Home</Link>
                  </li>
                  <li>
                    <Link to="/car-wash/services" className="hover:underline">Services</Link>
                  </li>
                  <li>
                    <Link to="/car-wash/loyalty" className="hover:underline">Loyalty Program</Link>
                  </li>
                  <li>
                    <Link to="/car-wash/gallery" className="hover:underline">Gallery</Link>
                  </li>
                  <li>
                    <Link to="/car-wash/contact" className="hover:underline">Contact</Link>
                  </li>
                  <li className="pt-2 mt-4 border-t border-white/20">
                    <Link to="/" className={accentClass + " hover:underline font-medium"}>Visit Our Car Dealership</Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/" className="hover:underline">Home</Link>
                  </li>
                  <li>
                    <Link to="/inventory" className="hover:underline">Inventory</Link>
                  </li>
                  <li>
                    <Link to="/services" className="hover:underline">Services</Link>
                  </li>
                  <li>
                    <Link to="/car-trade" className="hover:underline">Sell Your Car</Link>
                  </li>
                  <li>
                    <Link to="/contact" className="hover:underline">Contact</Link>
                  </li>
                  <li>
                    <Link to="/about" className="hover:underline">About Us</Link>
                  </li>
                  <li className="pt-2 mt-4 border-t border-white/20">
                    <Link to="/car-wash" className={accentClass + " hover:underline font-medium"}>Visit Our Car Wash</Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>

        {/* Car Wash Disclaimer */}
        {isCarWash && (
          <div className="mt-8 pt-4 border-t border-white/10 max-w-4xl mx-auto">
            <Disclaimer variant="footer" />
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-white/10 text-center text-sm text-gray-300">
          <p>&copy; {new Date().getFullYear()} {businessName}. All Rights Reserved.</p>
          <p className="mt-1">Website designed by <a href="/" className="hover:underline font-bold text-green-400">ScaleUp</a></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
