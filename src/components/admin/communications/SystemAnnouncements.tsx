import { useState, useEffect, useCallback } from 'react';
import { FiEdit, FiTrash, FiPlus, FiX } from 'react-icons/fi';
import { useDropzone } from 'react-dropzone';
import { fetchBlogs, fetchFAQs, saveData, deleteData } from '../../../api/faqApi';
import { toast, Toaster} from 'react-hot-toast';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../ui/alert-dialog"
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"
import { Textarea } from "../../ui/textarea"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table"
import { Skeleton } from "../../ui/skeleton"
import { Badge } from "../../ui/badge"

interface FAQ {
  _id?: string;
  question: string;
  answer: string;
}

interface BlogPost {
  _id?: string;
  title: string;
  content: string;
  date: string;
  status: 'draft' | 'published';
}

const SystemAnnouncements: React.FC = () => {
  const [activeTab, setActiveTab] = useState("faqs");
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [editingItem, setEditingItem] = useState<FAQ | BlogPost | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteItem, setDeleteItem] = useState<{ id: string; type: 'faq' | 'blog' } | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [faqData, blogData] = await Promise.all([
          fetchFAQs().catch(() => []),
          fetchBlogs().catch(() => [])
        ]);
        setFaqs(faqData);
        setBlogs(blogData);
      } catch (error) {
        toast.error('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSubmit = async (data: FAQ | BlogPost) => {
    try {
      await toast.promise(
        saveData(data, setIsDialogOpen),
        {
          loading: 'Saving...',
          success: 'Saved successfully!',
          error: 'Failed to save',
        }
      );
      
      const [updatedFaqs, updatedBlogs] = await Promise.all([
        fetchFAQs().catch(() => []),
        fetchBlogs().catch(() => [])
      ]);
      
      setFaqs(updatedFaqs);
      setBlogs(updatedBlogs);
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving:', error);
    }
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
  
    try {
      await toast.promise(
        deleteData(deleteItem.id, deleteItem.type === "faq" ? "faqs" : "blogs"),
        {
          loading: "Deleting...",
          success: "Deleted successfully!",
          error: "Failed to delete",
        }
      );
  
      const [updatedFaqs, updatedBlogs] = await Promise.all([
        fetchFAQs(),
        fetchBlogs()
      ]);
  
      setFaqs(updatedFaqs);
      setBlogs(updatedBlogs);
      
    } catch (error) {
      console.error("Error deleting:", error);
    } finally {
      setDeleteItem(null);
    }
  };
  

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
      <div className="p-8 max-w-7xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="faqs">FAQs</TabsTrigger>
              <TabsTrigger value="blogs">Blog Posts</TabsTrigger>
            </TabsList>
            
            <Button
              onClick={() => {
                setEditingItem(null);
                setIsDialogOpen(true);
              }}
              className="gap-2 w-full sm:w-auto"
            >
              <FiPlus /> Add New
            </Button>
          </div>

          <TabsContent value="faqs">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[70%]">Question</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array(4).fill(0).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className="h-4 w-full max-w-[400px]" />
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Skeleton className="h-8 w-8" />
                          <Skeleton className="h-8 w-8" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : faqs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center h-24">
                      No FAQs found
                    </TableCell>
                  </TableRow>
                ) : (
                  faqs.map(faq => (
                    <TableRow key={faq._id}>
                      <TableCell className="font-medium truncate max-w-[300px]">
                        {faq.question}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingItem(faq);
                            setIsDialogOpen(true);
                          }}
                        >
                          <FiEdit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => setDeleteItem({ id: faq._id!, type: 'faq' })}
                        >
                          <FiTrash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="blogs">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50%]">Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array(4).fill(0).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Skeleton className="h-8 w-8" />
                          <Skeleton className="h-8 w-8" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : blogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center h-24">
                      No blog posts found
                    </TableCell>
                  </TableRow>
                ) : (
                  blogs.map(blog => (
                    <TableRow key={blog._id}>
                      <TableCell className="font-medium truncate max-w-[200px]">
                        {blog.title}
                      </TableCell>
                      <TableCell>
                        <Badge variant={blog.status === 'published' ? 'default' : 'secondary'}>
                          {blog.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(blog.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingItem(blog);
                            setIsDialogOpen(true);
                          }}
                        >
                          <FiEdit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => setDeleteItem({ id: blog._id!, type: 'blog' })}
                        >
                          <FiTrash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingItem?._id ? 'Edit' : 'Create New'} {activeTab === 'faqs' ? 'FAQ' : 'Blog Post'}
              </DialogTitle>
            </DialogHeader>
            
            {activeTab === 'faqs' ? (
              <FAQForm 
                initialData={editingItem as FAQ || { question: '', answer: '' }}
                onSubmit={handleSubmit}
                onCancel={() => setIsDialogOpen(false)}
              />
            ) : (
              <BlogForm 
                initialData={editingItem as BlogPost || { 
                  title: '', 
                  content: '', 
                  date: new Date().toISOString(),
                  status: 'draft'
                }}
                onSubmit={handleSubmit}
                onCancel={() => setIsDialogOpen(false)}
              />
            )}
          </DialogContent>
        </Dialog>

        <AlertDialog open={!!deleteItem} onOpenChange={(open) => !open && setDeleteItem(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this {deleteItem?.type}? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
};

const FAQForm: React.FC<{ 
  initialData: FAQ;
  onSubmit: (faq: FAQ) => void;
  onCancel: () => void;
}> = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<FAQ>(initialData);

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-2 block">Question</label>
        <Input
          value={formData.question}
          onChange={(e) => setFormData({ ...formData, question: e.target.value })}
          required
          maxLength={200}
        />
        <div className="text-xs text-muted-foreground text-right mt-1">
          {formData.question.length}/200
        </div>
      </div>
      <div>
        <label className="text-sm font-medium mb-2 block">Answer</label>
        <Textarea
          value={formData.answer}
          onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
          className="min-h-[120px]"
          required
          maxLength={1000}
        />
        <div className="text-xs text-muted-foreground text-right mt-1">
          {formData.answer.length}/1000
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save Changes</Button>
      </DialogFooter>
    </form>
  );
};

