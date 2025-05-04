import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '../ui/card';
import { 
  User, Phone, MapPin, Briefcase, 
  Shield, Camera, Loader2, Check, RefreshCw,
  CheckCircle2
} from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';

const profileFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email(),
  phoneNumber: z.string().regex(/^\d{11}$/, "Invalid Philippine phone number"),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: localStorage.getItem("firstName") || "",
      lastName: localStorage.getItem("lastName") || "",
      email: localStorage.getItem("adminEmail") || "", 
      phoneNumber: localStorage.getItem("phoneNumber") || "",
    }
  });

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    setIsLoading(true);
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/account/profile`,
        data
      );
      
      const updatedUser = response.data;
      
      // Update local storage
      localStorage.setItem("firstName", updatedUser.firstName);
      localStorage.setItem("lastName", updatedUser.lastName);
      localStorage.setItem("phoneNumber", updatedUser.phoneNumber);

      toast.success('Profile updated successfully!', {
        duration: 4000,
        position: 'top-right'
      });

      form.reset(updatedUser);

    } catch (error: any) {
      console.error('Update error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update profile';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Toaster position="top-right" />

      {/* Header Section */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <Button 
            onClick={() => window.history.back()}
            variant="ghost"
            className="group flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 group-hover:-translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">Back to Dashboard</span>
          </Button>
          
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-blue-600">
                {localStorage.getItem('firstName')?.[0]}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {localStorage.getItem('firstName')} {localStorage.getItem('lastName')}
              </p>
              <p className="text-xs text-gray-500">{localStorage.getItem('position')}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="shadow-lg border-0 rounded-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b border-gray-100">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2 text-center md:text-left">
                  <CardTitle className="text-3xl font-bold text-gray-900">
                    Profile Settings
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Manage your personal information and account preferences
                  </CardDescription>
                </div>
                
                <div className="relative group">
                  <Avatar className="w-28 h-28 border-4 border-white shadow-lg">
                    <AvatarImage 
                      src={avatarPreview || localStorage.getItem("avatar") || undefined} 
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-gray-200 text-3xl font-bold text-gray-600">
                      {localStorage.getItem("firstName")?.[0]}
                      {localStorage.getItem("lastName")?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full">
                    <div className="flex flex-col items-center gap-1">
                      <Camera className="w-6 h-6 text-white" />
                      <span className="text-white text-xs font-medium">Change</span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-8 bg-white">
              {/* User Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
                      <Briefcase className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
                        Position
                      </p>
                      <p className="text-lg font-medium text-gray-900">
                        {localStorage.getItem("position") || "Resident"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 rounded-xl text-green-600">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
                        Barangay
                      </p>
                      <p className="text-lg font-medium text-gray-900">
                        {localStorage.getItem("barangay") || "Unknown"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* First Name */}
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <User className="w-4 h-4 text-gray-500" />
                            First Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Juan"
                            />
                          </FormControl>
                          <FormMessage className="text-red-500 text-xs mt-1" />
                        </FormItem>
                      )}
                    />

                    {/* Last Name */}
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <User className="w-4 h-4 text-gray-500" />
                            Last Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Dela Cruz"
                            />
                          </FormControl>
                          <FormMessage className="text-red-500 text-xs mt-1" />
                        </FormItem>
                      )}
                    />

                    {/* Email */}
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <Shield className="w-4 h-4 text-gray-500" />
                            Email Address
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                {...field}
                                disabled
                                className="bg-gray-50 border-gray-200 cursor-not-allowed pr-20"
                              />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium bg-gray-100 px-2 py-1 rounded text-gray-500">
                                Read Only
                              </span>
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {/* Phone Number */}
                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <Phone className="w-4 h-4 text-gray-500" />
                            Phone Number
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="09XXXXXXXXX"
                            />
                          </FormControl>
                          <FormMessage className="text-red-500 text-xs mt-1" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="border-t border-gray-200 my-8" />

                  {/* Form Actions */}
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => form.reset()}
                      className="w-full sm:w-auto gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Reset Changes
                    </Button>
                    <Button
                      type="submit"
                      className="w-full sm:w-auto gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default Profile;