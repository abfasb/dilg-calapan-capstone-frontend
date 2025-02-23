import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { Button } from "../../ui/button"
import barangays from "../../../types/barangays"
import { toast, Toaster} from "react-hot-toast"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form"
import { Input } from "../../ui/input"
import { Separator } from "../../ui/separator"
import { User, Mail, Phone, KeyRound, Shield, MapPin, Briefcase } from "lucide-react"
import InputMask from "react-input-mask"
import { registerUser } from "../../../api/registrationApi"

const formSchema = z.object({
  firstName: z.string().min(2, "Minimum 2 characters").max(50),
  lastName: z.string().min(2, "Minimum 2 characters").max(50),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(10, "Invalid phone number"),
  password: z.string().min(8, "Minimum 8 characters"),
  confirmPassword: z.string().min(6, "Confirm Password must be at least 6 characters"),
  role: z.string().default("citizen"),
  barangay: z.string().min(2, "Minimum 2 characters"),
  position: z.string().min(2, "Minimum 2 characters"),
})
.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"], 
});

const CitizenRegistration = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: "citizen",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await registerUser(values);

      if (response.success) {
        toast.success("Registration successful!");
        form.reset();
      } else {
        toast.error(response.message || "Registration failed!");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("An error occurred. Please try again.");
    }
  }

  return (
    <>
    <Toaster
      position="top-right"
      gutter={32}
      containerClassName="!top-4 !right-6"
      toastOptions={{
        className: '!bg-[#1a1d24] !text-white !rounded-xl !border !border-[#2a2f38]',
      }}
    />
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">
          Citizen Registration
        </CardTitle>
        <Separator />
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      First Name
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Last Name */}
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Last Name
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

             {/* Barangay */}
                <FormField
                  control={form.control}
                  name="barangay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Barangay
                      </FormLabel>
                      <FormControl>
                        <select
                          className="border p-2 rounded w-full"
                          {...field}
                        >
                          <option value="" disabled>Select a barangay</option>
                          {barangays.map((barangay) => (
                            <option key={barangay.id} value={barangay.name}>
                              {barangay.name}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      Position
                    </FormLabel>
                    <FormControl>
                      <select
                        className="border p-2 rounded w-full"
                        {...field}
                      >
                        <option value="" disabled>Select a position</option>
                        <option value="Captain">Barangay Captain</option>
                        <option value="Secretary">Barangay Secretary</option>
                        <option value="Treasurer">Barangay Treasurer</option>
                        <option value="SK Chairman">SK Chairman</option>
                        <option value="Councilor">Barangay Councilor</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />


              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="john.doe@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone Number */}
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone Number
                    </FormLabel>
                    <FormControl>
                      <InputMask 
                        mask="(999) 999-9999" 
                        {...field}
                      >
                        {(props: any) => <Input {...props} placeholder="(123) 456-7890" />}
                      </InputMask>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <KeyRound className="h-4 w-4" />
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <KeyRound className="h-4 w-4" />
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />


            </div>

            <Button type="submit" className="w-full">
              Register Citizen
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card></>
  )
}

export default CitizenRegistration