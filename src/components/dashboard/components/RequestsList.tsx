
// import React, { useState } from "react";
// import Whatsapp from "@/assets/whatsapp 1.svg"; 
// import { Button } from "@/components/ui/button"; 
// import { Eye, MoreVertical } from "lucide-react";

// // --- Reusable MedicationCard Component (Corrected) ---

// interface MedicationCardProps {
//   statusIcon: string;
//   medicationName: string;
//   medicationStrength: string;
//   statusText: string;
//   orderId: string;
//   price: string;
//   buttonText: string;
//   isButtonDisabled?: boolean;
//   // --- Props for lifted state ---
//   cardId: string; // A unique ID for this card
//   showMenu: string | null;
//   setShowMenu: React.Dispatch<React.SetStateAction<string | null>>;
// }

// const MedicationCard: React.FC<MedicationCardProps> = ({
//   statusIcon,
//   medicationName,
//   medicationStrength,
//   statusText,
//   orderId,
//   price,
//   buttonText,
//   isButtonDisabled = false,
//   cardId,
//   showMenu,
//   setShowMenu,
// }) => {
//   // --- This internal state was removed ---
//   // const [showMenu, setShowMenu] = useState(null); 

//   // Determine button color
//   let buttonClasses = " text-[#1F2937] border-2 border-[#106FB2]"; // Default (Respond)
//   if (buttonText === "Dispatched") {
//     // This class is the same as the default, but it's fine
//     buttonClasses = "text-[#1F2937] border-2 border-[#106FB2]";
//   }

//   return (
//     <>
//       <div className="relative bg-card border border-gray-200 rounded-lg p-4 mb-4 flex justify-between items-start shadow-sm w-[47%] box-border">
//         {/* --- LEFT SIDE --- */}
//         <div className="flex items-center gap-2">
//           <div
//             className={`text-[#106FB2] rounded-full w-[50px] h-[50px] flex-shrink-0 flex justify-center items-center mr-4 text-sm font-bold bg-[#E1F8FF]`}
//           >
//             {statusIcon}
//           </div>
//           <div className="space-y-3">
//             <h4 className="mb-1 text-base font-semibold">
//               {medicationName} {medicationStrength}
//             </h4>
//             <p className="m-0 text-xs text-gray-600">
//               {statusText} • {orderId}
//             </p>
//             <p className="mt-1 font-bold">{price}</p>
//           </div>
//         </div>

//         {/* --- RIGHT SIDE --- */}
//         <div className="flex flex-col items-end">
//           <button
//             onClick={() =>
//               // Use cardId to check if this menu should be open
//               setShowMenu(showMenu === cardId ? null : cardId)
//             }
//             className="text-gray-400 hover:text-gray-600"
//           >
//             <MoreVertical size={20} />
//           </button>

//           {/* Dropdown Menu */}
//           {showMenu === cardId && ( // Check against cardId
//             <div className="absolute right-0 top-9 bg-[#106FB240] border border-gray-200 rounded-lg shadow-lg px-1 z-20 w-28">
//               <button className="w-full px-4 py-2 text-left text-md text-gray-800 flex items-center gap-2">
//                 <Eye size={16} />
//                 View
//               </button>
//             </div>
//           )}

//           {/* Action Button */}
//           <div className="mt-16">
//             <button
//               className={`py-1.5 px-4 rounded-xl ${buttonClasses} disabled:cursor-not-allowed disabled:opacity-60`}
//               disabled={isButtonDisabled}
//             >
//               {buttonText}
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// // --- Reusable Pagination Component (Unchanged) ---

// interface PaginationProps {
//   currentPage: number;
//   totalPages: number;
//   onPageChange: (page: number) => void;
// }

// export const Pagination: React.FC<PaginationProps> = ({
//   currentPage,
//   totalPages,
//   onPageChange,
// }) => {
//   const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

//   return (
//     <div className="flex justify-center mt-16 gap-1.5">
//       <button
//         onClick={() => onPageChange(Math.max(1, currentPage - 1))}
//         disabled={currentPage === 1}
//         className="py-2 px-3 border border-gray-300 rounded bg-white disabled:cursor-not-allowed disabled:opacity-50"
//       >
//         &lt;
//       </button>
//       {pages.map((page) => (
//         <button
//           key={page}
//           onClick={() => onPageChange(page)}
//           className={`px-3 border border-gray-300 rounded cursor-pointer ${
//             page === currentPage ? "text-[#106FB2]" : "bg-white text-black"
//           }`}
//         >
//           {page}
//         </button>
//       ))}
//       <button
//         onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
//         disabled={currentPage === totalPages}
//         className="py-2 px-3 border border-gray-300 rounded bg-white disabled:cursor-not-allowed disabled:opacity-50"
//       >
//         &gt;
//       </button>
//     </div>
//   );
// };

