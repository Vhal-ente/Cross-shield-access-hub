
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const ProductsList = () => {
  const products = [
    {
      id: 1,
      name: "Paracetamol 500mg",
      details: "Pain reliever and fever reducer",
      price: 500,
      expDate: "2025-12-31",
      status: "active"
    },
    {
      id: 2,
      name: "Vitamin C Tablets",
      details: "Immune system booster, 1000mg",
      price: 1200,
      expDate: "2025-06-30",
      status: "active"
    },
    {
      id: 3,
      name: "Amoxicillin 250mg",
      details: "Antibiotic for bacterial infections",
      price: 800,
      expDate: "2024-08-15",
      status: "expired"
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">My Advertised Products</h3>
      {products.map((product) => (
        <Card key={product.id}>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <h4 className="font-medium">{product.name}</h4>
                <p className="text-sm text-gray-600">{product.details}</p>
                <p className="text-sm text-gray-600">Price: ₦{product.price}</p>
                <p className="text-sm text-gray-600">Expires: {product.expDate}</p>
              </div>
              <div className="text-right space-y-2">
                <Badge variant={product.status === "active" ? "default" : "destructive"}>
                  {product.status}
                </Badge>
                <div className="mt-2 space-x-2">
                  <Button size="sm" variant="outline">Edit</Button>
                  <Button size="sm" variant="destructive">Remove</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
