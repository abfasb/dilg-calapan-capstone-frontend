import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const StaffOnboarding = () => {
  const [approvalRates, setApprovalRates] = useState([]);
  const [approvedCitizens, setApprovedCitizens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ratesRes, citizensRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/staff/approval-rates`),
          fetch(`${import.meta.env.VITE_API_URL}/api/staff/approved-citizens`)
        ]);

        if (!ratesRes.ok || !citizensRes.ok) throw new Error('Network response was not ok');

        const ratesData = await ratesRes.json();
        const citizensData = await citizensRes.json();

        setApprovalRates(ratesData);
        setApprovedCitizens(citizensData);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">Staff Onboarding Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>LGU Approval Rates</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart
              width={500}
              height={300}
              data={approvalRates}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="lguName" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="approvalRate" fill="#6366f1" name="Approval Rate (%)" />
            </BarChart>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Approval Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {approvalRates.map((lgu: any) => (
              <div key={lgu.lguId} className="space-y-1">
                <div className="flex justify-between">
                  <span className="font-medium">{lgu.lguName}</span>
                  <span>{lgu.approvalRate.toFixed(1)}%</span>
                </div>
                <div className="flex gap-2 text-sm text-muted-foreground">
                  <span>Approved: {lgu.approved}</span>
                  <span>Rejected: {lgu.rejected}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Approved Citizen Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Citizen</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Approved By</TableHead>
                <TableHead>Barangay</TableHead>
                <TableHead>Date Approved</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {approvedCitizens.map((submission: any) => (
                <TableRow key={submission.referenceNumber}>
                  <TableCell>{submission.citizen.name}</TableCell>
                  <TableCell>{submission.citizen.email}</TableCell>
                  <TableCell>{submission.lgu.name}</TableCell>
                  <TableCell>{submission.lgu.barangay}</TableCell>
                  <TableCell>{new Date(submission.approvedAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffOnboarding;
