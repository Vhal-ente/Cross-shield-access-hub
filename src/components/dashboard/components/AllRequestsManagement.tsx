// import { API_BASE_URL } from "@/lib/api";
// import React, { useState, useEffect } from "react";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Loader2, Eye, UserCheck, Download, Filter } from "lucide-react";
// import RequestActionModal from "./RequestActionModal";
// import RequestDetailModal from "./RequestDetailModal";
// import { toast } from "sonner";

// interface User {
//   id: number;
//   name: string;
//   role?: { name: string };
// }

// interface Request {
//   id: number;
//   type?: string;
//   requestedBy?: {
//     fullName?: string;
//     role?: { name?: string };
//   };
//   medication?: string;
//   quantity?: number;
//   medications?: Array<{ name: string; quantity: number }>; // Add this line
//   status?: "pending" | "fulfilled" | "in_progress" | "rejected";
//   createdAt?: string;
//   assignedTo?: {
//     fullName?: string;
//   };
//   description?: string;
//   urgency?: "low" | "medium" | "high";
//   notes?: string;
//   payload?: any;
// }

// const getStatusBadge = (status: string = "unknown") => {
//   switch (status) {
//     case "pending":
//       return (
//         <Badge variant="outline" className="text-yellow-600 border-yellow-300">
//           Pending
//         </Badge>
//       );
//     case "fulfilled":
//       return (
//         <Badge variant="default" className="bg-green-600">
//           Fulfilled
//         </Badge>
//       );
//     case "in_progress":
//       return <Badge variant="secondary">In Progress</Badge>;
//     case "rejected":
//       return <Badge variant="destructive">Rejected</Badge>;
//     default:
//       return <Badge variant="outline">{status}</Badge>;
//   }
// };

// // Add this right after your imports and before the interface definitions
// const displayMedications = (request: Request) => {
//   // First check if medications array exists directly in request object
//   if (Array.isArray((request as any).medication)) {
//     return (request as any).medication
//       .map((med: any) => `${med.name} (${med.quantity})`)
//       .join(", ");
//   }

//   // Check if there's a single medication in the medication field
//   if (request.medication && request.quantity) {
//     return `${request.medication} (${request.quantity})`;
//   }

//   // Then check for multiple medications in payload
//   let payload = (request as any).payload;

//   // Parse payload if it's a string
//   if (typeof payload === "string") {
//     try {
//       payload = JSON.parse(payload);
//     } catch (e) {
//       return request.medication || "N/A";
//     }
//   }

//   // Check if payload has medications array
//   if (
//     payload &&
//     Array.isArray(payload.medication) &&
//     payload.medications.length > 0
//   ) {
//     return payload.medication
//       .map((med: any) => `${med.name} (${med.quantity})`)
//       .join(", ");
//   }

//   // Fallback to single medication field
//   return request.medications || "N/A";
// };

// export const AllRequestsManagement = () => {
//   const [requests, setRequests] = useState<Request[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
//   const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [modalMode, setModalMode] = useState<"reassign" | "process">(
//     "reassign"
//   );
//   const [selectedRequestId, setSelectedRequestId] = useState<number | null>(
//     null
//   );
//   const [allUsers, setAllUsers] = useState<User[]>([]);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const res = await fetch(`${API_BASE_URL}/super-admin/users`, {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${localStorage.getItem("auth_token")}`
//           }
//         });
//         if (!res.ok) throw new Error("Failed to fetch users");
//         const data = await res.json();
//         // Ensure data is an array; fallback to empty array if not
//         const usersData = Array.isArray(data) ? data : [];
//         setAllUsers(usersData);
//       } catch (err: any) {
//         console.error("Fetch users error:", err);
//         toast.error("Failed to load users");
//         setAllUsers([]); // Fallback to empty array on error
//       }
//     };
//     fetchUsers();
//   }, []);

//   useEffect(() => {
//     fetchRequests();
//   }, []);

