import { CheckCircle, Printer, Download, FileText, QrCode } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { QRCodeCanvas} from "qrcode.react";

export default function SubmissionSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  
  const referenceNo = state?.referenceNumber || 'N/A';
  const submissionData = state?.formData || {};
  const userData = state?.userData || {};
  console.log(userData);
  
  const currentDate = new Date().toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleDownloadPDF = async () => {
    const receipt = document.getElementById('official-receipt');
    if (!receipt) return;

    const canvas = await html2canvas(receipt, { 
      scale: 2,
      useCORS: true,
      logging: true,
      backgroundColor: "#ffffff"
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 190;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
    pdf.save(`DILG-Submission-${referenceNo}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Success Header */}
        <div className="text-center space-y-4">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto dark:text-green-400" />
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            OFFICIAL SUBMISSION ACKNOWLEDGMENT
          </h1>
          <p className="text-lg text-muted-foreground">
            Department of the Interior and Local Government
          </p>
        </div>

        {/* Official Receipt Card */}
        <div id="official-receipt" className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 border-4 border-blue-900 relative">
          {/* Security Watermark */}
          <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
            <div className="grid grid-cols-3 gap-8 h-full">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="border-r border-b border-dashed border-blue-200" />
              ))}
            </div>
          </div>

          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b-2 border-blue-900 pb-6">
            <div className="mb-4 md:mb-0">
              <img 
                src="https://i.ibb.co/QFh5dS8r/images-1.png" 
                alt="DILG Logo" 
                className="h-28 w-28 mx-auto"
              />
            </div>
            <div className="text-center">
              <h2 className="text-xl font-bold text-blue-900 dark:text-blue-200">
                REPUBLIC OF THE PHILIPPINES
              </h2>
              <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300">
                DEPARTMENT OF THE INTERIOR AND LOCAL GOVERNMENT
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Apo Drive, Pasig City, Philippines 1600
              </p>
            </div>
          </div>

          {/* Reference Section */}
          <div className="mb-8 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-blue-600 dark:text-blue-300">Tracking Number</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{referenceNo}</p>
              </div>
              <QRCodeCanvas
                value={referenceNo} 
                size={80}
                className="bg-white p-1 rounded"
              />
            </div>
          </div>

          {/* Submission Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <DetailItem 
                label="Submitter Information"
                value={
                  <div className="space-y-1">
                    <p>{userData.firstName} {userData.lastName}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {userData.position} of Barangay {userData.barangay}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Contact: {userData.phoneNumber}
                    </p>
                  </div>
                }
              />
              <DetailItem 
                label="Submission Date & Time" 
                value={currentDate}
              />
            </div>
            <div className="space-y-4">
              <DetailItem 
                label="Department/Office" 
                value={submissionData['53687603-e0cf-4ff4-aed6-06f8e59bebf3'] || 'N/A'}
              />
              <DetailItem 
                label="Incident Category" 
                value={submissionData['0741b9ed-7b78-4304-83ad-e04be5ef1ba9'] || 'N/A'}
              />
            </div>
          </div>

          {/* Incident Details */}
          <div className="mb-8 bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-blue-900 dark:text-blue-200">
              Full Incident Report
            </h3>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {submissionData['f31e0cc6-6ca1-437a-bbb0-9ee36bf078b2'] || 'No detailed description provided'}
            </p>
          </div>

          {/* Attached Evidence */}
          {submissionData.files?.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-blue-900 dark:text-blue-200">
                Attached Evidence (Total: {submissionData.files.length})
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {submissionData.files.map((file: any, index: number) => (
                  <div key={index} className="relative group">
                    <img
                      src={file.url}
                      alt={`Evidence ${index + 1}`}
                      className="rounded-lg border h-32 w-full object-cover shadow-sm"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                      {file.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Official Stamp */}
          <div className="mt-8 pt-6 border-t-2 border-blue-900">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600 dark:text-gray-300">
                <p>Validated through DILG Online Portal</p>
                <p>Transaction ID: {referenceNo}</p>
              </div>
              <div className="text-center">
                <div className="border-2 border-dashed border-red-600 px-4 py-2 rounded inline-block">
                  <p className="text-xs text-red-600 font-bold">OFFICIAL RECEIPT</p>
                  <p className="text-[10px] text-gray-600 dark:text-gray-300">Valid without signature</p>
                </div>
              </div>
            </div>
          </div>

          {/* Verification Notice */}
          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-300">
            <p>This document may be verified at https://dilg.gov.ph/verify</p>
            <p>Valid until {new Date().getFullYear() + 1}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8 print:hidden">
          <Button 
            size="lg"
            onClick={() => navigate('/')}
            className="gap-2"
            variant="outline"
          >
            <FileText className="h-5 w-5" />
            New Submission
          </Button>
          <Button 
            size="lg"
            onClick={handleDownloadPDF}
            className="gap-2 bg-blue-900 hover:bg-blue-800 text-white"
          >
            <Download className="h-5 w-5" />
            Download Official Copy
          </Button>
          <Button 
            size="lg"
            onClick={() => window.print()}
            className="gap-2"
            variant="secondary"
          >
            <Printer className="h-5 w-5" />
            Print Receipt
          </Button>
        </div>

        {/* Footer Notice */}
        <div className="text-center text-sm text-gray-600 dark:text-gray-300 mt-6 print:hidden">
          <p>This official receipt serves as proof of your successful submission to the DILG.</p>
          <p>For inquiries, contact DILG Central Office at (02) 8876-3454 or email support@dilg.gov.ph</p>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string | React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-2 border-b border-dashed border-gray-200 dark:border-gray-700">
      <dt className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[160px]">
        {label}
      </dt>
      <dd className="mt-1 md:mt-0 text-base text-gray-900 dark:text-gray-100 text-right flex-1">
        {typeof value === 'string' ? (
          <span className="break-words">{value}</span>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}