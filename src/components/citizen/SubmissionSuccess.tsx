import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { 
  CheckCircle, 
  Printer, 
  Download, 
  FileText, 
  QrCode, 
  Loader2, 
  AlertCircle,
  Shield,
  Calendar,
  User,
  MapPin,
  Phone,
  FileCheck,
  Clock,
  Check,
  Share2
} from "lucide-react";
import { Button } from "../ui/button";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { QRCodeCanvas } from "qrcode.react";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";

interface SubmissionState {
  referenceNumber: string;
  submissionData: Record<string, any>;
  userData: {
    firstName: string;
    lastName: string;
    position: string;
    barangay: string;
    phoneNumber: string;
  };
  formFields?: Array<{
    id: string;
    label: string;
    type: string;
  }>;
  createdAt: string; // Added
}

interface SubmissionResponse {
  referenceNumber: string;
  createdAt: string;
  submissionData: Record<string, any>;
  userData: SubmissionState['userData'];
  formFields: SubmissionState['formFields'];
}

export default function SubmissionSuccess(): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const { referenceNumber } = useParams();
  const { state } = location as { state: SubmissionState };

  const [submission, setSubmission] = useState<SubmissionResponse | null>(null);
  const [loading, setLoading] = useState(!state);
  const [error, setError] = useState<string | null>(null);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/submissions/${referenceNumber}`
        );
        if (!res.ok) throw new Error('Failed to fetch submission');
        const data = await res.json();
        setSubmission(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch submission');
      } finally {
        setLoading(false);
      }
    };

    if (state) {
      setSubmission({
        referenceNumber: state.referenceNumber,
        createdAt: state.createdAt, // Use passed createdAt
        submissionData: state.submissionData,
        userData: state.userData,
        formFields: state.formFields
      });
      setLoading(false);
    } else if (referenceNumber) {
      fetchSubmission();
    }
  }, [referenceNumber, state]);

  const currentDate = submission?.createdAt 
    ? new Date(submission.createdAt).toLocaleDateString('en-PH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : 'N/A';

  const handleDownloadPDF = async () => {
    if (!submission) return;
    
    setDownloadingPdf(true);
    const receipt = document.getElementById('official-receipt');
    if (!receipt) {
      setDownloadingPdf(false);
      return;
    }

    try {
      const canvas = await html2canvas(receipt, { 
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        ignoreElements: (element) => element.classList.contains('print-hidden')
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      pdf.save(`DILG-Submission-${submission?.referenceNumber}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setDownloadingPdf(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-blue-900">
        <div className="flex flex-col items-center gap-4 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900/30 rounded-full animate-ping"></div>
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 dark:text-blue-400 relative" />
          </div>
          <p className="text-lg font-medium text-blue-900 dark:text-blue-200">Loading Submission Details</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Please wait while we retrieve your information...</p>
        </div>
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-red-50 to-red-100 dark:from-gray-900 dark:to-red-900/30">
        <Alert variant="destructive" className="max-w-md shadow-xl">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle className="text-lg">Error Loading Submission</AlertTitle>
          <AlertDescription className="mb-4 mt-2 text-sm">{error || 'Unable to retrieve submission data'}</AlertDescription>
          <div className="flex gap-2 mt-4">
            <Button variant="outline" onClick={() => navigate('/')} className="w-full">
              <FileText className="h-4 w-4 mr-2" />
              Return Home
            </Button>
            <Button onClick={() => window.location.reload()} className="w-full bg-red-600 hover:bg-red-700">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Retry
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-blue-950 p-6 print:bg-white print:from-white print:to-white">
      <div className="max-w-4xl mx-auto space-y-8 print:max-w-none">
        <div className="text-center space-y-4 print:hidden">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-green-100 dark:bg-green-900/30 rounded-full animate-ping"></div>
            <CheckCircle className="h-20 w-20 text-green-600 dark:text-green-400 mx-auto relative" />
          </div>
          <h1 className="text-4xl font-bold text-blue-900 dark:text-blue-100 tracking-tight">
            Submission Successful!
          </h1>
          <div className="bg-gradient-to-r from-blue-500 to-blue-700 h-1 w-32 mx-auto rounded-full"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
            Your document has been officially received by the Department of the Interior and Local Government.
          </p>
        </div>

        <div id="official-receipt" className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border-[6px] border-blue-900/90 dark:border-blue-700 relative 
          print:shadow-none print:border-4 print:rounded-none print:p-6 overflow-hidden">
          
          <div className="absolute inset-0 z-0 opacity-5 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBzdHJva2U9IiMwMDY2Y2MiIHN0cm9rZS13aWR0aD0iMiI+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiLz48Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjUwIi8+PHBhdGggZD0iTTAgMCBMIDIwMCAyMDBNMjAwIDAgTCAwIDIwMCIvPjwvZz48L3N2Zz4=')]" />
          
          <div className="absolute top-1/4 left-0 right-0 opacity-[0.03] text-[120px] font-bold text-blue-900 rotate-12 -z-10 text-center select-none">
            DILG
          </div>
          
          <div className="absolute bottom-1/4 left-0 right-0 opacity-[0.03] text-[80px] font-bold text-red-700 -rotate-12 -z-10 text-center select-none">
            OFFICIAL
          </div>

          <div className="absolute top-0 left-0 w-32 h-32 border-t-8 border-l-8 border-blue-800 dark:border-blue-600 rounded-tl-lg -mt-1 -ml-1"></div>
          <div className="absolute top-0 right-0 w-32 h-32 border-t-8 border-r-8 border-blue-800 dark:border-blue-600 rounded-tr-lg -mt-1 -mr-1"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 border-b-8 border-l-8 border-blue-800 dark:border-blue-600 rounded-bl-lg -mb-1 -ml-1"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 border-b-8 border-r-8 border-blue-800 dark:border-blue-600 rounded-br-lg -mb-1 -mr-1"></div>

          <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b-4 border-blue-900 dark:border-blue-700 pb-6 relative">
            
            <div className="mb-4 md:mb-0 flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-100 dark:bg-blue-800 rounded-full"></div>
                <img 
                  src="https://i.ibb.co/QFh5dS8r/images-1.png" 
                  alt="DILG Logo" 
                  className="h-28 w-28 print:h-20 print:w-20 relative"
                />
              </div>
            </div>
            
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-200 print:text-xl">
                REPUBLIC OF THE PHILIPPINES
              </h2>
              <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-300 print:text-lg bg-blue-50 dark:bg-blue-900/30 px-4 py-1 rounded-lg inline-block">
                DEPARTMENT OF THE INTERIOR AND LOCAL GOVERNMENT
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 print:text-xs">
                1st Floor, Local Government Center<br />
                New City Hall Complex, M. Roxas Drive<br />
                Barangay, Calapan, 5200 Oriental Mindoro
              </p>
            </div>
          </div>

          <div className="relative mb-10">
            <div className="absolute -top-4 left-0 right-0 h-2 bg-gradient-to-r from-blue-900 via-blue-700 to-blue-900"></div>
          </div>

          <div className="mb-8 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-6 rounded-xl shadow-inner border border-blue-200 dark:border-blue-700 print:p-3">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-700 dark:text-blue-400" />
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-300 uppercase tracking-wider print:text-xs">OFFICIAL RECEIPT NUMBER</p>
                </div>
                <p className="text-3xl font-bold text-blue-900 dark:text-blue-100 print:text-2xl mt-1 tracking-wide">
                  {submission.referenceNumber}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Calendar className="h-4 w-4 text-blue-700 dark:text-blue-400" />
                  <p className="text-xs text-blue-700 dark:text-blue-300 print:text-[11px]">
                    Date Issued: {currentDate}
                  </p>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md border-2 border-blue-300 dark:border-blue-700">
                <QRCodeCanvas
                  value={`${import.meta.env.VITE_PUBLIC_URL}/verify/${submission.referenceNumber}`} 
                  size={100}
                  includeMargin
                  className="print:h-16 print:w-16"
                />
                <p className="text-xs text-center mt-1 text-blue-700 dark:text-blue-300">Scan to Verify</p>
              </div>
            </div>
          </div>

          {/* User Information Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 print:grid-cols-2">
            <DetailSection 
              title="Submitter Information"
              icon={<User className="h-5 w-5 text-blue-700 dark:text-blue-400" />}
              items={[
                { 
                  icon: <User className="h-4 w-4" />,
                  label: 'Full Name', 
                  value: `${submission.userData.firstName} ${submission.userData.lastName}` 
                },
                { 
                  icon: <FileCheck className="h-4 w-4" />,
                  label: 'Position', 
                  value: submission.userData.position 
                },
                { 
                  icon: <MapPin className="h-4 w-4" />,
                  label: 'Barangay', 
                  value: submission.userData.barangay 
                },
                { 
                  icon: <Phone className="h-4 w-4" />,
                  label: 'Contact Number', 
                  value: submission.userData.phoneNumber 
                }
              ]}
            />
            <DetailSection 
              title="Transaction Details"
              icon={<FileText className="h-5 w-5 text-blue-700 dark:text-blue-400" />}
              items={[
                { 
                  icon: <FileText className="h-4 w-4" />,
                  label: 'Submission Type', 
                  value: "Official Documents" 
                },
                { 
                  icon: <Clock className="h-4 w-4" />,
                  label: 'Date Received', 
                  value: currentDate.split(',')[0] 
                },
                { 
                  icon: <Check className="h-4 w-4" />,
                  label: 'Status', 
                  value: "Completed" 
                },
                { 
                  icon: <Share2 className="h-4 w-4" />,
                  label: 'Verify At', 
                  value: `${import.meta.env.VITE_FRONTEND_URL}/verify/${submission.referenceNumber}` 
                }
              ]}
            />
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <FileCheck className="h-5 w-5 text-blue-700 dark:text-blue-400" />
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 print:text-base">
                Submission Particulars
              </h3>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <div className="space-y-4 print:space-y-2">
                {submission.formFields?.map((field) => {
                  const value = submission.submissionData?.[field.id] || 'N/A';

                  const displayValue = Array.isArray(value) 
                    ? value.length > 0 
                      ? `${value.length} file(s) uploaded` 
                      : 'No files uploaded'
                    : value;

                  return (
                    <DetailItem
                      key={field.id}
                      label={field.label}
                      value={displayValue}
                      print
                    />
                  );
                })}
              </div>
            </div>
          </div>


          {/* Security Footer */}
          <div className="mt-10 pt-6 border-t-4 border-blue-900 dark:border-blue-700 print:mt-6">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm print:text-xs gap-4">
              <div className="text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700 w-full md:w-auto">
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="h-4 w-4 text-blue-700 dark:text-blue-400" />
                  <p className="font-medium text-blue-900 dark:text-blue-300">Security Information</p>
                </div>
                <p>Validated through DILG Online Portal</p>
                <p>Transaction ID: <span className="font-mono">{submission.referenceNumber}</span></p>
              </div>
              <div className="text-center">
                <div className="h-20 w-20 mx-auto bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 rounded-full flex items-center justify-center text-red-600 dark:text-red-400 font-bold border-2 border-red-400 dark:border-red-600 print:h-16 print:w-16 shadow-inner">
                  OFFICIAL
                </div>
                <p className="text-[10px] text-gray-600 dark:text-gray-300 mt-2 max-w-[200px]">
                  Verify authenticity at: {import.meta.env.VITE_PUBLIC_URL}/verify
                </p>
              </div>
            </div>
          </div>

          {/* Print Guidelines */}
          <div className="print-only mt-8 text-xs text-gray-500 text-center">
            <p>This document is valid without signature when printed from DILG Online Portal</p>
            <p className="mt-2">*** OFFICIAL USE ONLY ***</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8 print-hidden">
          <Button 
            size="lg"
            onClick={() => navigate('/')}
            className="gap-2 shadow-lg bg-white hover:bg-gray-100 text-blue-900 border-2 border-blue-200"
            variant="outline"
          >
            <FileText className="h-5 w-5" />
            New Submission
          </Button>
          <Button 
            size="lg"
            onClick={handleDownloadPDF}
            className="gap-2 bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg"
            disabled={downloadingPdf}
          >
            {downloadingPdf ? (
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
            ) : (
              <Download className="h-5 w-5 mr-2" />
            )}
            {downloadingPdf ? 'Generating PDF...' : 'Download Official Copy'}
          </Button>
          <Button 
            size="lg"
            onClick={() => window.print()}
            className="gap-2 shadow-lg bg-gray-100 hover:bg-gray-200 text-gray-800"
            variant="secondary"
          >
            <Printer className="h-5 w-5" />
            Print Receipt
          </Button>
        </div>

        <div className="text-center space-y-2 text-sm text-gray-600 dark:text-gray-300 mt-8 print-hidden bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800 max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-blue-700 dark:text-blue-300">
            <Shield className="h-5 w-5" />
            <p className="font-medium">Official Receipt Information</p>
          </div>
          <p>This official receipt serves as proof of your successful submission to the Department of the Interior and Local Government.</p>
          <p className="font-medium">For inquiries, contact DILG Central Office at (02) 8876-3454</p>
        </div>
      </div>
    </div>
  );
}

