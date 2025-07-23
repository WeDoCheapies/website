
import { ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import CarWashNavbar from './CarWashNavbar';
import Footer from '../layout/Footer';

interface CarWashLayoutProps {
  children: ReactNode;
}

const CarWashLayout = ({ children }: CarWashLayoutProps) => {
  const location = useLocation();
  
  useEffect(() => {
    // Preload the car wash logo image to ensure it loads properly
    const logoImage = new Image();
    logoImage.src = '/lovable-uploads/2bb5ea3e-b0cd-4c13-9cc8-b97157af0325.png';
    
    // Scroll to top on route change
    window.scrollTo(0, 0);
    
    // Add a class to body for car wash specific styling
    document.body.classList.add('car-wash-page');
    
    // Clean up
    return () => {
      document.body.classList.remove('car-wash-page');
    };
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <CarWashNavbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer isCarWash={true} />
    </div>
  );
};

export default CarWashLayout;
