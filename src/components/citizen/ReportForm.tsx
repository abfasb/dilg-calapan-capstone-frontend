import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../ui/card";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import { ImageIcon, CheckCircle, XCircle, Loader2 } from "lucide-react";
import axios from "axios";

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
  const [filePreviews, setFilePreviews] = useState<string[]>([]);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await axios.get(`/api/reports/${id}`);
        setReport(response.data);
        // Initialize form data
        const initialData: Record<string, any> = {};
        response.data.fields.forEach((field: ReportField) => {
          initialData[field.id] = field.type === 'checkbox' ? [] : '';
        });
        setFormData(initialData);
      } catch (error) {
        console.error('Error fetching report:', error);
        navigate('/');
      }
    };

    fetchReport();
  }, [id, navigate]);

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors(prev => ({ ...prev, [fieldId]: '' }));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, fieldId: string) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setFilePreviews(prev => [...prev, ...newPreviews]);
      handleInputChange(fieldId, [...(formData[fieldId] || []), ...newFiles]);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    report?.fields.forEach(field => {
      if (field.required) {
        if (field.type === 'checkbox' && formData[field.id].length === 0) {
          newErrors[field.id] = 'This field is required';
        } else if (!formData[field.id]) {
          newErrors[field.id] = 'This field is required';
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
          Array.from(value).forEach(file => {
            formPayload.append(fieldId, file);
          });
        } else {
          formPayload.append(fieldId, value);
        }
      });

      await axios.post(`/api/reports/${id}/responses`, formPayload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      navigate('/submission-success');
    } catch (error) {
      console.error('Submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!report) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto p-6">
        <Card className="shadow-lg dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-3xl font-bold mb-2">{report.title}</CardTitle>
            <p className="text-muted-foreground">{report.description}</p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {report.fields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <Label className="flex items-center gap-2 text-lg">
                    {field.label}
                    {field.required && <Badge variant="destructive">Required</Badge>}
                  </Label>
                  
                  {field.description && (
                    <p className="text-sm text-muted-foreground">{field.description}</p>
                  )}

                  {errors[field.id] && (
                    <Alert variant="destructive" className="border-red-200 dark:border-red-800">
                      <AlertDescription>{errors[field.id]}</AlertDescription>
                    </Alert>
                  )}

                  {field.type === 'text' && (
                    <Input
                      value={formData[field.id] || ''}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      className="h-12 text-lg"
                    />
                  )}

                  {field.type === 'number' && (
                    <Input
                      type="number"
                      value={formData[field.id] || ''}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      className="h-12 text-lg"
                    />
                  )}

                  {field.type === 'checkbox' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {field.options?.map((option) => (
                        <label key={option} className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent cursor-pointer">
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
                      <Input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleFileUpload(e, field.id)}
                        className="cursor-pointer h-12"
                      />
                      <div className="flex flex-wrap gap-4">
                        {filePreviews.map((preview, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="h-32 w-32 object-cover rounded-lg shadow-md"
                            />
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
  );
}