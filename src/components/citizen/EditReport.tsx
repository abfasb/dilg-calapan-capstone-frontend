import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Card } from '../../components/ui/card';
import { Badge } from '../ui/badge';
import { toast, Toaster } from 'react-hot-toast';
import { 
  XCircle,
  ArrowLeft,
  Save,
  Upload
} from 'lucide-react';

interface FormField {
  id: string;
  label: string;
  type: string;
  required: boolean;
  description?: string;
}

interface Report {
  _id: string;
  referenceNumber: string;
  status: 'pending' | 'approved' | 'rejected';
  formId: {
    _id: string;
    fields: FormField[];
  };
  data: Record<string, any>;
  files: Array<{
    filename: string;
    url: string;
    mimetype: string;
  }>;
  comments?: string;
  createdAt: string;
  bulkFile?: string;
}

export default function EditReport() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState<Report | null>(null);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/response/revise/${id}?populate=formId`);
        const data = await res.json();
        setReport(data);
        setFormValues(data.data || {});
        setLoading(false);
      } catch (err) {
        toast.error('Failed to fetch report');
        navigate('/account/citizen/my-reports');
      }
    };
    fetchReport();
  }, [id]);

  const handleFormChange = (fieldId: string, value: string) => {
    setFormValues(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const formData = new FormData();
      formData.append('data', JSON.stringify(formValues));
      formData.append('submissionType', report?.bulkFile ? 'bulk' : 'form');
      
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
  
      toast.success('Report updated successfully!');
      navigate('/account/citizen/my-reports');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update report');
    }
  };

  if (loading) return <div className="text-center p-8">Loading...</div>;

  return (
    <div className="container mx-auto p-6 space-y-8">
      <Toaster position="top-right" />
      
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {report?.formId?.fields?.map((field) => (
            <div key={field.id} className="space-y-4">
              <Label className="block text-sm font-medium">
                {field.label}
                {field.required && <span className="text-rose-500 ml-1">*</span>}
              </Label>

              {field.type === 'image' ? (
                <div className="space-y-4">
                  {newFiles.length > 0 ? (
                        newFiles.map((file, index) => (
                          <Card key={index} className="p-4">
                            <div className="flex items-center gap-4">
                              <img
                                src={URL.createObjectURL(file)}
                                alt={file.name}
                                className="h-16 w-16 object-cover rounded-md"
                              />
                              <div className="space-y-1">
                                <p className="text-sm font-medium">{file.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {file.type}
                                </p>
                              </div>
                            </div>
                          </Card>
                        ))
                      ) : (
                        report.files?.map((file, index) => (
                          <Card key={index} className="p-4">
                            <div className="flex items-center gap-4">
                              <img
                                src={file.url}
                                alt={file.filename}
                                className="h-16 w-16 object-cover rounded-md"
                              />
                              <div className="space-y-1">
                                <p className="text-sm font-medium">{file.filename}</p>
                                <p className="text-xs text-muted-foreground">
                                  {file.mimetype}
                                </p>
                              </div>
                            </div>
                          </Card>
                        ))
                      )}
                  
                  <div className="flex items-center gap-4">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      multiple
                      className="hidden"
                      id="file-upload"
                    />
                    <Label
                      htmlFor="file-upload"
                      className="flex flex-col items-center justify-center h-32 w-full rounded-lg border-2 border-dashed cursor-pointer hover:bg-accent/50 transition-colors"
                    >
                      <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                        <span className="text-sm text-muted-foreground">
                          {newFiles.length > 0 
                            ? `${newFiles.length} files selected`
                            : 'Upload new images'}
                        </span>
                    </Label>
                  </div>
                </div>
              ) : field.type === 'textarea' ? (
                <Textarea
                  value={formValues[field.id] || ''}
                  onChange={(e) => handleFormChange(field.id, e.target.value)}
                  required={field.required}
                  placeholder={field.description}
                  className="min-h-[100px]"
                />
              ) : (
                <Input
                  type={field.type}
                  value={formValues[field.id] || ''}
                  onChange={(e) => handleFormChange(field.id, e.target.value)}
                  required={field.required}
                  placeholder={field.description}
                />
              )}
              
              {field.description && (
                <p className="text-sm text-muted-foreground">
                  {field.description}
                </p>
              )}
            </div>
          ))}
        </div>

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
  );
}