import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import CrossShield from '@/assets/cross shield 1.png'; // Update if path is different

const Footer = () => {
  return (
    <footer className="bg-[#F9FAFB] text-gray-700 py-10 px-6 sm:px-8 lg:px-24">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-10 mt-8">
        {/* Logo and Description */}
        <div>
          <img src={CrossShield} alt="Logo" className="w-28 mb-3" />
          <p className="text-sm">
            Revolutionizing healthcare access across Africa through innovative pharmaceutical distribution.
          </p>
        </div>

        {/* Link Menu */}
        <div>
          <h3 className="font-semibold mb-2">Links</h3>
          <ul className="space-y-1 text-sm">
            <li><a href="/" className="hover:text-gray-900">About Us</a></li>
            <li><a href="/about" className="hover:text-gray-900">Services</a></li>
            <li><a href="/blog" className="hover:text-gray-900">Contact</a></li>
            <li><a href="/blog" className="hover:text-gray-900">Product Sourcing</a></li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="font-semibold mb-2">Services</h3>
          <ul className="space-y-1 text-sm">
            <li><a href="/analytics" className="hover:text-gray-900">For Pharmacies</a></li>
            <li><a href="/iot" className="hover:text-gray-900">For Suppliers</a></li>
            <li><a href="/support" className="hover:text-gray-900">For Patients</a></li>
            <li><a href="/support" className="hover:text-gray-900">For NGOs</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold mb-2">Contact</h3>
          <ul className="text-sm space-y-1">
            <li>Email: support@example.com</li>
            <li>Phone: +234 000 000 0000</li>
            <li className="flex space-x-4 mt-2">
              <a href="#" className="text-gray-600 hover:text-gray-800"><FaFacebook size={18} /></a>
              <a href="#" className="text-gray-600 hover:text-gray-800"><FaTwitter size={18} /></a>
              <a href="#" className="text-gray-600 hover:text-gray-800"><FaInstagram size={18} /></a>
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="font-semibold mb-2">Legal</h3>
          <ul className="space-y-1 text-sm">
            <li><a href="/privacy" className="hover:text-gray-900">Privacy Policy</a></li>
            <li><a href="/terms" className="hover:text-gray-900">Terms & Conditions</a></li>
            <li><a href="/returns" className="hover:text-gray-900">Return Policy</a></li>
            <li><a href="/shipping" className="hover:text-gray-900">Shipping & Logistics</a></li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-xs text-gray-500 mt-10">
        &copy; {new Date().getFullYear()} Your Company. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
