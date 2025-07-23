
import { Phone, MessageSquare } from 'lucide-react';
import { Button } from './button';

interface ContactButtonsProps {
  phoneNumber?: string;
  whatsappNumber?: string;
  alignment?: 'left' | 'center' | 'right';
  isCarWash?: boolean;
  carDetails?: {
    make?: string;
    model?: string;
    year?: number;
  };
  isMobileCompact?: boolean;
}

const ContactButtons = ({ 
  phoneNumber = "+27713126153", 
  whatsappNumber = "+27713126153", 
  alignment = 'left',
  isCarWash = false,
  carDetails,
  isMobileCompact = false
}: ContactButtonsProps) => {
  // Format phone numbers to remove spaces and any special characters
  const cleanPhoneNumber = phoneNumber.replace(/\D/g, '');
  const cleanWhatsappNumber = whatsappNumber.replace(/\D/g, '');
  
  // Ensure we don't double the country code
  const formattedPhoneNumber = cleanPhoneNumber.startsWith('27') ? cleanPhoneNumber : `27${cleanPhoneNumber}`;
  const formattedWhatsappNumber = cleanWhatsappNumber.startsWith('27') ? cleanWhatsappNumber : `27${cleanWhatsappNumber}`;
  
  // Prepare WhatsApp message if car details are provided
  let whatsappMessage = "";
  if (carDetails) {
    whatsappMessage = encodeURIComponent(`Hello, I'm interested in the ${carDetails.year} ${carDetails.make} ${carDetails.model} that I saw on your website. Can you provide more information?`);
  } else {
    whatsappMessage = encodeURIComponent("Hello, I'm interested in your services. Can you provide more information?");
  }
  
  // Apply alignment classes
  let alignmentClass = '';
  if (alignment === 'center') alignmentClass = 'justify-center';
  else if (alignment === 'right') alignmentClass = 'justify-end';
  
  // Theme colors
  const primaryColor = isCarWash ? 'bg-carwash-secondary' : 'bg-dealership-secondary';
  const textColor = isCarWash ? 'text-carwash-primary' : 'text-dealership-primary';
  const outlineColor = isCarWash ? 'border-carwash-secondary text-carwash-secondary' : 'border-dealership-secondary text-dealership-secondary';

  // Modified classes to ensure buttons are always side-by-side
  const containerClasses = `flex flex-row gap-2 ${alignmentClass} w-full`;
  
  const buttonSizeClasses = isMobileCompact
    ? "text-sm py-1.5 h-auto" 
    : "py-1.5 h-auto";

  return (
    <div className={containerClasses}>
      <a href={`tel:+${formattedPhoneNumber}`} className="flex-1">
        <Button
          className={`${primaryColor} ${textColor} hover:opacity-90 w-full ${buttonSizeClasses}`}
          size={isMobileCompact ? "sm" : "default"}
        >
          <Phone className="mr-1.5 h-3.5 w-3.5" />
          <span className="hidden xs:inline">Call</span> Now
        </Button>
      </a>
      
      <a 
        href={`https://wa.me/${formattedWhatsappNumber}${whatsappMessage ? `?text=${whatsappMessage}` : ''}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1"
      >
        <Button
          variant="outline"
          className={`${outlineColor} hover:bg-opacity-10 w-full ${buttonSizeClasses}`}
          size={isMobileCompact ? "sm" : "default"}
        >
          <MessageSquare className="mr-1.5 h-3.5 w-3.5" />
          <span className="hidden xs:inline">WhatsApp</span>
        </Button>
      </a>
    </div>
  );
};

export default ContactButtons;
