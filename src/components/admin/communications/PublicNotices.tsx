'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { CheckCircleIcon, PenLine } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import { Badge } from '../../ui/badge';
import { Skeleton } from '../../ui/skeleton';
import { Button } from '../../ui/button';
import { Textarea } from '../../ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../ui/dialog';

interface IComplaint {
  _id: string;
  title: string;
  description: string;
  category: string;
  status: 'Pending' | 'In Review' | 'Resolved';
  anonymous: boolean;
  location: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  userId?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  adminNote?: string;
}

const STATUS_OPTIONS = [
  { value: 'Pending', label: 'Pending' },
  { value: 'In Review', label: 'In Review' },
  { value: 'Resolved', label: 'Resolved' },
];

const PublicNotices = () => {
  const [complaints, setComplaints] = useState<IComplaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState<IComplaint | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/complaints/complaint-admin`);
        setComplaints(response.data);
      } catch (err) {
        setError('Failed to fetch complaints');
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

console.log(complaints);
  
  const handleStatusUpdate = async () => {
    if (!selectedComplaint) return;

    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/complaints/complaint-admin/${selectedComplaint._id}/status`, {
        status: newStatus,
        adminNote: newNote,
      });

      setComplaints(prev =>
        prev.map(c =>
          c._id === selectedComplaint._id
            ? { ...c, status: newStatus as IComplaint['status'], adminNote: newNote }
            : c
        )
      );

      setSelectedComplaint(null);
      setNewStatus('');
      setNewNote('');

      toast.success('Complaint Status Updated Successfully!', {
              icon: <CheckCircleIcon className="w-6 h-6 text-green-400" />,
              style: {
                background: '#1a1d24',
                color: '#fff',
                border: '1px solid #2a2f38',
                padding: '16px',
              },
              duration: 4000,
            });
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };



const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'Pending':
      return 'secondary';
    case 'In Review':
      return 'default';
    case 'Resolved':
      return 'destructive';
    default:
      return 'outline';
  }
};

  if (error) return <div className="text-red-500 p-4">{error}</div>;
  if (loading) return <Skeleton className="w-full h-[400px] rounded-lg" />;

  return (
    <div className="rounded-md border">
      <Toaster
            position="top-right"
            gutter={32}
            containerClassName="!top-4 !right-6"
            toastOptions={{
              className: '!bg-[#1a1d24] !text-white !rounded-xl !border !border-[#2a2f38]',
            }}
          />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Admin Notes</TableHead>
            <TableHead>Submitted By</TableHead>
            <TableHead>Date Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {complaints.map(complaint => (
            <TableRow key={complaint._id}>
              <TableCell className="font-medium">{complaint.title}</TableCell>
              <TableCell>{complaint.category}</TableCell>
              <TableCell>{complaint.location}</TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      className="space-x-2"
                      onClick={() => {
                        setSelectedComplaint(complaint);
                        setNewStatus(complaint.status);
                        setNewNote(complaint.adminNote || '');
                      }}
                    >
                      <Badge variant={getStatusBadgeVariant(complaint.status)}>
                        {STATUS_OPTIONS.find(opt => opt.value === complaint.status)?.label}
                      </Badge>
                      <PenLine className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Update Complaint Status</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Select value={newStatus} onValueChange={setNewStatus}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Textarea
                        value={newNote}
                        onChange={e => setNewNote(e.target.value)}
                        placeholder="Add admin note..."
                        rows={4}
                      />
                      <Button onClick={handleStatusUpdate} disabled={!newStatus}>
                        Update Status
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </TableCell>
              <TableCell className="max-w-[300px] truncate" title={complaint.adminNote}>
                {complaint.adminNote || 'N/A'}
              </TableCell>
              <TableCell>
              {complaint?.name}
              </TableCell>
              <TableCell>
                {new Date(complaint.createdAt).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PublicNotices;