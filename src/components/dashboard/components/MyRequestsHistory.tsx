
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const MyRequestsHistory = () => {
  const requests = [
    {
      id: 1,
      type: "Regular Request",
      medication: "Paracetamol 500mg",
      quantity: 30,
      status: "fulfilled",
      date: "2024-01-15",
      urgency: "Normal",
      fulfilledBy: "Dr. Smith"
    },
    {
      id: 2,
      type: "Special Order",
      medication: "Insulin Glargine",
      quantity: 5,
      status: "pending",
      date: "2024-01-14",
      urgency: "Urgent",
      fulfilledBy: null
    },
    {
      id: 3,
      type: "Regular Request",
      medication: "Metformin 850mg",
      quantity: 60,
      status: "in_progress",
      date: "2024-01-13",
      urgency: "Normal",
      fulfilledBy: "City Pharmacy"
    },
    {
      id: 4,
      type: "Special Order",
      medication: "Rare Antibiotic",
      quantity: 10,
      status: "cancelled",
      date: "2024-01-10",
      urgency: "Emergency",
      fulfilledBy: null
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
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case "Emergency":
        return <Badge className="bg-red-100 text-red-800">Emergency</Badge>;
      case "Urgent":
        return <Badge className="bg-orange-100 text-orange-800">Urgent</Badge>;
      case "Normal":
        return <Badge className="bg-gray-100 text-gray-800">Normal</Badge>;
      default:
        return <Badge variant="outline">{urgency}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">My Request History</h3>
        <Button variant="outline" size="sm">Export History</Button>
      </div>
      
      {requests.map((request) => (
        <Card key={request.id}>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium">{request.medication}</h4>
                  <Badge variant="outline" className="text-xs">{request.type}</Badge>
                </div>
                <p className="text-sm text-gray-600">Quantity: {request.quantity}</p>
                <p className="text-sm text-gray-600">Date: {request.date}</p>
                {request.fulfilledBy && (
                  <p className="text-sm text-gray-600">Fulfilled by: {request.fulfilledBy}</p>
                )}
              </div>
              <div className="text-right space-y-2">
                {getUrgencyBadge(request.urgency)}
                <br />
                {getStatusBadge(request.status)}
                <div className="mt-2 space-x-2">
                  <Button size="sm" variant="outline">View Details</Button>
                  {request.status === "pending" && (
                    <Button size="sm" variant="outline">Cancel</Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
