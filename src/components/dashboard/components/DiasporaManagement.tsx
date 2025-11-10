import React, { useCallback, useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { API_BASE_URL } from "@/lib/api"
import { toast } from "sonner"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import {
  AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle
} from "@/components/ui/alert-dialog"

type Diaspora = {
  id: number
  fullName: string
  email: string
  phone?: string | null
  location?: string | null
  status?: string
  createdAt?: string
}

type Beneficiary = {
  id: number
  diasporaId: number
  name: string
  phone: string
  email: string
  location: string
  status: string
  // referred?: boolean
  createdAt?: string
}

export default function DiasporaDirectory() {
  const [diasporas, setDiasporas] = useState<Diaspora[]>([])
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([])
  const [loading, setLoading] = useState(true)
  const [reloading, setReloading] = useState(false)
  const [selected, setSelected] = useState<Diaspora | null>(null)
  const [open, setOpen] = useState(false)

  const DIASPORAS_URL = `${API_BASE_URL}/users?role=diaspora`
  const BENEFICIARIES_URL = `${API_BASE_URL}/beneficiaries`

  const headers = () => {
    const token = localStorage.getItem("auth_token")
    return { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
  }

  const fetchDiasporas = useCallback(async () => {
    const res = await fetch(DIASPORAS_URL, { headers: headers() })
    if (!res.ok) throw new Error(`Diasporas HTTP ${res.status}`)
    const data = await res.json()
    const arr = (data.users || data.data || []) as any[]
    setDiasporas(
      arr.map(u => ({
        id: u.id,
        fullName: u.fullName || u.name || "N/A",
        email: u.email,
        phone: u.phone || "N/A",
        location: u.location || "N/A",
        status: u.status || "active",
        createdAt: u.createdAt || u.created_at
      }))
    )
  }, [DIASPORAS_URL])

  const fetchBeneficiaries = useCallback(async () => {
    const res = await fetch(BENEFICIARIES_URL, { headers: headers() })
    if (!res.ok) throw new Error(`Beneficiaries HTTP ${res.status}`)
    const data = await res.json()
    const arr = (data.beneficiaries || data.data || []) as any[]
    setBeneficiaries(
      arr.map(b => ({
        id: b.id,
        diasporaId: b.diasporaId ?? b.diaspora_id,
        name: b.name,
        phone: b.phone,
        email: b.email,
        location: b.location,
        status: b.status || "active",
        // referred: b.referred ?? false,
        createdAt: b.createdAt || b.created_at
      }))
    )
  }, [BENEFICIARIES_URL])

  const loadAll = useCallback(async () => {
    try {
      setLoading(true)
      await Promise.all([fetchDiasporas(), fetchBeneficiaries()])
    } catch (e: any) {
      toast.error(e?.message || "Failed to load data")
    } finally {
      setLoading(false)
    }
  }, [fetchDiasporas, fetchBeneficiaries])

  useEffect(() => {
    loadAll()
  }, [loadAll])

  const reload = useCallback(async () => {
    try {
      setReloading(true)
      await Promise.all([fetchDiasporas(), fetchBeneficiaries()])
      toast.success("Refreshed")
    } catch (e: any) {
      toast.error(e?.message || "Refresh failed")
    } finally {
      setReloading(false)
    }
  }, [fetchDiasporas, fetchBeneficiaries])

  const byDiaspora = useMemo(() => {
    const map = new Map<number, Beneficiary[]>()
    for (const b of beneficiaries) {
      const list = map.get(b.diasporaId) || []
      list.push(b)
      map.set(b.diasporaId, list)
    }
    return map
  }, [beneficiaries])

  const getStatus = (status: string) => {
    if (status === "active") return <Badge className="bg-green-100 text-green-800">Active</Badge>
    if (status === "inactive") return <Badge className="bg-red-100 text-red-800">Inactive</Badge>
    return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        Loading...
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold">All Diasporas ({diasporas.length})</h3>
        <Button variant="outline" size="sm" onClick={reload} disabled={reloading}>
          {reloading ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Diasporas Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-white z-10">
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead className="hidden md:table-cell">Phone</TableHead>
                  <TableHead className="hidden md:table-cell">Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Beneficiaries</TableHead>
                  <TableHead className="hidden md:table-cell">Joined</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {diasporas.map(d => {
                  const list = byDiaspora.get(d.id) || []
                  return (
                    <TableRow key={d.id}>
                      <TableCell>#{d.id}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{d.fullName}</span>
                          <span className="md:hidden text-xs text-neutral-500">{d.email}</span>
                          <span className="md:hidden text-xs text-neutral-500">{d.phone}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{d.email}</TableCell>
                      <TableCell className="hidden md:table-cell">{d.phone || "N/A"}</TableCell>
                      <TableCell className="hidden md:table-cell">{d.location || "N/A"}</TableCell>
                      <TableCell>{getStatus(d.status || "active")}</TableCell>
                      <TableCell>{list.length}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {d.createdAt ? new Date(d.createdAt).toLocaleDateString() : "N/A"}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelected(d)
                            setOpen(true)
                          }}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
                {!diasporas.length && (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-sm text-neutral-500 py-6">
                      No diasporas
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {selected && (
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogContent className="w-[95vw] max-w-5xl p-0">
            <AlertDialogHeader className="px-6 pt-6">
              <AlertDialogTitle>Diaspora Details</AlertDialogTitle>
            </AlertDialogHeader>

            <div className="px-6 pb-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-neutral-500">Name</div>
                  <div className="font-medium">{selected.fullName}</div>
                </div>
                <div>
                  <div className="text-sm text-neutral-500">Email</div>
                  <div className="font-medium break-all">{selected.email}</div>
                </div>
                <div>
                  <div className="text-sm text-neutral-500">Phone</div>
                  <div className="font-medium">{selected.phone || "N/A"}</div>
                </div>
                <div>
                  <div className="text-sm text-neutral-500">Location</div>
                  <div className="font-medium">{selected.location || "N/A"}</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-sm text-neutral-500">Status</div>
                  {getStatus(selected.status || "active")}
                </div>
                <div>
                  <div className="text-sm text-neutral-500">Joined</div>
                  <div className="font-medium">
                    {selected.createdAt ? new Date(selected.createdAt).toLocaleDateString() : "N/A"}
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6">
              <div className="text-md font-semibold mb-2">Beneficiaries</div>

              {/* Table on md+ */}
              <div className="hidden md:block">
                <div className="overflow-auto max-h-[50vh] rounded-md border">
                  <Table>
                    <TableHeader className="sticky top-0 bg-white z-10">
                      <TableRow>
                        <TableHead>Beneficiary ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Status</TableHead>
                        {/* <TableHead>Referred</TableHead> */}
                        <TableHead>Created</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {beneficiaries
                        .filter(b => b.diasporaId === selected.id)
                        .map(b => (
                          <TableRow key={b.id}>
                            <TableCell>#{b.id}</TableCell>
                            <TableCell>{b.name}</TableCell>
                            <TableCell className="break-all">{b.email}</TableCell>
                            <TableCell>{b.phone}</TableCell>
                            <TableCell>{b.location}</TableCell>
                            <TableCell>{getStatus(b.status)}</TableCell>
                            {/* <TableCell>
                              {b.referred ? (
                                <Badge className="bg-blue-100 text-blue-800">Yes</Badge>
                              ) : (
                                <Badge className="bg-gray-100 text-gray-800">No</Badge>
                              )}
                            </TableCell> */}
                            <TableCell>
                              {b.createdAt ? new Date(b.createdAt).toLocaleDateString() : "N/A"}
                            </TableCell>
                          </TableRow>
                        ))}
                      {!beneficiaries.some(b => b.diasporaId === selected.id) && (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center text-sm text-neutral-500 py-6">
                            No beneficiaries
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Cards on small screens */}
              <div className="md:hidden space-y-3">
                {beneficiaries.filter(b => b.diasporaId === selected.id).map(b => (
                  <div key={b.id} className="rounded-lg border p-3">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{b.name}</div>
                      {getStatus(b.status)}
                    </div>
                    <div className="mt-1 text-sm">
                      <div className="break-all">{b.email}</div>
                      <div>{b.phone}</div>
                      <div>{b.location}</div>
                      {/* <div className="flex items-center gap-2 mt-1">
                        <span className="text-neutral-500">Referred</span>
                        {b.referred ? (
                          <Badge className="bg-blue-100 text-blue-800">Yes</Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-800">No</Badge>
                        )}
                      </div> */}
                      <div className="text-neutral-500">
                        {b.createdAt ? new Date(b.createdAt).toLocaleDateString() : "N/A"}
                      </div>
                    </div>
                  </div>
                ))}
                {!beneficiaries.some(b => b.diasporaId === selected.id) && (
                  <div className="rounded-lg border p-3 text-sm text-neutral-500">No beneficiaries</div>
                )}
              </div>
            </div>

            <AlertDialogFooter className="px-6 py-4">
              <AlertDialogCancel>Close</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  )
}
