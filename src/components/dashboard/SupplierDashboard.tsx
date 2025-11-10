
import React, { useState, ChangeEvent } from "react";
import EmptyStateMeds from "@/assets/EmptyMeds.svg";
import Whatsapp from "@/assets/whatsapp 1.svg";
import StatsCard from "@/components/dashboard/components/StatsCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Orders } from "./components/RequestOrders";
import ReferralForm from "./components/ReferralForm";
import { ProductsList } from "./components/ProductsList";
import { RequestsList } from "./components/RequestsList";
import { CheckCircle, Megaphone, Package, Trash2 } from "lucide-react";
import { UserIcon, MapPinIcon, EnvelopeIcon, ChevronDownIcon, PlusIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';

type ActiveTab = "summary" | "requests" | "order" | "patient" | "products";

type MedItem = { id: string; name: string; packs: number; file?: string };

export function SupplierDashboard() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("summary");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tabs = [
    { id: "summary" as ActiveTab, label: "Summary", icon: Package },
    { id: "requests" as ActiveTab, label: "Requests", icon: CheckCircle },
    { id: "order" as ActiveTab, label: "My Orders", icon: Megaphone },
    { id: "patient" as ActiveTab, label: "Refer a Patient", icon: Package },
    { id: "products" as ActiveTab, label: "Products", icon: Package },
  ];

  const stats = [
    { label: "New Requests", value: 0 },
    { label: "Products", value: 0 },
    { label: "Total Orders", value: 0 },
    { label: "In Transit", value: 0 },
  ];

  const SummaryContent = ({ onMakeRequestClick }: { onMakeRequestClick: () => void }) => (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6 mt-4">
      <div aria-label="summary-main" className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <StatsCard key={stat.label} label={stat.label} value={stat.value} />
          ))}
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 min-h-[300px]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-neutral-700">Recent requests</h2>
            <Button variant="link" className="text-[#106FB2]">See All</Button>
          </div>
          <div className="flex flex-col items-center justify-center py-12">
            <img src={EmptyStateMeds} alt="No requests" className="w-48 h-48 mb-4" />
            <p className="text-muted-foreground mt-4 text-gray-500">There are no new requests</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-card rounded-lg shadow-md p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Quick actions</h3>
          <div className="space-x-4 items-center grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
            <Button
              variant="outline"
              className="rounded-xl justify-start text-sm border-2 border-[#106FB2] text-[#106FB2] hover:none"
              onClick={onMakeRequestClick}
            >
              Make a request
            </Button>
            <Button variant="outline" className="w-full rounded-xl justify-start text-sm border-2 border-[#106FB2] text-[#106FB2]">Add a product</Button>
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-success/10 rounded-full ">
              <img src={Whatsapp} alt="whatsapp" className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-sm font-normal text-neutral-800">Need Help?</h3>
              <p className="text-xs text-neutral-500">Our support team is available</p>
            </div>
          </div>
          <Button className="w-full bg-[#106FB2] hover:bg-[#106FB2]/90 text-sm rounded-full">Chat with Support</Button>
        </div>
      </div>
    </div>
  );

  const ContentWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="mt-6 min-h-[400px]">{children}</div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "summary":
        return <SummaryContent onMakeRequestClick={() => setIsModalOpen(true)} />;
      case "requests":
        return <ContentWrapper><RequestsList /></ContentWrapper>;
      case "order":
        return <ContentWrapper><Orders /></ContentWrapper>;
      case "patient":
        return <ContentWrapper><ReferralForm /></ContentWrapper>;
      case "products":
        return <ContentWrapper><ProductsList /></ContentWrapper>;
      default:
        return <SummaryContent onMakeRequestClick={() => setIsModalOpen(true)} />;
    }
  };

  return (
    <div className="p-6 min-h-screen relative">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900">Supplier Dashboard</h2>
          <p className="text-gray-600 mt-1">Respond to requests and manage your product catalog</p>
        </div>
        <Badge className="bg-green-100 text-green-800">Sub Admin</Badge>
      </div>

      <div className="flex space-x-1 mb-11 bg-[#E5E5E5] rounded-xl p-1 shadow-md border border-gray-100">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <Button
              key={tab.id}
              variant={isActive ? "default" : "ghost"}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 transition-all ${isActive ? "bg-[#106FB2] shadow-lg text-white" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"}`}
              onClick={() => setActiveTab(tab.id as ActiveTab)}
            >
              <Icon className="h-5 w-5" />
              <span className="hidden sm:inline">{tab.label}</span>
            </Button>
          );
        })}
      </div>

      <div className="w-full">{renderContent()}</div>

      <RequestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}


