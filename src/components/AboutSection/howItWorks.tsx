import React from 'react';
import { FaArrowRight } from 'react-icons/fa';

const cards = [
  {
    title: 'For Patients',
    description: 'Request medications through our verified partner pharmacies with home delivery or pickup options',
    items: ['Verified Partners', 'Home Delivery', 'Quality Assurance'],
  },
  {
    title: 'For Pharmacies',
    description: 'Restock faster, smarter, and more reliably with access to quality medications and exclusive pricing',
    items: ['Fast Restocking', 'Quality Medications', 'Exclusive Pricing'],
  },
  {
    title: 'For Suppliers',
    description: 'Expand your reach with access to vetted pharmacy clients and real-time demand insights',
    items: ['Vetted Clients', 'Demand Insights', 'Expanded Reach'],
  },
  {
    title: 'For NGOs',
    description: 'Partner with us for last-mile distribution and leverage our network for hard-to-reach communities',
    items: ['Last-Mile Distribution', 'Community Access', 'Partnership Support'],
  },
  {
    title: 'For Government',
    description: 'Collaborate on public health programs with our established distribution network',
    items: ['Program Support', 'Network Access', 'Distribution Excellence'],
  },
  {
    title: 'For Diaspora',
    description: 'Support your loved ones by directly funding or coordinating medication delivery with accountability',
    items: ['Direct Funding', 'Verified Network', 'Family Support'],
  },
];

const HowItWorksSection = () => {
  return (
    <section className="bg-[#F9FAFB] py-16 px-4 sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h2 className="text-4xl font-light text-gray-700">How It Works</h2>
        <p className="mt-2 text-[#9CA3AF] text-sm sm:text-base">
          We serve different stakeholders in the healthcare ecosystem
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6 text-left border border-gray-200 hover:shadow-md transition-shadow duration-300">
            <h3 className="text-[#106FB2] font-normal text-lg mb-2">{card.title}</h3>
            <p className="text-[#9CA3AF] text-sm mb-4">{card.description}</p>
            <ul className="space-y-2">
              {card.items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-[#9CA3AF] text-sm">
                  <FaArrowRight className="mt-1 text-sm text-[#20B486]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorksSection;
