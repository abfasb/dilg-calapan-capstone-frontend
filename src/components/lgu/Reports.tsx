import { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { sendStatusNotification } from '../../utils/notifications';
import { CheckCircleIcon, ChevronLeft, ChevronRight, Loader2, MoreVertical, Sliders } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Skeleton } from '../ui/skeleton';

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
}

export default function Reports() {
  const [forms, setForms] = useState<ReportForm[]>([]);
  const [selectedForm, setSelectedForm] = useState<ReportForm | null>(null);
  const [responses, setResponses] = useState<FormResponse[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState({
    forms: true,
    responses: false,
  });

  const userId = localStorage.getItem('userId');

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

  const updateStatus = async (responseId: string, status: FormResponse["status"]) => {
    const prevStatus = responses.find(r => r._id === responseId)?.status;
    
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/response/${responseId}`, { status });
      setResponses(prev => prev.map(r => 
        r._id === responseId ? { ...r, status } : r
      ));

      toast.success('Status updated successfully', {
        icon: <CheckCircleIcon className="w-5 h-5 text-green-400" />,
        style: {
          background: '#1a1d24',
          color: '#fff',
          border: '1px solid #2a2f38',
          padding: '12px',
        },
      });

      if (userId) {
        await sendStatusNotification(userId, status);
      }
    } catch (error) {
      setResponses(prev => prev.map(r => 
        r._id === responseId ? { ...r, status: prevStatus! } : r
      ));
      toast.error('Failed to update status');
    }
  };

  const filteredResponses = responses.filter(response => 
    filter === 'all' ? true : response.status === filter
  );

  const statusCounts = responses.reduce((acc, curr) => {
    acc[curr.status] = (acc[curr.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

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
      <div className="space-y-8 p-6 bg-gray-900 min-h-screen">
        {!selectedForm ? (
          <>
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-cyan-400">Report Forms</h1>
              <div className="flex items-center gap-2">
                {loading.forms ? (
                  <Skeleton className="h-10 w-24 bg-gray-800" />
                ) : null}
              </div>
            </div>

            {loading.forms ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-36 bg-gray-800 rounded-xl" />
                ))}
              </div>
            ) : forms.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                No report forms available
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {forms.map(form => (
                  <div 
                    key={form._id}
                    onClick={() => handleFormClick(form._id)}
                    className="group bg-gray-800 p-6 rounded-xl cursor-pointer hover:bg-gray-700/50 transition-all border border-gray-700 hover:border-cyan-400/20"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold text-cyan-400">{form.title}</h3>
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
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setSelectedForm(null)}
                className="flex items-center text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                Back to Forms
              </button>
              <div className="flex items-center gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors">
                    <Sliders className="w-5 h-5" />
                    Filter
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

            <h1 className="text-2xl font-bold text-cyan-400">{selectedForm.title}</h1>

            <div className="bg-gray-800 rounded-xl p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-cyan-400 mb-4">Submissions Overview</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={Object.entries(statusCounts).map(([status, count]) => ({ status, count }))}>
                      <XAxis
                        dataKey="status"
                        stroke="#4b5563"
                        tick={{ fill: '#9ca3af' }}
                      />
                      <YAxis
                        stroke="#4b5563"
                        tick={{ fill: '#9ca3af' }}
                      />
                      <Tooltip
                        contentStyle={{
                          background: '#1f2937',
                          border: '1px solid #374151',
                          borderRadius: '8px',
                        }}
                        itemStyle={{ color: '#e5e7eb' }}
                      />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                        {Object.entries(statusCounts).map(([status], index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              status === 'approved' ? '#22d3ee' :
                              status === 'rejected' ? '#ef4444' :
                              '#eab308'
                            }
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-lg border border-gray-700 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-700/20">
                    <tr>
                      <th className="px-6 py-4 text-left text-gray-300 font-medium">Reference</th>
                      <th className="px-6 py-4 text-left text-gray-300 font-medium">User</th>
                      <th className="px-6 py-4 text-left text-gray-300 font-medium">Status</th>
                      <th className="px-6 py-4 text-left text-gray-300 font-medium">Date</th>
                      <th className="px-6 py-4 text-left text-gray-300 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading.responses ? (
                      [...Array(3)].map((_, i) => (
                        <tr key={i} className="border-b border-gray-700/50">
                          <td className="px-6 py-4"><Skeleton className="h-4 w-32 bg-gray-700" /></td>
                          <td className="px-6 py-4"><Skeleton className="h-4 w-24 bg-gray-700" /></td>
                          <td className="px-6 py-4"><Skeleton className="h-4 w-20 bg-gray-700" /></td>
                          <td className="px-6 py-4"><Skeleton className="h-4 w-24 bg-gray-700" /></td>
                          <td className="px-6 py-4"><Skeleton className="h-4 w-20 bg-gray-700" /></td>
                        </tr>
                      ))
                    ) : filteredResponses.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-8 text-gray-400">
                          No submissions found
                        </td>
                      </tr>
                    ) : (
                      filteredResponses.map(response => (
                        <tr key={response._id} className="border-b border-gray-700/50 hover:bg-gray-700/10 transition-colors">
                          <td className="px-6 py-4 font-mono text-cyan-400">{response.referenceNumber}</td>
                          <td className="px-6 py-4 text-gray-400">{response.userId}</td>
                          <td className="px-6 py-4">
                            <select
                              value={response.status}
                              onChange={(e) => updateStatus(response._id, e.target.value as FormResponse["status"])}
                              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                response.status === 'approved' ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' :
                                response.status === 'rejected' ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' :
                                'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                              }`}
                            >
                              <option value="pending">Pending</option>
                              <option value="approved">Approved</option>
                              <option value="rejected">Rejected</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 text-gray-400">
                            {new Date(response.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </td>
                          <td className="px-6 py-4">
                            <DropdownMenu>
                              <DropdownMenuTrigger className="text-gray-400 hover:text-cyan-400">
                                <MoreVertical className="w-5 h-5" />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white">
                                <DropdownMenuItem className="hover:bg-gray-700/50">
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem className="hover:bg-gray-700/50">
                                  Download PDF
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-400 hover:bg-red-500/20">
                                  Delete
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
          </>
        )}
      </div>
    </>
  );
}