// // --- Header Component (Unchanged) ---

// export const Header: React.FC = () => {
//   return (
//     <div>
//       <div className="flex border border-gray-300 items-center rounded-lg p-5 mb-5">
//         <input
//           type="text"
//           placeholder="eg. ORD-001"
//           className="flex-grow p-2.5 border border-gray-300 focus:outline-none rounded mr-2.5"
//         />
//         <button className="py-2.5 px-12 bg-[#106FB2] text-white border-none rounded-xl cursor-pointer hover:bg-[#106FB2]/90">
//           Search
//         </button>
//       </div>
//     </div>
//   );
// };

// // --- Main Dashboard Component (Corrected) ---

// // Create a data array for the cards
// const medicationData = [
//   {
//     id: "card-1",
//     statusIcon: "+1",
//     medicationName: "Metformin",
//     medicationStrength: "500mg",
//     statusText: "Processing • Fragile",
//     orderId: "1 medications • ORD - 003",
//     price: "₦20,000",
//     buttonText: "Respond",
//     isButtonDisabled: false,
//   },
//   {
//     id: "card-2",
//     statusIcon: "+2",
//     medicationName: "Metformin",
//     medicationStrength: "500mg",
//     statusText: "Pending",
//     orderId: "2 medications • ORD - 002",
//     price: "₦20,000",
//     buttonText: "Respond",
//     isButtonDisabled: false,
//   },
//   {
//     id: "card-3",
//     statusIcon: "+2",
//     medicationName: "Metformin",
//     medicationStrength: "500mg",
//     statusText: "Dispatch",
//     orderId: "2 medications • ORD - 002",
//     price: "₦20,000",
//     buttonText: "Dispatched",
//     isButtonDisabled: true,
//   },
//   {
//     id: "card-4",
//     statusIcon: "+2",
//     medicationName: "Metformin",
//     medicationStrength: "500mg",
//     statusText: "In transit",
//     orderId: "2 medications • ORD - 002",
//     price: "₦20,000",
//     buttonText: "Respond",
//     isButtonDisabled: false,
//   },
//   {
//     id: "card-5",
//     statusIcon: "+3",
//     medicationName: "Metformin",
//     medicationStrength: "500mg",
//     statusText: "Delivered",
//     orderId: "3 medications • ORD - 001",
//     price: "₦20,000",
//     buttonText: "Respond",
//     isButtonDisabled: false,
//   },
//   {
//     id: "card-6",
//     statusIcon: "+2",
//     medicationName: "Metformin",
//     medicationStrength: "500mg",
//     statusText: "Pending",
//     orderId: "2 medications • ORD - 002",
//     price: "₦20,000",
//     buttonText: "Respond",
//     isButtonDisabled: false,
//   },
// ];

// export const RequestsList: React.FC = () => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const totalPages = 4;

//   // --- LIFTED STATE ---
//   // This state now lives in the parent component
//   const [showMenu, setShowMenu] = useState<string | null>(null);

//   const handlePageChange = (page: number) => {
//     setCurrentPage(page);
//   };

//   return (
//     <>
//       <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-24">
//         <Header />
//         {/* Right Sidebar (Need Help?) */}
//         <div className="space-y-4">
//           <div className="bg-blue-50 border border-blue-200 text-gray-800 py-2.5 px-4 rounded w-[300px] text-sm">
//             These are verified requests from patients who need help sourcing for
//             their medications. Your contribution can save lives.
//           </div>

//           <div className="bg-card rounded-lg shadow-md p-6">
//             <div className="flex items-center gap-3 mb-4">
//               <div className="bg-success/10 rounded-full ">
//                 <img src={Whatsapp} alt="whatsapp" className="w-10 h-10" />
//               </div>
//               <div>
//                 <h3 className="text-sm font-normal text-neutral-800">
//                   Need Help?
//                 </h3>
//                 <p className="text-xs text-neutral-500">
//                   Our support team is available
//                 </p>
//               </div>
//             </div>
//             <Button className="w-full bg-[#106FB2] hover:bg-[#106FB2]/90 text-sm rounded-full">
//               Chat with Support
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* Main Content Area */}
//       {/* Note: Removed the extra `flex p-5 gap-5` wrapper for a cleaner layout */}
//       <div className="flex-1">
//         <div className="flex flex-wrap gap-x-6 gap-y-5">
//           {/* Map over the data array */}
//           {medicationData.map((card) => (
//             <MedicationCard
//               key={card.id}
//               // Pass the unique ID
//               cardId={card.id} 
//               statusIcon={card.statusIcon}
//               medicationName={card.medicationName}
//               medicationStrength={card.medicationStrength}
//               statusText={card.statusText}
//               orderId={card.orderId}
//               price={card.price}
//               buttonText={card.buttonText}
//               isButtonDisabled={card.isButtonDisabled}
//               // Pass the state and setter down as props
//               showMenu={showMenu}
//               setShowMenu={setShowMenu}
//             />
//           ))}
//         </div>
//         <Pagination
//           currentPage={currentPage}
//           totalPages={totalPages}
//           onPageChange={handlePageChange}
//         />
//       </div>
//     </>
//   );
// };


