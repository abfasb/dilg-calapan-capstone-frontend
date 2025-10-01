"use client"

import { useState, useCallback } from "react"
import { z } from 'zod'
import { toast, Toaster } from 'react-hot-toast'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid'
import { AiOutlineClose } from 'react-icons/ai'
import { useDebouncedCallback } from 'use-debounce'

const lguSchema = z.object({
  firstName: z.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name too long')
    .regex(/^[A-Za-z\s]+$/, 'Only letters allowed'),
  lastName: z.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name too long')
    .regex(/^[A-Za-z\s]+$/, 'Only letters allowed'),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
  position: z.string().min(1, 'Please select your position'),
  phoneNumber: z.string()
    .min(9, 'Invalid phone number')
    .regex(/^9\d{9}$/, 'Must start with 9 and have 10 digits'),
  terms: z.boolean().refine(val => val, 'You must accept the terms'),
});

const initialFormState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  position: "",
  phoneNumber: "",
  terms: false,
};

function LGURegistration() {
  const [formData, setFormData] = useState(initialFormState);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debouncedValidate = useDebouncedCallback((field: string, value: any) => {
    validateField(field, value);
  }, 500);

  const validateField = useCallback(async (field: string, value: any) => {
    try {
      const fieldSchema = (lguSchema as any).pick({ [field]: true });
      await fieldSchema.parseAsync({ [field]: value });
      setErrors(prev => ({ ...prev, [field]: '' }));
    } catch (err) {
      if (err instanceof z.ZodError) {
        setErrors(prev => ({ ...prev, [field]: err.errors[0].message }));
      }
    }
  }, []);

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'terms') {
      validateField(field, value);
      return;
    }

    debouncedValidate(field, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const validation = lguSchema.safeParse(formData);
      if (!validation.success) {
        const errorMap: Record<string, string> = {};
        validation.error.issues.forEach(err => {
          errorMap[err.path[0]] = err.message;
        });
        setErrors(errorMap);
        toast.error('Please fix form errors');
        return;
      }
  
      const response = await fetch(`${import.meta.env.VITE_API_URL}/lgu/pendingLgus`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },  
        body: JSON.stringify(formData)
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        if (data.field) {
          setErrors(prev => ({ ...prev, [data.field]: data.message }));
        }
        throw new Error(data.message);
      }
  
      toast.success('Registration submitted for admin approval!');
      setFormData(initialFormState);
      setErrors({});
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Registration failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <div className="relative flex flex-col p-8 bg-[#1a1d24] text-white md:p-12 lg:p-16">
        <img 
          src="https://i.ibb.co/pvVzXYRv/images-1-removebg-preview-1.png" 
          alt="DILG Logo" 
          className="absolute left-20 top-20 inset-0 w-[70%] h-[70%] object-cover ml-8 mt-8 opacity-5 pointer-events-none"
        />
        <div className="relative max-w-md mx-auto w-full z-10">
          <h1 className="text-2xl font-semibold mb-8">LGU Official Registration</h1>
          <div className="toast-wrapper">
            <Toaster
              position="top-right"
              gutter={32}
              containerClassName="!top-10 !right-6"
              toastOptions={{
                className: '!bg-white !text-black !rounded-xl !border !border-[#2a2f38]',
              }}
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-400">First Name</label>
                <input
                  type="text"
                  placeholder="Juan"
                  className={`w-full px-3 py-2 rounded-lg bg-[#2a2f38] text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 ${
                    errors.firstName ? 'focus:ring-red-500' : 'focus:ring-blue-500'
                  }`}
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                />
                {errors.firstName && <p className="text-red-400 text-sm mt-1">{errors.firstName}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Last Name</label>
                <input
                  type="text"
                  placeholder="Dela Cruz"
                  className={`w-full px-3 py-2 rounded-lg bg-[#2a2f38] text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 ${
                    errors.lastName ? 'focus:ring-red-500' : 'focus:ring-blue-500'
                  }`}
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                />
                {errors.lastName && <p className="text-red-400 text-sm mt-1">{errors.lastName}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-400">Position</label>
              <select
                className={`w-full px-3 py-2 rounded-lg bg-[#2a2f38] text-white focus:outline-none focus:ring-2 ${
                  errors.position ? 'focus:ring-red-500' : 'focus:ring-blue-500'
                }`}
                value={formData.position}
                onChange={(e) => handleChange('position', e.target.value)}
              >
                <option value="">Select Position</option>
                <option value="Department Head">Department Head</option>
                <option value="Administrative Officer">Administrative Officer</option>
                <option value="Field Supervisor">Field Supervisor</option>
                <option value="Executive Assistant">Executive Assistant</option>
                <option value="LGU Secretary">LGU Secretary</option>
              </select>
              {errors.position && <p className="text-red-400 text-sm mt-1">{errors.position}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-400">Phone Number</label>
              <div className={`flex items-center w-full px-3 py-2 rounded-lg bg-[#2a2f38] ${
                errors.phoneNumber ? 'ring-2 ring-red-500' : 'focus-within:ring-2 focus-within:ring-blue-500'
              }`}>
                <span className="text-gray-300 pr-4">+63</span>
                <input
                  type="tel"
                  placeholder="912 345 6789"
                  className="w-full bg-transparent outline-none placeholder:text-gray-500"
                  value={formData.phoneNumber}
                  onChange={(e) => handleChange('phoneNumber', e.target.value)}
                />
              </div>
              {errors.phoneNumber && <p className="text-red-400 text-sm mt-1">{errors.phoneNumber}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-400">Email</label>
              <input
                type="email"
                placeholder="official@lgu.gov.ph"
                className={`w-full px-3 py-2 rounded-lg bg-[#2a2f38] text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 ${
                  errors.email ? 'focus:ring-red-500' : 'focus:ring-blue-500'
                }`}
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
              {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-400">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`w-full px-3 py-2 rounded-lg bg-[#2a2f38] text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 ${
                    errors.password ? 'focus:ring-red-500' : 'focus:ring-blue-500'
                  }`}
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-blue-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-6 h-6" />
                  ) : (
                    <EyeIcon className="w-6 h-6" />
                  )}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={formData.terms}
                  onChange={(e) => handleChange('terms', e.target.checked)}
                  className={`mt-1 w-5 h-5 rounded bg-[#2a2f38] border-none ${errors.terms ? 'ring-2 ring-red-500' : ''}`}
                />
                <label htmlFor="terms" className="text-sm text-gray-400">
                  I certify that I am an authorized LGU official and agree to the{" "}
                  <button type="button" onClick={() => setOpen(true)} className="text-[#3b82f6] hover:underline">
                    Terms of Service
                  </button>
                </label>
              </div>
              {errors.terms && <p className="text-red-400 text-sm -mt-2">{errors.terms}</p>}
            </div>

            {open && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
                <div className="bg-white w-full p-8 rounded-xl shadow-xl w-96 relative max-w-lg mx-auto">
                  <button
                    onClick={() => setOpen(false)}
                    className="absolute top-4 right-4 text-gray-700 hover:text-gray-900 text-2xl"
                  >
                    <AiOutlineClose />
                  </button>
                  
                  <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
                    LGU Terms of Service
                  </h2>
                  
                  <p className="text-sm text-gray-700 leading-relaxed mb-6">
                    Welcome to the DILG eGov Nexus platform for Local Government Units. By using this service, you agree to our specialized terms and conditions for government officials.
                  </p>

                  <div className="space-y-4 text-sm text-gray-600">
                    <p><strong>1. Official Use Only:</strong> This platform is strictly for authorized LGU personnel handling official government business.</p>
                    <p><strong>2. Data Integrity:</strong> You are responsible for maintaining accurate records and complying with government data policies.</p>
                    <p><strong>3. Security Protocols:</strong> All sensitive information must be handled according to national cybersecurity guidelines.</p>
                    <p><strong>4. Audit Compliance:</strong> Maintain proper documentation for all transactions and decisions made through this platform.</p>
                  </div>
                </div>
              </div>
            )}
            
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full px-4 py-2.5 text-sm font-medium text-white bg-[#3b82f6] rounded-lg transition-all ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                  Submitting...
                </div>
              ) : (
                'Request LGU Account'
              )}
            </button>
          </form>
        </div>
      </div>

      <div className="hidden md:flex flex-col items-start justify-center p-12 bg-center bg-cover bg-opacity-10 text-white lg:p-16"
       style={{  backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5)), url('https://i.ibb.co/Xrcwr3fm/474975489-624902033229226-8762022534966171083-n.jpg')" }}>
        <div className="max-w-md">
            <h2 className="text-4xl font-bold mb-6 lg:text-5xl">LGU Governance Suite</h2>
            <p className="text-lg mb-8 text-blue-100">
              Advanced tools for local government management, public service coordination, 
              and transparent municipal operations.
            </p>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[
                  "https://i.ibb.co/sJcshyZp/images-6.jpg",
                  "https://i.ibb.co/5hfsr081/png-clipart-executive-departments-of-the-philippines-department-of-health-health-care-public-health.png",
                  "https://i.ibb.co/cXFFTW7S/Logo-Philippines-DFA.jpg",
                ].map((logo, index) => (
                  <img key={index} src={logo} alt={`Logo ${index + 1}`} className="w-10 h-10 rounded-full border-2 border-blue-500 bg-blue-400" />
                ))}
              </div>
              <p className="text-blue-100">
                Empowering <span className="font-semibold">15 Municipalities</span> in Oriental Mindoro
              </p>
            </div>
          </div>
      </div>
    </div>
  )
}

export default LGURegistration;