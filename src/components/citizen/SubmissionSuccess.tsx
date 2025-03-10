import { CheckCircle, Printer, Download, FileText, QrCode } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { QRCodeCanvas } from "qrcode.react";

export default function SubmissionSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  
  const referenceNo = state?.referenceNumber || 'N/A';
  const submissionData = state?.formData || {};
  const userData = state?.userData || {};
  
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

    receipt.classList.add('force-light-mode');
    
    const canvas = await html2canvas(receipt, { 
      scale: 2,
      useCORS: true,
      logging: true,
      backgroundColor: "#ffffff",
      ignoreElements: (element) => element.classList.contains('print-hidden')
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth - 20; // 10mm margins on both sides
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Center the content vertically if it's shorter than page height
    const verticalPosition = (pageHeight - imgHeight) / 2;
    
    pdf.addImage(imgData, 'PNG', 10, verticalPosition > 0 ? verticalPosition : 10, imgWidth, imgHeight);
    pdf.save(`DILG-Submission-${referenceNo}.pdf`);

    // Remove temporary light mode class
    receipt.classList.remove('force-light-mode');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 dark:bg-gray-900 print:bg-white">
      <div className="max-w-4xl mx-auto space-y-8 print:max-w-none print:space-y-0">
        {/* Success Header - Hidden in print */}
        <div className="text-center space-y-4 print:hidden">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto dark:text-green-400 animate-pulse" />
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            OFFICIAL SUBMISSION ACKNOWLEDGMENT
          </h1>
          <p className="text-lg text-muted-foreground">
            Department of the Interior and Local Government
          </p>
        </div>

        {/* Official Receipt Card */}
        <div id="official-receipt" className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 border-4 border-blue-900 relative print:shadow-none print:border-2 print:rounded-none print:p-6 force-light-mode:bg-white">
          {/* Security Patterns */}
          <div className="absolute inset-0 z-0 opacity-10 pointer-events-none print:opacity-20">
            <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMCAwaDYwdjYwSDB6IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTAgMEw2MCA2ME0wIDYwTDYwIDAiIHN0cm9rZT0iI2NjYyIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9zdmc+')]"></div>
          </div>

          {/* Watermark */}
          <div className="absolute inset-0 z-0 opacity-5 pointer-events-none print:opacity-10 rotate-[-15deg]">
            <div className="flex items-center justify-center h-full">
              <div className="text-4xl font-bold tracking-widest text-blue-900 whitespace-nowrap">
                DILG OFFICIAL RECEIPT • DILG OFFICIAL RECEIPT •
              </div>
            </div>
          </div>

          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b-2 border-blue-900 pb-6 print:pb-4">
            <div className="mb-4 md:mb-0 flex items-center gap-4">
              <img 
                src="https://i.ibb.co/QFh5dS8r/images-1.png" 
                alt="DILG Logo" 
                className="h-28 w-28 print:h-20 print:w-20"
              />
              <div className="hidden md:block h-28 w-px bg-gray-300 mx-4" />
            </div>
            <div className="text-center space-y-1">
              <h2 className="text-xl font-bold text-blue-900 dark:text-blue-200 print:text-lg">
                REPUBLIC OF THE PHILIPPINES
              </h2>
              <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 print:text-base">
                DEPARTMENT OF THE INTERIOR AND LOCAL GOVERNMENT
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 print:text-xs">
              1st Floor, Local Government Center New City Hall Complex, M. Roxas Drive Barangay, Calapan, 5200 Oriental Mindoro
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 print:text-[10px]">
                www.dilg-calapancity.gov.ph • (+63) 9055812027
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="bg-blue-900 text-white px-4 py-2 rounded print:py-1">
                <p className="text-sm font-semibold print:text-xs">Official Receipt</p>
                <p className="text-xs print:text-[10px]">Valid without signature</p>
              </div>
            </div>
          </div>

          <div className="relative z-10">
            <div className="mb-8 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg print:p-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-blue-600 dark:text-blue-300 print:text-xs">Tracking Number</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100 print:text-xl">{referenceNo}</p>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-1 print:text-[10px]">
                    Issued: {currentDate}
                  </p>
                </div>
                <div className="bg-white p-2 rounded print:p-1">
                  <QRCodeCanvas
                    value={`https://dilg.gov.ph/verify/${referenceNo}`} 
                    size={80}
                    className="print:h-16 print:w-16"
                    includeMargin
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 print:gap-4">
              <div className="space-y-4 print:space-y-2">
                <DetailItem 
                  label="Submitter Information"
                  value={
                    <div className="space-y-1">
                      <p className="font-semibold">{userData.firstName} {userData.lastName}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 print:text-xs">
                        {userData.position} of Barangay {userData.barangay}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 print:text-xs">
                        📞 {userData.phoneNumber}
                      </p>
                    </div>
                  }
                />
                <DetailItem 
                  label="Submission Type" 
                  value={submissionData['53687603-e0cf-4ff4-aed6-06f8e59bebf3'] || 'Online'}
                />
              </div>
              <div className="space-y-4 print:space-y-2">
                <DetailItem 
                  label="Department/Office" 
                  value={submissionData['0741b9ed-7b78-4304-83ad-e04be5ef1ba9'] || 'DILG Calapan City'}
                />
              </div>
            </div>

            <div className="mb-8 bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg print:p-3">
              <h3 className="text-lg font-semibold mb-2 text-blue-900 dark:text-blue-200 print:text-base">
                Full Incident Report
              </h3>
              <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap text-sm print:text-xs">
                {submissionData['f31e0cc6-6ca1-437a-bbb0-9ee36bf078b2'] || 'No detailed description provided'}
              </div>
            </div>

            {submissionData.files?.length > 0 && (
              <div className="mb-8 print:mb-4">
                <h3 className="text-lg font-semibold mb-4 text-blue-900 dark:text-blue-200 print:text-base">
                  Attached Evidence (Total: {submissionData.files.length})
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 print:grid-cols-2">
                  {submissionData.files.map((file: any, index: number) => (
                    <div key={index} className="relative group border rounded-lg overflow-hidden">
                      <img
                        src={file.url}
                        alt={`Evidence ${index + 1}`}
                        className="h-32 w-full object-cover print:h-24"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white p-2 text-xs print:text-[10px] truncate">
                        {file.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 pt-6 border-t-2 border-blue-900 print:pt-4">
              <div className="flex justify-between items-center text-sm print:text-xs">
                <div className="text-gray-600 dark:text-gray-300">
                  <p>Validated through DILG Online Portal</p>
                  <p>Transaction ID: {referenceNo}</p>
                </div>
                <div className="text-center">
                  <p className="text-red-600 font-bold print:text-red-700">SECURITY SEAL</p>
                  <p className="text-[10px] text-gray-600 dark:text-gray-300">
                    Verify at: https://dilgcalapancity.gov.ph/verify/{referenceNo}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8 print:hidden">
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
            className="gap-2 bg-blue-900 hover:bg-blue-800 text-white shadow-lg hover:shadow-blue-900/30"
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
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-2 border-b border-dashed border-gray-200 dark:border-gray-700 print:py-1">
      <dt className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[160px] print:text-xs">
        {label}
      </dt>
      <dd className="mt-1 md:mt-0 text-base text-gray-900 dark:text-gray-100 text-right flex-1 print:text-sm">
        {typeof value === 'string' ? (
          <span className="break-words">{value}</span>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}