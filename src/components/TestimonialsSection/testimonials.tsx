import React from 'react';
import { FaStar } from 'react-icons/fa';

const testimonials = [
  {
    rating: 5,
    message:
      'Cross Shield helped us restock critical meds during the lockdown—lifesaver! Their network is reliable and their service is exceptional.',
    name: 'Chinyere A',
    location: 'Enugu',
    role: 'Nursing Home Manager',
    avatar: 'https://i.pravatar.cc/40?img=1',
  },
  {
    rating: 5,
    message:
      'Their year-round guarantee gives me real peace of mind. Even during holidays, my medications arrive on time. Total game changer!',
    name: 'Michael T',
    location: 'Abuja',
    role: 'Pharmacy Partner',
    avatar: 'https://i.pravatar.cc/40?img=2',
  },
  {
    rating: 5,
    message:
      "Reliable, transparent, and quick. Exactly what Nigeria's health sector needs. Cross Shield is making a real difference.",
    name: 'Health NGO Official',
    location: 'Lagos',
    role: 'Public Health Sector',
    avatar: 'https://i.pravatar.cc/40?img=3',
  },
];

const TestimonialsSection = () => {
  return (
    <section id='testimonials' className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-12">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h2 className="text-4xl font-light text-gray-900">What Our Partners Say</h2>
        <p className="mt-2 text-sm sm:text-base text-[#9CA3AF] max-w-2xl mx-auto">
          Our clients are at the heart of everything we do. Their satisfaction is not just a goal but a fundamental
          priority. Our success is measured by their trust and loyalty
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div>
              <div className="flex text-[#106FB2] mb-3">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <FaStar key={i} />
                ))}
              </div>
              <p className="text-[#212121] text-sm">{testimonial.message}</p>
            </div>
            <div className="mt-6 flex items-center gap-3">
              <img
                src={testimonial.avatar}
                alt={testimonial.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="text-left text-sm">
                <p className="font-semibold text-[#212121]">
                  {testimonial.name},{' '}
                  <span className="text-[#106FB2]">{testimonial.location}</span>
                </p>
                <p className="text-gray-500">{testimonial.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <button className="bg-[#106FB2] text-white px-6 py-2 rounded-full transition font-light text-sm">
          Drop a review
        </button>
      </div>
    </section>
  );
};

export default TestimonialsSection;
