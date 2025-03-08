import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table";
import { Switch } from "../../ui/switch";
import { Badge } from "../../ui/badge";
import { Slider } from "../../ui/slider";
import { Lock, MonitorCheck, Hourglass, Network, ShieldAlert, LogOut } from "lucide-react";

const SessionPolicies: React.FC = () => {
  const activeSessions = [
    {
      id: "1",
      device: "Windows 11 - Chrome",
      location: "Calapan City, PH",
      ip: "192.168.1.101",
      lastActivity: "2 minutes ago",
      status: "active"
    },
    {
      id: "2",
      device: "iPhone 15 - Safari",
      location: "Manila, PH",
      ip: "203.87.129.45",
      lastActivity: "1 hour ago",
      status: "active"
    },
    {
      id: "3",
      device: "Macbook Pro - Firefox",
      location: "Singapore",
      ip: "154.67.23.89",
      lastActivity: "3 days ago",
      status: "expired"
    }
  ];

  const policySettings = {
    sessionTimeout: 30, // minutes
    maxLoginAttempts: 5,
    inactivityLockout: 15, // minutes
    ipMonitoring: true,
    concurrentSessions: false,
    securityAlerts: true
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <ShieldAlert className="h-8 w-8 text-primary" />
          Session Security Policies
        </h1>
      </div>

      {/* Policy Configuration Card */}
      <Card className="border border-destructive/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Lock className="h-6 w-6" />
            Session Policies Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Session Timeout */}
          <div className="grid grid-cols-3 items-center gap-4">
            <div className="flex items-center gap-2">
              <Hourglass className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">Session Timeout</span>
            </div>
            <Slider 
              defaultValue={[policySettings.sessionTimeout]}
              max={120}
              step={5}
              className="col-span-2"
            />
            <span className="text-muted-foreground">
              {policySettings.sessionTimeout} minutes
            </span>
          </div>

          {/* Login Security */}
          <div className="grid grid-cols-3 items-center gap-4">
            <div className="flex items-center gap-2">
              <MonitorCheck className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">Max Login Attempts</span>
            </div>
            <div className="flex items-center gap-2 col-span-2">
              <input
                type="number"
                value={policySettings.maxLoginAttempts}
                className="w-20 px-3 py-2 border rounded-md"
              />
              <span className="text-muted-foreground">attempts before lockout</span>
            </div>
          </div>

          {/* Advanced Security */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Network className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">IP Address Monitoring</span>
              </div>
              <Switch checked={policySettings.ipMonitoring} />
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <LogOut className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Allow Concurrent Sessions</span>
              </div>
              <Switch checked={policySettings.concurrentSessions} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Sessions Card */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2 text-xl">
              <MonitorCheck className="h-6 w-6" />
              Active Sessions
            </CardTitle>
            <Button variant="destructive" size="sm">
              Terminate All Sessions
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Device</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Last Activity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeSessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell className="font-medium">{session.device}</TableCell>
                  <TableCell>{session.location}</TableCell>
                  <TableCell>{session.ip}</TableCell>
                  <TableCell>{session.lastActivity}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={session.status === 'active' ? 'default' : 'destructive'}
                      className="capitalize"
                    >
                      {session.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="text-destructive">
                      Terminate
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Security Recommendations */}
      <Card className="border border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <ShieldAlert className="h-6 w-6 text-primary" />
            Security Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
            <div className="p-2 rounded-full bg-primary/10">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Multi-Factor Authentication</h3>
              <p className="text-sm text-muted-foreground">Enable MFA for enhanced security</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
            <div className="p-2 rounded-full bg-primary/10">
              <Network className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">IP Whitelisting</h3>
              <p className="text-sm text-muted-foreground">Restrict access to specific locations</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SessionPolicies;