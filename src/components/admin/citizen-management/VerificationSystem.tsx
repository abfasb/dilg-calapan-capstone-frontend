import * as React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Send, 
  User, 
  Phone, 
  MoreVertical, 
  Clock, 
  Filter, 
  Paperclip, 
  ChevronDown, 
  Smile, 
  MessageSquare, 
  Bell, 
  Users,
  CheckCircle2
} from 'lucide-react';

// Sample data
const conversations = [
  { 
    id: 1,
    name: "John Doe",
    lastMessage: "Need help with tax filing",
    timestamp: "10:30 AM",
    unread: 2,
    avatar: "",
    status: "active",
    priority: "high",
    messages: [
      { id: 1, text: "Hello, I need help with my tax filing.", sender: "user", timestamp: "10:30 AM", read: true },
      { id: 2, text: "Sure, could you share your citizen ID?", sender: "admin", timestamp: "10:31 AM", read: true },
      { id: 3, text: "My ID is 987-65-4321", sender: "user", timestamp: "10:33 AM", read: true },
      { id: 4, text: "Thank you. I'll look up your information. Which tax year are you inquiring about?", sender: "admin", timestamp: "10:35 AM", read: false },
    ]
  },
  { 
    id: 2,
    name: "Jane Smith",
    lastMessage: "Question about public services",
    timestamp: "9:45 AM",
    unread: 0,
    avatar: "",
    status: "active",
    priority: "medium",
    messages: [
      { id: 1, text: "How do I apply for housing subsidy?", sender: "user", timestamp: "9:45 AM", read: true },
      { id: 2, text: "You can apply through our online portal. Would you like me to guide you through the process?", sender: "admin", timestamp: "9:47 AM", read: true },
      { id: 3, text: "Yes, please. I'm a bit confused about the requirements.", sender: "user", timestamp: "9:50 AM", read: true },
    ]
  },
  { 
    id: 3,
    name: "Robert Johnson",
    lastMessage: "Business permit renewal",
    timestamp: "Yesterday",
    unread: 1,
    avatar: "",
    status: "away",
    priority: "low",
    messages: [
      { id: 1, text: "I need information about renewing my business permit.", sender: "user", timestamp: "Yesterday", read: true },
      { id: 2, text: "I'll be happy to help with that. What type of business do you operate?", sender: "admin", timestamp: "Yesterday", read: true },
    ]
  },
  { 
    id: 4,
    name: "Emily Davis",
    lastMessage: "Property tax inquiry",
    timestamp: "Yesterday",
    unread: 0,
    avatar: "",
    status: "offline",
    priority: "medium",
    messages: [
      { id: 1, text: "I believe there's an error in my property tax assessment.", sender: "user", timestamp: "Yesterday", read: true },
    ]
  },
];

