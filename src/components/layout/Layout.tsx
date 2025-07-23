
import { ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
  isCarWash?: boolean;
}

const Layout = ({ children, isCarWash = false }: LayoutProps) => {
  const location = useLocation();
  
  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className={`min-h-screen flex flex-col ${isCarWash ? 'bg-carwash-primary' : 'bg-dealership-primary'}`}>
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer isCarWash={isCarWash} />
    </div>
  );
};

export default Layout;
