"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSignIn } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import Link from "next/link"
import type { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardFooter, CardTitle, CardDescription } from "@/components/ui/card"
import { Mail, Lock, AlertCircle, Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils" // For conditional class names

// Assuming signInSchema is defined in this path
import { signInSchema } from "@/schemas/signInSchema"

export default function SignInForm() {
  const router = useRouter()
  const { signIn, isLoaded, setActive } = useSignIn()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  })

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    if (!isLoaded) return
    setIsSubmitting(true)
    setAuthError(null)
    try {
      const result = await signIn.create({
        identifier: data.identifier,
        password: data.password,
      })
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId })
        router.push("/dashboard")
      } else {
        console.error("Sign-in incomplete:", result)
        setAuthError("Sign-in could not be completed. Please try again.")
      }
    } catch (error: any) {
      console.error("Sign-in error:", error)
      setAuthError(error.errors?.[0]?.message || "An error occurred during sign-in. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-md border border-gray-200 bg-gray-50 shadow-xl">
      <CardHeader className="flex flex-col gap-1 items-center pb-2">
        <CardTitle className="text-2xl font-bold text-gray-900">Welcome Back</CardTitle>
        <CardDescription className="text-gray-500 text-center">
          Sign in to access your secure cloud storage
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
            <label htmlFor="identifier" className="text-sm font-medium text-gray-900">
              Email
            </label>
            <div className="relative">
              <Input
                id="identifier"
                type="email"
                placeholder="your.email@example.com"
                {...register("identifier")}
                className={cn("w-full pl-10", errors.identifier && "border-red-500 focus-visible:ring-red-500")}
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>
            {errors.identifier && <p className="text-sm text-red-500 mt-1">{errors.identifier.message}</p>}
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="password" className="text-sm font-medium text-gray-900">
                Password
              </label>
            </div>
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
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </CardContent>
      <div className="border-t border-gray-200 my-4" /> {/* Divider */}
      <CardFooter className="flex justify-center py-4">
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <Link href="/sign-up" className="text-violet-500 hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
