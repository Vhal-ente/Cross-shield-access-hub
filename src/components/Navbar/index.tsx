import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import CrossShield from '@/assets/cross shield 1.png'; // Adjust this path if needed
import { HiMenu, HiX } from 'react-icons/hi';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About us', path: '/src/components/AboutSection/about.tsx' },
    { name: 'Products', path: '/products' },
    { name: 'Testimonials', path: '/src/components/TestimonialsSection' },
    { name: 'Support', path: 'src/components/JoinUs' },
  ];

  return (
    <header className="w-full bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="border border-none p-1">
          <img src={CrossShield} alt="Cross Shield Logo" className="h-14 w-auto" />
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-6 text-md font-quicksand font-medium">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `transition ${
                  isActive ? 'text-black-600 font-semibold' : 'text-gray-400'
                } hover:text-gray-500`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            className="text-2xl text-gray-600"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white px-4 pb-4 flex justify-end">
          <div className="flex flex-col items-end space-y-2 text-sm">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `transition ${
                    isActive ? 'text-blue-600 font-semibold' : 'text-gray-400'
                  } hover:text-blue-500`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
