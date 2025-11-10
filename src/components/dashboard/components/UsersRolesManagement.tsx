// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// export const UsersRolesManagement = () => {
//   const users = [
//     {
//       id: 1,
//       name: "Dr. John Smith",
//       email: "john.smith@email.com",
//       role: "Health Practitioner",
//       status: "active",
//       joinDate: "2024-01-10",
//       location: "Lagos, Nigeria"
//     },
//     {
//       id: 2,
//       name: "MediSupply Ltd",
//       email: "contact@medisupply.com",
//       role: "Supplier",
//       status: "active",
//       joinDate: "2024-01-08",
//       location: "Abuja, Nigeria"
//     },
//     {
//       id: 3,
//       name: "Jane Doe",
//       email: "jane.doe@email.com",
//       role: "Diaspora",
//       status: "pending",
//       joinDate: "2024-01-12",
//       location: "New York, USA"
//     },
//     {
//       id: 4,
//       name: "Dr. Sarah Johnson",
//       email: "sarah.johnson@email.com",
//       role: "Health Practitioner",
//       status: "suspended",
//       joinDate: "2024-01-05",
//       location: "Kano, Nigeria"
//     }
//   ];

//   const getStatusBadge = (status: string) => {
//     switch (status) {
//       case "active":
//         return <Badge variant="default">Active</Badge>;
//       case "pending":
//         return <Badge variant="secondary">Pending</Badge>;
//       case "suspended":
//         return <Badge variant="destructive">Suspended</Badge>;
//       default:
//         return <Badge variant="outline">{status}</Badge>;
//     }
//   };

//   const getRoleBadge = (role: string) => {
//     switch (role) {
//       case "Health Practitioner":
//         return <Badge className="bg-blue-100 text-blue-800">Health Practitioner</Badge>;
//       case "Supplier":
//         return <Badge className="bg-green-100 text-green-800">Supplier</Badge>;
//       case "Diaspora":
//         return <Badge className="bg-purple-100 text-purple-800">Diaspora</Badge>;
//       default:
//         return <Badge variant="outline">{role}</Badge>;
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <h3 className="text-lg font-semibold">Users & Roles Management</h3>
//         <div className="flex space-x-2">
//           <Button variant="outline" size="sm">Add User</Button>
//           <Button variant="outline" size="sm">Export Users</Button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//         <Card>
//           <CardContent className="p-4">
//             <div className="text-2xl font-bold text-blue-600">12</div>
//             <div className="text-sm text-gray-600">Health Practitioners</div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="p-4">
//             <div className="text-2xl font-bold text-green-600">8</div>
//             <div className="text-sm text-gray-600">Suppliers</div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="p-4">
//             <div className="text-2xl font-bold text-purple-600">15</div>
//             <div className="text-sm text-gray-600">Diaspora Users</div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="p-4">
//             <div className="text-2xl font-bold text-orange-600">3</div>
//             <div className="text-sm text-gray-600">Pending Approvals</div>
//           </CardContent>
//         </Card>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle>All Users</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Name</TableHead>
//                 <TableHead>Email</TableHead>
//                 <TableHead>Role</TableHead>
//                 <TableHead>Status</TableHead>
//                 <TableHead>Location</TableHead>
//                 <TableHead>Join Date</TableHead>
//                 <TableHead>Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {users.map((user) => (
//                 <TableRow key={user.id}>
//                   <TableCell className="font-medium">{user.name}</TableCell>
//                   <TableCell>{user.email}</TableCell>
//                   <TableCell>{getRoleBadge(user.role)}</TableCell>
//                   <TableCell>{getStatusBadge(user.status)}</TableCell>
//                   <TableCell>{user.location}</TableCell>
//                   <TableCell>{user.joinDate}</TableCell>
//                   <TableCell>
//                     <div className="flex space-x-2">
//                       <Button size="sm" variant="outline">Edit</Button>
//                       <Button size="sm" variant="outline">View</Button>
//                       {user.status === "pending" && (
//                         <Button size="sm">Approve</Button>
//                       )}
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

//User Roles Management Component 2

// import React, { useState, useEffect } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { API_BASE_URL } from "@/lib/api";
// import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
// import { toast } from "sonner";

// // Types
// interface User {
//   id: number;
//   full_name: string;
//   email: string;
//   phone: string;
//   status: 'pending' | 'active' | 'suspended' | 'rejected';
//   location?: string;
//   license_number?: string;
//   business_name?: string;
//   created_at: string;
//   role: {
//     id: number;
//     name: string;
//     description?: string;
//   };
// }

// interface UserStats {
//   health_practitioners: number;
//   suppliers: number;
//   diaspora: number;
//   beneficiaries: number;
//   pending_approvals: number;
//   total_users: number;
// }

// // API Service
// const userService = {
// //   getAllUsers: async (): Promise<{ users: User[]; stats: UserStats }> => {
// //     const token = localStorage.getItem("auth_token");
// //     console.log("Making request with token:", !!token);
// //     const response = await fetch(`${API_BASE_URL}/super-admin/users`, {
// //       headers: {
// //         "Authorization": token ? `Bearer ${token}` : "",
// //         "Content-Type": "application/json",
// //       },
// //     });
// //     console.log("Response status:", response.status);
// //   console.log("Response headers:", Object.fromEntries(response.headers.entries()));

// //     if (!token) {
// //       console.error('No token found in localStorage');
// //       window.location.href = '/login';
// //       throw new Error("No token found. Please log in.");
// //     }
// //     // Check if token is expired (if it's a JWT)
// // try {
// //   const payload = JSON.parse(atob(token.split('.')[1]));
// //   if (payload.exp * 1000 < Date.now()) {
// //     console.log("Token expired");
// //     localStorage.removeItem('auth_token');
// //     window.location.href = '/login';
// //     throw new Error("Token expired. Please log in again.");
// //   }
// // } catch (e) {
// //   console.log("Invalid token format");
// // }

