// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// export const SupplierRequestsManagement = () => {
//   const supplierRequests = [
//     {
//       id: 1,
//       requestType: "New Registration",
//       supplierName: "ABC Pharmaceuticals",
//       contact: "contact@abcpharma.com",
//       location: "Lagos, Nigeria",
//       status: "pending",
//       submittedDate: "2024-01-15",
//       documents: ["Business License", "NAFDAC Certificate"]
//     },
//     {
//       id: 2,
//       requestType: "Product Addition",
//       supplierName: "MediSupply Ltd",
//       contact: "info@medisupply.com",
//       location: "Abuja, Nigeria",
//       status: "approved",
//       submittedDate: "2024-01-12",
//       documents: ["Product Certificate", "Quality Assurance"]
//     },
//     {
//       id: 3,
//       requestType: "License Renewal",
//       supplierName: "HealthCorp",
//       contact: "admin@healthcorp.ng",
//       location: "Port Harcourt, Nigeria",
//       status: "under_review",
//       submittedDate: "2024-01-10",
//       documents: ["Renewed License", "Updated Insurance"]
//     }
//   ];

//   const getStatusBadge = (status: string) => {
//     switch (status) {
//       case "pending":
//         return <Badge variant="secondary">Pending</Badge>;
//       case "approved":
//         return <Badge variant="default">Approved</Badge>;
//       case "under_review":
//         return <Badge variant="outline">Under Review</Badge>;
//       case "rejected":
//         return <Badge variant="destructive">Rejected</Badge>;
//       default:
//         return <Badge variant="outline">{status}</Badge>;
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <h3 className="text-lg font-semibold">Supplier Requests Management</h3>
//         <div className="flex space-x-2">
//           <Button variant="outline" size="sm">Filter</Button>
//           <Button variant="outline" size="sm">Export</Button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//         <Card>
//           <CardContent className="p-4">
//             <div className="text-2xl font-bold text-orange-600">7</div>
//             <div className="text-sm text-gray-600">Pending Requests</div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="p-4">
//             <div className="text-2xl font-bold text-blue-600">3</div>
//             <div className="text-sm text-gray-600">Under Review</div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="p-4">
//             <div className="text-2xl font-bold text-green-600">15</div>
//             <div className="text-sm text-gray-600">Approved This Month</div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="p-4">
//             <div className="text-2xl font-bold text-red-600">2</div>
//             <div className="text-sm text-gray-600">Rejected</div>
//           </CardContent>
//         </Card>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle>Supplier Requests</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Request ID</TableHead>
//                 <TableHead>Type</TableHead>
//                 <TableHead>Supplier Name</TableHead>
//                 <TableHead>Contact</TableHead>
//                 <TableHead>Location</TableHead>
//                 <TableHead>Status</TableHead>
//                 <TableHead>Submitted</TableHead>
//                 <TableHead>Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {supplierRequests.map((request) => (
//                 <TableRow key={request.id}>
//                   <TableCell>#{request.id}</TableCell>
//                   <TableCell>{request.requestType}</TableCell>
//                   <TableCell className="font-medium">{request.supplierName}</TableCell>
//                   <TableCell>{request.contact}</TableCell>
//                   <TableCell>{request.location}</TableCell>
//                   <TableCell>{getStatusBadge(request.status)}</TableCell>
//                   <TableCell>{request.submittedDate}</TableCell>
//                   <TableCell>
//                     <div className="flex space-x-2">
//                       <Button size="sm" variant="outline">Review</Button>
//                       {request.status === "pending" && (
//                         <>
//                           <Button size="sm">Approve</Button>
//                           <Button size="sm" variant="destructive">Reject</Button>
//                         </>
//                       )}
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "@/lib/api";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";

