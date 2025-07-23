
import React, { useState } from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface DisclaimerProps {
  variant?: 'full' | 'summary' | 'receipt' | 'footer';
  className?: string;
  collapsible?: boolean;
}

const Disclaimer: React.FC<DisclaimerProps> = ({ 
  variant = 'full',
  className = '',
  collapsible = false
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Summary text
  const summaryText = "We advise removing all valuables. Services are rendered at owner's risk.";
  
  // Receipt text - now using the full disclaimer
  const receiptText = "DISCLAIMER: Main Street Car Wash will exercise care on all our clients' vehicles, i.e., contents, body work, interior, and otherwise. However, we wish to inform our clients of the following: Please remove all valuables from vehicles. Main Street Car Wash will not be held responsible for any loss or damage for any reason whatsoever to the vehicle, including both interior and exterior. Goods left on the premises are at the customer's OWN RISK. Before leaving the premises, please ensure that all your vehicle's floor mats are correct and properly placed back into your vehicle.";

  const renderDisclaimerContent = () => {
    switch (variant) {
      case 'summary':
        return (
          <div className="text-sm text-gray-800">
            {summaryText}
          </div>
        );
      case 'receipt':
        return (
          <div className="text-xs text-gray-800 mt-2">
            {receiptText}
          </div>
        );
      case 'footer':
        return (
          <div className="text-xs text-gray-300 mt-2">
            {receiptText}
          </div>
        );
      case 'full':
      default:
        return (
          <div className="text-sm space-y-2 text-gray-800">
            <p className="font-semibold">DISCLAIMER</p>
            <p>Main Street Car Wash will exercise care on all our clients' vehicles, i.e., contents, body work, interior, and otherwise.</p>
            <p>However, we wish to inform our clients of the following:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Please remove all valuables from vehicles.</li>
              <li>Main Street Car Wash will not be held responsible for any loss or damage for any reason whatsoever to the vehicle, including both interior and exterior.</li>
              <li>Goods left on the premises are at the customer's OWN RISK.</li>
              <li>Before leaving the premises, please ensure that all your vehicle's floor mats are correct and properly placed back into your vehicle.</li>
            </ul>
          </div>
        );
    }
  };

  if (collapsible) {
    return (
      <Collapsible 
        open={isOpen} 
        onOpenChange={setIsOpen}
        className={`border border-gray-700 rounded-md overflow-hidden bg-gray-800/50 ${className}`}
      >
        <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left">
          <div className="flex items-center">
            <AlertCircle className="text-carwash-secondary mr-2 h-5 w-5" />
            <span className="text-sm font-medium text-gray-200">{summaryText}</span>
          </div>
          {isOpen ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent className="p-4 pt-0 border-t border-gray-700">
          {renderDisclaimerContent()}
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <div className={`${className}`}>
      {renderDisclaimerContent()}
    </div>
  );
};

export default Disclaimer;
