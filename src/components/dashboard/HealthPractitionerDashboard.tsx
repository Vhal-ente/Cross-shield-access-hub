// import React, { useEffect, useMemo, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { CheckCircle, UserPlus, Search, List } from "lucide-react";
// import { API_BASE_URL } from "@/lib/api"
// import { FulfillRequestForm } from "./components/FulfillRequestForm";
// import { ReferPatientForm } from "./components/ReferPatientForm";
// import { SourceDrugForm } from "./components/SourceDrugForm";

// type Role = "doctor" | "pharmacist" | "nurse" | "lab";

// type ActiveTab = "requests" | "refer" | "source";

// type ProviderResponse = {
//   id: string;
//   providerId: string;
//   name: string;
//   role: Role;
//   facility?: string;
//   medication: string;
//   strength?: string;
//   quantity: number;
//   unitPrice: number;
//   batch?: string;
//   expiry?: string;
//   deliveryModes: string[];
//   timestamp: string;
//   referralCode?: string;
// };

// type RequestMed = {
//   id: string;
//   name: string;
//   packCount: number;
//   imageUrl?: string | null;
// };

// type Request = {
//   id: string;
//   patientName?: string;
//   location?: string;
//   urgency?: "low" | "medium" | "high";
//   meds: RequestMed[];
// };

// // NOTE: backend endpoints used by this file
// // GET  /api/requests         -> returns Request[]
// // GET  /api/me              -> returns current user info, may contain practitionerId or user.id
// // POST /health-practitioners/:id/respond -> accepts { requestId, providerId, lines }

// export const HealthPractitionerDashboard: React.FC = () => {
//   const [activeTab, setActiveTab] = useState<ActiveTab>("requests");
//   const [urgencyFilter, setUrgencyFilter] = useState<string>("all");
//   const [locationFilter, setLocationFilter] = useState<string>("");
//   const [search, setSearch] = useState<string>("");

//   // Dialog states and setters
//   const [showRespondDialog, setShowRespondDialog] = useState(false);
//   const [showReferralDialog, setShowReferralDialog] = useState(false);
//   const [showDetailsDialog, setShowDetailsDialog] = useState(false);

//   const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
//   const [submitting, setSubmitting] = useState(false);
//   const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

//   // track which requests already responded to, to disable further actions
//   const [respondedMap, setRespondedMap] = useState<Record<string, boolean>>({});

//   const [requests, setRequests] = useState<Request[]>([]);
//   const [loadingRequests, setLoadingRequests] = useState<boolean>(false);
//   const [fetchError, setFetchError] = useState<string | null>(null);

//   // practitioner id loaded from /api/me
//   const [practitionerId, setPractitionerId] = useState<string | null>(null);

//   useEffect(() => {
//     let mounted = true;
//     async function loadMe() {
//       try {
//         const res = await fetch(`${API_BASE_URL}/me`, {
//           method: "GET",
//           headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
//           },          credentials: "include"
//          });
//         if (!res.ok) return;
//         const json = await res.json();
//         if (!mounted) return;
//         const id = json.practitionerId ?? json.user?.practitionerId ?? json.user?.id ?? json.id ?? null;
//         setPractitionerId(id);
//       } catch (err) {
//         // ignore; submit will show error if missing
//       }
//     }
//     loadMe();
//     return () => { mounted = false; };
//   }, []);

//   async function fetchRequests() {
//     setLoadingRequests(true);
//     setFetchError(null);
//     try {
//       const res = await fetch(`${API_BASE_URL}/medication-requests`, { credentials: "include" });
//       if (!res.ok) {
//         const text = await res.text();
//         throw new Error(text || `Failed to fetch, status ${res.status}`);
//       }
//       const data = await res.json();
//       const list: Request[] = Array.isArray(data) ? data : data.requests ?? [];
//       setRequests(list);
//     } catch (err: any) {
//       console.error(err);
//       setFetchError(err.message || "Failed to fetch requests");
//     } finally {
//       setLoadingRequests(false);
//     }
//   }

//   useEffect(() => { fetchRequests(); }, []);

