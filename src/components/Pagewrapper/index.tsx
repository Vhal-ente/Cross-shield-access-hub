import React from 'react';
import { Navigation } from '../../components/dashboard/Navigation';
import Footer from '@/components/Footer/footer';

const PageWrapper = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#B0B0B0]">
       <Navigation />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default PageWrapper;
