
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export const SourceDrugForm = () => {
  const [medicationName, setMedicationName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [urgency, setUrgency] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!medicationName || !quantity) {
      toast.error("Please fill in required fields");
      return;
    }

    toast.success("Drug sourcing request submitted successfully!");
    
    // Reset form
    setMedicationName("");
    setQuantity("");
    setUrgency("");
    setNotes("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Source for a Drug</CardTitle>
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

          <div>
            <Label htmlFor="quantity">Quantity Needed *</Label>
            <Input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter quantity needed"
              required
            />
          </div>

          <div>
            <Label htmlFor="urgency">Urgency Level</Label>
            <Input
              id="urgency"
              value={urgency}
              onChange={(e) => setUrgency(e.target.value)}
              placeholder="e.g., Urgent, Normal"
            />
          </div>

          <div>
            <Label htmlFor="notes">Additional Notes</Label>
            <Input
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional requirements"
            />
          </div>

          <Button type="submit" className="w-full">
            Submit Request
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
