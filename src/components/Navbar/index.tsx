import React, { useState } from 'react';
import CrossShield from '@/assets/cross shield 1.png';
import { HiMenu, HiX } from 'react-icons/hi';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const { isAuthenticated, user, logout } = useAuth();

  const navLinks = [
    { name: 'Home', path: '#home' },
    { name: 'About us', path: '#about' },
    { name: 'Products', path: '#products' },
    { name: 'Testimonials', path: '#testimonials' },
    { name: 'Support', path: '#support' },
  ];

  const handleAuthClick = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <>
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

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <User size={16} />
                  <span className="text-sm font-medium">{user?.fullName}</span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {user?.role?.replace('_', ' ')}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center space-x-2"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAuthClick('login')}
                >
                  Login
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleAuthClick('register')}
                >
                  Register
                </Button>
              </div>
            )}
          </div>

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
          <div className="md:hidden bg-white px-4 pb-4">
            <div className="flex flex-col space-y-4">
              {/* Navigation Links */}
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
              
              {/* Auth Buttons - Mobile */}
              <div className="flex flex-col space-y-2 pt-4 border-t">
                {isAuthenticated ? (
                  <>
                    <div className="text-right">
                      <p className="text-sm font-medium">{user?.fullName}</p>
                      <p className="text-xs text-gray-500 capitalize">
                        {user?.role?.replace('_', ' ')}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLogout}
                      className="w-full"
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAuthClick('login')}
                      className="w-full"
                    >
                      Login
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleAuthClick('register')}
                      className="w-full"
                    >
                      Register
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultMode={authMode}
      />
    </>
  );
};

export default Navbar;