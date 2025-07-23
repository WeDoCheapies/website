
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Disclaimer from "./Disclaimer";

interface DisclaimerCheckboxProps {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  required?: boolean;
  error?: string;
}

const DisclaimerCheckbox: React.FC<DisclaimerCheckboxProps> = ({
  id,
  checked,
  onCheckedChange,
  required = true,
  error
}) => {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-white border border-gray-200 rounded-md text-gray-800 text-sm">
        <Disclaimer variant="full" />
      </div>
      
      <div className="flex items-start space-x-2">
        <Checkbox 
          id={id} 
          checked={checked}
          onCheckedChange={onCheckedChange}
          required={required}
        />
        <div className="grid gap-1.5 leading-none">
          <Label 
            htmlFor={id} 
            className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${error ? 'text-red-500' : 'text-white'}`}
          >
            I have read and agree to the disclaimer above
            {required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default DisclaimerCheckbox;