// //     if (response.status === 401) {
// //       localStorage.removeItem('token');
// //       window.location.href = '/login';
// //       throw new Error("Unauthorized. Please log in again.");
// //     }

// //     if (!response.ok) {
// //       const errorText = await response.text().catch(() => "Unknown error");
// //       throw new Error(`Failed to fetch users: ${errorText}`);
// //     }

// //     return response.json();
// //   },
// getAllUsers: async (): Promise<{ users: User[]; stats: UserStats }> => {
//   const token = localStorage.getItem("auth_token");

//   if (!token) {
//     console.error('No token found in localStorage');
//   }

//   const response = await fetch(`${API_BASE_URL}/super-admin/users`, {
//     headers: {
//       "Authorization": token ? `Bearer ${token}` : "",
//       "Content-Type": "application/json",
//     },
//   });

//   // console.log('Response status:', response.status);
//   // console.log('Response headers:', Object.fromEntries(response.headers.entries()));

//   if (response.status === 401) {
//     localStorage.removeItem('auth_token');
//     window.location.href = '/';
//     throw new Error("Unauthorized. Please log in again.");
//   }

//   const contentType = response.headers.get('content-type') || '';
//   const responseText = await response.text();

//   // console.log('Raw response:', responseText);

//   if (!response.ok) {
//     throw new Error(`Failed to fetch users: ${responseText || "Unknown error"}`);
//   }

//   if (!contentType.includes('application/json')) {
//     // console.error('Non-JSON response:', responseText);
//     throw new Error('Server returned non-JSON response');
//   }

//   if (!responseText) {
//     throw new Error('Empty response from server');
//   }

//   try {
//     return JSON.parse(responseText);
//   } catch (error) {
//     // console.error('JSON parse error:', error);
//     // console.error('Response text:', responseText);
//     throw new Error('Invalid JSON response from server');
//   }
// },

//   getPendingRegistrations: async (): Promise<{ users: User[], stats: UserStats }> => {
//     const token = localStorage.getItem('auth_token');
//     const response = await fetch(`${API_BASE_URL}/super-admin/pending-registrations`, {
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json'
//       }
//     });

//     if (!response.ok) {
//       throw new Error('Failed to fetch pending registrations');
//     }

//     return response.json();
//   },

//   approveRegistration: async (userId: number): Promise<User> => {
//     const token = localStorage.getItem('auth_token');
//     const response = await fetch(`${API_BASE_URL}/super-admin/users/${userId}`, {
//       method: 'PATCH',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({ action: 'approve' })
//     });

//     if (!response.ok) {
//       throw new Error('Failed to approve registration');
//     }

//     return response.json();
//   },

//   rejectRegistration: async (userId: number, reason?: string): Promise<User> => {
//     const token = localStorage.getItem('auth_token');
//     const response = await fetch(`${API_BASE_URL}/super-admin/users/${userId}`, {
//       method: 'PATCH',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({ action: 'reject', reason })
//     });

//     if (!response.ok) {
//       throw new Error('Failed to reject registration');
//     }

//     return response.json();
//   },

//   revokeUserAccess: async (userId: number): Promise<User> => {
//     const token = localStorage.getItem('auth_token');
//     const response = await fetch(`${API_BASE_URL}/super-admin/users/${userId}/revoke`, {
//       method: 'PATCH',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json'
//       }
//     });

//     if (!response.ok) {
//       throw new Error('Failed to revoke user access');
//     }

//     return response.json();
//   },

//   restoreUserAccess: async (userId: number): Promise<User> => {
//     const token = localStorage.getItem('auth_token');
//     const response = await fetch(`${API_BASE_URL}/super-admin/users/${userId}/restore`, {
//       method: 'PATCH',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json'
//       }
//     });

//     if (!response.ok) {
//       throw new Error('Failed to restore user access');
//     }

//     return response.json();
//   },

//   getUserActivity: async (userId: number) => {
//     const token = localStorage.getItem('auth_token');
//     const response = await fetch(`${API_BASE_URL}/super-admin/users/${userId}/activity`, {
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json'
//       }
//     });

//     if (!response.ok) {
//       throw new Error('Failed to fetch user activity');
//     }

//     return response.json();
//   },

//   getStats: async (): Promise<UserStats> => {
//     const token = localStorage.getItem('auth_token');
//     const response = await fetch(`${API_BASE_URL}/super-admin/stats`, {
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json'
//       }
//     });

//     if (!response.ok) {
//       throw new Error('Failed to fetch stats');
//     }

//     return response.json();
//   }
// };

// export const UsersRolesManagement = () => {
//   const [users, setUsers] = useState<User[]>([]);
//   const [stats, setStats] = useState<UserStats>({
//     health_practitioners: 0,
//     suppliers: 0,
//     diaspora: 0,
//     beneficiaries: 0,
//     pending_approvals: 0,
//     total_users: 0
//   });
//   const [loading, setLoading] = useState(true);
//   const [actionLoading, setActionLoading] = useState<number | null>(null);
//   const [selectedUser, setSelectedUser] = useState<User | null>(null);
//   const [showUserDetails, setShowUserDetails] = useState(false);
//   const [viewMode, setViewMode] = useState<'all' | 'pending'>('all');

//   // Load users and stats on component mount
//   useEffect(() => {
//     fetchData();
//   }, [viewMode]);

//   const fetchData = async () => {
//     try {
//       setLoading(true);