//   // filter logic
//   const filtered = useMemo(() => {
//     const term = search.trim().toLowerCase();
//     return requests.filter((r) => {
//       if (urgencyFilter !== "all" && r.urgency && urgencyFilter !== r.urgency) return false;
//       if (locationFilter && !(r.location || "").toLowerCase().includes(locationFilter.toLowerCase())) return false;
//       if (!term) return true;
//       return (
//         (r.patientName || "").toLowerCase().includes(term) ||
//         r.meds.some((m) => m.name.toLowerCase().includes(term)) ||
//         (r.location || "").toLowerCase().includes(term)
//       );
//     });
//   }, [requests, urgencyFilter, locationFilter, search]);

//   function openRespond(request: Request) {
//     if (respondedMap[request.id]) return; // prevent opening if already responded
//     setSelectedRequest(request);
//     setShowRespondDialog(true);
//   }

//   function openRefer(request?: Request) {
//     if (request && respondedMap[request.id]) return; // prevent if responded
//     if (request) setSelectedRequest(request);
//     setShowReferralDialog(true);
//   }

//   function openDetails(request: Request) {
//     setSelectedRequest(request);
//     setShowDetailsDialog(true);
//   }

//   const ReferComp = (ReferPatientForm as any) || null;
//   const SourceComp = (SourceDrugForm as any) || null;

//   function showToast(message: string, type: "success" | "error" = "success") {
//     setToast({ message, type });
//     window.setTimeout(() => setToast(null), 3500);
//   }

//   async function handleRespondSubmit(lines: any[]) {
//     if (!selectedRequest) {
//       showToast("No request selected", "error");
//       return;
//     }

//     if (!practitionerId) {
//       showToast("Not authenticated as practitioner", "error");
//       return;
//     }

//     setSubmitting(true);
//     try {
//       const payload = { requestId: selectedRequest.id, providerId: null, lines };

//       const res = await fetch(`${API_BASE_URL}/health-practitioners/${encodeURIComponent(practitionerId)}/respond`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (res.status === 409) {
//         showToast("Request already responded to", "error");
//         setRespondedMap((p) => ({ ...p, [selectedRequest.id]: true }));
//         setShowRespondDialog(false);
//         return;
//       }

//       if (!res.ok) {
//         const text = await res.text();
//         throw new Error(text || `Server error ${res.status}`);
//       }

//       setRespondedMap((p) => ({ ...p, [selectedRequest.id]: true }));
//       // optionally remove from UI
//       setRequests((prev) => prev.filter((x) => x.id !== selectedRequest.id));

//       showToast("Response sent", "success");
//       setShowRespondDialog(false);
//     } catch (err: any) {
//       console.error(err);
//       showToast(err.message || "Failed to send response", "error");
//     } finally {
//       setSubmitting(false);
//     }
//   }

//   const leftColClass = activeTab === "requests" ? "lg:col-span-2" : "lg:col-span-3";

//   return (
//     <div className="p-6">
//       <header className="flex items-center justify-between mb-6">
//         <div>
//           <h2 className="text-2xl font-medium text-gray-900">Health Practitioner Dashboard</h2>
//           <p className="text-sm text-gray-600">Manage requests, refer patients, fulfill requests</p>
//         </div>
//         <div className="flex items-center gap-3">
//           <Badge className="bg-blue-100 text-blue-800">Sub Admin</Badge>
//           <div className="hidden sm:block">
//             <div className="flex items-center gap-2">
//               <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search requests or meds" className="w-64" aria-label="Search requests" />
//             </div>
//           </div>
//         </div>
//       </header>

//       <nav className="flex w-full gap-2 mb-4">
//         <Button className="flex-1" variant={activeTab === "requests" ? "default" : "ghost"} onClick={() => setActiveTab("requests")}>
//           <List className="h-4 w-4 mr-2" />
//           Requests
//         </Button>
//         <Button className="flex-1" variant={activeTab === "refer" ? "default" : "ghost"} onClick={() => setActiveTab("refer")}>
//           <UserPlus className="h-4 w-4 mr-2" />
//           Refer
//         </Button>
//         <Button className="flex-1" variant={activeTab === "source" ? "default" : "ghost"} onClick={() => setActiveTab("source")}>
//           <Search className="h-4 w-4 mr-2" />
//           Source
//         </Button>
//       </nav>

