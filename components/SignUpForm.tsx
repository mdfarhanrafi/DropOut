"use client"

import type React from "react"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSignUp } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import Link from "next/link"
import type { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardFooter, CardTitle, CardDescription } from "@/components/ui/card"
import { Mail, Lock, AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils" // For conditional class names

// Assuming signUpSchema is defined in this path
import { signUpSchema } from "@/schemas/signUpSchema"

export default function SignUpForm() {
  const router = useRouter()
  const { signUp, isLoaded, setActive } = useSignUp()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [verifying, setVerifying] = useState(false)
  const [verificationCode, setVerificationCode] = useState("")
  const [verificationError, setVerificationError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  })

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    if (!isLoaded) return
    setIsSubmitting(true)
    setAuthError(null)
    try {
      await signUp.create({
        emailAddress: data.email,
        password: data.password,
      })
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" })
      setVerifying(true)
    } catch (error: any) {
      console.error("Sign-up error:", error)
      setAuthError(error.errors?.[0]?.message || "An error occurred during sign-up. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVerificationSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!isLoaded || !signUp) return
    setIsSubmitting(true)
    setVerificationError(null)
    try {
      const result = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      })
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId })
        router.push("/dashboard")
      } else {
        console.error("Verification incomplete:", result)
        setVerificationError("Verification could not be completed. Please try again.")
      }
    } catch (error: any) {
      console.error("Verification error:", error)
      setVerificationError(error.errors?.[0]?.message || "An error occurred during verification. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (verifying) {
    return (
      <Card className="w-full max-w-md border border-gray-200 bg-gray-50 shadow-xl">
        <CardHeader className="flex flex-col gap-1 items-center pb-2">
          <CardTitle className="text-2xl font-bold text-gray-900">Verify Your Email</CardTitle>
          <CardDescription className="text-gray-500 text-center">
            We've sent a verification code to your email
          </CardDescription>
        </CardHeader>
        <div className="border-t border-gray-200 my-4" /> {/* Divider */}
        <CardContent className="py-6">
          {verificationError && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p>{verificationError}</p>
            </div>
          )}
          <form onSubmit={handleVerificationSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="verificationCode" className="text-sm font-medium text-gray-900">
                Verification Code
              </label>
              <Input
                id="verificationCode"
                type="text"
                placeholder="Enter the 6-digit code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="w-full"
                autoFocus
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Verifying..." : "Verify Email"}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Didn't receive a code?{" "}
              <button
                onClick={async () => {
                  if (signUp) {
                    await signUp.prepareEmailAddressVerification({
                      strategy: "email_code",
                    })
                  }
                }}
                className="text-primary hover:underline font-medium"
              >
                Resend code
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md border border-gray-200 bg-gray-50 shadow-xl">
      <CardHeader className="flex flex-col gap-1 items-center pb-2">
        <CardTitle className="text-2xl font-bold text-gray-900">Create Your Account</CardTitle>
        <CardDescription className="text-gray-500 text-center">
          Sign up to start managing your images securely
        </CardDescription>
      </CardHeader>
      <div className="border-t border-gray-200 my-4" /> {/* Divider */}
      <CardContent className="py-6">
        {authError && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p>{authError}</p>
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-900">
              Email
            </label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                {...register("email")}
                className={cn("w-full pl-10", errors.email && "border-red-500 focus-visible:ring-red-500")}
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>
            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-gray-900">
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("password")}
                className={cn("w-full pl-10 pr-10", errors.password && "border-red-500 focus-visible:ring-red-500")}
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-500" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-500" />
                )}
              </Button>
            </div>
            {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
          </div>
          <div className="space-y-2">
            <label htmlFor="passwordConfirmation" className="text-sm font-medium text-gray-900">
              Confirm Password
            </label>
            <div className="relative">
              <Input
                id="passwordConfirmation"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("passwordConfirmation")}
                className={cn(
                  "w-full pl-10 pr-10",
                  errors.passwordConfirmation && "border-red-500 focus-visible:ring-red-500",
                )}
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-500" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-500" />
                )}
              </Button>
            </div>
            {errors.passwordConfirmation && (
              <p className="text-sm text-red-500 mt-1">{errors.passwordConfirmation.message}</p>
            )}
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
              <p className="text-sm text-gray-600">
                By signing up, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Create Account"}
          </Button>
        </form>
      </CardContent>
      <div className="border-t border-gray-200 my-4" /> {/* Divider */}
      <CardFooter className="flex justify-center py-4">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-indigo-600 hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
