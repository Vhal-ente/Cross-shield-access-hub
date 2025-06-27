
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const UsersRolesManagement = () => {
  const users = [
    {
      id: 1,
      name: "Dr. John Smith",
      email: "john.smith@email.com",
      role: "Health Practitioner",
      status: "active",
      joinDate: "2024-01-10",
      location: "Lagos, Nigeria"
    },
    {
      id: 2,
      name: "MediSupply Ltd",
      email: "contact@medisupply.com",
      role: "Supplier",
      status: "active",
      joinDate: "2024-01-08",
      location: "Abuja, Nigeria"
    },
    {
      id: 3,
      name: "Jane Doe",
      email: "jane.doe@email.com",
      role: "Diaspora",
      status: "pending",
      joinDate: "2024-01-12",
      location: "New York, USA"
    },
    {
      id: 4,
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@email.com",
      role: "Health Practitioner",
      status: "suspended",
      joinDate: "2024-01-05",
      location: "Kano, Nigeria"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">Active</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "suspended":
        return <Badge variant="destructive">Suspended</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "Health Practitioner":
        return <Badge className="bg-blue-100 text-blue-800">Health Practitioner</Badge>;
      case "Supplier":
        return <Badge className="bg-green-100 text-green-800">Supplier</Badge>;
      case "Diaspora":
        return <Badge className="bg-purple-100 text-purple-800">Diaspora</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Users & Roles Management</h3>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">Add User</Button>
          <Button variant="outline" size="sm">Export Users</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">12</div>
            <div className="text-sm text-gray-600">Health Practitioners</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">8</div>
            <div className="text-sm text-gray-600">Suppliers</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">15</div>
            <div className="text-sm text-gray-600">Diaspora Users</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">3</div>
            <div className="text-sm text-gray-600">Pending Approvals</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>{user.location}</TableCell>
                  <TableCell>{user.joinDate}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">Edit</Button>
                      <Button size="sm" variant="outline">View</Button>
                      {user.status === "pending" && (
                        <Button size="sm">Approve</Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