export function ChatSupport() {
  const [selectedConversation, setSelectedConversation] = React.useState(1);
  const [newMessage, setNewMessage] = React.useState('');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [currentTab, setCurrentTab] = React.useState('all');
  const [messages, setMessages] = React.useState([]);
  const messageEndRef = React.useRef(null);

  React.useEffect(() => {
    if (selectedConversation) {
      const convo = conversations.find(c => c.id === selectedConversation);
      if (convo) {
        setMessages(convo.messages);
      }
    }
  }, [selectedConversation]);

  React.useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg = {
        id: messages.length + 1,
        text: newMessage,
        sender: 'admin',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: true
      };
      
      setMessages(prev => [...prev, newMsg]);
      setNewMessage('');
    }
  };

  const filteredConversations = conversations.filter(convo => {
    // Filter by search query
    const matchesSearch = searchQuery.trim() === '' || 
      convo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      convo.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by tab
    const matchesTab = currentTab === 'all' || 
      (currentTab === 'unread' && convo.unread > 0) ||
      (currentTab === 'priority' && convo.priority === 'high');
    
    return matchesSearch && matchesTab;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getPriorityBadge = (priority) => {
    switch(priority) {
      case 'high': return <Badge variant="destructive">High Priority</Badge>;
      case 'medium': return <Badge variant="default">Medium</Badge>;
      case 'low': return <Badge variant="outline">Low</Badge>;
      default: return null;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
      {/* Sidebar */}
      <div className="w-96 border-r border-slate-200 dark:border-slate-800 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              <h1 className="text-xl font-bold">Citizen Support</h1>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Users className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              className="pl-9 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="w-full" onValueChange={setCurrentTab}>
          <div className="px-4 pt-2 bg-white dark:bg-slate-950">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">Unread</TabsTrigger>
              <TabsTrigger value="priority">Priority</TabsTrigger>
            </TabsList>
          </div>
        </Tabs>

        {/* Filter bar */}
        <div className="px-4 py-2 flex items-center justify-between bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
          <Button variant="ghost" size="sm" className="text-sm flex items-center gap-1">
            <Filter className="h-3 w-3" />
            Filter
            <ChevronDown className="h-3 w-3 ml-1" />
          </Button>
          <span className="text-sm text-muted-foreground">{filteredConversations.length} conversations</span>
        </div>

        {/* Conversation List */}
        <ScrollArea className="flex-1 bg-white dark:bg-slate-950">
          {filteredConversations.map((convo) => (
            <div
              key={convo.id}
              onClick={() => setSelectedConversation(convo.id)}
              className={`flex items-center p-4 border-b border-slate-100 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors ${
                selectedConversation === convo.id ? 'bg-slate-100 dark:bg-slate-800' : ''
              }`}
            >
              <div className="relative">
                <Avatar className="h-12 w-12 border border-slate-200 dark:border-slate-700">
                  <AvatarImage src={convo.avatar} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {convo.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-slate-950 ${getStatusColor(convo.status)}`}></span>
              </div>
              <div className="ml-4 flex-1 overflow-hidden">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{convo.name}</h3>
                  <span className="text-xs text-muted-foreground flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {convo.timestamp}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground truncate mt-1">
                  {convo.lastMessage}
                </p>
                <div className="flex items-center justify-between mt-1">
                  {getPriorityBadge(convo.priority)}
                  {convo.unread > 0 && (
                    <Badge variant="default" className="bg-primary">
                      {convo.unread}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={conversations.find(c => c.id === selectedConversation)?.avatar} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {conversations.find(c => c.id === selectedConversation)?.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-semibold">{conversations.find(c => c.id === selectedConversation)?.name}</h2>
                      <span className={`h-2 w-2 rounded-full ${getStatusColor(conversations.find(c => c.id === selectedConversation)?.status)}`}></span>
                    </div>
                    <p className="text-sm text-muted-foreground">Case ID: CS-{1000 + selectedConversation}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <CheckCircle2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Chat Messages */}
            <ScrollArea className="flex-1 p-6 bg-slate-50 dark:bg-slate-900">
              <div className="max-w-3xl mx-auto space-y-6">
                {messages.map((msg, index) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'} gap-3`}
                  >
                    {msg.sender === 'user' && (
                      <Avatar className="h-8 w-8 mt-1">
                        <AvatarFallback className="bg-slate-300 text-slate-600 text-xs">
                          {conversations.find(c => c.id === selectedConversation)?.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`max-w-md rounded-2xl p-4 ${
                        msg.sender === 'admin'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-white dark:bg-slate-800 shadow-sm'
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <div className={`flex items-center justify-end gap-1 mt-1 text-xs ${
                        msg.sender === 'admin' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                      }`}>
                        {msg.timestamp}
                        {msg.sender === 'admin' && msg.read && (
                          <CheckCircle2 className="h-3 w-3" />
                        )}
                      </div>
                    </div>
                    {msg.sender === 'admin' && (
                      <Avatar className="h-8 w-8 mt-1">
                        <AvatarFallback className="bg-primary/20 text-primary text-xs">
                          AG
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                <div ref={messageEndRef} />
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4">
              <div className="max-w-3xl mx-auto">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Paperclip className="h-5 w-5" />
                  </Button>
                  <div className="flex-1 relative">
                    <Input
                      placeholder="Type your message..."
                      className="pr-10 py-6 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-full"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyUp={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full">
                      <Smile className="h-5 w-5 text-muted-foreground" />
                    </Button>
                  </div>
                  <Button onClick={handleSendMessage} size="lg" className="rounded-full px-6">
                    <Send className="h-4 w-4 mr-2" />
                    Send
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900">
            <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No conversation selected</h2>
            <p className="text-muted-foreground">Select a conversation from the list to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatSupport;