
import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const CarWashNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, signOut } = useAuth();
  const location = useLocation();

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const navItems = [
    { label: 'Home', href: '/car-wash' },
    { label: 'Services', href: '/car-wash/services' },
    { label: 'Loyalty', href: '/car-wash/loyalty' },
    { label: 'Gallery', href: '/car-wash/gallery' },
    { label: 'Contact', href: '/car-wash/contact' },
  ];

  return (
    <nav className="bg-white shadow-md text-carwash-text py-4 fixed top-0 left-0 w-full z-50 border-b border-carwash-border">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/car-wash" className="font-bold text-xl flex items-center">
          <img 
            src="/lovable-uploads/0adce92b-8870-4146-8305-eef55ad6c57c.png" 
            alt="Main Street Car Wash" 
            className="h-12 mr-2" 
            loading="eager"
          />
        </Link>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <button aria-label="Menu" className="p-2 rounded-lg border border-carwash-border hover:bg-gray-50 transition-all">
                <Menu className="h-6 w-6 text-carwash-text" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-white text-carwash-text w-64 z-50 border-r border-carwash-border">
              <SheetHeader>
                <SheetTitle className="text-carwash-text flex items-center justify-center">
                  <img 
                    src="/lovable-uploads/2bb5ea3e-b0cd-4c13-9cc8-b97157af0325.png" 
                    alt="Main Street Car Wash" 
                    className="h-10 mr-2" 
                  />
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                {navItems.map((item) => (
                  <NavLink
                    key={item.label}
                    to={item.href}
                    className={({ isActive }) =>
                      `block py-3 px-4 rounded-lg mb-2 border transition-all ${isActive ? 'bg-carwash-secondary text-white font-semibold border-carwash-secondary' : 'bg-gray-50 text-carwash-text border-carwash-border hover:bg-carwash-secondary hover:text-white'}`
                    }
                    onClick={closeMenu}
                  >
                    {item.label}
                  </NavLink>
                ))}
                {isAuthenticated && (
                  <button
                    onClick={signOut}
                    className="block w-full text-left py-3 px-4 mt-4 rounded-lg bg-red-50 border border-red-200 hover:bg-red-100 text-red-700 font-medium transition-all"
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
                `px-4 py-2 rounded-lg border transition-all duration-200 font-medium ${isActive ? 'text-white bg-carwash-secondary border-carwash-secondary font-semibold' : 'text-carwash-text bg-white border-carwash-border hover:bg-carwash-secondary hover:text-white hover:border-carwash-secondary'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
          {isAuthenticated && (
            <button
              onClick={signOut}
              className="bg-red-50 border border-red-200 hover:bg-red-100 text-red-700 font-medium py-2 px-4 rounded-lg focus:outline-none transition-all"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default CarWashNavbar;
