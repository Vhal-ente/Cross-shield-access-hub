import React, { useState, ChangeEvent } from "react";
import { Upload, Phone, Mail, Calendar, User, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Whatsapp from "@/assets/whatsapp 1.svg";
import { ArrowUpTrayIcon, PlusIcon } from "@heroicons/react/24/outline";

type MedItem = { id: string; name: string; packs: number; file?: string };

const Referral = () => {
  const [activeTab, setActiveTab] = useState("refer");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contactNumber: "",
    medicalCondition: "",
    image: null,
  });
  const [meds, setMeds] = useState<MedItem[]>([
    { id: "m1", name: "", packs: 0 },
    { id: "m2", name: "", packs: 0 },
  ]);

  function addMed() {
    setMeds((s) => [...s, { id: `m${Date.now()}`, name: "", packs: 0 }]);
  }
  function removeMed(id: string) {
    setMeds((s) => s.filter((m) => m.id !== id));
  }
  function setName(id: string, v: string) {
    setMeds((s) => s.map((m) => (m.id === id ? { ...m, name: v } : m)));
  }
  function changePacks(id: string, delta: number) {
    setMeds((s) =>
      s.map((m) =>
        m.id === id ? { ...m, packs: Math.max(0, m.packs + delta) } : m
      )
    );
  }
  function onFile(id: string, e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const data = String(reader.result || "");
      setMeds((s) => s.map((m) => (m.id === id ? { ...m, file: data } : m)));
    };
    reader.readAsDataURL(file);
  }

  const referrals = [
    {
      name: "Grace Amara",
      status: "Registered",
      statusColor: "text-green-600",
      phone: "+234 901 1234 567",
      email: "graceamara@gmail.com",
      referredDate: "Oct 8, 2025",
      waitTime: "2m · 09s",
    },
    {
      name: "Grace Amara",
      status: "Declined",
      statusColor: "text-red-600",
      phone: "+234 901 1234 567",
      email: "graceamara@gmail.com",
      referredDate: "Oct 8, 2025",
      waitTime: "18m · 52s",
    },
    {
      name: "Grace Amara",
      status: "Completed",
      statusColor: "text-gray-600",
      phone: "+234 901 1234 567",
      email: "graceamara@gmail.com",
      referredDate: "Oct 8, 2025",
      waitTime: "2hr · 09m",
    },
    {
      name: "Grace Amara",
      status: "Declined",
      statusColor: "text-red-600",
      phone: "+234 901 1234 567",
      email: "graceamara@gmail.com",
      referredDate: "Oct 8, 2025",
      waitTime: "18m · 52s",
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Form/List */}
          <div className="lg:col-span-2 rounded-lg ">
            {/* Tabs */}
            <div className="flex justify-between p-6 mb-6">
              <button
                onClick={() => setActiveTab("referrals")}
                className={`px-12 py-2 font-normal ${
                  activeTab === "referrals"
                    ? "bg-[#106FB2] border rounded-2xl text-white "
                    : "text-gray-500"
                }`}
              >
                My referrals
              </button>
              <button
                onClick={() => setActiveTab("refer")}
                className={`px-12 py-2 font-normal text-base  ${
                  activeTab === "refer"
                    ? "bg-[#106FB2] border rounded-2xl text-white"
                    : "text-gray-500"
                }`}
              >
                Add Referral
              </button>
            </div>

            {activeTab === "refer" ? (
              <div>
                {/* Personal Information */}
                <div className="mb-8 bg-white border border-gray-100 p-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Personal Information
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          placeholder="Unarndb Name"
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="patient@gmail.com"
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact number
                      </label>
                      <div className="flex gap-2 border-gray-300 border rounded-lg">
                        <div className="relative ">
                          <select
                            aria-label="Country code"
                            className="appearance-none bg-gray-50 border-r border-gray-300 pl-4 pr-10 py-2 font-medium text-gray-700 focus:outline-none"
                          >
                            <option>+234</option>
                            <option>+1</option>
                            <option>+44</option>
                          </select>
                        </div>
                        <input
                          type="tel"
                          name="contactNumber"
                          value={formData.contactNumber}
                          onChange={handleInputChange}
                          placeholder="912 3456 789"
                          className="flex-1 px-4 py-2 border-none rounded-lg focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Medication Information */}

                <section className="bg-[#F3F4F6] p-5">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Medication{" "}
                      <span className="text-gray-400 text-sm font-normal">
                        (Optional)
                      </span>
                    </h3>
                    <button
                      type="button"
                      onClick={addMed}
                      className="flex items-center gap-1.5 bg-[#106FB2] text-white px-4 py-2.5 rounded-lg font-medium text-sm"
                    >
                      <PlusIcon className="w-5 h-5" />
                      Add
                    </button>
                  </div>
                  <div className="space-y-4">
                    {meds.map((m) => (
                      <div key={m.id} className="flex gap-14">
                        <div className="w-[100px] h-[100px] flex-shrink-0">
                          {m.file ? (
                            <img
                              src={m.file}
                              alt="preview"
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <label className="flex flex-col items-center justify-center bg-[#E5E7EB] border-2 border-dashed border-gray-300 rounded-lg w-full h-full cursor-pointer p-2">
                              <ArrowUpTrayIcon className="text-gray-400 mb-1 w-7 h-7" />
                              <span className="text-xs text-gray-500 text-center leading-tight">
                                Supported formats: JPEG, PNG, JPG
                              </span>
                              <input
                                type="file"
                                accept="image/*"
                                className="sr-only"
                                onChange={(e) => onFile(m.id, e)}
                              />
                            </label>
                          )}
                        </div>

                        <div className="flex flex-1 items-center gap-14">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Medication Name
                            </label>
                            <input
                              value={m.name}
                              onChange={(e) => setName(m.id, e.target.value)}
                              placeholder="Medication Name"
                              className="w-full px-16 py-2 border border-gray-300 bg-transparent rounded-lg"
                            />
                          </div>

                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Packs
                              </label>
                              <div className="flex items-center h-10 text-sm">
                                <button
                                  type="button"
                                  aria-label="Decrease pack count"
                                  onClick={() => changePacks(m.id, -1)}
                                  className="w-10 h-full flex items-center justify-center border border-gray-300 rounded-l-lg text-[#106FB2] text-2xl font-light"
                                >
                                  &minus;
                                </button>
                                <span className="h-full flex items-center justify-center border border-gray-300 text-[#106FB2] font-semibold px-5">
                                  {m.packs}
                                </span>
                                <button
                                  type="button"
                                  aria-label="Increase pack count"
                                  onClick={() => changePacks(m.id, 1)}
                                  className="w-10 h-full flex items-center justify-center border-y border-r border-gray-300 rounded-r-lg text-[#106FB2] text-2xl font-light"
                                >
                                  +
                                </button>
                              </div>
                            </div>

                            <div className="pt-6">
                              <button
                                type="button"
                                onClick={() => removeMed(m.id)}
                                className="text-gray-400 "
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <div className="bg-[#F3F4F6] p-5 mt-12">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Medication Information{" "}
                    <span className="text-gray-400 text-sm font-normal">
                      (Optional)
                    </span>
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Medical Condition
                      </label>
                      <input
                        type="text"
                        name="medicalCondition"
                        value={formData.medicalCondition}
                        onChange={handleInputChange}
                        placeholder="e.g., Diabetes, Hypertension"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none bg-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Image of the medication or prescription{" "}
                        <span className="text-gray-400">(Optional)</span>
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                        <Upload className="mx-auto w-12 h-12 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">
                          Drag & Drop to Upload
                          <br />
                          <span className="text-blue-600 cursor-pointer hover:underline">
                            Browse Files
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <button className="bg-[#106FB2] mt-10 text-white px-8 py-2 border rounded-full text-center w-full">
                  {" "}
                  Refer Patient{" "}
                </button>
              </div>
            ) : (
              <div>
                {/* Referrals List */}
                <div className="space-y-4 grid grid-cols-2 gap-6">
                  {referrals.map((referral, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {referral.name}
                          </h3>
                          <p
                            className={`text-sm font-medium ${referral.statusColor}`}
                          >
                            {referral.status}{" "}
                            <span className="text-gray-400">
                              • {referral.waitTime}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 space-y-4">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          {referral.phone}
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {referral.email}
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Referred on {referral.referredDate}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Help Section */}
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 text-gray-800 py-2.5 px-4 rounded w-[300px] text-sm">
              These are verified requests from patients who need help sourcing
              for their medications. Your contribution can save lives.
            </div>

            <div className="bg-card rounded-lg shadow-md p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-success/10 rounded-full ">
                  <img src={Whatsapp} alt="whatsapp" className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-sm font-normal text-neutral-800">
                    Need Help?
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Our support team is available
                  </p>
                </div>
              </div>
              <Button className="w-full bg-[#106FB2] hover:bg-[#106FB2]/90 text-sm rounded-full">
                Chat with Support
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Referral;
