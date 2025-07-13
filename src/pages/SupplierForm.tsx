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
    <div className="min-h-screen flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-md w-[40%] p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold">Join the Movement</h1>
            <p className="text-[#106FB2] text-xl font-normal mt-2">For Suppliers</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close form"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Full Name & Business Name */}
          <div className="flex gap-2">
            <div className="w-1/2">
              <label className="block mb-1 font-medium text-sm">Full Name</label>
              <input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 outline-none"
                placeholder="Full name"
                required
              />
            </div>
            <div className="w-1/2">
              <label className="block mb-1 font-medium text-sm">Business Name</label>
              <input
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 outline-none"
                placeholder="Business name"
                required
              />
            </div>
          </div>

          {/* Phone & Email */}
          <div className="flex gap-2">
            {/* Phone */}
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
                  onChange={handleChange}
                  placeholder="Phone number"
                  className="flex-1 px-4 py-2 outline-none"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="w-1/2">
              <label className="block mb-1 font-medium text-sm">Email</label>
              <div className="flex border border-gray-300 rounded-md items-center px-2">
                <FiMail className="text-gray-500" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email address"
                  className="flex-1 px-4 py-2 outline-none"
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
                onChange={handleChange}
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
            className="mt-4 w-[100px] bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all"
          >
            Submit →
          </button>
        </form>
      </div>
    </div>
  );
}
export default SupplierForm;