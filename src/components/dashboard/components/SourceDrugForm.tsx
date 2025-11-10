import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export type MedicationItem = {
  id: string
  name: string
  quantity: number
}

export const SourceDrugForm = () => {
  const [medicationName, setMedicationName] = useState("")
  const [quantity, setQuantity] = useState("")
  const [urgency, setUrgency] = useState("")
  const [notes, setNotes] = useState("")
  const [location, setLocation] = useState("")
  const [items, setItems] = useState<MedicationItem[]>([])

  // images for the entire request (separate input)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])

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

    // reset item inputs
    setMedicationName("")
    setQuantity("")
  }

  const removeItem = (id: string) => setItems((s) => s.filter((it) => it.id !== id))

  // handle images for the whole request, not per-item
  const handleImagesChange = (filesList?: FileList | null) => {
    if (!filesList) return

    const newFiles = Array.from(filesList)
    // combine with existing, prevent duplicates by name+size
    const combined = [...imageFiles]

    newFiles.forEach((file) => {
      const exists = combined.some((f) => f.name === file.name && f.size === file.size)
      if (!exists) combined.push(file)
    })

    // optional cap
    const maxFiles = 10
    const capped = combined.slice(0, maxFiles)

    setImageFiles(capped)

    // build previews
    const readers: Promise<string>[] = capped.map((file) =>
      new Promise((resolve) => {
        const r = new FileReader()
        r.onload = () => resolve(String(r.result ?? ""))
        r.readAsDataURL(file)
      })
    )

    Promise.all(readers).then((previews) => setImagePreviews(previews))
  }

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index))
    setImagePreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (items.length === 0) {
      // allow single-item submission via current inputs
      if (!medicationName || !quantity) {
        toast.error("Please add at least one medication or fill the fields")
        return
      }
    }

    // prepare payload here. For files you will need multipart/form-data when posting to the server.
    // Example payload creation shown below (commented out):
    // const form = new FormData()
    // form.append('urgency', urgency)
    // form.append('notes', notes)
    // form.append('items', JSON.stringify(items))
    // imageFiles.forEach((f) => form.append('images[]', f))

    toast.success("Drug sourcing request submitted successfully!")

    // Reset form
    setMedicationName("")
    setQuantity("")
    setUrgency("")
    setNotes("")
    setItems([])
    setImageFiles([])
    setImagePreviews([])
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Source for a Drug</CardTitle>
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

          {/* Separate image input for the entire request */}
          <div>
            <Label htmlFor="requestImages">Attach images (optional), you can add multiple</Label>
            <input
              id="requestImages"
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleImagesChange(e.target.files)}
              className="mt-1"
            />

            {imagePreviews.length > 0 && (
              <div className="mt-3 grid grid-cols-3 gap-2">
                {imagePreviews.map((src, idx) => (
                  <div key={idx} className="relative w-full h-24 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                    <img src={src} alt={`preview-${idx}`} className="object-cover w-full h-full" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 bg-white rounded px-1 text-xs"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
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
            <Label htmlFor="notes">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter Delivery Location"
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
  )
}