//       if (viewMode === 'pending') {
//         const data = await userService.getPendingRegistrations();
//         setUsers(data.users);
//         setStats(data.stats);
//       } else {
//         const data = await userService.getAllUsers();
//         setUsers(data.users);
//         setStats(data.stats);
//       }
//     } catch (error) {
//       console.error('Error fetching data:', error);
//       toast.error("Failed to load data. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleApproveRegistration = async (userId: number) => {
//     try {
//       setActionLoading(userId);
//       const updatedUser = await userService.approveRegistration(userId);

//       // Update local state
//       setUsers(users.filter(user => user.id !== userId));

//       // Update stats
//       setStats(prev => ({
//         ...prev,
//         pending_approvals: Math.max(0, prev.pending_approvals - 1)
//       }));

//       toast.success(`User ${updatedUser.full_name} has been approved and can now login.`);
//     } catch (error) {
//       console.error('Error approving registration:', error);
//       toast.error("Failed to approve registration. Please try again.");
//     } finally {
//       setActionLoading(null);
//     }
//   };

//   const handleRejectRegistration = async (userId: number) => {
//     try {
//       setActionLoading(userId);
//       const user = users.find(u => u.id === userId);
//       const updatedUser = await userService.rejectRegistration(userId, "Registration rejected by administrator");

//       // Update local state
//       setUsers(users.filter(user => user.id !== userId));

//       // Update stats
//       setStats(prev => ({
//         ...prev,
//         pending_approvals: Math.max(0, prev.pending_approvals - 1)
//       }));

//       toast.success(`Registration for ${user?.full_name} has been rejected.`);
//     } catch (error) {
//       console.error('Error rejecting registration:', error);
//       toast.error("Failed to reject registration. Please try again.");
//     } finally {
//       setActionLoading(null);
//     }
//   };

//   const handleRevokeAccess = async (userId: number) => {
//     try {
//       setActionLoading(userId);
//       const updatedUser = await userService.revokeUserAccess(userId);

//       // Update local state
//       setUsers(users.map(user =>
//         user.id === userId ? { ...user, status: 'suspended' } : user
//       ));

//       toast.success(`Access revoked for ${updatedUser.full_name}.`);
//     } catch (error) {
//       console.error('Error revoking access:', error);
//       toast.error("Failed to revoke user access. Please try again.");
//     } finally {
//       setActionLoading(null);
//     }
//   };

//   const handleRestoreAccess = async (userId: number) => {
//     try {
//       setActionLoading(userId);
//       const updatedUser = await userService.restoreUserAccess(userId);

//       // Update local state
//       setUsers(users.map(user =>
//         user.id === userId ? { ...user, status: 'active' } : user
//       ));

//       toast.success(`Access restored for ${updatedUser.full_name}.`);
//     } catch (error) {
//       console.error('Error restoring access:', error);
//       toast.error("Failed to restore user access. Please try again.");
//     } finally {
//       setActionLoading(null);
//     }
//   };

//   const handleViewUser = (user: User) => {
//     setSelectedUser(user);
//     setShowUserDetails(true);
//   };

//   const getStatusBadge = (status: string) => {
//     switch (status) {
//       case "active":
//         return <Badge className="bg-green-100 text-green-800">Active</Badge>;
//       case "pending":
//         return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
//       case "suspended":
//         return <Badge className="bg-red-100 text-red-800">Suspended</Badge>;
//       case "rejected":
//         return <Badge className="bg-gray-100 text-gray-800">Rejected</Badge>;
//       default:
//         return <Badge variant="outline">{status}</Badge>;
//     }
//   };

//   const getRoleBadge = (roleName: string) => {
//     const displayName = roleName.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());

//     switch (roleName) {
//       case "health_practitioner":
//         return <Badge className="bg-blue-100 text-blue-800">{displayName}</Badge>;
//       case "supplier":
//         return <Badge className="bg-green-100 text-green-800">{displayName}</Badge>;
//       case "diaspora":
//         return <Badge className="bg-purple-100 text-purple-800">{displayName}</Badge>;
//       case "beneficiary":
//         return <Badge className="bg-orange-100 text-orange-800">{displayName}</Badge>;
//       case "super_admin":
//         return <Badge className="bg-red-100 text-red-800">{displayName}</Badge>;
//       default:
//         return <Badge variant="outline">{displayName}</Badge>;
//     }
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString();
//   };

//   const renderActionButtons = (user: User) => {
//     const isLoading = actionLoading === user.id;

//     return (
//       <div className="flex space-x-2">
//         <Button
//           size="sm"
//           variant="outline"
//           onClick={() => handleViewUser(user)}
//           disabled={isLoading}
//         >
//           View
//         </Button>

//         {user.status === "pending" && (
//           <>
//             <Button
//               size="sm"
//               onClick={() => handleApproveRegistration(user.id)}
//               disabled={isLoading}
//               className="bg-green-600 hover:bg-green-700"
//             >
//               {isLoading ? "..." : "Approve"}
//             </Button>
//             <AlertDialog>
//               <AlertDialogTrigger asChild>
//                 <Button
//                   size="sm"
//                   variant="destructive"
//                   disabled={isLoading}
//                 >
//                   Reject
//                 </Button>
//               </AlertDialogTrigger>
//               <AlertDialogContent>
//                 <AlertDialogHeader>
//                   <AlertDialogTitle>Reject Registration</AlertDialogTitle>
//                   <AlertDialogDescription>
//                     Are you sure you want to reject {user.full_name}'s registration?
//                     They will not be able to login or access the system.
//                   </AlertDialogDescription>
//                 </AlertDialogHeader>
//                 <AlertDialogFooter>
//                   <AlertDialogCancel>Cancel</AlertDialogCancel>
//                   <AlertDialogAction
//                     onClick={() => handleRejectRegistration(user.id)}
//                     className="bg-red-600 hover:bg-red-700"
//                   >
//                     Reject Registration
//                   </AlertDialogAction>
//                 </AlertDialogFooter>
//               </AlertDialogContent>
//             </AlertDialog>
//           </>
//         )}

