import React, { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { toast } from "sonner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogAction
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog"

import { API_BASE_URL } from "@/lib/api"

type Row = {
  userId: number
  practitionerId: number | null
  name: string
  email: string
  phone: string
  location: string
  specialization: string
  licenseNumber: string
  status: "active" | "inactive" | "suspended"
  joinedDate: string
  raw: any
}

export default function HealthPractitionerManagement() {
  const [practitioners, setPractitioners] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Row | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  const [showAdd, setShowAdd] = useState(false)
  const [creating, setCreating] = useState(false)
  const [newPractitioner, setNewPractitioner] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    specialization: "",
    licenseNumber: "",
    status: "active" as "active" | "inactive" | "suspended",
  })

  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; practitionerId: number | null; fallbackUserId: number | null }>({ open: false, practitionerId: null, fallbackUserId: null })
  const [confirmSuspend, setConfirmSuspend] = useState<{ open: boolean; userId: number | null; nextStatus: "suspended" | "active" }>({ open: false, userId: null, nextStatus: "suspended" })

  // API endpoints
  const HP_LIST_URL = `${API_BASE_URL}/users?role=health_practitioner&include=healthPractitioner`
  const HP_ITEM_URL = (id: number) => `${API_BASE_URL}/health-practitioners/${id}`
  const USERS_ITEM_URL = (id: number) => `${API_BASE_URL}/users/${id}`
  const USERS_APPROVE_URL = (id: number) => `${API_BASE_URL}/users/${id}/approve`
  const USERS_SUSPEND_URL = (id: number) => `${API_BASE_URL}/users/${id}/suspend`

  const authHeaders = useMemo(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : ""
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token || ""}`,
    }
  }, [])

  useEffect(() => {
    fetchPractitioners()
  }, [])

  async function fetchPractitioners() {
    try {
      setLoading(true)
      const res = await fetch(HP_LIST_URL, { headers: authHeaders })
      if (!res.ok) throw new Error(`HTTP error ${res.status}`)
      const data = await res.json()

      // Accept either { practitioners: [...] } or { users: [...] }
      const arr = Array.isArray(data?.practitioners) ? data.practitioners : Array.isArray(data?.users) ? data.users : []

      const list: Row[] = arr.map((item: any) => {
        // Shape A, practitioner row with nested user
        if (item?.user) {
          const u = item.user
          return {
            userId: u.id,
            practitionerId: item.id ?? null,
            name: u.fullName || u.name || "N/A",
            email: u.email,
            phone: u.phone || "N/A",
            location: item.location || u.location || "N/A",
            status: item.status || u.status || "inactive",
            joinedDate: new Date(u.createdAt || u.created_at || Date.now()).toLocaleDateString(),
            specialization: item.specialization || "N/A",
            licenseNumber: item.licenseNumber || item.license_no || "N/A",
            raw: item,
          }
        }

        // Shape B, flattened user row
        const practitionerId =
          item.practitionerId ??
          item.healthPractitioner?.id ??
          null

        return {
          userId: item.id,
          practitionerId,
          name: item.fullName || item.name || "N/A",
          email: item.email,
          phone: item.phone || "N/A",
          location: item.location || "N/A",
          status: item.status || "inactive",
          joinedDate: new Date(item.createdAt || item.created_at || Date.now()).toLocaleDateString(),
          specialization: item.specialization || item.healthPractitioner?.specialization || "N/A",
          licenseNumber: item.licenseNumber || item.healthPractitioner?.licenseNumber || "N/A",
          raw: item,
        }
      })

      setPractitioners(list)
    } catch (e: any) {
      toast.error(e.message || "Failed to load health practitioners")
    } finally {
      setLoading(false)
    }
  }

  function getStatusBadge(status: Row["status"]) {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "suspended":
        return <Badge className="bg-yellow-100 text-yellow-800">Suspended</Badge>
      case "inactive":
        return <Badge className="bg-red-100 text-red-800">Inactive</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>
    }
  }

  async function handleCreate() {
    try {
      if (!newPractitioner.fullName || !newPractitioner.email) {
        toast.error("Full name and email are required")
        return
      }
      setCreating(true)

      const body = {
        fullName: newPractitioner.fullName,
        email: newPractitioner.email,
        phone: newPractitioner.phone || undefined,
        location: newPractitioner.location || undefined,
        specialization: newPractitioner.specialization || undefined,
        licenseNumber: newPractitioner.licenseNumber || undefined,
        status: newPractitioner.status || "active",
      }

      const res = await fetch(HP_LIST_URL, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const err = await safeJson(res)
        throw new Error(err?.message || `Create failed ${res.status}`)
      }

      toast.success("Health practitioner added")
      setShowAdd(false)
      setNewPractitioner({
        fullName: "",
        email: "",
        phone: "",
        location: "",
        specialization: "",
        licenseNumber: "",
        status: "active",
      })
      await fetchPractitioners()
    } catch (e: any) {
      toast.error(e.message || "Failed to add practitioner")
    } finally {
      setCreating(false)
    }
  }

  async function handleDelete(practitionerId: number | null, fallbackUserId: number | null) {
    try {
      if (practitionerId) {
        const res = await fetch(HP_ITEM_URL(practitionerId), {
          method: "DELETE",
          headers: authHeaders,
        })
        if (!res.ok) {
          const err = await safeJson(res)
          throw new Error(err?.message || `Delete failed ${res.status}`)
        }
      } else if (fallbackUserId) {
        const res = await fetch(USERS_ITEM_URL(fallbackUserId), {
          method: "DELETE",
          headers: authHeaders,
        })
        if (!res.ok) {
          const err = await safeJson(res)
          throw new Error(err?.message || `Delete failed ${res.status}`)
        }
      } else {
        throw new Error("Missing identifiers")
      }

      toast.success("Deleted")
      setConfirmDelete({ open: false, practitionerId: null, fallbackUserId: null })
      setPractitioners((prev) =>
        prev.filter((p) => p.practitionerId !== practitionerId && p.userId !== fallbackUserId)
      )
    } catch (e: any) {
      toast.error(e.message || "Failed to delete")
    }
  }

  async function handleSuspend(userId: number, nextStatus: "suspended" | "active") {
    try {
      const url = nextStatus === "suspended" ? USERS_SUSPEND_URL(userId) : USERS_APPROVE_URL(userId)
      const res = await fetch(url, {
        method: "POST",
        headers: authHeaders,
      })
      if (!res.ok) {
        const err = await safeJson(res)
        throw new Error(err?.message || `Update failed ${res.status}`)
      }
      toast.success(nextStatus === "suspended" ? "User suspended" : "User activated")
      setConfirmSuspend({ open: false, userId: null, nextStatus: "suspended" })
      setPractitioners((prev) =>
        prev.map((p) => (p.userId === userId ? { ...p, status: nextStatus } : p))
      )
    } catch (e: any) {
      toast.error(e.message || "Failed to update status")
    }
  }

  function openDetails(p: Row) {
    setSelected(p)
    setShowDetails(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        Loading health practitioners...
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold">
          Health Practitioners ({practitioners.length})
        </h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchPractitioners}>
            Refresh
          </Button>
          <Button size="sm" onClick={() => setShowAdd(true)}>
            Add Practitioner
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Practitioners Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User ID</TableHead>
                  {/* <TableHead>Profile ID</TableHead> */}
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Specialization</TableHead>
                  <TableHead>License</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {practitioners.map((p) => {
                  const nextStatus = p.status === "suspended" ? "active" : "suspended"
                  return (
                    <TableRow key={`${p.userId}:${p.practitionerId ?? "none"}`}>
                      <TableCell>#{p.userId}</TableCell>
                      {/* <TableCell>{p.practitionerId ?? "—"}</TableCell> */}
                      <TableCell className="max-w-[220px] truncate" title={p.name}>{p.name}</TableCell>
                      <TableCell className="max-w-[220px] truncate" title={p.email}>{p.email}</TableCell>
                      <TableCell>{p.phone}</TableCell>
                      <TableCell className="max-w-[180px] truncate" title={p.location}>{p.location}</TableCell>
                      <TableCell>{p.specialization}</TableCell>
                      <TableCell>{p.licenseNumber}</TableCell>
                      <TableCell>{getStatusBadge(p.status)}</TableCell>
                      <TableCell>{p.joinedDate}</TableCell>
                      <TableCell className="space-x-2 whitespace-nowrap">
                        <Button size="sm" variant="outline" onClick={() => openDetails(p)}>
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setConfirmSuspend({ open: true, userId: p.userId, nextStatus })}
                        >
                          {p.status === "suspended" ? "Activate" : "Suspend"}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setConfirmDelete({ open: true, practitionerId: p.practitionerId, fallbackUserId: p.userId })}
                          disabled={!p.practitionerId && !p.userId}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {selected && (
        <AlertDialog open={showDetails} onOpenChange={setShowDetails}>
          <AlertDialogContent className="max-w-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Health Practitioner Details</AlertDialogTitle>
            </AlertDialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="font-semibold">Name</div>
                  <p>{selected.name}</p>
                </div>
                <div>
                  <div className="font-semibold">Email</div>
                  <p>{selected.email}</p>
                </div>
                <div>
                  <div className="font-semibold">Phone</div>
                  <p>{selected.phone}</p>
                </div>
                <div>
                  <div className="font-semibold">Location</div>
                  <p>{selected.location}</p>
                </div>
                <div>
                  <div className="font-semibold">Specialization</div>
                  <p>{selected.specialization}</p>
                </div>
                <div>
                  <div className="font-semibold">License Number</div>
                  <p>{selected.licenseNumber}</p>
                </div>
                <div>
                  <div className="font-semibold">Status</div>
                  {getStatusBadge(selected.status)}
                </div>
                <div>
                  <div className="font-semibold">Joined</div>
                  <p>{selected.joinedDate}</p>
                </div>
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Close</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Health Practitioner</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={newPractitioner.fullName}
                onChange={(e) => setNewPractitioner((s) => ({ ...s, fullName: e.target.value }))}
                placeholder="Jane Doe"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newPractitioner.email}
                onChange={(e) => setNewPractitioner((s) => ({ ...s, email: e.target.value }))}
                placeholder="jane@clinic.com"
              />
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={newPractitioner.phone}
                  onChange={(e) => setNewPractitioner((s) => ({ ...s, phone: e.target.value }))}
                  placeholder="+234..."
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={newPractitioner.location}
                  onChange={(e) => setNewPractitioner((s) => ({ ...s, location: e.target.value }))}
                  placeholder="City, State"
                />
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="specialization">Specialization</Label>
                <Input
                  id="specialization"
                  value={newPractitioner.specialization}
                  onChange={(e) => setNewPractitioner((s) => ({ ...s, specialization: e.target.value }))}
                  placeholder="Cardiology"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="license">License Number</Label>
                <Input
                  id="license"
                  value={newPractitioner.licenseNumber}
                  onChange={(e) => setNewPractitioner((s) => ({ ...s, licenseNumber: e.target.value }))}
                  placeholder="REG-XXXXX"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select
                value={newPractitioner.status}
                onValueChange={(v) => setNewPractitioner((s) => ({ ...s, status: v as Row["status"] }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pick status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={creating}>
              {creating ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={confirmDelete.open}
        onOpenChange={(open) => setConfirmDelete((s) => ({ ...s, open }))}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete health practitioner</AlertDialogTitle>
          </AlertDialogHeader>
          <p>This action removes the user permanently.</p>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                handleDelete(confirmDelete.practitionerId, confirmDelete.fallbackUserId)
              }
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={confirmSuspend.open}
        onOpenChange={(open) => setConfirmSuspend((s) => ({ ...s, open }))}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmSuspend.nextStatus === "suspended" ? "Suspend user login" : "Activate user login"}
            </AlertDialogTitle>
          </AlertDialogHeader>
          <p>
            {confirmSuspend.nextStatus === "suspended"
              ? "User will be unable to log in."
              : "User will regain access."}
          </p>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                confirmSuspend.userId &&
                handleSuspend(confirmSuspend.userId, confirmSuspend.nextStatus)
              }
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

async function safeJson(res: Response) {
  try {
    return await res.json()
  } catch {
    return null
  }
}
