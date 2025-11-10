import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { API_BASE_URL } from "@/lib/api"

type MedDetail = { name: string; quantity: number }

type RequestItem = {
  id: number
  type: string
  medication: string
  medicationsDetail?: MedDetail[]
  medications?: any
  notes?: string | null
  status: string
  createdAt: string
  urgency: string
  fulfilledBy?: string | null
}

export const MyRequestsHistory = () => {
  const [requests, setRequests] = useState<RequestItem[]>([])
  const [loading, setLoading] = useState(false)
  const [viewing, setViewing] = useState<RequestItem | null>(null)
  const [confirmCancelId, setConfirmCancelId] = useState<number | null>(null)
  const base = `${API_BASE_URL}/medication-requests`

  useEffect(() => {
    fetchRequests()
  }, [])

  const safeParse = (v: any) => {
    if (!v) return []
    if (Array.isArray(v)) return v
    if (typeof v === "string") {
      try { return JSON.parse(v) } catch { return [] }
    }
    return []
  }

  const extractQuantity = (m: any): number => {
    if (!m) return 0
    const asNumber = (input: any) => {
      if (input == null) return NaN
      const s = String(input)
      const match = s.match(/(\d+(?:\.\d+)?)/)
      if (match) return Number(match[1])
      return NaN
    }

    if (typeof m === "number") return m
    if (typeof m === "string") {
      const n = asNumber(m)
      if (!isNaN(n)) return n
      return 0
    }
    if (typeof m === "object") {
      const keys = ["quantity", "qty", "count", "amount", "q"]
      for (const k of keys) {
        if (m[k] != null) {
          const n = asNumber(m[k])
          if (!isNaN(n)) return n
        }
      }
      for (const v of Object.values(m)) {
        const n = asNumber(v)
        if (!isNaN(n)) return n
      }
    }
    return 0
  }

  const parseMedications = (raw: any): MedDetail[] => {
    if (!raw) return []

    if (Array.isArray(raw)) {
      return raw.map((it: any) => ({ name: it?.name || it?.medication || it?.title || "Unknown", quantity: extractQuantity(it) }))
    }

    if (typeof raw === "string") {
      try {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) {
          return parsed.map((it: any) => ({ name: it?.name || it?.medication || it?.title || "Unknown", quantity: extractQuantity(it) }))
        }
      } catch {
        // not JSON
      }

      const parts = raw.split(/[;,|]/).map((p) => p.trim()).filter(Boolean)
      return parts.map((part) => {
        const paren = part.match(/^(.+?)\s*\(\s*(\d+(?:\.\d+)?)\s*\)\s*$/)
        if (paren) return { name: paren[1].trim(), quantity: Number(paren[2]) }
        const inline = part.match(/^(.+?)\s+(\d+(?:\.\d+)?)\s*$/)
        if (inline) return { name: inline[1].trim(), quantity: Number(inline[2]) }
        return { name: part, quantity: 0 }
      })
    }

    if (typeof raw === "object") {
      if (raw.name || raw.medication || raw.title) {
        return [{ name: raw.name || raw.medication || raw.title || "Unknown", quantity: extractQuantity(raw) }]
      }
    }

    return []
  }

  const fetchRequests = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("auth_token")
      if (!token) {
        toast.error("Authentication required")
        setLoading(false)
        return
      }

      const res = await fetch(base, { headers: { Authorization: `Bearer ${token}` } })
      if (!res.ok) throw new Error("Failed to load requests")
      const data = await res.json()
      const items = Array.isArray(data) ? data : data.requests || []

      const mapped: RequestItem[] = items.map((r: any) => {
        const rawMed = r.medications ?? r.medications_detail ?? r.medication ?? r.medications_list
        const meds = parseMedications(rawMed)
        const medicationNames = meds.length > 0 ? meds.map((m) => m.name).join(", ") : (r.medication || "")

        return {
          id: r.id,
          type: r.type || "Medication Request",
          medication: medicationNames,
          medicationsDetail: meds,
          medications: rawMed,
          notes: r.notes ?? null,
          status: r.status || "pending",
          createdAt: r.createdAt || r.created_at || new Date().toISOString(),
          urgency: (r.urgency || "normal").toString(),
          fulfilledBy: r.fulfilledBy || r.fulfilled_by || r.assignedUser?.fullName || null,
        }
      })

      setRequests(mapped)
    } catch (err: any) {
      console.error("Error fetching requests", err)
      toast.error(err.message || "Failed to load requests")
    } finally {
      setLoading(false)
    }
  }

  const openView = (r: RequestItem) => {
    const raw = r.medications ?? r.medicationsDetail ?? r.medication
    const meds = parseMedications(raw)
    const medsNormalized = meds.map((m) => ({ name: m.name, quantity: Number(m.quantity) || 0 }))
    console.log("openView meds", { raw, meds, medsNormalized })
    setViewing({ ...r, medicationsDetail: medsNormalized })
  }
  const closeView = () => setViewing(null)

  const requestCancel = (id: number) => setConfirmCancelId(id)
  const closeCancel = () => setConfirmCancelId(null)

  const confirmCancel = async () => {
    if (!confirmCancelId) return
    try {
      const token = localStorage.getItem("auth_token")
      if (!token) {
        toast.error("Authentication required")
        return
      }

      const res = await fetch(`${base}/${confirmCancelId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: "cancelled" }),
      })

      if (!res.ok) throw new Error("Failed to cancel request")

      toast.success("Request cancelled")
      closeCancel()
      fetchRequests()
    } catch (err: any) {
      console.error("Error cancelling request", err)
      toast.error(err.message || "Failed to cancel")
    }
  }

  const exportCsv = () => {
    if (requests.length === 0) {
      toast.error("No requests to export")
      return
    }

    const headers = ["id", "type", "medication", "notes", "status", "urgency", "fulfilledBy", "date"]
    const rows = requests.map((r) => [r.id, r.type, `"${r.medication}"`, r.notes || "", r.status, r.urgency, r.fulfilledBy || "", r.createdAt])
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `my-requests-${new Date().toISOString()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">Pending</Badge>
      case "fulfilled":
        return <Badge variant="default">Fulfilled</Badge>
      case "in_progress":
        return <Badge variant="secondary">In Progress</Badge>
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency.toLowerCase()) {
      case "emergency":
        return <Badge className="bg-red-100 text-red-800">Emergency</Badge>
      case "urgent":
        return <Badge className="bg-orange-100 text-orange-800">Urgent</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">Normal</Badge>
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">My Request History</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportCsv}>
            Export History
          </Button>
          <Button variant="ghost" size="sm" onClick={fetchRequests}>
            Refresh
          </Button>
        </div>
      </div>

      {loading && <div>Loading...</div>}

      {requests.map((request) => (
        <Card key={request.id}>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium">{request.medication}</h4>
                  <Badge variant="outline" className="text-xs">
                    {request.type}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">Note: {request.notes || "No notes"}</p>
                <p className="text-sm text-gray-600">Date: {new Date(request.createdAt).toLocaleString()}</p>
                {request.medicationsDetail && request.medicationsDetail.length > 0 && (
                  <div className="text-sm text-gray-600">
                    {request.medicationsDetail.map((m) => (
                      <div key={m.name}>{m.name} — {m.quantity} packs</div>
                    ))}
                  </div>
                )}
                {request.fulfilledBy && <p className="text-sm text-gray-600">Fulfilled by: {request.fulfilledBy}</p>}
              </div>
              <div className="text-right space-y-2">
                {getUrgencyBadge(request.urgency)}
                <br />
                {getStatusBadge(request.status)}
                <div className="mt-2 space-x-2">
                  <Button size="sm" variant="outline" onClick={() => openView(request)}>
                    View Details
                  </Button>
                  {request.status === "pending" && (
                    <Button size="sm" variant="outline" onClick={() => requestCancel(request.id)}>
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {!loading && requests.length === 0 && <div>No requests found</div>}

      {/* View details modal */}
      {viewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-40" onClick={closeView} />
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full z-10 p-6">
            <h3 className="text-lg font-semibold">Request Details</h3>
            <p className="mt-2">Requested: {new Date(viewing.createdAt).toLocaleString()}</p>
            <p className="mt-2">Urgency: {viewing.urgency}</p>
            <p className="mt-2">Status: {viewing.status}</p>
            <div className="mt-4">
              <h4 className="font-medium">Medications</h4>
              <ul className="mt-2 space-y-2">
                {viewing.medicationsDetail && viewing.medicationsDetail.length > 0 ? (
                  viewing.medicationsDetail.map((m) => (
                    <li key={m.name} className="flex justify-between">
                      <span>{m.name}</span>
                      <span>{m.quantity} packs</span>
                    </li>
                  ))
                ) : (
                  <li>No medications listed</li>
                )}
              </ul>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="ghost" onClick={closeView}>Close</Button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm cancel modal */}
      {confirmCancelId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-40" onClick={closeCancel} />
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full z-10 p-6">
            <h3 className="text-lg font-semibold">Confirm Cancel</h3>
            <p className="mt-2">Are you sure you want to cancel this request?</p>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="ghost" onClick={closeCancel}>No</Button>
              <Button variant="destructive" onClick={confirmCancel}>Yes, cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyRequestsHistory
