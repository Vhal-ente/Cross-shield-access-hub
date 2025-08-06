import React, { useState, ChangeEvent, FormEvent } from "react";
import { ChevronDown, MapPin, Plus, Info, ChevronRight, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { API_BASE_URL } from "@/lib/api";

type FormData = {
  fullName: string;
  location: string;
  countryCode: string;
  phoneNumber: string;
  // medicationName: string;
  // quantity: string; // Add this field
  medications: { name: string; quantity: number }[]; // Add medications field
  urgency: "normal" | "urgent" | "emergency"; // Fix the valid values
  hasPrescription: "Yes" | "No";
  prescriptionImage: File | null;
};

const MedicationForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    location: "New York, United States",
    countryCode: "+234",
    phoneNumber: "",
    medications: [{ name: "", quantity: 0 }],
    urgency: "normal", // Use valid urgency value
    hasPrescription: "Yes",
    prescriptionImage: null
  });

  const handleInputChange = (
    field: keyof FormData,
    value: string | File | null
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleInputChange("prescriptionImage", e.target.files[0]);
    }
  };
  const addMedication = (index: number) => {
    const newMedications = [...formData.medications];
    newMedications.splice(index + 1, 0, { name: "", quantity: 0 });
    setFormData((prev) => ({ ...prev, medications: newMedications }));
  };

  const removeMedication = (index: number) => {
    if (formData.medications.length === 1) return; // Prevent removing last item
    const newMedications = [...formData.medications];
    newMedications.splice(index, 1);
    setFormData((prev) => ({ ...prev, medications: newMedications }));
  };

  const handleMedicationChange = (
    index: number,
    field: "name" | "quantity",
    value: string | number
  ) => {
    const updated = [...formData.medications];
    if (field === "quantity") {
      updated[index].quantity = Number(value);
    } else {
      updated[index].name = value as string;
    }
    setFormData((prev) => ({ ...prev, medications: updated }));
  };
// Alternative approach: Send as separate fields
// const handleSubmit = async (e: FormEvent) => {
//   e.preventDefault()
  
//   // Validate and clean medications first
//   const validMedications = formData.medications.filter(med => 
//     med.name && med.name.trim() && med.quantity > 0
//   );
  
//   if (validMedications.length === 0) {
//     toast.error("Please add at least one medication with name and quantity");
//     return;
//   }

//   // Create clean medication objects
//   const cleanMedications = validMedications.map(med => ({
//     name: String(med.name).trim(),
//     quantity: parseInt(String(med.quantity), 10)
//   }));

//   try {
//     const token = localStorage.getItem("auth_token");
//     if (!token) {
//       toast.error("You must be logged in");
//       return;
//     }

//     const form = new FormData();
//     form.append("fullName", formData.fullName);
//     form.append("location", formData.location);
//     form.append("countryCode", formData.countryCode);
//     form.append("phoneNumber", formData.phoneNumber);
//     form.append("urgency", formData.urgency);
    
//     // Debug each medication individually
//     formData.medications.forEach((med, index) => {
//     });
    
//     // Filter and create completely new objects
//     const validMedications = formData.medications.filter(med => 
//       med.name && med.name.trim() && med.quantity > 0
//     );
    
//     console.log("Valid medications after filter:", validMedications);
    
//     // Create completely fresh objects with only the data we need
//     const cleanMedications = validMedications.map(med => {
//       const clean = {
//         name: String(med.name).trim(),
//         quantity: parseInt(String(med.quantity), 10)
//       };
//       return clean;
//     });
    
//     // Test final JSON serialization
//     try {
//       const medicationsJson = JSON.stringify(cleanMedications);
//       form.append("medications", medicationsJson);
//     } catch (error) {
//       throw new Error("Failed to serialize medications data");
//     }
//     ;
    
//     // Remove the individual field approach
//     // form.append("medicationName", validMedications[0].name.trim());
//     // form.append("quantity", String(validMedications[0].quantity));
    
//     // Keep hasPrescription as original value
//     form.append("hasPrescription", formData.hasPrescription);

//     // Re-enable file upload
//     if (formData.prescriptionImage) {
//       form.append("prescriptionImage", formData.prescriptionImage);
//     }

//     for (const [key, value] of form.entries()) {
//       if (key === "prescriptionImage") {
//         console.log(key, "File:", value instanceof File ? value.name : value);
//       } else {
//         console.log(key, value);
//       }
//     }
    

