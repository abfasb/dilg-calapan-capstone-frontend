import React, { useEffect, useState } from 'react'
import { Button } from "../../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table"
import { Badge } from "../../ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/dialog"
import { Progress } from "../../ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select"
import { BarChart } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar"

interface LGUUser {
  _id: string
  firstName: string
  lastName: string
  position: string
  barangay: string
  lastLogin: Date
  processedDocuments: number
  approvalRate: number
}

interface Document {
  referenceNumber: string
  status: 'pending' | 'approved' | 'rejected'
  citizenName: string
  submittedDate: Date
  processedDate: Date
  comments: string
  history: StatusHistory[]
}

interface StatusHistory {
  status: string
  updatedBy: string
  timestamp: Date
  comments?: string
}

const StaffOnboarding = () => {
  const [lguUsers, setLguUsers] = useState<LGUUser[]>([])
  const [selectedUser, setSelectedUser] = useState<LGUUser | null>(null)
  const [documents, setDocuments] = useState<Document[]>([])
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/form/users/haha`);
        if (!usersResponse.ok) throw new Error('Failed to fetch users');
        const usersData = await usersResponse.json();
        setLguUsers(usersData);
  
        const docsResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/form/lgudocuments`);
        if (!docsResponse.ok) {
          const errorData = await docsResponse.json();
          throw new Error(errorData.message || 'Failed to fetch documents');
        }
        const docsData = await docsResponse.json();
        setDocuments(docsData.documents || []);
  
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setDocuments([]);
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const getFilteredDocuments = () => {
    if (!selectedUser) return documents;
    return documents.filter(doc => 
      statusFilter === 'all' ? true : doc.status === statusFilter
    )
  }

  const calculateApprovalRate = (userId: string) => {
    const userDocs = documents.filter(doc => 
      doc.history?.some(h => h.updatedBy === userId)
    );
    const approved = userDocs.filter(d => d.status === 'approved').length
    const total = userDocs.length
    return total > 0 ? Math.round((approved / total) * 100) : 0
  }

  const getStatusCounts = () => ({
    pending: documents.filter(d => d?.status === 'pending').length,
    approved: documents.filter(d => d.status === 'approved').length,
    rejected: documents.filter(d => d.status === 'rejected').length,
  })

  if (isLoading) return <div className="p-8 text-center">Loading...</div>

  return (
    <div className="p-8 space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">LGU Staff Dashboard</h1>
        <Select onValueChange={(value) => setStatusFilter(value as any)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Total Processed</CardTitle>
            <BarChart className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{documents.length}</div>
            <p className="text-xs text-muted-foreground">All time documents</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Pending</CardTitle>
            <Badge variant="secondary" className="bg-yellow-100">!</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getStatusCounts().pending}</div>
            <Progress value={getStatusCounts().pending} className="h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Approved</CardTitle>
            <Badge variant="secondary" className="bg-green-100">✓</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getStatusCounts().approved}</div>
            <Progress value={getStatusCounts().approved} className="h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Rejected</CardTitle>
            <Badge variant="secondary" className="bg-red-100">✗</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getStatusCounts().rejected}</div>
            <Progress value={getStatusCounts().rejected} className="h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LGU Staff List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>LGU Staff Members</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {lguUsers.map((user) => (
              <div
                key={user._id}
                onClick={() => setSelectedUser(user)}
                className={`p-4 rounded-lg cursor-pointer transition-colors ${
                  selectedUser?._id === user._id ? 'bg-accent' : 'hover:bg-muted'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback>
                      {user.firstName[0]}{user.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.firstName} {user.lastName}</p>
                    <p className="text-sm text-muted-foreground">
                      {user.position} • {user.barangay}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Progress 
                        value={calculateApprovalRate(user._id)} 
                        className="h-2 w-24" 
                      />
                      <span className="text-xs">{calculateApprovalRate(user._id)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Documents Table */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              Documents {selectedUser && `- ${selectedUser.firstName}'s Cases`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference #</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Citizen</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getFilteredDocuments().map((doc) => (
                  <TableRow key={doc.referenceNumber}>
                    <TableCell className="font-medium">{doc.referenceNumber}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={doc.status === 'approved' ? 'default' : 'secondary'}
                        className={
                          doc.status === 'approved' ? 'bg-green-100 text-green-800' :
                          doc.status === 'rejected' ? 'bg-red-100 text-red-800' : ''
                        }
                      >
                        {doc.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{doc.citizenName}</TableCell>
                    <TableCell>
                      {new Date(doc.submittedDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">View History</Button>
                        </DialogTrigger>
                        <DialogContent className="max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Document History</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            {doc.history?.map((history, index) => (
                              <div key={index} className="p-4 rounded-lg bg-muted">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <p className="font-medium">{history.updatedBy}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {new Date(history.timestamp).toLocaleString()}
                                    </p>
                                  </div>
                                  <Badge variant="outline">{history.status}</Badge>
                                </div>
                                {history.comments && (
                                  <p className="mt-2 text-sm">{history.comments}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default StaffOnboarding