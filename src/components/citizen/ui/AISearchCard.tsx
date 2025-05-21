import { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '../../ui/card';
import { Input } from '../../ui/input';
import { Bot } from 'lucide-react';
import { Button } from '../../ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog';
import axios from 'axios';

export default function AISearchCard() {
  const [file, setFile] = useState<File | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/search/search-by-template`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setResults(response.data.matches);
      setOpen(true);
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
            <Bot className="w-6 h-6 text-primary" />
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
         <DialogContent className="max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Matching Forms Found</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              {results.length === 0 ? (
                <p className="text-center text-gray-500">No matching forms found</p>
              ) : (
                results.map((result) => (
                <Card key={result.formId} className="transition-shadow hover:shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {result.title}
                      {result.isExactMatch && (
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                          Exact Match
                        </span>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Template: {result.templateFileName}
                      </span>
                      <Button 
                        size="sm"
                        onClick={() => window.location.href = `/forms/${result.formId}`}
                      >
                        Open Form
                      </Button>
                    </div>
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