// Reusable Detail Section Component
function DetailSection({ 
  title, 
  items, 
  icon 
}: { 
  title: string; 
  items: Array<{ 
    icon?: React.ReactNode; 
    label: string; 
    value: string 
  }>;
  icon?: React.ReactNode;
}) {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/80 dark:to-gray-800/50 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm print:p-3 overflow-hidden relative">
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h4 className="font-semibold text-blue-900 dark:text-blue-200 print:text-sm">{title}</h4>
      </div>
      <div className="space-y-3 print:space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between text-sm print:text-xs items-center">
            <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              {item.icon && <span className="text-blue-700 dark:text-blue-400">{item.icon}</span>}
              {item.label}:
            </span>
            <span className="font-medium text-gray-800 dark:text-gray-200">{item.value}</span>
          </div>
        ))}
      </div>
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-50 to-transparent dark:from-blue-900/20 rounded-full -mr-12 -mt-12 z-0"></div>
    </div>
  );
}

function DetailItem({ label, value, print }: { label: string; value: string | React.ReactNode; print?: boolean }) {
  return (
    <div className={`flex justify-between items-start py-3 border-b border-gray-200 dark:border-gray-700 ${print ? 'print:text-sm print:py-2' : ''}`}>
      <dt className="font-medium text-gray-700 dark:text-gray-300 min-w-[160px] pr-4 print:text-xs">
        {label}
      </dt>
      <dd className="text-gray-900 dark:text-gray-100 text-right flex-1 break-words">
        {value && value !== 'N/A' ? (
          typeof value === 'string' ? (
            <span className="font-normal">{value}</span>
          ) : (
            value
          )
        ) : (
          <span className="text-gray-400 dark:text-gray-500">N/A</span>
        )}
      </dd>
    </div>
  );
}