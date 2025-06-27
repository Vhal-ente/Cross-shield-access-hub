
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const AdvertsApproval = () => {
  const pendingAdverts = [
    {
      id: 1,
      productName: "Paracetamol 500mg",
      supplier: "MediSupply Ltd",
      price: 500,
      quantity: 1000,
      expDate: "2025-12-31",
      nafdac: "A4-1234",
      status: "pending",
      submittedDate: "2024-01-15",
      location: "Lagos, Nigeria"
    },
    {
      id: 2,
      productName: "Vitamin C Tablets",
      supplier: "HealthCorp",
      price: 1200,
      quantity: 500,
      expDate: "2025-06-30",
      nafdac: "Not Available",
      status: "pending",
      submittedDate: "2024-01-14",
      location: "Abuja, Nigeria"
    },
    {
      id: 3,
      productName: "Amoxicillin 250mg",
      supplier: "Pharma Direct",
      price: 800,
      quantity: 200,
      expDate: "2024-08-15",
      nafdac: "B5-5678",
      status: "rejected",
      submittedDate: "2024-01-13",
      location: "Port Harcourt, Nigeria"
    }
  ];

  const handleApprove = (id: number) => {
    toast.success("Advertisement approved successfully!");
    console.log(`Approved advert ${id}`);
  };

  const handleReject = (id: number) => {
    toast.error("Advertisement rejected!");
    console.log(`Rejected advert ${id}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Pending Review</Badge>;
      case "approved":
        return <Badge variant="default">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Advertisement Approval</h3>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">Filter</Button>
          <Button variant="outline" size="sm">Export</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">5</div>
            <div className="text-sm text-gray-600">Pending Approval</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">23</div>
            <div className="text-sm text-gray-600">Approved This Month</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">2</div>
            <div className="text-sm text-gray-600">Rejected This Month</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {pendingAdverts.map((advert) => (
          <Card key={advert.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-3">
                  <div className="flex items-center space-x-4">
                    <h4 className="text-lg font-semibold">{advert.productName}</h4>
                    {getStatusBadge(advert.status)}
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Supplier:</span>
                      <p>{advert.supplier}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Price:</span>
                      <p>₦{advert.price}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Quantity:</span>
                      <p>{advert.quantity} units</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Expiry Date:</span>
                      <p>{advert.expDate}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">NAFDAC:</span>
                      <p>{advert.nafdac}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Location:</span>
                      <p>{advert.location}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Submitted:</span>
                      <p>{advert.submittedDate}</p>
                    </div>
                  </div>
                </div>

                {advert.status === "pending" && (
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleApprove(advert.id)}
                    >
                      Approve
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleReject(advert.id)}
                    >
                      Reject
                    </Button>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
