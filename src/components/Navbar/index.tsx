import React, { useState } from 'react';
import CrossShield from '@/assets/cross shield 1.png';
import { HiMenu, HiX } from 'react-icons/hi';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '#home' },
    { name: 'About us', path: '#about' },
    { name: 'Products', path: '#products' },
    { name: 'Testimonials', path: '#testimonials' },
    { name: 'Support', path: '#support' },
  ];

  return (
    <header className="w-full bg-white shadow-sm fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="border border-none p-1">
          <img src={CrossShield} alt="Cross Shield Logo" className="h-14 w-auto" />
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-6 text-md font-quicksand font-medium">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.path}
              className="text-gray-600 hover:text-[#106FB2] transition"
            >
              {link.name}
            </a>
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
              <a
                key={link.name}
                href={link.path}
                onClick={() => setMenuOpen(false)}
                className="text-gray-600 hover:text-blue-600 transition"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
