import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "@/lib/api";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";

export default function SupplierManagement() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const SUPPLIERS_URL = `${API_BASE_URL}/users?role=supplier`;

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("auth_token");
      const response = await fetch(SUPPLIERS_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error(`HTTP error! ${response.status}`);

      const data = await response.json();

      const formatted = data.users.map((user) => ({
        id: user.id,
        name: user.fullName || user.businessName || "N/A",
        email: user.email,
        phone: user.phone || "N/A",
        location: user.location || "N/A",
        status: user.status || "N/A",
        joinedDate: new Date(user.createdAt || user.created_at).toLocaleDateString(),
        businessName: user.businessName || "N/A"
      }));

      setSuppliers(formatted);
    } catch (err) {
      toast.error(err.message || "Failed to load suppliers");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "inactive":
        return <Badge className="bg-red-100 text-red-800">Inactive</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        Loading suppliers...
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">All Suppliers ({suppliers.length})</h3>
        <Button variant="outline" size="sm" onClick={fetchSuppliers}>
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Suppliers Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Supplier ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {suppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell>#{supplier.id}</TableCell>
                    <TableCell>{supplier.name}</TableCell>
                    <TableCell>{supplier.email}</TableCell>
                    <TableCell>{supplier.phone}</TableCell>
                    <TableCell>{supplier.location}</TableCell>
                    <TableCell>{getStatusBadge(supplier.status)}</TableCell>
                    <TableCell>{supplier.joinedDate}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedSupplier(supplier);
                          setShowDetails(true);
                        }}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {selectedSupplier && (
        <AlertDialog open={showDetails} onOpenChange={setShowDetails}>
          <AlertDialogContent className="max-w-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Supplier Details</AlertDialogTitle>
            </AlertDialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold">Name:</label>
                  <p>{selectedSupplier.name}</p>
                </div>
                <div>
                  <label className="font-semibold">Business Name:</label>
                  <p>{selectedSupplier.businessName}</p>
                </div>
                <div>
                  <label className="font-semibold">Email:</label>
                  <p>{selectedSupplier.email}</p>
                </div>
                <div>
                  <label className="font-semibold">Phone:</label>
                  <p>{selectedSupplier.phone}</p>
                </div>
                <div>
                  <label className="font-semibold">Location:</label>
                  <p>{selectedSupplier.location}</p>
                </div>
                <div>
                  <label className="font-semibold">Status:</label>
                  {getStatusBadge(selectedSupplier.status)}
                </div>
                <div>
                  <label className="font-semibold">Joined:</label>
                  <p>{selectedSupplier.joinedDate}</p>
                </div>
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Close</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
