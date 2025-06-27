import React from 'react';
import { FaShieldAlt, FaHeart, FaLightbulb, FaGlobeAfrica, FaUsers } from 'react-icons/fa';

const AboutSection = () => {
  return (
    <section className="bg-[#F9FAFB] text-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left Side: Story, Mission, Vision */}
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-medium text-[#106FB2]">Our Story</h2>
            <p className="text-[#9CA3AF] mt-2 text-sm sm:text-base leading-relaxed">
              Founded in response to the COVID-19 lockdown, Cross Shield Health Consulting was born out of the urgent
              need to improve access to medications in Nigeria. By leveraging a digital network of pharmacies and
              suppliers, we streamlined the medicine supply chain to respond faster, smarter, and more equitably.
            </p>
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-normal text-gray-900">Our Mission</h3>
            <p className="text-[#9CA3AF] mt-1 text-sm sm:text-base">
              To revolutionize health access in Africa by optimizing pharmaceutical supply chains with transparency,
              speed, and reach.
            </p>
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-normal text-gray-900">Our Vision</h3>
            <p className="text-[#9CA3AF] mt-1 text-sm sm:text-base">
              To become a Pan-African health logistics behemoth, ensuring no community is left behind.
            </p>
          </div>
        </div>

        {/* Right Side: Core Values */}
        <div>
          <h3 className="text-2xl sm:text-3xl font-light text-gray-700 mb-6">Core Values</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <li className="flex items-start gap-4">
              <FaShieldAlt className="text-[#106FB2] text-xl mt-1" />
              <div>
                <h4 className="font-normal text-[#106FB2]">Reliability</h4>
                <p className="text-[#9CA3AF] text-sm">Dependable service you can trust</p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <FaHeart className="text-[#106FB2] text-xl mt-1" />
              <div>
                <h4 className="font-normal text-[#106FB2]">Integrity</h4>
                <p className="text-[#9CA3AF] text-sm">Transparent and ethical practices</p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <FaLightbulb className="text-[#106FB2] text-xl mt-1" />
              <div>
                <h4 className="font-normal text-[#106FB2]">Innovation</h4>
                <p className="text-[#9CA3AF] text-sm">Cutting-edge solutions for health access</p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <FaGlobeAfrica className="text-[#106FB2] text-xl mt-1" />
              <div>
                <h4 className="font-normal text-[#106FB2]">Accessibility</h4>
                <p className="text-[#9CA3AF] text-sm">Reaching every community</p>
              </div>
            </li>
            <li className="flex items-start gap-4 sm:col-span-2">
              <FaUsers className="text-[#106FB2] text-xl mt-1" />
              <div>
                <h4 className="font-normal text-[#106FB2]">Collaboration</h4>
                <p className="text-[#9CA3AF] text-sm">Building stronger partnerships</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
