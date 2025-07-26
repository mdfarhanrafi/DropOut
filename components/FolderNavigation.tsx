"use client"

import { ArrowUpFromLine } from "lucide-react"
import { Button } from "@/components/ui/button" // shadcn Button component
import { cn } from "@/lib/utils" // For conditional class names

interface FolderNavigationProps {
  folderPath: Array<{ id: string; name: string }>
  navigateUp: () => void
  navigateToPathFolder: (index: number) => void
}

export default function FolderNavigation({ folderPath, navigateUp, navigateToPathFolder }: FolderNavigationProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm overflow-x-auto pb-2">
      <Button variant="outline" size="sm" onClick={navigateUp} disabled={folderPath.length === 0}>
        <ArrowUpFromLine className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigateToPathFolder(-1)}
        className={cn(folderPath.length === 0 ? "font-bold" : "")}
      >
        Home
      </Button>
      {folderPath.map((folder, index) => (
        <div key={folder.id} className="flex items-center">
          <span className="mx-1 text-gray-400">/</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateToPathFolder(index)}
            className={cn(
              index === folderPath.length - 1 ? "font-bold" : "",
              "text-ellipsis overflow-hidden max-w-[150px]",
            )}
            title={folder.name}
          >
            {folder.name}
          </Button>
        </div>
      ))}
    </div>
  )
}
