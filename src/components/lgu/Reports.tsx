// Reports.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { sendStatusNotification } from '../../utils/notifications';
import { CheckCircleIcon } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

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

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchForms = async () => {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/form`);
      setForms(data);
    };
    fetchForms();
  }, []);

  const handleFormClick = async (formId: string) => {
    const form = forms.find(f => f._id === formId);
    if (!form) return;
    
    const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/response/${formId}`);
    setSelectedForm(form);
    setResponses(data);
  };

  const updateStatus = async (responseId: string, status: FormResponse["status"]) => {
    await axios.put(`${import.meta.env.VITE_API_URL}/api/response/${responseId}`, { status });
    setResponses(prev => prev.map(r => 
      r._id === responseId ? { ...r, status } : r
    ));

    toast.success('Updated Successfully!', {
      icon: <CheckCircleIcon className="w-6 h-6 text-green-400" />,
      style: {
        background: '#1a1d24',
        color: '#fff',
        border: '1px solid #2a2f38',
        padding: '16px',
      },
      duration: 4000,
    });

    if (userId) {
      await sendStatusNotification(userId, status);
    }
  };

  return (<>
          <Toaster
          position="top-right"
          gutter={32}
          containerClassName="!top-4 !right-6"
          toastOptions={{
            className: '!bg-[#1a1d24] !text-white !rounded-xl !border !border-[#2a2f38]',
          }}
        />
         <div className="space-y-8 p-6">
      
      {!selectedForm ? (
        <>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-cyan-400">All Report Forms</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {forms.map(form => (
              <div 
                key={form._id}
                onClick={() => handleFormClick(form._id)}
                className="bg-gray-800 p-6 rounded-xl cursor-pointer hover:bg-gray-700/50 transition-colors"
              >
                <h3 className="text-xl font-semibold text-cyan-400">{form.title}</h3>
                <p className="text-gray-400 mt-2">{form.description}</p>
                <div className="mt-4 text-sm text-gray-500">
                  {form.fields.length} fields
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setSelectedForm(null)}
              className="text-cyan-400 hover:text-cyan-300"
            >
              ← Back to All Forms
            </button>
            <h1 className="text-2xl font-bold text-cyan-400">{selectedForm.title}</h1>
          </div>

          <div className="bg-gray-800 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-700/50">
                <tr>
                  <th className="px-6 py-4 text-left text-gray-300">User ID</th>
                  <th className="px-6 py-4 text-left text-gray-300">Reference #</th>
                  <th className="px-6 py-4 text-left text-gray-300">Status</th>
                  <th className="px-6 py-4 text-left text-gray-300">Date Submitted</th>
                  <th className="px-6 py-4 text-left text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {responses.map(response => (
                  <tr key={response._id} className="border-b border-gray-700/50 hover:bg-gray-700/20">
                    <td className="px-6 py-4 text-gray-400">{response.userId}</td>
                    <td className="px-6 py-4 text-cyan-400">{response.referenceNumber}</td>
                    <td className="px-6 py-4">
                      <select
                        value={response.status}
                        onChange={(e) => updateStatus(response._id, e.target.value as FormResponse["status"])}
                        className={`px-3 py-1 rounded-full text-sm ${
                          response.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                          response.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {new Date(response.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-cyan-400 hover:text-cyan-300">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  </>
   
  );
}