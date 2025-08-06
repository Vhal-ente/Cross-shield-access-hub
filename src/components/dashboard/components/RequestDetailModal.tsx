// import React from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter
// } from "@/components/ui/dialog";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { UserCheck } from "lucide-react";

// export interface Request {
//   id: number;
//   type?: string;
//   requestedBy?: {
//     fullName?: string;
//     role?: { name?: string };
//   };
//   medication?: string;
//   quantity?: number;
//   status?: "pending" | "fulfilled" | "in_progress" | "rejected";
//   createdAt?: string;
//   assignedTo?: {
//     fullName?: string;
//   };
//   description?: string;
//   urgency?: "low" | "medium" | "high";
//   notes?: string;
//   payload?: any; // Add this line to include the payload property
// }

// interface RequestDetailProps {
//   request?: Request | null;
//   onClose: () => void;
//   setModalMode: (mode: "reassign" | "process") => void;
//   setSelectedRequestId: (id: number) => void;
//   setModalOpen: (open: boolean) => void;
//   isOpen: boolean;
// }

// const RequestDetailModal: React.FC<RequestDetailProps> = ({
//   request,
//   onClose,
//   setModalMode,
//   setSelectedRequestId,
//   setModalOpen,
//   isOpen
// }) => {
//   if (!request) return null;

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

//   const getStatusBadge = (status: string = "unknown") => {
//     switch (status) {
//       case "pending":
//         return (
//           <Badge
//             variant="outline"
//             className="text-yellow-600 border-yellow-300"
//           >
//             Pending
//           </Badge>
//         );
//       case "fulfilled":
//         return (
//           <Badge variant="default" className="bg-green-600">
//             Fulfilled
//           </Badge>
//         );
//       case "in_progress":
//         return <Badge variant="secondary">In Progress</Badge>;
//       case "rejected":
//         return <Badge variant="destructive">Rejected</Badge>;
//       default:
//         return <Badge variant="outline">{status}</Badge>;
//     }
//   };

//   const getUrgencyBadge = (urgency?: string) => {
//     switch (urgency) {
//       case "high":
//         return <Badge variant="destructive">High Priority</Badge>;
//       case "medium":
//         return <Badge variant="secondary">Medium Priority</Badge>;
//       case "low":
//         return <Badge variant="outline">Low Priority</Badge>;
//       default:
//         return null;
//     }
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="max-w-2xl">
//         <DialogHeader>
//           <DialogTitle>Request Details - #{request.id}</DialogTitle>
//           <DialogDescription>
//             Complete information about this request
//           </DialogDescription>
//         </DialogHeader>

//         <div className="space-y-4">
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="font-semibold text-sm">Request Type</label>
//               <p className="text-sm text-gray-600">{request.type || "N/A"}</p>
//             </div>
//             <div>
//               <label className="font-semibold text-sm">Status</label>
//               <div className="mt-1">
//                 {getStatusBadge(request.status)}
//                 {request.urgency && (
//                   <span className="ml-2">
//                     {getUrgencyBadge(request.urgency)}
//                   </span>
//                 )}
//               </div>
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="font-semibold text-sm">Requested By</label>
//               <p className="text-sm text-gray-600">
//                 {request.requestedBy?.fullName || "Unknown"} (
//                 {request.requestedBy?.role?.name || "No Role"})
//               </p>
//             </div>
//             <div>
//               <label className="font-semibold text-sm">Date Created</label>
//               <p className="text-sm text-gray-600">
//                 {formatDate(request.createdAt)}
//               </p>
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="font-semibold text-sm">Medication</label>
//               <p className="text-sm text-gray-600">
//                 {(() => {
//                   // First check if there's a single medication in the medication field
//                   if (request.medication && request.quantity) {
//                     return `${request.medication} (${request.quantity})`;
//                   }

//                   // Then check for multiple medications in payload
//                   let payload = request.payload;

//                   // Parse payload if it's a string
//                   if (typeof payload === "string") {
//                     try {
//                       payload = JSON.parse(payload);
//                     } catch (e) {
//                       return "N/A";
//                     }
//                   }

//                   // Check if payload has medications array
//                   if (payload && Array.isArray(payload.medication)) {
//                     return payload.medication
//                       .map((med) => `${med.name} (${med.quantity})`)
//                       .join(", ");
//                   }

//                   // Fallback: check if medications is directly in request object
//                   if (Array.isArray(request.medication)) {
//                     return request.medication
//                       .map((med) => `${med.name} (${med.quantity})`)
//                       .join(", ");
//                   }

//                   return "N/A";
//                 })()}
//               </p>
//             </div>
//           </div>

//           {request.assignedTo && (
//             <div>
//               <label className="font-semibold text-sm">Assigned To</label>
//               <p className="text-sm text-gray-600">
//                 {request.assignedTo.fullName || "N/A"}
//               </p>
//             </div>
//           )}

