import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import { Progress } from '../../components/ui/progress'
import { Badge } from '../ui/badge'
import { toast, Toaster } from 'react-hot-toast'
import { 
  AlertCircle,
  CheckCircle2,
  XCircle,
  FileText,
  Download,
  ArrowLeft,
  Save
} from 'lucide-react'

interface Report {
  _id: string
  referenceNumber: string
  status: 'pending' | 'approved' | 'rejected'
  submissionType: 'form' | 'file'
  data: Record<string, any>
  files: Array<{
    filename: string
    url: string
    mimetype: string
  }>
  comments?: string
  formFields?: Array<{
    id: string
    label: string
    type: string
    required: boolean
  }>
}

export function FileUploader({ onFileSelect }: { onFileSelect: (file: File) => void }) {
    const [fileName, setFileName] = useState<string>('')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        setFileName(file.name)
        onFileSelect(file)
      }
    }

    return (
      <div>
        <input 
          type="file" 
          onChange={handleChange} 
          accept=".pdf" 
        />
        {fileName && <p>Selected File: {fileName}</p>}
      </div>
    )
}

export default function EditReport() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [report, setReport] = useState<Report | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [files, setFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(true)
  const [uploadProgress, setUploadProgress] = useState(0)

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/reports/${id}`)
        const data = await res.json()
        setReport(data)
        setFormData(data.data || {})
        setLoading(false)
      } catch (err : any) {
       toast.success(err);
        navigate('/reports')
      }
    }

    fetchReport()
  }, [id])

  const handleFormChange = (fieldId: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploadProgress(0)

    try {
      const formPayload = new FormData()
      
      if (report?.submissionType === 'file') {
        files.forEach(file => formPayload.append('files', file))
      } else {
        formPayload.append('data', JSON.stringify(formData))
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reports/${id}`, {
        method: 'PUT',
        body: formPayload,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (!response.ok) throw new Error('Submission failed')

     
    toast.success('Report updated successfully!')
      navigate('/reports')
    } catch (err) {
     
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="container mx-auto p-6 space-y-8">
          <Toaster
              position="top-right"
              gutter={32}
              containerClassName="!top-4 !right-6"
              toastOptions={{
                className: '!bg-[#1a1d24] !text-white !rounded-xl !border !border-[#2a2f38]',
              }}
            />
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">
          Edit Submission: {report?.referenceNumber}
        </h1>
        <Badge variant={report?.status === 'rejected' ? 'destructive' : 'secondary'}>
          {report?.status}
        </Badge>
      </div>

      {report?.comments && (
        <div className="p-4 bg-rose-50 rounded-lg border border-rose-100">
          <h3 className="flex items-center gap-2 text-rose-600 font-medium">
            <XCircle className="w-5 h-5" />
            Reviewer Comments
          </h3>
          <p className="mt-2 text-rose-700 whitespace-pre-wrap">
            {report.comments}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {report?.submissionType === 'file' ? (
          <div className="space-y-4">
            <Label>Upload New Documents</Label>
            <FileUploader
              value={files}
              onValueChange={setFiles}
              accept={{ 'application/pdf': ['.pdf'] }}
              maxFiles={5}
              maxSize={8 * 1024 * 1024}
            />
            
            {uploadProgress > 0 && (
              <Progress value={uploadProgress} className="h-2" />
            )}

            <div className="space-y-2">
              <Label>Previously Submitted Files</Label>
              {report.files.map(file => (
                <div key={file.url} className="flex items-center gap-2 p-2 bg-muted rounded">
                  <FileText className="w-4 h-4" />
                  <a 
                    href={file.url} 
                    download
                    className="text-sm hover:underline"
                  >
                    {file.filename}
                  </a>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {report?.formFields?.map(field => (
              <div key={field.id} className="space-y-2">
                <Label htmlFor={field.id}>
                  {field.label}
                  {field.required && <span className="text-rose-500 ml-1">*</span>}
                </Label>
                {field.type === 'textarea' ? (
                  <Textarea
                    id={field.id}
                    value={formData[field.id] || ''}
                    onChange={(e) => handleFormChange(field.id, e.target.value)}
                    required={field.required}
                  />
                ) : (
                  <Input
                    id={field.id}
                    type={field.type}
                    value={formData[field.id] || ''}
                    onChange={(e) => handleFormChange(field.id, e.target.value)}
                    required={field.required}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-4">
          <Button type="submit" className="gap-2">
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
          <Button 
            variant="secondary" 
            type="button"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}