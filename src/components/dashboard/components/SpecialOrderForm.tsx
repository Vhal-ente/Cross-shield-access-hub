
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export const SpecialOrderForm = () => {
  const [medicationName, setMedicationName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [specificBrand, setSpecificBrand] = useState("");
  const [dosage, setDosage] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!medicationName || !quantity || !dosage) {
      toast.error("Please fill in all required fields");
      return;
    }

    toast.success("Special order submitted successfully!");
    
    // Reset form
    setMedicationName("");
    setQuantity("");
    setSpecificBrand("");
    setDosage("");
    setMaxBudget("");
    setDeadline("");
    setSpecialInstructions("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Place Special Order</CardTitle>
        <p className="text-sm text-gray-600">For hard-to-find medications or specific requirements</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="medicationName">Medication Name *</Label>
            <Input
              id="medicationName"
              value={medicationName}
              onChange={(e) => setMedicationName(e.target.value)}
              placeholder="Enter medication name"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quantity">Quantity Needed *</Label>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Enter quantity"
                required
              />
            </div>

            <div>
              <Label htmlFor="dosage">Dosage *</Label>
              <Input
                id="dosage"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                placeholder="e.g., 500mg, 10ml"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="specificBrand">Specific Brand (Optional)</Label>
            <Input
              id="specificBrand"
              value={specificBrand}
              onChange={(e) => setSpecificBrand(e.target.value)}
              placeholder="Enter preferred brand if any"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="maxBudget">Maximum Budget (Optional)</Label>
              <Input
                id="maxBudget"
                type="number"
                value={maxBudget}
                onChange={(e) => setMaxBudget(e.target.value)}
                placeholder="Enter max budget"
              />
            </div>

            <div>
              <Label htmlFor="deadline">Needed By (Optional)</Label>
              <Input
                id="deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="specialInstructions">Special Instructions</Label>
            <Textarea
              id="specialInstructions"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="Any special requirements, delivery preferences, or additional notes"
            />
          </div>

          <Button type="submit" className="w-full">
            Place Special Order
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