import React, { useState } from "react";
import { X, ChevronDown, Minus, Plus, Eye, MoreVertical } from 'lucide-react';

// --- Types ---
interface Medication {
  name: string;
  strength: string;
  pack: string;
  availability: string;
  qty: number;
  brand: string;
  unitPrice: string;
  image?: string;
}

interface CardData {
  id: string;
  statusIcon: string;
  medicationName: string;
  medicationStrength: string;
  statusText: string;
  orderId: string;
  price: string;
  buttonText: string;
  isButtonDisabled: boolean;
  medications?: Medication[];
}

// --- Modal Component ---
interface RespondModalProps {
  isOpen: boolean;
  onClose: () => void;
  cardData: CardData | null;
}

const RespondModal: React.FC<RespondModalProps> = ({ isOpen, onClose, cardData }) => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [provideTime, setProvideTime] = useState('');

  // Initialize medications from card data when modal opens
  React.useEffect(() => {
    if (isOpen && cardData) {
      if (cardData.medications && cardData.medications.length > 0) {
        setMedications(cardData.medications);
      } else {
        // Create default medication from card data
        setMedications([
          {
            name: `${cardData.medicationName} ${cardData.medicationStrength}`,
            strength: cardData.medicationStrength,
            pack: 'Frequent packs',
            availability: 'In stock',
            qty: 0,
            brand: '',
            unitPrice: '',
            image: undefined
          }
        ]);
      }
    }
  }, [isOpen, cardData]);

  const updateMedication = (index: number, field: string, value: any) => {
    setMedications(meds =>
      meds.map((med, idx) =>
        idx === index ? { ...med, [field]: value } : med
      )
    );
  };

  const incrementQty = (index: number) => {
    setMedications(meds =>
      meds.map((med, idx) =>
        idx === index ? { ...med, qty: med.qty + 1 } : med
      )
    );
  };

  const decrementQty = (index: number) => {
    setMedications(meds =>
      meds.map((med, idx) =>
        idx === index ? { ...med, qty: Math.max(0, med.qty - 1) } : med
      )
    );
  };

  const handleImageUpload = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateMedication(index, 'image', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen || !cardData) return null;

  // Extract status from statusText (e.g., "Processing • Fragile" -> "Processing")
  const status = cardData.statusText.split('•')[0].trim();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <h2 className="text-base font-semibold text-gray-900">Respond to Request</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Alert Banner - Dynamic status */}
          <div className="text-xs">
            <span className="text-orange-500 font-medium">{status}</span>
            <span className="text-orange-500"> • {cardData.orderId}</span>
          </div>

          {/* Medications */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900">Medication</h3>

            {medications.map((med, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-3 space-y-3">
                {/* Medication Header */}
                <div className="flex gap-2">
                  <div className="w-10 h-10 bg-white rounded border border-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {med.image ? (
                      <img 
                        src={med.image} 
                        alt={med.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <label className="cursor-pointer w-full h-full flex items-center justify-center">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(index, e)}
                          className="hidden"
                        />
                        <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </label>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 text-sm">{med.name}</h4>
                    <p className="text-xs text-orange-500">{med.pack}</p>
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Availability
                  </label>
                  <select
                    value={med.availability}
                    onChange={(e) => updateMedication(index, 'availability', e.target.value)}
                    className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="In stock">In stock</option>
                    <option value="Out of stock">Out of stock</option>
                    <option value="Limited stock">Limited stock</option>
                  </select>
                </div>

                {/* Qty and Brand */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Qty
                    </label>
                    <div className="flex items-center border border-gray-300 rounded bg-white">
                      <button
                        onClick={() => decrementQty(index)}
                        className="px-2 py-1 hover:bg-gray-50"
                      >
                        <Minus className="w-3 h-3 text-gray-600" />
                      </button>
                      <input
                        type="text"
                        value={med.qty}
                        onChange={(e) => updateMedication(index, 'qty', parseInt(e.target.value) || 0)}
                        className="flex-1 text-center border-0 py-1 text-xs focus:ring-0 w-8"
                      />
                      <button
                        onClick={() => incrementQty(index)}
                        className="px-2 py-1 hover:bg-gray-50"
                      >
                        <Plus className="w-3 h-3 text-gray-600" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Brand
                    </label>
                    <input
                      type="text"
                      value={med.brand}
                      onChange={(e) => updateMedication(index, 'brand', e.target.value)}
                      placeholder="Brand name"
                      className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Unit Price */}
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Unit Price
                  </label>
                  <input
                    type="text"
                    value={med.unitPrice}
                    onChange={(e) => updateMedication(index, 'unitPrice', e.target.value)}
                    placeholder="Enter price"
                    className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Provide Time */}
          <div>
            <label className="block text-xs font-medium text-gray-900 mb-1.5">
              When can you provide this medication
            </label>
            <div className="relative">
              <select
                value={provideTime}
                onChange={(e) => setProvideTime(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded bg-white appearance-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select time</option>
                <option value="immediately">Immediately</option>
                <option value="1-2 hours">1-2 hours</option>
                <option value="same-day">Same day</option>
                <option value="next-day">Next day</option>
                <option value="2-3 days">2-3 days</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            className="flex-1 px-4 py-2 text-sm bg-[#106FB2] text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
          >
            Respond
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Reusable MedicationCard Component ---
interface MedicationCardProps {
  statusIcon: string;
  medicationName: string;
  medicationStrength: string;
  statusText: string;
  orderId: string;
  price: string;
  buttonText: string;
  isButtonDisabled?: boolean;
  cardId: string;
  showMenu: string | null;
  setShowMenu: React.Dispatch<React.SetStateAction<string | null>>;
  onRespondClick: (cardData: CardData) => void;
  cardData: CardData;
}

const MedicationCard: React.FC<MedicationCardProps> = ({
  statusIcon,
  medicationName,
  medicationStrength,
  statusText,
  orderId,
  price,
  buttonText,
  isButtonDisabled = false,
  cardId,
  showMenu,
  setShowMenu,
  onRespondClick,
  cardData,
}) => {
  let buttonClasses = " text-[#1F2937] border-2 border-[#106FB2]";
  if (buttonText === "Dispatched") {
    buttonClasses = "text-[#1F2937] border-2 border-[#106FB2]";
  }

  return (
    <>
      <div className="relative bg-transparent border border-gray-200 rounded-lg p-4 mb-4 mt-8 flex justify-between items-start shadow-sm w-[47%] box-border">
        {/* LEFT SIDE */}
        <div className="flex items-center gap-2">
          <div
            className={`text-[#106FB2] rounded-full w-[50px] h-[50px] flex-shrink-0 flex justify-center items-center mr-4 text-sm font-bold bg-[#E1F8FF]`}
          >
            {statusIcon}
          </div>
          <div className="space-y-3">
            <h4 className="mb-1 text-base font-semibold">
              {medicationName} {medicationStrength}
            </h4>
            <p className="m-0 text-xs text-gray-600">
              {statusText} • {orderId}
            </p>
            <p className="mt-1 font-bold">{price}</p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col items-end">
          <button
            onClick={() =>
              setShowMenu(showMenu === cardId ? null : cardId)
            }
            className="text-gray-400 hover:text-gray-600"
          >
            <MoreVertical size={20} />
          </button>

          {/* Dropdown Menu */}
          {showMenu === cardId && (
            <div className="absolute right-0 top-9 bg-[#106FB240] border border-gray-200 rounded-lg shadow-lg px-1 z-20 w-28">
              <button className="w-full px-4 py-2 text-left text-md text-gray-800 flex items-center gap-2">
                <Eye size={16} />
                View
              </button>
            </div>
          )}

          {/* Action Button */}
          <div className="mt-16">
            <button
              className={`py-1.5 px-4 rounded-xl ${buttonClasses} disabled:cursor-not-allowed disabled:opacity-60`}
              disabled={isButtonDisabled}
              onClick={buttonText === "Respond" ? () => onRespondClick(cardData) : undefined}
            >
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// --- Reusable Pagination Component ---
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center mt-16 gap-1.5">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="py-2 px-3 border border-gray-300 rounded bg-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        &lt;
      </button>
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 border border-gray-300 rounded cursor-pointer ${
            page === currentPage ? "text-[#106FB2]" : "bg-white text-black"
          }`}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="py-2 px-3 border border-gray-300 rounded bg-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        &gt;
      </button>
    </div>
  );
};

// --- Header Component ---
export const Header: React.FC = () => {
  return (
    <div>
      <div className="flex border border-gray-300 items-center rounded-lg p-5 mb-5">
        <input
          type="text"
          placeholder="eg. ORD-001"
          className="flex-grow p-2.5 border bg-transparent focus:outline-none rounded mr-2.5"
        />
        <button className="py-2.5 px-12 bg-[#106FB2] text-white border-none rounded-xl cursor-pointer hover:bg-[#106FB2]/90">
          Search
        </button>
      </div>
    </div>
  );
};

// --- Main Dashboard Component ---
const medicationData: CardData[] = [
  {
    id: "card-1",
    statusIcon: "+1",
    medicationName: "Metformin",
    medicationStrength: "500mg",
    statusText: "Processing • Fragile",
    orderId: "1 medications • ORD - 003",
    price: "₦20,000",
    buttonText: "Respond",
    isButtonDisabled: false,
    medications: [
      {
        name: "Metformin 500mg",
        strength: "500mg",
        pack: "Frequent packs",
        availability: "In stock",
        qty: 0,
        brand: "",
        unitPrice: "",
        // Example: You can add image URLs here
        image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop"
      }
    ]
  },
  {
    id: "card-2",
    statusIcon: "+2",
    medicationName: "Metformin",
    medicationStrength: "500mg",
    statusText: "Pending",
    orderId: "2 medications • ORD - 002",
    price: "₦20,000",
    buttonText: "Respond",
    isButtonDisabled: false,
    medications: [
      {
        name: "Metformin 500mg",
        strength: "500mg",
        pack: "Frequent packs",
        availability: "In stock",
        qty: 0,
        brand: "",
        unitPrice: "",
        image: undefined
      },
      {
        name: "Procold",
        strength: "",
        pack: "Frequent packs",
        availability: "In stock",
        qty: 0,
        brand: "",
        unitPrice: "",
        image: undefined
      }
    ]
  },
  {
    id: "card-3",
    statusIcon: "+2",
    medicationName: "Metformin",
    medicationStrength: "500mg",
    statusText: "Dispatch",
    orderId: "2 medications • ORD - 002",
    price: "₦20,000",
    buttonText: "Dispatched",
    isButtonDisabled: true,
  },
  {
    id: "card-4",
    statusIcon: "+2",
    medicationName: "Metformin",
    medicationStrength: "500mg",
    statusText: "In transit",
    orderId: "2 medications • ORD - 002",
    price: "₦20,000",
    buttonText: "Respond",
    isButtonDisabled: false,
  },
  {
    id: "card-5",
    statusIcon: "+3",
    medicationName: "Metformin",
    medicationStrength: "500mg",
    statusText: "Delivered",
    orderId: "3 medications • ORD - 001",
    price: "₦20,000",
    buttonText: "Respond",
    isButtonDisabled: false,
  },
  {
    id: "card-6",
    statusIcon: "+2",
    medicationName: "Metformin",
    medicationStrength: "500mg",
    statusText: "Pending",
    orderId: "2 medications • ORD - 002",
    price: "₦20,000",
    buttonText: "Respond",
    isButtonDisabled: false,
  },
];

export const RequestsList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 4;
  const [showMenu, setShowMenu] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCardData, setSelectedCardData] = useState<CardData | null>(null);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRespondClick = (cardData: CardData) => {
    setSelectedCardData(cardData);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCardData(null);
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-24">
        <Header />
        {/* Right Sidebar (Need Help?) */}
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 text-gray-800 py-2.5 px-4 rounded w-[300px] text-sm">
            These are verified requests from patients who need help sourcing for
            their medications. Your contribution can save lives.
          </div>

          <div className="bg-card rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-success/10 rounded-full w-10 h-10 flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
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
            <button className="w-full bg-[#106FB2] hover:bg-[#106FB2]/90 text-white py-2 text-sm rounded-full">
              Chat with Support
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1">
        <div className="flex flex-wrap gap-x-6 gap-y-5">
          {medicationData.map((card) => (
            <MedicationCard
              key={card.id}
              cardId={card.id}
              statusIcon={card.statusIcon}
              medicationName={card.medicationName}
              medicationStrength={card.medicationStrength}
              statusText={card.statusText}
              orderId={card.orderId}
              price={card.price}
              buttonText={card.buttonText}
              isButtonDisabled={card.isButtonDisabled}
              showMenu={showMenu}
              setShowMenu={setShowMenu}
              onRespondClick={handleRespondClick}
              cardData={card}
            />
          ))}
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Modal */}
      <RespondModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        cardData={selectedCardData}
      />
    </>
  );
};