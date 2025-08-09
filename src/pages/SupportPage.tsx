import { useState } from 'react';
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import { Badge } from "../components/ui/badge"
import { Separator } from "../components/ui/separator"
import { Search, HelpCircle, FileText, BarChart, Bot, Settings, Mail, ArrowRight, ArrowLeft, ChevronRight, ChevronDown } from "lucide-react"

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState('reporting');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    alert('Support request submitted! Our team will contact you soon.');
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50">
      {/* Header with Return Button */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center">
              <Button variant="ghost" className="text-white hover:bg-blue-500 mr-3" onClick={() => window.history.back()}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">DILG eGov Nexus</h1>
                <p className="text-blue-100 text-sm md:text-base">AI-Powered Reporting, Analytics & Document Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <div className="relative hidden md:block">
                <Input
                  placeholder="Search support articles..."
                  className="pl-10 bg-blue-500/80 border-blue-400 placeholder-blue-200 text-white w-64"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-blue-200" />
              </div>
              <Button variant="outline" className="bg-blue-500 hover:bg-blue-400 border-blue-400 text-white">
                <HelpCircle className="mr-2 h-4 w-4" /> Help
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How can we help you today?</h2>
          <p className="text-lg max-w-3xl mx-auto mb-8 text-blue-100">
            Find guides, tutorials, and resources to help you use the DILG eGov Nexus platform effectively
          </p>
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Input
                placeholder="Describe your issue or question..."
                className="pl-12 pr-24 py-5 rounded-full text-base border-0 shadow-lg bg-white text-gray-800"
              />
              <Button className="absolute right-2 top-0.5 py-3 px-5 rounded-full bg-blue-700 hover:bg-blue-600">
                Search Help <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-1">
            <Card className="sticky top-24 shadow-lg">
              <CardHeader className="bg-blue-50">
                <CardTitle className="flex items-center text-blue-800">
                  <Settings className="h-5 w-5 mr-2 text-blue-600" /> Support Topics
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-2">
                  {[
                    { icon: <FileText className="h-4 w-4 mr-2" />, label: "Reporting System" },
                    { icon: <BarChart className="h-4 w-4 mr-2" />, label: "Real-Time Analytics" },
                    { 
                      icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                      </svg>, 
                      label: "Document Management" 
                    },
                    { 
                      icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>,
                      label: "Task Automation" 
                    },
                    { icon: <Bot className="h-4 w-4 mr-2" />, label: "AI Chatbot" }
                  ].map((item, index) => (
                    <Button 
                      key={index}
                      variant="ghost" 
                      className={`w-full justify-start group ${index === 0 ? 'bg-blue-50 text-blue-700' : ''}`}
                    >
                      {item.icon}
                      <span className="group-hover:text-blue-600">{item.label}</span>
                      <ChevronRight className="h-4 w-4 ml-auto text-gray-400 group-hover:text-blue-600" />
                    </Button>
                  ))}
                  
                  <Separator className="my-3" />
                  
                  {[
                    { 
                      icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                      </svg>,
                      label: "User Management" 
                    },
                    { 
                      icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                      </svg>,
                      label: "Security & Permissions" 
                    },
                    { 
                      icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                      </svg>,
                      label: "Dashboard & Reports" 
                    }
                  ].map((item, index) => (
                    <Button 
                      key={index}
                      variant="ghost" 
                      className="w-full justify-start group"
                    >
                      {item.icon}
                      <span className="group-hover:text-blue-600">{item.label}</span>
                      <ChevronRight className="h-4 w-4 ml-auto text-gray-400 group-hover:text-blue-600" />
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6 shadow-lg">
              <CardHeader className="bg-blue-50">
                <CardTitle className="flex items-center text-blue-800">
                  <Mail className="h-5 w-5 mr-2 text-blue-600" /> Contact Support
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm text-gray-600 mb-4">
                  Can't find what you're looking for? Contact our support team directly.
                </p>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 shadow-md">
                  Submit a Ticket
                </Button>
                <div className="mt-5">
                  <h4 className="font-medium mb-3 text-gray-800">Support Hours</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p className="flex items-center">
                      <span className="inline-block w-28">Monday-Friday:</span> 
                      <span>8:00 AM - 6:00 PM</span>
                    </p>
                    <p className="flex items-center">
                      <span className="inline-block w-28">Saturday:</span> 
                      <span>9:00 AM - 2:00 PM</span>
                    </p>
                    <p className="mt-3 flex items-start">
                      <span className="inline-block w-28">Email:</span> 
                      <span>support@dilg-egov-nexus.gov.ph</span>
                    </p>
                    <p className="flex items-center">
                      <span className="inline-block w-28">Phone:</span> 
                      <span>(043) 288 - 7000</span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">DILG eGov Nexus Support Center</h2>
              <p className="text-gray-600">
                Comprehensive guides and resources for Calapan LGU staff to maximize the potential of our AI-powered government management system
              </p>
            </div>

            {/* Getting Started */}
            <Card className="mb-8 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardTitle className="flex items-center text-blue-800">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2 text-blue-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  </svg>
                  Getting Started
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <Card className="border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                      <div className="flex items-center mb-3">
                        <div className="bg-blue-100 p-2 rounded-full mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-600">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                          </svg>
                        </div>
                        <h3 className="font-semibold">User Manual</h3>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Complete guide to all features and functions of the DILG eGov Nexus platform
                      </p>
                      <Button variant="link" className="p-0 mt-3 text-blue-600 hover:text-blue-800">
                        Download PDF <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="border border-green-200 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                      <div className="flex items-center mb-3">
                        <div className="bg-green-100 p-2 rounded-full mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-green-600">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z" />
                          </svg>
                        </div>
                        <h3 className="font-semibold">Video Tutorials</h3>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Step-by-step video guides for all major features and workflows
                      </p>
                      <Button variant="link" className="p-0 mt-3 text-green-600 hover:text-green-800">
                        Watch Now <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="border border-purple-200 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                      <div className="flex items-center mb-3">
                        <div className="bg-purple-100 p-2 rounded-full mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-purple-600">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                          </svg>
                        </div>
                        <h3 className="font-semibold">FAQs</h3>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Answers to common questions about the platform and its features
                      </p>
                      <Button variant="link" className="p-0 mt-3 text-purple-600 hover:text-purple-800">
                        View FAQs <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            {/* Feature Guides */}
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Feature Guides</h3>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-6 bg-blue-50">
                <TabsTrigger value="reporting" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                  Reporting
                </TabsTrigger>
                <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="documents" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                  Documents
                </TabsTrigger>
                <TabsTrigger value="automation" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                  Automation
                </TabsTrigger>
                <TabsTrigger value="chatbot" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                  AI Chatbot
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="reporting">
                <Card className="shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                    <CardTitle className="flex items-center text-blue-800">
                      <FileText className="h-5 w-5 mr-2 text-blue-600" /> Reporting System Guide
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-lg mb-3 text-blue-700">Creating Reports</h4>
                        <div className="flex items-start mt-4">
                          <Badge className="mr-3 mt-1 bg-blue-600">1</Badge>
                          <div>
                            <p>Navigate to <span className="font-medium text-blue-700">Reports</span> &gt; <span className="font-medium text-blue-700">Create New</span> in the main menu</p>
                            <p className="text-sm text-gray-600 mt-2 bg-blue-50 p-2 rounded">You can choose from template-based reports or create a custom report</p>
                          </div>
                        </div>
                        <div className="flex items-start mt-5">
                          <Badge className="mr-3 mt-1 bg-blue-600">2</Badge>
                          <div>
                            <p>Select the appropriate report template for your department</p>
                            <p className="text-sm text-gray-600 mt-2 bg-blue-50 p-2 rounded">Templates are pre-configured with required fields and formatting</p>
                          </div>
                        </div>
                        <div className="flex items-start mt-5">
                          <Badge className="mr-3 mt-1 bg-blue-600">3</Badge>
                          <div>
                            <p>Fill in the required data fields</p>
                            <p className="text-sm text-gray-600 mt-2 bg-blue-50 p-2 rounded">Fields marked with * are mandatory. Use the AI assistant for help with complex fields</p>
                          </div>
                        </div>
                      </div>
                      
                      <Separator className="my-6" />
                      
                      <div>
                        <h4 className="font-semibold text-lg mb-3 text-blue-700">Submitting Reports</h4>
                        <div className="flex items-start mt-4">
                          <Badge variant="secondary" className="mr-3 mt-1 bg-indigo-100 text-indigo-800">A</Badge>
                          <div>
                            <p>Before submission, use the <span className="font-medium text-blue-700">Validate</span> button to check for errors</p>
                            <p className="text-sm text-gray-600 mt-2 bg-indigo-50 p-2 rounded">The system will highlight incomplete fields or data inconsistencies</p>
                          </div>
                        </div>
                        <div className="flex items-start mt-5">
                          <Badge variant="secondary" className="mr-3 mt-1 bg-indigo-100 text-indigo-800">B</Badge>
                          <div>
                            <p>Add any necessary attachments using the <span className="font-medium text-blue-700">Add Documents</span> button</p>
                            <p className="text-sm text-gray-600 mt-2 bg-indigo-50 p-2 rounded">Supported file types: PDF, DOCX, XLSX, JPG, PNG</p>
                          </div>
                        </div>
                        <div className="flex items-start mt-5">
                          <Badge variant="secondary" className="mr-3 mt-1 bg-indigo-100 text-indigo-800">C</Badge>
                          <div>
                            <p>Select the appropriate approver from the dropdown menu</p>
                            <p className="text-sm text-gray-600 mt-2 bg-indigo-50 p-2 rounded">The system suggests approvers based on department and report type</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="analytics">
                <Card className="shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                    <CardTitle className="flex items-center text-blue-800">
                      <BarChart className="h-5 w-5 mr-2 text-blue-600" /> Real-Time Analytics Guide
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-lg mb-3 text-blue-700">Dashboard Overview</h4>
                        <div className="flex items-start mt-4">
                          <Badge className="mr-3 mt-1 bg-blue-600">1</Badge>
                          <div>
                            <p>Access the <span className="font-medium text-blue-700">Analytics Dashboard</span> from the main navigation menu</p>
                            <p className="text-sm text-gray-600 mt-2 bg-blue-50 p-2 rounded">The dashboard provides real-time data visualization of key metrics</p>
                          </div>
                        </div>
                        <div className="flex items-start mt-5">
                          <Badge className="mr-3 mt-1 bg-blue-600">2</Badge>
                          <div>
                            <p>Customize your dashboard using the <span className="font-medium text-blue-700">Add Widget</span> button</p>
                            <p className="text-sm text-gray-600 mt-2 bg-blue-50 p-2 rounded">Choose from various chart types and data sources</p>
                          </div>
                        </div>
                      </div>
                      
                      <Separator className="my-6" />
                      
                      <div>
                        <h4 className="font-semibold text-lg mb-3 text-blue-700">Data Analysis</h4>
                        <div className="flex items-start mt-4">
                          <Badge variant="secondary" className="mr-3 mt-1 bg-indigo-100 text-indigo-800">A</Badge>
                          <div>
                            <p>Use the <span className="font-medium text-blue-700">Filter</span> options to focus on specific data ranges</p>
                            <p className="text-sm text-gray-600 mt-2 bg-indigo-50 p-2 rounded">Filter by date range, department, or project status</p>
                          </div>
                        </div>
                        <div className="flex items-start mt-5">
                          <Badge variant="secondary" className="mr-3 mt-1 bg-indigo-100 text-indigo-800">B</Badge>
                          <div>
                            <p>Export data to Excel or PDF using the <span className="font-medium text-blue-700">Export</span> button</p>
                            <p className="text-sm text-gray-600 mt-2 bg-indigo-50 p-2 rounded">Customize export formats to match your reporting needs</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="documents">
                <Card className="shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                    <CardTitle className="flex items-center text-blue-800">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-blue-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                      </svg>
                      Document Management Guide
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-lg mb-3 text-blue-700">Uploading Documents</h4>
                        <div className="flex items-start mt-4">
                          <Badge className="mr-3 mt-1 bg-blue-600">1</Badge>
                          <div>
                            <p>Navigate to <span className="font-medium text-blue-700">Documents</span> &gt; <span className="font-medium text-blue-700">Upload New</span></p>
                            <p className="text-sm text-gray-600 mt-2 bg-blue-50 p-2 rounded">Supported formats: PDF, DOCX, XLSX, JPG, PNG (max 50MB)</p>
                          </div>
                        </div>
                        <div className="flex items-start mt-5">
                          <Badge className="mr-3 mt-1 bg-blue-600">2</Badge>
                          <div>
                            <p>Add metadata tags for easy searching and categorization</p>
                            <p className="text-sm text-gray-600 mt-2 bg-blue-50 p-2 rounded">Use relevant keywords and department codes</p>
                          </div>
                        </div>
                      </div>
                      
                      <Separator className="my-6" />
                      
                      <div>
                        <h4 className="font-semibold text-lg mb-3 text-blue-700">Document Security</h4>
                        <div className="flex items-start mt-4">
                          <Badge variant="secondary" className="mr-3 mt-1 bg-indigo-100 text-indigo-800">A</Badge>
                          <div>
                            <p>Set access permissions using the <span className="font-medium text-blue-700">Sharing Settings</span></p>
                            <p className="text-sm text-gray-600 mt-2 bg-indigo-50 p-2 rounded">Control who can view, edit, or download each document</p>
                          </div>
                        </div>
                        <div className="flex items-start mt-5">
                          <Badge variant="secondary" className="mr-3 mt-1 bg-indigo-100 text-indigo-800">B</Badge>
                          <div>
                            <p>Use version control to track document revisions</p>
                            <p className="text-sm text-gray-600 mt-2 bg-indigo-50 p-2 rounded">All changes are automatically saved with timestamps</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* FAQ Section */}
            <div className="mt-12">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h3>
              
              <Accordion type="single" collapsible className="w-full bg-white rounded-lg shadow-lg p-1">
                <AccordionItem value="item-1" className="border-b">
                  <AccordionTrigger className="hover:no-underline p-4 hover:bg-blue-50 rounded">
                    <div className="flex items-center">
                      <ChevronDown className="h-5 w-5 mr-3 text-blue-600 shrink-0 transition-transform duration-200" />
                      <span className="text-left font-medium">How do I reset my password?</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 pt-2 text-gray-700">
                    <p>To reset your password:</p>
                    <ol className="list-decimal pl-5 mt-2 space-y-2">
                      <li>Click on the "Forgot Password" link on the login page</li>
                      <li>Enter your registered email address</li>
                      <li>Check your email for a password reset link (valid for 1 hour)</li>
                      <li>Follow the instructions to create a new password</li>
                      <li>If you don't receive the email, check your spam folder or contact support</li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2" className="border-b">
                  <AccordionTrigger className="hover:no-underline p-4 hover:bg-blue-50 rounded">
                    <div className="flex items-center">
                      <ChevronDown className="h-5 w-5 mr-3 text-blue-600 shrink-0 transition-transform duration-200" />
                      <span className="text-left font-medium">How can I generate custom reports?</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 pt-2 text-gray-700">
                    Custom reports can be generated through the Reporting module:
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>Navigate to Reports → Custom Reports</li>
                      <li>Select the data fields you want to include</li>
                      <li>Apply filters and date ranges as needed</li>
                      <li>Choose your output format (PDF, Excel, or CSV)</li>
                      <li>Click "Generate Report"</li>
                    </ul>
                    <p className="mt-3">Saved custom report templates can be reused for future reports.</p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3" className="border-b">
                  <AccordionTrigger className="hover:no-underline p-4 hover:bg-blue-50 rounded">
                    <div className="flex items-center">
                      <ChevronDown className="h-5 w-5 mr-3 text-blue-600 shrink-0 transition-transform duration-200" />
                      <span className="text-left font-medium">What security measures are in place for sensitive documents?</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 pt-2 text-gray-700">
                    The DILG eGov Nexus implements multiple security measures:
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                      <Card className="border border-green-200">
                        <CardContent className="p-4">
                          <h4 className="font-semibold flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-green-600">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                            </svg>
                            Encryption
                          </h4>
                          <p className="text-sm mt-2">All documents are encrypted at rest and in transit using AES-256 encryption</p>
                        </CardContent>
                      </Card>
                      <Card className="border border-green-200">
                        <CardContent className="p-4">
                          <h4 className="font-semibold flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-green-600">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
                            </svg>
                            Access Control
                          </h4>
                          <p className="text-sm mt-2">Role-based access ensures only authorized personnel can view sensitive documents</p>
                        </CardContent>
                      </Card>
                      <Card className="border border-green-200">
                        <CardContent className="p-4">
                          <h4 className="font-semibold flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-green-600">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                            </svg>
                            Audit Trails
                          </h4>
                          <p className="text-sm mt-2">All document access and modifications are logged with timestamp and user information</p>
                        </CardContent>
                      </Card>
                      <Card className="border border-green-200">
                        <CardContent className="p-4">
                          <h4 className="font-semibold flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-green-600">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                            </svg>
                            Data Retention
                          </h4>
                          <p className="text-sm mt-2">Automated retention policies ensure documents are kept only for required periods</p>
                        </CardContent>
                      </Card>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* Contact Form */}
            <div className="mt-12">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Still need help? Contact us directly</h3>
              
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-bold mb-4">DILG eGov Nexus</h4>
              <p className="text-gray-400 text-sm">
                AI-Powered government management solution for Calapan LGUs, streamlining reporting, analytics, and document workflows.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white flex items-center"><ChevronRight className="h-4 w-4 mr-1" /> User Dashboard</a></li>
                <li><a href="#" className="hover:text-white flex items-center"><ChevronRight className="h-4 w-4 mr-1" /> Reporting Portal</a></li>
                <li><a href="#" className="hover:text-white flex items-center"><ChevronRight className="h-4 w-4 mr-1" /> Document Library</a></li>
                <li><a href="#" className="hover:text-white flex items-center"><ChevronRight className="h-4 w-4 mr-1" /> Analytics Hub</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white flex items-center"><ChevronRight className="h-4 w-4 mr-1" /> Knowledge Base</a></li>
                <li><a href="#" className="hover:text-white flex items-center"><ChevronRight className="h-4 w-4 mr-1" /> Training Materials</a></li>
                <li><a href="#" className="hover:text-white flex items-center"><ChevronRight className="h-4 w-4 mr-1" /> System Updates</a></li>
                <li><a href="#" className="hover:text-white flex items-center"><ChevronRight className="h-4 w-4 mr-1" /> API Documentation</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Contact</h4>
              <address className="text-gray-400 text-sm not-italic">
                <p className="flex items-start mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 mt-0.5 text-blue-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                  </svg>
                  <span>Calapan City Hall Complex<br />Calapan City, Oriental Mindoro</span>
                </p>
                <p className="flex items-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-blue-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                  </svg>
                  <span>(043) 288 - 7000</span>
                </p>
                <p className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-blue-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>
                  <span>matbalinton@gmail.com</span>
                </p>
              </address>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-500 text-sm">
            <p>© 2025 DILG eGov Nexus. All rights reserved. | Department of the Interior and Local Government - Calapan City</p>
          </div>
        </div>
      </footer>
    </div>
  )
}