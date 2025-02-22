import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../../ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../ui/table";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../ui/select";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "../../ui/dialog";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

const RBACManagement: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<"users" | "lguRoles">("users");
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState<string>("");

  useEffect(() => {
    fetch("http://localhost:5000/admin/users")
      .then((res) => res.json())
      .then((data: User[]) => {
        setUsers(data);
        console.log("Users Data:", data);
      });
  }, []);

  const updateUserRole = async (userId: string, newRole: string) => {
    const response = await fetch(`/api/users/${userId}/role`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });

    if (response.ok) {
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user._id === userId ? { ...user, role: newRole } : user))
      );
    }
  };

  const lguUsers = users.filter(user => user.role.includes("LGU"));

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <div className="flex space-x-4">
          <Button variant={selectedTab === "users" ? "default" : "outline"} onClick={() => setSelectedTab("users")}>
            Users ({users.length})
          </Button>
          <Button variant={selectedTab === "lguRoles" ? "default" : "outline"} onClick={() => setSelectedTab("lguRoles")}>
            LGU Roles ({lguUsers.length})
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
                      <Badge>{user.role}</Badge>
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
      ) : (
        <Card>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lguUsers.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user.firstName} {user.lastName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge>{user.role}</Badge>
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
                {[...new Set(users.map(user => user.role))].map((role) => (
                  <SelectItem key={role} value={role}>{role}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedUser(null)}>Cancel</Button>
              <Button onClick={() => {
                updateUserRole(selectedUser._id, newRole);
                setSelectedUser(null);
              }}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default RBACManagement;
