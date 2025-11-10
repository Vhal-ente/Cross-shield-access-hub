import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { API_BASE_URL } from "@/lib/api"

type Props = {
  beneficiaryId?: number | null
}

type MedicationItem = {
  id: string
  name: string
  quantity: number
}

export const RequestMedicationForm = ({ beneficiaryId = null }: Props) => {
  const [items, setItems] = useState<MedicationItem[]>([])
  const [medicationName, setMedicationName] = useState("")
  const [quantity, setQuantity] = useState("")
  const [urgency, setUrgency] = useState<"normal" | "urgent" | "emergency" | "">("")
  const [notes, setNotes] = useState("")
  const base = `${API_BASE_URL}/medication-requests`

  const addItem = () => {
    const name = medicationName.trim()
    const qty = Number(quantity)

    if (!name) {
      toast.error("Enter medication name")
      return
    }

    if (isNaN(qty) || qty <= 0) {
      toast.error("Enter a valid quantity")
      return
    }

    const newItem: MedicationItem = {
      id: String(Date.now()) + Math.random().toString(36).slice(2, 7),
      name,
      quantity: qty,
    }

    setItems((s) => [...s, newItem])
    setMedicationName("")
    setQuantity("")
  }

  const removeItem = (id: string) => {
    setItems((s) => s.filter((it) => it.id !== id))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (items.length === 0) {
      toast.error("Add at least one medication")
      return
    }

    const lvl = urgency || "normal"
    const allowedUrgency = ["normal", "urgent", "emergency"]
    const urgencyValue = allowedUrgency.includes(lvl) ? (lvl as "normal" | "urgent" | "emergency") : "normal"

    const token = localStorage.getItem("auth_token")
    if (!token) {
      toast.error("No authentication token found. Please log in again.")
      return
    }

    try {
      const payload = {
        medications: items.map((it) => ({ name: it.name, quantity: it.quantity, unit: "packs" })),
        urgency: urgencyValue,
        notes: notes.trim() || null,
        beneficiaryId: beneficiaryId,
        prescriptionImages: [],
      }

      console.log("sending medication request", payload)

      const response = await fetch(base, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()
      console.log("medication request response", data)

      if (response.ok) {
        toast.success("Medication request submitted successfully!")
        setItems([])
        setMedicationName("")
        setQuantity("")
        setUrgency("")
        setNotes("")
      } else {
        toast.error(`Failed to submit request: ${data.message || "Unknown error"}`)
      }
    } catch (error) {
      console.error("Error submitting medication request", error)
      toast.error("An error occurred. Please try again later.")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Request Medication for Myself</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-12 gap-2 items-end">
            <div className="col-span-7">
              <Label htmlFor="medicationName">Medication Name</Label>
              <Input
                id="medicationName"
                value={medicationName}
                onChange={(e) => setMedicationName(e.target.value)}
                placeholder="Enter medication name"
              />
            </div>

            <div className="col-span-3 relative">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="0"
                className="pr-14"
              />
              <span className="absolute right-3 top-9 text-sm text-gray-400">packs</span>
            </div>

            <div className="col-span-2">
              <Button type="button" onClick={addItem} className="w-full mt-6">
                Add
              </Button>
            </div>
          </div>

          {items.length > 0 && (
            <div>
              <Label>Medications</Label>
              <ul className="space-y-2 mt-2">
                {items.map((it) => (
                  <li key={it.id} className="flex items-center justify-between border rounded p-2">
                    <div>
                      <div className="font-medium">{it.name}</div>
                      <div className="text-sm text-gray-500">{it.quantity} packs</div>
                    </div>
                    <div>
                      <Button type="button" onClick={() => removeItem(it.id)}>
                        Remove
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <Label htmlFor="urgency">Urgency Level</Label>
            <div>
              <select
                id="urgency"
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as "normal" | "urgent" | "emergency" | "")}
                className="w-full rounded-md border px-3 py-2"
              >
                <option value="">Select urgency</option>
                <option value="normal">Normal</option>
                <option value="urgent">Urgent</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>
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
  )
}

export default RequestMedicationForm
