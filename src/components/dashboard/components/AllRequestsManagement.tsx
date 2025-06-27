
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const AllRequestsManagement = () => {
  const allRequests = [
    {
      id: 1,
      type: "Medication Request",
      requestedBy: "John Doe (Diaspora)",
      medication: "Paracetamol 500mg",
      quantity: 30,
      status: "pending",
      date: "2024-01-15",
      assignedTo: "Dr. Smith"
    },
    {
      id: 2,
      type: "Drug Sourcing",
      requestedBy: "Dr. Johnson (Health Practitioner)",
      medication: "Amoxicillin 250mg",
      quantity: 100,
      status: "fulfilled",
      date: "2024-01-14",
      assignedTo: "MediSupply Ltd"
    },
    {
      id: 3,
      type: "Patient Referral",
      requestedBy: "Dr. Adams (Health Practitioner)",
      medication: "Insulin",
      quantity: 5,
      status: "in_progress",
      date: "2024-01-13",
      assignedTo: "City Pharmacy"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">Pending</Badge>;
      case "fulfilled":
        return <Badge variant="default">Fulfilled</Badge>;
      case "in_progress":
        return <Badge variant="secondary">In Progress</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">All System Requests</h3>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">Export</Button>
          <Button variant="outline" size="sm">Filter</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Request Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Requested By</TableHead>
                <TableHead>Medication</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>#{request.id}</TableCell>
                  <TableCell>{request.type}</TableCell>
                  <TableCell>{request.requestedBy}</TableCell>
                  <TableCell>{request.medication}</TableCell>
                  <TableCell>{request.quantity}</TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell>{request.assignedTo}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">View</Button>
                      <Button size="sm" variant="outline">Reassign</Button>
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
