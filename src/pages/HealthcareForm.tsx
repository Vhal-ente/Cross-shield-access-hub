import { useState, ChangeEvent, FormEvent } from 'react';
import { FaLocationDot } from 'react-icons/fa6';
import { FiMail } from 'react-icons/fi';
import { ChevronDown } from 'lucide-react';

interface HealthcareFormData {
  fullName: string;
  licenseNumber: string;
  phone: string;
  email: string;
  location: string;
  countryCode: string;
}

const HealthcareForm = () =>{
  const [formData, setFormData] = useState<HealthcareFormData>({
    fullName: '',
    licenseNumber: '',
    phone: '',
    email: '',
    location: 'New York, United States',
    countryCode: '+370',
  });

  const handleChange = (name: string, value: string) => {
      setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
    // Replace with actual API submission logic
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-md w-[45%] p-8">
        <h1 className="text-3xl font-bold mb-8">Join the Movement</h1>
        <p className="text-[#106FB2] text-xl font-light mb-8">For Healthcare Professionals</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name & License Number */}
          <div className="flex gap-2">
            <div className="w-1/2">
              <label className="block mb-1 font-medium text-sm">Full Name</label>
              <input
                name="fullName"
                value={formData.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 outline-none"
                placeholder="Full name"
                required
              />
            </div>
            <div className="w-1/2">
              <label className="block mb-1 font-medium text-sm">
                PCN / MBC (License Number)
              </label>
              <input
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={(e) => handleChange('licenseNumber', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 outline-none"
                placeholder="--"
                required
              />
            </div>
          </div>

          {/* Phone & Email */}
          <div className="flex gap-2">
            <div className="w-1/2">
              <label className="block mb-1 font-medium text-sm">
                Contact number (How we reach you)
              </label>
              <div className="flex border border-gray-300 rounded-md items-center px-2">
                <span className="text-gray-600 text-sm pr-1">+370</span>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="Phone number"
                  className="flex-1 px-4 py-2 outline-none"
                  required
                />
              </div>
            </div>
            {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact number (How we reach you)
            </label>
            <div className="flex space-x-2">
              <div className="relative">
                <select
                  value={formData.countryCode}
                  onChange={(e) => handleChange('countryCode', e.target.value)}
                  className="px-3 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-8"
                >
                  <option value="+370">🇱🇹 +370</option>
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+44">🇬🇧 +44</option>
                </select>
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <ChevronDown size={14} className="text-gray-400" />
                </div>
              </div>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div> */}

            <div className="w-1/2">
              <label className="block mb-1 font-medium text-sm">Email</label>
              <div className="flex border border-gray-300 rounded-md items-center px-2">
                <FiMail className="text-gray-500" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => handleChange('location', e.target.value)}
                  placeholder="Email address"
                  className="flex-1 py-2 px-4 outline-none rounded-xl"
                  required
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block mb-1 font-medium text-sm">Location</label>
            <div className="relative">
              <select
                name="location"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-8 py-2 pr-10 appearance-none"
              >
                <option>New York, United States</option>
                <option>London, United Kingdom</option>
                <option>Toronto, Canada</option>
              </select>
              <FaLocationDot className="absolute left-3 top-3 text-gray-500" />
            </div>
          </div>

          {/* Info Note */}
          <p className="text-sm text-gray-600 mt-2">
            <span className="inline-block mr-1">ⓘ</span>
            You will be contacted via email or phone
          </p>

          {/* Submit Button */}
          <button
            type="submit"
            className="mt-4 w-[100px] bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition-all"
          >
            Submit →
          </button>
        </form>
      </div>
    </div>
  );
}
export default HealthcareForm;