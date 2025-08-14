import React from "react";
import { FaFacebook, FaTwitter, FaLinkedin, FaTiktok } from "react-icons/fa";
import CrossShield from "@/assets/cross shield 1.png";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#F9FAFB] text-gray-700 py-10 px-6 sm:px-8 lg:px-24">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-12 mt-8">
        {/* Logo and Description */}
        <div>
          <img src={CrossShield} alt="Logo" className="w-28 mb-3" />
          <p className="text-sm">
            Revolutionizing healthcare access across Africa through innovative
            pharmaceutical distribution.
          </p>
        </div>

        {/* Link Menu */}
        <div>
          <h3 className="font-semibold mb-2">Links</h3>
          <ul className="space-y-1 text-sm">
            <li>
              <a href="/" className="hover:text-gray-900">
                About Us
              </a>
            </li>
            <li>
              <a href="/about" className="hover:text-gray-900">
                Services
              </a>
            </li>
            <li>
              <a href="/blog" className="hover:text-gray-900">
                Contact
              </a>
            </li>
            <li>
              <a href="/blog" className="hover:text-gray-900">
                Product Sourcing
              </a>
            </li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="font-semibold mb-2">Services</h3>
          <ul className="space-y-1 text-sm">
            <li>
              <a href="/analytics" className="hover:text-gray-900">
                For Pharmacies
              </a>
            </li>
            <li>
              <a href="/iot" className="hover:text-gray-900">
                For Suppliers
              </a>
            </li>
            <li>
              <a href="/support" className="hover:text-gray-900">
                For Patients
              </a>
            </li>
            <li>
              <a href="/support" className="hover:text-gray-900">
                For NGOs
              </a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold mb-2">Contact</h3>
          <ul className="text-sm space-y-1 mr-6">
            <li>Email: support@crossshieldhc.com</li>
            <li>Phone: +234 810 401 6554</li>
            <li className="flex space-x-4">
              <a
                href="https://web.facebook.com/crossshieldhealthconsulting"
                className="text-gray-600 hover:text-gray-800"
              >
                <FaFacebook size={18} />
              </a>
              <a
                href="https://x.com/Cross_Shield1?t=oFF1_RYkKCV6AdP62Dx2rg&s=09"
                className="text-gray-600 hover:text-gray-800"
              >
                <FaTwitter size={18} />
              </a>
              <a
                href="https://www.linkedin.com/company/cross-shield-health-consulting/"
                className="text-gray-600 hover:text-gray-800"
              >
                <FaLinkedin size={18} />
              </a>
              <a
                href="https://www.tiktok.com/@cross_shield1"
                className="text-gray-600 hover:text-gray-800"
              >
                <FaTiktok size={18} />
              </a>
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="font-semibold mb-2">Legal</h3>
          <ul className="space-y-1 text-sm">
            <li>
              <Link to="/privacy-policy" className="hover:text-gray-900">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-gray-900">
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link to="/returns" className="hover:text-gray-900">
                Return Policy
              </Link>
            </li>
            <li>
              <Link to="/shipping" className="hover:text-gray-900">
                Shipping & Logistics
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-xs text-gray-500 mt-10">
        &copy; {new Date().getFullYear()} @crossshieldhc. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
