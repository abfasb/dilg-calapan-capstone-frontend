import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/card';
import { Input } from '../../ui/input';
import { Bot, Loader2, FileText, ArrowRight, X } from 'lucide-react';
import { Button } from '../../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '../../ui/dialog';
import axios from 'axios';
import { Progress } from '../../ui/progress';

export default function AISearchCard() {
  const [file, setFile] = useState<File | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSearch = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      setProgress(30);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/search/search-by-template`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 90) / (progressEvent.total || 1)
            );
            setProgress(percentCompleted);
          }
        }
      );

      setResults(response.data.matches);
      setOpen(true);
      setProgress(100);
      setTimeout(() => setProgress(0), 500);
    } catch (error) {
      console.error('Search failed:', error);
      alert('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
       <Card className="hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            AI Reporting Assistant
          </CardTitle>

        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <Input 
              type="file" 
              accept="image/*,.pdf" 
              className="cursor-pointer"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <Button 
              onClick={handleSearch}
              disabled={!file || loading}
            >
              {loading ? 'Searching...' : 'Find Matching Forms'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] rounded-2xl border-gray-700 bg-gray-900 backdrop-blur-lg">
           <DialogClose className="absolute right-4 top-4 z-50 text-white hover:text-gray-300 rounded-sm opacity-70 hover:opacity-100 transition">
              <X className="h-5 w-5" />
            </DialogClose>
          <DialogHeader className="border-b border-gray-700 px-6 py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-500/20 p-2 rounded-lg">
                <FileText className="w-6 h-6 text-blue-400" />
              </div>
              <DialogTitle className="text-2xl font-bold text-gray-100">
                {results.length} Matching Form{results.length !== 1 ? 's' : ''} Found
              </DialogTitle>
            </div>
          </DialogHeader>
          
          <div className="space-y-6 px-6 py-4 overflow-y-auto">
            {results.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <div className="bg-gray-800 p-5 rounded-full">
                  <Bot className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-200">No matches found</h3>
                <p className="text-gray-400 text-center">
                  Try uploading a different template file or check the file name patterns
                </p>
              </div>
            ) : (
              results.map((result) => (
                <Card 
                  key={result.formId} 
                  className="group relative transition-all bg-gray-800 hover:bg-gray-800/90 border border-gray-700 hover:border-blue-500 shadow-xl"
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-gray-100 truncate">
                          {result.title}
                          {result.isExactMatch && (
                            <span className="ml-3 text-xs px-2.5 py-1 bg-green-900/30 text-green-300 rounded-full border border-green-800/50">
                              Exact Match
                            </span>
                          )}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-400 truncate">
                        <span className="font-medium text-gray-300">Template:</span>{' '}
                        <span className="font-mono text-blue-300/90">{result.templateFileName}</span>
                      </p>
                    </div>
                    
                    <Button 
                      variant="ghost"
                      size="sm" 
                      className="ml-4 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 hover:text-white rounded-lg px-4 py-2 transition-colors shadow-sm"
                      onClick={() => window.location.href = `/report/${result.formId}`}
                    >
                      Open
                      <ArrowRight className="w-4 h-4 ml-2 -mr-1" />
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}