import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog'
import { Button } from '../../ui/button'
import { ScrollArea } from '../../ui/scroll-area'
import { Badge } from '../../ui/badge'
import { 
  ArrowUpRight, 
  FileText, 
  DownloadCloud, 
  User, 
  MapPin, 
  ClipboardList,
  Search,
  Image as ImageIcon
} from 'lucide-react'

interface ReportForm {
  _id: string
  title: string
  description: string
  fields: Array<{
    id: string
    type: string
    label: string
    required: boolean
    description: string
  }>
}

interface Response {
  _id: string
  referenceNumber: string
  data: Record<string, any> | null
  files: Array<{
    fileName: string
    fileUrl: string
    fileType: string
  }>
  bulkFile: {
    fileName: string
    fileUrl: string
    fileType: string
  } | null
  status: string
  user: {
    firstName: string
    lastName: string
    barangay: string
  }
  history?: Array<{ 
    status: string
    updatedBy: string
    document: string
    timestamp: string
    comments: string
    _id: string
  }>
}

const AISummaryReports: React.FC = () => {
  const [reports, setReports] = useState<ReportForm[]>([])
  const [selectedReport, setSelectedReport] = useState<ReportForm | null>(null)
  const [responses, setResponses] = useState<Response[]>([])
  const [selectedResponse, setSelectedResponse] = useState<Response | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const fetchReports = async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/analytics/admin/reports`)
      const data = await response.json()
      setReports(data)
    }
    fetchReports()
  }, [])

  const handleViewResponses = async (reportId: string) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/analytics/admin/reports/approved?formId=${reportId}`)
    const data = await response.json()
    
    // Transform files structure to match frontend interface
    const transformedData = data.map((res: any) => ({
      ...res,
      files: res.files.map((file: any) => ({
        fileName: file.filename,
        fileUrl: file.url,
        fileType: file.mimetype
      }))
    }))

    setSelectedReport(reports.find(r => r._id === reportId) || null)
    setResponses(transformedData)
  }

  const filteredResponses = responses.filter(response =>
    response.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    response.user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    response.user.lastName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Get image fields from the form definition
  const getImageFields = () => {
    return selectedReport?.fields.filter(field => field.type === 'image') || []
  }

  return (
    <div className="p-8 bg-muted/40 min-h-screen">
      <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Document Analytics</h1>
            <p className="text-muted-foreground mt-2">
              Comprehensive overview of all submitted reports
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {reports.map(report => (
            <Card 
              key={report._id}
              className="hover:shadow-lg transition-shadow duration-300 group"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <ClipboardList className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{report.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => handleViewResponses(report._id)}
                  className="w-full gap-2"
                  variant="outline"
                >
                  <ArrowUpRight className="w-4 h-4" />
                  View Insights
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
        <DialogContent className="max-w-6xl h-[80vh] flex flex-col">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5" />
                {selectedReport?.title} Responses
              </DialogTitle>
            </DialogHeader>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search responses..."
                  className="pl-10 pr-4 py-2 w-full rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <ScrollArea className="flex-1 pr-4">
              <Table className="relative">
                <TableHeader className="sticky top-0 bg-background">
                  <TableRow>
                    <TableHead className="w-[160px]">Reference #</TableHead>
                    <TableHead>Citizen</TableHead>
                    <TableHead>Barangay</TableHead>
                    <TableHead>Attachments</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResponses.map(response => (
                    <TableRow key={response._id} className="hover:bg-muted/50">
                      <TableCell>
                        <Badge variant="outline" className="font-mono">
                          #{response.referenceNumber}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          {response.user.firstName} {response.user.lastName}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          {response.user.barangay}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {response.files.length > 0 && (
                            <Badge variant="secondary" className="gap-1">
                              <FileText className="w-3 h-3" />
                              {response.files.length}
                            </Badge>
                          )}
                          {response.bulkFile && (
                            <Badge variant="secondary" className="gap-1">
                              <DownloadCloud className="w-3 h-3" />
                              Bulk File
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          onClick={() => setSelectedResponse(response)}
                          size="sm"
                          className="gap-2"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </DialogContent>
        </Dialog>

        <Dialog open={!!selectedResponse} onOpenChange={() => setSelectedResponse(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Response Details
              </DialogTitle>
            </DialogHeader>
            
            {selectedResponse?.data && Object.keys(selectedResponse.data).length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(selectedResponse.data).map(([key, value]) => {
                  const field = selectedReport?.fields.find(f => f.id === key)
                  const displayLabel = field?.label || key
                  const isImageField = field?.type === 'image'

                  const imageFile = selectedResponse.files.find(file => 
                    file.fileUrl.includes(value as string)
                  )
                  
                  return (
                    <div key={key} className="space-y-1 p-4 bg-muted/30 rounded-lg">
                      <p className="text-sm font-medium text-muted-foreground">
                        {displayLabel}
                      </p>
                      {isImageField && imageFile ? (
                        <div className="mt-2">
                          <a 
                            href={imageFile.fileUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="block relative group"
                          >
                            <img
                              src={imageFile.fileUrl}
                              alt={displayLabel}
                              className="h-32 w-full object-cover rounded-lg border"
                            />
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="text-white text-sm">View Full Image</span>
                            </div>
                          </a>
                        </div>
                      ) : (
                        <p className="font-medium">
                          {value?.toString() || 'N/A'}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : selectedResponse?.bulkFile ? (
              <div className="space-y-6">
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="bg-background p-3 rounded-lg">
                    <DownloadCloud className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">{selectedResponse.bulkFile.fileName}</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedResponse.bulkFile.fileType.toUpperCase()}
                    </p>
                  </div>
                </div>
              </div>
              <div className="border rounded-lg overflow-hidden">
                <iframe 
                  src={selectedResponse.bulkFile.fileUrl}
                  className="w-full h-80"
                  title={selectedResponse.bulkFile.fileName}
                />
              </div>
              <Button 
                asChild
                variant="outline"
                className="w-full gap-2"
              >
                <a 
                  href={selectedResponse.bulkFile.fileUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <DownloadCloud className="w-4 h-4" />
                  Full Overview
                </a>
              </Button>
            </div>
            ) : (
              <div className="text-center p-4 text-muted-foreground">
                No form data or files available for this response.
              </div>
            )}

            {(selectedResponse?.files && selectedResponse.files.length > 0) && (
              <div className="mt-6">
                <h3 className="font-medium mb-4">Attached Files:</h3>
                <div className="space-y-2">
                  {selectedResponse.files.map((file, index) => {
                    const isAlreadyDisplayed = Object.values(selectedResponse.data || {})
                      .some(value => file.fileUrl.includes(value as string))

                    if (isAlreadyDisplayed) return null

                    return (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          {file.fileType.startsWith('image/') ? (
                            <ImageIcon className="w-5 h-5 text-muted-foreground" />
                          ) : (
                            <FileText className="w-5 h-5 text-muted-foreground" />
                          )}
                          <span className="font-medium">{file.fileName}</span>
                        </div>
                        <Button
                          asChild
                          size="sm"
                          variant="outline"
                        >
                          <a 
                            href={file.fileUrl}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {file.fileType.startsWith('image/') ? 'View' : 'Download'}
                          </a>
                        </Button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {selectedResponse?.history && (
              <div className="mt-6">
                <h3 className="font-medium mb-4">Document History:</h3>
                <div className="space-y-3">
                  {selectedResponse.history.map((entry, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div>
                        <p className="text-sm font-medium">{entry.status}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(entry.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {entry.updatedBy || 'System'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default AISummaryReports