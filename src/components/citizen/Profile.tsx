import { useState, useEffect } from 'react';
import { 
  User, Phone, MapPin, Briefcase, 
  Shield, Camera, Loader2, Check, RefreshCw,
  CheckCircle2, ArrowLeft, Settings, Edit3,
  Mail, Building
} from 'lucide-react';

const validateProfileForm = (data) => {
  const errors = {};
  
  if (!data.firstName || data.firstName.length < 2) {
    errors.firstName = "First name must be at least 2 characters";
  }
  if (!data.lastName || data.lastName.length < 2) {
    errors.lastName = "Last name must be at least 2 characters";
  }
  if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) {
    errors.email = "Please enter a valid email";
  }
  if (!data.phoneNumber || !/^\d{11}$/.test(data.phoneNumber)) {
    errors.phoneNumber = "Invalid Philippine phone number";
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [formData, setFormData] = useState({
    firstName: localStorage.getItem("firstName") || "",
    lastName: localStorage.getItem("lastName") || "",
    email: localStorage.getItem("adminEmail") || "", 
    phoneNumber: localStorage.getItem("phoneNumber") || "",
  });
  const [errors, setErrors] = useState({});

  const userId = localStorage.getItem('userId');

  // Your original API setup (simulated for demo)
  const api = {
    put: async (url, data) => {
      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ data: data });
        }, 2000);
      });
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    const validation = validateProfileForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.put(`/account/profile/${userId}`, formData);
      
      const updatedUser = response.data;
      
      localStorage.setItem("firstName", updatedUser.firstName);
      localStorage.setItem("lastName", updatedUser.lastName);
      localStorage.setItem("phoneNumber", updatedUser.phoneNumber);

      // Show success toast (you'd integrate with react-hot-toast here)
      console.log('Profile updated successfully!');

      // Reset form with updated data
      setFormData(updatedUser);

    } catch (error) {
      console.error('Update error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update profile';
      console.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: localStorage.getItem("firstName") || "",
      lastName: localStorage.getItem("lastName") || "",
      email: localStorage.getItem("adminEmail") || "", 
      phoneNumber: localStorage.getItem("phoneNumber") || "",
    });
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-xl border-b border-gray-700/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <button 
              onClick={() => window.history.back()}
              className="group flex items-center gap-3 text-gray-300 hover:text-white transition-all duration-200 hover:bg-gray-700/50 px-3 py-2 rounded-lg"
            >
              <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-200" />
              <span className="hidden sm:inline font-medium">Back to Dashboard</span>
            </button>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center ring-2 ring-blue-500/20">
                  <span className="text-sm font-bold text-white">
                    {localStorage.getItem('firstName')?.[0]}
                  </span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800"></div>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-white">
                  {localStorage.getItem('firstName')} {localStorage.getItem('lastName')}
                </p>
                <p className="text-xs text-gray-400">{localStorage.getItem('position')}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Profile Header Card */}
          <div className="bg-gradient-to-r from-gray-800/90 to-gray-700/90 backdrop-blur-xl rounded-2xl border border-gray-600/30 p-8 shadow-2xl">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              {/* Avatar Section */}
              <div className="relative group">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 p-1">
                  <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center overflow-hidden">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl font-bold text-white">
                        {localStorage.getItem('firstName')?.[0]}{localStorage.getItem('lastName')?.[0]}
                      </span>
                    )}
                  </div>
                </div>
                <label className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer">
                  <Camera className="w-8 h-8 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              </div>
              
              {/* User Info */}
              <div className="text-center lg:text-left flex-1">
                <h1 className="text-4xl font-bold text-white mb-2">
                  {localStorage.getItem('firstName')} {localStorage.getItem('lastName')}
                </h1>
                <p className="text-xl text-blue-400 mb-4">{localStorage.getItem('position') || "Resident"}</p>
                <div className="flex flex-wrap justify-center lg:justify-start gap-4 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {localStorage.getItem('adminEmail')}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {localStorage.getItem('barangay') || "Unknown"}
                  </div>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="flex gap-3">
                <button className="p-3 bg-gray-700/50 hover:bg-gray-600/50 rounded-xl transition-colors">
                  <Settings className="w-5 h-5 text-gray-300" />
                </button>
                <button className="p-3 bg-blue-600/20 hover:bg-blue-600/30 rounded-xl transition-colors">
                  <Edit3 className="w-5 h-5 text-blue-400" />
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-600/30 p-6 hover:bg-gray-800/70 transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400 group-hover:scale-110 transition-transform">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                      Position
                    </p>
                    <p className="text-lg font-semibold text-white">
                      {localStorage.getItem("position") || "Resident"}
                    </p>
                  </div>
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-600/30 p-6 hover:bg-gray-800/70 transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-500/20 rounded-xl text-green-400 group-hover:scale-110 transition-transform">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                      Barangay
                    </p>
                    <p className="text-lg font-semibold text-white">
                      {localStorage.getItem("barangay") || "Unknown"}
                    </p>
                  </div>
                </div>
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-600/30 shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600/10 to-indigo-600/10 px-8 py-6 border-b border-gray-600/30">
              <h2 className="text-2xl font-bold text-white mb-2">Profile Settings</h2>
              <p className="text-gray-400">Manage your personal information and account preferences</p>
            </div>

            <div className="p-8">
              <div onSubmit={onSubmit} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                      <User className="w-4 h-4 text-gray-400" />
                      First Name
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                      placeholder="Juan"
                    />
                    {errors.firstName && (
                      <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                      <User className="w-4 h-4 text-gray-400" />
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                      placeholder="Dela Cruz"
                    />
                    {errors.lastName && (
                      <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                      <Shield className="w-4 h-4 text-gray-400" />
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={formData.email}
                        disabled
                        className="w-full px-4 py-3 bg-gray-700/30 border border-gray-600/30 rounded-xl text-gray-400 cursor-not-allowed pr-20"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium bg-gray-600/50 px-2 py-1 rounded-md text-gray-300">
                        Read Only
                      </span>
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                      <Phone className="w-4 h-4 text-gray-400" />
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                      placeholder="09XXXXXXXXX"
                    />
                    {errors.phoneNumber && (
                      <p className="text-red-400 text-xs mt-1">{errors.phoneNumber}</p>
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-600/30 my-8"></div>

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 rounded-xl transition-all duration-200 font-medium border border-gray-600/30"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Reset Changes
                  </button>
                  
                  <button
                    type="submit"
                    onClick={onSubmit}
                    disabled={isLoading}
                    className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-blue-600/50 disabled:to-indigo-600/50 text-white rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-blue-500/25 disabled:cursor-not-allowed"
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
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;