//   const fetchRequests = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const token = localStorage.getItem("auth_token");
//       if (!token) throw new Error("No authentication token found");

//       const response = await fetch(`${API_BASE_URL}/medication-requests`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`
//         }
//       });

//       if (!response.ok) {
//         const result = await response.json();
//         throw new Error(
//           result?.message || `HTTP error! status: ${response.status}`
//         );
//       }

//       const result = await response.json();
//       const requestsData = Array.isArray(result)
//         ? result
//         : result.data?.data || result.data || result.requests || [];
//         const validatedRequests = requestsData.map(
//           (request: any, index: number) => ({
//             id: request.id || index + 1,
//             type: request.type || "N/A",
//             requestedBy: {
//               fullName:
//                 request.requestedBy?.fullName ||
//                 request.requester?.fullName ||
//                 "N/A",
//               role: {
//                 name:
//                   request.requestedBy?.role?.name ||
//                   request.requester?.role?.name ||
//                   "N/A"
//               }
//             },
//             medication:
//               request.medication ||
//               request.medicationName ||
//               "N/A",
//             quantity: request.quantity || 0,
//             medications: request.medications || null, // Add this line
//             status: request.status || "pending",
//             createdAt:
//               request.createdAt || request.created_at || new Date().toISOString(),
//             assignedTo: request.assignedTo
//               ? { fullName: request.assignedTo.fullName || "N/A" }
//               : undefined,
//             description: request.description,
//             urgency: request.urgency,
//             notes: request.notes,
//             payload: request.payload // Make sure payload is included
//           })
//         );

//       setRequests(validatedRequests);
//     } catch (err: any) {
//       console.error("Fetch requests error:", err);
//       setError(err.message || "An unexpected error occurred");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleViewRequest = (request: Request) => {
//     setSelectedRequest(request);
//     setIsDetailModalOpen(true);
//   };

//   const openReassignModal = (requestId: number) => {
//     setSelectedRequestId(requestId);
//     setModalMode("reassign");
//     setModalOpen(true);
//   };

//   const openProcessModal = (requestId: number) => {
//     setSelectedRequestId(requestId);
//     setModalMode("process");
//     setModalOpen(true);
//   };

//   const handleModalSubmit = async (payload: {
//     assignedToId?: number;
//     status?: string;
//   }) => {
//     if (!selectedRequestId) return;

//     try {
//       const token = localStorage.getItem("auth_token");
//       if (!token) throw new Error("No authentication token found");

//       const response = await fetch(
//         `${API_BASE_URL}/auth/requests/${selectedRequestId}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`
//           },
//           body: JSON.stringify(payload)
//         }
//       );

//       if (!response.ok) {
//         const result = await response.json();
//         throw new Error(result?.message || `Failed to ${modalMode} request`);
//       }

//       toast.success(
//         `Request ${
//           modalMode === "reassign" ? "reassigned" : "processed"
//         } successfully`
//       );
//       fetchRequests();
//       setModalOpen(false);
//       setSelectedRequestId(null);
//     } catch (err: any) {
//       console.error(`Error ${modalMode} request:`, err);
//       toast.error(`Failed to ${modalMode} request: ${err.message}`);
//     }
//   };

//   const formatDate = (dateString?: string) => {
//     if (!dateString) return "N/A";
//     try {
//       return new Date(dateString).toLocaleDateString("en-US", {
//         year: "numeric",
//         month: "short",
//         day: "numeric",
//         hour: "2-digit",
//         minute: "2-digit"
//       });
//     } catch (error) {
//       return "Invalid Date";
//     }
//   };

