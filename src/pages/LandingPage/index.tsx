import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import PageWrapper from '@/components/Pagewrapper';
import HeroSection from '@/components/HeroSection/hero';
import AboutPage from '@/components/AboutSection';
import TestimonialsSection from '@/components/TestimonialsSection/testimonials';
import JoinSection from '@/components/JoinUs'
import { AuthModal } from '@/components/auth/AuthModal';
import CrossShield from '@/assets/cross shield 1.png';

export default function LandingPage() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [defaultMode, setDefaultMode] = useState<'login' | 'register'>('login');

  const openRegisterModal = () => {
    setDefaultMode('register');
    setAuthModalOpen(true);
  };

  return (
    <div className="font-outfit">
   <Navbar
      logo={CrossShield}
    />
      <PageWrapper>
        {/* Main content of the landing page goes here */}
        <HeroSection onOpenRegisterModal={openRegisterModal} />
        <AboutPage />
        <TestimonialsSection />
        <JoinSection onOpenRegisterModal={openRegisterModal} />
      </PageWrapper>

       {/* ✅ Auth Modal */}
       <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        defaultMode={defaultMode} 
      />
    </div>
  );
}