//         {user.status === "active" && (
//           <AlertDialog>
//             <AlertDialogTrigger asChild>
//               <Button
//                 size="sm"
//                 variant="outline"
//                 disabled={isLoading}
//                 className="text-red-600 border-red-600 hover:bg-red-50"
//               >
//                 Revoke
//               </Button>
//             </AlertDialogTrigger>
//             <AlertDialogContent>
//               <AlertDialogHeader>
//                 <AlertDialogTitle>Revoke User Access</AlertDialogTitle>
//                 <AlertDialogDescription>
//                   Are you sure you want to revoke access for {user.full_name}?
//                   They will not be able to login until access is restored.
//                 </AlertDialogDescription>
//               </AlertDialogHeader>
//               <AlertDialogFooter>
//                 <AlertDialogCancel>Cancel</AlertDialogCancel>
//                 <AlertDialogAction
//                   onClick={() => handleRevokeAccess(user.id)}
//                   className="bg-red-600 hover:bg-red-700"
//                 >
//                   Revoke Access
//                 </AlertDialogAction>
//               </AlertDialogFooter>
//             </AlertDialogContent>
//           </AlertDialog>
//         )}

//         {user.status === "suspended" && (
//           <Button
//             size="sm"
//             onClick={() => handleRestoreAccess(user.id)}
//             disabled={isLoading}
//             className="bg-green-600 hover:bg-green-700"
//           >
//             {isLoading ? "..." : "Restore"}
//           </Button>
//         )}
//       </div>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-lg">Loading users...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <h3 className="text-lg font-semibold">Users & Roles Management</h3>
//         <div className="flex space-x-2">
//           <Button
//             variant={viewMode === 'all' ? 'default' : 'outline'}
//             size="sm"
//             onClick={() => setViewMode('all')}
//           >
//             All Users
//           </Button>
//           <Button
//             variant={viewMode === 'pending' ? 'default' : 'outline'}
//             size="sm"
//             onClick={() => setViewMode('pending')}
//           >
//             Pending ({stats.pending_approvals})
//           </Button>
//           <Button variant="outline" size="sm" onClick={fetchData}>
//             Refresh
//           </Button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
//         <Card>
//           <CardContent className="p-4">
//             <div className="text-2xl font-bold text-blue-600">{stats.health_practitioners}</div>
//             <div className="text-sm text-gray-600">Health Practitioners</div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="p-4">
//             <div className="text-2xl font-bold text-green-600">{stats.suppliers}</div>
//             <div className="text-sm text-gray-600">Suppliers</div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="p-4">
//             <div className="text-2xl font-bold text-purple-600">{stats.diaspora}</div>
//             <div className="text-sm text-gray-600">Diaspora Users</div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="p-4">
//             <div className="text-2xl font-bold text-orange-600">{stats.beneficiaries}</div>
//             <div className="text-sm text-gray-600">Beneficiaries</div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="p-4">
//             <div className="text-2xl font-bold text-red-600">{stats.pending_approvals}</div>
//             <div className="text-sm text-gray-600">Pending Approvals</div>
//           </CardContent>
//         </Card>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle>
//             {viewMode === 'pending' ? 'Pending Registrations' : 'All Users'} ({users.length})
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="overflow-x-auto">
//             <table className="w-full border-collapse">
//               <thead>
//                 <tr className="border-b">
//                   <th className="text-left p-3 font-semibold">Name</th>
//                   <th className="text-left p-3 font-semibold">Email</th>
//                   <th className="text-left p-3 font-semibold">Phone</th>
//                   <th className="text-left p-3 font-semibold">Role</th>
//                   <th className="text-left p-3 font-semibold">Status</th>
//                   <th className="text-left p-3 font-semibold">Location</th>
//                   <th className="text-left p-3 font-semibold">Join Date</th>
//                   <th className="text-left p-3 font-semibold">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {users.map((user) => (
//                   <tr key={user.id} className="border-b hover:bg-gray-50">
//                     <td className="p-3 font-medium">{user.full_name}</td>
//                     <td className="p-3">{user.email}</td>
//                     <td className="p-3">{user.phone}</td>
//                     <td className="p-3">{getRoleBadge(user.role.name)}</td>
//                     <td className="p-3">{getStatusBadge(user.status)}</td>
//                     <td className="p-3">{user.location || 'N/A'}</td>
//                     <td className="p-3">{formatDate(user.created_at)}</td>
//                     <td className="p-3">{renderActionButtons(user)}</td>
//                   </tr>
//                 ))}
//                 {users.length === 0 && (
//                   <tr>
//                     <td colSpan={8} className="text-center py-8 text-gray-500">
//                       {viewMode === 'pending' ? 'No pending registrations' : 'No users found'}
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </CardContent>
//       </Card>

