// import React from 'react';
import Navbar from '@/components/Navbar';
import PageWrapper from '@/components/Pagewrapper';
import HeroSection from '@/components/HeroSection/hero';
import AboutPage from '@/components/AboutSection';
import TestimonialsSection from '@/components/TestimonialsSection/testimonials';
import JoinSection from '@/components/JoinUs'

export default function LandingPage() {
  return (
    <div className="font-outfit">
    <Navbar />
      <PageWrapper>
        {/* Main content of the landing page goes here */}
        <HeroSection />
        <AboutPage />
        <TestimonialsSection />
        <JoinSection />
      </PageWrapper>
    </div>
  );
}
