import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { DndContext, DragOverlay, closestCorners, pointerWithin, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDropzone } from 'react-dropzone';
import { Plus, GripVertical, Trash2, Text, List, CheckSquare, Image, Radio, UploadCloud } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';

import { Button } from '../..//ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../..//ui/card';
import { Input } from '../../ui/input';
import { Label } from '../..//ui/label';
import { Tabs, TabsList, TabsTrigger } from '../..//ui/tabs';
import { Switch } from '../..//ui/switch';
import { ScrollArea } from '../../ui/scroll-area';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '../../ui/tooltip';
import { Badge } from '../../ui/badge';
import { Separator } from '../../ui/separator';
import { Progress } from '../../ui/progress';

type FormField = {
  id: string;
  type: 'text' | 'number' | 'radio' | 'checkbox' | 'image' | 'dropdown';
  label: string;
  required: boolean;
  options?: string[];
  description?: string;
  image?: string;
  uploadProgress?: number;
};

const FIELD_TYPES = [
  { type: 'text', icon: <Text className="h-4 w-4" />, label: 'Text' },
  { type: 'number', icon: <Text className="h-4 w-4" />, label: 'Number' },
  { type: 'radio', icon: <Radio className="h-4 w-4" />, label: 'Radio' },
  { type: 'checkbox', icon: <CheckSquare className="h-4 w-4" />, label: 'Checkbox' },
  { type: 'image', icon: <Image className="h-4 w-4" />, label: 'Image' },
  { type: 'dropdown', icon: <List className="h-4 w-4" />, label: 'Dropdown' },
];

const SortableItem = ({ field, children, ...props }: any) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: field.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative group"
      {...attributes}
    >
      <div className="absolute -left-6 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="w-6 h-6 cursor-grab active:cursor-grabbing"
          {...listeners}
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>
      <div className={`${isDragging ? 'opacity-50' : 'opacity-100'} transition-opacity`}>
        {children}
      </div>
    </motion.div>
  );
};

