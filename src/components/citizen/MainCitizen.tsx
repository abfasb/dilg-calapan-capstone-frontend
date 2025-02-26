import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../ui/tabs"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Switch } from "../ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "../ui/alert"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { Progress } from "../ui/progress"
import { Badge } from "../ui/badge"
import { 
  Fingerprint,
  AlertCircle,
  MessageSquare,
  Bell,
  Upload,
  ScanFace,
  ShieldAlert,
  CalendarCheck,
  NotebookPen
} from 'lucide-react'

interface Report {
  id: string
  title: string
  category: string
  status: 'submitted' | 'in-review' | 'resolved' | 'closed'
  date: Date
  anonymous: boolean
}

interface Alert {
  id: string
  title: string
  type: 'emergency' | 'warning' | 'info'
  date: Date
}

const alertVariantMap: Record<string, "default" | "destructive"> = {
    emergency: "destructive",
    warning: "default",
    info: "default",
  };

const reportSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  category: z.string().min(1, "Please select a category"),
  evidence: z.any().optional(),
  anonymous: z.boolean().default(false)
})

const statusVariantMap: Record<string, "default" | "destructive" | "outline" | "secondary"> = {
    submitted: "default",
    "in-review": "secondary",
    resolved: "outline",
    closed: "destructive",
  };

export default function CitizenPanel() {
  const [activeTab, setActiveTab] = useState('reporting')
  const [reports, setReports] = useState<Report[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [showChatbot, setShowChatbot] = useState(false)
  const [trackingId, setTrackingId] = useState('')
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([])
  const [files, setFiles] = useState<File[]>([])

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    resolver: zodResolver(reportSchema)
  })

  const getCategorySuggestions = (description: string) => {
    const mockSuggestions = ['Public Safety', 'Infrastructure', 'Environmental', 'Administrative']
    setAiSuggestions(mockSuggestions)
  }

  const onSubmit = (data: any) => {
    const newReport: Report = {
      id: `DILG-${Date.now()}`,
      title: data.title,
      category: data.category,
      status: 'submitted',
      date: new Date(),
      anonymous: data.anonymous
    }
    setReports([...reports, newReport])
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 max-w-7xl mx-auto">
      <div className="flex justify-end gap-4 mb-8">
        <Button variant="ghost" className="gap-2">
          <ScanFace className="w-4 h-4" /> Facial Login
        </Button>
        <Button variant="ghost" className="gap-2">
          <Fingerprint className="w-4 h-4" /> Fingerprint
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Third-Party Login</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Google</DropdownMenuItem>
            <DropdownMenuItem>Facebook</DropdownMenuItem>
            <DropdownMenuItem>Microsoft</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 gap-4 bg-white shadow-sm">
          <TabsTrigger value="reporting" className="gap-2">
            <NotebookPen className="w-4 h-4" /> Report Incident
          </TabsTrigger>
          <TabsTrigger value="tracking" className="gap-2">
            <ShieldAlert className="w-4 h-4" /> Track Reports
          </TabsTrigger>
          <TabsTrigger value="engagement" className="gap-2">
            <Bell className="w-4 h-4" /> Community
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reporting" className="mt-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldAlert className="w-6 h-6 text-primary" />
                AI-Powered Incident Reporting
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Input
                        placeholder="Incident Title"
                        {...register('title')}
                        onChange={(e) => getCategorySuggestions(e.target.value)}
                      />
                      {errors.title && (
                        <span className="text-sm text-red-500">{errors.title.message}</span>
                      )}
                    </div>

                    <Select onValueChange={(value) => setValue('category', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {aiSuggestions.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <div className="flex items-center gap-2">
                      <Switch
                        id="anonymous-mode"
                        {...register('anonymous')}
                      />
                      <label htmlFor="anonymous-mode" className="text-sm">
                        Anonymous Reporting
                      </label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Textarea
                      placeholder="Detailed description..."
                      {...register('description')}
                      className="h-32"
                    />
                    <div className="border-dashed border-2 rounded-lg p-4">
                      <label className="flex flex-col items-center gap-2 cursor-pointer">
                        <Upload className="w-6 h-6" />
                        <span className="text-sm">Upload Evidence (Photos, Videos)</span>
                        <input
                          type="file"
                          multiple
                          className="hidden"
                          onChange={(e) => setFiles([...e.target.files!])}
                        />
                      </label>
                      {files.map((file) => (
                        <div key={file.name} className="text-sm text-gray-600">
                          {file.name} ({Math.round(file.size / 1024)}KB)
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <Button type="submit" className="gap-2">
                    <Upload className="w-4 h-4" /> Submit Report
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Report Tracking */}
        <TabsContent value="tracking" className="mt-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldAlert className="w-6 h-6 text-primary" />
                Report Tracking System
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-4">
                <Input
                  placeholder="Enter Tracking ID"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                />
                <Button>Track Report</Button>
              </div>

              {selectedReport && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{selectedReport.title}</h3>
                    <Badge variant={statusVariantMap[selectedReport.status] || "default"}>
                      {selectedReport.status.toUpperCase()}
                    </Badge>
                  </div>
                  <Progress value={
                    selectedReport.status === 'submitted' ? 25 :
                    selectedReport.status === 'in-review' ? 50 :
                    selectedReport.status === 'resolved' ? 75 : 100
                  } />
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-medium">Submitted</div>
                      <div className="text-gray-500">{selectedReport.date.toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Community Engagement */}
        <TabsContent value="engagement" className="mt-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Emergency Alerts */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-6 h-6 text-red-500" />
                  Emergency Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {alerts.map((alert) => (
                <Alert variant={alertVariantMap[alert.type] || "default"}>
                    <AlertTitle>{alert.title}</AlertTitle>
                    <AlertDescription>
                      {alert.date.toLocaleString()}
                    </AlertDescription>
                  </Alert>
                ))}
              </CardContent>
            </Card>

            {/* Services Section */}
            <div className="space-y-6">
              <Card className="shadow-lg">
                <CardContent className="p-6 space-y-4">
                  <Button className="w-full gap-2" onClick={() => setShowChatbot(true)}>
                    <MessageSquare className="w-4 h-4" />
                    AI Chatbot Assistance
                  </Button>
                  <Button variant="outline" className="w-full gap-2">
                    <CalendarCheck className="w-4 h-4" />
                    Book Appointment
                  </Button>
                </CardContent>
              </Card>

              {/* Announcements */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Latest Announcements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-l-4 border-primary pl-4">
                      <div className="font-medium">New LGU Guidelines</div>
                      <div className="text-sm text-gray-500">Posted 2 hours ago</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Chatbot Dialog */}
      <Dialog open={showChatbot} onOpenChange={setShowChatbot}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>DILG AI Assistant</DialogTitle>
          </DialogHeader>
          <div className="h-96 bg-gray-50 rounded-lg p-4">
            {/* Chatbot interface implementation */}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}