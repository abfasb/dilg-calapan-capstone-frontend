  import { useState } from 'react';
  import { Button } from "../ui/button"
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
  import { Calendar, MapPin, Users, Clock, Edit, Trash2, Settings, Archive, ClipboardList, Plus, X } from "lucide-react"
  import { Badge } from "../ui/badge"
  import { Progress } from "../ui/progress"
  import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogClose } from "../ui/dialog"

  interface Event {
    id: number;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    status: 'draft' | 'published';
    attendees?: number;
    capacity?: number;
  }

  const LGUEventManagement = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [eventTitle, setEventTitle] = useState("");
    const [eventDescription, setEventDescription] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [eventTime, setEventTime] = useState("");
    const [eventLocation, setEventLocation] = useState("TBA");
    const [events, setEvents] = useState<Event[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    // Form Submission
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      const newEvent: Event = {
        id: Date.now(),
        title: eventTitle,
        description: eventDescription,
        date: eventDate,
        time: eventTime,
        location: eventLocation,
        status: 'draft',
        capacity: 100
      };

      setEvents([...events, newEvent]);
      resetForm();
      setIsDialogOpen(false);
    };

    // Open Edit Dialog
    const openEditDialog = (event: Event) => {
      setSelectedEvent(event);
      setEventTitle(event.title);
      setEventDescription(event.description);
      setEventDate(event.date);
      setEventTime(event.time);
      setEventLocation(event.location);
      setIsEditDialogOpen(true);
    };

    // Edit Event Submission
    const handleEditSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedEvent) return;

      const updatedEvents = events.map(event => 
        event.id === selectedEvent.id ? { 
          ...event, 
          title: eventTitle,
          description: eventDescription,
          date: eventDate,
          time: eventTime,
          location: eventLocation
        } : event
      );

      setEvents(updatedEvents);
      setIsEditDialogOpen(false);
      resetForm();
    };

    // Delete Event
    const handleDelete = () => {
      if (!selectedEvent) return;
      setEvents(events.filter(event => event.id !== selectedEvent.id));
      setIsDeleteDialogOpen(false);
    };

    // Reset Form
    const resetForm = () => {
      setEventTitle("");
      setEventDescription("");
      setEventDate("");
      setEventTime("");
      setEventLocation("TBA");
      setSelectedEvent(null);
    };

    // Format date display
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return {
        month: date.toLocaleString('default', { month: 'short' }).toUpperCase(),
        day: date.getDate()
      };
    };

    return (
      <div className="space-y-8 p-6 bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              LGU Event Management
            </h1>
            <p className="text-gray-400 mt-2">Administer and monitor community events</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg rounded-xl px-5 py-3">
                <Plus size={18} />
                Create New Event
              </Button>
            </DialogTrigger>
            
            <DialogContent className="bg-gray-900 border border-gray-700 rounded-2xl shadow-xl p-6">
              <DialogHeader>
                <DialogTitle className="text-2xl text-gray-100">Create New Event</DialogTitle>
              </DialogHeader>

              <DialogClose className="absolute top-4 right-4 text-gray-400 hover:text-red-400 hover:bg-gray-700 p-2 rounded-full transition">
                <X size={22} />
              </DialogClose>

              <form onSubmit={handleSubmit} className="space-y-5">
                <input 
                  placeholder="Event Title" 
                  className="w-full p-4 rounded-lg bg-gray-800 border border-gray-600 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  required
                />

                <textarea
                  placeholder="Event Description"
                  className="w-full p-4 rounded-lg bg-gray-800 border border-gray-600 text-gray-300 h-36 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  required
                />

                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="date" 
                    className="p-4 rounded-lg bg-gray-800 border border-gray-600 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    required
                  />
                  <input 
                    type="time" 
                    className="p-4 rounded-lg bg-gray-800 border border-gray-600 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    required
                  />
                </div>

                <input
                  placeholder="Location"
                  className="w-full p-4 rounded-lg bg-gray-800 border border-gray-600 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                  required
                />

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 shadow-lg py-3 text-lg rounded-xl"
                >
                  Publish Event
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Management Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Dashboard cards remain the same */}
        </div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Calendar className="w-6 h-6 text-purple-400" />
                  Managed Events
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Event Card - Draft */}
                <div className="group relative p-6 rounded-xl bg-gray-700/30 border-2 border-dashed border-gray-600">
                  <div className="flex gap-4">
                    <div className="w-32 h-32 bg-gray-600/50 rounded-lg flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-400">SEP</span>
                      <span className="text-4xl font-bold absolute text-gray-400">05</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold">Cultural Heritage Week</h3>
                        <Badge variant="outline" className="border-gray-400 text-gray-400">
                          Draft
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400 mb-3">
                        <MapPin size={16} />
                        <span>City Plaza • 3:00 PM</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>Not published yet</span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-purple-400">
                      <Edit size={16} />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-400">
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>

                {/* Event Card - Active */}
                <div className="group relative p-6 rounded-xl bg-gray-700/30 hover:bg-gray-700/50 transition-all duration-300 border border-transparent hover:border-purple-500/30">
                  <div className="flex gap-4">
                    <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                      <span className="text-2xl font-bold">AUG</span>
                      <span className="text-4xl font-bold absolute">15</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold">Community Clean-Up Day</h3>
                        <Badge variant="outline" className="border-green-400 text-green-400">
                          Published
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400 mb-3">
                        <MapPin size={16} />
                        <span>Central Park • 9:00 AM</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Users size={16} />
                          128 Registered
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={16} />
                          4 hours
                        </div>
                      </div>
                      <Progress value={75} className="h-2 mt-4 bg-gray-600" />
                      <div className="flex justify-between text-xs mt-1">
                        <span>75/100 capacity</span>
                        <span className="text-purple-400">High demand</span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Button variant="ghost" size="sm" className="text-purple-400">
                      <Edit size={16} />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-400">
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardContent className="space-y-6">
                {events.map((event) => {
                  const formattedDate = formatDate(event.date);
                  const progressValue = event.capacity && event.attendees 
                    ? (event.attendees / event.capacity) * 100 
                    : 0;

                  return (
                    <div key={event.id} className="group relative p-6 rounded-xl bg-gray-700/30 hover:bg-gray-700/50 transition-all duration-300 border border-transparent hover:border-purple-500/30">
                      <div className="flex gap-4">
                        <div className={`w-32 h-32 rounded-lg flex items-center justify-center ${
                          event.status === 'published' 
                            ? 'bg-gradient-to-br from-purple-500 to-blue-500' 
                            : 'bg-gray-600/50'
                        }`}>
                          <span className="text-2xl font-bold">
                            {formattedDate.month}
                          </span>
                          <span className="text-4xl font-bold absolute">
                            {formattedDate.day}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold">{event.title}</h3>
                            <Badge variant="outline" className={
                              event.status === 'published' 
                                ? 'border-green-400 text-green-400' 
                                : 'border-gray-400 text-gray-400'
                            }>
                              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-gray-400 mb-3">
                            <MapPin size={16} />
                            <span>{event.location} • {event.time}</span>
                          </div>
                          {event.status === 'published' && (
                            <>
                              <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                  <Users size={16} />
                                  {event.attendees || 0} Registered
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock size={16} />
                                  4 hours
                                </div>
                              </div>
                              <Progress value={progressValue} className="h-2 mt-4 bg-gray-600" />
                              <div className="flex justify-between text-xs mt-1">
                                <span>{event.attendees || 0}/{event.capacity} capacity</span>
                                <span className="text-purple-400">
                                  {progressValue >= 75 ? 'High demand' : 'Available'}
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="absolute top-4 right-4 flex gap-2">
                        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-purple-400 hover:text-purple-300"
                              onClick={() => openEditDialog(event)}
                            >
                              <Edit size={16} />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-gray-900 border border-gray-700 rounded-2xl">
                            <DialogHeader>
                              <DialogTitle className="text-2xl">Edit Event</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleEditSubmit} className="space-y-5">
                              <input 
                                placeholder="Event Title" 
                                className="w-full p-4 rounded-lg bg-gray-800 border border-gray-600 text-gray-300"
                                value={eventTitle}
                                onChange={(e) => setEventTitle(e.target.value)}
                                required
                              />
                              <textarea
                                placeholder="Event Description"
                                className="w-full p-4 rounded-lg bg-gray-800 border border-gray-600 text-gray-300 h-32"
                                value={eventDescription}
                                onChange={(e) => setEventDescription(e.target.value)}
                                required
                              />
                              <div className="grid grid-cols-2 gap-4">
                                <input 
                                  type="date" 
                                  className="p-4 rounded-lg bg-gray-800 border border-gray-600 text-gray-300"
                                  value={eventDate}
                                  onChange={(e) => setEventDate(e.target.value)}
                                  required
                                />
                                <input 
                                  type="time" 
                                  className="p-4 rounded-lg bg-gray-800 border border-gray-600 text-gray-300"
                                  value={eventTime}
                                  onChange={(e) => setEventTime(e.target.value)}
                                  required
                                />
                              </div>
                              <input
                                placeholder="Location"
                                className="w-full p-4 rounded-lg bg-gray-800 border border-gray-600 text-gray-300"
                                value={eventLocation}
                                onChange={(e) => setEventLocation(e.target.value)}
                                required
                              />
                              <Button 
                                type="submit" 
                                className="w-full bg-gradient-to-r from-purple-500 to-blue-500"
                              >
                                Save Changes
                              </Button>
                            </form>
                          </DialogContent>
                        </Dialog>

                        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-400 hover:text-red-300"
                              onClick={() => setSelectedEvent(event)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-gray-900 border border-gray-700 rounded-2xl">
                            <DialogHeader>
                              <DialogTitle className="text-2xl">Delete Event</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <p className="text-gray-300">
                                Are you sure you want to delete "{selectedEvent?.title}"?
                              </p>
                              <div className="flex gap-2 justify-end">
                                <Button 
                                  variant="outline" 
                                  onClick={() => setIsDeleteDialogOpen(false)}
                                >
                                  Cancel
                                </Button>
                                <Button 
                                  variant="destructive"
                                  onClick={handleDelete}
                                >
                                  Delete Event
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  )}
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6 h-full">
            <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg">Event Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Registration Rate</span>
                    <span className="text-purple-400">+24%</span>
                  </div>
                  <Progress value={75} className="h-2 bg-gray-600" />
                  
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-gray-400">Avg. Attendance</span>
                    <span className="text-blue-400">82%</span>
                  </div>
                  <Progress value={82} className="h-2 bg-gray-600" />
                  
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-gray-400">New Participants</span>
                    <span className="text-green-400">45%</span>
                  </div>
                  <Progress value={45} className="h-2 bg-gray-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  export default LGUEventManagement