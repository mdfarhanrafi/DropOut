"use client"

import { useState, useCallback, useEffect } from "react"
import { Card, CardHeader, CardContent } from "@/components/ui/card" // shadcn Card components
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs" // shadcn Tabs components
import { FileUp, FileText, User } from "lucide-react"
import FileUploadForm from "@/components/FileUploadForm" // Assuming these are existing components
import FileList from "@/components/FileList" // Assuming these are existing components
import UserProfile from "@/components/UserProfile" // Assuming these are existing components
import { useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils" // Utility for conditionally joining class names

interface DashboardContentProps {
  userId: string
  userName: string
}

export default function DashboardContent({ userId, userName }: DashboardContentProps) {
  const searchParams = useSearchParams()
  const tabParam = searchParams.get("tab")
  const [activeTab, setActiveTab] = useState<string>("files")
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [currentFolder, setCurrentFolder] = useState<string | null>(null)

  // Set the active tab based on URL parameter
  useEffect(() => {
    if (tabParam === "profile") {
      setActiveTab("profile")
    } else {
      setActiveTab("files")
    }
  }, [tabParam])

  const handleFileUploadSuccess = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1)
  }, [])

  const handleFolderChange = useCallback((folderId: string | null) => {
    setCurrentFolder(folderId)
  }, [])

  return (
    <>
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-gray-900">
          {"Hi, "}
          <span className="text-primary">
            {userName?.length > 10 ? `${userName?.substring(0, 8)}...` : userName?.split(" ")[0] || "there"}
          </span>
          {"!"}
        </h2>
        <p className="text-gray-600 mt-2 text-lg">Your images are waiting for you.</p>
      </div>
      <Tabs
        defaultValue={activeTab} // Use defaultValue for initial state
        onValueChange={(key) => setActiveTab(key as string)}
      >
        <TabsList className="gap-6 border-b border-gray-200 mb-8">
          {" "}
          {/* tabList styling */}
          <TabsTrigger
            value="files"
            className={cn(
              "py-3 px-0 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary",
              "data-[state=active]:shadow-none data-[state=active]:bg-transparent", // Remove default shadcn active background/shadow
            )}
          >
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5" />
              <span className="font-medium">My Files</span>
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="profile"
            className={cn(
              "py-3 px-0 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary",
              "data-[state=active]:shadow-none data-[state=active]:bg-transparent", // Remove default shadcn active background/shadow
            )}
          >
            <div className="flex items-center gap-3">
              <User className="h-5 w-5" />
              <span className="font-medium">Profile</span>
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="files">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card className="border border-gray-200 bg-gray-50 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center gap-3">
                  <FileUp className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold">Upload</h2>
                </CardHeader>
                <CardContent>
                  <FileUploadForm
                    userId={userId}
                    onUploadSuccess={handleFileUploadSuccess}
                    currentFolder={currentFolder}
                  />
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-2">
              <Card className="border border-gray-200 bg-gray-50 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center gap-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold">Your Files</h2>
                </CardHeader>
                <CardContent>
                  <FileList userId={userId} refreshTrigger={refreshTrigger} onFolderChange={handleFolderChange} />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="profile">
          <div className="mt-8">
            <UserProfile />
          </div>
        </TabsContent>
      </Tabs>
    </>
  )
}