//   const formatRequesterInfo = (requester?: Request["requestedBy"]) => {
//     if (!requester) return "Unknown User";
//     const fullName = requester.fullName || "N/A";
//     // const roleName = requester.role?.name || "unknown_role";
//     return `${fullName}`;
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <Loader2 className="w-6 h-6 animate-spin mr-2" />
//         Loading requests...
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="space-y-6">
//         <Card>
//           <CardContent className="p-6">
//             <div className="text-center">
//               <p className="text-red-600 mb-4">{error}</p>
//               <Button onClick={fetchRequests} variant="outline">
//                 Try Again
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <h3 className="text-lg font-semibold">
//           All System Requests ({requests.length})
//         </h3>
//         <div className="flex space-x-2">
//           <Button variant="outline" size="sm" onClick={fetchRequests}>
//             Refresh
//           </Button>
//           <Button variant="outline" size="sm">
//             <Download className="w-4 h-4 mr-2" />
//             Export
//           </Button>
//           <Button variant="outline" size="sm">
//             <Filter className="w-4 h-4 mr-2" />
//             Filter
//           </Button>
//         </div>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle>Request Overview</CardTitle>
//         </CardHeader>
//         <CardContent>
//           {requests.length === 0 ? (
//             <div className="text-center py-8">
//               <p className="text-gray-500">No requests found</p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full border-collapse">
//                 <thead>
//                   <tr className="border-b">
//                     <th className="text-left p-3 text-sm font-semibold">
//                       Request ID
//                     </th>
//                     <th className="text-left p-3 text-sm font-semibold">
//                       Type
//                     </th>
//                     <th className="text-left p-3 text-sm font-semibold">
//                       Requested By
//                     </th>
//                     <th className="text-left p-3 text-sm font-semibold">
//                       Medication
//                     </th>
//                     <th className="text-left p-3 text-sm font-semibold">
//                       Status
//                     </th>
//                     <th className="text-left p-3 text-sm font-semibold">
//                       Date
//                     </th>
//                     <th className="text-left p-3 text-sm font-semibold">
//                       Assigned To
//                     </th>
//                     <th className="text-left p-3 text-sm font-semibold">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {requests.map((request) => (
//                     <tr key={request.id} className="border-b hover:bg-gray-50">
//                       <td className="p-3 font-medium">#{request.id}</td>
//                       <td className="p-3">{request.type || "N/A"}</td>
//                       <td className="p-3 text-sm">
//                         {formatRequesterInfo(request.requestedBy)}
//                       </td>
//                       <td className="p-3 text-sm">
//                         {displayMedications(request)}
//                       </td>
//                       <td className="p-3 text-sm">
//                         {getStatusBadge(request.status)}
//                       </td>
//                       <td className="p-3 text-sm">
//                         {formatDate(request.createdAt)}
//                       </td>
//                       <td className="p-3 text-sm">
//                         {request.assignedTo?.fullName || "Unassigned"}
//                       </td>
//                       <td className="p-3 text-sm">
//                         <div className="flex space-x-2">
//                           <Button
//                             size="sm"
//                             variant="outline"
//                             onClick={() => handleViewRequest(request)}
//                           >
//                             <Eye className="w-4 h-4 mr-1" />
//                             View
//                           </Button>
//                           <Button
//                             size="sm"
//                             variant="outline"
//                             onClick={() => openReassignModal(request.id)}
//                           >
//                             <UserCheck className="w-4 h-4 mr-1" />
//                             Reassign
//                           </Button>
//                           {/* <Button
//                             size="sm"
//                             variant="outline"
//                             onClick={() => openProcessModal(request.id)}
//                             disabled={request.status === "fulfilled" || request.status === "rejected"}
//                           >
//                             <UserCheck className="w-4 h-4 mr-1" />
//                             Process
//                           </Button> */}
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       <RequestDetailModal
//         request={selectedRequest}
//         onClose={() => setIsDetailModalOpen(false)}
//         setModalMode={setModalMode}
//         setSelectedRequestId={setSelectedRequestId}
//         setModalOpen={setModalOpen}
//         isOpen={isDetailModalOpen}
//       />
//       <RequestActionModal
//         open={modalOpen}
//         mode={modalMode}
//         users={allUsers}
//         onClose={() => {
//           setModalOpen(false);
//           setSelectedRequestId(null);
//         }}
//         onSubmit={handleModalSubmit}
//       />
//     </div>
//   );
// };