interface RequestModalProps { isOpen: boolean; onClose: () => void }

function RequestModal({ isOpen, onClose }: RequestModalProps) {
  const [meds, setMeds] = useState<MedItem[]>([
    { id: "m1", name: "", packs: 0 },
    { id: "m2", name: "", packs: 0 },
  ]);

  if (!isOpen) return null;

  function addMed() { setMeds((s) => [...s, { id: `m${Date.now()}`, name: "", packs: 0 }]) }
  function removeMed(id: string) { setMeds((s) => s.filter((m) => m.id !== id)) }
  function setName(id: string, v: string) { setMeds((s) => s.map((m) => (m.id === id ? { ...m, name: v } : m))) }
  function changePacks(id: string, delta: number) { setMeds((s) => s.map((m) => (m.id === id ? { ...m, packs: Math.max(0, m.packs + delta) } : m))) }
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

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 min-h-screen flex items-start justify-center p-4 md:p-10 z-50 overflow-y-auto" onClick={onClose}>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[680px] p-6 md:p-8 my-10" onClick={(e) => e.stopPropagation()}>
        <button type="button" aria-label="Close modal" className="absolute top-6 right-6 text-gray-400 hover:text-gray-600" onClick={onClose}>
          <span className="text-3xl font-light">&times;</span>
        </button>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Make a request</h2>

        <form className="space-y-8">
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
            <div className="space-y-4">
              <IconInput id="full-name" label="Full Name" defaultValue="Uheendah Neme" icon={<UserIcon className="w-5 h-5 text-gray-400" />} />
              <IconInput id="location" label="Location" defaultValue="Lagos, Nigeria" icon={<MapPinIcon className="w-5 h-5 text-gray-400" />} />
              <IconInput id="email" label="Email" type="email" defaultValue="neme@gmail.com" icon={<EnvelopeIcon className="w-5 h-5 text-gray-400" />} />
              <PhoneInput />
            </div>
          </section>

          <section className="bg-[#F3F4F6] p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Medication</h3>
              <button type="button" onClick={addMed} className="flex items-center gap-1.5 bg-[#106FB2] text-white px-4 py-2.5 rounded-lg font-medium text-sm">
                <PlusIcon className="w-5 h-5" />
                Add
              </button>
            </div>
            <div className="space-y-4">
              {meds.map((m) => (
                <div key={m.id} className="flex gap-4">
                  <div className="w-[100px] h-[100px] flex-shrink-0">
                    {m.file ? (
                      <img src={m.file} alt="preview" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <label className="flex flex-col items-center justify-center bg-[#E5E7EB] border-2 border-dashed border-gray-300 rounded-lg w-full h-full cursor-pointer p-2">
                        <ArrowUpTrayIcon className="text-gray-400 mb-1 w-7 h-7" />
                        <span className="text-xs text-gray-500 text-center leading-tight">Supported formats: JPEG, PNG, JPG</span>
                        <input type="file" accept="image/*" className="sr-only" onChange={(e) => onFile(m.id, e)} />
                      </label>
                    )}
                  </div>

                  <div className="flex flex-1 items-center gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Medication Name</label>
                      <input value={m.name} onChange={(e) => setName(m.id, e.target.value)} placeholder="Medication Name" className="w-full px-16 py-2 border border-gray-300 bg-transparent rounded-lg" />
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Packs</label>
                        <div className="flex items-center h-10 text-sm">
                          <button type="button" aria-label="Decrease pack count" onClick={() => changePacks(m.id, -1)} className="w-10 h-full flex items-center justify-center border border-gray-300 rounded-l-lg text-[#106FB2] text-2xl font-light">&minus;</button>
                          <span className="h-full flex items-center justify-center border border-gray-300 text-[#106FB2] font-semibold px-5">{m.packs}</span>
                          <button type="button" aria-label="Increase pack count" onClick={() => changePacks(m.id, 1)} className="w-10 h-full flex items-center justify-center border-y border-r border-gray-300 rounded-r-lg text-[#106FB2] text-2xl font-light">+</button>
                        </div>
                      </div>

                      <div className="pt-6">
                        <button type="button" onClick={() => removeMed(m.id)} className="text-gray-400 "><Trash2 size={16} /></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <label htmlFor="delivery-time" className="block text-sm font-medium text-gray-700 mb-2">When do you need the medication?</label>
            <div className="relative">
              <select id="delivery-time" className="w-full appearance-none px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-500">
                <option value="" disabled>Calendar</option>
                <option value="today">Today</option>
                <option value="tomorrow">Tomorrow</option>
              </select>
              <ChevronDownIcon className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </section>

          <section>
            <label className="block text-sm font-medium text-gray-700 mb-2.5">Do you have a prescription?</label>
            <div className="flex items-center gap-6">
              <CustomRadio id="yes" name="prescription" label="Yes" defaultChecked />
              <CustomRadio id="no" name="prescription" label="No" />
            </div>
            <p className="text-xs text-gray-500 mt-2">If you do not have any prescription, you will be contacted by a pharmacist.</p>
          </section>

          <section>
            <label className="block text-sm font-medium text-gray-700 mb-2">Image of the medication or prescription <span className="text-gray-400 font-normal"> (optional)</span></label>
            <div className="w-full h-36 border-2 border-dashed rounded-lg flex items-center justify-center">
              <ArrowUpTrayIcon className="w-9 h-9 text-gray-400" />
            </div>
          </section>

          <div className="flex justify-end">
            <button type="button" className="bg-gray-100 px-4 py-2 rounded-lg mr-3" onClick={onClose}>Cancel</button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg">Send Request</button>
          </div>
        </form>
      </div>
    </div>
  );
}


interface IconInputProps extends React.InputHTMLAttributes<HTMLInputElement> { label: string; id: string; icon: React.ReactNode }
const IconInput: React.FC<IconInputProps> = ({ label, id, icon, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">{icon}</div>
      <input id={id} {...props} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg" />
    </div>
  </div>
);

const PhoneInput = () => (
  <div>
    <label htmlFor="contact-number" className="block text-sm font-medium text-gray-700 mb-2">Contact number</label>
    <div className="flex border border-gray-300 rounded-lg overflow-hidden">
      <div className="relative">
        <select aria-label="Country code" className="appearance-none bg-gray-50 border-r border-gray-300 pl-4 pr-10 py-2 font-medium text-gray-700 focus:outline-none"><option>+234</option><option>+1</option><option>+44</option></select>
      </div>
      <input type="tel" id="contact-number" defaultValue="912 3456 789" className="flex-1 w-full pl-4 border-none" />
    </div>
  </div>
);

interface CustomRadioProps { id: string; name: string; label: string; defaultChecked?: boolean }
const CustomRadio: React.FC<CustomRadioProps> = ({ id, name, label, defaultChecked }) => (
  <label htmlFor={id} className="flex items-center gap-2.5 cursor-pointer">
    <input type="radio" id={id} name={name} defaultChecked={defaultChecked} className="peer hidden" />
    <span className="w-5 h-5 border-2 border-gray-300 rounded-full flex items-center justify-center transition-all peer-checked:border-blue-600 peer-checked:bg-blue-600"><span className="w-2.5 h-2.5 bg-white rounded-full scale-0 peer-checked:scale-100 transition-transform"></span></span>
    <span className="text-gray-700">{label}</span>
  </label>
);
