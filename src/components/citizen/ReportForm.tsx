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
  AlertCircle
} from "lucide-react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useDropzone } from "react-dropzone";

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
}

export default function ReportForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState<ReportData | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filePreviews, setFilePreviews] = useState<Record<string, string[]>>({});

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/form/${id}`);
        setReport(response.data);
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

  const onDrop = (acceptedFiles: File[], fieldId: string) => {
    const newPreviews = acceptedFiles.map(file => URL.createObjectURL(file));
    setFilePreviews(prev => ({
      ...prev,
      [fieldId]: [...(prev[fieldId] || []), ...newPreviews]
    }));
    handleInputChange(fieldId, [...(formData[fieldId] || []), ...acceptedFiles]);
  };

  const handleRemoveFile = (fieldId: string, index: number) => {
    const updatedPreviews = [...filePreviews[fieldId]];
    updatedPreviews.splice(index, 1);
    setFilePreviews(prev => ({ ...prev, [fieldId]: updatedPreviews }));

    const updatedFiles = [...formData[fieldId]];
    updatedFiles.splice(index, 1);
    handleInputChange(fieldId, updatedFiles);
  };

  const validateForm = () => {
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

  const userId = localStorage.getItem("userId");

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validateForm()) return;

  setIsSubmitting(true);
  try {
    const formPayload = new FormData();
    
    const userId = localStorage.getItem("userId");
    if (userId) formPayload.append("userId", userId);

    const userResponse = await axios.get(`${import.meta.env.VITE_API_URL}/admin/users/${userId}`);
    const userData = userResponse.data.user;
    console.log("Full API response:", userResponse.data);

    Object.entries(formData).forEach(([fieldId, value]) => {
      if (value instanceof FileList || Array.isArray(value)) {
        Array.from(value).forEach(file => formPayload.append(fieldId, file));
      } else {
        formPayload.append(fieldId, value);
      }
    });

    const response = await axios.post<{ 
      referenceNumber: string;
      submissionData: Record<string, any>;
    }>(`${import.meta.env.VITE_API_URL}/form/${id}/responses`, formPayload, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    navigate(`/account/citizen/submission/success/${userId}`, { 
      state: { 
        success: true,
        referenceNumber: response.data.referenceNumber,
        formData: response.data.submissionData,
        userData: {
          firstName: userData?.firstName || '',
          lastName: userData?.lastName || '',
          position: userData?.position || '',
          barangay: userData?.barangay || '',
          phoneNumber: userData?.phoneNumber || ''
        }
      }
    });

    toast.success('Report submitted successfully!');
  } catch (error) {
    console.error('Submission failed:', error);
    toast.error('Failed to submit report. Please try again.');
  } finally {
    setIsSubmitting(false);
  }
};

  const FileUploadArea = ({ field }: { field: ReportField }) => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop: (files) => onDrop(files, field.id),
      accept: {'image/*': []},
      multiple: true
    });

    return (
      <div className="space-y-4">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 transition-all cursor-pointer
            ${errors[field.id] ? 'border-red-500 bg-red-500/10' : 'border-gray-200 dark:border-gray-700'}
            ${isDragActive ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20' : ''}`}
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
                  onClick={() => handleRemoveFile(field.id, index)}
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg font-medium">Loading Report Form...</p>
          <p className="text-muted-foreground">Please wait while we load the form</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Loading Error</AlertTitle>
          <AlertDescription className="mb-4">{error}</AlertDescription>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
            <Button onClick={() => window.location.reload()}>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Retry
            </Button>
          </div>
        </Alert>
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
            style: {
              padding: '16px',
              border: '1px solid #2f3b52',
            },
          },
          error: {
            icon: <XCircle className="h-5 w-5 text-red-500" />,
          },
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

          <Card className="shadow-xl rounded-2xl border-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <CardHeader className="pb-0">
              <div className="flex items-center justify-between mb-4">
                <CardTitle className="text-3xl font-bold tracking-tight">
                  {report?.title}
                </CardTitle>
                <Badge variant="secondary" className="text-sm py-1.5 px-3">
                  {report?.fields.filter(f => f.required).length} Required Fields
                </Badge>
              </div>
              <p className="text-lg text-muted-foreground">{report?.description}</p>
            </CardHeader>

            <CardContent className="pt-8">
              <form onSubmit={handleSubmit} className="space-y-10">
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

                    {field.type === 'image' && <FileUploadArea field={field} />}
                  </div>
                ))}
                
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
                        Submit Report
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