// // import { API_BASE_URL } from "@/lib/api";
// // import React, { useState, useEffect } from "react";
// // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// // import { Badge } from "@/components/ui/badge";
// // import { Button } from "@/components/ui/button";
// // import { Loader2, Eye, UserCheck, Download, Filter } from "lucide-react";
// // import RequestActionModal from "./RequestActionModal";
// // import RequestDetailModal from "./RequestDetailModal"; // Add this line
// // import { toast } from "sonner";
// // // import ModalManager, { ModalType } from "./ModalManager";

// // // Types - Made more flexible to handle undefined values
// // interface User {
// //   id: number;
// //   name: string;
// //   role?: { name: string };
// // };

// // interface Request {
// //   id: number;
// //   type?: string;
// //   requestedBy?: {
// //     fullName?: string;
// //     role?: {
// //       name?: string;
// //     };
// //   };
// //   medication?: string;
// //   quantity?: number;
// //   status?: "pending" | "fulfilled" | "in_progress" | "rejected";
// //   createdAt?: string;
// //   assignedTo?: {
// //     fullName?: string;
// //   };
// //   description?: string;
// //   urgency?: "low" | "medium" | "high";
// //   notes?: string;
// // }

// // // Helper function for status badges
// // const getStatusBadge = (status: string = "unknown") => {
// //   switch (status) {
// //     case "pending":
// //       return (
// //         <Badge variant="outline" className="text-yellow-600 border-yellow-300">
// //           Pending
// //         </Badge>
// //       );
// //     case "fulfilled":
// //       return (
// //         <Badge variant="default" className="bg-green-600">
// //           Fulfilled
// //         </Badge>
// //       );
// //     case "in_progress":
// //       return <Badge variant="secondary">In Progress</Badge>;
// //     case "rejected":
// //       return <Badge variant="destructive">Rejected</Badge>;
// //     default:
// //       return <Badge variant="outline">{status}</Badge>;
// //   }
// // };

// // export const AllRequestsManagement = () => {
// //   const [requests, setRequests] = useState<Request[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState<string | null>(null);
// //   const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
// //   const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
// //   const [modalOpen, setModalOpen] = useState(false);
// //   const [modalMode, setModalMode] = useState<"reassign" | "process">("reassign");
// //   const [selectedRequestId, setSelectedRequestId] = useState<number | null>(
// //     null
// //   );
// //   const [allUsers, setAllUsers] = useState<User[]>([]); // from your backend
// //   // const [modalType, setModalType] = useState<ModalType>(null);

// //   // const openModal = (type: ModalType, id: number) => {
// //   //   setModalType(type);
// //   //   setSelectedRequestId(id);
// //   // };

// //   // const closeModal = () => {
// //   //   setModalType(null);
// //   //   setSelectedRequestId(null);
// //   // };
// //   useEffect(() => {
// //     const fetchUsers = async () => {
// //       const res = await fetch(`${API_BASE_URL}/super-admin/users`, {
// //         method: "GET",
// //         headers: {
// //           "Content-Type": "application/json",
// //           Authorization: `Bearer ${localStorage.getItem("auth_token")}`
// //         }
// //       }); // Adjust if different
// //       const data = await res.json();
// //       setAllUsers(data);
// //     };
// //     fetchUsers();
// //   }, []);

// //   // Fetch requests on component mount
// //   useEffect(() => {
// //     fetchRequests();
// //   }, []);

// //   const fetchRequests = async () => {
// //     setLoading(true);
// //     setError(null);

// //     try {
// //       const token = localStorage.getItem("auth_token");

// //       if (!token) {
// //         throw new Error("No authentication token found");
// //       }

// //       const response = await fetch(`${API_BASE_URL}/medication-requests`, {
// //         method: "GET",
// //         headers: {
// //           "Content-Type": "application/json",
// //           Authorization: `Bearer ${token}`
// //         }
// //       });

// //       const result = await response.json();

