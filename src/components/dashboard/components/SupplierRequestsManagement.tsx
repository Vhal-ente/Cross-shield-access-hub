
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const SupplierRequestsManagement = () => {
  const supplierRequests = [
    {
      id: 1,
      requestType: "New Registration",
      supplierName: "ABC Pharmaceuticals",
      contact: "contact@abcpharma.com",
      location: "Lagos, Nigeria",
      status: "pending",
      submittedDate: "2024-01-15",
      documents: ["Business License", "NAFDAC Certificate"]
    },
    {
      id: 2,
      requestType: "Product Addition",
      supplierName: "MediSupply Ltd",
      contact: "info@medisupply.com",
      location: "Abuja, Nigeria",
      status: "approved",
      submittedDate: "2024-01-12",
      documents: ["Product Certificate", "Quality Assurance"]
    },
    {
      id: 3,
      requestType: "License Renewal",
      supplierName: "HealthCorp",
      contact: "admin@healthcorp.ng",
      location: "Port Harcourt, Nigeria",
      status: "under_review",
      submittedDate: "2024-01-10",
      documents: ["Renewed License", "Updated Insurance"]
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "approved":
        return <Badge variant="default">Approved</Badge>;
      case "under_review":
        return <Badge variant="outline">Under Review</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Supplier Requests Management</h3>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">Filter</Button>
          <Button variant="outline" size="sm">Export</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">7</div>
            <div className="text-sm text-gray-600">Pending Requests</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">3</div>
            <div className="text-sm text-gray-600">Under Review</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">15</div>
            <div className="text-sm text-gray-600">Approved This Month</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">2</div>
            <div className="text-sm text-gray-600">Rejected</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Supplier Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request ID</TableHead>
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
                <TableRow key={request.id}>
                  <TableCell>#{request.id}</TableCell>
                  <TableCell>{request.requestType}</TableCell>
                  <TableCell className="font-medium">{request.supplierName}</TableCell>
                  <TableCell>{request.contact}</TableCell>
                  <TableCell>{request.location}</TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell>{request.submittedDate}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">Review</Button>
                      {request.status === "pending" && (
                        <>
                          <Button size="sm">Approve</Button>
                          <Button size="sm" variant="destructive">Reject</Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
