import React, { useEffect, useState, useCallback } from 'react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Switch } from '../../ui/switch';
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
  FiEdit,
  FiCheck,
  FiImage,
  FiTrash2,
  FiPlus,
  FiType,
  FiToggleRight,
  FiSave,
  FiBox,
  FiDownload,
  FiX
} from 'react-icons/fi';
import { FaRegCheckCircle } from 'react-icons/fa';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingId, setSavingId] = useState<string | null>(null);
  const [newTemplateFile, setNewTemplateFile] = useState<File | null>(null);
  const [removeTemplate, setRemoveTemplate] = useState(false);

  const selectedForm = forms.find(form => form._id === selectedFormId) || null;

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await fetch('http://localhost:5000/form/get-report');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setForms(data);
      } catch (err) {
        setError('Failed to load forms. Please try again later.');
        toast.error('Failed to fetch report forms');
      } finally {
        setLoading(false);
      }
    };
    fetchForms();
  }, []);

  // Reset template states when form changes
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

      const response = await fetch(`http://localhost:5000/form/update-report/${formId}`, {
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
      
      toast.success('Form updated successfully');
      setNewTemplateFile(null);
      setRemoveTemplate(false);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update form');
    } finally {
      setSavingId(null);
    }
  };

  if (error) return (
    <div className="p-6 bg-red-50 text-red-700 rounded-md max-w-2xl mx-auto mt-8">
      {error}
    </div>
  );

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
      <div className="min-h-screen bg-muted/40 p-8">
              <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                  <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                    <FiEdit className="w-6 h-6" />
                    Manage Report Forms
                  </h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {forms.map(form => (
                    <Card
                      key={form._id}
                      className="hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setSelectedFormId(form._id)}
                    >
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <FiBox className="w-5 h-5 text-primary" />
                          {form.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-3">
                          {form.description || 'No description provided'}
                        </CardDescription>
                        {form.template && (
                          <div className="mt-2 flex items-center gap-1 text-xs text-blue-500">
                            <FiDownload className="w-3 h-3" />
                            <span>Template: {form.template.fileName}</span>
                          </div>
                        )}
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm text-muted-foreground">
                          {form.fields.length} fields
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

        <Dialog
        open={!!selectedFormId}
        onOpenChange={(open) => !open && setSelectedFormId(null)}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedForm && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FiType className="w-5 h-5" />
                  {selectedForm.title}
                </DialogTitle>
                <DialogDescription>
                  {selectedForm.description || 'Edit report form configuration'}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Form Title</Label>
                  <Input
                    value={selectedForm.title}
                    onChange={(e) => handleFormChange(selectedForm._id, 'title', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={selectedForm.description}
                    onChange={(e) => handleFormChange(selectedForm._id, 'description', e.target.value)}
                  />
                </div>

                {/* Template Section */}
                <div className="space-y-4 border-t pt-4">
                  <h3 className="text-lg font-semibold">Template File</h3>
                  
                  {selectedForm.template && !removeTemplate && (
                    <div className="flex items-center justify-between p-3 bg-muted/20 rounded-md">
                      <div className="flex items-center gap-2">
                        <FiDownload className="w-4 h-4 text-blue-500" />
                        <a 
                          href={selectedForm.template.fileUrl} 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          {selectedForm.template.fileName}
                        </a>
                      </div>
                      <Button 
                        variant="destructive"
                        size="sm"
                        onClick={() => setRemoveTemplate(true)}
                      >
                        <FiTrash2 className="w-4 h-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  )}

                  {(removeTemplate || !selectedForm.template) && (
                    <div className="space-y-2">
                      <Label>Upload Template</Label>
                      <Input 
                        type="file"
                        accept=".pdf,.doc,.docx,.xls,.xlsx"
                        onChange={(e) => 
                          setNewTemplateFile(e.target.files?.[0] || null)
                        }
                      />
                      {newTemplateFile && (
                        <div className="flex items-center justify-between p-2 bg-muted/10 rounded-md">
                          <span className="text-sm truncate max-w-[70%]">
                            {newTemplateFile.name}
                          </span>
                          <Button 
                            variant="ghost"
                            size="icon"
                            onClick={() => setNewTemplateFile(null)}
                          >
                            <FiX className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                      
                      {removeTemplate && (
                        <Button 
                          variant="secondary"
                          size="sm"
                          onClick={() => setRemoveTemplate(false)}
                        >
                          <FiX className="w-4 h-4 mr-1" />
                          Cancel Removal
                        </Button>
                      )}
                    </div>
                  )}
                </div>

                {/* Form Fields Section */}
                <div className="space-y-4 border-t pt-4">
                  <h3 className="text-lg font-semibold">Form Fields</h3>
                  {selectedForm.fields.map(field => (
                    <FormFieldItem
                      key={field.id}
                      field={field}
                      formId={selectedForm._id}
                      onFieldChange={handleFieldChange}
                      onAddOption={handleAddOption}
                      onRemoveOption={handleRemoveOption}
                    />
                  ))}
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedFormId(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleSaveForm(selectedForm._id)}
                    disabled={savingId === selectedForm._id}
                  >
                    {savingId === selectedForm._id ? (
                      <FiSave className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <FiCheck className="w-4 h-4 mr-2" />
                    )}
                    Save Changes
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

const FormFieldItem = React.memo(({
  field,
  formId,
  onFieldChange,
  onAddOption,
  onRemoveOption
}: {
  field: FormField
  formId: string
  onFieldChange: (formId: string, fieldId: string, key: keyof FormField, value: any) => void
  onAddOption: (formId: string, fieldId: string) => void
  onRemoveOption: (formId: string, fieldId: string, index: number) => void
}) => (
  <div className="border-l-4 border-primary/10 pl-4 space-y-4">
    <div className="flex items-center justify-between gap-4">
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <Input
            value={field.label}
            onChange={(e) => onFieldChange(formId, field.id, 'label', e.target.value)}
            className="font-medium"
          />
          {field.required && (
            <span className="text-sm text-destructive flex items-center gap-1">
              <FaRegCheckCircle className="w-4 h-4" />
              Required
            </span>
          )}
        </div>
        <Input
          value={field.description}
          onChange={(e) => onFieldChange(formId, field.id, 'description', e.target.value)}
          placeholder="Field description"
          className="text-muted-foreground"
        />
      </div>
      <div className="flex items-center gap-2">
        <Label>Required</Label>
        <Switch
          checked={field.required}
          onCheckedChange={(checked) => 
            onFieldChange(formId, field.id, 'required', checked)
          }
        />
      </div>
    </div>

    {field.type === 'checkbox' && (
      <div className="space-y-2">
        <Label>Options</Label>
        {field.options?.map((option, index) => (
          <div key={index} className="flex items-center gap-2">
            <FiToggleRight className="w-4 h-4 text-muted-foreground" />
            <Input
              value={option}
              onChange={(e) => {
                const newOptions = [...field.options!]
                newOptions[index] = e.target.value
                onFieldChange(formId, field.id, 'options', newOptions)
              }}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemoveOption(formId, field.id, index)}
            >
              <FiTrash2 className="w-4 h-4 text-destructive" />
            </Button>
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAddOption(formId, field.id)}
        >
          <FiPlus className="w-4 h-4 mr-2" />
          Add Option
        </Button>
      </div>
    )}

    {field.type === 'image' && (
      <div className="space-y-2">
        <Label>Image Upload</Label>
        <Button variant="outline" className="w-full">
          <FiImage className="w-5 h-5 mr-2" />
          Upload Image
        </Button>
      </div>
    )}

    {(field.type === 'text' || field.type === 'number') && (
      <div className="space-y-2">
        <Label>Preview</Label>
        <Input
          type={field.type}
          disabled
          placeholder="Sample input"
        />
      </div>
    )}
  </div>
))

export default CustomReports