import React, { useEffect, useState } from 'react'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Textarea } from '../../ui/textarea'
import { Switch } from '../../ui/switch'
import { Label } from '../../ui/label'
import { toast, Toaster } from 'react-hot-toast'
import { 
  FiEdit,
  FiCheck,
  FiImage,
  FiTrash2,
  FiPlus,
  FiType,
  FiToggleRight,
  FiSave
} from 'react-icons/fi'
import { FaToggleOff, FaRegCheckCircle } from 'react-icons/fa'

interface FormField {
  id: string
  type: 'text' | 'checkbox' | 'image' | 'number'
  label: string
  required: boolean
  description: string
  options?: string[]
}

interface ReportForm {
  _id: string
  title: string
  description: string
  fields: FormField[]
  __v: number
}

const CustomReports: React.FC = () => {
  const [forms, setForms] = useState<ReportForm[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [savingId, setSavingId] = useState<string | null>(null)

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await fetch('http://localhost:5000/form/get-report')
        if (!response.ok) throw new Error('Failed to fetch')
        const data = await response.json()
        setForms(data)
      } catch (err) {
        setError('Failed to load forms. Please try again later.')
        toast.error('Failed to fetch report forms')
      } finally {
        setLoading(false)
      }
    }
    
    fetchForms()
  }, [])

  const handleFormChange = (formId: string, field: keyof ReportForm, value: any) => {
    setForms(prev => prev.map(form => 
      form._id === formId ? { ...form, [field]: value } : form
    ))
  }

  const handleFieldChange = (formId: string, fieldId: string, key: keyof FormField, value: any) => {
    setForms(prev => prev.map(form => {
      if (form._id === formId) {
        return {
          ...form,
          fields: form.fields.map(field => {
            if (field.id === fieldId) {
              return { ...field, [key]: value }
            }
            return field
          })
        }
      }
      return form
    }))
  }

  const handleAddOption = (formId: string, fieldId: string) => {
    setForms(prev => prev.map(form => {
      if (form._id === formId) {
        return {
          ...form,
          fields: form.fields.map(field => {
            if (field.id === fieldId) {
              const options = field.options ? [...field.options, 'New Option'] : ['New Option']
              return { ...field, options }
            }
            return field
          })
        }
      }
      return form
    }))
  }

  const handleRemoveOption = (formId: string, fieldId: string, index: number) => {
    setForms(prev => prev.map(form => {
      if (form._id === formId) {
        return {
          ...form,
          fields: form.fields.map(field => {
            if (field.id === fieldId && field.options) {
              const options = [...field.options]
              options.splice(index, 1)
              return { ...field, options }
            }
            return field
          })
        }
      }
      return form
    }))
  }

  const handleSaveForm = async (formId: string) => {
    setSavingId(formId)
    try {
      const formToUpdate = forms.find(f => f._id === formId)
      if (!formToUpdate) return

      const response = await fetch(`http://localhost:5000/form/update-report/${formId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formToUpdate)
      })

      if (!response.ok) throw new Error('Update failed')

      toast.success('Form updated successfully')
    } catch (err) {
      toast.error('Failed to update form')
    } finally {
      setSavingId(null)
    }
  }


  if (error) return (
    <div className="p-6 bg-red-50 text-red-700 rounded-md max-w-2xl mx-auto mt-8">
      {error}
    </div>
  )

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

        <div className="grid grid-cols-1 gap-6">
          {forms.map(form => (
            <div key={form._id} className="bg-background rounded-lg shadow-sm border p-6">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                <div className="space-y-2 w-full">
                  <div className="flex items-center gap-2">
                    <FiType className="w-5 h-5 text-primary" />
                    <Input
                      value={form.title}
                      onChange={(e) => handleFormChange(form._id, 'title', e.target.value)}
                      className="text-xl font-semibold h-12 px-2"
                    />
                  </div>
                  <Textarea
                    value={form.description}
                    onChange={(e) => handleFormChange(form._id, 'description', e.target.value)}
                    className="text-foreground/80 resize-none"
                    placeholder="Form description"
                  />
                </div>
                <Button
                  onClick={() => handleSaveForm(form._id)}
                  disabled={savingId === form._id}
                  className="w-full md:w-auto"
                >
                  {savingId === form._id ? (
                    <FiSave className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <FiCheck className="w-4 h-4 mr-2" />
                  )}
                  {savingId === form._id ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>

              <div className="space-y-6">
                {form.fields.map(field => (
                  <div key={field.id} className="border-l-4 border-primary/10 pl-4">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-2">
                      <div className="space-y-2 w-full">
                        <div className="flex items-center gap-3">
                          <Input
                            value={field.label}
                            onChange={(e) => handleFieldChange(form._id, field.id, 'label', e.target.value)}
                            className="font-medium text-foreground"
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
                          onChange={(e) => handleFieldChange(form._id, field.id, 'description', e.target.value)}
                          placeholder="Field description"
                          className="text-foreground/60"
                        />
                      </div>
                      <div className="flex items-center gap-2 w-full md:w-auto">
                        <Label className="text-sm">Required</Label>
                        <Switch
                          checked={field.required}
                          onCheckedChange={(checked) => 
                            handleFieldChange(form._id, field.id, 'required', checked)
                          }
                        />
                      </div>
                    </div>

                    {field.type === 'checkbox' && (
                      <div className="mt-4 space-y-2">
                        <Label>Options</Label>
                        {field.options?.map((option, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <FiToggleRight className="w-4 h-4 text-muted-foreground" />
                            <Input
                              value={option}
                              onChange={(e) => {
                                const newOptions = [...field.options!]
                                newOptions[index] = e.target.value
                                handleFieldChange(form._id, field.id, 'options', newOptions)
                              }}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveOption(form._id, field.id, index)}
                            >
                              <FiTrash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddOption(form._id, field.id)}
                        >
                          <FiPlus className="w-4 h-4 mr-2" />
                          Add Option
                        </Button>
                      </div>
                    )}

                    {field.type === 'image' && (
                      <div className="mt-4">
                        <Label>Image Upload</Label>
                        <Button
                          variant="outline"
                          className="mt-2"
                        >
                          <FiImage className="w-5 h-5 mr-2" />
                          Upload Image
                        </Button>
                      </div>
                    )}

                    {(field.type === 'text' || field.type === 'number') && (
                                          <div className="mt-4">
                                            <Label>Preview</Label>
                                            <Input
                                              type={field.type}
                                              disabled
                                              placeholder="Sample input"
                                              className="mt-2"
                                            />
                                          </div>
                       )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </>
  )
}

export default CustomReports