//       <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <section className={`${leftColClass}`}>
//           {activeTab === "requests" && (
//             <Card>
//               <CardHeader>
//                 <CardTitle>Provider Requests</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {loadingRequests && <p className="text-sm text-gray-600">Loading requests...</p>}
//                   {/* {fetchError && <p className="text-sm text-red-600">{fetchError}</p>} */}
//                   {!loadingRequests && filtered.length === 0 && <p className="text-sm text-gray-600">No requests found</p>}
//                   {filtered.map((r) => {
//                     const disabled = !!respondedMap[r.id];
//                     return (
//                       <div key={r.id} className={`flex items-start gap-4 p-4 bg-white rounded-md shadow-sm ${disabled ? "opacity-60" : ""}`}>
//                         <div className="flex-1">
//                           <div className="flex items-center justify-between">
//                             <div>
//                               <h3 className="font-medium">{r.patientName}</h3>
//                               <p className="text-sm text-gray-600">{r.location} • {r.urgency}</p>
//                             </div>
//                             <div className="text-right">
//                               <div className="text-sm">Meds {r.meds.length}</div>
//                               <div className="text-sm">Req id: {r.id}</div>
//                             </div>
//                           </div>

//                           <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
//                             <div>
//                               <div className="text-gray-500">Medications</div>
//                               <ul className="mt-2 list-disc list-inside">
//                                 {r.meds.map((m) => <li key={m.id}>{m.name} • {m.packCount} pack(s)</li>)}
//                               </ul>
//                             </div>
//                             <div>
//                               <div className="text-gray-500">Actions</div>
//                               <div className="mt-2 flex gap-2">
//                                 <Button size="sm" variant="outline" onClick={() => openRespond(r)} disabled={disabled}>Respond</Button>
//                                 <Button size="sm" onClick={() => openDetails(r)} disabled={disabled}>Details</Button>
//                                 <Button size="sm" variant="ghost" onClick={() => openRefer(r)} disabled={disabled}>Refer</Button>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     )
//                   })}
//                 </div>
//               </CardContent>
//             </Card>
//           )}

//           {activeTab === "refer" && <div className="w-full">{ReferComp ? <ReferComp selected={selectedRequest} onClose={() => setShowReferralDialog(false)} /> : null}</div>}

//           {activeTab === "source" && <div className="w-full">{SourceComp ? <SourceComp selected={selectedRequest} onClose={() => setShowRespondDialog(false)} /> : null}</div>}
//         </section>

//         {activeTab === "requests" && (
//           <aside>
//             <Card>
//               <CardHeader>
//                 <CardTitle>Quick Filters</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-3">
//                   <div>
//                     <label className="block text-sm text-gray-700">Urgency</label>
//                     <Select onValueChange={(v) => setUrgencyFilter(v)} value={urgencyFilter}>
//                       <SelectTrigger className="w-full">
//                         <SelectValue placeholder="All" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="all">All</SelectItem>
//                         <SelectItem value="low">Low</SelectItem>
//                         <SelectItem value="medium">Medium</SelectItem>
//                         <SelectItem value="high">High</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div>
//                     <label className="block text-sm text-gray-700">Location</label>
//                     <Input placeholder="City or facility" value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} />
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </aside>
//         )}
//       </main>

//       <Dialog open={showRespondDialog} onOpenChange={setShowRespondDialog}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Respond to Request</DialogTitle>
//           </DialogHeader>

//           <RespondForm
//             request={selectedRequest}
//             onCancel={() => setShowRespondDialog(false)}
//             onSubmit={handleRespondSubmit}
//             submitting={submitting}
//           />
//         </DialogContent>
//       </Dialog>

//       <Dialog open={showReferralDialog} onOpenChange={setShowReferralDialog}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Refer Patient</DialogTitle>
//           </DialogHeader>

//           <form
//             onSubmit={(e) => {
//               e.preventDefault();
//               setShowReferralDialog(false);
//             }}
//             className="space-y-3"
//           >
//             <div>
//               <label className="block text-sm text-gray-700">Patient name</label>
//               <Input placeholder="Full name" name="patientName" required autoFocus />
//             </div>
//             <div>
//               <label className="block text-sm text-gray-700">Contact</label>
//               <Input placeholder="Phone or email" name="contact" required />
//             </div>

//             <div className="flex gap-2 justify-end">
//               <Button type="button" onClick={() => setShowReferralDialog(false)}>Cancel</Button>
//               <Button type="submit">Send referral</Button>
//             </div>
//           </form>
//         </DialogContent>
//       </Dialog>

//       <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Details</DialogTitle>
//           </DialogHeader>

