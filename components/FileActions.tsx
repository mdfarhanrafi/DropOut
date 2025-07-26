"use client"

import { Star, Trash, X, ArrowUpFromLine, Download } from "lucide-react"
import { Button } from "@/components/ui/button" // shadcn Button
import { cn } from "@/lib/utils" // For conditional class names

// Assuming FileType is defined in this path
import type { File as FileType } from "@/lib/db/schema"

interface FileActionsProps {
  file: FileType
  onStar: (id: string) => void
  onTrash: (id: string) => void
  onDelete: (file: FileType) => void
  onDownload: (file: FileType) => void
}

export default function FileActions({ file, onStar, onTrash, onDelete, onDownload }: FileActionsProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-end">
      {/* Download button */}
      {!file.isTrash && !file.isFolder && (
        <Button variant="ghost" size="sm" onClick={() => onDownload(file)} className="min-w-0 px-2">
          <Download className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Download</span>
        </Button>
      )}

      {/* Star button */}
      {!file.isTrash && (
        <Button variant="ghost" size="sm" onClick={() => onStar(file.id)} className="min-w-0 px-2">
          <Star className={cn("h-4 w-4 mr-2", file.isStarred ? "text-yellow-400 fill-current" : "text-gray-400")} />
          <span className="hidden sm:inline">{file.isStarred ? "Unstar" : "Star"}</span>
        </Button>
      )}

      {/* Trash/Restore button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onTrash(file.id)}
        className={cn(
          "min-w-0 px-2",
          file.isTrash ? "text-green-600 hover:bg-green-50" : "text-gray-700 hover:bg-gray-100", // Custom styling for success/default
        )}
      >
        {file.isTrash ? <ArrowUpFromLine className="h-4 w-4 mr-2" /> : <Trash className="h-4 w-4 mr-2" />}
        <span className="hidden sm:inline">{file.isTrash ? "Restore" : "Delete"}</span>
      </Button>

      {/* Delete permanently button */}
      {file.isTrash && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(file)}
          className="min-w-0 px-2 text-destructive hover:bg-destructive/10" // Custom styling for danger
        >
          <X className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Remove</span>
        </Button>
      )}
    </div>
  )
}
