import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { sendStatusNotification } from '../../utils/notifications';
import { 
  CheckCircleIcon, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  ImageIcon, 
  Loader2, 
  MoreVertical, 
  Sliders, 
  FileText, 
  Clock, 
  XCircle, 
  PenLine,
  RefreshCw
} from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Skeleton } from '../ui/skeleton';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';

interface ReportForm {
  _id: string;
  title: string;
  description: string;
  fields: Array<{
    id: string;
    type: string;
    label: string;
    required: boolean;
  }>;
}

interface FormResponse {
  _id: string;
  referenceNumber: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  userId: string;
  data: Record<string, any>;
  files: Array<{ url: string; filename: string }>;
  bulkFile?: {
    fileName: string;
    fileUrl: string;
    fileType: string;
  };
  formId: {
    fields: Array<{
      id: string;
      label: string;
      type: string;
    }>;
  };
  comments?: string;
  signature?: {
    fileName: string;
    fileUrl: string;
    mimetype: string;
    signedAt: Date;
  };
  history: Array<{
    status: string;
    updatedBy: string;
    document: string;
    timestamp: string;
    comments?: string;
  }>;
  isUserUpdatedRejected: boolean;
}

export default function Reports() {
  const [forms, setForms] = useState<ReportForm[]>([]);
  const [selectedForm, setSelectedForm] = useState<ReportForm | null>(null);
  const [responses, setResponses] = useState<FormResponse[]>([]);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [selectedResponse, setSelectedResponse] = useState<FormResponse | null>(null);
  const [filter, setFilter] = useState('all');
  const [combinedHistory, setCombinedHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [showRejectionDialog, setShowRejectionDialog] = useState(false);
  const [rejectionComment, setRejectionComment] = useState('');
  const [currentResponseId, setCurrentResponseId] = useState<string | null>(null);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [autoReload, setAutoReload] = useState(true);
  const [lastFetchTime, setLastFetchTime] = useState(Date.now());
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState<{ x: number; y: number } | null>(null);
  const [pendingStatus, setPendingStatus] = useState<FormResponse["status"] | null>(null);

  const [loading, setLoading] = useState({
    forms: true,
    responses: false,
    details: false,
  });

  // Mobile responsive state
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/form`);
        setForms(data);
      } catch (error) {
        toast.error('Failed to load forms');
      } finally {
        setLoading(prev => ({ ...prev, forms: false }));
      }
    };
    fetchForms();
  }, []);

  const fetchCombinedHistory = async () => {
    setHistoryLoading(true);
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/response/history/combined`);

      const formattedHistory = data.flatMap((entry: any) =>
        entry.__parentArray ? entry.__parentArray.map((historyItem: any, index: any, arr: any) => ({
          documentName: entry.referenceNumber,
          document: historyItem.document,
          previousStatus: index > 0 ? arr[index - 1].status : "pending",
          newStatus: historyItem.status,
          updatedBy: historyItem.updatedBy,
          timestamp: historyItem.timestamp,
          type: entry.type,
          comments: historyItem.comments,
        })) : []
      );
      
      setCombinedHistory([...formattedHistory]);
    } catch (error) {
      toast.error('Failed to load history');
    } finally {
      setHistoryLoading(false);
    }
  };
  
  useEffect(() => {
    fetchCombinedHistory();
  }, [selectedForm]);

  const handleFormClick = async (formId: string) => {
    setLoading(prev => ({ ...prev, responses: true }));
    try {
      const form = forms.find(f => f._id === formId);
      if (!form) return;
      
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/response/${formId}`);
      setSelectedForm(form);
      setResponses(data);
    } catch (error) {
      toast.error('Failed to load responses');
    } finally {
      setLoading(prev => ({ ...prev, responses: false }));
    }
  };

  const viewDetails = async (responseId: string) => {
    setLoading(prev => ({ ...prev, details: true }));
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/response/details/${responseId}`);
      setSelectedResponse(data);
    } catch (error) {
      toast.error('Failed to load response details');
    } finally {
      setLoading(prev => ({ ...prev, details: false }));
    }
  };

  const downloadFile = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRejectionSubmit = async () => {
    if (!rejectionComment.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }
    
    if (currentResponseId && pendingStatus) {
      await updateStatus(currentResponseId, pendingStatus, rejectionComment);
      setShowRejectionDialog(false);
      setRejectionComment('');
      setCurrentResponseId(null);
      setPendingStatus(null);
    }
  };

  const updateStatus = async (responseId: string, status: FormResponse["status"], comments?: string) => {
    const prevStatus = responses.find(r => r._id === responseId)?.status;
    const lguNamee = localStorage.getItem('name');
    const userId = localStorage.getItem('userId')

    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/response/${responseId}`, { 
        status,
        comments,
        updatedBy: lguNamee || 'LGU Representative',
        lgu: { 
          id: userId,
          name: lguNamee || 'LGU Representative'
        }
      });
      
      setResponses(prev => prev.map(r => 
        r._id === responseId ? { 
          ...r, 
          status,
          history: [
            ...r.history,
            {
              status,
              comments: status === 'rejected' ? comments : undefined,
              updatedBy: lguNamee || 'LGU Representative',
              lguId: userId,
              lguName: lguNamee || 'LGU Representative',
              document: r.bulkFile?.fileName || r.referenceNumber,
              timestamp: new Date().toISOString()
            }
          ]
        } : r
      ));

      toast.success(`Status updated${status === 'rejected' ? ' with comments' : ''}`, {
        icon: <CheckCircleIcon className="w-5 h-5 text-green-400" />,
        style: {
          background: '#1a1d24',
          color: '#fff',
          border: '1px solid #2a2f38',
          padding: '12px',
        },
      });

    } catch (error) {
      setResponses(prev => prev.map(r => 
        r._id === responseId ? { ...r, status: prevStatus! } : r
      ));
      toast.error('Failed to update status');
    }
  };

  useEffect(() => {
    if (!selectedForm || !autoReload) return;

    const interval = setInterval(async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/response/${selectedForm._id}`);
        setResponses(data);
        setLastFetchTime(Date.now());
      } catch (error) {
        console.error('Auto-reload failed:', error);
      }
    }, 10000); 

    return () => clearInterval(interval);
  }, [selectedForm, autoReload]);

  useEffect(() => {
    if (!autoReload) return;

    const interval = setInterval(() => {
      fetchCombinedHistory();
    }, 15000); 

    return () => clearInterval(interval);
  }, [autoReload]);

  const renderResponseValue = (fieldId: string, value: any) => {
    const field = selectedResponse?.formId.fields.find(f => f.id === fieldId);
    
    if (field?.type === 'image') {
      return (
        <div className="grid grid-cols-2 gap-4">
          {value?.map((url: string, index: number) => (
            <div key={index} className="relative group">
              <img
                src={url}
                alt={`Upload ${index + 1}`}
                className="rounded-lg w-full h-32 object-cover border border-gray-700"
              />
              <button
                onClick={() => window.open(url, '_blank')}
                className="absolute bottom-2 right-2 bg-gray-800/80 px-2 py-1 rounded-md text-sm hover:bg-gray-700/80"
              >
                View Full
              </button>
            </div>
          ))}
        </div>
      );
    }
    
    if (Array.isArray(value)) return value.join(', ');
    return value || 'N/A';
  };

  const filteredResponses = responses.filter(response => 
    filter === 'all' ? true : response.status === filter
  );

  const statusCounts = responses.reduce((acc, curr) => {
    acc[curr.status] = (acc[curr.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let clientX, clientY;
    
    if ('touches' in e) {
      // Touch event
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      // Mouse event
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    setIsDrawing(true);
    setLastPoint({ x, y });
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !canvasRef.current) return;

    let clientX, clientY;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    if (ctx && lastPoint) {
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#000';
      ctx.moveTo(lastPoint.x, lastPoint.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
    setLastPoint({ x, y });
  };

  const endDrawing = () => {
    setIsDrawing(false);
    setLastPoint(null);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  const handleStatusChangeInit = (responseId: string, newStatus: FormResponse["status"]) => {
    if (newStatus === 'rejected') {
      setCurrentResponseId(responseId);
      setPendingStatus(newStatus);
      setShowRejectionDialog(true);
    } else if (newStatus === 'approved') {
      setCurrentResponseId(responseId);
      setPendingStatus(newStatus);
      setShowSignatureModal(true);
    } else {
      updateStatus(responseId, newStatus);
    }
  };

  const handleSaveSignature = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob(async (blob) => {
      if (!blob) {
        toast.error('Error creating signature');
        return;
      }

      const signatureFile = new File([blob], 'signature.png', { type: 'image/png' });
      const formData = new FormData();
      const lguName = localStorage.getItem('name') || 'LGU Representative';
      const userId = localStorage.getItem('userId');

      formData.append('status', 'approved');
      formData.append('updatedBy', lguName);
      formData.append('signature', signatureFile);
      formData.append('lgu[name]', lguName);
      formData.append('lgu[id]', userId || '');

      if (currentResponseId) {
        try {
          const { data } = await axios.put(
            `${import.meta.env.VITE_API_URL}/api/response/${currentResponseId}`,
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
          );

          setResponses(prev => prev.map(r => 
            r._id === currentResponseId ? data : r
          ));

          toast.success('Approved with signature successfully!');
          setShowSignatureModal(false);
          clearCanvas();
        } catch (error) {
          toast.error('Failed to submit approval with signature');
        }
      }
    }, 'image/png');
  };

  return (
    <>
      <Dialog open={showSignatureModal} onOpenChange={setShowSignatureModal}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md w-[90vw]">
          <DialogHeader>
            <DialogTitle className="text-cyan-400">Create E-Signature</DialogTitle>
            <DialogDescription className="text-gray-400">
              Draw your signature below
            </DialogDescription>
          </DialogHeader>

          <div className="relative">
            <canvas
              ref={canvasRef}
              width={isMobile ? 300 : 400}
              height={isMobile ? 150 : 200}
              className="bg-white rounded-md border border-gray-600 touch-none"
              onMouseDown={startDrawing}
              onMouseUp={endDrawing}
              onMouseMove={draw}
              onTouchStart={startDrawing}
              onTouchEnd={endDrawing}
              onTouchMove={draw}
            />
            <button
              onClick={clearCanvas}
              className="absolute top-2 right-2 text-red-500 bg-gray-800 p-1 rounded-full"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>

          <DialogFooter className="flex flex-col gap-2 sm:flex-row">
            <Button 
              onClick={() => setShowSignatureModal(false)}
              className="bg-gray-700 hover:bg-gray-600 w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveSignature}
              className="bg-cyan-600 hover:bg-cyan-700 w-full sm:w-auto"
            >
              Save Signature
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={showRejectionDialog} onOpenChange={setShowRejectionDialog}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md w-[90vw]">
          <DialogHeader>
            <DialogTitle className="text-red-400 flex items-center gap-2">
              <XCircle className="w-6 h-6" />
              Rejection Reason
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Please provide detailed reasons why this submission is being rejected
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Textarea
              value={rejectionComment}
              onChange={(e) => setRejectionComment(e.target.value)}
              className="bg-gray-900 border-gray-700 text-white placeholder-gray-500 h-32"
              placeholder="Explain what needs to be corrected or improved..."
            />
            
            <div className="text-sm text-gray-400">
              This comment will be:
              <ul className="list-disc pl-4 mt-2">
                <li>Visible in the submission history</li>
                <li>Sent to the applicant</li>
                <li>Stored as part of the audit trail</li>
              </ul>
            </div>
          </div>

          <DialogFooter className="flex flex-col gap-2 sm:flex-row">
            <Button 
              onClick={() => setShowRejectionDialog(false)}
              className="bg-gray-700 hover:bg-gray-600 w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleRejectionSubmit}
              className="bg-red-500/20 hover:bg-red-500/30 text-red-400 w-full sm:w-auto"
            >
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster
        position={isMobile ? "top-center" : "top-right"}
        gutter={32}
        containerClassName={isMobile ? "!top-4" : "!top-4 !right-6"}
        toastOptions={{
          className: '!bg-[#1a1d24] !text-white !rounded-xl !border !border-[#2a2f38]',
        }}
      />

      <div className="space-y-8 p-4 sm:p-6 bg-gray-900 min-h-screen">
        {!selectedForm ? (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h1 className="text-2xl font-bold text-cyan-400">Report Forms</h1>
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <button 
                  onClick={() => setAutoReload(!autoReload)}
                  className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg transition-colors ${
                    autoReload 
                      ? 'text-green-400 bg-green-500/20 hover:bg-green-500/30' 
                      : 'text-gray-400 bg-gray-700/50 hover:bg-gray-700/70'
                  }`}
                >
                  <RefreshCw className={`w-4 h-4 ${autoReload ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Auto-reload {autoReload ? 'ON' : 'OFF'}</span>
                </button>
                <button 
                  onClick={() => setShowActivityModal(true)}
                  className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm px-3 py-2 rounded-lg bg-gray-700/50 hover:bg-gray-700/70 transition-colors"
                > 
                  <Clock className="w-5 h-5" />
                  <span className="hidden sm:inline">View Activity</span>
                </button>
              </div>
            </div>

            <Dialog open={showActivityModal} onOpenChange={setShowActivityModal}>
              <DialogContent className="bg-gray-800 border-gray-700 text-white w-[90vw] max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-400 scrollbar-track-gray-800">
                <DialogHeader>
                  <DialogTitle className="text-cyan-400">Recent Activity Timeline</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    View the latest changes and updates.
                  </DialogDescription>
                </DialogHeader>

                {historyLoading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex gap-4">
                        <Skeleton className="h-6 w-6 rounded-full bg-gray-700" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-[200px] bg-gray-700" />
                          <Skeleton className="h-3 w-[160px] bg-gray-700" />
                          <Skeleton className="h-3 w-[140px] bg-gray-700" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="relative mt-4">
                    <div className="absolute left-7 top-0 h-full w-0.5 bg-gray-700/50" aria-hidden="true" />

                    <div className="space-y-8">
                      {(combinedHistory?.length > 0 ? combinedHistory : []).map((entry, index) => (
                        <div key={index} className="relative flex gap-6">
                          <div className="relative">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-900 border-2 border-cyan-400/50">
                              {entry.type === 'global' ? (
                                <FileText className="h-6 w-6 text-cyan-400" />
                              ) : (
                                <Sliders className="h-6 w-6 text-purple-400" />
                              )}
                            </div>
                            <div className="absolute left-1/2 -translate-x-1/2 -bottom-8 text-xs text-gray-400">
                              {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>

                          <div className="flex-1 pt-1.5">
                            <div className="p-4 rounded-lg bg-gray-700/30 hover:bg-gray-700/50 transition-colors">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
                                <span className={`text-sm font-medium truncate ${
                                  entry.newStatus === 'approved' ? 'text-green-400' :
                                  entry.newStatus === 'rejected' ? 'text-red-400' : 'text-cyan-400'
                                }`}>
                                  {entry.documentName || entry.document}
                                </span>
                                <span className="text-gray-400 text-xs hidden sm:block">•</span>
                                <span className="text-xs text-purple-400">
                                  {entry.type === 'global' ? 'Status Update' : 'Document Modified'}
                                </span>
                              </div>

                              {entry.previousStatus && (
                                <div className="flex items-center gap-2 text-sm">
                                  <span className="text-yellow-400">{entry.previousStatus}</span>
                                  <ChevronRight className="w-4 h-4 text-gray-400" />
                                  <span className={
                                    entry.newStatus === 'approved' ? 'text-green-400' :
                                    entry.newStatus === 'rejected' ? 'text-red-400' : 'text-yellow-400'
                                  }>
                                    {entry.newStatus}
                                  </span>
                                </div>
                              )}

                              {entry.comments && (
                                <div className="mt-3 p-3 bg-gray-800/50 rounded-md border-l-4 border-red-400">
                                  <div className="text-sm font-medium text-red-400 mb-1">Rejection Reason:</div>
                                  <div className="text-sm text-gray-300 whitespace-pre-wrap">{entry.comments}</div>
                                </div>
                              )}

                              <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs text-gray-400">
                                <span>Updated by:</span>
                                <span className="text-cyan-400">{entry.updatedBy}</span>
                                <span className="hidden sm:block">•</span>
                                <span>
                                  {new Date(entry.timestamp).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>

            {loading.forms ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-36 bg-gray-800 rounded-xl" />
                ))}
              </div>
            ) : forms.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                No report forms available
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {forms.map(form => (
                  <div 
                    key={form._id}
                    onClick={() => handleFormClick(form._id)}
                    className="group bg-gray-800 p-4 sm:p-6 rounded-xl cursor-pointer hover:bg-gray-700/50 transition-all border border-gray-700 hover:border-cyan-400/20"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg sm:text-xl font-semibold text-cyan-400">{form.title}</h3>
                        <p className="text-gray-400 mt-2 text-sm line-clamp-2">{form.description}</p>
                      </div>
                      <div className="px-2 py-1 text-xs font-medium text-cyan-400 bg-cyan-400/10 rounded-full">
                        {form.fields.length} fields
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-sm text-gray-500 group-hover:text-cyan-400 transition-colors">
                      <span>View submissions</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <button 
                onClick={() => setSelectedForm(null)}
                className="flex items-center text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                Back to Forms
              </button>
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors w-full sm:w-auto">
                    <Sliders className="w-5 h-5" />
                    <span className="hidden sm:inline">Filter</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white">
                    <DropdownMenuItem 
                      className="hover:bg-gray-700/50"
                      onClick={() => setFilter('all')}
                    >
                      All ({responses.length})
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="hover:bg-gray-700/50"
                      onClick={() => setFilter('pending')}
                    >
                      Pending ({statusCounts.pending || 0})
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="hover:bg-gray-700/50"
                      onClick={() => setFilter('approved')}
                    >
                      Approved ({statusCounts.approved || 0})
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="hover:bg-gray-700/50"
                      onClick={() => setFilter('rejected')}
                    >
                      Rejected ({statusCounts.rejected || 0})
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-cyan-400">{selectedForm.title}</h1>

            <div className="bg-gray-800 rounded-xl p-4 sm:p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-cyan-400 mb-4">Submissions Overview</h3>
                <div className="h-56 sm:h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={Object.entries(statusCounts).map(([status, count]) => ({
                        status,
                        count
                      }))}
                    >
                      <XAxis
                        dataKey="status"
                        stroke="#4b5563"
                        tick={{ fill: '#9ca3af', fontSize: isMobile ? 10 : 12 }}
                      />
                      <YAxis
                        stroke="#4b5563"
                        tick={{ fill: '#9ca3af', fontSize: isMobile ? 10 : 12 }}
                      />
                      <Tooltip
                        contentStyle={{
                          background: '#1f2937',
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          fontSize: isMobile ? 12 : 14
                        }}
                        itemStyle={{ color: '#e5e7eb' }}
                      />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                        {Object.entries(statusCounts).map(([status], index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              status === 'approved'
                                ? '#22d3ee'
                                : status === 'rejected'
                                ? '#ef4444'
                                : '#eab308'
                            }
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>

                </div>
              </div>

              <div className="rounded-lg border border-gray-700 overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead className="bg-gray-700/20">
                    <tr>
                      <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-gray-300 font-medium text-xs sm:text-sm">Reference</th>
                      <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-gray-300 font-medium text-xs sm:text-sm">Type</th>
                      <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-gray-300 font-medium text-xs sm:text-sm">Status</th>
                      <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-gray-300 font-medium text-xs sm:text-sm">Date</th>
                      <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-gray-300 font-medium text-xs sm:text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading.responses ? (
                      [...Array(3)].map((_, i) => (
                        <tr key={i} className="border-b border-gray-700/50">
                          <td className="px-4 py-3 sm:px-6 sm:py-4"><Skeleton className="h-4 w-32 bg-gray-700" /></td>
                          <td className="px-4 py-3 sm:px-6 sm:py-4"><Skeleton className="h-4 w-24 bg-gray-700" /></td>
                          <td className="px-4 py-3 sm:px-6 sm:py-4"><Skeleton className="h-4 w-20 bg-gray-700" /></td>
                          <td className="px-4 py-3 sm:px-6 sm:py-4"><Skeleton className="h-4 w-24 bg-gray-700" /></td>
                          <td className="px-4 py-3 sm:px-6 sm:py-4"><Skeleton className="h-4 w-20 bg-gray-700" /></td>
                        </tr>
                      ))
                    ) : filteredResponses.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-8 text-gray-400 text-sm sm:text-base">
                          No submissions found
                        </td>
                      </tr>
                    ) : (
                      filteredResponses.map(response => (
                        <tr key={response._id} className="border-b border-gray-700/50 hover:bg-gray-700/10 transition-colors">
                          <td className="px-4 py-3 sm:px-6 sm:py-4 font-mono text-cyan-400 text-xs sm:text-sm">
                            <div className="flex items-center gap-1">
                              <span className="truncate max-w-[100px] sm:max-w-none">{response.referenceNumber}</span>
                              {response.isUserUpdatedRejected && (
                                <span className="bg-amber-500/20 text-amber-400 text-xs px-1.5 py-0.5 rounded-full inline-flex items-center">
                                  <RefreshCw className="w-3 h-3 mr-1" />
                                  <span className="hidden sm:inline">Updated</span>
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 sm:px-6 sm:py-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              response.bulkFile 
                                ? 'bg-purple-500/20 text-purple-400' 
                                : 'bg-cyan-500/20 text-cyan-400'
                            }`}>
                              {response.bulkFile ? 'File' : 'Form'}
                            </span>
                          </td>
                          <td className="px-4 py-3 sm:px-6 sm:py-4">
                            <select
                              value={response.status}
                              onChange={(e) => handleStatusChangeInit(response._id, e.target.value as FormResponse["status"])}
                              className={`px-2 py-1 sm:px-3 sm:py-1 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                                response.status === 'approved' ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' :
                                response.status === 'rejected' ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' :
                                'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                              }`}
                            >
                              <option value="pending" className='text-black'>Pending</option>
                              <option value="approved" className='text-black'>Approved</option>
                              <option value="rejected" className='text-black'>Rejected</option>
                            </select>
                          </td>
                          <td className="px-4 py-3 sm:px-6 sm:py-4 text-gray-400 text-xs sm:text-sm">
                            {new Date(response.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </td>
                          <td className="px-4 py-3 sm:px-6 sm:py-4">
                            <DropdownMenu>
                              <DropdownMenuTrigger className="text-gray-400 hover:text-cyan-400">
                                <MoreVertical className="w-5 h-5" />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white">
                                <DropdownMenuItem 
                                  className="hover:bg-gray-700/50"
                                  onClick={() => viewDetails(response._id)}
                                >
                                  View Details
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <Dialog open={!!selectedResponse} onOpenChange={() => setSelectedResponse(null)}>
              <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl w-[95vw] max-h-[90vh] overflow-y-auto">
                {loading.details ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
                  </div>
                ) : selectedResponse && (
                  <>
                    <DialogHeader>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <DialogTitle className="text-cyan-400 text-lg sm:text-xl">
                          {selectedResponse.referenceNumber}
                        </DialogTitle>
                        {selectedResponse.isUserUpdatedRejected && (
                          <div className="flex items-center gap-2 bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full text-sm">
                            <RefreshCw className="w-4 h-4" />
                            <span className="font-medium">Updated Submission</span>
                          </div>
                        )}
                      </div>
                    </DialogHeader>

                    {selectedResponse.bulkFile ? (
                      <div className="space-y-4 overflow-hidden">
                        <div className="bg-gray-700/30 p-4 rounded-lg">
                          <h3 className="text-lg font-semibold mb-2">Uploaded Document</h3>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-gray-900/50 p-3 rounded-md gap-3">
                            <div className="flex items-center gap-3">
                              <FileText className="w-6 h-6 text-cyan-400" />
                              <div>
                                <p className="font-medium truncate max-w-[200px] sm:max-w-none">{selectedResponse.bulkFile.fileName}</p>
                                <p className="text-sm text-gray-400">
                                  {selectedResponse.bulkFile.fileType}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => window.open(selectedResponse.bulkFile?.fileUrl, '_blank')}
                                className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 px-3 py-1 rounded-md bg-gray-800/50 text-sm"
                              >
                                <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span>Preview</span>
                              </button>
                              <button
                                onClick={() => downloadFile(
                                  selectedResponse.bulkFile?.fileUrl || '',
                                  selectedResponse.bulkFile?.fileName || 'document'
                                )}
                                className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 px-3 py-1 rounded-md bg-gray-800/50 text-sm"
                              >
                                <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span>Download</span>
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gray-700/30 p-4 rounded-lg">
                          <h3 className="text-lg font-semibold mb-2">Document Preview</h3>
                          <iframe 
                            src={selectedResponse.bulkFile.fileUrl}
                            className="w-full h-[50vh] rounded-lg border border-gray-700"
                            title="Document preview"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {selectedResponse.formId.fields.map(field => (
                          <div key={field.id} className="bg-gray-700/30 p-4 rounded-lg">
                            <h3 className="font-medium mb-2 text-cyan-400">{field.label}</h3>
                            <div className="text-gray-300">
                              {renderResponseValue(field.id, selectedResponse.data?.[field.id])}
                            </div>
                          </div>
                        ))}

                        {selectedResponse.files?.length > 0 && (
                          <div className="bg-gray-700/30 p-4 rounded-lg">
                            <h3 className="font-medium mb-2 text-cyan-400">Attachments</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {selectedResponse.files.map((file, index) => (
                                <div key={index} className="relative group">
                                  <img
                                    src={file.url}
                                    alt={`Attachment ${index + 1}`}
                                    className="rounded-lg w-full h-32 object-cover border border-gray-700"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent p-2 flex items-end">
                                    <button
                                      onClick={() => window.open(file.url, '_blank')}
                                      className="text-sm bg-gray-800/80 px-2 py-1 rounded-md hover:bg-gray-700/80 truncate max-w-full"
                                    >
                                      {file.filename}
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                      {selectedResponse?.signature && (
                        <div className="mt-6 pt-4 border-t border-gray-700/50">
                          <h3 className="text-lg font-semibold text-cyan-400 mb-4">Approval Signature</h3>
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <img
                              src={selectedResponse.signature.fileUrl}
                              alt="Approval Signature"
                              className="w-full sm:w-48 h-auto border-2 border-cyan-400/30 rounded-lg"
                            />
                            <div className="text-sm text-gray-400">
                              <p>Signed by: {selectedResponse.history
                                .find(h => h.status === 'approved')?.updatedBy}</p>
                              <p>Date: {new Date(selectedResponse.signature.signedAt)
                                .toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>
                      )}
                      </div>
                    )}

                    <div className="mt-6 pt-4 border-t border-gray-700/50">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div>
                          <label className="text-gray-400">Submission Date</label>
                          <p className="text-gray-300">
                            {new Date(selectedResponse.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <label className="text-gray-400">Submission Type</label>
                          <p className="text-gray-300 capitalize">
                            {selectedResponse.bulkFile ? 'File' : 'Form'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 space-y-4">
                      <h3 className="text-lg font-semibold text-cyan-400">Processing History</h3>
                      {selectedResponse.history.map((historyItem, index) => (
                        <div key={index} className="bg-gray-700/30 p-4 rounded-lg">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-1">
                            <div className="flex items-center flex-wrap gap-1">
                              <span className={`text-sm font-medium ${
                                historyItem.status === 'approved' ? 'text-green-400' :
                                historyItem.status === 'rejected' ? 'text-red-400' : 'text-yellow-400'
                              }`}>
                                {historyItem.status.toUpperCase()}
                              </span>
                              <span className="text-gray-400 mx-1 hidden sm:inline">•</span>
                              <span className="text-xs text-gray-400">
                                {new Date(historyItem.timestamp).toLocaleDateString()}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500">
                              By {historyItem.updatedBy}
                            </span>
                          </div>
                          
                          {historyItem.comments && (
                            <div className="mt-2 p-3 bg-gray-800/50 rounded-md">
                              <div className="text-sm text-red-400 font-medium">Reviewer Comments:</div>
                              <div className="text-sm text-gray-300 mt-1 whitespace-pre-wrap">
                                {historyItem.comments}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
    </>
  );
}