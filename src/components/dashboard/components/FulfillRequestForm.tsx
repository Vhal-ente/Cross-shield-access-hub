
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export const FulfillRequestForm = () => {
  const [response, setResponse] = useState<"yes" | "no" | "">("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [expDate, setExpDate] = useState("");
  const [hasNafdac, setHasNafdac] = useState<"yes" | "no" | "">("");
  const [nafdacNumber, setNafdacNumber] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (response === "yes") {
      if (!price || !quantity || !expDate || !location) {
        toast.error("Please fill in all required fields");
        return;
      }
      if (hasNafdac === "yes" && !nafdacNumber) {
        toast.error("Please enter NAFDAC number");
        return;
      }
      toast.success("Request fulfilled successfully!");
    } else {
      toast.success("Thank you for your response!");
    }
    
    // Reset form
    setResponse("");
    setPrice("");
    setQuantity("");
    setExpDate("");
    setHasNafdac("");
    setNafdacNumber("");
    setLocation("");
    setImage(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fulfill Medication Request</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Response */}
          <div>
            <Label className="text-base font-medium">Do you have this medication?</Label>
            <RadioGroup value={response} onValueChange={(value: "yes" | "no") => setResponse(value)} className="mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="yes" />
                <Label htmlFor="yes">Yes, I have the medication</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="no" />
                <Label htmlFor="no">No, I don't have it</Label>
              </div>
            </RadioGroup>
          </div>

          {response === "yes" && (
            <div className="space-y-4 border-t pt-4">
              {/* Price */}
              <div>
                <Label htmlFor="price">Price (₦)</Label>
                <Input
                  id="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Enter price"
                  required
                />
              </div>

              {/* Quantity */}
              <div>
                <Label htmlFor="quantity">Quantity in Stock</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Enter quantity"
                  required
                />
              </div>

              {/* Expiration Date */}
              <div>
                <Label htmlFor="expDate">Expiration Date</Label>
                <Input
                  id="expDate"
                  type="date"
                  value={expDate}
                  onChange={(e) => setExpDate(e.target.value)}
                  required
                />
              </div>

              {/* NAFDAC */}
              <div>
                <Label className="text-base font-medium">NAFDAC Registered?</Label>
                <RadioGroup value={hasNafdac} onValueChange={(value: "yes" | "no") => setHasNafdac(value)} className="mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="nafdac-yes" />
                    <Label htmlFor="nafdac-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="nafdac-no" />
                    <Label htmlFor="nafdac-no">No</Label>
                  </div>
                </RadioGroup>
                
                {hasNafdac === "yes" && (
                  <div className="mt-2">
                    <Label htmlFor="nafdacNumber">NAFDAC Number</Label>
                    <Input
                      id="nafdacNumber"
                      value={nafdacNumber}
                      onChange={(e) => setNafdacNumber(e.target.value)}
                      placeholder="Enter NAFDAC number"
                      required
                    />
                  </div>
                )}
              </div>

              {/* Picture */}
              <div>
                <Label htmlFor="image">Picture of Medication</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files?.[0] || null)}
                  className="mt-1"
                />
              </div>

              {/* Location */}
              <div>
                <Label htmlFor="location">Your Location</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter your location"
                  required
                />
              </div>
            </div>
          )}

          {response === "no" && (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-600">Thank you for your response. We appreciate your time.</p>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={!response}>
            Submit Response
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
