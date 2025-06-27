
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const BeneficiariesList = () => {
  const beneficiaries = [
    {
      id: 1,
      name: "Mama Adunni",
      phone: "+234-XXX-XXX-XXXX",
      medication: "Hypertension medications",
      location: "Lagos, Nigeria",
      status: "active"
    },
    {
      id: 2,
      name: "Uncle Emeka",
      phone: "+234-XXX-XXX-XXXX",
      medication: "Diabetes medications",
      location: "Abuja, Nigeria",
      status: "active"
    },
    {
      id: 3,
      name: "Aunty Kemi",
      phone: "+234-XXX-XXX-XXXX",
      medication: "Arthritis treatment",
      location: "Port Harcourt, Nigeria",
      status: "inactive"
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">My Beneficiaries</h3>
      {beneficiaries.map((beneficiary) => (
        <Card key={beneficiary.id}>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <h4 className="font-medium">{beneficiary.name}</h4>
                <p className="text-sm text-gray-600">Phone: {beneficiary.phone}</p>
                <p className="text-sm text-gray-600">Medication: {beneficiary.medication}</p>
                <p className="text-sm text-gray-600">Location: {beneficiary.location}</p>
              </div>
              <div className="text-right space-y-2">
                <Badge variant={beneficiary.status === "active" ? "default" : "secondary"}>
                  {beneficiary.status}
                </Badge>
                <div className="mt-2 space-x-2">
                  <Button size="sm" variant="outline">Edit</Button>
                  <Button size="sm">Request Meds</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
