import React, { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { API_BASE_URL } from "@/lib/api"

type Beneficiary = {
  id: number | string
  name: string
  phone: string
  email?: string
  medicationNeeds: string
  location: string
  status: "active" | "inactive"
}

export default function BeneficiariesList() {
  const [items, setItems] = useState<Beneficiary[]>([])
  const [page, setPage] = useState(1)
  const [limit] = useState(5)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState<number | null>(null)

  const [editing, setEditing] = useState<Beneficiary | null>(null)
  const [saving, setSaving] = useState(false)
  const base = `${API_BASE_URL}/beneficiaries`

  useEffect(() => {
    let mounted = true
    async function fetchBeneficiaries() {
      setLoading(true)
      setError(null)
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null
        const url = `${base}?page=${page}&limit=${limit}`
        const res = await fetch(url, {
          headers: {
            Accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          credentials: "include",
        })
        if (!res.ok) throw new Error(`Fetch failed ${res.status}`)
        const json = await res.json()
        console.log("API response", json)

        let data: Beneficiary[] = []
        let totalCount: number | null = null

        if (Array.isArray(json.beneficiaries)) {
          data = json.beneficiaries
          totalCount = json.total ?? data.length
        } else if (Array.isArray(json.data)) {
          data = json.data
          totalCount = json.meta?.total ?? json.total ?? data.length
        } else if (Array.isArray(json.results)) {
          data = json.results
          totalCount = json.count ?? data.length
        } else {
          console.warn("Unexpected response shape for beneficiaries", json)
        }

        if (mounted) {
          setItems(data)
          setTotal(totalCount)
        }
      } catch (err: any) {
        if (mounted) setError(err.message || "Network error")
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchBeneficiaries()
    return () => {
      mounted = false
    }
  }, [base, page, limit])

  function openEdit(b: Beneficiary) {
    setEditing({ ...b })
  }

  function closeEdit() {
    setEditing(null)
  }

  async function saveEdit() {
    if (!editing) return
    setSaving(true)
    setError(null)
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null
      const res = await fetch(`${base}/${editing.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
        body: JSON.stringify({
          name: editing.name,
          phone: editing.phone,
          email: editing.email,
          location: editing.location,
          medicationNeeds: editing.medicationNeeds,
          status: editing.status,
        }),
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(`Save failed ${res.status}: ${text}`)
      }

      const json = await res.json()
      const updated: Beneficiary = json.beneficiary ?? json.data ?? json

      // merge update into items
      setItems(prev => prev.map(p => (String(p.id) === String(updated.id) ? { ...p, ...updated } : p)))
      closeEdit()
    } catch (err: any) {
      setError(err.message || "Save failed")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div>Loading beneficiaries</div>
  if (error) return <div>Error: {error}</div>
  if (!loading && items.length === 0) return <div>No beneficiaries found</div>

  const totalPages = total ? Math.max(1, Math.ceil(total / limit)) : 1

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">My Beneficiaries</h3>

      {items.map(b => (
        <Card key={b.id}>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <h4 className="font-medium">{b.name}</h4>
                <p className="text-sm text-muted-foreground">Phone: {b.phone}</p>
                <p className="text-sm text-muted-foreground">Medication: {b.medicationNeeds}</p>
                <p className="text-sm text-muted-foreground">Location: {b.location}</p>
              </div>
              <div className="text-right space-y-2">
                <Badge variant={b.status === "active" ? "default" : "secondary"}>{b.status}</Badge>
                <div className="mt-2 space-x-2">
                  <Button size="sm" variant="outline" onClick={() => openEdit(b)}>
                    Edit
                  </Button>
                  <Button size="sm" onClick={() => console.log("request meds", b.id)}>
                    Request Meds
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-between items-center pt-4">
        <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))}>
          Previous
        </Button>

        <span className="text-sm">
          Page {page} of {totalPages}
        </span>

        <Button size="sm" variant="outline" disabled={page === totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>
          Next
        </Button>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-40" onClick={closeEdit} />

          <div className="bg-white rounded shadow-lg w-full max-w-lg z-10 p-6">
            <h4 className="text-lg font-semibold mb-4">Edit Beneficiary</h4>

            <div className="grid grid-cols-1 gap-3">
              <label className="block">
                <div className="text-sm mb-1">Name</div>
                <input
                  className="w-full border rounded p-2"
                  value={editing.name}
                  onChange={e => setEditing({ ...editing, name: e.target.value })}
                />
              </label>

              <label className="block">
                <div className="text-sm mb-1">Phone</div>
                <input
                  className="w-full border rounded p-2"
                  value={editing.phone}
                  onChange={e => setEditing({ ...editing, phone: e.target.value })}
                />
              </label>

              <label className="block">
                <div className="text-sm mb-1">Email</div>
                <input
                  className="w-full border rounded p-2"
                  value={editing.email || ""}
                  onChange={e => setEditing({ ...editing, email: e.target.value })}
                />
              </label>

              <label className="block">
                <div className="text-sm mb-1">Location</div>
                <input
                  className="w-full border rounded p-2"
                  value={editing.location}
                  onChange={e => setEditing({ ...editing, location: e.target.value })}
                />
              </label>

              <label className="block">
                <div className="text-sm mb-1">Medication Needs</div>
                <input
                  className="w-full border rounded p-2"
                  value={editing.medicationNeeds}
                  onChange={e => setEditing({ ...editing, medicationNeeds: e.target.value })}
                />
              </label>

              <label className="block">
                <div className="text-sm mb-1">Status</div>
                <select
                  className="w-full border rounded p-2"
                  value={editing.status}
                  onChange={e => setEditing({ ...editing, status: e.target.value as any })}
                >
                  <option value="active">active</option>
                  <option value="inactive">inactive</option>
                </select>
              </label>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button size="sm" variant="outline" onClick={closeEdit} disabled={saving}>
                Cancel
              </Button>
              <Button size="sm" onClick={saveEdit} disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </Button>
            </div>

            {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
          </div>
        </div>
      )}
    </div>
  )
}
