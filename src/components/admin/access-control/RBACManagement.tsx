import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../../ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../ui/table";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../ui/select";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "../../ui/dialog";
import { toast } from "react-hot-toast";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  phoneNumber?: string;
}

interface PendingLgu {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  status: string;
  createdAt: string;
}

const AdminLguManagement: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<"users" | "lguRoles" | "pendingLgus">("users");
  const [users, setUsers] = useState<User[]>([]);
  const [pendingLgus, setPendingLgus] = useState<PendingLgu[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState<string>("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
    fetchPendingLgus();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/admin/users");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      toast.error("Failed to fetch users");
    }
  };

  const fetchPendingLgus = async () => {
    try {
      const res = await fetch("http://localhost:5000/lgu/pendingLgus");
      const data = await res.json();
      setPendingLgus(data);
    } catch (error) {
      toast.error("Failed to fetch pending LGUs");
    }
  };


  const handleApproveReject = async (id: string, status: 'approved' | 'rejected') => {
    setProcessingId(id);
    try {
      const response = await fetch(`http://localhost:5000/lgu/pendingLgus/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        setPendingLgus(prev => prev.filter(lgu => lgu._id !== id));
        toast.success(`LGU ${status} successfully`);
        if (status === 'approved') {
          await fetchUsers(); 
        }
      }
    } catch (error) {
      toast.error(`Failed to ${status} LGU`);
    } finally {
      setProcessingId(null);
    }
  };

  const lguUsers = users.filter(user => user.role.includes("lgu"));

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <div className="flex space-x-4">
          <Button variant={selectedTab === "users" ? "default" : "outline"} onClick={() => setSelectedTab("users")}>
            Users ({users.length})
          </Button>
          <Button variant={selectedTab === "lguRoles" ? "default" : "outline"} onClick={() => setSelectedTab("lguRoles")}>
            Active LGU ({lguUsers.length})
          </Button>
          <Button variant={selectedTab === "pendingLgus" ? "default" : "outline"} onClick={() => setSelectedTab("pendingLgus")}>
            Pending LGU ({pendingLgus.length})
          </Button>
        </div>
      </div>

      {selectedTab === "users" ? (
        <Card>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === 'admin' ? 'default' : 'outline'}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button size="sm" onClick={() => setSelectedUser(user)}>Manage Role</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : selectedTab === "lguRoles" ? (
        <Card>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lguUsers.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phoneNumber || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{user.role}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applied At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingLgus.map((lgu) => (
                  <TableRow key={lgu._id}>
                    <TableCell>{lgu.firstName} {lgu.lastName}</TableCell>
                    <TableCell>{lgu.email}</TableCell>
                    <TableCell>{lgu.phoneNumber}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{lgu.status}</Badge>
                    </TableCell>
                    <TableCell>{new Date(lgu.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="flex gap-2">
                    <Button
                      size="sm"
                      variant="default"
                      className="bg-green-500 hover:bg-green-600 text-white"
                      onClick={() => handleApproveReject(lgu._id, 'approved')}
                      disabled={processingId === lgu._id}
                    >
                      {processingId === lgu._id ? 'Processing...' : 'Approve'}
                    </Button>

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleApproveReject(lgu._id, 'rejected')}
                        disabled={processingId === lgu._id}
                      >
                        Reject
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {selectedUser && (
        <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
          <DialogContent>
            <DialogTitle>Update Role for {selectedUser.firstName}</DialogTitle>
            <DialogDescription>Select a new role for this user.</DialogDescription>
            <Select value={newRole || selectedUser.role} onValueChange={(value) => setNewRole(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {['admin', 'lgu', 'user'].map((role) => (
                  <SelectItem key={role} value={role}>{role}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedUser(null)}>Cancel</Button>
              
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AdminLguManagement;