import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { DndContext, DragOverlay, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDropzone } from 'react-dropzone';
import { Plus, GripVertical, Trash2, Text, List, CheckSquare, Image, Radio } from 'lucide-react';

import { Button } from '../..//ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../..//ui/card';
import { Input } from '../../ui/input';
import { Label } from '../..//ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../..//ui/tabs';
import { Switch } from '../..//ui/switch';
import { ScrollArea } from '../../ui/scroll-area';

type FormField = {
  id: string;
  type: 'text' | 'number' | 'radio' | 'checkbox' | 'image' | 'dropdown';
  label: string;
  required: boolean;
  options?: string[];
};

const AddReports: React.FC = () => {
  const [fields, setFields] = useState<FormField[]>([]);
  const [activeField, setActiveField] = useState<FormField | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': [] },
    multiple: false,
    onDrop: (acceptedFiles) => {

    },
  });

  const addField = (type: FormField['type']) => {
    const newField: FormField = {
      id: uuidv4(),
      type,
      label: `New ${type} Field`,
      required: false,
      options: type === 'radio' || type === 'dropdown' ? ['Option 1'] : undefined,
    };
    setFields([...fields, newField]);
  };

  const handleDragStart = (event: any) => {
    const active = fields.find((field) => field.id === event.active.id);
    setActiveField(active || null);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setFields((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
    setActiveField(null);
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(fields.map(field => 
      field.id === id ? { ...field, ...updates } : field
    ));
  };

  const deleteField = (id: string) => {
    setFields(fields.filter(field => field.id !== id));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-screen p-6">
      {/* Form Builder Sidebar */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Field Types</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" className="w-full" onClick={() => addField('text')}>
            <Text className="mr-2 h-4 w-4" /> Text Field
          </Button>
          <Button variant="outline" className="w-full" onClick={() => addField('number')}>
            <Text className="mr-2 h-4 w-4" /> Number Field
          </Button>
          <Button variant="outline" className="w-full" onClick={() => addField('radio')}>
            <Radio className="mr-2 h-4 w-4" /> Radio Group
          </Button>
          <Button variant="outline" className="w-full" onClick={() => addField('checkbox')}>
            <CheckSquare className="mr-2 h-4 w-4" /> Checkbox
          </Button>
          <Button variant="outline" className="w-full" onClick={() => addField('image')}>
            <Image className="mr-2 h-4 w-4" /> Image Upload
          </Button>
        </CardContent>
      </Card>

      <div className="lg:col-span-3 space-y-4">
        <Card>
          <CardHeader>
            <Input
              placeholder="Form Title"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              className="text-2xl font-bold border-none"
            />
            <Input
              placeholder="Form Description"
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              className="text-muted-foreground border-none"
            />
          </CardHeader>
        </Card>

        <DndContext
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={fields} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
              {fields.map((field) => (
                <Card key={field.id}>
                  <CardHeader className="flex flex-row items-center justify-between p-4">
                    <GripVertical className="mr-2 h-5 w-5 cursor-move" />
                    <div className="flex-1">
                      <Input
                        value={field.label}
                        onChange={(e) => updateField(field.id, { label: e.target.value })}
                        className="font-medium"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Label>Required</Label>
                      <Switch
                        checked={field.required}
                        onCheckedChange={(checked) => updateField(field.id, { required: checked })}
                      />
                      <Trash2
                        className="h-5 w-5 text-destructive cursor-pointer"
                        onClick={() => deleteField(field.id)}
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    {field.type === 'text' && <Input placeholder="Text input" disabled />}
                    {field.type === 'number' && <Input type="number" placeholder="Number input" disabled />}
                    {field.type === 'radio' && (
                      <div className="space-y-2">
                        {field.options?.map((option, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Radio className="h-4 w-4" />
                            <Input
                              value={option}
                              onChange={(e) => {
                                const newOptions = [...field.options!];
                                newOptions[index] = e.target.value;
                                updateField(field.id, { options: newOptions });
                              }}
                            />
                          </div>
                        ))}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            updateField(field.id, { options: [...field.options!, `Option ${field.options!.length + 1}`] })
                          }
                        >
                          <Plus className="mr-2 h-4 w-4" /> Add Option
                        </Button>
                      </div>
                    )}
                    {field.type === 'image' && (
                      <div
                        {...getRootProps()}
                        className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer"
                      >
                        <input {...getInputProps()} />
                        <Image className="mx-auto h-12 w-12 text-muted-foreground" />
                        <p className="mt-2">Drag & drop or click to upload</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </SortableContext>
          <DragOverlay>
            {activeField ? (
              <Card style={{ width: '100%', opacity: 0.8 }}>
                <CardHeader className="p-4">
                  {activeField.label}
                </CardHeader>
              </Card>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Form Preview</CardTitle>
        </CardHeader>
        <ScrollArea className="h-[calc(100vh-180px)] p-4">
          <div className="space-y-4">
            <h2 className="text-xl font-bold">{formTitle}</h2>
            <p className="text-muted-foreground">{formDescription}</p>
            
            {fields.map((field) => (
              <div key={field.id} className="space-y-2">
                <Label>
                  {field.label}
                  {field.required && <span className="text-destructive ml-1">*</span>}
                </Label>
                {field.type === 'text' && <Input />}
                {field.type === 'number' && <Input type="number" />}
                {field.type === 'radio' && field.options?.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Radio id={`${field.id}-${index}`} />
                    <Label htmlFor={`${field.id}-${index}`}>{option}</Label>
                  </div>
                ))}
                {field.type === 'image' && (
                  <div className="border-2 border-dashed rounded-lg p-4 text-center">
                    <Image className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-2 text-sm">Upload image</p>
                  </div>
                )}
              </div>
            ))}
            
            <Button className="w-full">Submit Form</Button>
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
};

export default AddReports;