export default function SupplierRequestsManagement() {
  const [supplierRequests, setSupplierRequests] = useState([]);
  const [stats, setStats] = useState({
    pending: 0,
    underReview: 0,
    approvedThisMonth: 0,
    rejected: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const PRODUCTS_URL = `${API_BASE_URL}/all-products`;

  // Fetch products and calculate stats on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("auth_token");
      // Actual API call to fetch products
      const response = await fetch(PRODUCTS_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Transform the products data based on your actual API response structure
      const transformedData = data.products.map((product) => ({
        id: product.id,
        requestType: "Supplier Registration", // Since all are product requests
        supplierName: product.supplier
          ? product.supplier.fullName || product.supplier.businessName
          : product.businessName || "N/A",
        contact: product.email,
        phone: product.phone,
        location: product.location,
        status: product.status, // pending, approved, rejected
        submittedDate: new Date(
          product.createdAt || product.created_at
        ).toLocaleDateString(),
        documents: [], // Add documents if available in your product model
        description: `Product registration request for ${
          product.name || "product"
        }`,
        supplierId: product.supplierId || product.supplier_id,
        businessName: product.businessName,
        productName: product.name || 'N/A'
      }));

      setSupplierRequests(transformedData);

      // Calculate stats from the fetched data
      calculateStats(transformedData);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error(
        error.message || "Error rejecting product. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (requests) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const calculatedStats = requests.reduce(
      (acc, request) => {
        const submittedDate = new Date(request.submittedDate);
        if (request.status === "pending") {
          acc.pending++;
          acc.underReview++; // Count as under review
        } else if (request.status === "approved") {
          if (
            submittedDate.getMonth() === currentMonth &&
            submittedDate.getFullYear() === currentYear
          ) {
            acc.approvedThisMonth++;
          }
        } else if (request.status === "rejected") {
          acc.rejected++;
        }
        return acc;
      },
      { pending: 0, underReview: 0, approvedThisMonth: 0, rejected: 0 }
    );

    setStats(calculatedStats);
  };

  const handleApprove = async (requestId) => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem("auth_token");
      // API call to approve product using your actual endpoint
      const response = await fetch(
        `${API_BASE_URL}/products/${requestId}/approve`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();

      // Update local state
      setSupplierRequests((prev) => {
        const updated = prev.map((req) =>
          req.id === requestId ? { ...req, status: "approved" } : req
        );
        // Recalculate stats with updated data
        calculateStats(updated);
        return updated;
      });

      toast.success(result.message || "Product approved successfully!");
    } catch (error) {
      console.error("Error approving product:", error);
      toast.error(
        error.message || "Error rejecting product. Please try again."
      );
      // alert(error.message || "Error approving product. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (requestId) => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem("auth_token");
      // API call to reject product using your actual endpoint
      const response = await fetch(
        `${API_BASE_URL}/products/${requestId}/reject`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();

      // Update local state
      setSupplierRequests((prev) => {
        const updated = prev.map((req) =>
          req.id === requestId ? { ...req, status: "rejected" } : req
        );
        // Recalculate stats with updated data
        calculateStats(updated);
        return updated;
      });

      toast.success(result.message || "Product approved successfully!");
    } catch (error) {
      console.error("Error rejecting product:", error);
      toast.error(
        error.message || "Error rejecting product. Please try again."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleReview = (request) => {
    setSelectedRequest(request);
    setShowReviewModal(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-orange-100 text-orange-800">Pending</Badge>;
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading supplier requests...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Supplier Requests Management</h3>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => fetchProducts()}>
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            Filter
          </Button>
          <Button variant="outline" size="sm">
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">
              {stats.pending}
            </div>
            <div className="text-sm text-gray-600">Pending Requests</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {stats.underReview}
            </div>
            <div className="text-sm text-gray-600">Under Review</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {stats.approvedThisMonth}
            </div>
            <div className="text-sm text-gray-600">Approved This Month</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">
              {stats.rejected}
            </div>
            <div className="text-sm text-gray-600">Rejected</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Supplier Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Supplier ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Supplier Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {supplierRequests.map((request) => (
                  // <TableRow key={request.id} className="border-b hover:bg-gray-50">
                  <TableRow key={request.id}>
                    <TableCell>#{request.id}</TableCell>
                    <TableCell>{request.requestType}</TableCell>
                    <TableCell>{request.supplierName}</TableCell>
                    <TableCell>{request.phone}</TableCell>
                    <TableCell>{request.location}</TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell>{request.submittedDate}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReview(request)}
                        >
                          Review
                        </Button>

                        {request.status === "pending" && (
                          <>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" disabled={actionLoading}>
                                  Approve
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Approve Request
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to approve this
                                    supplier request from {request.supplierName}
                                    ? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleApprove(request.id)}
                                  >
                                    Approve
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  disabled={actionLoading}
                                >
                                  Reject
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Reject Request
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to reject this
                                    supplier request from {request.supplierName}
                                    ? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleReject(request.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Reject
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Review Modal */}
      {showReviewModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Review Supplier Request #{selectedRequest.id}
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowReviewModal(false)}
              >
                ×
              </Button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-sm">
                    Supplier Name:
                  </label>
                  <p className="mt-1">{selectedRequest.supplierName}</p>
                </div>
                <div>
                  <label className="font-semibold text-sm">Request Type:</label>
                  <p className="mt-1">{selectedRequest.requestType}</p>
                </div>
                <div>
                  <label className="font-semibold text-sm">Phone:</label>
                  <p className="mt-1">{selectedRequest.phone}</p>
                </div>
                <div>
                  <label className="font-semibold text-sm">Email:</label>
                  <p className="mt-1">{selectedRequest.contact}</p>
                </div>
                <div>
                  <label className="font-semibold text-sm">Location:</label>
                  <p className="mt-1">{selectedRequest.location}</p>
                </div>
                <div>
                  <label className="font-semibold text-sm">Status:</label>
                  <div className="mt-1">
                    {getStatusBadge(selectedRequest.status)}
                  </div>
                </div>
                <div>
                  <label className="font-semibold text-sm">Submitted:</label>
                  <p className="mt-1">{selectedRequest.submittedDate}</p>
                </div>
              </div>

              <div>
                <label className="font-semibold text-sm">Product Name:</label>
                <p className="mt-1 text-gray-700">
                  {selectedRequest.productName || "Not specified"}
                </p>
              </div>

              <div>
                <label className="font-semibold text-sm">Business Name:</label>
                <p className="mt-1 text-gray-700">
                  {selectedRequest.businessName || "Not specified"}
                </p>
              </div>

              {/* <div>
                <label className="font-semibold text-sm">Description:</label>
                <p className="mt-1 text-gray-700">
                  {selectedRequest.description}
                </p>
              </div> */}

              {/* <div>
                <label className="font-semibold text-sm">Documents:</label>
                <ul className="mt-1 list-disc list-inside text-gray-700">
                  {selectedRequest.documents.map((doc, index) => (
                    <li key={index}>{doc}</li>
                  ))}
                </ul>
              </div> */}
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowReviewModal(false)}
              >
                Close
              </Button>
              {selectedRequest.status === "pending" && (
                <div className="flex space-x-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button disabled={actionLoading}>Approve</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Approve Request</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to approve this supplier request
                          from {selectedRequest.supplierName}? This action
                          cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            handleApprove(selectedRequest.id);
                            setShowReviewModal(false);
                          }}
                        >
                          Approve
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" disabled={actionLoading}>
                        Reject
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Reject Request</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to reject this supplier request
                          from {selectedRequest.supplierName}? This action
                          cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            handleReject(selectedRequest.id);
                            setShowReviewModal(false);
                          }}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Reject
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