//           <div className="space-y-3">
//             {selectedRequest ? (
//               <div>
//                 <div className="text-sm font-medium">{selectedRequest.patientName}</div>
//                 <div className="text-sm">{selectedRequest.location}</div>
//                 <div className="mt-2 text-sm">Meds: {selectedRequest.meds.map(m => m.name).join(", ")}</div>
//                 <div className="flex gap-2 mt-4 justify-end">
//                   <Button onClick={() => setShowDetailsDialog(false)}>Close</Button>
//                 </div>
//               </div>
//             ) : (
//               <p className="text-sm text-gray-600">No details available</p>
//             )}
//           </div>
//         </DialogContent>
//       </Dialog>

//       {toast && (
//         <div className={`fixed right-4 bottom-4 z-50 max-w-sm rounded shadow-lg p-3 text-sm ${toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`} role="status" aria-live="polite">
//           {toast.message}
//         </div>
//       )}
//     </div>
//   );
// };

// // RespondForm component placed in this file for simplicity.
// function RespondForm({ request, onCancel, onSubmit, submitting }: any) {
//   const [lines, setLines] = useState<any[]>([]);

//   useEffect(() => {
//     if (!request) {
//       setLines([]);
//       return;
//     }
//     setLines(
//       request.meds.map((m: RequestMed) => ({
//         medId: m.id,
//         name: m.name,
//         packCount: m.packCount,
//         imageUrl: m.imageUrl,
//         availability: "stocked",
//         availableQty: m.packCount,
//         brand: "",
//         price: "",
//       }))
//     );
//   }, [request]);

//   if (!request) return <div className="p-4">No request selected</div>;

//   function updateLine(medId: string, patch: Partial<any>) {
//     setLines((prev) => prev.map((l) => (l.medId === medId ? { ...l, ...patch } : l)));
//   }

//   return (
//     <form
//       onSubmit={(e) => {
//         e.preventDefault();
//         onSubmit(lines);
//       }}
//       className="space-y-4 w-full"
//     >
//       <div className="text-sm text-gray-600">Patient: {request.patientName} • Location: {request.location} • Urgency: {request.urgency}</div>

//       <div className="space-y-4">
//         {lines.map((ln: any) => (
//           <div key={ln.medId} className="flex flex-col sm:flex-row items-start gap-4 bg-white p-3 rounded">
//             <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
//               {ln.imageUrl ? (
//                 <img src={ln.imageUrl} alt={ln.name} className="object-cover w-full h-full" />
//               ) : (
//                 <div className="text-xs text-gray-500">No image</div>
//               )}
//             </div>

//             <div className="flex-1 w-full">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <div className="font-medium">{ln.name}</div>
//                   <div className="text-sm text-gray-500">Requested packs: {ln.packCount}</div>
//                 </div>
//               </div>

//               <div className="mt-3 grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
//                 <div>
//                   <label className="block text-sm text-gray-700">Availability</label>
//                   <Select value={ln.availability} onValueChange={(v) => updateLine(ln.medId, { availability: v })}>
//                     <SelectTrigger className="w-full">
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="stocked">Stocked</SelectItem>
//                       <SelectItem value="unavailable">Unavailable</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div>
//                   <label className="block text-sm text-gray-700">Available qty</label>
//                   <Input
//                     type="number"
//                     min={0}
//                     value={String(ln.availableQty)}
//                     onChange={(e) => updateLine(ln.medId, { availableQty: Number(e.target.value) })}
//                     disabled={ln.availability !== "stocked"}
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm text-gray-700">Brand</label>
//                   <Input
//                     value={ln.brand || ""}
//                     onChange={(e) => updateLine(ln.medId, { brand: e.target.value })}
//                     placeholder="Brand or manufacturer"
//                     disabled={ln.availability !== "stocked"}
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm text-gray-700">Unit price</label>
//                   <Input
//                     value={String(ln.price || "")}
//                     onChange={(e) => updateLine(ln.medId, { price: e.target.value })}
//                     placeholder="Enter price"
//                     disabled={ln.availability !== "stocked"}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="flex justify-end gap-2">
//         <Button type="button" variant="ghost" onClick={onCancel} disabled={submitting}>
//           Cancel
//         </Button>
//         <Button type="submit" disabled={submitting}>{submitting ? "Sending..." : "Send response"}</Button>
//       </div>
//     </form>
//   );
// }

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
import {
  UserIcon,
  MapPinIcon,
  EnvelopeIcon,
  ChevronDownIcon,
  PlusIcon,
  ArrowUpTrayIcon,
} from "@heroicons/react/24/outline";

