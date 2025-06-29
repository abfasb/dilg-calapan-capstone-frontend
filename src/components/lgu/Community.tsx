"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import barangays from '../../types/barangays';

interface Form {
  _id: string;
  title: string;
}

interface SubmissionStatus {
  [position: string]: boolean;
}

interface BarangayStatus {
  barangayId: string;
  barangayName: string;
  positions: SubmissionStatus;
  overallStatus: 'low' | 'medium' | 'high';
}

const positions = [
  "Captain",
  "Secretary",
  "Treasurer",
  "SK Chairman",
  "Councilor"
];

const Community = () => {
  const [forms, setForms] = useState<Form[]>([]);
  const [selectedForm, setSelectedForm] = useState<string>('');
  const [barangayStatuses, setBarangayStatuses] = useState<BarangayStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [notificationMessage, setNotificationMessage] = useState('');

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/monitoring/get-forms`);
        const data = await response.json();
        setForms(data);
        if (data.length > 0) setSelectedForm(data[0]._id);
      } catch (error) {
        console.error('Error fetching forms:', error);
      }
    };

    fetchForms();
  }, []);

  useEffect(() => {
    const fetchSubmissionStatus = async () => {
      if (!selectedForm) return;
      
      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/monitoring/get-monitoring?formId=${selectedForm}`);
        const data = await response.json();
        setBarangayStatuses(data);
      } catch (error) {
        console.error('Error fetching submission status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissionStatus();
  }, [selectedForm]);

  const handleNotifyBarangay = async (barangayId: string) => {
    if (!notificationMessage.trim()) {
      alert('Please enter a notification message');
      return;
    }
    
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/monitoring/send-notification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formId: selectedForm,
          barangayId,
          message: notificationMessage
        })
      });
      alert('Notification sent successfully!');
      setNotificationMessage('');
    } catch (error) {
      console.error('Error sending notification:', error);
      alert('Failed to send notification');
    }
  };

  const getStatusColor = (status: 'low' | 'medium' | 'high') => {
    switch (status) {
      case 'low': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: 'low' | 'medium' | 'high') => {
    switch (status) {
      case 'low': return 'Low';
      case 'medium': return 'Medium';
      case 'high': return 'High';
      default: return 'Unknown';
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-cyan-400">Monitoring and Submissions</h1>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-white">Monitoring</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex items-center space-x-4">
            <div className="w-64">
              <Select value={selectedForm} onValueChange={setSelectedForm}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select a form" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  {forms.map(form => (
                    <SelectItem key={form._id} value={form._id}>
                      {form.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1 flex space-x-2">
              <input
                type="text"
                value={notificationMessage}
                onChange={(e) => setNotificationMessage(e.target.value)}
                placeholder="Enter notification message"
                className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400"
              />
              <Button 
                variant="outline"
                className="bg-cyan-600 hover:bg-cyan-700 text-white"
                onClick={() => {
                  const incompleteBarangays = barangayStatuses.filter(b => b.overallStatus !== 'high');
                  if (incompleteBarangays.length === 0) {
                    alert('All barangays have completed submissions!');
                    return;
                  }
                  if (!notificationMessage.trim()) {
                    alert('Please enter a notification message');
                    return;
                  }
                  if (confirm(`Send notification to ${incompleteBarangays.length} barangays?`)) {
                    incompleteBarangays.forEach(b => handleNotifyBarangay(b.barangayId));
                  }
                }}
              >
                Notify All Incomplete
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
            </div>
          ) : (
            <Table className="border border-gray-700 rounded-lg">
              <TableHeader>
                <TableRow className="hover:bg-gray-800">
                  <TableHead className="text-white">Barangay</TableHead>
                  <TableHead className="text-white">Overall Status</TableHead>
                  {positions.map(position => (
                    <TableHead key={position} className="text-white">{position}</TableHead>
                  ))}
                  <TableHead className="text-white">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {barangayStatuses.map((barangay) => (
                  <TableRow key={barangay.barangayId} className="hover:bg-gray-800">
                    <TableCell className="font-medium text-white">
                      {barangay.barangayName}
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(barangay.overallStatus)} text-white`}>
                        {getStatusText(barangay.overallStatus)}
                      </Badge>
                    </TableCell>
                    {positions.map(position => (
                      <TableCell key={position}>
                        {barangay.positions[position] ? (
                          <span className="text-green-500">●</span>
                        ) : (
                          <span className="text-red-500">●</span>
                        )}
                      </TableCell>
                    ))}
                    <TableCell>
                      <Button 
                        variant="outline"
                        className="bg-cyan-600 hover:bg-cyan-700 text-white"
                        onClick={() => handleNotifyBarangay(barangay.barangayId)}
                        disabled={!notificationMessage.trim()}
                      >
                        Notify
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Community;