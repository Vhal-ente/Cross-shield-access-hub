import React from 'react';
import { Link } from "react-router-dom";
import { BsWhatsapp } from 'react-icons/bs';
import healthcareImage from '@/assets/health care 1.png';

const HeroSection = () => {
  return (
    <div id='home' className="bg-[#F9FAFB] text-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center rounded-lg">
        {/* Text Content */}
        <div className="space-y-6">
          <span className="inline-block text-sm font-medium bg-gray-100 border border-gray-300 rounded-full px-4 py-1 text-gray-700">
            Revolutionizing Healthcare Access
          </span>
          <h2 className="text-3xl md:text-4xl font-medium leading-snug">
            Empowering Access to <span className="text-[#106FB2]">Medications</span> Across Africa
          </h2>
          <p className="text-gray-700">
            Cross Shield connects community pharmacies, suppliers, and patients to ensure reliable access to essential
            medicines—even in hard-to-reach areas.
          </p>
          <div className="flex flex-wrap gap-4">
          <Link to ="/dashboard">
            <button className="bg-[#106FB2] text-white px-5 py-2 rounded-full hover:bg-[#106FC1] transition">
              Access Dashboard →
            </button>
            </Link>
            <Link to="/medication-form">
            <button className="border border-gray-400 text-gray-800 px-5 py-2 rounded-full hover:bg-gray-100 transition">
              Request Medications
            </button>
            </Link>
          </div>
        </div>

        {/* Image */}
        <div className="w-full mt-14">
          <img
            src= {healthcareImage} // Replace this with your actual image path
            alt="Healthcare worker with patients"
            className="rounded-[2rem] w-full object-cover"
          />
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 text-center gap-8">
          <div>
            <h3 className="text-2xl font-bold">1,000+</h3>
            <p className="text-gray-600 mt-1">Medication Orders Fulfilled</p>
          </div>
          <div>
            <h3 className="text-2xl font-bold">300+</h3>
            <p className="text-gray-600 mt-1">Pharmacies in Network</p>
          </div>
          <div>
            <h3 className="text-2xl font-bold">5+</h3>
            <p className="text-gray-600 mt-1">Nigerian States Served</p>
          </div>
        </div>
      </div>

      {/* WhatsApp Chat Icon */}
      <div className="fixed bottom-6 right-6">
        <a
          href="https://wa.me/your-number" // Replace with actual WhatsApp number
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-[#106FB2] rounded-full px-4 py-2 shadow-md"
        >
          <BsWhatsapp  className="w-6 h-6" />
          <span className="text-white font-medium">Chat</span>
        </a>
      </div>
    </div>
  );
};

export default HeroSection;