type ActiveTab = "summary" | "requests" | "prescription" | "order" | "patient";

type MedItem = { id: string; name: string; packs: number; file?: string };

export function HealthPractitionerDashboard() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("summary");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tabs = [
    { id: "summary" as ActiveTab, label: "Summary", icon: Package },
    { id: "requests" as ActiveTab, label: "Requests", icon: CheckCircle },
    { id: "prescription" as ActiveTab, label: "Prescription", icon: Package },
    { id: "order" as ActiveTab, label: "My Orders", icon: Megaphone },
    { id: "patient" as ActiveTab, label: "Refer a Patient", icon: Package },
  ];

  const stats = [
    { label: "New Requests", value: 0 },
    { label: "Products", value: 0 },
    { label: "Total Orders", value: 0 },
    { label: "In Transit", value: 0 },
  ];

  const SummaryContent = ({
    onMakeRequestClick,
  }: {
    onMakeRequestClick: () => void;
  }) => (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6 mt-4">
      <div aria-label="summary-main" className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <StatsCard key={stat.label} label={stat.label} value={stat.value} />
          ))}
        </div>
        <div className="rounded-xl p-6 shadow-sm border border-gray-100 min-h-[300px]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-neutral-700">
              Recent requests
            </h2>
            <Button variant="link" className="text-[#106FB2]">
              See All
            </Button>
          </div>
          <div className="flex flex-col items-center justify-center py-12">
            <img
              src={EmptyStateMeds}
              alt="No requests"
              className="w-48 h-48 mb-4"
            />
            <p className="text-muted-foreground mt-4 text-gray-500">
              There are no new requests
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-card rounded-lg shadow-md p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">
            Quick actions
          </h3>
          <div className="space-x-4 items-center grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
            <Button
              variant="outline"
              className="rounded-xl justify-start text-sm border-2 border-[#106FB2] text-[#106FB2] hover:none"
              onClick={onMakeRequestClick}
            >
              Make a request
            </Button>
            <Button
              variant="outline"
              className="w-full rounded-xl justify-start text-sm border-2 border-[#106FB2] text-[#106FB2]"
            >
              Add a product
            </Button>
          </div>
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
  );

  const ContentWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="rounded-xl mt-6 min-h-[400px]">{children}</div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "summary":
        return (
          <SummaryContent onMakeRequestClick={() => setIsModalOpen(true)} />
        );
      case "requests":
        return (
          <ContentWrapper>
            <RequestsList />
          </ContentWrapper>
        );
      case "prescription":
        return (
          <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
            <CheckCircle className="h-14 w-14 text-purple-400 mb-3" />
            <h3 className="text-base font-semibold text-gray-900 mb-1">
              Prescription
            </h3>
            <p className="text-sm text-gray-600">
              This feature is coming soon. Stay tuned for updates.
            </p>
          </div>
        );
      case "order":
        return (
          <ContentWrapper>
            <Orders />
          </ContentWrapper>
        );
      case "patient":
        return (
          <ContentWrapper>
            <ReferralForm />
          </ContentWrapper>
        );
      default:
        return (
          <SummaryContent onMakeRequestClick={() => setIsModalOpen(true)} />
        );
    }
  };

  return (
    <div className="p-6 min-h-screen relative">
      {/* <div className="flex items-center justify-between mb-6">
        {/* <div>
          <h2 className="text-3xl font-extrabold text-gray-900">Health Practitioner Dashboard</h2>
          <p className="text-gray-600 mt-1">Respond to requests and manage your product catalog</p>
        </div> */}
      {/* <Badge className="bg-green-100 text-green-800">Sub Admin</Badge> */}
      {/* </div> */}

      <div className="flex space-x-1 mb-11 bg-[#E5E5E5] rounded-xl p-1 shadow-md border border-gray-100">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <Button
              key={tab.id}
              variant={isActive ? "default" : "ghost"}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 transition-all ${
                isActive
                  ? "bg-[#106FB2] shadow-lg text-white"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab(tab.id as ActiveTab)}
            >
              <Icon className="h-5 w-5" />
              <span className="hidden sm:inline">{tab.label}</span>
            </Button>
          );
        })}
      </div>

      <div className="w-full">{renderContent()}</div>

      <RequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

