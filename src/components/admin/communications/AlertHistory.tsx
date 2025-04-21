'use client';

import { useState } from 'react';
import { 
  AlertCircle,
  Bolt,
  Power,
  CalendarDays,
  ChevronDown,
  MoreVertical,
  CheckCircle2,
  Trash2,
  BellPlus
} from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../../ui/dropdown-menu';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../ui/table';
import { Input } from '../../ui/input';
import { ScrollArea } from '../../ui/scroll-area';
import { Separator } from '../../ui/separator';
import { cn } from '../../../lib/utils';

type Alert = {
  id: string;
  type: 'weather' | 'safety' | 'utility' | 'health';
  title: string;
  description: string;
  date: string;
  status: 'active' | 'resolved';
  severity: 'low' | 'medium' | 'high';
  affectedAreas: string[];
};

const mockAlerts: Alert[] = [
  {
    id: 'ALT-2025-0456',
    type: 'weather',
    title: 'Typhoon Hagupit (Ruby) - Signal No. 3',
    description: 'Emergency evacuation order for coastal areas. All rescue teams on high alert.',
    date: '2025-04-20T14:30:00Z',
    status: 'active',
    severity: 'high',
    affectedAreas: ['Barangay 1', 'Barangay 2', 'Barangay 3']
  },
  {
    id: 'ALT-2025-0321',
    type: 'utility',
    title: 'Scheduled Power Interruption',
    description: 'Maintenance work in Zone 5. Expected 8-hour outage.',
    date: '2025-04-18T08:00:00Z',
    status: 'resolved',
    severity: 'medium',
    affectedAreas: ['Zone 5']
  },
  {
    id: 'ALT-2025-0287',
    type: 'safety',
    title: 'Mandatory Evacuation Order',
    description: 'Immediate evacuation for areas near Mayon Volcano 6km danger zone',
    date: '2025-04-15T06:45:00Z',
    status: 'resolved',
    severity: 'high',
    affectedAreas: ['Legazpi City', 'Daraga', 'Camalig']
  },
];

const AlertHistory = () => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'resolved'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAlerts = mockAlerts.filter(alert => {
    const matchesStatus = filterStatus === 'all' || alert.status === filterStatus;
    const matchesSearch = alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getIcon = (type: Alert['type']) => {
    switch (type) {
      case 'weather': return <Power className="h-5 w-5" />;
      case 'safety': return <AlertCircle className="h-5 w-5" />;
      case 'utility': return <Power className="h-5 w-5" />;
      case 'health': return <Bolt className="h-5 w-5" />;
      default: return <AlertCircle className="h-5 w-5" />;
    }
  };

  const getSeverityColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-amber-600';
      case 'low': return 'text-emerald-600';
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BellPlus className="h-6 w-6 text-primary" />
            Emergency Alert System
          </CardTitle>
          <Button variant="default" className="gap-2">
            <BellPlus className="h-4 w-4" />
            Create New Alert
          </Button>
        </div>
        
        <div className="flex items-center gap-4 pt-4">
          <Input
            placeholder="Search alerts..."
            className="max-w-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                {filterStatus === 'all' ? 'All Alerts' : `${filterStatus} Alerts`}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterStatus('all')}>
                All Alerts
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus('active')}>
                Active Alerts
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus('resolved')}>
                Resolved Alerts
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <ScrollArea className="flex-1">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead className="w-[100px]">Alert ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Affected Areas</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Date Issued</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAlerts.map((alert) => (
              <TableRow key={alert.id}>
                <TableCell className="font-medium">{alert.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getIcon(alert.type)}
                    <span className="capitalize">{alert.type}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-[400px]">
                    <p className="font-medium">{alert.title}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {alert.description}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1 max-w-[200px]">
                    {alert.affectedAreas.map((area) => (
                      <Badge 
                        key={area}
                        variant="outline"
                        className="text-xs px-2 py-1"
                      >
                        {area}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <span className={cn(
                    "font-medium capitalize",
                    getSeverityColor(alert.severity)
                  )}>
                    {alert.severity}
                  </span>
                </TableCell>
                <TableCell>
                  {new Date(alert.date).toLocaleDateString('en-PH', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={alert.status === 'active' ? 'destructive' : 'default'}
                    className="capitalize"
                  >
                    {alert.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        Mark as Resolved
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2">
                        <CalendarDays className="h-4 w-4" />
                        Extend Deadline
                      </DropdownMenuItem>
                      <Separator />
                      <DropdownMenuItem className="text-red-600 gap-2">
                        <Trash2 className="h-4 w-4" />
                        Delete Alert
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </Card>
  );
};

export default AlertHistory;