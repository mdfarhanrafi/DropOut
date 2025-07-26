"use client"
import { useUser, useClerk } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardFooter, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { Mail, User, LogOut, Shield, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils" // For conditional class names

export default function UserProfile() {
  const { isLoaded, isSignedIn, user } = useUser()
  const { signOut } = useClerk()
  const router = useRouter()

  if (!isLoaded) {
    return (
      <div className="flex flex-col justify-center items-center p-12">
        {/* Simple Spinner */}
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent" />
        <p className="mt-4 text-gray-600">Loading your profile...</p>
      </div>
    )
  }

  if (!isSignedIn) {
    return (
      <Card className="max-w-md mx-auto border border-gray-200 bg-gray-50 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center gap-3">
          <User className="h-6 w-6 text-primary" />
          <CardTitle className="text-xl font-semibold">User Profile</CardTitle>
        </CardHeader>
        <div className="border-t border-gray-200 my-4" /> {/* Divider */}
        <CardContent className="text-center py-10">
          <div className="mb-6">
            <Avatar className="mx-auto mb-4 h-24 w-24">
              <AvatarFallback className="text-lg">G</AvatarFallback> {/* Default for Guest */}
            </Avatar>
            <p className="text-lg font-medium">Not Signed In</p>
            <p className="text-gray-500 mt-2">Please sign in to access your profile</p>
          </div>
          <Button
            variant="default" // Equivalent to "solid"
            size="lg"
            onClick={() => router.push("/sign-in")}
            className="px-8"
          >
            Sign In
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    )
  }

  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim()
  const email = user.primaryEmailAddress?.emailAddress || ""
  const initials = fullName
    .split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase()
  const userRole = user.publicMetadata.role as string | undefined

  const handleSignOut = () => {
    signOut(() => {
      router.push("/")
    })
  }

  return (
    <Card className="max-w-md mx-auto border border-gray-200 bg-gray-50 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center gap-3">
        <User className="h-6 w-6 text-primary" />
        <CardTitle className="text-xl font-semibold">User Profile</CardTitle>
      </CardHeader>
      <div className="border-t border-gray-200 my-4" /> {/* Divider */}
      <CardContent className="py-6">
        <div className="flex flex-col items-center text-center mb-6">
          {user.imageUrl ? (
            <Avatar className="mb-4 h-24 w-24">
              <AvatarImage src={user.imageUrl || "/placeholder.svg"} alt={fullName} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          ) : (
            <Avatar className="mb-4 h-24 w-24">
              <AvatarFallback className="text-lg">{initials}</AvatarFallback>
            </Avatar>
          )}
          <h3 className="text-xl font-semibold">{fullName}</h3>
          {user.emailAddresses && user.emailAddresses.length > 0 && (
            <div className="flex items-center gap-2 mt-1 text-gray-500">
              <Mail className="h-4 w-4" />
              <span>{email}</span>
            </div>
          )}
          {userRole && (
            <Badge
              variant="outline" // Equivalent to "flat"
              className="mt-3 border-primary text-primary" // Custom styling for primary badge
              aria-label={`User role: ${userRole}`}
            >
              {userRole}
            </Badge>
          )}
        </div>
        <div className="border-t border-gray-200 my-4" /> {/* Divider */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary/70" />
              <span className="font-medium">Account Status</span>
            </div>
            <Badge
              variant="outline" // Equivalent to "flat"
              className="border-green-600 text-green-600" // Custom styling for success badge
              aria-label="Account status: Active"
            >
              Active
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary/70" />
              <span className="font-medium">Email Verification</span>
            </div>
            <Badge
              variant="outline" // Equivalent to "flat"
              className={cn(
                user.emailAddresses?.[0]?.verification?.status === "verified"
                  ? "border-green-600 text-green-600"
                  : "border-yellow-600 text-yellow-600", // Custom styling for warning badge
              )}
              aria-label={`Email verification status: ${
                user.emailAddresses?.[0]?.verification?.status === "verified" ? "Verified" : "Pending"
              }`}
            >
              {user.emailAddresses?.[0]?.verification?.status === "verified" ? "Verified" : "Pending"}
            </Badge>
          </div>
        </div>
      </CardContent>
      <div className="border-t border-gray-200 my-4" /> {/* Divider */}
      <CardFooter className="flex justify-between">
        <Button
          variant="ghost" // Equivalent to "flat"
          className="text-red-500 hover:bg-red-50 hover:text-red-600" // Custom styling for danger button
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </CardFooter>
    </Card>
  )
}