// //       // Add detailed logging to debug the response structure
// //       console.log("API Response:", result);

// //       if (!response.ok) {
// //         const message =
// //           result?.message || `HTTP error! status: ${response.status}`;
// //         throw new Error(message);
// //       }

// //       // Handle different possible response structures
// //       let requestsData = [];

// //       if (Array.isArray(result)) {
// //         requestsData = result;
// //       } else if (result.data) {
// //         if (Array.isArray(result.data.data)) {
// //           requestsData = result.data.data;
// //         } else if (Array.isArray(result.data)) {
// //           requestsData = result.data;
// //         }
// //       } else if (result.requests && Array.isArray(result.requests)) {
// //         requestsData = result.requests;
// //       }

// //       console.log("Processed requests data:", requestsData);

// //       // Validate and clean the data
// //       const validatedRequests = requestsData.map(
// //         (request: any, index: number) => {
// //           // Add validation and default values for required fields
// //           const validatedRequest: Request = {
// //             id: request.id || index + 1,
// //             type: request.type || "Unknown",
// //             requestedBy: {
// //               fullName:
// //                 request.requestedBy?.fullName ||
// //                 request.requester?.fullName ||
// //                 "Unknown User",
// //               role: {
// //                 name:
// //                   request.requestedBy?.role?.name ||
// //                   request.requester?.role?.name ||
// //                   "unknown_role"
// //               }
// //             },
// //             medication:
// //               request.medication ||
// //               request.medicationName ||
// //               "Unknown Medication",
// //             quantity: request.quantity || 0,
// //             status: request.status || "pending",
// //             createdAt:
// //               request.createdAt ||
// //               request.created_at ||
// //               new Date().toISOString(),
// //             assignedTo: request.assignedTo
// //               ? {
// //                   fullName: request.assignedTo.fullName || "Unknown"
// //                 }
// //               : undefined,
// //             description: request.description,
// //             urgency: request.urgency,
// //             notes: request.notes
// //           };

// //           return validatedRequest;
// //         }
// //       );

// //       setRequests(validatedRequests);
// //     } catch (err: any) {
// //       console.error("Fetch requests error:", err);
// //       setError(err.message || "An unexpected error occurred");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleViewRequest = (request: Request) => {
// //     setSelectedRequest(request);
// //     setIsDetailModalOpen(true);
// //   };

// //   const openReassignModal = async (requestId: number) => {
// //     // TODO: Implement reassignment logic
// //     setSelectedRequestId(requestId);
// //     setModalMode("reassign");
// //     setModalOpen(true);
// //     console.log("Reassigning request:", requestId);
// //   };

// //   const handleModalSubmit = async (payload: {
// //     assignedToId?: number;
// //     status?: string;
// //   }) => {
// //     if (!selectedRequestId) return;
// //     try {
// //       await fetch(`${API_BASE_URL}/auth/requests/${selectedRequestId}`, {
// //         method: "PATCH", // or "PUT" depending on your API
// //         headers: {
// //           "Content-Type": "application/json",
// //           Authorization: `Bearer ${localStorage.getItem("auth_token")}`
// //         },
// //         body: JSON.stringify(payload)
// //       });
// //       toast.success("Request updated successfully");
// //       fetchRequests();
// //     } catch (err) {
// //       toast.error("Update failed");
// //     }
// //   };

// //   const formatDate = (dateString?: string) => {
// //     if (!dateString) return "N/A";
// //     try {
// //       return new Date(dateString).toLocaleDateString("en-US", {
// //         year: "numeric",
// //         month: "short",
// //         day: "numeric",
// //         hour: "2-digit",
// //         minute: "2-digit"
// //       });
// //     } catch (error) {
// //       return "Invalid Date";
// //     }
// //   };

// //   const formatRequesterInfo = (requester?: Request["requestedBy"]) => {
// //     if (!requester) return "Unknown User";

// //     const fullName = requester.fullName || "Unknown User";
// //     const roleName = requester.role?.name || "unknown_role";
// //     const roleDisplayName = roleName.replace("_", " ").toUpperCase();

