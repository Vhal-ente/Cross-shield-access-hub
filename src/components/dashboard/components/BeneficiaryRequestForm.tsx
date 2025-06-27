
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export const BeneficiaryRequestForm = () => {
  const [medicationName, setMedicationName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [urgency, setUrgency] = useState("normal");
  const [medicalCondition, setMedicalCondition] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!medicationName || !quantity || !medicalCondition) {
      toast.error("Please fill in all required fields");
      return;
    }

    toast.success("Medication request submitted successfully!");
    
    // Reset form
    setMedicationName("");
    setQuantity("");
    setUrgency("normal");
    setMedicalCondition("");
    setNotes("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Request Medication</CardTitle>
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
              placeholder="Enter quantity"
              required
            />
          </div>

          <div>
            <Label htmlFor="urgency">Urgency Level *</Label>
            <select
              id="urgency"
              value={urgency}
              onChange={(e) => setUrgency(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              required
            >
              <option value="normal">Normal</option>
              <option value="urgent">Urgent</option>
              <option value="emergency">Emergency</option>
            </select>
          </div>

          <div>
            <Label htmlFor="medicalCondition">Medical Condition *</Label>
            <Input
              id="medicalCondition"
              value={medicalCondition}
              onChange={(e) => setMedicalCondition(e.target.value)}
              placeholder="Enter your medical condition"
              required
            />
          </div>

          <div>
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional information about your request"
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