interface BlogFormProps {
  initialData: any;
  onSubmit: (blog: any) => void;
  onCancel: () => void;
  isEditMode?: boolean;
}

const BlogForm = ({ 
  initialData,
  onSubmit,
  onCancel,
  isEditMode = false
}: BlogFormProps) => {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    content: initialData.content || '',
    date: initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : '',
    status: initialData.status || 'draft',
  });
  
  const [existingImages, setExistingImages] = useState<string[]>(initialData.images || []);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [removedImages, setRemovedImages] = useState<string[]>([]);

  const totalImages = existingImages.length - removedImages.length + newImages.length;

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const remainingSlots = 8 - totalImages;
    const filesToAdd = acceptedFiles.slice(0, remainingSlots);
    setNewImages(prev => [...prev, ...filesToAdd]);
  }, [totalImages]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {'image/*': []},
    multiple: true,
    disabled: totalImages >= 8
  });

  const handleRemoveNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingImage = (url: string) => {
    if (totalImages <= 1) return;
    setRemovedImages(prev => [...prev, url]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (totalImages < 1) {
      alert('Please upload at least one image');
      return;
    }

    const formPayload = new FormData();
    const keptExistingImages = existingImages.filter(url => !removedImages.includes(url));

    formPayload.append('existingImages', JSON.stringify(keptExistingImages));

    newImages.forEach(file => formPayload.append('images', file));

    Object.entries(formData).forEach(([key, value]) => {
      formPayload.append(key, value);
    });

    try {
      const base_url = import.meta.env.VITE_API_URL;
      const url = isEditMode 
        ? `${base_url}}/api/blogs/update/${initialData._id}`
        : `${base_url}/api/blogs/create-blog`;
      
      const response = await fetch(url, {
        method: isEditMode ? 'PUT' : 'POST',
        body: formPayload,
      });

      if (!response.ok) throw new Error('Request failed');
      
      const result = await response.json();
      onSubmit(result);
    } catch (error) {
      console.error('Submission error:', error);
      alert('Error saving blog. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Title</label>
        <Input
          value={formData.title}
          onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
          required
          maxLength={120}
        />
        <div className="text-xs text-muted-foreground text-right mt-1">
          {formData.title.length}/120
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Content</label>
        <Textarea
          value={formData.content}
          onChange={e => setFormData(prev => ({ ...prev, content: e.target.value }))}
          className="min-h-[200px]"
          required
          maxLength={5000}
        />
        <div className="text-xs text-muted-foreground text-right mt-1">
          {formData.content.length}/5000
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Images ({totalImages}/8)
        </label>
        
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            ${isDragActive ? 'border-primary bg-primary/10' : 'border-muted'}
            ${totalImages >= 8 ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input {...getInputProps()} />
          <p className="text-muted-foreground">
            {isDragActive 
              ? 'Drop images here...' 
              : 'Drag & drop images here, or click to select'}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Minimum 1 image, maximum 8 images
          </p>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4">
          {existingImages.map((url, index) => (
            !removedImages.includes(url) && (
              <div key={url} className="relative group">
                <img
                  src={url}
                  alt={`Preview ${index}`}
                  className="w-full h-32 object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveExistingImage(url)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  disabled={totalImages === 1}
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            )
          ))}

          {/* New Images */}
          {newImages.map((file, index) => (
            <div key={file.name} className="relative group">
              <img
                src={URL.createObjectURL(file)}
                alt={`Preview ${index}`}
                className="w-full h-32 object-cover rounded-lg border"
              />
              <button
                type="button"
                onClick={() => handleRemoveNewImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Date and Status Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Date</label>
          <Input
            type="date"
            value={formData.date}
            onChange={e => setFormData(prev => ({ 
              ...prev, 
              date: e.target.value 
            }))}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Status</label>
          <select
            value={formData.status}
            onChange={e => setFormData(prev => ({ 
              ...prev, 
              status: e.target.value 
            }))}
            className="w-full p-2 border rounded-md"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel} type="button">
          Cancel
        </Button>
        <Button type="submit">
          {isEditMode ? 'Update Post' : 'Create Post'}
        </Button>
      </DialogFooter>
    </form>
  );
};


export default SystemAnnouncements;