//           {request.description && (
//             <div>
//               <label className="font-semibold text-sm">Description</label>
//               <p className="text-sm text-gray-600">{request.description}</p>
//             </div>
//           )}

//           {request.notes && (
//             <div>
//               <label className="font-semibold text-sm">Notes</label>
//               <p className="text-sm text-gray-600">{request.notes}</p>
//             </div>
//           )}

//           <div className="flex justify-end space-x-2 pt-4">
//             <Button variant="outline" onClick={onClose}>
//               Close
//             </Button>
//             <Button
//               variant="outline"
//               onClick={() => {
//                 if (!request?.id) return;
//                 setModalMode("reassign");
//                 setSelectedRequestId(request.id);
//                 setModalOpen(true);
//                 onClose();
//               }}
//             >
//               <UserCheck className="w-4 h-4 mr-2" />
//               Reassign
//             </Button>
//             {/* <Button
//               onClick={() => {
//                 if (!request?.id) return;
//                 setModalMode("process");
//                 setSelectedRequestId(request.id);
//                 setModalOpen(true);
//                 onClose();
//               }}
//               disabled={request.status === "fulfilled" || request.status === "rejected"}
//             >
//               Process Request
//             </Button> */}
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default RequestDetailModal;


import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserCheck } from "lucide-react";

export interface Request {
  id: number;
  type?: string;
  requestedBy?: {
    fullName?: string;
    role?: { name?: string };
  };
  medication?: string; // This is now a formatted string from backend
  quantity?: number;
  status?: "pending" | "fulfilled" | "in_progress" | "rejected";
  createdAt?: string;
  assignedTo?: {
    fullName?: string;
  };
  description?: string;
  urgency?: "low" | "medium" | "high";
  notes?: string;
}

interface RequestDetailProps {
  request?: Request | null;
  onClose: () => void;
  setModalMode: (mode: "reassign" | "process") => void;
  setSelectedRequestId: (id: number) => void;
  setModalOpen: (open: boolean) => void;
  isOpen: boolean;
}

const RequestDetailModal: React.FC<RequestDetailProps> = ({
  request,
  onClose,
  setModalMode,
  setSelectedRequestId,
  setModalOpen,
  isOpen
}) => {
  if (!request) return null;

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

  const getStatusBadge = (status: string = "unknown") => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="text-yellow-600 border-yellow-300"
          >
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

  const getUrgencyBadge = (urgency?: string) => {
    switch (urgency) {
      case "high":
        return <Badge variant="destructive">High Priority</Badge>;
      case "medium":
        return <Badge variant="secondary">Medium Priority</Badge>;
      case "low":
        return <Badge variant="outline">Low Priority</Badge>;
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Request Details - #{request.id}</DialogTitle>
          <DialogDescription>
            Complete information about this request
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-sm">Request Type</label>
              <p className="text-sm text-gray-600">{request.type || "N/A"}</p>
            </div>
            <div>
              <label className="font-semibold text-sm">Status</label>
              <div className="mt-1">
                {getStatusBadge(request.status)}
                {request.urgency && (
                  <span className="ml-2">
                    {getUrgencyBadge(request.urgency)}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-sm">Requested By</label>
              <p className="text-sm text-gray-600">
                {request.requestedBy?.fullName || "Unknown"}
                {request.requestedBy?.role?.name && 
                  ` (${request.requestedBy.role.name.replace('_', ' ').toUpperCase()})`
                }
              </p>
            </div>
            <div>
              <label className="font-semibold text-sm">Date Created</label>
              <p className="text-sm text-gray-600">
                {formatDate(request.createdAt)}
              </p>
            </div>
          </div>

          <div>
            <label className="font-semibold text-sm">Medication</label>
            <p className="text-sm text-gray-600">
              {request.medication || "N/A"}
            </p>
          </div>

          {request.assignedTo && (
            <div>
              <label className="font-semibold text-sm">Assigned To</label>
              <p className="text-sm text-gray-600">
                {request.assignedTo.fullName || "N/A"}
              </p>
            </div>
          )}

          {request.description && (
            <div>
              <label className="font-semibold text-sm">Description</label>
              <p className="text-sm text-gray-600">{request.description}</p>
            </div>
          )}

          {request.notes && (
            <div>
              <label className="font-semibold text-sm">Notes</label>
              <p className="text-sm text-gray-600">{request.notes}</p>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                if (!request?.id) return;
                setModalMode("reassign");
                setSelectedRequestId(request.id);
                setModalOpen(true);
                onClose();
              }}
            >
              <UserCheck className="w-4 h-4 mr-2" />
              Reassign
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RequestDetailModal;