//     const response = await fetch(`${API_BASE_URL}/medication-requests`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//       body: form,
//     });

//     // Better error handling
//     if (!response.ok) {
//       const contentType = response.headers.get("content-type");
      
//       try {
//         // Always try to get the response text first
//         const textResponse = await response.text();
        
//         // Try to parse as JSON if it looks like JSON
//         if (contentType && contentType.includes("application/json")) {
//           const result = JSON.parse(textResponse);
//           throw new Error(result.message || `Server error (${response.status})`);
//         } else {
//           // Server returned HTML or plain text error
//           throw new Error(`Server error (${response.status}). Check server logs for details.`);
//         }
//       } catch (parseError) {
//         throw new Error(`Server error (${response.status}). Check server logs for details.`);
//       }
//     }

//     const result = await response.json();
    
//     toast.success("Request submitted successfully");
//     setTimeout(() => {
//       navigate("/");
//     }, 1500);
    
//   } catch (error: any) {
//     toast.error(error.message || "Something went wrong");
//   }
// };
  
const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();

  const validMedications = formData.medications.filter(
    (med) => med.name.trim() && med.quantity > 0
  );

  if (validMedications.length === 0) {
    toast.error("Please add at least one medication with name and quantity");
    return;
  }

  const cleanMedications = validMedications.map((med) => ({
    name: med.name.trim(),
    quantity: Number(med.quantity),
  }));

  const form = new FormData();
  form.append("fullName", formData.fullName);
  form.append("location", formData.location);
  form.append("countryCode", formData.countryCode);
  form.append("phoneNumber", formData.phoneNumber);
  form.append("urgency", formData.urgency);
  form.append("hasPrescription", formData.hasPrescription);
  form.append("medications", JSON.stringify(cleanMedications));
  if (formData.prescriptionImage) {
    form.append("prescriptionImage", formData.prescriptionImage);
  }

  try {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      toast.error("You must be logged in");
      return;
    }

    // 1. Submit to /medication-requests
    const uploadRes = await fetch(`${API_BASE_URL}/medication-requests`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: form,
    });

    if (!uploadRes.ok) {
      const text = await uploadRes.text();
      try {
        const json = JSON.parse(text);
        throw new Error(json.message || "Failed to upload prescription");
      } catch {
        throw new Error(`Upload failed (${uploadRes.status})`);
      }
    }

    // 2. Submit to /requests (unified)
    // const unifiedPayload = {
    //   type: "medication",
    //   category: "medication_request",
    //   urgency: formData.urgency,
    //   notes: formData.hasPrescription === "Yes" ? "Prescription provided" : "No prescription",
    //   payload: {
    //     fullName: formData.fullName,
    //     location: formData.location,
    //     countryCode: formData.countryCode,
    //     phoneNumber: formData.phoneNumber,
    //     medications: cleanMedications,
    //   },
    // };

    // const unifiedRes = await fetch(`${API_BASE_URL}/auth/requests`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${token}`,
    //   },
    //   body: JSON.stringify(unifiedPayload),
    // });
    // console.log('Received payload:', unifiedPayload)

    // if (!unifiedRes.ok) {
    //   const error = await unifiedRes.json();
    //   throw new Error(error.message || "Failed to create unified request");
    // }

    toast.success("Request submitted successfully");
    setTimeout(() => {
      navigate("/");
    }, 1500);
  } catch (error: any) {
    toast.error(error.message || "Something went wrong");
  }
};


  const handleClose = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-black/40 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg sm:max-w-xl md:max-w-xl p-4 sm:p-6 overflow-auto max-h-[90vh]">
        <div className="flex justify-between items-start mb-4 sm:mb-6">
          <div className="flex-1 pr-4">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
              Request Medication
            </h1>
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
            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              className="w-full px-3 sm:px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
              placeholder="Enter your full name"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
              Location
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <MapPin size={18} className="text-gray-400" />
              </div>
              <select
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className="w-full pl-12 pr-12 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none text-base"
              >
                <option value="New York, United States">
                  New York, United States
                </option>
                <option value="Los Angeles, United States">
                  Los Angeles, United States
                </option>
                <option value="Chicago, United States">
                  Chicago, United States
                </option>
                <option value="Lagos, Nigeria">Lagos, Nigeria</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <ChevronDown size={18} className="text-gray-400" />
              </div>
            </div>
          </div>

          {/* Contact Number */}
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
              Contact number (How we reach you)
            </label>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <div className="relative w-full sm:w-auto">
                <select
                  value={formData.countryCode}
                  onChange={(e) =>
                    handleInputChange("countryCode", e.target.value)
                  }
                  className="w-full sm:w-auto px-3 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-8 text-base"
                >
                  <option value="+370">🇱🇹 +370</option>
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+44">🇬🇧 +44</option>
                  <option value="+234">🇳🇬 +234</option>
                  <option value="+91">🇮🇳 +91</option>
                  <option value="+61">🇦🇺 +61</option>
                  <option value="+81">🇯🇵 +81</option>
                  <option value="+49">🇩🇪 +49</option>
                  <option value="+33">🇫🇷 +33</option>
                  <option value="+39">🇮🇹 +39</option>
                  <option value="+34">🇪🇸 +34</option>
                  <option value="+55">🇧🇷 +55</option>
                  <option value="+86">🇨🇳 +86</option>
                  <option value="+7">🇷🇺 +7</option>
                  <option value="+82">🇰🇷 +82</option>
                  <option value="+65">🇸🇬 +65</option>
                  <option value="+41">🇨🇭 +41</option>
                  <option value="+31">🇳🇱 +31</option>
                  <option value="+46">🇸🇪 +46</option>
                  <option value="+45">🇩🇰 +45</option>
                  <option value="+47">🇳🇴 +47</option>
                  <option value="+358">🇫🇮 +358</option>
                </select>
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <ChevronDown size={14} className="text-gray-400" />
                </div>
              </div>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) =>
                  handleInputChange("phoneNumber", e.target.value)
                }
                placeholder="Phone number"
                className="flex-1 px-3 sm:px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
              />
            </div>
          </div>

          {/* Medication & Urgency */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-2">
            <div className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Medications
            </div>

            {formData.medications.map((med, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 rounded-lg"
              >
                <input
                  type="text"
                  placeholder="Medication name"
                  value={med.name}
                  onChange={(e) =>
                    handleMedicationChange(index, "name", e.target.value)
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <input
                  type="number"
                  min="0"
                  placeholder="Qty"
                  value={med.quantity}
                  onChange={(e) =>
                    handleMedicationChange(index, "quantity", e.target.value)
                  }
                  className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />

                <div className="flex space-x-1">
                  <button
                    type="button"
                    onClick={() => addMedication(index)}
                    className="font-bold text-xl px-2"
                    title="Add"
                  >
                    +
                  </button>
                  <button
                    type="button"
                    onClick={() => removeMedication(index)}
                    className="font-bold text-xl px-2"
                    title="Remove"
                    disabled={formData.medications.length === 1}
                  >
                    −
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
              When do you Need the Medication
            </label>
            <div className="relative">
              <select
                value={formData.urgency}
                onChange={(e) => handleInputChange("urgency", e.target.value)}
                className="w-full px-3 sm:px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-10 text-base min-w-0"
              >
                <option value="normal">Normal (within the week)</option>
                <option value="urgent">Urgent (within 1-2 days)</option>
                <option value="emergency">Emergency (today)</option>
                
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <ChevronDown size={16} className="text-gray-400" />
              </div>
            </div>
          </div>

          {/* Prescription Question */}
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-3">
              Do you have a Prescription
            </label>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-6">
              {["Yes", "No"].map((value) => (
                <label key={value} className="flex items-center">
                  <input
                    type="radio"
                    name="prescription"
                    value={value}
                    checked={formData.hasPrescription === value}
                    onChange={(e) =>
                      handleInputChange("hasPrescription", e.target.value)
                    }
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm sm:text-base text-gray-700">
                    {value}
                  </span>
                </label>
              ))}
            </div>
            <div className="flex items-start space-x-2 mt-3 bg-blue-50 p-3 rounded-md">
              <Info size={14} className="text-blue-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs sm:text-sm text-gray-600">
                If you do not have prescription, you will be contacted by a
                pharmacist
              </p>
            </div>
          </div>

          {/* Upload */}
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-3">
              Picture of Medication or Prescription
            </label>
            <label
              htmlFor="upload"
              className="cursor-pointer w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center hover:bg-gray-50 touch-manipulation"
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
            {formData.prescriptionImage && (
              <p className="text-sm text-gray-600 mt-2">
                File selected: {formData.prescriptionImage.name}
              </p>
            )}
          </div>

          {/* Submit */}
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
};

export default MedicationForm;
