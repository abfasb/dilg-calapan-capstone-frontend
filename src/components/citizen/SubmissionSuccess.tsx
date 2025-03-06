import { CheckCircle, Printer, Download, FileText } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export default function SubmissionSuccess() {const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  
  const referenceNo = state?.referenceNumber || 'N/A';
  const submissionData = state?.formData || {};
  
  const currentDate = new Date().toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const formFields = {
    fullName: submissionData['f31e0cc6-6ca1-437a-bbb0-9ee36bf078b2'] || 'N/A',
    department: submissionData['53687603-e0cf-4ff4-aed6-06f8e59bebf3']?.join(', ') || 'N/A',
    incidentDescription: submissionData['0741b9ed-7b78-4304-83ad-e04be5ef1ba9'] || 'N/A',
    proofs: submissionData['125952c3-8a3f-4176-a67f-3cb88d48cea5'] || []
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleDownloadPDF = async () => {
    const receipt = document.getElementById('official-receipt');
    if (!receipt) return;

    const canvas = await html2canvas(receipt, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 190;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
    pdf.save(`DILG-Receipt-${referenceNo}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto dark:text-green-400" />
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
            Official Submission Receipt
          </h1>
          <p className="text-xl text-muted-foreground">
            Department of the Interior and Local Government
          </p>
        </div>

        <div id="official-receipt" className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-green-100 dark:border-gray-700">
          <div className="absolute opacity-10 text-[6rem] font-bold rotate-45 top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 pointer-events-none dark:text-white">
            DILG OFFICIAL RECEIPT
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b pb-6">
            <img 
              src="https://i.ibb.co/QFh5dS8r/images-1.png" 
              alt="DILG Logo" 
              className="h-24 w-24 mb-4 md:mb-0"
            />
            <div className="text-center md:text-right">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Republic of the Philippines
              </h2>
              <p className="text-lg text-green-600 dark:text-green-400">
                Department of the Interior and Local Government
              </p>
              <p className="text-sm text-muted-foreground">
                Apo Drive, Pasig City, Philippines 1600
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-2">
              <DetailItem label="Reference Number" value={referenceNo} />
              <DetailItem label="Date Submitted" value={currentDate} />
              <DetailItem label="Submitted By" value={formFields.fullName} />
            </div>
            <div className="space-y-2">
              <DetailItem label="Department" value={formFields.department} />
              <DetailItem 
                label="Incident Type" 
                value={formFields.incidentDescription || 'N/A'} 
              />
            </div>
          </div>


          {/* Incident Details */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-green-600 dark:text-green-400">
              Incident Description
            </h3>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {submissionData.incidentDescription || 'No description provided'}
            </p>
          </div>

          {/* Attached Proofs */}
          {formFields.proofs.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-green-600 dark:text-green-400">
              Attached Evidence
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {formFields.proofs.map((proof: string, index: number) => (
                <img
                  key={index}
                  src={proof}
                  alt={`Proof ${index + 1}`}
                  className="rounded-lg border h-32 w-full object-cover"
                />
              ))}
            </div>
          </div>
        )}
        
          <div className="mt-8 pt-6 border-t text-center">
            <div className="inline-block border-2 border-dashed border-green-600 px-8 py-4 rounded-lg">
              <p className="text-sm text-green-600 dark:text-green-400">
                Officially Received by DILG
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {currentDate}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
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
            className="gap-2 bg-green-600 hover:bg-green-700"
          >
            <Download className="h-5 w-5" />
            Download PDF
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

        <p className="text-center text-sm text-muted-foreground mt-6">
          Keep this receipt for your records. For verification purposes, 
          present this document along with valid ID when making inquiries.
        </p>
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-muted-foreground">{label}:</span>
      <span className="font-medium text-gray-800 dark:text-gray-200 max-w-[60%] text-right">
        {value}
      </span>
    </div>
  );
}