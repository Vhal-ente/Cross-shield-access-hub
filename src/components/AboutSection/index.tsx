import React from 'react';
import Navbar from '../Navbar';
// import PageWrapper from '../../components/Pagewrapper/index';
import HowItWorksSection from './howItWorks';
import AboutSection from './about';

export default function AboutPage() {
  return (
    <div className="font-outfit">
        <AboutSection />
        <HowItWorksSection />
        {/* You can add more sections here as needed */}
    </div>
  );
}
