import { useState, useEffect, useCallback } from 'react';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { FiX } from 'react-icons/fi';
import { useDropzone } from 'react-dropzone';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '../../ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../ui/table';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Skeleton } from '../../ui/skeleton';
interface Blog {
  _id: string;
  title: string;
  status: 'draft' | 'published';
  date: string;
  content: string;
  images: string[];
}
interface BlogFormProps {
    initialData: any;
    onSubmit: (blog: any) => void;
    onCancel: () => void;
    isEditMode?: boolean;
  }

export const BlogForm = ({ 
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
        ? `${base_url}/api/blogs/update/${initialData._id}`
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



const BlogManagement = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const base_url = import.meta.env.VITE_API_URL;

  const fetchBlogs = async () => {
    try {
      const response = await fetch(`${base_url}/api/blogs/get-blogs`);
      if (!response.ok) throw new Error('Failed to fetch blogs');
      const data = await response.json();
      setBlogs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch blogs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleEditClick = (blog: Blog) => {
    setSelectedBlog(blog);
    setIsDialogOpen(true);
  };

  const handleCreateClick = () => {
    setSelectedBlog(null);
    setIsDialogOpen(true);
  };

  const handleSubmitSuccess = () => {
    setIsDialogOpen(false);
    fetchBlogs();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;
    
    try {
      const response = await fetch(`${base_url}/api/blogs/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Delete failed');
      fetchBlogs();
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete blog');
    }
  };

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Blog Management</h1>
        <Button onClick={handleCreateClick}>
          <FiPlus className="mr-2 h-4 w-4" /> New Post
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Images</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array(5).fill(0).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[50px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                </TableRow>
              ))
            ) : (
              blogs.map((blog) => (
                <TableRow key={blog._id}>
                  <TableCell className="font-medium">{blog.title}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={blog.status === 'published' ? 'default' : 'secondary'}
                    >
                      {blog.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(blog.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{blog.images.length}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditClick(blog)}
                      >
                        <FiEdit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(blog._id)}
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>
              {selectedBlog ? 'Edit Blog Post' : 'Create New Blog Post'}
            </DialogTitle>
          </DialogHeader>
          <BlogForm
            initialData={selectedBlog || {}}
            onSubmit={handleSubmitSuccess}
            onCancel={() => setIsDialogOpen(false)}
            isEditMode={!!selectedBlog}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BlogManagement;