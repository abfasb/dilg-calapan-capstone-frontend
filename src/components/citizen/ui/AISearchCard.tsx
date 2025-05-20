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
              <p>No matching forms found</p>
            ) : (
              results.map((result, index) => (
                <div 
                  key={result.form._id}
                  className="p-4 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => window.location.href = `/forms/${result.form._id}`}
                >
                  <h3 className="font-semibold">{result.form.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {result.form.description}
                  </p>
                  <div className="mt-2 text-xs text-primary">
                    Match Confidence: {(result.score * 100).toFixed(1)}%
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}