//       {/* User Details Modal */}
//       {selectedUser && (
//         <AlertDialog open={showUserDetails} onOpenChange={setShowUserDetails}>
//           <AlertDialogContent className="max-w-2xl">
//             <AlertDialogHeader>
//               <AlertDialogTitle>User Details</AlertDialogTitle>
//             </AlertDialogHeader>
//             <div className="space-y-4">
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="font-semibold">Full Name:</label>
//                   <p>{selectedUser.full_name}</p>
//                 </div>
//                 <div>
//                   <label className="font-semibold">Email:</label>
//                   <p>{selectedUser.email}</p>
//                 </div>
//                 <div>
//                   <label className="font-semibold">Phone:</label>
//                   <p>{selectedUser.phone}</p>
//                 </div>
//                 <div>
//                   <label className="font-semibold">Role:</label>
//                   <p>{getRoleBadge(selectedUser.role.name)}</p>
//                 </div>
//                 <div>
//                   <label className="font-semibold">Status:</label>
//                   <p>{getStatusBadge(selectedUser.status)}</p>
//                 </div>
//                 <div>
//                   <label className="font-semibold">Location:</label>
//                   <p>{selectedUser.location || 'N/A'}</p>
//                 </div>
//                 {selectedUser.license_number && (
//                   <div>
//                     <label className="font-semibold">License Number:</label>
//                     <p>{selectedUser.license_number}</p>
//                   </div>
//                 )}
//                 {selectedUser.business_name && (
//                   <div>
//                     <label className="font-semibold">Business Name:</label>
//                     <p>{selectedUser.business_name}</p>
//                   </div>
//                 )}
//                 <div>
//                   <label className="font-semibold">Joined:</label>
//                   <p>{formatDate(selectedUser.created_at)}</p>
//                 </div>
//               </div>
//             </div>
//             <AlertDialogFooter>
//               <AlertDialogCancel>Close</AlertDialogCancel>
//             </AlertDialogFooter>
//           </AlertDialogContent>
//         </AlertDialog>
//       )}
//     </div>
//   );
// };

// User Roles Management Component 3