interface RequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function RequestModal({ isOpen, onClose }: RequestModalProps) {
  const [meds, setMeds] = useState<MedItem[]>([
    { id: "m1", name: "", packs: 0 },
    { id: "m2", name: "", packs: 0 },
  ]);

  if (!isOpen) return null;

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

  return (
    <div
      className="fixed inset-0 bg-gray-900 bg-opacity-75 min-h-screen flex items-start justify-center p-4 md:p-10 z-50 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[680px] p-6 md:p-8 my-10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Close modal"
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          <span className="text-3xl font-light">&times;</span>
        </button>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Make a request
        </h2>

        <form className="space-y-8">
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Personal Information
            </h3>
            <div className="space-y-4">
              <IconInput
                id="full-name"
                label="Full Name"
                defaultValue="Uheendah Neme"
                icon={<UserIcon className="w-5 h-5 text-gray-400" />}
              />
              <IconInput
                id="location"
                label="Location"
                defaultValue="Lagos, Nigeria"
                icon={<MapPinIcon className="w-5 h-5 text-gray-400" />}
              />
              <IconInput
                id="email"
                label="Email"
                type="email"
                defaultValue="neme@gmail.com"
                icon={<EnvelopeIcon className="w-5 h-5 text-gray-400" />}
              />
              <PhoneInput />
            </div>
          </section>

          <section className="bg-[#F3F4F6] p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Medication
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
                <div key={m.id} className="flex gap-4">
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

                  <div className="flex flex-1 items-center gap-6">
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

          <section>
            <label
              htmlFor="delivery-time"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              When do you need the medication?
            </label>
            <div className="relative">
              <select
                id="delivery-time"
                className="w-full appearance-none px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-500"
              >
                <option value="" disabled>
                  Calendar
                </option>
                <option value="today">Today</option>
                <option value="tomorrow">Tomorrow</option>
              </select>
              <ChevronDownIcon className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </section>

          <section>
            <label className="block text-sm font-medium text-gray-700 mb-2.5">
              Do you have a prescription?
            </label>
            <div className="flex items-center gap-6">
              <CustomRadio
                id="yes"
                name="prescription"
                label="Yes"
                defaultChecked
              />
              <CustomRadio id="no" name="prescription" label="No" />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              If you do not have any prescription, you will be contacted by a
              pharmacist.
            </p>
          </section>

          <section>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image of the medication or prescription{" "}
              <span className="text-gray-400 font-normal"> (optional)</span>
            </label>
            <div className="w-full h-36 border-2 border-dashed rounded-lg flex items-center justify-center">
              <ArrowUpTrayIcon className="w-9 h-9 text-gray-400" />
            </div>
          </section>

          <div className="flex justify-end">
            <button
              type="button"
              className="bg-gray-100 px-4 py-2 rounded-lg mr-3"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#106FB2] text-white px-4 py-2 rounded-lg"
            >
              Send Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface IconInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  icon: React.ReactNode;
}
const IconInput: React.FC<IconInputProps> = ({ label, id, icon, ...props }) => (
  <div>
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 mb-2"
    >
      {label}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
        {icon}
      </div>
      <input
        id={id}
        {...props}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
      />
    </div>
  </div>
);

const PhoneInput = () => (
  <div>
    <label
      htmlFor="contact-number"
      className="block text-sm font-medium text-gray-700 mb-2"
    >
      Contact number
    </label>
    <div className="flex border border-gray-300 rounded-lg overflow-hidden">
      <div className="relative">
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
        id="contact-number"
        defaultValue="912 3456 789"
        className="flex-1 w-full pl-4 border-none"
      />
    </div>
  </div>
);

interface CustomRadioProps {
  id: string;
  name: string;
  label: string;
  defaultChecked?: boolean;
}
const CustomRadio: React.FC<CustomRadioProps> = ({
  id,
  name,
  label,
  defaultChecked,
}) => (
  <label htmlFor={id} className="flex items-center gap-2.5 cursor-pointer">
    <input
      type="radio"
      id={id}
      name={name}
      defaultChecked={defaultChecked}
      className="peer hidden"
    />
    <span className="w-5 h-5 border-2 border-gray-300 rounded-full flex items-center justify-center transition-all peer-checked:border-[#106FB2] peer-checked:bg-[#106FB2]">
      <span className="w-2.5 h-2.5 bg-white rounded-full scale-0 peer-checked:scale-100 transition-transform"></span>
    </span>
    <span className="text-gray-700">{label}</span>
  </label>
);
