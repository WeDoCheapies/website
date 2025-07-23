
import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Menu } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, signOut } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Preload logo image
  useEffect(() => {
    const logoImage = new Image();
    logoImage.src = '/lovable-uploads/671a3e7f-2f7e-4017-820a-8f9ade87a7f5.png';
  }, []);

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Inventory', href: '/inventory' },
    { label: 'Car Trade-In', href: '/car-trade' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <nav className="bg-dealership-primary text-white py-4 shadow-md fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="font-bold text-xl flex items-center">
          <img 
            src="/lovable-uploads/671a3e7f-2f7e-4017-820a-8f9ade87a7f5.png" 
            alt="We Do Cheapies" 
            className="h-10 mr-2" 
            loading="eager"
          />
        </Link>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <button aria-label="Menu" onClick={toggleMenu} className="p-2">
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-white text-black w-64">
              <SheetHeader>
                <SheetTitle>
                  <img 
                    src="/lovable-uploads/671a3e7f-2f7e-4017-820a-8f9ade87a7f5.png" 
                    alt="We Do Cheapies" 
                    className="h-8 mx-auto" 
                  />
                </SheetTitle>
                <SheetDescription>
                  Navigate through our site.
                </SheetDescription>
              </SheetHeader>
              <div className="mt-4">
                {navItems.map((item) => (
                  <NavLink
                    key={item.label}
                    to={item.href}
                    className={({ isActive }) =>
                      `block py-2 px-4 rounded hover:bg-gray-100 ${isActive ? 'font-semibold' : ''}`
                    }
                    onClick={closeMenu}
                  >
                    {item.label}
                  </NavLink>
                ))}
                {isAuthenticated && (
                  <button
                    onClick={signOut}
                    className="block py-2 px-4 rounded hover:bg-gray-100 w-full text-left"
                  >
                    Logout
                  </button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.href}
              className={({ isActive }) =>
                `hover:text-gray-200 transition-colors duration-200 ${isActive ? 'font-semibold' : ''}`
              }
            >
              {item.label}
            </NavLink>
          ))}
          {isAuthenticated && (
            <button
              onClick={signOut}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
