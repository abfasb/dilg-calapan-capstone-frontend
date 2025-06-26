import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  CheckCircle,
  XCircle,
  Loader2,
  ShieldCheck,
  FileText,
  User,
  Calendar,
  MapPin,
  AlertCircle
} from "lucide-react";
import { Button } from "../ui/button";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";

interface VerificationData {
  referenceNumber: string;
  status: string;
  submittedBy: {
    name: string;
    email: string;
  };
  formTitle: string;
  documentType: string;
  formType: string;
  createdAt: string;
  updatedAt: string;
  signedBy: string;
  verificationId: string;
  signature?: {
    fileUrl: string;
  };
}

export default function Verification() {
  const { referenceNumber } = useParams();
  const navigate = useNavigate();
  const [verificationData, setVerificationData] = useState<VerificationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifySubmission = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/response/verify/${referenceNumber}`
        );
        
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error('Submission not found');
          }
          throw new Error('Failed to verify submission');
        }

        const data = await res.json();
        setVerificationData(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Verification failed');
      } finally {
        setLoading(false);
      }
    };

    if (referenceNumber) {
      verifySubmission();
    }
  }, [referenceNumber]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-blue-900">
        <div className="flex flex-col items-center gap-4 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900/30 rounded-full animate-ping"></div>
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 dark:text-blue-400 relative" />
          </div>
          <p className="text-lg font-medium text-blue-900 dark:text-blue-200">
            Verifying Submission
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Checking records for reference: {referenceNumber}
          </p>
        </div>
      </div>
    );
  }

  if (error || !verificationData) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-red-50 to-red-100 dark:from-gray-900 dark:to-red-900/30">
        <div className="max-w-md w-full">
          <Alert variant="destructive" className="shadow-xl">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle className="text-lg">Verification Failed</AlertTitle>
            <AlertDescription className="mb-4 mt-2 text-sm">
              {error || 'Unable to verify submission'}
            </AlertDescription>
            <div className="flex gap-2 mt-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/')}
                className="w-full"
              >
                Return Home
              </Button>
              <Button 
                onClick={() => window.location.reload()}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Try Again
              </Button>
            </div>
          </Alert>
          
          <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <ShieldCheck className="h-5 w-5" />
              <p className="font-medium">Verification Tips</p>
            </div>
            <ul className="mt-2 text-sm text-gray-600 dark:text-gray-300 space-y-1">
              <li>• Ensure the QR code is fully visible and well-lit</li>
              <li>• Check your internet connection</li>
              <li>• Verify the reference number: {referenceNumber}</li>
              <li>• Contact DILG support if issue persists</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  const isValid = verificationData.status === "approved";
  const submissionDate = formatDate(verificationData.createdAt);
  const lastUpdated = formatDate(verificationData.updatedAt);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-blue-950 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="relative inline-block mb-4">
            <div 
              className={`absolute inset-0 rounded-full animate-ping ${
                isValid ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30"
              }`}
            ></div>
            {isValid ? (
              <CheckCircle className="h-20 w-20 text-green-600 dark:text-green-400 mx-auto relative" />
            ) : (
              <XCircle className="h-20 w-20 text-red-600 dark:text-red-400 mx-auto relative" />
            )}
          </div>
          <h1 className="text-4xl font-bold text-blue-900 dark:text-blue-100 tracking-tight">
            {isValid ? "Verification Successful!" : "Document Not Valid"}
          </h1>
          <div 
            className={`h-1 w-32 mx-auto rounded-full mt-3 ${
              isValid 
                ? "bg-gradient-to-r from-green-500 to-green-700" 
                : "bg-gradient-to-r from-red-500 to-red-700"
            }`}
          ></div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto mt-4">
            {isValid
              ? "This document has been verified as an official submission to the Department of the Interior and Local Government."
              : "This document could not be verified as an official submission. Please contact DILG for assistance."}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border-[6px] border-blue-900/90 dark:border-blue-700 relative overflow-hidden">
          {/* Security background elements */}
          <div className="absolute inset-0 z-0 opacity-5 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBzdHJva2U9IiMwMDY2Y2MiIHN0cm9rZS13aWR0aD0iMiI+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiLz48Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjUwIi8+PHBhdGggZD0iTTAgMCBMIDIwMCAyMDBNMjAwIDAgTCAwIDIwMCIvPjwvZz48L3N2Zz4=')]" />
          <div className="absolute top-1/4 left-0 right-0 opacity-[0.03] text-[120px] font-bold text-blue-900 rotate-12 -z-10 text-center select-none">
            DILG
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b-4 border-blue-900 dark:border-blue-700 pb-6">
            <div className="mb-4 md:mb-0">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-100 dark:bg-blue-800 rounded-full"></div>
                <img 
                  src="https://i.ibb.co/QFh5dS8r/images-1.png" 
                  alt="DILG Logo" 
                  className="h-28 w-28 relative"
                />
              </div>
            </div>
            
            <div className="text-center">
              <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-200">
                REPUBLIC OF THE PHILIPPINES
              </h2>
              <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 px-4 py-1 rounded-lg inline-block">
                DEPARTMENT OF THE INTERIOR AND LOCAL GOVERNMENT
              </h3>
            </div>
          </div>

          {/* Verification Status */}
          <div className={`mb-8 rounded-xl p-6 ${
            isValid 
              ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700"
              : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700"
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-blue-700 dark:text-blue-400" />
                  <p className="text-sm font-medium uppercase tracking-wider">
                    Verification Status
                  </p>
                </div>
                <p className={`text-3xl font-bold mt-1 ${
                  isValid ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"
                }`}>
                  {isValid ? "VALID DOCUMENT" : "NOT VERIFIED"}
                </p>
              </div>
              
              <div className="text-right">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Verification ID
                </p>
                <p className="font-mono text-blue-900 dark:text-blue-200">
                  {verificationData.verificationId}
                </p>
              </div>
            </div>
          </div>

          {/* Document Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/80 dark:to-gray-800/50 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden relative">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-5 w-5 text-blue-700 dark:text-blue-400" />
                <h4 className="font-semibold text-blue-900 dark:text-blue-200">
                  Document Details
                </h4>
              </div>
              <div className="space-y-3">
                <DetailItem 
                  label="Reference Number" 
                  value={verificationData.referenceNumber} 
                />
                <DetailItem 
                  label="Document Type" 
                  value={verificationData.documentType} 
                />
                <DetailItem 
                  label="Form Title" 
                  value={verificationData.formTitle} 
                />
                <DetailItem 
                  label="Submission Date" 
                  value={submissionDate} 
                />
                <DetailItem 
                  label="Last Updated" 
                  value={lastUpdated} 
                />
                <DetailItem 
                  label="Document Status" 
                  value={
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      verificationData.status === "approved"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                        : verificationData.status === "rejected"
                        ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                    }`}>
                      {verificationData.status.toUpperCase()}
                    </span>
                  } 
                />
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/80 dark:to-gray-800/50 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden relative">
              <div className="flex items-center gap-2 mb-3">
                <User className="h-5 w-5 text-blue-700 dark:text-blue-400" />
                <h4 className="font-semibold text-blue-900 dark:text-blue-200">
                  Submitter Information
                </h4>
              </div>
              <div className="space-y-3">
                <DetailItem 
                  label="Full Name" 
                  value={verificationData.submittedBy.name} 
                />
                <DetailItem 
                  label="Email" 
                  value={verificationData.submittedBy.email} 
                />
                <DetailItem 
                  label="Signed By" 
                  value={verificationData.signedBy} 
                />
                {verificationData.signature?.fileUrl && (
                  <DetailItem 
                    label="Signature" 
                    value={
                      <a 
                        href={verificationData.signature.fileUrl} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        View Signature
                      </a>
                    } 
                  />
                )}
              </div>
            </div>
          </div>

          {/* Security Seal */}
          <div className="mt-10 pt-6 border-t-4 border-blue-900 dark:border-blue-700">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm gap-4">
              <div className="text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700 w-full md:w-auto">
                <div className="flex items-center gap-2 mb-1">
                  <ShieldCheck className="h-4 w-4 text-blue-700 dark:text-blue-400" />
                  <p className="font-medium text-blue-900 dark:text-blue-300">
                    Security Information
                  </p>
                </div>
                <p>Verified through DILG Online Portal</p>
                <p>Verification ID: <span className="font-mono">{verificationData.verificationId}</span></p>
              </div>
              
              <div className="text-center">
                <div className={`h-20 w-20 mx-auto rounded-full flex items-center justify-center font-bold border-2 shadow-inner ${
                  isValid
                    ? "bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 text-green-600 dark:text-green-400 border-green-400 dark:border-green-600"
                    : "bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 text-red-600 dark:text-red-400 border-red-400 dark:border-red-600"
                }`}>
                  {isValid ? "VALID" : "INVALID"}
                </div>
                <p className="text-[10px] text-gray-600 dark:text-gray-300 mt-2 max-w-[200px]">
                  Verified on: {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <Button 
            size="lg"
            onClick={() => navigate('/')}
            className="gap-2 shadow-lg bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-700 hover:to-blue-800 text-white"
          >
            Return to Home
          </Button>
         
        </div>

        <div className="text-center space-y-2 text-sm text-gray-600 dark:text-gray-300 mt-8 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800 max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-blue-700 dark:text-blue-300">
            <AlertCircle className="h-5 w-5" />
            <p className="font-medium">Verification Notice</p>
          </div>
          <p>
            {isValid
              ? "This document has been verified as authentic by the Department of the Interior and Local Government."
              : "This document could not be verified. It may be expired, revoked, or not issued by the DILG."}
          </p>
          <p className="font-medium">For inquiries, contact DILG Central Office at (02) 8876-3454</p>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string | React.ReactNode }) {
  return (
    <div className="flex justify-between items-start py-1">
      <dt className="font-medium text-gray-700 dark:text-gray-300 min-w-[120px] pr-4">
        {label}:
      </dt>
      <dd className="text-gray-900 dark:text-gray-100 text-right flex-1 break-words">
        {value || 'N/A'}
      </dd>
    </div>
  );
}