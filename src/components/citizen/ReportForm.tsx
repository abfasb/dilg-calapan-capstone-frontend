import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../ui/card";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import { 
  ImageIcon, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  X, 
  ChevronLeft,
  UploadCloud,
  Check,
  AlertCircle,
  FileText,
  ClipboardList,
  Clock,
  AlertTriangle
} from "lucide-react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useDropzone } from "react-dropzone";
import { format, isAfter, isBefore } from "date-fns";

interface ReportField {
  id: string;
  type: string;
  label: string;
  required: boolean;
  description: string;
  options?: string[];
}

interface ReportData {
  _id: string;
  title: string;
  description: string;
  fields: ReportField[];
  deadline: string | null;
  template?: {
    fileName: string;
    fileUrl: string;
    mimetype: string;
  };
  createdAt: string;
}

export default function ReportForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState<ReportData | null>(null);
  const [submissionMode, setSubmissionMode] = useState<'form' | 'file'>('form');
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [filePreviews, setFilePreviews] = useState<Record<string, string[]>>({});
  const [bulkFile, setBulkFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeadlinePassed, setIsDeadlinePassed] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/form/${id}`);
        setReport(response.data);
        
        // Check if deadline has passed
        if (response.data.deadline) {
          const deadlineDate = new Date(response.data.deadline);
          const now = new Date();
          setIsDeadlinePassed(isBefore(deadlineDate, now));
        }
        
        const initialData: Record<string, any> = {};
        response.data.fields.forEach((field: ReportField) => {
          initialData[field.id] = field.type === 'checkbox' ? [] : '';
        });
        setFormData(initialData);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching report:', error);
        toast.error('Failed to load form');
        navigate('/');
      }
    };

    fetchReport();
  }, [id, navigate]);

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    if (errors[fieldId]) setErrors(prev => ({ ...prev, [fieldId]: '' }));
  };

  const onFormFileDrop = (acceptedFiles: File[], fieldId: string) => {
    const newPreviews = acceptedFiles.map(file => URL.createObjectURL(file));
    setFilePreviews(prev => ({
      ...prev,
      [fieldId]: [...(prev[fieldId] || []), ...newPreviews]
    }));
    handleInputChange(fieldId, [...(formData[fieldId] || []), ...acceptedFiles]);
  };

  const handleRemoveFormFile = (fieldId: string, index: number) => {
    const updatedPreviews = [...filePreviews[fieldId]];
    updatedPreviews.splice(index, 1);
    setFilePreviews(prev => ({ ...prev, [fieldId]: updatedPreviews }));

    const updatedFiles = [...formData[fieldId]];
    updatedFiles.splice(index, 1);
    handleInputChange(fieldId, updatedFiles);
  };

  const validateForm = () => {
    if (submissionMode === 'file') return true;

    const newErrors: Record<string, string> = {};
    report?.fields.forEach(field => {
      const value = formData[field.id];
      if (field.required) {
        if (field.type === 'checkbox' && value.length === 0) {
          newErrors[field.id] = `${field.label} is required`;
        } else if (field.type === 'image' && (!value || value.length === 0)) {
          newErrors[field.id] = `${field.label} is required`;
        } else if (typeof value === 'string' && value.trim() === '') {
          newErrors[field.id] = `${field.label} is required`;
        } else if (field.type === 'number' && (value === '' || isNaN(value))) {
          newErrors[field.id] = `${field.label} must be a valid number`;
        }
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const BulkFileUpload = () => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop: (files) => setBulkFile(files[0]),
      accept: {
        'application/pdf': ['.pdf'],
        'application/msword': ['.doc', '.docx'],
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
        'application/vnd.ms-excel': ['.xls', '.xlsx'],
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
      },
      multiple: false
    });

    return (
      <div className="space-y-6">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 transition-all cursor-pointer
            ${isDragActive ? 'border-blue-500 bg-blue-50/50' : 'border-gray-200'}
            ${bulkFile ? 'border-green-500 bg-green-50/50' : ''}`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <UploadCloud className={`h-12 w-12 ${isDragActive ? 'text-blue-500' : 'text-muted-foreground'}`} />
            <div className="space-y-1">
              <p className="font-medium">
                {bulkFile ? 'File Ready for Upload' : 
                 isDragActive ? 'Drop file here' : 'Click to upload or drag and drop'}
              </p>
              <p className="text-sm text-muted-foreground">
                PDF, XLS, XLSX up to 10MB
              </p>
            </div>
          </div>
        </div>

        {bulkFile && (
          <div className="bg-green-50 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-green-600" />
              <span className="font-medium">{bulkFile.name}</span>
              <span className="text-sm text-muted-foreground">
                {(bulkFile.size / 1024 / 1024).toFixed(2)} MB
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setBulkFile(null)}
              className="text-red-600 hover:text-red-700"
            >
              Remove
            </Button>
          </div>
        )}
      </div>
    );
  };

  const FormFileUpload = ({ field }: { field: ReportField }) => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop: (files) => onFormFileDrop(files, field.id),
      accept: {'image/*': []},
      multiple: true
    });

    return (
      <div className="space-y-4">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 transition-all cursor-pointer
            ${errors[field.id] ? 'border-red-500 bg-red-500/10' : 'border-gray-200'}
            ${isDragActive ? 'border-blue-500 bg-blue-50/50' : ''}`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <UploadCloud className={`h-8 w-8 ${isDragActive ? 'text-blue-500' : 'text-muted-foreground'}`} />
            <div className="space-y-1">
              <p className="font-medium">
                {isDragActive ? 'Drop files here' : 'Click to upload or drag and drop'}
              </p>
              <p className="text-sm text-muted-foreground">
                PNG, JPG up to 10MB
              </p>
            </div>
          </div>
        </div>
        
        {filePreviews[field.id]?.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filePreviews[field.id].map((preview, index) => (
              <div key={preview} className="relative group">
                <div className="aspect-square overflow-hidden rounded-lg border">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="h-full w-full object-cover hover:scale-105 transition-transform"
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 h-7 w-7 rounded-full"
                  onClick={() => handleRemoveFormFile(field.id, index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (submissionMode === 'file' && !bulkFile) {
      toast.error('Please upload a file before submitting');
      return;
    }

    setIsSubmitting(true);
    try {
      const formPayload = new FormData();
      const userId = localStorage.getItem("userId");
      
      if (userId) formPayload.append("userId", userId);
      formPayload.append("submissionType", submissionMode);

      if (submissionMode === 'form') {
        Object.entries(formData).forEach(([fieldId, value]) => {
          if (value instanceof FileList || Array.isArray(value)) {
            Array.from(value).forEach(file => formPayload.append(fieldId, file));
          } else {
            formPayload.append(fieldId, value);
          }
        });
      } else if (bulkFile) {
        formPayload.append("bulkFile", bulkFile);
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/form/${id}/responses`, 
        formPayload, 
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      const userResponse = await axios.get(`${import.meta.env.VITE_API_URL}/admin/users/${userId}`);
      const userData = userResponse.data.user;

      navigate(`/account/citizen/submission/success/${userId}`, { 
        state: { 
          referenceNumber: response.data.referenceNumber,
          submissionType: submissionMode,
          submissionData: submissionMode === 'form' ? formData : null,
          fileName: bulkFile?.name || '',
          userData: {
            firstName: userData?.firstName || '',
            lastName: userData?.lastName || '',
            position: userData?.position || '',
            barangay: userData?.barangay || '',
            phoneNumber: userData?.phoneNumber || ''
          },
          formFields: submissionMode === 'form' ? report?.fields : []
        }
      });

      toast.success('Submission successful!');
    } catch (error) {
      console.error('Submission failed:', error);
      toast.error('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg font-medium">Loading Report Form...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster
        position="top-right"
        gutter={32}
        containerClassName="!top-4 !right-6"
        toastOptions={{
          className: '!bg-background !text-foreground !rounded-xl !border !shadow-lg',
          success: {
            icon: <CheckCircle className="h-5 w-5 text-green-500" />,
            style: { padding: '16px', border: '1px solid #2f3b52' },
          },
          error: { icon: <XCircle className="h-5 w-5 text-red-500" /> },
        }}
      />
      
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-4xl mx-auto p-6">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="gap-1 pl-0 hover:bg-transparent"
            >
              <ChevronLeft className="h-5 w-5" />
              Back to Reports
            </Button>
          </div>

          <Card className="shadow-xl rounded-2xl border-0 bg-background/95 backdrop-blur">
            <CardHeader className="pb-0">
              <div className="flex items-center justify-between mb-4">
                <CardTitle className="text-3xl font-bold tracking-tight">
                  {report?.title}
                </CardTitle>
                <div className="flex items-center gap-2">
                  {report?.deadline && (
                    <Badge 
                      variant={isDeadlinePassed ? "destructive" : "default"} 
                      className="text-sm py-1.5 px-3 flex items-center gap-1"
                    >
                      <Clock className="h-3.5 w-3.5" />
                      {isDeadlinePassed ? "Deadline Passed" : `Due: ${format(new Date(report.deadline), "MMM dd, yyyy")}`}
                    </Badge>
                  )}
                  <Badge variant="secondary" className="text-sm py-1.5 px-3">
                    {submissionMode === 'form' 
                      ? `${report?.fields.filter(f => f.required).length} Required Fields`
                      : 'File Upload'}
                  </Badge>
                </div>
              </div>
              <p className="text-lg text-muted-foreground">{report?.description}</p>
            </CardHeader>

            <CardContent className="pt-8">

            {isDeadlinePassed && (
              <Alert className="bg-yellow-50 border-yellow-200 mb-6">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <AlertTitle>Deadline Passed</AlertTitle>
                <AlertDescription>
                  The submission deadline for this report has passed. You can still submit, 
                  but it may be marked as late.
                </AlertDescription>
              </Alert>
            )}

            {report?.template && (
              <div className="mb-8 p-6 border rounded-xl bg-muted/20">
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="h-6 w-6 text-blue-600" />
                  <h3 className="text-lg font-semibold">Document Template Overview</h3>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Template File:</span>
                    <a
                      href={report.template.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center gap-2"
                    >
                      {report.template.fileName}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </a>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Uploaded:</span>
                    <span className="text-muted-foreground">
                      {new Date(report.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            )}

              <div className="flex gap-4 mb-8">
                <Button
                  variant={submissionMode === 'form' ? 'default' : 'outline'}
                  onClick={() => setSubmissionMode('form')}
                  className="gap-2"
                >
                  <ClipboardList className="h-4 w-4" />
                  Fill Form
                </Button>
                <Button
                  variant={submissionMode === 'file' ? 'default' : 'outline'}
                  onClick={() => setSubmissionMode('file')}
                  className="gap-2"
                >
                  <UploadCloud className="h-4 w-4" />
                  Upload File
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-10">
                {submissionMode === 'form' ? (
                  <>
                    <Alert className="bg-blue-50 border-blue-200">
                      <AlertCircle className="h-4 w-4 text-blue-600" />
                      <AlertTitle>Form Submission Mode</AlertTitle>
                      <AlertDescription>
                        Please fill out all required fields in the form below.
                        {isDeadlinePassed && " Note: The deadline has passed, but you can still submit."}
                      </AlertDescription>
                    </Alert>

                    {report?.fields.map((field) => (
                      <div key={field.id} className="space-y-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Label className="text-base font-medium">
                              {field.label}
                              {field.required && (
                                <span className="text-red-500 ml-1">*</span>
                              )}
                            </Label>
                            {errors[field.id] && (
                              <span className="text-sm text-red-500 flex items-center gap-1">
                                <AlertCircle className="h-4 w-4" />
                                {errors[field.id]}
                              </span>
                            )}
                          </div>
                          {field.description && (
                            <p className="text-sm text-muted-foreground">
                              {field.description}
                            </p>
                          )}
                        </div>

                        {field.type === 'text' && (
                          <Input
                            value={formData[field.id] || ''}
                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                            className={`h-12 text-base ${errors[field.id] ? 'border-red-500' : ''}`}
                          />
                        )}

                        {field.type === 'number' && (
                          <Input
                            type="number"
                            value={formData[field.id] || ''}
                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                            className={`h-12 text-base ${errors[field.id] ? 'border-red-500' : ''}`}
                          />
                        )}

                        {field.type === 'checkbox' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {field.options?.map((option) => (
                              <label
                                key={option}
                                className={`flex items-center gap-3 p-4 border rounded-xl transition-colors
                                  ${errors[field.id] ? 'border-red-500' : 'hover:border-primary'}
                                  ${formData[field.id].includes(option) ? 'border-primary bg-primary/5' : ''}`}
                              >
                                <input
                                  type="checkbox"
                                  checked={formData[field.id].includes(option)}
                                  onChange={(e) => {
                                    const newValue = e.target.checked
                                      ? [...formData[field.id], option]
                                      : formData[field.id].filter((opt: string) => opt !== option);
                                    handleInputChange(field.id, newValue);
                                  }}
                                  className="h-5 w-5 text-primary rounded border-gray-300 focus:ring-primary"
                                />
                                <span className="text-sm font-medium">{option}</span>
                              </label>
                            ))}
                          </div>
                        )}

                        {field.type === 'image' && <FormFileUpload field={field} />}
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    <BulkFileUpload />
                    <Alert className="bg-green-50 border-green-200">
                      <Check className="h-4 w-4 text-green-600" />
                      <AlertTitle>File Upload Mode</AlertTitle>
                      <AlertDescription>
                        Upload complete documents (PDF, Word, Excel). Ensure all required
                        information is included in the file.
                        {isDeadlinePassed && " Note: The deadline has passed, but you can still submit."}
                      </AlertDescription>
                    </Alert>
                  </>
                )}

                <CardFooter className="flex justify-end gap-4 px-0 pb-0 pt-8">
                  <Button
                    type="submit"
                    size="lg"
                    className="h-12 px-8 text-base font-semibold gap-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Check className="h-5 w-5" />
                        {isDeadlinePassed ? 'Submit Late' : submissionMode === 'form' ? 'Submit Form' : 'Upload File'}
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}