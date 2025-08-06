import { useState, ChangeEvent, FormEvent } from 'react';
import { FaLocationDot } from 'react-icons/fa6';
import { FiMail } from 'react-icons/fi';
import { ChevronRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { API_BASE_URL } from '@/lib/api';

interface FormData {
  name: string;
  phone: string;
  email: string;
  location: string;
}

const DiasporaForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    location: 'New York, United States',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
  
    if (!formData.phone.match(/^\+?\d{10,15}$/)) {
      toast.error("Please enter a valid phone number");
      return;
    }
  
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast.error("Please enter a valid email address");
      return;
    }
  
    if (!formData.location) {
      toast.error("Please select a location");
      return;
    }
  
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        toast.error("You must be logged in");
        return;
      }
  
      const form = new FormData();
      form.append("name", formData.name);
      form.append("location", formData.location);
      form.append("phone", formData.phone);
      form.append("email", formData.email);
  
      // --- First: Send to Beneficiary Endpoint ---
      const beneficiaryRes = await fetch(`${API_BASE_URL}/beneficiaries`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });
  
      if (!beneficiaryRes.ok) {
        const message = await beneficiaryRes.text();
        throw new Error(message);
      }
  
      const beneficiaryResult = await beneficiaryRes.json();
  
      // --- Then: Send to Request Endpoint ---
      const requestRes = await fetch(`${API_BASE_URL}/auth/requests`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "beneficiary",
          category: "registration",
          notes: "Registering a new beneficiary",
          payload: {
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            location: formData.location,
          },
        }),
      });
  
      if (!requestRes.ok) {
        const message = await requestRes.text();
        throw new Error(message);
      }
  
      toast.success("Request submitted successfully");
      setTimeout(() => navigate("/"), 1500);
  
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    }
  };
  

  const handleClose = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-md w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl p-4 sm:p-6 md:p-8 mx-4">
        <div className="flex justify-between items-start mb-4 sm:mb-6">
          <div className="flex-1 pr-4">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight">Help a loved One</h1>
            <p className="text-[#106FB2] text-lg sm:text-xl font-normal mt-1 sm:mt-2">For Diaspora</p>
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
          {/* Full Name */}
          <div>
            <label className="block mb-2 font-medium text-sm sm:text-base">Full Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 sm:px-4 py-3 sm:py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 text-base"
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* Phone & Email */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Phone */}
            <div>
              <label className="block mb-2 font-normal text-sm sm:text-base">
                Contact number (How we reach you)
              </label>
              <div className="flex border border-gray-300 rounded-md items-center px-2 min-w-0">
                <span className="text-gray-600 text-sm pr-1">+234</span>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone number"
                  className="flex-1 px-3 sm:px-4 py-3 sm:py-2 outline-none text-base min-w-0"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block mb-2 font-normal text-sm sm:text-base">Email</label>
              <div className="flex border border-gray-300 rounded-md items-center px-2 min-w-0">
                <FiMail className="text-gray-500 flex-shrink-0" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email address"
                  className="flex-1 px-3 sm:px-4 py-3 sm:py-2 outline-none text-base min-w-0"
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
                <option>Sydney, Australia</option>
                <option>Berlin, Germany</option>
                <option>Lagos, Nigeria</option>
              </select>
              <FaLocationDot className="absolute left-3 top-3 sm:top-3 text-gray-500" />
            </div>
          </div>

          {/* Info Note */}
          <div className="bg-blue-50 p-3 rounded-md">
            <p className="text-sm text-gray-600">
              <span className="inline-block mr-1">ⓘ</span>
              Check your email for login details and managing beneficiaries
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full sm:w-auto min-w-[120px] bg-[#106FB2] hover:bg-[#106FC1] text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2 touch-manipulation text-base"
          >
            <span>Submit</span>
            <ChevronRight size={17} />
          </button>
        </form>
      </div>
    </div>
  );
}

export default DiasporaForm;