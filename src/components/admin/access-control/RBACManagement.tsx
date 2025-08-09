import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../ui/table";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../ui/select";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogHeader } from "../../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { Input } from "../../ui/input";
import { Search, UserCheck, UserCog, UserX, CheckCircle, XCircle, Loader2, ShieldAlert, Trash2, CheckCircleIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "../../ui/avatar";
import { toast, Toaster } from 'react-hot-toast';
import { Skeleton } from "../../ui/skeleton";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "../../ui/dropdown-menu";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  phoneNumber?: string;
  position: string;
  firstname?: string;
  isActive?: boolean;
  freezeUntil?: string;
}

interface PendingLgu {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  status: string;
  createdAt: string;
  position: string;
}

const AdminLguManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("users");
  const [users, setUsers] = useState<User[]>([]);
  const [pendingLgus, setPendingLgus] = useState<PendingLgu[]>([]);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    id: string | null;
    action: 'approved' | 'rejected' | null;
    name: string;
  }>({ isOpen: false, id: null, action: null, name: '' });
  
  const [accountActionDialog, setAccountActionDialog] = useState<{
    isOpen: boolean;
    user: User | null;
    action: 'freeze' | 'delete' | null;
    freezeDuration: string;
  }>({
    isOpen: false,
    user: null,
    action: null,
    freezeDuration: '1'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([fetchUsers(), fetchPendingLgus()]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/admin/users");
      const data = await res.json();
      setUsers(data);
      return data;
    } catch (error) {
      toast.error("Failed to fetch users");
      return [];
    }
  };

  const fetchPendingLgus = async () => {
    try {
      const res = await fetch("http://localhost:5000/lgu/pendingLgus");
      const data = await res.json();
      setPendingLgus(data);
      return data;
    } catch (error) {
      toast.error("Failed to fetch pending LGUs");
      return [];
    }
  };

  const handleApproveReject = async (id: string, status: 'approved' | 'rejected') => {
    setProcessingId(id);
    try {
      const response = await fetch(`http://localhost:5000/lgu/pendingLgus/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update status');
      }

      setPendingLgus(prev => prev.filter(lgu => lgu._id !== id));

      if (status === 'approved') {
        const approvedLgu = pendingLgus.find(lgu => lgu._id === id);
        if (approvedLgu) {
          setUsers(prev => [...prev, {
            _id: id,
            name: `${approvedLgu.firstName} ${approvedLgu.lastName}`,
            email: approvedLgu.email,
            role: 'lgu',
            createdAt: new Date().toISOString(),
            phoneNumber: approvedLgu.phoneNumber,
            position: approvedLgu.position || 'N/A',
          }]);
        }
      }

      toast.success(`LGU ${status === 'approved' ? 'approved' : 'rejected'} successfully`);
      setConfirmDialog({ isOpen: false, id: null, action: null, name: '' });

    } catch (error: any) {
      console.error('Approval error:', error);
      toast.error(error.message || `Failed to ${status} LGU`);
      fetchPendingLgus();
      fetchUsers();
    } finally {
      setProcessingId(null);
    }
  };

  const openConfirmDialog = (id: string, action: 'approved' | 'rejected', name: string) => {
    setConfirmDialog({ isOpen: true, id, action, name });
  };

  const openAccountActionDialog = (user: User, action: 'freeze' | 'delete') => {
    setAccountActionDialog({
      isOpen: true,
      user,
      action,
      freezeDuration: '1'
    });
  };

  const closeAccountActionDialog = () => {
    setAccountActionDialog({
      isOpen: false,
      user: null,
      action: null,
      freezeDuration: '1'
    });
  };

  const handleAccountAction = async () => {
    const { user, action, freezeDuration } = accountActionDialog;
    if (!user) return;
    
    setProcessingId(user._id);
    
    try {
      if (action === 'freeze') {
        const days = parseInt(freezeDuration);
        const freezeUntil = new Date();
        freezeUntil.setDate(freezeUntil.getDate() + days);
        
        const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/freeze-account/${user._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ freezeDuration: days })
        });
        
        if (!response.ok) throw new Error('Failed to freeze account');
        
        setUsers(users.map(u => 
          u._id === user._id ? { ...u, isActive: false, freezeUntil: freezeUntil.toISOString() } : u
        ));

        toast.success(`Account frozen for ${days} day${days !== 1 ? 's' : ''}`, {
                icon: <CheckCircleIcon className="w-6 h-6 text-green-400" />,
                style: {
                  background: '#1a1d24',
                  color: '#fff',
                  border: '1px solid #2a2f38',
                  padding: '16px',
                },
                duration: 8000,
              });
              window.location.reload(); 
      } 
      else if (action === 'delete') {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/delete-account/${user._id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!response.ok) throw new Error('Failed to delete account');
        
        setUsers(users.filter(u => u._id !== user._id));
        toast.success('Account Deleted Successfully!', {
                icon: <CheckCircleIcon className="w-6 h-6 text-green-400" />,
                style: {
                  background: '#1a1d24',
                  color: '#fff',
                  border: '1px solid #2a2f38',
                  padding: '16px',
                },
                duration: 4000,
              });

              window.location.reload(); 
      }
      
      closeAccountActionDialog();
    } catch (error: any) {
      toast.error(error.message || 'Action failed');
    } finally {
      setProcessingId(null);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredLguUsers = filteredUsers.filter(user => user.role.includes("lgu"));

  const filteredPendingLgus = pendingLgus.filter(lgu => 
    `${lgu.firstName} ${lgu.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) || 
    lgu.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getStatusBadge = (user: User) => {
    if (user.isActive) {
      return <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>;
    } else {
       if (user.freezeUntil) {
    const freezeDate = new Date(user.freezeUntil);
    const now = new Date();
    
    if (freezeDate.getTime() === new Date(0).getTime()) {
          return <Badge variant="destructive">Permanently Frozen</Badge>;
        } else if (freezeDate > now) {
          return (
            <Badge variant="destructive" className="bg-yellow-100 text-yellow-800">
              Frozen until {freezeDate.toLocaleDateString()}
            </Badge>
          );
        }
      } else {
        return <Badge className=" bg-green-400">Normal</Badge>;
      }
    }
  };

  return (
    <div className="p-6 space-y-6">
       <Toaster
              position="top-right"
              gutter={32}
              containerClassName="!top-4 !right-6"
              toastOptions={{
                className: '!bg-[#1a1d24] !text-white !rounded-xl !border !border-[#2a2f38]',
              }}
            />
      <Card className="border-0 shadow-md">
        <CardHeader className="bg-slate-50 rounded-t-lg">
          <CardTitle className="text-2xl font-bold text-slate-800">LGU Management</CardTitle>
          <CardDescription className="text-slate-600">
            Manage LGU users, approvals and roles in the system
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-6">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search users, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full"
              />
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="users" className="data-[state=active]:bg-slate-100">
                <div className="flex items-center gap-2">
                  <UserCog className="h-4 w-4" />
                  <span>All Users</span>
                  <Badge variant="secondary" className="ml-1 bg-slate-200 text-slate-700">
                    {users.length}
                  </Badge>
                </div>
              </TabsTrigger>
              <TabsTrigger value="lguRoles" className="data-[state=active]:bg-slate-100">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4" />
                  <span>Active LGU</span>
                  <Badge variant="secondary" className="ml-1 bg-slate-200 text-slate-700">
                    {filteredLguUsers.length}
                  </Badge>
                </div>
              </TabsTrigger>
              <TabsTrigger value="pendingLgus" className="data-[state=active]:bg-slate-100">
                <div className="flex items-center gap-2">
                  <UserX className="h-4 w-4" />
                  <span>Pending LGU</span>
                  <Badge variant="secondary" className="ml-1 bg-slate-200 text-slate-700">
                    {pendingLgus.length}
                  </Badge>
                </div>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="mt-0">
              <Card className="border shadow-sm">
                <CardContent className="p-0">
                  {isLoading ? (
                    <div className="p-4 space-y-4">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center space-x-4">
                          <Skeleton className="h-12 w-12 rounded-full" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-[250px]" />
                            <Skeleton className="h-4 w-[200px]" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-slate-50">
                          <TableHead className="w-[250px]">Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Created At</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                              No users found matching your search
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredUsers.map((user) => (
                            <TableRow key={user._id} className="hover:bg-slate-50 transition-colors">
                              <TableCell className="font-medium flex items-center gap-3">
                                <Avatar className="h-10 w-10 bg-slate-100 text-slate-600">
                                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                                </Avatar>
                                {user.name}
                              </TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>
                                <Badge
                                  variant={user.role === 'admin' ? 'default' : 'outline'}
                                  className={`${
                                    user.role === 'admin'
                                      ? 'bg-blue-100 text-blue-800 hover:bg-blue-100'
                                      : user.role === 'lgu'
                                      ? 'bg-green-100 text-green-800 hover:bg-green-100'
                                      : 'bg-slate-100 text-slate-800 hover:bg-slate-100'
                                  }`}
                                >
                                  {user.role}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {getStatusBadge(user)}
                              </TableCell>
                              <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button 
                                        size="sm" 
                                        variant="outline"
                                        disabled={user.role === 'admin'}
                                      >
                                        Account
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                      <DropdownMenuItem 
                                        onClick={() => openAccountActionDialog(user, 'freeze')}
                                      >
                                        <ShieldAlert className="mr-2 h-4 w-4" />
                                        {'Freeze Account'}
                                      </DropdownMenuItem>
                                      <DropdownMenuItem 
                                        onClick={() => openAccountActionDialog(user, 'delete')}
                                        className="text-red-600 focus:bg-red-50 focus:text-red-700"
                                      >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete Account
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="lguRoles" className="mt-0">
              <Card className="border shadow-sm">
                <CardContent className="p-0">
                  {isLoading ? (
                    <div className="p-4 space-y-4">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center space-x-4">
                          <Skeleton className="h-12 w-12 rounded-full" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-[250px]" />
                            <Skeleton className="h-4 w-[200px]" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-slate-50">
                          <TableHead className="w-[250px]">Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Position</TableHead>
                          <TableHead>Role</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredLguUsers.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                              No LGU users found matching your search
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredLguUsers.map((user) => (
                            <TableRow key={user._id} className="hover:bg-slate-50 transition-colors">
                              <TableCell className="font-medium flex items-center gap-3">
                                <Avatar className="h-10 w-10 bg-slate-100 text-slate-600">
                                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                                </Avatar>
                                {user.name}
                              </TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>{user.phoneNumber || 'N/A'}</TableCell>
                              <TableCell>{user.position || 'N/A'}</TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className="bg-green-100 text-green-800 hover:bg-green-100"
                                >
                                  {user.role}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pendingLgus" className="mt-0">
              <Card className="border shadow-sm">
                <CardContent className="p-0">
                  {isLoading ? (
                    <div className="p-4 space-y-4">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center space-x-4">
                          <Skeleton className="h-12 w-12 rounded-full" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-[250px]" />
                            <Skeleton className="h-4 w-[200px]" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-slate-50">
                          <TableHead className="w-[250px]">Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Position</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Applied At</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredPendingLgus.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                              No pending LGU applications found matching your search
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredPendingLgus.map((lgu) => (
                            <TableRow key={lgu._id} className="hover:bg-slate-50 transition-colors">
                              <TableCell className="font-medium flex items-center gap-3">
                                <Avatar className="h-10 w-10 bg-slate-100 text-slate-600">
                                  <AvatarFallback>{`${lgu.firstName[0]}${lgu.lastName[0]}`.toUpperCase()}</AvatarFallback>
                                </Avatar>
                                {lgu.firstName} {lgu.lastName}
                              </TableCell>
                              <TableCell>{lgu.email}</TableCell>
                              <TableCell>{lgu.phoneNumber}</TableCell>
                              <TableCell>{lgu.position}</TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                >
                                  {lgu.status}
                                </Badge>
                              </TableCell>
                              <TableCell>{new Date(lgu.createdAt).toLocaleDateString()}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    size="sm"
                                    className="bg-green-500 hover:bg-green-600 text-white"
                                    onClick={() => openConfirmDialog(
                                      lgu._id, 
                                      'approved', 
                                      `${lgu.firstName} ${lgu.lastName}`
                                    )}
                                    disabled={processingId === lgu._id}
                                  >
                                    {processingId === lgu._id ? (
                                      <Loader2 className="h-4 w-4 animate-spin mr-1" />
                                    ) : (
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                    )}
                                    Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => openConfirmDialog(
                                      lgu._id, 
                                      'rejected', 
                                      `${lgu.firstName} ${lgu.lastName}`
                                    )}
                                    disabled={processingId === lgu._id}
                                  >
                                    {processingId === lgu._id ? (
                                      <Loader2 className="h-4 w-4 animate-spin mr-1" />
                                    ) : (
                                      <XCircle className="h-4 w-4 mr-1" />
                                    )}
                                    Reject
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.isOpen}
        onOpenChange={(open) => {
          if (!open) {
            setConfirmDialog({ isOpen: false, id: null, action: null, name: '' });
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {confirmDialog.action === 'approved' ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              Confirm {confirmDialog.action === 'approved' ? 'Approval' : 'Rejection'}
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to {confirmDialog.action === 'approved' ? 'approve' : 'reject'} the LGU application for <span className="font-medium">{confirmDialog.name}</span>?
              {confirmDialog.action === 'rejected' && (
                <p className="mt-2 text-red-500">
                  This action cannot be undone. The user will need to apply again.
                </p>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-between">
            <Button
              variant="outline"
              onClick={() => setConfirmDialog({ isOpen: false, id: null, action: null, name: '' })}
              className="mt-2 sm:mt-0"
            >
              Cancel
            </Button>
            <Button
              onClick={() => confirmDialog.id && confirmDialog.action && 
                handleApproveReject(confirmDialog.id, confirmDialog.action)}
              variant={confirmDialog.action === 'approved' ? 'default' : 'destructive'}
              className={confirmDialog.action === 'approved' ? 'bg-green-600 hover:bg-green-700' : ''}
            >
              {processingId === confirmDialog.id ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  {confirmDialog.action === 'approved' ? 'Approve' : 'Reject'} Application
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Account Action Dialog */}
      <Dialog 
        open={accountActionDialog.isOpen} 
        onOpenChange={(open) => {
          if (!open) {
            closeAccountActionDialog();
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {accountActionDialog.action === 'freeze' ? (
                <>
                  <ShieldAlert className="h-5 w-5 text-yellow-500" />
                  Freeze Account
                </>
              ) : (
                <>
                  <Trash2 className="h-5 w-5 text-red-500" />
                  Delete Account
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {accountActionDialog.action === 'freeze' ? (
                `You are about to freeze ${accountActionDialog.user?.name}'s account. 
                Select freeze duration:`
              ) : (
                `Are you sure you want to permanently delete ${accountActionDialog.user?.name}'s account? 
                This action cannot be undone.`
              )}
            </DialogDescription>
          </DialogHeader>
          
          {accountActionDialog.action === 'freeze' && (
            <div className="py-4">
              <Select 
                value={accountActionDialog.freezeDuration} 
                onValueChange={(value) => setAccountActionDialog(prev => ({ ...prev, freezeDuration: value }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select freeze duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 day</SelectItem>
                  <SelectItem value="3">3 days</SelectItem>
                  <SelectItem value="7">1 week</SelectItem>
                  <SelectItem value="14">2 weeks</SelectItem>
                  <SelectItem value="30">1 month</SelectItem>
                  <SelectItem value="0">Permanent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
          <DialogFooter className="sm:justify-between">
            <Button
              variant="outline"
              onClick={closeAccountActionDialog}
              className="mt-2 sm:mt-0"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAccountAction}
              variant={accountActionDialog.action === 'delete' ? 'destructive' : 'default'}
              className={accountActionDialog.action === 'freeze' ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
              disabled={processingId === accountActionDialog.user?._id}
            >
              {processingId === accountActionDialog.user?._id ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {accountActionDialog.action === 'freeze' ? 'Freeze Account' : 'Delete Account'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminLguManagement;