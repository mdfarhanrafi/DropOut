"use client"

import { RefreshCw, Trash } from "lucide-react"
import { Button } from "@/components/ui/button" // shadcn Button

interface FileActionButtonsProps {
  activeTab: string
  trashCount: number
  folderPath: Array<{ id: string; name: string }>
  onRefresh: () => void
  onEmptyTrash: () => void
}

export default function FileActionButtons({
  activeTab,
  trashCount,
  folderPath,
  onRefresh,
  onEmptyTrash,
}: FileActionButtonsProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
      <h2 className="text-xl sm:text-2xl font-semibold truncate max-w-full">
        {activeTab === "all" && (folderPath.length > 0 ? folderPath[folderPath.length - 1].name : "All Files")}
        {activeTab === "starred" && "Starred Files"}
        {activeTab === "trash" && "Trash"}
      </h2>
      <div className="flex gap-2 sm:gap-3 self-end sm:self-auto">
        <Button variant="ghost" size="sm" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
        {activeTab === "trash" && trashCount > 0 && (
          <Button
            variant="ghost" // Equivalent to "flat"
            size="sm"
            onClick={onEmptyTrash}
            className="text-destructive hover:bg-destructive/10" // Custom styling for danger
          >
            <Trash className="h-4 w-4 mr-2" />
            Empty Trash
          </Button>
        )}
      </div>
    </div>
  )
}
