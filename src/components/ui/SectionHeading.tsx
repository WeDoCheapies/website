
import { ReactNode } from 'react';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  alignment?: 'left' | 'center' | 'right';
  isCarWash?: boolean;
  children?: ReactNode;
  className?: string;
}

const SectionHeading = ({
  title,
  subtitle,
  alignment = 'left',
  isCarWash = false,
  children,
  className = '',
}: SectionHeadingProps) => {
  // Apply alignment classes
  let alignmentClass = 'text-left';
  if (alignment === 'center') alignmentClass = 'text-center';
  else if (alignment === 'right') alignmentClass = 'text-right';
  
  // Theme colors - ensure text is always readable against background
  const accentColor = isCarWash ? 'text-carwash-secondary' : 'text-dealership-secondary';
  const titleColor = isCarWash ? 'text-carwash-text' : 'text-gray-900';
  const subtitleColor = isCarWash ? 'text-carwash-muted' : 'text-gray-700';

  return (
    <div className={`mb-8 ${alignmentClass} ${className}`}>
      <h2 className={`text-2xl md:text-3xl font-bold ${titleColor}`}>
        {title}
      </h2>
      
      {subtitle && (
        <p className={`mt-2 text-base md:text-lg ${subtitleColor}`}>
          {subtitle}
        </p>
      )}
      
      <div className={`mt-4 w-24 h-1 ${isCarWash ? 'bg-carwash-secondary' : 'bg-dealership-secondary'} ${alignment === 'center' ? 'mx-auto' : alignment === 'right' ? 'ml-auto' : ''}`}></div>
      
      {children}
    </div>
  );
};

export default SectionHeading;
