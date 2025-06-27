
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const RequestsList = () => {
  const requests = [
    {
      id: 1,
      medication: "Paracetamol 500mg",
      patient: "John Doe",
      quantity: 30,
      urgency: "Normal",
      date: "2024-01-15",
      status: "pending"
    },
    {
      id: 2,
      medication: "Amoxicillin 250mg",
      patient: "Jane Smith",
      quantity: 21,
      urgency: "Urgent",
      date: "2024-01-14", 
      status: "fulfilled"
    },
    {
      id: 3,
      medication: "Metformin 500mg",
      patient: "Mike Johnson",
      quantity: 60,
      urgency: "Normal",
      date: "2024-01-13",
      status: "pending"
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Incoming Requests</h3>
      {requests.map((request) => (
        <Card key={request.id}>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <h4 className="font-medium">{request.medication}</h4>
                <p className="text-sm text-gray-600">Patient: {request.patient}</p>
                <p className="text-sm text-gray-600">Quantity: {request.quantity}</p>
                <p className="text-sm text-gray-600">Date: {request.date}</p>
              </div>
              <div className="text-right space-y-2">
                <Badge variant={request.urgency === "Urgent" ? "destructive" : "secondary"}>
                  {request.urgency}
                </Badge>
                <br />
                <Badge variant={request.status === "fulfilled" ? "default" : "outline"}>
                  {request.status}
                </Badge>
                {request.status === "pending" && (
                  <div className="mt-2">
                    <Button size="sm">Respond</Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