const AddReports: React.FC = () => {
  const [fields, setFields] = useState<FormField[]>([]);
  const [activeFieldId, setActiveFieldId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState('Untitled Form');
  const [formDescription, setFormDescription] = useState('');
  const [activeTab, setActiveTab] = useState('build');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [templateFile, setTemplateFile] = useState<File | null>(null);
  const [templateUploadProgress, setTemplateUploadProgress] = useState(0);

  const activeField = fields.find(field => field.id === activeFieldId) || null;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const { getRootProps: getImageRootProps, getInputProps: getImageInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': ['.png', '.jpg', '.jpeg'] },
    multiple: false,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file && activeFieldId) {
        const reader = new FileReader();
        reader.onloadstart = () => {
          setFields(fields.map(f => 
            f.id === activeFieldId ? { ...f, uploadProgress: 0 } : f
          ));
        };
        reader.onprogress = (e) => {
          if (e.lengthComputable) {
            const progress = Math.round((e.loaded / e.total) * 100);
            setFields(fields.map(f => 
              f.id === activeFieldId ? { ...f, uploadProgress: progress } : f
            ));
          }
        };
        reader.onload = () => {
          setFields(fields.map(f => 
            f.id === activeFieldId ? { ...f, image: reader.result as string, uploadProgress: undefined } : f
          ));
        };
        reader.readAsDataURL(file);
      }
    },
  });

  const { getRootProps: getTemplateRootProps, getInputProps: getTemplateInputProps } = useDropzone({
    accept: { 
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    multiple: false,
    onDrop: (acceptedFiles) => {
      setTemplateFile(acceptedFiles[0]);
    },
  });

  const addField = useCallback((type: FormField['type']) => {
    const newField: FormField = {
      id: uuidv4(),
      type,
      label: `${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      required: false,
      description: '',
      options: type === 'radio' || type === 'dropdown' || type === 'checkbox' ? ['Option 1'] : undefined,
    };
    setFields(prev => [...prev, newField]);
    setActiveFieldId(newField.id);
  }, []);

  const handleDragStart = useCallback((event: any) => {
    setActiveFieldId(event.active.id);
  }, []);

  const handleDragEnd = useCallback((event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setFields((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
    setActiveFieldId(null);
  }, []);

  const updateField = useCallback((id: string, updates: Partial<FormField>) => {
    setFields(prev => prev.map(field => 
      field.id === id ? { ...field, ...updates } : field
    ));
  }, []);

  const deleteField = useCallback((id: string) => {
    setFields(prev => prev.filter(field => field.id !== id));
    setActiveFieldId(null);
  }, []);

  const handleAddOption = useCallback((fieldId: string) => {
    setFields(prev => prev.map(field => {
      if (field.id === fieldId && field.options) {
        return {
          ...field,
          options: [...field.options, `Option ${field.options.length + 1}`]
        };
      }
      return field;
    }));
  }, []);

  const handleOptionChange = useCallback((fieldId: string, index: number, value: string) => {
    setFields(prev => prev.map(field => {
      if (field.id === fieldId && field.options) {
        const newOptions = [...field.options];
        newOptions[index] = value;
        return { ...field, options: newOptions };
      }
      return field;
    }));
  }, []);

  const handleDeleteOption = useCallback((fieldId: string, index: number) => {
    setFields(prev => prev.map(field => {
      if (field.id === fieldId && field.options) {
        const newOptions = [...field.options];
        newOptions.splice(index, 1);
        return { ...field, options: newOptions };
      }
      return field;
    }));
  }, []);

  const submitForm = async () => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', formTitle);
      formData.append('description', formDescription);
      formData.append('fields', JSON.stringify(fields));
      
      if (templateFile) {
        formData.append('template', templateFile);
      }

      const config = {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent: any) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setTemplateUploadProgress(percentCompleted);
        }
      };

      await axios.post("http://localhost:5000/form/create-report", formData, config);
      
      toast.success("Form submitted successfully!");
      setFields([]);
      setFormTitle('Untitled Form');
      setFormDescription('');
      setTemplateFile(null);
      setTemplateUploadProgress(0);
    } catch (error) {
      toast.error("Error submitting form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" gutter={32} />
      <TooltipProvider>
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] gap-6 h-[calc(100vh-64px)] p-2 bg-muted/40">
          {/* Left Sidebar */}
          <Card className="h-full overflow-hidden">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Form Elements</CardTitle>
            </CardHeader>
            <ScrollArea className="h-[calc(100%-57px)]">
              <div className="grid grid-cols-2 gap-2 p-4">
                {FIELD_TYPES.map((item) => (
                  <Button
                    key={item.type}
                    variant="outline"
                    className="h-24 flex-col gap-2 hover:bg-accent/50 transition-colors"
                    onClick={() => addField(item.type as FormField['type'])}
                  >
                    {item.icon}
                    <span className="text-sm font-medium">{item.label}</span>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </Card>

          {/* Main Content */}
          <div className="flex flex-col gap-4">
            <Card className="h-full">
              <CardHeader className="pb-0">
                <div className="flex items-center justify-between">
                  <Input
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="text-2xl font-bold border-none px-0 focus-visible:ring-0"
                    placeholder="Form Title"
                  />
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList>
                      <TabsTrigger value="build">Build</TabsTrigger>
                      <TabsTrigger value="preview">Preview</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                <Input
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Form description (optional)"
                  className="text-muted-foreground border-none px-0 focus-visible:ring-0"
                />
              </CardHeader>
              
              {activeTab === 'build' ? (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCorners}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext items={fields}>
                    <ScrollArea className="h-[calc(100vh-220px)] px-6">
                      <AnimatePresence mode="popLayout">
                        {fields.length === 0 && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center h-96 gap-4 text-center text-muted-foreground"
                          >
                            <UploadCloud className="h-12 w-12" />
                            <p>Drag and drop fields here or click buttons on the left</p>
                          </motion.div>
                        )}
                        {fields.map((field) => (
                          <SortableItem key={field.id} field={field}>
                            <Card 
                              className="mb-4 group cursor-pointer hover:border-primary/30 transition-colors"
                              onClick={() => setActiveFieldId(field.id)}
                            >
                              <CardHeader className="flex flex-row items-start justify-between p-4 pb-0">
                                <div className="space-y-1 flex-1">
                                  <Input
                                    value={field.label}
                                    onChange={(e) => updateField(field.id, { label: e.target.value })}
                                    className="font-medium border-none px-0 focus-visible:ring-0"
                                    placeholder="Field label"
                                  />
                                  <Input
                                    value={field.description || ''}
                                    onChange={(e) => updateField(field.id, { description: e.target.value })}
                                    placeholder="Field description (optional)"
                                    className="text-sm text-muted-foreground border-none px-0 focus-visible:ring-0"
                                  />
                                </div>
                                <div className="flex items-center gap-2">
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => deleteField(field.id)}
                                      >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Delete field</TooltipContent>
                                  </Tooltip>
                                </div>
                              </CardHeader>
                              <CardContent className="p-4 pt-0">
                                {field.type === 'text' && <Input placeholder="Text input" disabled />}
                                {field.type === 'number' && <Input type="number" placeholder="Number input" disabled />}
                                {(field.type === 'radio' || field.type === 'checkbox') && (
                                  <div className="space-y-2">
                                    {field.options?.map((option, index) => (
                                      <div key={index} className="flex items-center gap-3">
                                        {field.type === 'radio' ? (
                                          <Radio className="h-4 w-4 shrink-0" />
                                        ) : (
                                          <CheckSquare className="h-4 w-4 shrink-0" />
                                        )}
                                        <Input
                                          value={option}
                                          onChange={(e) => handleOptionChange(field.id, index, e.target.value)}
                                        />
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() => handleDeleteOption(field.id, index)}
                                        >
                                          <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                      </div>
                                    ))}
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="mt-2"
                                      onClick={() => handleAddOption(field.id)}
                                    >
                                      <Plus className="mr-2 h-4 w-4" />
                                      Add Option
                                    </Button>
                                  </div>
                                )}
                                {field.type === 'image' && (
                                  <div
                                    {...getImageRootProps()}
                                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                                      isDragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/30'
                                    }`}
                                  >
                                    <input {...getImageInputProps()} />
                                    {field.image ? (
                                      <div className="relative group">
                                        <img
                                          src={field.image}
                                          alt="Preview"
                                          className="mx-auto max-h-40 object-cover rounded-lg"
                                        />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                                          <p className="text-white">Click to replace</p>
                                        </div>
                                      </div>
                                    ) : (
                                      <>
                                        {field.uploadProgress ? (
                                          <div className="space-y-2">
                                            <Progress value={field.uploadProgress} className="h-2" />
                                            <p className="text-sm text-muted-foreground">
                                              Uploading {field.uploadProgress}%
                                            </p>
                                          </div>
                                        ) : (
                                          <>
                                            <Image className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                                            <p className="text-sm text-muted-foreground">
                                              Drag & drop or click to upload
                                            </p>
                                            <p className="text-xs text-muted-foreground/60 mt-1">
                                              Recommended size: 800x400px
                                            </p>
                                          </>
                                        )}
                                      </>
                                    )}
                                  </div>
                                )}
                              </CardContent>
                              <CardFooter className="flex items-center justify-between px-4 py-3 border-t">
                                <Label className="flex items-center gap-2 text-sm">
                                  <Switch
                                    checked={field.required}
                                    onCheckedChange={(checked) => updateField(field.id, { required: checked })}
                                  />
                                  Required
                                </Label>
                                <Badge variant="outline" className="uppercase">
                                  {field.type}
                                </Badge>
                              </CardFooter>
                            </Card>
                          </SortableItem>
                        ))}
                      </AnimatePresence>
                    </ScrollArea>
                  </SortableContext>
                  <DragOverlay>
                    {activeField && (
                      <Card style={{ width: '100%', opacity: 0.8, boxShadow: '0 8px 32px rgba(0,0,0,0.2)', borderColor: '#3b82f6' }}>
                        <CardHeader className="p-4">
                          {activeField.label}
                        </CardHeader>
                      </Card>
                    )}
                  </DragOverlay>
                </DndContext>
              ) : (
                <div className="p-6">
                  <div className="max-w-2xl mx-auto space-y-6">
                    <div className="space-y-2">
                      <h1 className="text-3xl font-bold">{formTitle}</h1>
                      {formDescription && (
                        <p className="text-muted-foreground">{formDescription}</p>
                      )}
                    </div>
                    <Separator />
                    {fields.map((field) => (
                      <div key={field.id} className="space-y-2">
                        <Label className="flex items-center gap-2">
                          {field.label}
                          {field.required && (
                            <span className="text-destructive">*</span>
                          )}
                        </Label>
                        {field.description && (
                          <p className="text-sm text-muted-foreground">
                            {field.description}
                          </p>
                        )}
                        {field.type === 'text' && <Input />}
                        {field.type === 'number' && <Input type="number" />}
                        {field.type === 'radio' && (
                          <div className="space-y-2">
                            {field.options?.map((option, index) => (
                              <Label key={index} className="flex items-center gap-2">
                                <Radio />
                                {option}
                              </Label>
                            ))}
                          </div>
                        )}
                        {field.type === 'checkbox' && (
                          <div className="space-y-2">
                            {field.options?.map((option, index) => (
                              <Label key={index} className="flex items-center gap-2">
                                <CheckSquare />
                                {option}
                              </Label>
                            ))}
                          </div>
                        )}
                        {field.type === 'image' && (
                          <div className="border-2 border-dashed rounded-lg p-6 text-center">
                            <Image className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground">
                              Click to upload image
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                    <Button 
                      onClick={submitForm} 
                      className="w-full" 
                      size="lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Form'}
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>

          <Card className="h-full overflow-hidden">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Form Settings</CardTitle>
            </CardHeader>
            <ScrollArea className="h-[calc(100%-57px)] p-4">
              <div className="space-y-4 mb-8">
                <div className="space-y-2">
                  <Label>Upload Template (Optional)</Label>
                  <div
                    {...getTemplateRootProps()}
                    className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary/30 transition-colors"
                  >
                    <input {...getTemplateInputProps()} />
                    {templateFile ? (
                      <div className="space-y-2">
                        <p className="text-sm">{templateFile.name}</p>
                        {templateUploadProgress > 0 && (
                          <Progress value={templateUploadProgress} className="h-2" />
                        )}
                      </div>
                    ) : (
                      <>
                        <UploadCloud className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Drag & drop or click to upload template
                        </p>
                        <p className="text-xs text-muted-foreground/60 mt-1">
                          Supported formats: PDF, DOC, DOCX, XLS, XLSX
                        </p>
                      </>
                    )}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>Citizens can use this template or fill the form below</p>
                </div>
              </div>

              {/* Field Settings */}
              {activeField ? (
                <div className="space-y-6 border-t pt-6">
                  <div className="space-y-2">
                    <Label>Field Label</Label>
                    <Input
                      value={activeField.label}
                      onChange={(e) => updateField(activeField.id, { label: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Input
                      value={activeField.description || ''}
                      onChange={(e) => updateField(activeField.id, { description: e.target.value })}
                      placeholder="Help text for this field"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Required Field</Label>
                      <Switch
                        checked={activeField.required}
                        onCheckedChange={(checked) => updateField(activeField.id, { required: checked })}
                      />
                    </div>
                  </div>
                  {['radio', 'checkbox', 'dropdown'].includes(activeField.type) && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Options</Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAddOption(activeField.id)}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add Option
                        </Button>
                      </div>
                      {activeField.options?.map((option, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input
                            value={option}
                            onChange={(e) => handleOptionChange(activeField.id, index, e.target.value)}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteOption(activeField.id, index)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-32 text-muted-foreground">
                  Select a field to configure properties
                </div>
              )}
            </ScrollArea>
          </Card>
        </div>
      </TooltipProvider>
    </>
  );
};

export default AddReports;