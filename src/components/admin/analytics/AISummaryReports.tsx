import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog'
import { Button } from '../../ui/button'

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
}

const AISummaryReports: React.FC = () => {
  const [reports, setReports] = useState<ReportForm[]>([])
  const [selectedReport, setSelectedReport] = useState<ReportForm | null>(null)
  const [responses, setResponses] = useState<Response[]>([])
  const [selectedResponse, setSelectedResponse] = useState<Response | null>(null)

  useEffect(() => {
    const fetchReports = async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/analytics/admin/reports`);
      const data = await response.json()
      setReports(data)
    }
    fetchReports()
  }, [])

  const handleViewResponses = async (reportId: string) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/analytics/admin/reports/approved?formId=${reportId}`)
    const data = await response.json()
    setSelectedReport(reports.find(r => r._id === reportId) || null)
    setResponses(data)
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Document Reports</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map(report => (
          <Card key={report._id}>
            <CardHeader>
              <CardTitle>{report.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={() => handleViewResponses(report._id)}>
                View Approved Responses
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedReport?.title} Responses</DialogTitle>
          </DialogHeader>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference #</TableHead>
                <TableHead>Citizen Name</TableHead>
                <TableHead>Barangay</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {responses.map(response => (
                <TableRow key={response._id}>
                  <TableCell>{response.referenceNumber}</TableCell>
                  <TableCell>{response.user.firstName} {response.user.lastName}</TableCell>
                  <TableCell>{response.user.barangay}</TableCell>
                  <TableCell>
                    <Button onClick={() => setSelectedResponse(response)}>
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedResponse} onOpenChange={() => setSelectedResponse(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Response Details</DialogTitle>
          </DialogHeader>
          
          {selectedResponse?.data ? (
            <div className="space-y-4">
              {Object.entries(selectedResponse.data).map(([key, value]) => (
                <div key={key}>
                  <p className="font-medium">{key}</p>
                  <p>{value}</p>
                </div>
              ))}
            </div>
          ) : (
            selectedResponse?.bulkFile && (
              <div>
                <p className="font-medium">Attached File:</p>
                <iframe 
                  src={selectedResponse.bulkFile.fileUrl}
                  className="w-full h-96"
                  title={selectedResponse.bulkFile.fileName}
                />
              </div>
            )
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AISummaryReports;