// //     return `${fullName} (${roleDisplayName})`;
// //   };

// //   if (loading) {
// //     return (
// //       <div className="flex items-center justify-center h-64">
// //         <Loader2 className="w-6 h-6 animate-spin mr-2" />
// //         Loading requests...
// //       </div>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <div className="space-y-6">
// //         <Card>
// //           <CardContent className="p-6">
// //             <div className="text-center">
// //               <p className="text-red-600 mb-4">{error}</p>
// //               <Button onClick={fetchRequests} variant="outline">
// //                 Try Again
// //               </Button>
// //             </div>
// //           </CardContent>
// //         </Card>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="space-y-6">
// //       <div className="flex justify-between items-center">
// //         <h3 className="text-lg font-semibold">
// //           All System Requests ({requests.length})
// //         </h3>
// //         <div className="flex space-x-2">
// //           <Button variant="outline" size="sm" onClick={fetchRequests}>
// //             Refresh
// //           </Button>
// //           <Button variant="outline" size="sm">
// //             <Download className="w-4 h-4 mr-2" />
// //             Export
// //           </Button>
// //           <Button variant="outline" size="sm">
// //             <Filter className="w-4 h-4 mr-2" />
// //             Filter
// //           </Button>
// //         </div>
// //       </div>

// //       <Card>
// //         <CardHeader>
// //           <CardTitle>Request Overview</CardTitle>
// //         </CardHeader>
// //         <CardContent>
// //           {requests.length === 0 ? (
// //             <div className="text-center py-8">
// //               <p className="text-gray-500">No requests found</p>
// //             </div>
// //           ) : (
// //             <div className="overflow-x-auto">
// //               <table className="w-full border-collapse">
// //                 <thead>
// //                   <tr className="border-b">
// //                     <th className="text-left p-3 font-semibold">Request ID</th>
// //                     <th className="text-left p-3 font-semibold">Type</th>
// //                     <th className="text-left p-3 font-semibold">
// //                       Requested By
// //                     </th>
// //                     <th className="text-left p-3 font-semibold">Medication</th>
// //                     {/* <th className="text-left p-3 font-semibold">Quantity</th> */}
// //                     <th className="text-left p-3 font-semibold">Status</th>
// //                     <th className="text-left p-3 font-semibold">Date</th>
// //                     <th className="text-left p-3 font-semibold">Assigned To</th>
// //                     <th className="text-left p-3 font-semibold">Actions</th>
// //                   </tr>
// //                 </thead>
// //                 <tbody>
// //                   {requests.map((request) => (
// //                     <tr key={request.id} className="border-b hover:bg-gray-50">
// //                       <td className="p-3 font-medium">#{request.id}</td>
// //                       <td className="p-3">{request.type || "N/A"}</td>
// //                       <td className="p-3">
// //                         {formatRequesterInfo(request.requestedBy)}
// //                       </td>
// //                       <td className="p-3">
// //                         {(() => {
// //                           let meds = request.medication;

// //                           // Handle JSON string
// //                           if (typeof meds === "string") {
// //                             try {
// //                               meds = JSON.parse(meds);
// //                             } catch (e) {
// //                               return "Invalid format";
// //                             }
// //                           }

// //                           if (Array.isArray(meds)) {
// //                             return meds
// //                               .map((med) => `${med.name} (${med.quantity})`)
// //                               .join(", ");
// //                           }

// //                           return "N/A";
// //                         })()}
// //                       </td>

