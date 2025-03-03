import { CheckCircle } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

export default function SubmissionSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-md text-center space-y-6">
        <CheckCircle className="h-16 w-16 text-green-600 mx-auto dark:text-green-400" />
        <h1 className="text-4xl font-bold">Submission Successful!</h1>
        <p className="text-xl text-muted-foreground">
          Your report has been successfully submitted. Thank you for your contribution.
        </p>
        <Button 
          size="lg"
          onClick={() => navigate('/')}
          className="mt-6"
        >
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
}