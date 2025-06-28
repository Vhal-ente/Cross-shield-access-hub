import React, { useState, ChangeEvent, FormEvent } from 'react';
import { ChevronDown, MapPin, Plus, Info, ChevronRight } from 'lucide-react';

type FormData = {
  fullName: string;
  location: string;
  countryCode: string;
  phoneNumber: string;
  medicationName: string;
  urgency: string;
  hasPrescription: 'Yes' | 'No';
  prescriptionImage: File | null;
};

const MedicationForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: 'John',
    location: 'New York, United States',
    countryCode: '+370',
    phoneNumber: '',
    medicationName: '',
    urgency: 'Today, Tomorrow, within the week',
    hasPrescription: 'Yes',
    prescriptionImage: null,
  });

  const handleInputChange = (
    field: keyof FormData,
    value: string | File | null
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleInputChange('prescriptionImage', e.target.files[0]);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add your API logic here
  };

  return (
    <div className="min-h-screen bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-lg p-8 w-[45%]">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Request Medication</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your full name"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <MapPin size={18} className="text-gray-400" />
              </div>
              <select
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full pl-12 pr-12 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="New York, United States">New York, United States</option>
                <option value="Los Angeles, United States">Los Angeles, United States</option>
                <option value="Chicago, United States">Chicago, United States</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <ChevronDown size={18} className="text-gray-400" />
              </div>
            </div>
          </div>

          {/* Contact Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact number (How we reach you)
            </label>
            <div className="flex space-x-2">
              <div className="relative">
                <select
                  value={formData.countryCode}
                  onChange={(e) => handleInputChange('countryCode', e.target.value)}
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
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                placeholder="Phone number"
                className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Medication & Urgency */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name of Medication</label>
              <input
                type="text"
                value={formData.medicationName}
                onChange={(e) => handleInputChange('medicationName', e.target.value)}
                placeholder="Medication name"
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                When do you Need the Medication
              </label>
              <div className="relative">
                <select
                  value={formData.urgency}
                  onChange={(e) => handleInputChange('urgency', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-10"
                >
                  <option value="Today, Tomorrow, within the week">Today, Tomorrow, within the week</option>
                  <option value="Today">Today</option>
                  <option value="Tomorrow">Tomorrow</option>
                  <option value="Within the week">Within the week</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <ChevronDown size={16} className="text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Prescription Question */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Do you have a Prescription
            </label>
            <div className="flex space-x-6">
              {['Yes', 'No'].map((value) => (
                <label key={value} className="flex items-center">
                  <input
                    type="radio"
                    name="prescription"
                    value={value}
                    checked={formData.hasPrescription === value}
                    onChange={(e) => handleInputChange('hasPrescription', e.target.value)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{value}</span>
                </label>
              ))}
            </div>
            <div className="flex items-start space-x-2 mt-3">
              <Info size={14} className="text-blue-500 mt-0.5" />
              <p className="text-xs text-gray-600">
                If you do not have prescription, you will be contacted by a pharmacist
              </p>
            </div>
          </div>

          {/* Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Picture of Medication or Prescription
            </label>
            <label
              htmlFor="upload"
              className="cursor-pointer w-16 h-16 bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center hover:bg-gray-50"
            >
              <Plus size={20} className="text-gray-400" />
            </label>
            <input
              id="upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-[100px] bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-2 rounded-lg transition-colors flex items-center justify-center space-x-2 mt-8"
          >
            <span>Submit</span>
            <ChevronRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default MedicationForm;
