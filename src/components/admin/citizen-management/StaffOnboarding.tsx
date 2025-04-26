import { useEffect, useState } from 'react'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../../ui/table'
import { Badge } from '../../ui/badge'
import { Button } from '../../ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../ui/dropdown-menu'
import { Input } from '../../ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../ui/dialog'
import { Progress } from '../../ui/progress'
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '../../ui/tooltip'
import { Pagination } from '../../ui/pagination'
import { 
  MoreVertical,
  Search,
  Filter,
  ChevronDown,
  BarChart,
  Info,
  AlertCircle,
  CheckCircle2,
  XCircle,
  FileText,
  Download,
  Clock,
  User
} from 'lucide-react'

interface StatusHistory {
  _id: string
  documentId: string
  documentName: string
  referenceNumber: string
  previousStatus: string
  newStatus: 'approved' | 'pending' | 'rejected'
  updatedBy: string
  timestamp: string
  notes?: string
}

interface FormDocument {
  _id: string
  referenceNumber: string
  formId: string
  userId: string
  status: 'approved' | 'pending' | 'rejected'
  createdAt: string
  statusHistories: StatusHistory[]
  documentName?: string
  notes?: string
  files?: Array<{ url: string; name: string }>;
  signature?: { url: string; timestamp: string };
  assignedLgu?: string;
}

interface LGUUser {
  _id: string
  email: string
  role: string
  fullName: string
  lastName: string
  firstName: string
  barangay: string
  position: string
  phoneNumber: string
  createdAt: string
  updatedAt: string
  documents: FormDocument[]
}