// //                       {/* <td className="p-3">{request.quantity || 0}</td> */}
// //                       <td className="p-3">{getStatusBadge(request.status)}</td>
// //                       <td className="p-3">{formatDate(request.createdAt)}</td>
// //                       <td className="p-3">
// //                         {request.assignedTo?.fullName || "Unassigned"}
// //                       </td>
// //                       <td className="p-3">
// //                         <div className="flex space-x-2">
// //                           <Button
// //                             size="sm"
// //                             variant="outline"
// //                             onClick={() => handleViewRequest(request)}
// //                           >
// //                             <Eye className="w-4 h-4 mr-1" />
// //                             View
// //                           </Button>
// //                           <Button
// //                             size="sm"
// //                             variant="outline"
// //                             onClick={() => openReassignModal(request.id)}
// //                           >
// //                             <UserCheck className="w-4 h-4 mr-1" />
// //                             Reassign
// //                           </Button>
// //                         </div>
// //                       </td>
// //                     </tr>
// //                   ))}
// //                 </tbody>
// //               </table>
// //             </div>
// //           )}
// //         </CardContent>
// //       </Card>

// //       {/* Request Detail Modal */}
// //       <RequestDetailModal
// //         request={selectedRequest}
// //         onClose={() => setIsDetailModalOpen(false)}
// //         setModalMode={setModalMode}
// //         setSelectedRequestId={setSelectedRequestId}
// //         setModalOpen={setModalOpen}
// //         isOpen={isDetailModalOpen}
// //       />
// //       {/* Reassign Modal */}
// //       <RequestActionModal
// //         open={modalOpen}
// //         mode={modalMode}
// //         users={allUsers}
// //         onClose={() => setModalOpen(false)}
// //         onSubmit={handleModalSubmit}
// //       />
// //     </div>
// //   );
// // };


import { API_BASE_URL } from "@/lib/api";
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Eye, UserCheck, Download, Filter } from "lucide-react";
import RequestActionModal from "./RequestActionModal";
import RequestDetailModal from "./RequestDetailModal";
import { toast } from "sonner";

interface User {
  id: number;
  name: string;
  role?: { name: string };
}

interface Request {
  id: number;
  type?: string;
  requestedBy?: {
    fullName?: string;
    role?: { name?: string };
  };
  medication?: string; // This is now a formatted string from backend
  status?: "pending" | "fulfilled" | "in_progress" | "rejected";
  createdAt?: string;
  assignedTo?: {
    fullName?: string;
  };
  description?: string;
  urgency?: "low" | "medium" | "high";
  notes?: string;
}

