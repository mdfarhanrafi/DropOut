"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs" // shadcn Tabs components
import { Badge } from "@/components/ui/badge" // shadcn Badge component
import { File, Star, Trash } from "lucide-react"
import { cn } from "@/lib/utils"
import type { File as FileType } from "@/lib/db/schema"

interface FileTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
  files: FileType[] // Used for counts
  starredCount: number
  trashCount: number
}

export default function FileTabs({ activeTab, onTabChange, files, starredCount, trashCount }: FileTabsProps) {
  return (
    <Tabs defaultValue={activeTab} onValueChange={onTabChange}>
      <TabsList className="gap-6 border-b border-gray-200 mb-8">
        <TabsTrigger
          value="all"
          className={cn(
            "py-3 px-0 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary",
            "data-[state=active]:shadow-none data-[state=active]:bg-transparent",
          )}
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <File className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="font-medium">All Files</span>
            <Badge
              variant="outline" // Equivalent to "flat"
              className="border-gray-300 text-gray-700" // Custom styling for default badge
              aria-label={`${files.filter((file) => !file.isTrash).length} files`}
            >
              {files.filter((file) => !file.isTrash).length}
            </Badge>
          </div>
        </TabsTrigger>
        <TabsTrigger
          value="starred"
          className={cn(
            "py-3 px-0 data-[state=active]:border-primary data-[state=active]:text-primary",
            "data-[state=active]:shadow-none data-[state=active]:bg-transparent",
          )}
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <Star className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="font-medium">Starred</span>
            <Badge
              variant="outline" // Equivalent to "flat"
              className="border-yellow-400 text-yellow-600" // Custom styling for warning badge
              aria-label={`${starredCount} starred files`}
            >
              {starredCount}
            </Badge>
          </div>
        </TabsTrigger>
        <TabsTrigger
          value="trash"
          className={cn(
            "py-3 px-0 data-[state=active]:border-primary data-[state=active]:text-primary",
            "data-[state=active]:shadow-none data-[state=active]:bg-transparent",
          )}
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <Trash className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="font-medium">Trash</span>
            <Badge
              variant="default" // Equivalent to "solid"
              className="bg-destructive text-destructive-foreground" // Custom styling for danger badge
              aria-label={`${trashCount} files in trash`}
            >
              {trashCount}
            </Badge>
          </div>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
