import { useState, useEffect } from 'react'
import { Button } from '../../ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog'
import { DataTable } from '../../ui/data-table'
import { Input } from '../../ui/input'
import { Skeleton } from '../../ui/skeleton'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '../../ui/dropdown-menu'
import { MoreHorizontal, Plus, Edit, Trash } from 'lucide-react'
import { Announcement } from '../../../lib/options';

const SystemAnnouncements: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [editData, setEditData] = useState<Announcement | null>(null)
  const [openDialog, setOpenDialog] = useState(false)

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch('/api/announcements')
      const data = await response.json()
      setAnnouncements(data)
    } catch (error) {
      console.error('Error fetching announcements:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget as HTMLFormElement)
    
    try {
      const response = await fetch('/api/announcements', {
        method: editData?._id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          _id: editData?._id,
          title: formData.get('title'),
          content: formData.get('content')
        })
      })

      if (response.ok) {
        fetchAnnouncements()
        setOpenDialog(false)
        setEditData(null)
      }
    } catch (error) {
      console.error('Error saving announcement:', error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/announcements/${id}`, { method: 'DELETE' })
      fetchAnnouncements()
    } catch (error) {
      console.error('Error deleting announcement:', error)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-[200px]" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">System Announcements</h2>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Announcement
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editData ? 'Edit Announcement' : 'Create Announcement'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input 
                name="title" 
                placeholder="Title" 
                defaultValue={editData?.title} 
                required 
              />
              <Input 
                name="content" 
                placeholder="Content" 
                defaultValue={editData?.content} 
                required 
                multiline 
                className="min-h-[100px]"
              />
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setOpenDialog(false)
                    setEditData(null)
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <DataTable
        data={announcements}
        columns={[
          { header: 'Title', accessorKey: 'title' },
          { header: 'Content', accessorKey: 'content' },
          {
            id: 'actions',
            cell: ({ row }) => (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => {
                      setEditData(row.original)
                      setOpenDialog(true)
                    }}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDelete(row.original._id)}
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )
          }
        ]}
      />
    </div>
  )
}

export default SystemAnnouncements