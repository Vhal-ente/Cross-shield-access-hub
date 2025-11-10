// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";

// export const ProductsList = () => {
//   const products = [
//     {
//       id: 1,
//       name: "Paracetamol 500mg",
//       details: "Pain reliever and fever reducer",
//       price: 500,
//       expDate: "2025-12-31",
//       status: "active"
//     },
//     {
//       id: 2,
//       name: "Vitamin C Tablets",
//       details: "Immune system booster, 1000mg",
//       price: 1200,
//       expDate: "2025-06-30",
//       status: "active"
//     },
//     {
//       id: 3,
//       name: "Amoxicillin 250mg",
//       details: "Antibiotic for bacterial infections",
//       price: 800,
//       expDate: "2024-08-15",
//       status: "expired"
//     }
//   ];

//   return (
//     <div className="space-y-4">
//       <h3 className="text-lg font-semibold">My Advertised Products</h3>
//       {products.map((product) => (
//         <Card key={product.id}>
//           <CardContent className="p-4">
//             <div className="flex justify-between items-start">
//               <div className="space-y-2">
//                 <h4 className="font-medium">{product.name}</h4>
//                 <p className="text-sm text-gray-600">{product.details}</p>
//                 <p className="text-sm text-gray-600">Price: ₦{product.price}</p>
//                 <p className="text-sm text-gray-600">Expires: {product.expDate}</p>
//               </div>
//               <div className="text-right space-y-2">
//                 <Badge variant={product.status === "active" ? "default" : "destructive"}>
//                   {product.status}
//                 </Badge>
//                 <div className="mt-2 space-x-2">
//                   <Button size="sm" variant="outline">Edit</Button>
//                   <Button size="sm" variant="destructive">Remove</Button>
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       ))}
//     </div>
//   );
// };

import { Button } from "@/components/ui/button";
import React, { useState, useRef, useEffect } from "react";
import Whatsapp from "@/assets/whatsapp 1.svg";
import { Header, Pagination } from "./RequestsList";
import EmptyStateMeds from "@/assets/EmptyMeds.svg";

type Product = {
  id: string;
  name: string;
  strength: string;
  medsCount: number;
  orderRef: string;
  price: string;
  status: "Published" | "Draft" | "Pending";
  avatar: string;
};

const SAMPLE: Product[] = [
  {
    id: "p1",
    name: "Product name",
    strength: "500mg",
    medsCount: 3,
    orderRef: "ORD - 001",
    price: "₦20,000",
    status: "Published",
    avatar: EmptyStateMeds
  },
  {
    id: "p2",
    name: "Product name",
    strength: "500mg",
    medsCount: 3,
    orderRef: "ORD - 001",
    price: "₦20,000",
    status: "Draft",
    avatar: EmptyStateMeds
  },
];

export function ProductsList() {
  const [query, setQuery] = useState("");
  const [items] = useState<Product[]>(SAMPLE);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 4;

  // close menu on outside click
  const menuRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setOpenMenuId(null);
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  function toggleMenu(id: string) {
    setOpenMenuId((s) => (s === id ? null : id));
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
     <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-24 mb-8">
     <Header />
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 text-gray-800 py-2.5 px-4 rounded w-[300px] text-sm">
            These are verified requests from patients who need help sourcing for
            their medications. Your contribution can save lives.
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

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-9">
          <div className="bg-transparent rounded-lg p-4">
            <div className="mt-6 space-y-4">
              {items.map((it) => (
                <div
                  key={it.id}
                  className="relative bg-transparent border border-gray-200 rounded-lg p-4 flex items-start gap-4"
                >
                  {/* <div className="w-16 h-16 flex items-center justify-center bg-white">
                    <svg
                      width="44"
                      height="44"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="3"
                        y="3"
                        width="18"
                        height="18"
                        rx="4"
                        fill="#E6F7FF"
                      />
                      <path
                        d="M7 12h10M7 8h10M7 16h6"
                        stroke="#0B6FB2"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div> */}
                 <div className="w-[50px] h-[50px] flex-shrink-0 flex justify-center items-center">
                <img src={it.avatar} alt="product avatar" className="w-14 h-14 object-cover rounded-md" />
              </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-semibold text-gray-800">
                        {it.name} {it.strength}
                      </h4>
                      <span
                        className={`text-xs px-2 py-0.5 rounded ${
                          it.status === "Published"
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {it.status.toLowerCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {it.medsCount} medications • {it.orderRef}
                    </p>
                    <p className="text-sm text-gray-900 mt-2 font-medium">
                      {it.price}
                    </p>
                  </div>

                  <div className="relative" ref={menuRef}>
                    <button
                      onClick={() => toggleMenu(it.id)}
                      className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
                    >
                      <svg
                        width="4"
                        height="16"
                        viewBox="0 0 4 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx="2" cy="2" r="2" fill="#667085" />
                        <circle cx="2" cy="8" r="2" fill="#667085" />
                        <circle cx="2" cy="14" r="2" fill="#667085" />
                      </svg>
                    </button>

                    {openMenuId === it.id && (
                      <div className="absolute right-0 top-10 bg-blue-50 rounded-lg shadow-md w-40 py-2">
                        <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-100">
                          View
                        </button>
                        <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-100">
                          Edit
                        </button>
                        <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-100">
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              <div className="flex justify-center mt-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <aside className=""> */}

      {/* </aside> */}
    </div>
    // </div>
  );
}