const StaffOnboarding: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [selectedLGU, setSelectedLGU] = useState<LGUUser | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(5)
  const [sortConfig, setSortConfig] = useState<{ key: keyof LGUUser; direction: 'asc' | 'desc' } | null>(null)
  const [lgus, setLgus] = useState<LGUUser[]>([])
  const [loading, setLoading] = useState(true)

  const calculateApprovalRate = (documents: FormDocument[]) => {
    const total = documents.length;
    if (total === 0) return 0;
    const approved = documents.filter(doc => doc.status === 'approved').length;
    return Math.round((approved / total) * 100);
  };

  useEffect(() => {
    const fetchLGUs = async () => {
      try {
        const usersRes = await fetch(`${import.meta.env.VITE_API_URL}/api/form/users/haha`);
        const users: LGUUser[] = await usersRes.json();
  
        const lguUsers = await Promise.all(users.map(async (user) => {
          try {
            const fullName = `${user.firstName} ${user.lastName}`;
            const docsRes = await fetch(
              `${import.meta.env.VITE_API_URL}/api/form/lgudocuments?lguName=${encodeURIComponent(fullName)}`
            );
            const documents: FormDocument[] = await docsRes.json();
  
            const docsWithHistory = await Promise.all(documents.map(async (doc) => {
              try {
                const historyRes = await fetch(
                  `${import.meta.env.VITE_API_URL}/api/form/statushistories/haha?formId=${doc._id}`
                );
                const statusHistories: StatusHistory[] = await historyRes.json();
                
                return {
                  ...doc,
                  statusHistories: statusHistories.sort((a, b) => 
                    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                  )
                };
              } catch (error) {
                return { ...doc, statusHistories: [] };
              }
            }));
  
            return {
              ...user,
              documents: docsWithHistory.sort((a, b) => 
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
              ),
              approvalRate: calculateApprovalRate(docsWithHistory)
            };
          } catch (error) {
            return { ...user, documents: [], approvalRate: 0 };
          }
        }));
  
        setLgus(lguUsers);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLGUs();
  }, []);

  const getStatusBadge = (status: string, count: number) => {
    const statusMap = {
      approved: { icon: CheckCircle2, color: 'bg-emerald-100 text-emerald-800' },
      pending: { icon: AlertCircle, color: 'bg-amber-100 text-amber-800' },
      rejected: { icon: XCircle, color: 'bg-red-100 text-red-800' },
      unknown: { icon: Clock, color: 'bg-gray-100 text-gray-800' }
    }

    const safeStatus = Object.keys(statusMap).includes(status) ? status : 'unknown'
    const { icon: Icon, color } = statusMap[safeStatus as keyof typeof statusMap]

    return (
      <Badge className={`${color} gap-1 hover:${color}`}>
        {Icon && <Icon className="h-4 w-4" />}
        {count} {safeStatus.charAt(0).toUpperCase() + safeStatus.slice(1)}
      </Badge>
    )
  }

  const getStatusCounts = (documents: FormDocument[]) => {
    return documents.reduce((acc, doc) => {
      acc[doc.status] = (acc[doc.status] || 0) + 1
      return acc
    }, { approved: 0, pending: 0, rejected: 0 })
  }

  const getApprovalRate = (approved: number, rejected: number) => {
    const total = approved + rejected
    return total > 0 ? Math.round((approved / total) * 100) : 0
  }

  const handleSort = (key: keyof LGUUser) => {
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig?.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const sortedData = [...lgus].sort((a, b) => {
    if (!sortConfig) return 0
    const aValue = a[sortConfig.key]
    const bValue = b[sortConfig.key]
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
    return 0
  })

  const filteredData = sortedData.filter(lgu => {
    const matchesSearch = 
      lgu.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lgu.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lgu.barangay.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (!statusFilter) return matchesSearch
    return matchesSearch && lgu.documents.some(doc => doc.status === statusFilter)
  })

  const paginatedData = filteredData
    .slice((currentPage - 1) * pageSize, currentPage * pageSize)

  if (loading) return <div>Loading...</div>

  return (
    <TooltipProvider> 
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">LGU Management Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Track and manage all LGU submissions and approvals
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search LGUs..."
              className="pl-8 pr-4 py-2 w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter size={16} />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                All
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('approved')}>
                Approved
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('pending')}>
                Pending
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('rejected')}>
                Rejected
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead className="cursor-pointer" onClick={() => handleSort('lastName')}>
                <div className="flex items-center gap-1">
                  LGU Name
                  <ChevronDown className={`h-4 w-4 transition-transform ${
                    sortConfig?.key === 'lastName' && sortConfig.direction === 'desc' ? 'rotate-180' : ''
                  }`} />
                </div>
              </TableHead>
              <TableHead>Position</TableHead>
              <TableHead className="text-center">Submissions</TableHead>
              <TableHead className="text-center">Approval Rate</TableHead>
              <TableHead>Last Submission</TableHead>
              <TableHead>Status Overview</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((lgu) => {
              const statusCounts = getStatusCounts(lgu.documents)
              const totalSubmissions = statusCounts.approved + statusCounts.rejected
              const approvalRate = getApprovalRate(statusCounts.approved, statusCounts.rejected)
              
              return (
                <TableRow 
                  key={lgu._id} 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => {
                    setSelectedLGU(lgu)
                    setSelectedStatus(null)
                  }}
                >
                  <TableCell className="font-medium">{`${lgu.firstName} ${lgu.lastName}`}</TableCell>
                  <TableCell>{lgu.position}</TableCell>
                  <TableCell className="text-center">{totalSubmissions}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Progress value={approvalRate} className="h-2 w-20" />
                      <span>{approvalRate}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {lgu.documents.length > 0 
                      ? new Date(lgu.documents[0].createdAt).toLocaleDateString()
                      : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Total Processed: {lgu.documents.length}</span>
                        <span className="text-sm text-muted-foreground">
                          ({calculateApprovalRate(lgu.documents)}% approval)
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="h-8 px-3 text-xs"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedLGU(lgu)
                            setSelectedStatus('approved')
                          }}
                        >
                          Approved ({statusCounts.approved})
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="h-8 px-3 text-xs"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedLGU(lgu)
                            setSelectedStatus('rejected')
                          }}
                        >
                          Rejected ({statusCounts.rejected})
                        </Button>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>Send Reminder</DropdownMenuItem>
                        <DropdownMenuItem>View History</DropdownMenuItem>
                        <DropdownMenuItem>Edit Details</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>

        {selectedLGU && (
          <Dialog open={!!selectedLGU} onOpenChange={() => {
            setSelectedLGU(null)
            setSelectedStatus(null)
          }}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <BarChart className="h-6 w-6" />
                  {selectedLGU.firstName} {selectedLGU.lastName}'s Submissions
                  {selectedStatus && (
                    <Badge className="ml-2">
                      {selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1)}
                    </Badge>
                  )}
                </DialogTitle>
                <DialogDescription>
                  Barangay: {selectedLGU.barangay} • Position: {selectedLGU.position}
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-4 rounded-lg bg-muted">
                  <h3 className="flex items-center gap-2 font-medium">
                    <FileText className="h-5 w-5" />
                    Total Submissions
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        Includes all submitted forms in the last 12 months
                      </TooltipContent>
                    </Tooltip>
                  </h3>
                  <p className="text-2xl font-bold mt-2">{selectedLGU.documents.length}</p>
                </div>
                
                <div className="p-4 rounded-lg bg-muted">
                  <h3 className="flex items-center gap-2 font-medium">
                    <User className="h-5 w-5" />
                    Contact Information
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        Contact details for this LGU representative
                      </TooltipContent>
                    </Tooltip>
                  </h3>
                  <p className="mt-2">{selectedLGU.phoneNumber}</p>
                  <p className="text-sm text-muted-foreground">{selectedLGU.email}</p>
                </div>

                <div className="p-4 rounded-lg bg-muted">
                  <h3 className="flex items-center gap-2 font-medium">
                    <CheckCircle2 className="h-5 w-5" />
                    Approval Rate
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        Percentage of approved submissions
                      </TooltipContent>
                    </Tooltip>
                  </h3>
                  <p className="text-2xl font-bold mt-2">
                    {getApprovalRate(
                      selectedLGU.documents.filter(d => d.status === 'approved').length,
                      selectedLGU.documents.filter(d => d.status === 'rejected').length
                    )}%
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {selectedLGU.documents
                  .filter(doc => !selectedStatus || doc.status === selectedStatus)
                  .map((document) => (
                    <div key={document._id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h3 className="font-medium">{document.documentName || 'Unnamed Document'}</h3>
                          <p className="text-sm text-muted-foreground">
                            Reference: {document.referenceNumber}
                          </p>
                        </div>
                        {getStatusBadge(document.status, 1)}
                      </div>

                      <div className="space-y-4">
                        {document.statusHistories.map((history) => (
                          <div key={history._id} className="border-l-2 pl-4 ml-2">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-sm font-medium">
                                  Status changed from {history.previousStatus} to {history.newStatus}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  By {history.updatedBy} •{' '}
                                  {new Date(history.timestamp).toLocaleDateString()}
                                </p>
                                {history.notes && (
                                  <p className="text-sm mt-1 text-muted-foreground">
                                    Note: {history.notes}
                                  </p>
                                )}
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreVertical size={16} />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <DropdownMenuItem>View Document</DropdownMenuItem>
                                  <DropdownMenuItem>Download PDF</DropdownMenuItem>
                                  <DropdownMenuItem>Add Comment</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </DialogContent>
          </Dialog>
        )}

        <div className="flex justify-between items-center p-4">
          <div className="text-sm text-muted-foreground">
            Showing {paginatedData.length} of {filteredData.length} LGUs
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredData.length / pageSize)}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
    </TooltipProvider>
  )
}

export default StaffOnboarding