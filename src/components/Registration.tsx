// components/Registration.tsx
"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { z } from 'zod'
import { toast, Toaster } from 'react-hot-toast'
import barangays from '../types/barangays'
import { registerUser, sendOTP, verifyOTP } from "../api/registrationApi"
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid'
import { useNavigate } from "react-router-dom"
import { useDebouncedCallback } from 'use-debounce';

const baseSchema = z.object({
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
  confirmPassword: z.string(),
  barangay: z.string().min(1, 'Please select your barangay'),
  phoneNumber: z.string()
    .min(10, 'Invalid phone number')
    .regex(/^9\d{9}$/, 'Must start with 9 and have 10 digits'),
  terms: z.boolean().refine(val => val, 'You must accept the terms'),
  newsletter: z.boolean()
});

const passwordMatchSchema = z.object({
  password: z.string(),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

const registrationSchema = baseSchema.refine(
  data => data.password === data.confirmPassword,
  {
    message: "Passwords don't match",
    path: ["confirmPassword"]
  }
);

const initialFormState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  barangay: "",
  phoneNumber: "",
  terms: false,
  newsletter: false,
};

function Registration() {
  const router = useNavigate();
  const [step, setStep] = useState<'form' | 'verification'>('form');
  const [formData, setFormData] = useState(initialFormState);
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [open, setOpen] = useState(false)
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''))
  const [otpError, setOtpError] = useState('')
  const [otpResendTime, setOtpResendTime] = useState(0)
  const [maskedEmail, setMaskedEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSendingOtp, setIsSendingOtp] = useState(false)
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([])

  const logos = [
    "https://i.ibb.co/sJcshyZp/images-6.jpg",
    "https://i.ibb.co/5hfsr081/png-clipart-executive-departments-of-the-philippines-department-of-health-health-care-public-health.png",
    "https://i.ibb.co/cXFFTW7S/Logo-Philippines-DFA.jpg",
    "https://i.ibb.co/QFh5dS8r/images-1.png"
  ]

  const debouncedValidate = useDebouncedCallback((field: string, value: any) => {
    validateField(field, value)
  }, 500)

  const validateField = useCallback(async (field: string, value: any) => {
    try {
      const fieldSchema = (baseSchema as any).pick({ [field]: true });
      await fieldSchema.parseAsync({ [field]: value }); 
      setErrors(prev => ({ ...prev, [field]: '' }));

      if (field === 'password' || field === 'confirmPassword') {
        const password = field === 'password' ? value : formData.password;
        const confirmPassword = field === 'confirmPassword' ? value : formData.confirmPassword;

        if (password && confirmPassword) {
          await passwordMatchSchema.parseAsync({ password, confirmPassword });
          setErrors(prev => ({ ...prev, confirmPassword: '' }));
        }
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        const error = err.errors[0];
        if (error.path.includes('confirmPassword')) {
          setErrors(prev => ({ ...prev, confirmPassword: error.message }));
        } else {
          setErrors(prev => ({ ...prev, [field]: error.message }));
        }
      }
    }
  }, [formData.password, formData.confirmPassword]);

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    if (field === 'terms' || field === 'newsletter') {
      validateField(field, value)
      return
    }

    debouncedValidate(field, value)
  }

  const maskEmail = (email: string) => {
    const [name, domain] = email.split('@');
    if (name.length > 2) {
      return `${name.substring(0, 2)}${'*'.repeat(name.length - 2)}@${domain}`;
    }
    return `${name}@${domain}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const validation = registrationSchema.safeParse(formData);
      if (!validation.success) {
        const errorMap: Record<string, string> = {};
        validation.error.issues.forEach(err => {
          errorMap[err.path[0]] = err.message;
        });
        setErrors(errorMap);
        toast.error('Please fix form errors');
        return;
      }
      
      setIsSendingOtp(true);
      await sendOTP(formData.email);
      setMaskedEmail(maskEmail(formData.email));
      toast.success('Verification code sent to your email!');
      setOtpResendTime(60);
      setStep('verification');
      
    } catch (error: any) {
      if (error.response) {
        toast.error(error.response.data.message || 'Failed to send verification code');
      } else {
        toast.error('Network error. Please check your connection.');
      }
    } finally {
      setIsSubmitting(false);
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOTP = async (otpValue?: string) => {
    const otpString = otpValue || otp.join('');
    
    if (otpString.length !== 6) {
      setOtpError('Please enter the 6-digit code');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await verifyOTP(formData.email, otpString);
      
      await registerUser(formData);
      toast.success('Registration Successful!');
      
      // Delay redirect by 3 seconds
      setTimeout(() => {
        router('/account/login');
      }, 3000);
      
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 400) {
          setOtpError(error.response.data.message);
        } else {
          toast.error(error.response.data.message || 'Verification failed');
        }
      } else {
        toast.error('Network error. Please check your connection.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOTP = async () => {
    if (otpResendTime > 0) return;
    
    setIsSendingOtp(true);
    try {
      await sendOTP(formData.email);
      toast.success('New verification code sent!');
      setOtpResendTime(60);
    } catch (error) {
      toast.error('Failed to resend code');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (/^\d*$/.test(value) && value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      setOtpError('');
      
      if (value && index < 5 && otpInputRefs.current[index + 1]) {
        otpInputRefs.current[index + 1]?.focus();
      }
      
      if (index === 5 && value) {
        const fullOtp = newOtp.join('');
        if (fullOtp.length === 6) {
          handleVerifyOTP(fullOtp);
        }
      }
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (otpResendTime > 0) {
      timer = setTimeout(() => setOtpResendTime(otpResendTime - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [otpResendTime]);

  useEffect(() => {
    if (step === 'verification') {
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
    }
  }, [step]);

  if (step === 'verification') {
    return (
      <div className="min-h-screen bg-[#1a1d24] text-white flex items-center justify-center p-4">
        <div className="w-full max-w-md">
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

          <div className="bg-[#2a2f38] rounded-xl p-8 shadow-lg">
            <div className="text-center mb-8">
              <div className="mx-auto bg-blue-500/20 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              
              <h1 className="text-2xl font-bold mb-2">Verify Your Email</h1>
              <p className="text-gray-400">
                We've sent a 6-digit code to <span className="font-medium text-blue-300">{maskedEmail}</span>
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm text-gray-400 mb-3">Enter verification code</label>
                <div className="flex justify-center space-x-3">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <input
                      key={index}
                      ref={(el) => (otpInputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      className={`w-12 h-12 text-center text-xl rounded-lg bg-[#1a1d24] focus:outline-none focus:ring-2 ${
                        otpError ? 'border border-red-500 focus:ring-red-500' : 'border-blue-500/50 focus:ring-blue-500'
                      }`}
                      value={otp[index]}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      disabled={isSubmitting}
                    />
                  ))}
                </div>
                
                {otpError && (
                  <p className="text-red-400 text-sm mt-2 text-center">{otpError}</p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  onClick={handleResendOTP}
                  disabled={otpResendTime > 0 || isSendingOtp}
                  className={`text-sm font-medium ${
                    otpResendTime > 0 
                      ? 'text-gray-500' 
                      : 'text-blue-400 hover:text-blue-300'
                  }`}
                >
                  {isSendingOtp ? (
                    <span>Sending new code...</span>
                  ) : otpResendTime > 0 ? (
                    `Resend in ${otpResendTime}s`
                  ) : (
                    'Resend verification code'
                  )}
                </button>
                
                <button
                  onClick={() => handleVerifyOTP()}
                  disabled={isSubmitting || otp.join('').length !== 6}
                  className={`px-6 py-3 text-base font-medium text-white rounded-lg transition-colors ${
                    isSubmitting || otp.join('').length !== 6
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                      Verifying...
                    </div>
                  ) : (
                    'Verify Account'
                  )}
                </button>
              </div>

              <button
                onClick={() => setStep('form')}
                className="text-blue-400 hover:text-blue-300 text-sm font-medium mt-4 w-full text-center"
              >
                ← Back to registration
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <div className="flex flex-col p-8 bg-[#1a1d24] text-white md:p-12 lg:p-16">
        <div className="max-w-md mx-auto w-full">
          <h1 className="text-2xl font-semibold mb-8">Barangay Official Registration</h1>
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
              <label className="text-sm text-gray-400">Barangay</label>
              <select
                className={`w-full px-3 py-2 rounded-lg bg-[#2a2f38] text-white focus:outline-none focus:ring-2 ${
                  errors.barangay ? 'focus:ring-red-500' : 'focus:ring-blue-500'
                }`}
                value={formData.barangay}
                onChange={(e) => handleChange('barangay', e.target.value)}
              >
                <option value="">Select Barangay</option>
                {barangays.map((barangay) => (
                  <option key={barangay.id} value={barangay.name}>
                    {barangay.name}
                  </option>
                ))}
              </select>
              {errors.barangay && <p className="text-red-400 text-sm mt-1">{errors.barangay}</p>}
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
                placeholder="official@barangay.gov.ph"
                className={`w-full px-3 py-2 rounded-lg bg-[#2a2f38] text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 ${
                    errors.email ? 'focus:ring-red-500' : 'focus:ring-blue-500'
                }`}
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
              {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
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

              <div className="space-y-2">
                <label className="text-sm text-gray-400">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={`w-full px-3 py-2 rounded-lg bg-[#2a2f38] text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 ${
                      errors.confirmPassword ? 'focus:ring-red-500' : 'focus:ring-blue-500'
                    }`}
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-blue-500"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="w-6 h-6" />
                    ) : (
                      <EyeIcon className="w-6 h-6" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>}
              </div>
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
                  I certify that I am an authorized barangay official and agree to the{" "}
                  <button type= "button" onClick={() => setOpen(true)} className="text-[#3b82f6] hover:underline">
                    Terms of Service
                  </button>
                </label>
              </div>
              {errors.terms && <p className="text-red-400 text-sm -mt-2">{errors.terms}</p>}

              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="newsletter"
                  checked={formData.newsletter}
                  onChange={(e) => setFormData(prev => ({ ...prev, newsletter: e.target.checked }))}
                  className="mt-1 w-5 h-5 rounded bg-[#2a2f38] border-none"
                />
                <label htmlFor="newsletter" className="text-sm text-gray-400">
                  Receive important updates and government advisories
                </label>
              </div>
            </div>

            {open && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
                <div className="bg-white w-full p-8 rounded-xl shadow-xl max-w-lg mx-4 relative">
                  <button
                    onClick={() => setOpen(false)}
                    className="absolute top-4 right-4 text-gray-700 hover:text-gray-900 text-2xl"
                  >
                    ✕
                  </button>
                  
                  <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
                    Terms of Service
                  </h2>
                  
                  <div className="bg-blue-50 p-4 rounded-lg mb-6">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      Welcome to the DILG eGov Nexus platform. By using this service, you agree to our terms and conditions. These terms are essential for the proper use of the AI-powered reporting, real-time analytics, and document management system for the LGUs of Calapan.
                    </p>
                  </div>

                  <div className="space-y-4 text-sm text-gray-600">
                    <div className="flex items-start">
                      <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">1</div>
                      <p><strong>Service Agreement:</strong> By accessing or using the services, you agree to comply with all applicable regulations, policies, and the terms outlined here.</p>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">2</div>
                      <p><strong>User Responsibilities:</strong> You are responsible for providing accurate information and ensuring that all data entered into the system adheres to legal standards and privacy laws.</p>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">3</div>
                      <p><strong>Data Privacy:</strong> We prioritize your privacy. Any data collected will be used solely for operational and improvement purposes in compliance with data protection laws.</p>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">4</div>
                      <p><strong>AI Usage:</strong> The AI-powered analytics and reporting features are intended to provide insights and support decision-making. Users must ensure that all data provided is accurate to ensure reliable outcomes.</p>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-center">
                    <button
                      onClick={() => setOpen(false)}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      I Understand
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            <button
              type="submit"
              disabled={isSubmitting || isSendingOtp}
              className={`w-full px-4 py-2.5 text-sm font-medium text-white bg-[#3b82f6] rounded-lg transition-all ${
                isSubmitting || isSendingOtp ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
              }`}
            >
              {isSubmitting || isSendingOtp ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                  {isSendingOtp ? 'Sending code...' : 'Registering...'}
                </div>
              ) : (
                'Register Official Account'
              )}
            </button>
          </form>
        </div>
      </div>

      <div className="hidden md:flex flex-col items-start justify-center p-12 bg-center bg-cover bg-opacity-10 text-white lg:p-16"
       style={{  backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5)), url('https://i.ibb.co/Xrcwr3fm/474975489-624902033229226-8762022534966171083-n.jpg')" }}>
        <div className="max-w-md">
            <h2 className="text-4xl font-bold mb-6 lg:text-5xl">Digital Governance Platform</h2>
            <p className="text-lg mb-8 text-blue-100">
              Empowering Oriental Mindoro barangay officials with modern tools for community management, 
              public service delivery, and transparent governance.
            </p>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {logos.map((logo: string, index: number) => (
                  <img key={index} src={logo} alt={`Logo ${index + 1}`} className="w-10 h-10 rounded-full border-2 border-blue-500 bg-blue-400" />
                ))}
              </div>
              <p className="text-blue-100">
                Trusted by <span className="font-semibold">127 Barangays</span> in Oriental Mindoro
              </p>
            </div>
          </div>
      </div>
    </div>
  )
}

export default Registration;