import React, { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { API_BASE_URL } from "@/lib/api"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"

interface Role {
  id: number
  displayName: string
  description?: string | null
}

interface User {
  id: number
  fullName: string
  email: string
  phone: string | null
  status: "pending" | "active" | "suspended" | "rejected"
  location?: string | null
  licenseNumber?: string | null
  businessName?: string | null
  createdAt: string
  updatedAt: string
  role?: Role | null
}

interface UserStats {
  total_users: number
  active_users: number
  pending_users: number
  suspended_users: number
}

interface UserActivity {
  userId: number
  lastLogin: string
  note?: string
}

interface ApiResponse<T = any> {
  success: boolean
  message: string
  data:
    | {
        meta?: {
          total: number
          perPage: number
          currentPage: number
          lastPage: number
          firstPage: number
          firstPageUrl: string
          lastPageUrl: string
          nextPageUrl: string | null
          previousPageUrl: string | null
        }
        data?: T
        user?: User
        users?: User[]
      }
    | T
}

type AnyObj = Record<string, unknown>

const normalizeStats = (raw: AnyObj): UserStats => {
  const src: AnyObj = (raw && (raw as AnyObj).totals) ?? (raw as AnyObj)?.stats ?? (raw as AnyObj)?.counts ?? (raw as AnyObj)?.summary ?? raw ?? {}
  const toNum = (v: unknown) => Number(v ?? 0)
  return {
    total_users: toNum((src as AnyObj).total_users ?? (src as AnyObj).totalUsers ?? (src as AnyObj).total),
    active_users: toNum((src as AnyObj).active_users ?? (src as AnyObj).activeUsers ?? (src as AnyObj).active),
    pending_users: toNum(
      (src as AnyObj).pending_users ?? (src as AnyObj).pendingUsers ?? (src as AnyObj).pending ?? (src as AnyObj).pendingApprovals,
    ),
    suspended_users: toNum((src as AnyObj).suspended_users ?? (src as AnyObj).suspendedUsers ?? (src as AnyObj).suspended),
  }
}

const userService = {
  getAllUsers: async (page: number = 1, limit: number = 10): Promise<{ users: User[]; meta: any }> => {
    const token = localStorage.getItem("auth_token")
    if (!token) throw new Error("No authentication token found. Please log in.")

    const response = await fetch(`${API_BASE_URL}/super-admin/users?page=${page}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (response.status === 401) throw new Error("Unauthorized. Please log in again.")

    const contentType = response.headers.get("content-type") || ""
    const responseText = await response.text()

    if (!response.ok) throw new Error(`Failed to fetch users: ${responseText || "Unknown error"}`)
    if (!contentType.includes("application/json")) throw new Error("Server returned non-JSON response")
    if (!responseText) throw new Error("Empty response from server")

    const data = JSON.parse(responseText)
    const usersArray = Array.isArray(data.data?.data) ? (data.data.data as User[]) : []
    const meta = data.data?.meta || {
      total: usersArray.length,
      perPage: limit,
      currentPage: page,
      lastPage: 1,
    }

    return { users: usersArray, meta }
  },

  getPendingRegistrations: async (page: number = 1, limit: number = 10): Promise<{ users: User[]; meta: any }> => {
    const token = localStorage.getItem("auth_token")
    if (!token) throw new Error("No authentication token found")

    const response = await fetch(
      `${API_BASE_URL}/super-admin/pending-registrations?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    )

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error")
      throw new Error(`Failed to fetch pending registrations: ${errorText}`)
    }

    const data = await response.json()

    let usersArray: User[] = []
    let meta = { total: 0, lastPage: 1, perPage: limit, currentPage: page }

    if (data.data) {
      if (Array.isArray(data.data.users)) {
        usersArray = data.data.users
        meta = { ...meta, ...(data.data.meta || {}) }
      }
    }

    return { users: usersArray, meta }
  },

  getRoles: async (): Promise<Role[]> => {
    const token = localStorage.getItem("auth_token")
    if (!token) throw new Error("No authentication token found")

    const response = await fetch(`${API_BASE_URL}/super-admin/roles`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error")
      throw new Error(`Failed to fetch roles: ${errorText}`)
    }
    if (response.status === 401) throw new Error("Unauthorized. Please log in again.")

    const data: ApiResponse<Role[]> = await response.json()
    return (data as any)?.data?.data || []
  },

  approveRegistration: async (userId: number, roleId?: number): Promise<User> => {
    const token = localStorage.getItem("auth_token")
    if (!token) throw new Error("No authentication token found")

    const response = await fetch(`${API_BASE_URL}/super-admin/registrations/${userId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action: "approve", roleId })
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error")
      throw new Error(`Failed to approve registration: ${errorText}`)
    }

    const data = await response.json()
    if (data.data) {
      if (data.data.user) return data.data.user as User
      if (data.data.data) return data.data.data as User
      return data.data as User
    }
    return data as User
  },

  rejectRegistration: async (userId: number): Promise<User> => {
    const token = localStorage.getItem("auth_token")
    if (!token) throw new Error("No authentication token found")

    const response = await fetch(`${API_BASE_URL}/super-admin/registrations/${userId}/registration`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action: "reject" }),
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error")
      throw new Error(`Failed to reject registration: ${errorText}`)
    }

    const data = await response.json()
    if (data.data) {
      if (data.data.user) return data.data.user as User
      if (data.data.data) return data.data.data as User
      return data.data as User
    }
    return data as User
  },

  revokeUserAccess: async (userId: number): Promise<User> => {
    const token = localStorage.getItem("auth_token")
    if (!token) throw new Error("No authentication token found")

    const response = await fetch(`${API_BASE_URL}/super-admin/users/${userId}/revoke`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error")
      throw new Error(`Failed to revoke user access: ${errorText}`)
    }

    const data = await response.json()
    if (data.data) {
      if (data.data.user) return data.data.user as User
      if (data.data.data) return data.data.data as User
      return data.data as User
    }
    return data as User
  },

  restoreUserAccess: async (userId: number): Promise<User> => {
    const token = localStorage.getItem("auth_token")
    if (!token) throw new Error("No authentication token found")

    const response = await fetch(`${API_BASE_URL}/super-admin/users/${userId}/restore`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error")
      throw new Error(`Failed to restore user access: ${errorText}`)
    }

    const data = await response.json()
    if (data.data) {
      if (data.data.user) return data.data.user as User
      if (data.data.data) return data.data.data as User
      return data.data as User
    }
    return data as User
  },

  getUserActivity: async (userId: number): Promise<UserActivity> => {
    const token = localStorage.getItem("auth_token")
    if (!token) throw new Error("No authentication token found")

    const response = await fetch(`${API_BASE_URL}/super-admin/users/${userId}/activity`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error")
      throw new Error(`Failed to fetch user activity: ${errorText}`)
    }

    const data = await response.json()
    if (data.data) {
      if (data.data.data) return data.data.data as UserActivity
      return data.data as UserActivity
    }
    return data as UserActivity
  },

  getStats: async (): Promise<UserStats> => {
    const token = localStorage.getItem("auth_token")
    if (!token) throw new Error("No authentication token found")

    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    }

    const fetchJson = async (url: string) => {
      const res = await fetch(url, { headers })
      const txt = await res.text()
      let json: any = {}
      try {
        json = JSON.parse(txt)
      } catch {
        json = {}
      }
      return { ok: res.ok, json }
    }

    const tryStats = async (): Promise<UserStats> => {
      const { ok, json } = await fetchJson(`${API_BASE_URL}/super-admin/stats`)
      if (!ok) return { total_users: 0, active_users: 0, pending_users: 0, suspended_users: 0 }
      const raw = json?.data?.data ?? json?.data ?? json
      return normalizeStats(raw || {})
    }

    const fallbackTotals = async (): Promise<UserStats> => {
      const [all, active, suspended, pending] = await Promise.all([
        fetchJson(`${API_BASE_URL}/super-admin/users?page=1&limit=1`),
        fetchJson(`${API_BASE_URL}/super-admin/users?status=active&page=1&limit=1`),
        fetchJson(`${API_BASE_URL}/super-admin/users?status=suspended&page=1&limit=1`),
        fetchJson(`${API_BASE_URL}/super-admin/pending-registrations?page=1&limit=1`),
      ])
      const pickTotal = (obj: any) => obj?.data?.meta?.total ?? obj?.data?.total ?? obj?.meta?.total ?? 0
      return {
        total_users: Number(pickTotal(all.json)),
        active_users: Number(pickTotal(active.json)),
        pending_users: Number(pickTotal(pending.json)),
        suspended_users: Number(pickTotal(suspended.json)),
      }
    }

    const s = await tryStats()
    const sum = s.total_users + s.active_users + s.pending_users + s.suspended_users
    if (!Number.isFinite(sum) || sum === 0) return await fallbackTotals()
    return s
  },
}

export default function UsersRolesManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [userActivity, setUserActivity] = useState<UserActivity | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<number | null>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null)
  const [showUserDetails, setShowUserDetails] = useState(false)
  const [viewMode, setViewMode] = useState<"all" | "pending">("all")

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)

  const [globalStats, setGlobalStats] = useState<UserStats>({
    total_users: 0,
    active_users: 0,
    pending_users: 0,
    suspended_users: 0,
  })

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = viewMode === "pending" ? await userService.getPendingRegistrations(page, pageSize) : await userService.getAllUsers(page, pageSize)

      const usersArray = Array.isArray(response.users) ? response.users : []
      setUsers(usersArray)

      const meta = response.meta || {}
      const last = meta.lastPage ?? Math.max(1, Math.ceil((meta.total ?? usersArray.length) / pageSize))
      const current = meta.currentPage ?? page
      const total = meta.total ?? usersArray.length

      setTotalPages(last)
      setTotalItems(total)
      if (current > last) setPage(last)
    } catch (err: any) {
      const message = err.message || "Failed to load data. Please try again."
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const fetchGlobalStats = async () => {
    try {
      const s = await userService.getStats()
      setGlobalStats(s)
    } catch (err: any) {
      toast.error(err.message || "Failed to load totals.")
    }
  }

  const fetchRoles = async () => {
    try {
      const rolesRes = await userService.getRoles()
      setRoles(rolesRes)
    } catch (err: any) {
      toast.error(err.message || "Failed to load roles. Please try again.")
    }
  }

  useEffect(() => {
    fetchData()
  }, [viewMode, page, pageSize])

  useEffect(() => {
    fetchGlobalStats()
    fetchRoles()
  }, [])

  const fetchUserActivity = async (userId: number) => {
    try {
      const activity = await userService.getUserActivity(userId)
      setUserActivity(activity)
    } catch (err: any) {
      toast.error(err.message || "Failed to load user activity.")
    }
  }

  const handleApproveRegistration = async (userId: number) => {
    try {
      setActionLoading(userId)
      const roleId = selectedRoleId ? parseInt(selectedRoleId) : undefined
      const updatedUser = await userService.approveRegistration(userId, roleId)

      setUsers(users.filter((u) => u.id !== userId))
      toast.success(`User ${updatedUser.fullName} has been approved and can now login.`)
      await fetchGlobalStats()
      setSelectedRoleId(null)
    } catch (err: any) {
      toast.error(err.message || "Failed to approve registration. Please try again.")
    } finally {
      setActionLoading(null)
    }
  }

  const handleRejectRegistration = async (userId: number) => {
    try {
      setActionLoading(userId)
      const user = users.find((u) => u.id === userId)
      await userService.rejectRegistration(userId)

      setUsers(users.filter((u) => u.id !== userId))
      toast.success(`Registration for ${user?.fullName} has been rejected.`)
      await fetchGlobalStats()
    } catch (err: any) {
      toast.error(err.message || "Failed to reject registration. Please try again.")
    } finally {
      setActionLoading(null)
    }
  }

  const handleRevokeAccess = async (userId: number) => {
    try {
      setActionLoading(userId)
      const updatedUser = await userService.revokeUserAccess(userId)

      setUsers(users.map((u) => (u.id === userId ? { ...u, status: "suspended" } : u)))
      toast.success(`Access revoked for ${updatedUser.fullName}.`)
      await fetchGlobalStats()
    } catch (err: any) {
      toast.error(err.message || "Failed to revoke user access. Please try again.")
    } finally {
      setActionLoading(null)
    }
  }

  const handleRestoreAccess = async (userId: number) => {
    try {
      setActionLoading(userId)
      const updatedUser = await userService.restoreUserAccess(userId)

      setUsers(users.map((u) => (u.id === userId ? { ...u, status: "active" } : u)))
      toast.success(`Access restored for ${updatedUser.fullName}.`)
      await fetchGlobalStats()
    } catch (err: any) {
      toast.error(err.message || "Failed to restore user access. Please try again.")
    } finally {
      setActionLoading(null)
    }
  }

  const handleViewUser = (user: User) => {
    setSelectedUser(user)
    setUserActivity(null)
    fetchUserActivity(user.id)
    setShowUserDetails(true)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "suspended":
        return <Badge className="bg-red-100 text-red-800">Suspended</Badge>
      case "rejected":
        return <Badge className="bg-gray-100 text-gray-800">Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getRoleBadge = (roleName?: string | null) => {
    if (!roleName) return <Badge variant="outline">No role</Badge>
    const displayName = roleName.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())

    switch (roleName) {
      case "health_practitioner":
        return <Badge className="bg-blue-100 text-blue-800">{displayName}</Badge>
      case "supplier":
        return <Badge className="bg-green-100 text-green-800">{displayName}</Badge>
      case "diaspora":
        return <Badge className="bg-purple-100 text-purple-800">{displayName}</Badge>
      case "beneficiary":
        return <Badge className="bg-orange-100 text-orange-800">{displayName}</Badge>
      case "super_admin":
        return <Badge className="bg-red-100 text-red-800">{displayName}</Badge>
      default:
        return <Badge variant="outline">{displayName}</Badge>
    }
  }

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString()

  const renderActionButtons = (user: User) => {
    const isLoading = actionLoading === user.id

    return (
      <div className="flex space-x-2 action-buttons">
        <Button size="sm" variant="outline" onClick={() => handleViewUser(user)} disabled={isLoading}>
          View
        </Button>

        {user.status === "pending" && (
          <>
            {user.role ? (
              <Button size="sm" disabled={isLoading} className="bg-green-600 hover:bg-green-700" onClick={() => handleApproveRegistration(user.id)}>
                {isLoading ? "..." : "Approve"}
              </Button>
            ) : (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="sm" disabled={isLoading} className="bg-green-600 hover:bg-green-700">
                    {isLoading ? "..." : "Approve"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Approve Registration</AlertDialogTitle>
                    <AlertDialogDescription>Approve {user.fullName}'s registration and assign a role.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="my-4">
                    <Select onValueChange={setSelectedRoleId} defaultValue={selectedRoleId || undefined}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles?.map((role) => (
                          <SelectItem key={role.id} value={role.id.toString()}>
                            {role.displayName.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleApproveRegistration(user.id)} className="bg-green-600 hover:bg-green-700" disabled={!selectedRoleId}>
                      Approve Registration
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </>
        )}

        {user.status === "pending" && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" variant="destructive" disabled={isLoading}>
                Reject
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reject Registration</AlertDialogTitle>
                <AlertDialogDescription>Are you sure you want to reject {user.fullName}'s registration</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleRejectRegistration(user.id)} className="bg-red-600 hover:bg-red-700">
                  Reject Registration
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        {user.status === "active" && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" variant="outline" disabled={isLoading} className="text-red-600 border-red-600 hover:bg-red-50">
                Revoke
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Revoke User Access</AlertDialogTitle>
                <AlertDialogDescription>Revoke access for {user.fullName}</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleRevokeAccess(user.id)} className="bg-red-600 hover:bg-red-700">
                  Revoke Access
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        {user.status === "suspended" && (
          <Button size="sm" onClick={() => handleRestoreAccess(user.id)} disabled={isLoading} className="bg-green-600 hover:bg-green-700">
            {isLoading ? "..." : "Restore"}
          </Button>
        )}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading users...</div>
      </div>
    )
  }

  const startItem = totalItems === 0 ? 0 : (page - 1) * pageSize + 1
  const endItem = Math.min(page * pageSize, totalItems)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Users & Roles Management</h3>
        <div className="flex gap-3 items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Rows per page</span>
            <Select
              value={String(pageSize)}
              onValueChange={(v) => {
                setPageSize(parseInt(v))
                setPage(1)
              }}
            >
              <SelectTrigger className="w-[90px]">
                <SelectValue placeholder="Page size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            variant={viewMode === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setViewMode("all")
              setPage(1)
            }}
          >
            All Users
          </Button>
          <Button
            variant={viewMode === "pending" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setViewMode("pending")
              setPage(1)
            }}
          >
            Pending ({(globalStats?.pending_users ?? 0).toLocaleString()})
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              fetchData()
              fetchGlobalStats()
            }}
          >
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{(globalStats?.total_users ?? 0).toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Users</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{(globalStats?.active_users ?? 0).toLocaleString()}</div>
            <div className="text-sm text-gray-600">Active Users</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{(globalStats?.pending_users ?? 0).toLocaleString()}</div>
            <div className="text-sm text-gray-600">Pending Approvals</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{(globalStats?.suspended_users ?? 0).toLocaleString()}</div>
            <div className="text-sm text-gray-600">Suspended Users</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{viewMode === "pending" ? "Pending Registrations" : "All Users"} ({users.length ?? 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-semibold">Name</th>
                  <th className="text-left p-3 font-semibold">Email</th>
                  <th className="text-left p-3 font-semibold">Phone</th>
                  <th className="text-left p-3 font-semibold">Role</th>
                  <th className="text-left p-3 font-semibold">Status</th>
                  <th className="text-left p-3 font-semibold">Location</th>
                  <th className="text-left p-3 font-semibold">Join Date</th>
                  <th className="text-left p-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(users) &&
                  users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b hover:bg-gray-50 cursor-pointer"
                      onClick={(e) => {
                        if ((e.target as HTMLElement).closest(".action-buttons")) return
                        handleViewUser(user)
                      }}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleViewUser(user)
                      }}
                    >
                      <td className="p-3 font-medium">{user.fullName}</td>
                      <td className="p-3">{user.email}</td>
                      <td className="p-3">{user.phone || "N/A"}</td>
                      <td className="p-3">{getRoleBadge(user.role?.displayName)}</td>
                      <td className="p-3">{getStatusBadge(user.status)}</td>
                      <td className="p-3">{user.location || "N/A"}</td>
                      <td className="p-3">{formatDate(user.createdAt)}</td>
                      <td className="p-3">{renderActionButtons(user)}</td>
                    </tr>
                  ))}
                {Array.isArray(users) && users.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-gray-500">
                      {viewMode === "pending" ? "No pending registrations" : "No users found"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-600">
              {totalItems > 0 ? `Showing ${startItem} to ${endItem} of ${totalItems.toLocaleString()}` : "No records"}
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage(1)}>
                First
              </Button>
              <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage((prev) => Math.max(1, prev - 1))}>
                Previous
              </Button>
              <span className="text-sm">{`Page ${page} of ${totalPages}`}</span>
              <Button size="sm" variant="outline" disabled={page === totalPages || totalPages === 0} onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}>
                Next
              </Button>
              <Button size="sm" variant="outline" disabled={page === totalPages || totalPages === 0} onClick={() => setPage(totalPages)}>
                Last
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedUser && (
        <AlertDialog open={showUserDetails} onOpenChange={(open) => {
          setShowUserDetails(open)
          if (!open) setSelectedRoleId(null)
        }}>
          <AlertDialogContent className="max-w-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle>User Details</AlertDialogTitle>
            </AlertDialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold">Full Name:</label>
                  <p>{selectedUser.fullName}</p>
                </div>
                <div>
                  <label className="font-semibold">Email:</label>
                  <p>{selectedUser.email}</p>
                </div>
                <div>
                  <label className="font-semibold">Phone:</label>
                  <p>{selectedUser.phone || "N/A"}</p>
                </div>
                <div>
                  <label className="font-semibold">Role:</label>
                  <p>{getRoleBadge(selectedUser.role?.displayName)}</p>
                </div>
                <div>
                  <label className="font-semibold">Status:</label>
                  <p>{getStatusBadge(selectedUser.status)}</p>
                </div>
                <div>
                  <label className="font-semibold">Location:</label>
                  <p>{selectedUser.location || "N/A"}</p>
                </div>
                {selectedUser.licenseNumber && (
                  <div>
                    <label className="font-semibold">License Number:</label>
                    <p>{selectedUser.licenseNumber}</p>
                  </div>
                )}
                {selectedUser.businessName && (
                  <div>
                    <label className="font-semibold">Business Name:</label>
                    <p>{selectedUser.businessName}</p>
                  </div>
                )}
                <div>
                  <label className="font-semibold">Joined:</label>
                  <p>{formatDate(selectedUser.createdAt)}</p>
                </div>
                {userActivity && (
                  <div className="col-span-2">
                    <label className="font-semibold">Last Activity:</label>
                    <p>{formatDate(userActivity.lastLogin)}</p>
                  </div>
                )}
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Close</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  )
}
