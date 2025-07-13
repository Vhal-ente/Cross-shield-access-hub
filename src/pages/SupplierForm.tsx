import { useState, ChangeEvent, FormEvent } from 'react';
import { FaLocationDot } from 'react-icons/fa6';
import { FiMail } from 'react-icons/fi';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SupplierFormData {
  fullName: string;
  businessName: string;
  phone: string;
  email: string;
  location: string;
}

const SupplierForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SupplierFormData>({
    fullName: '',
    businessName: '',
    phone: '',
    email: '',
    location: 'New York, United States',
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
    // Add your submission logic here (e.g. API call)
  };

  const handleClose = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-md w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl p-4 sm:p-6 md:p-8 mx-4">
        <div className="flex justify-between items-start mb-4 sm:mb-6">
          <div className="flex-1 pr-4">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight">Join the Movement</h1>
            <p className="text-[#106FB2] text-lg sm:text-xl font-normal mt-1 sm:mt-2">For Suppliers</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0 touch-manipulation"
            aria-label="Close form"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Full Name & Business Name */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
            <div className="w-full sm:w-1/2">
              <label className="block mb-2 font-medium text-sm sm:text-base">Full Name</label>
              <input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 sm:px-4 py-3 sm:py-2 outline-none text-base"
                placeholder="Full name"
                required
              />
            </div>
            <div className="w-full sm:w-1/2">
              <label className="block mb-2 font-medium text-sm sm:text-base">Business Name</label>
              <input
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 sm:px-4 py-3 sm:py-2 outline-none text-base"
                placeholder="Business name"
                required
              />
            </div>
          </div>

          {/* Phone & Email */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
            {/* Phone */}
            <div className="w-full sm:w-1/2">
              <label className="block mb-2 font-medium text-sm sm:text-base">
                Contact number (How we reach you)
              </label>
              <div className="flex border border-gray-300 rounded-md items-center px-2">
                <span className="text-gray-600 text-sm pr-1">+370</span>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone number"
                  className="flex-1 px-3 sm:px-4 py-3 sm:py-2 outline-none text-base"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="w-full sm:w-1/2">
              <label className="block mb-2 font-medium text-sm sm:text-base">Email</label>
              <div className="flex border border-gray-300 rounded-md items-center px-2">
                <FiMail className="text-gray-500 flex-shrink-0" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email address"
                  className="flex-1 px-3 sm:px-4 py-3 sm:py-2 outline-none text-base"
                  required
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block mb-2 font-medium text-sm sm:text-base">Location</label>
            <div className="relative">
              <select
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-8 py-3 sm:py-2 pr-10 appearance-none text-base"
              >
                <option>New York, United States</option>
                <option>London, United Kingdom</option>
                <option>Toronto, Canada</option>
              </select>
              <FaLocationDot className="absolute left-3 top-3 sm:top-3 text-gray-500" />
            </div>
          </div>

          {/* Info Note */}
          <div className="bg-blue-50 p-3 rounded-md">
            <p className="text-sm text-gray-600">
              <span className="inline-block mr-1">ⓘ</span>
              You will be contacted via email or phone
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full sm:w-auto min-w-[120px] bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-all touch-manipulation text-base"
          >
            Submit →
          </button>
        </form>
      </div>
    </div>
  );
}

export default SupplierForm;