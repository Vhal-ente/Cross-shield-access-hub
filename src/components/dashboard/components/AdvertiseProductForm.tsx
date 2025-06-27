
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export const AdvertiseProductForm = () => {
  const [productName, setProductName] = useState("");
  const [details, setDetails] = useState("");
  const [expDate, setExpDate] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productName || !details || !expDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    toast.success("Product advertised successfully!");
    
    // Reset form
    setProductName("");
    setDetails("");
    setExpDate("");
    setPrice("");
    setImage(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Advertise New Product</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="productName">Product Name *</Label>
            <Input
              id="productName"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Enter product name"
              required
            />
          </div>

          <div>
            <Label htmlFor="details">Product Details *</Label>
            <Input
              id="details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Enter product details"
              required
            />
          </div>

          <div>
            <Label htmlFor="expDate">Expiration Date *</Label>
            <Input
              id="expDate"
              type="date"
              value={expDate}
              onChange={(e) => setExpDate(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="price">Price (₦)</Label>
            <Input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter price"
            />
          </div>

          <div>
            <Label htmlFor="image">Product Picture</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              className="mt-1"
            />
          </div>

          <Button type="submit" className="w-full">
            Advertise Product
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
