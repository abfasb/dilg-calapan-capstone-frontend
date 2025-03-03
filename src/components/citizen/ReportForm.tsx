import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../ui/card";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import { ImageIcon, CheckCircle, XCircle, Loader2, X } from "lucide-react";
import axios from "axios";
import toast, { Toaster} from "react-hot-toast";

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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, fieldId: string) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setFilePreviews(prev => ({
        ...prev,
        [fieldId]: [...(prev[fieldId] || []), ...newPreviews]
      }));
      handleInputChange(fieldId, [...(formData[fieldId] || []), ...newFiles]);
    }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const formPayload = new FormData();
      Object.entries(formData).forEach(([fieldId, value]) => {
        if (value instanceof FileList || Array.isArray(value)) {
          Array.from(value).forEach(file => formPayload.append(fieldId, file));
        } else {
          formPayload.append(fieldId, value);
        }
      });

      await axios.post(`${import.meta.env.VITE_API_URL}/form/${id}/responses`, formPayload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Report submitted successfully!');
      // Reset form
      const initialData: Record<string, any> = {};
      report?.fields.forEach(field => {
        initialData[field.id] = field.type === 'checkbox' ? [] : '';
      });
      setFormData(initialData);
      setFilePreviews({});
    } catch (error) {
      console.error('Submission failed:', error);
      toast.error('Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading report...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Alert variant="destructive" className="w-auto">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
          <Button className="mt-4" onClick={() => navigate(-1)}>
            Go Back
          </Button>
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
            className: '!bg-[#1a1d24] !text-white !rounded-xl !border !border-[#2a2f38]',
          }}
        />
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto p-6">
        <Card className="shadow-lg dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-3xl font-bold mb-2 flex items-center gap-2">
              {report?.title}
              <Badge variant="outline" className="text-sm py-1">
                {report?.fields.filter(f => f.required).length} required fields
              </Badge>
            </CardTitle>
            <p className="text-muted-foreground">{report?.description}</p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {report?.fields.map((field) => (
                <div key={field.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-lg flex items-center gap-2">
                      {field.label}
                      {field.required && (
                        <span className="text-red-500">*</span>
                      )}
                    </Label>
                    {errors[field.id] && (
                      <span className="text-sm text-red-500">
                        {errors[field.id]}
                      </span>
                    )}
                  </div>

                  {field.description && (
                    <p className="text-sm text-muted-foreground">
                      {field.description}
                    </p>
                  )}

                  {field.type === 'text' && (
                    <Input
                      value={formData[field.id] || ''}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      className={`h-12 text-lg ${errors[field.id] ? 'border-red-500' : ''}`}
                    />
                  )}

                  {field.type === 'number' && (
                    <Input
                      type="number"
                      value={formData[field.id] || ''}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      className={`h-12 text-lg ${errors[field.id] ? 'border-red-500' : ''}`}
                    />
                  )}

                  {field.type === 'checkbox' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {field.options?.map((option) => (
                        <label
                          key={option}
                          className={`flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent cursor-pointer ${
                            errors[field.id] ? 'border-red-500' : ''
                          }`}
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
                            className="h-5 w-5"
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {field.type === 'image' && (
                    <div className="space-y-4">
                      <div className={`border-2 border-dashed rounded-lg p-6 ${
                        errors[field.id] ? 'border-red-500' : 'border-gray-200'
                      }`}>
                        <Label className="flex flex-col items-center justify-center gap-2 cursor-pointer">
                          <ImageIcon className="h-8 w-8 text-muted-foreground" />
                          <span className="font-medium">
                            Click to upload or drag and drop
                          </span>
                          <Input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => handleFileUpload(e, field.id)}
                            className="hidden"
                          />
                        </Label>
                      </div>
                      
                      <div className="flex flex-wrap gap-4">
                        {filePreviews[field.id]?.map((preview, index) => (
                          <div key={preview} className="relative group">
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="h-32 w-32 object-cover rounded-lg shadow-md"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4"
                              onClick={() => handleRemoveFile(field.id, index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              <CardFooter className="flex justify-end gap-4 px-0 pb-0">
                <Button
                  type="submit"
                  className="h-12 px-8 text-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <>Submit Report</>
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