const getStatusBadge = (status: string = "unknown") => {
  switch (status) {
    case "pending":
      return (
        <Badge variant="outline" className="text-yellow-600 border-yellow-300">
          Pending
        </Badge>
      );
    case "fulfilled":
      return (
        <Badge variant="default" className="bg-green-600">
          Fulfilled
        </Badge>
      );
    case "in_progress":
      return <Badge variant="secondary">In Progress</Badge>;
    case "rejected":
      return <Badge variant="destructive">Rejected</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export const AllRequestsManagement = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"reassign" | "process">(
    "reassign"
  );
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(
    null
  );
  const [allUsers, setAllUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/super-admin/users`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`
          }
        });
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        const usersData = Array.isArray(data) ? data : [];
        setAllUsers(usersData);
      } catch (err: any) {
        console.error("Fetch users error:", err);
        toast.error("Failed to load users");
        setAllUsers([]);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) throw new Error("No authentication token found");

      const response = await fetch(`${API_BASE_URL}/medication-requests`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(
          result?.message || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();
      const requestsData = Array.isArray(result)
        ? result
        : result.data?.data || result.data || result.requests || [];

      // ✅ SIMPLIFIED: Backend now sends formatted medication string
      const validatedRequests = requestsData.map(
        (request: any, index: number) => ({
          id: request.id || index + 1,
          type: request.type || "Medication Request",
          requestedBy: {
            fullName:
              request.requestedBy?.fullName ||
              request.requester?.fullName ||
              "N/A",
            role: {
              name:
                request.requestedBy?.role?.name ||
                request.requester?.role?.name ||
                "N/A"
            }
          },
          // ✅ FIXED: Just use the formatted string from backend
          medication: request.medication || "No medication specified",
          status: request.status || "pending",
          createdAt:
            request.createdAt || request.created_at || new Date().toISOString(),
          assignedTo: request.assignedTo
            ? { fullName: request.assignedTo.fullName || "N/A" }
            : undefined,
          description: request.description,
          urgency: request.urgency,
          notes: request.notes
        })
      );

      setRequests(validatedRequests);
    } catch (err: any) {
      console.error("Fetch requests error:", err);
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleViewRequest = (request: Request) => {
    setSelectedRequest(request);
    setIsDetailModalOpen(true);
  };

  const openReassignModal = (requestId: number) => {
    setSelectedRequestId(requestId);
    setModalMode("reassign");
    setModalOpen(true);
  };

  const openProcessModal = (requestId: number) => {
    setSelectedRequestId(requestId);
    setModalMode("process");
    setModalOpen(true);
  };

  const handleModalSubmit = async (payload: {
    assignedToId?: number;
    status?: string;
  }) => {
    if (!selectedRequestId) return;

    try {
      const token = localStorage.getItem("auth_token");
      if (!token) throw new Error("No authentication token found");

      const response = await fetch(
        `${API_BASE_URL}/auth/requests/${selectedRequestId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        }
      );

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result?.message || `Failed to ${modalMode} request`);
      }

      toast.success(
        `Request ${
          modalMode === "reassign" ? "reassigned" : "processed"
        } successfully`
      );
      fetchRequests();
      setModalOpen(false);
      setSelectedRequestId(null);
    } catch (err: any) {
      console.error(`Error ${modalMode} request:`, err);
      toast.error(`Failed to ${modalMode} request: ${err.message}`);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  const formatRequesterInfo = (requester?: Request["requestedBy"]) => {
    if (!requester) return "Unknown User";
    const fullName = requester.fullName || "Unknown User";
    return fullName;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Loading requests...
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={fetchRequests} variant="outline">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          All System Requests ({requests.length})
        </h3>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={fetchRequests}>
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Request Overview</CardTitle>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No requests found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 text-sm font-semibold">
                      Request ID
                    </th>
                    <th className="text-left p-3 text-sm font-semibold">
                      Type
                    </th>
                    <th className="text-left p-3 text-sm font-semibold">
                      Requested By
                    </th>
                    <th className="text-left p-3 text-sm font-semibold">
                      Medication
                    </th>
                    <th className="text-left p-3 text-sm font-semibold">
                      Status
                    </th>
                    <th className="text-left p-3 text-sm font-semibold">
                      Date
                    </th>
                    <th className="text-left p-3 text-sm font-semibold">
                      Assigned To
                    </th>
                    <th className="text-left p-3 text-sm font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request) => (
                    <tr key={request.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">#{request.id}</td>
                      <td className="p-3">{request.type}</td>
                      <td className="p-3 text-sm">
                        {formatRequesterInfo(request.requestedBy)}
                      </td>
                      <td className="p-3 text-sm">
                        {/* ✅ SIMPLIFIED: Just display the formatted string */}
                        {request.medication}
                      </td>
                      <td className="p-3 text-sm">
                        {getStatusBadge(request.status)}
                      </td>
                      <td className="p-3 text-sm">
                        {formatDate(request.createdAt)}
                      </td>
                      <td className="p-3 text-sm">
                        {request.assignedTo?.fullName || "Unassigned"}
                      </td>
                      <td className="p-3 text-sm">
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewRequest(request)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openReassignModal(request.id)}
                          >
                            <UserCheck className="w-4 h-4 mr-1" />
                            Reassign
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <RequestDetailModal
        request={selectedRequest}
        onClose={() => setIsDetailModalOpen(false)}
        setModalMode={setModalMode}
        setSelectedRequestId={setSelectedRequestId}
        setModalOpen={setModalOpen}
        isOpen={isDetailModalOpen}
      />
      <RequestActionModal
        open={modalOpen}
        mode={modalMode}
        users={allUsers}
        onClose={() => {
          setModalOpen(false);
          setSelectedRequestId(null);
        }}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
};