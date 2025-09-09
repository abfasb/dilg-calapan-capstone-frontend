import React, { useEffect, useState, useCallback } from 'react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
 import { toast, Toaster } from 'react-hot-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '../../ui/dialog';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '../../ui/card';
import {
  Edit,
  Check,
  Image,
  Trash2,
  Plus,
  Type,
  ToggleRight,
  Save,
  Box,
  Download,
  X,
  FileText,
  Settings,
  Sparkles,
  Zap,
  Eye,
  Upload,
  CheckCircle2
} from 'lucide-react';

interface Template {
  fileName: string;
  fileUrl: string;
  mimetype: string;
}

interface FormField {
  id: string;
  type: 'text' | 'checkbox' | 'image' | 'number';
  label: string;
  required: boolean;
  description: string;
  options?: string[];
}

interface ReportForm {
  _id: string;
  title: string;
  description: string;
  fields: FormField[];
  template?: Template;
  __v: number;
}

const CustomReports: React.FC = () => {
  const [forms, setForms] = useState<ReportForm[]>([]);
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [savingId, setSavingId] = useState<string | null>(null);
  const [newTemplateFile, setNewTemplateFile] = useState<File | null>(null);
  const [removeTemplate, setRemoveTemplate] = useState(false);

  const selectedForm = forms.find(form => form._id === selectedFormId) || null;

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/form/get-report`);
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setForms(data);
      } catch (err) {
        setError('Failed to load forms. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchForms();
  }, []);

  useEffect(() => {
    setNewTemplateFile(null);
    setRemoveTemplate(false);
  }, [selectedFormId]);

  const handleFormChange = useCallback((formId: string, field: keyof ReportForm, value: any) => {
    setForms(prev => prev.map(form => 
      form._id === formId ? { ...form, [field]: value } : form
    ));
  }, []);

  const handleFieldChange = useCallback((formId: string, fieldId: string, key: keyof FormField, value: any) => {
    setForms(prev => prev.map(form => {
      if (form._id === formId) {
        return {
          ...form,
          fields: form.fields.map(field => 
            field.id === fieldId ? { ...field, [key]: value } : field
          )
        }
      }
      return form;
    }));
  }, []);

  const handleAddOption = useCallback((formId: string, fieldId: string) => {
    setForms(prev => prev.map(form => {
      if (form._id === formId) {
        return {
          ...form,
          fields: form.fields.map(field => 
            field.id === fieldId 
              ? { ...field, options: [...(field.options || []), 'New Option'] }
              : field
          )
        }
      }
      return form;
    }));
  }, []);

  const handleRemoveOption = useCallback((formId: string, fieldId: string, index: number) => {
    setForms(prev => prev.map(form => {
      if (form._id === formId) {
        return {
          ...form,
          fields: form.fields.map(field => {
            if (field.id === fieldId && field.options) {
              const options = [...field.options];
              options.splice(index, 1);
              return { ...field, options };
            }
            return field;
          })
        }
      }
      return form;
    }));
  }, []);

  const handleSaveForm = async (formId: string) => {
    setSavingId(formId);
    try {
      const formToUpdate = forms.find(f => f._id === formId);
      if (!formToUpdate) return;

      const formData = new FormData();
      formData.append('title', formToUpdate.title);
      formData.append('description', formToUpdate.description || '');
      formData.append('fields', JSON.stringify(formToUpdate.fields));
      
      if (removeTemplate) {
        formData.append('removeTemplate', 'true');
      }
      
      if (newTemplateFile) {
        formData.append('template', newTemplateFile);
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}form/update-report/${formId}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Update failed');
      }

      const result = await response.json();
      setForms(prev => 
        prev.map(form => form._id === formId ? result.data : form)
      );
      
      // toast.success('Form updated successfully'); // Uncomment if using toast
      setNewTemplateFile(null);
      setRemoveTemplate(false);
    } catch (err: any) {
      // toast.error(err.message || 'Failed to update form'); // Uncomment if using toast
      console.error(err.message || 'Failed to update form');
    } finally {
      setSavingId(null);
    }
  };

  const getFieldTypeIcon = (type: string) => {
    switch (type) {
      case 'text': return <Type className="w-4 h-4" />;
      case 'number': return <Zap className="w-4 h-4" />;
      case 'checkbox': return <CheckCircle2 className="w-4 h-4" />;
      case 'image': return <Image className="w-4 h-4" />;
      default: return <Type className="w-4 h-4" />;
    }
  };

  const getTemplateIcon = (mimetype: string) => {
    if (mimetype?.includes('pdf')) return '📄';
    if (mimetype?.includes('word') || mimetype?.includes('document')) return '📝';
    if (mimetype?.includes('excel') || mimetype?.includes('sheet')) return '📊';
    return '📁';
  };

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-red-50/50 to-red-100 flex items-center justify-center p-6">
      <div className="bg-white/80 backdrop-blur-xl border border-red-200/50 rounded-2xl p-8 max-w-md text-center shadow-2xl">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <X className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Forms</h3>
        <p className="text-red-600">{error}</p>
      </div>
    </div>
  );

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl opacity-70 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-cyan-400/20 rounded-full blur-3xl opacity-70 animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-violet-400/10 to-pink-400/10 rounded-full blur-3xl opacity-50 animate-pulse delay-500"></div>
        </div>

        <div className="relative z-10 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-12">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-75"></div>
                    <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl">
                      <Edit className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                      Report Forms Studio
                    </h1>
                    <p className="text-slate-600 mt-1">Design, customize, and manage dynamic report forms</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-white/60 backdrop-blur-xl border border-white/20 rounded-xl px-4 py-2 shadow-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <Sparkles className="w-4 h-4 text-blue-500" />
                    <span className="font-medium text-slate-700">{forms.length} Active Forms</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Forms Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {forms.map((form, index) => (
                <Card
                  key={form._id}
                  className="group hover:scale-[1.02] transition-all duration-500 cursor-pointer bg-white/60 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl rounded-2xl overflow-hidden relative"
                  onClick={() => setSelectedFormId(form._id)}
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: 'fadeInUp 0.6s ease-out forwards'
                  }}
                >
                  {/* Gradient Border Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-sm"></div>
                  
                  <CardHeader className="relative z-10 pb-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-lg blur-sm"></div>
                          <div className="relative bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm p-2.5 rounded-lg border border-white/20">
                            <Box className="w-5 h-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg font-bold text-slate-800 group-hover:text-blue-800 transition-colors">
                            {form.title}
                          </CardTitle>
                        </div>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                        <Settings className="w-5 h-5 text-slate-400" />
                      </div>
                    </div>
                    
                    <CardDescription className="text-slate-600 leading-relaxed mb-4 line-clamp-3">
                      {form.description || 'No description provided'}
                    </CardDescription>

                    {/* Template Badge */}
                    {form.template && (
                      <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200/50 rounded-lg px-3 py-1.5 mb-4">
                        <span className="text-lg">{getTemplateIcon(form.template.mimetype)}</span>
                        <div className="flex items-center gap-1">
                          <Download className="w-3 h-3 text-emerald-600" />
                          <span className="text-xs font-medium text-emerald-700 truncate max-w-32">
                            {form.template.fileName}
                          </span>
                        </div>
                      </div>
                    )}
                  </CardHeader>

                  <CardContent className="relative z-10 pt-0">
                    {/* Fields Preview */}
                    <div className="space-y-3 mb-6">
                      {form.fields.slice(0, 3).map((field, fieldIndex) => (
                        <div key={field.id} className="flex items-center gap-3 p-2 bg-white/40 backdrop-blur-sm rounded-lg border border-white/30">
                          <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-slate-100 to-slate-200 rounded-md">
                            {getFieldTypeIcon(field.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-700 truncate">{field.label}</p>
                            <p className="text-xs text-slate-500">
                              {field.type} {field.required && '• Required'}
                            </p>
                          </div>
                        </div>
                      ))}
                      {form.fields.length > 3 && (
                        <div className="text-center py-2">
                          <span className="text-xs text-slate-500 bg-white/50 px-3 py-1 rounded-full">
                            +{form.fields.length - 3} more fields
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/30">
                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <div className="flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          <span className="font-medium">{form.fields.length}</span>
                          <span>fields</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-xs text-green-600 font-medium">Active</span>
                      </div>
                    </div>
                  </CardContent>

                  {/* Hover Effect Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-600/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Dialog */}
      <Dialog
        open={!!selectedFormId}
        onOpenChange={(open) => !open && setSelectedFormId(null)}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-white/95 backdrop-blur-xl border-0 rounded-3xl shadow-2xl">
          {selectedForm && (
            <>
              <DialogHeader className="pb-6 border-b border-slate-200/50">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl blur-sm"></div>
                    <div className="relative bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-3 rounded-xl border border-white/20">
                      <Type className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-blue-800 bg-clip-text text-transparent">
                      {selectedForm.title}
                    </DialogTitle>
                    <DialogDescription className="text-slate-600 mt-1">
                      {selectedForm.description || 'Edit report form configuration'}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="overflow-y-auto max-h-[calc(90vh-200px)] px-1">
                <div className="space-y-8 py-6">
                  {/* Form Details Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <Edit className="w-4 h-4" />
                        Form Title
                      </Label>
                      <Input
                        value={selectedForm.title}
                        onChange={(e) => handleFormChange(selectedForm._id, 'title', e.target.value)}
                        className="bg-white/50 border-slate-200/50 focus:bg-white/80 transition-all duration-200 rounded-xl"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Description
                      </Label>
                      <textarea
                        value={selectedForm.description}
                        onChange={(e) => handleFormChange(selectedForm._id, 'description', e.target.value)}
                        className="w-full p-3 bg-white/50 border border-slate-200/50 focus:bg-white/80 transition-all duration-200 rounded-xl resize-none h-20"
                        placeholder="Enter form description..."
                      />
                    </div>
                  </div>

                  {/* Template Section */}
                  <div className="bg-gradient-to-r from-slate-50/50 to-blue-50/30 backdrop-blur-sm border border-slate-200/30 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                      <Download className="w-5 h-5 text-blue-600" />
                      Template File
                    </h3>
                    
                    {selectedForm.template && !removeTemplate && (
                      <div className="bg-white/60 backdrop-blur-sm border border-white/30 rounded-xl p-4 mb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">{getTemplateIcon(selectedForm.template.mimetype)}</div>
                            <div>
                              <a 
                                href={selectedForm.template.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
                              >
                                {selectedForm.template.fileName}
                              </a>
                              <p className="text-xs text-slate-500 mt-1">
                                {selectedForm.template.mimetype}
                              </p>
                            </div>
                          </div>
                        <Button 
                          variant="destructive"
                          size="sm"
                          onClick={() => setRemoveTemplate(true)}
                          className="bg-red-500/10 hover:bg-red-500/20 text-red-600 border-red-200/50 rounded-lg flex items-center"
                        >
                          <Trash2 className="w-4 h-4 sm:mr-2 mr-0" />
                          <span className="hidden sm:inline">Remove</span> 
                        </Button>
                        </div>
                      </div>
                    )}

                    {(removeTemplate || !selectedForm.template) && (
                      <div className="space-y-4">
                        <div className="space-y-3">
                          <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                            <Upload className="w-4 h-4" />
                            Upload New Template
                          </Label>
                          <div className="relative">
                            <Input 
                              type="file"
                              accept=".pdf,.doc,.docx,.xls,.xlsx"
                              onChange={(e) => setNewTemplateFile(e.target.files?.[0] || null)}
                              className="bg-white/50 border-slate-200/50 focus:bg-white/80 transition-all duration-200 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                          </div>
                        </div>
                        
                        {newTemplateFile && (
                          <div className="bg-green-50/50 border border-green-200/50 rounded-xl p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                                <span className="text-sm font-medium text-green-800 truncate">
                                  {newTemplateFile.name}
                                </span>
                              </div>
                              <Button 
                                variant="ghost"
                                size="sm"
                                onClick={() => setNewTemplateFile(null)}
                                className="h-8 w-8 p-0 hover:bg-red-100 rounded-lg"
                              >
                                <X className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        )}
                        
                        {removeTemplate && (
                          <Button 
                            variant="outline"
                            size="sm"
                            onClick={() => setRemoveTemplate(false)}
                            className="bg-white/50 border-slate-200/50 hover:bg-white/80 rounded-lg"
                          >
                            <X className="w-4 h-4 mr-2" />
                            Cancel Removal
                          </Button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Form Fields Section */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      <Settings className="w-5 h-5 text-purple-600" />
                      Form Fields Configuration
                    </h3>
                    <div className="space-y-4">
                      {selectedForm.fields.map((field, index) => (
                        <FormFieldItem
                          key={field.id}
                          field={field}
                          formId={selectedForm._id}
                          index={index}
                          onFieldChange={handleFieldChange}
                          onAddOption={handleAddOption}
                          onRemoveOption={handleRemoveOption}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-slate-200/50">
                <Button
                  variant="outline"
                  onClick={() => setSelectedFormId(null)}
                  className="bg-white/50 border-slate-200/50 hover:bg-white/80 rounded-xl px-6"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={() => handleSaveForm(selectedForm._id)}
                  disabled={savingId === selectedForm._id}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 rounded-xl px-6 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {savingId === selectedForm._id ? (
                    <Save className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4 mr-2" />
                  )}
                  Save Changes
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

const FormFieldItem = React.memo(({
  field,
  formId,
  index,
  onFieldChange,
  onAddOption,
  onRemoveOption
}: {
  field: FormField;
  formId: string;
  index: number;
  onFieldChange: (formId: string, fieldId: string, key: keyof FormField, value: any) => void;
  onAddOption: (formId: string, fieldId: string) => void;
  onRemoveOption: (formId: string, fieldId: string, index: number) => void;
}) => {
  const getFieldTypeIcon = (type: string) => {
    switch (type) {
      case 'text': return <Type className="w-4 h-4 text-blue-500" />;
      case 'number': return <Zap className="w-4 h-4 text-orange-500" />;
      case 'checkbox': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'image': return <Image className="w-4 h-4 text-purple-500" />;
      default: return <Type className="w-4 h-4 text-blue-500" />;
    }
  };

  const getFieldTypeBadge = (type: string) => {
    const configs = {
      text: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Text' },
      number: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Number' },
      checkbox: { bg: 'bg-green-100', text: 'text-green-700', label: 'Choice' },
      image: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Image' }
    };
    const config = configs[type as keyof typeof configs] || configs.text;
    
    return (
      <div className={`${config.bg} ${config.text} px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1`}>
        {getFieldTypeIcon(type)}
        {config.label}
      </div>
    );
  };

  return (
    <div className="group bg-gradient-to-r from-white/60 to-slate-50/60 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
      {/* Field Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center text-sm font-bold text-slate-600">
            {index + 1}
          </div>
          <div className="space-y-1">
            {getFieldTypeBadge(field.type)}
            {field.required && (
              <div className="flex items-center gap-1 text-xs text-red-600">
                <CheckCircle2 className="w-3 h-3" />
                <span className="font-medium">Required Field</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium text-slate-600">Required</Label>
          <div className="relative">
            <input
              type="checkbox"
              checked={field.required}
              onChange={(e) => onFieldChange(formId, field.id, 'required', e.target.checked)}
              className="sr-only"
            />
            <div
              onClick={() => onFieldChange(formId, field.id, 'required', !field.required)}
              className={`w-11 h-6 rounded-full cursor-pointer transition-all duration-200 ${
                field.required 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg' 
                  : 'bg-slate-200'
              }`}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full shadow-md transition-all duration-200 transform ${
                  field.required ? 'translate-x-6' : 'translate-x-1'
                } mt-1`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Field Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <Edit className="w-3 h-3" />
            Field Label
          </Label>
          <Input
            value={field.label}
            onChange={(e) => onFieldChange(formId, field.id, 'label', e.target.value)}
            className="bg-white/60 border-slate-200/50 focus:bg-white/90 transition-all duration-200 rounded-lg font-medium"
            placeholder="Enter field label..."
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <FileText className="w-3 h-3" />
            Description
          </Label>
          <Input
            value={field.description}
            onChange={(e) => onFieldChange(formId, field.id, 'description', e.target.value)}
            className="bg-white/60 border-slate-200/50 focus:bg-white/90 transition-all duration-200 rounded-lg"
            placeholder="Field description or help text..."
          />
        </div>
      </div>

      {/* Field Type Specific Configuration */}
      {field.type === 'checkbox' && (
        <div className="bg-gradient-to-r from-green-50/50 to-emerald-50/30 border border-green-200/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <Label className="text-sm font-semibold text-green-800 flex items-center gap-2">
              <ToggleRight className="w-4 h-4" />
              Choice Options
            </Label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAddOption(formId, field.id)}
              className="bg-white/60 border-green-200/50 hover:bg-white/90 text-green-700 rounded-lg"
            >
              <Plus className="w-3 h-3 mr-1" />
              Add Option
            </Button>
          </div>
          <div className="space-y-3">
            {field.options?.map((option, optionIndex) => (
              <div key={optionIndex} className="flex items-center gap-3 group/option">
                <div className="w-6 h-6 bg-gradient-to-br from-green-100 to-emerald-100 rounded-md flex items-center justify-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <Input
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...field.options!];
                    newOptions[optionIndex] = e.target.value;
                    onFieldChange(formId, field.id, 'options', newOptions);
                  }}
                  className="flex-1 bg-white/60 border-green-200/50 focus:bg-white/90 transition-all duration-200 rounded-lg"
                  placeholder="Option text..."
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveOption(formId, field.id, optionIndex)}
                  className="opacity-0 group-hover/option:opacity-100 transition-opacity duration-200 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {field.type === 'image' && (
        <div className="bg-gradient-to-r from-purple-50/50 to-pink-50/30 border border-purple-200/30 rounded-xl p-4">
          <Label className="text-sm font-semibold text-purple-800 flex items-center gap-2 mb-3">
            <Image className="w-4 h-4" />
            Image Upload Configuration
          </Label>
          <div className="flex items-center justify-center p-6 border-2 border-dashed border-purple-200 rounded-lg bg-white/40">
            <div className="text-center">
              <Upload className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <p className="text-sm text-purple-600 font-medium">Image Upload Area</p>
              <p className="text-xs text-purple-500 mt-1">Users will upload images here</p>
            </div>
          </div>
        </div>
      )}

      {(field.type === 'text' || field.type === 'number') && (
        <div className="bg-gradient-to-r from-blue-50/50 to-indigo-50/30 border border-blue-200/30 rounded-xl p-4">
          <Label className="text-sm font-semibold text-blue-800 flex items-center gap-2 mb-3">
            <Eye className="w-4 h-4" />
            Field Preview
          </Label>
          <div className="relative">
            <Input
              type={field.type}
              disabled
              placeholder={`Sample ${field.type} input`}
              className="bg-white/60 border-blue-200/50 rounded-lg cursor-not-allowed"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default CustomReports;