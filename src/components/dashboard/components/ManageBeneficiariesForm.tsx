import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { API_BASE_URL } from "@/lib/api"

export const ManageBeneficiariesForm = () => {
  const [beneficiaryName, setBeneficiaryName] = useState("")
  const [beneficiaryEmail, setBeneficiaryEmail] = useState("")
  const [beneficiaryPhone, setBeneficiaryPhone] = useState("")
  const [beneficiaryMedication, setBeneficiaryMedication] = useState("")
  const [beneficiaryLocation, setBeneficiaryLocation] = useState("")
  const base = `${API_BASE_URL}/beneficiaries`

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const name = beneficiaryName.trim()
    const email = beneficiaryEmail.trim().toLowerCase()
    const phone = beneficiaryPhone.trim()
    const medication = beneficiaryMedication.trim()
    const location = beneficiaryLocation.trim()

    if (!name || !email || !phone || !medication || !location) {
      toast.error("Please fill in all required fields")
      return
    }

    if (!emailRegex.test(email)) {
      toast.error("Enter a valid email address")
      return
    }

    const token = localStorage.getItem("auth_token")
    if (!token) {
      toast.error("No authentication token found. Please log in again.")
      return
    }

    try {
      const payload = {
        name,
        email,
        phone,
        medicationNeeds: medication,
        location
      }

      console.log("sending payload", payload)

      const response = await fetch(base, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      const text = await response.text()
      console.log("raw response", text)
      const data = text ? JSON.parse(text) : {}

      if (response.ok) {
        toast.success("Beneficiary added successfully!")
        setBeneficiaryName("")
        setBeneficiaryEmail("")
        setBeneficiaryPhone("")
        setBeneficiaryMedication("")
        setBeneficiaryLocation("")
      } else {
        toast.error(`Failed to add beneficiary: ${data.message || "Unknown error"}`)
      }
    } catch (error) {
      console.error("Error:", error)
      toast.error("An error occurred. Please try again later.")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Beneficiary</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="beneficiaryName">Name of Beneficiary *</Label>
            <Input
              id="beneficiaryName"
              value={beneficiaryName}
              onChange={(e) => setBeneficiaryName(e.target.value)}
              placeholder="Enter beneficiary name"
              required
            />
          </div>

          <div>
            <Label htmlFor="beneficiaryEmail">Beneficiary Contact Email *</Label>
            <Input
              id="beneficiaryEmail"
              type="email"
              value={beneficiaryEmail}
              onChange={(e) => setBeneficiaryEmail(e.target.value)}
              placeholder="Enter email address"
              required
            />
          </div>

          <div>
            <Label htmlFor="beneficiaryPhone">Beneficiary Contact Phone *</Label>
            <Input
              id="beneficiaryPhone"
              value={beneficiaryPhone}
              onChange={(e) => setBeneficiaryPhone(e.target.value)}
              placeholder="Enter phone number"
              required
            />
          </div>

          <div>
            <Label htmlFor="beneficiaryMedication">Beneficiary Medication *</Label>
            <Input
              id="beneficiaryMedication"
              value={beneficiaryMedication}
              onChange={(e) => setBeneficiaryMedication(e.target.value)}
              placeholder="Enter medication details"
              required
            />
          </div>

          <div>
            <Label htmlFor="beneficiaryLocation">Beneficiary Location *</Label>
            <Input
              id="beneficiaryLocation"
              value={beneficiaryLocation}
              onChange={(e) => setBeneficiaryLocation(e.target.value)}
              placeholder="Enter location"
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Add Beneficiary
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
