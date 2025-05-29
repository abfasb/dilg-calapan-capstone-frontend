import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../../components/ui/card';
import { Badge } from '../ui/badge';
import { toast, Toaster } from 'react-hot-toast';
import { 
  XCircle,
  ArrowLeft,
  Save,
  Upload,
  File,
  FileText,
  AlertCircle,
  CheckCircle,
  Loader2,
  ClipboardList,
  XIcon,
  Eye
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Separator } from "../../components/ui/separator";
import { Progress } from "../../components/ui/progress";
import { cn } from "../../lib/utils";

interface FormField {
  id: string;
  label: string;
  type: string;
  required: boolean;
  description?: string;
}

interface BulkFile {
  fileName: string;
  fileType: string;
  fileUrl: string;
  uploadedAt: string;
}

interface Report {
  _id: string;
  referenceNumber: string;
  status: 'pending' | 'approved' | 'rejected';
  formId?: {
    _id: string;
    fields: FormField[];
  };
  data: Record<string, any> | null;
  files: Array<{
    filename: string;
    url: string;
    mimetype: string;
  }>;
  bulkFile?: BulkFile;
  comments?: string;
  createdAt: string;
}

export default function EditReport() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState<Report | null>(null);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isBulkSubmission, setIsBulkSubmission] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/response/revise/${id}?populate=formId`);
        
        if (!res.ok) {
          throw new Error('Failed to fetch report');
        }
        
        const data = await res.json();
        setReport(data);
        setIsBulkSubmission(!!data.bulkFile);
        setFormValues(data.data || {});
        setActiveTab(!!data.bulkFile ? "bulk" : "details");
      } catch (err) {
        toast.error('Failed to fetch report');
        navigate('/account/citizen/my-reports');
      } finally {
        setLoading(false);
      }
    };
    
    fetchReport();
  }, [id, navigate]);

  const handleFormChange = (fieldId: string, value: string) => {
    setFormValues(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewFiles(Array.from(e.target.files));
      
      if (e.target.files[0] && e.target.files[0].type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setFilePreview(event.target?.result as string);
        };
        reader.readAsDataURL(e.target.files[0]);
      } else {
        setFilePreview(null);
      }
    }
  };

  const handleBulkFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setNewFiles([e.target.files[0]]);
      setFilePreview(null); 
    }
  };

  const simulateProgress = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 150);
    
    return () => clearInterval(interval);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      setSubmitting(true);
      const clearProgress = simulateProgress();
      
      const formData = new FormData();
      formData.append('submissionType', isBulkSubmission ? 'bulk' : 'form');
      
      if (!isBulkSubmission) {
        formData.append('data', JSON.stringify(formValues));
      }

      newFiles.forEach(file => {
        formData.append('files', file);
      });

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/response/revise/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Update failed');
      }

      setUploadProgress(100);
      toast.success('Report updated successfully!');
      
      // Small delay to show completed progress bar before redirecting
      setTimeout(() => {
        navigate('/account/citizen/my-reports');
      }, 500);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update report');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-500';
      case 'approved': return 'bg-emerald-500';
      case 'rejected': return 'bg-rose-500';
      default: return 'bg-slate-500';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-lg font-medium text-muted-foreground">Loading report details...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6 max-w-5xl">
      <Toaster 
        position="top-right" 
        toastOptions={{
          duration: 4000,
          style: {
            background: '#FFFFFF',
            color: '#333333',
            border: '1px solid #E2E8F0',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#FFFFFF',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#FFFFFF',
            },
          }
        }}
      />
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="p-0 h-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Reports
        </Button>
        
        <div className="flex items-center gap-2">
          <Badge 
            variant="outline" 
            className={cn(
              "px-3 py-1 rounded-full font-medium",
              report?.status === 'approved' && "text-emerald-600 bg-emerald-50 border-emerald-200",
              report?.status === 'rejected' && "text-rose-600 bg-rose-50 border-rose-200",
              report?.status === 'pending' && "text-amber-600 bg-amber-50 border-amber-200",
            )}
          >
            {report?.status === 'approved' && <CheckCircle className="w-3 h-3 mr-1" />}
            {report?.status === 'rejected' && <XCircle className="w-3 h-3 mr-1" />}
            {report?.status === 'pending' && <AlertCircle className="w-3 h-3 mr-1" />}
            {report?.status}
          </Badge>
          <Badge variant="secondary">
            {formatDate(report?.createdAt || '')}
          </Badge>
        </div>
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <ClipboardList className="h-6 w-6 text-primary" />
            Edit Submission
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Reference: <span className="font-medium text-foreground">{report?.referenceNumber}</span>  
          </p>
        </div>
        
        {report?.comments && (
          <div className="p-6 border-b bg-rose-50">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-500 mt-0.5" />
              <div>
                <h3 className="text-rose-700 font-semibold mb-2">Reviewer Comments</h3>
                <p className="text-rose-700 text-sm whitespace-pre-wrap">
                  {report.comments}
                </p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 w-full max-w-md mb-6">
              <TabsTrigger 
                value="details" 
                disabled={isBulkSubmission && !report?.formId?.fields?.length}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Form Details
              </TabsTrigger>
              <TabsTrigger 
                value="bulk" 
                disabled={!isBulkSubmission && !report?.bulkFile}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Bulk Submission
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="details">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {report?.formId?.fields?.map((field) => (
                  <div key={field.id} className="space-y-3">
                    <Label className="text-sm font-medium flex items-center">
                      {field.label}
                      {field.required && <span className="text-rose-500 ml-1">*</span>}
                    </Label>

                    {field.type === 'textarea' ? (
                      <Textarea
                        value={formValues[field.id] || ''}
                        onChange={(e) => handleFormChange(field.id, e.target.value)}
                        required={field.required}
                        placeholder={field.description || `Enter ${field.label.toLowerCase()}`}
                        className="min-h-[120px] resize-y"
                      />
                    ) : field.type === 'image' ? (
                      <div className="space-y-3">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="cursor-pointer"
                        />
                        
                        {filePreview && (
                          <div className="mt-2 border rounded-md p-2">
                            <img 
                              src={filePreview} 
                              alt="Preview" 
                              className="max-h-40 rounded-md object-contain"
                            />
                          </div>
                        )}
                      </div>
                    ) : (
                      <Input
                        type={field.type}
                        value={formValues[field.id] || ''}
                        onChange={(e) => handleFormChange(field.id, e.target.value)}
                        required={field.required}
                        placeholder={field.description || `Enter ${field.label.toLowerCase()}`}
                      />
                    )}

                    {field.description && (
                      <p className="text-xs text-muted-foreground">
                        {field.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="bulk">
              <Card className="border shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-medium">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      Bulk Submission File
                    </div>
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {report?.bulkFile && (
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Current File</Label>
                      <Card className="bg-slate-50 border">
                        <CardContent className="p-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-md">
                              <File className="h-8 w-8 text-primary" />
                            </div>
                            <div className="space-y-1">
                              <p className="font-medium">{report.bulkFile.fileName}</p>
                              <p className="text-xs text-muted-foreground">
                                {report.bulkFile.fileType} · Uploaded {formatDate(report.bulkFile.uploadedAt)}
                              </p>
                            </div>
                          </div>
                          
                          <a
                            href={report.bulkFile.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-primary hover:text-primary/80 text-sm font-medium"
                          >
                            <Eye className="h-4 w-4" />
                            View
                          </a>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      Upload Replacement File
                      <span className="text-rose-500 ml-1">*</span>
                    </Label>
                    
                    <div className="border-2 border-dashed rounded-lg p-6 text-center bg-slate-50">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="font-medium">Drag and drop your file here</p>
                        <p className="text-sm text-muted-foreground mb-3">
                          or click to browse from your computer
                        </p>
                        
                        <Input
                          type="file"
                          onChange={handleBulkFileChange}
                          required
                          className="cursor-pointer max-w-xs"
                        />
                        
                        {newFiles.length > 0 && (
                          <div className="mt-4 text-left w-full max-w-md">
                            <p className="text-sm font-medium">Selected file:</p>
                            <div className="flex items-center gap-2 p-2 border rounded-md mt-1 bg-white">
                              <FileText className="h-4 w-4 text-primary" />
                              <span className="text-sm truncate">
                                {newFiles[0].name}
                              </span>
                              <span className="text-xs text-muted-foreground ml-auto">
                                {(newFiles[0].size / 1024 / 1024).toFixed(2)} MB
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-xs text-muted-foreground">
                      Upload a new file to replace the current one. Supported file types: PDF, Excel, CSV, Word documents.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {submitting && (
            <div className="mt-8 mb-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">
                  {uploadProgress < 100 ? 'Uploading...' : 'Complete!'}
                </p>
                <span className="text-xs font-medium">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          <div className="flex flex-wrap items-center gap-4 mt-8">
            <Button 
              type="submit" 
              className="gap-2"
              disabled={submitting}
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {submitting ? 'Saving Changes...' : 'Save Changes'}
            </Button>
            
            <Button 
              variant="outline" 
              type="button"
              onClick={() => navigate(-1)}
              disabled={submitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}