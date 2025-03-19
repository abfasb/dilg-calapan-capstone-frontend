import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { CheckCircle, Printer, Download, FileText, QrCode, Loader2, AlertCircle } from "lucide-react";
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
        createdAt: new Date().toISOString(),
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
    const receipt = document.getElementById('official-receipt');
    if (!receipt) return;

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
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg font-medium">Loading Submission Details...</p>
        </div>
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Submission</AlertTitle>
          <AlertDescription className="mb-4">{error}</AlertDescription>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/')}>
              Return Home
            </Button>
            <Button onClick={() => window.location.reload()}>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Retry
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 dark:bg-gray-900 print:bg-white">
      <div className="max-w-4xl mx-auto space-y-8 print:max-w-none">
        <div className="text-center space-y-4 print:hidden">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto animate-pulse" />
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            OFFICIAL SUBMISSION ACKNOWLEDGMENT
          </h1>
          <p className="text-lg text-muted-foreground">
            Department of the Interior and Local Government
          </p>
        </div>

        {/* Official Receipt Document */}
        <div id="official-receipt" className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 border-4 border-blue-900 relative 
          print:shadow-none print:border-2 print:rounded-none print:p-6">
          
          {/* Security Background Elements */}
          <div className="absolute inset-0 z-0 opacity-20 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZGRkIiBzdHJva2Utd2lkdGg9IjIiLz48L3N2Zz4=')]" />
          <div className="absolute top-4 right-4 opacity-30 text-[80px] font-bold text-red-500 rotate-45 -z-10">
            OFFICIAL DOCUMENT
          </div>

          {/* Letterhead Section */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b-2 border-blue-900 pb-6">
            <div className="mb-4 md:mb-0 flex items-center gap-4">
              <img 
                src="/dilg-logo.png" 
                alt="DILG Logo" 
                className="h-28 w-28 print:h-20 print:w-20"
              />
            </div>
            <div className="text-center space-y-1">
              <h2 className="text-xl font-bold text-blue-900 dark:text-blue-200 print:text-lg">
                REPUBLIC OF THE PHILIPPINES
              </h2>
              <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 print:text-base">
                DEPARTMENT OF THE INTERIOR AND LOCAL GOVERNMENT
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 print:text-xs">
                1st Floor, Local Government Center<br />
                New City Hall Complex, M. Roxas Drive<br />
                Barangay, Calapan, 5200 Oriental Mindoro
              </p>
            </div>
          </div>

          {/* Tracking Information */}
          <div className="mb-8 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg print:p-3">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-blue-600 dark:text-blue-300 print:text-xs">OFFICIAL RECEIPT NUMBER</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100 print:text-xl">
                  {submission.referenceNumber}
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1 print:text-[11px]">
                  Date Issued: {currentDate}
                </p>
              </div>
              <div className="bg-white p-2 rounded border border-blue-200">
                <QRCodeCanvas
                  value={`${import.meta.env.VITE_PUBLIC_URL}/verify/${submission.referenceNumber}`} 
                  size={80}
                  includeMargin
                  className="print:h-16 print:w-16"
                />
              </div>
            </div>
          </div>

          {/* User Information Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 print:grid-cols-2">
            <DetailSection 
              title="Submitter Information"
              items={[
                { label: 'Full Name', value: `${submission.userData.firstName} ${submission.userData.lastName}` },
                { label: 'Position', value: submission.userData.position },
                { label: 'Barangay', value: submission.userData.barangay },
                { label: 'Contact Number', value: submission.userData.phoneNumber }
              ]}
            />
            <DetailSection 
              title="Transaction Details"
              items={[
                { label: 'Submission Type', value: "Official Documents" },
                { label: 'Payment Method', value: "N/A" },
                { label: 'Status', value: "Completed" },
                { label: 'Verification URL', value: `${import.meta.env.VITE_PUBLIC_URL}/verify/${submission.referenceNumber}` }
              ]}
            />
          </div>

          {/* Submission Details */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-blue-900 dark:text-blue-200 print:text-base">
              Submission Particulars
            </h3>
            <div className="space-y-4 print:space-y-2">
              {submission.formFields?.map((field) => (
                <DetailItem
                  key={field.id}
                  label={field.label}
                  value={submission.submissionData[field.id] || 'N/A'}
                  print
                />
              ))}
            </div>
          </div>

          {/* Official Stamps */}
          <div className="mt-12 pt-8 border-t-2 border-dashed border-blue-900 print:mt-8">
            <div className="grid grid-cols-2 gap-8">
              <div className="text-center">
                <div className="h-24 w-48 mx-auto border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center text-xs text-gray-500">
                  [OFFICIAL RECEIVING STAMP]
                </div>
                <p className="text-sm mt-2 text-gray-600">Authorized Receiving Officer</p>
              </div>
              <div className="text-center">
                <div className="h-24 w-48 mx-auto border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center text-xs text-gray-500">
                  [DILG OFFICIAL SEAL]
                </div>
                <p className="text-sm mt-2 text-gray-600">DILG Official Stamp</p>
              </div>
            </div>
          </div>

          {/* Security Footer */}
          <div className="mt-8 pt-6 border-t-2 border-blue-900 print:mt-6">
            <div className="flex justify-between items-center text-sm print:text-xs">
              <div className="text-gray-600 dark:text-gray-300">
                <p>Validated through DILG Online Portal</p>
                <p>Transaction ID: {submission.referenceNumber}</p>
              </div>
              <div className="text-center">
                <div className="h-16 w-16 mx-auto bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold border-2 border-red-300 print:h-12 print:w-12">
                  SECURITY
                </div>
                <p className="text-[10px] text-gray-600 dark:text-gray-300 mt-1">
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
            className="gap-2 shadow-lg"
            variant="outline"
          >
            <FileText className="h-5 w-5" />
            New Submission
          </Button>
          <Button 
            size="lg"
            onClick={handleDownloadPDF}
            className="gap-2 bg-blue-900 hover:bg-blue-800 text-white shadow-lg"
          >
            <Download className="h-5 w-5" />
            Download Official Copy
          </Button>
          <Button 
            size="lg"
            onClick={() => window.print()}
            className="gap-2 shadow-lg"
            variant="secondary"
          >
            <Printer className="h-5 w-5" />
            Print Receipt
          </Button>
        </div>

        <div className="text-center text-sm text-gray-600 dark:text-gray-300 mt-6 print-hidden">
          <p>This official receipt serves as proof of your successful submission to the DILG.</p>
          <p>For inquiries, contact DILG Central Office at (02) 8876-3454</p>
        </div>
      </div>
    </div>
  );
}

// Reusable Detail Section Component
function DetailSection({ title, items }: { title: string; items: Array<{ label: string; value: string }> }) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 print:p-3">
      <h4 className="font-semibold mb-3 text-blue-900 print:text-sm">{title}</h4>
      <div className="space-y-3 print:space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between text-sm print:text-xs">
            <span className="text-gray-600">{item.label}:</span>
            <span className="font-medium text-gray-800">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DetailItem({ label, value, print }: { label: string; value: string | React.ReactNode; print?: boolean }) {
  return (
    <div className={`flex justify-between items-start py-2 border-b border-gray-200 ${print ? 'print:text-sm' : ''}`}>
      <dt className="font-medium text-gray-700 min-w-[160px] pr-4 print:text-xs">
        {label}
      </dt>
      <dd className="text-gray-900 text-right flex-1 break-words">
        {typeof value === 'string' ? (
          <span className="font-normal">{value}</span>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}