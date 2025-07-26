"use client"

import type React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./dialog"
import { Button } from "./button"
import type { LucideIcon } from "lucide-react" // Use type import for LucideIcon
import { cn } from "@/lib/utils" // Utility for conditionally joining class names

interface ConfirmationModalProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  title: string
  description: string
  icon?: LucideIcon
  iconColor?: string
  confirmText?: string
  cancelText?: string
  confirmColor?: "primary" | "danger" | "warning" | "success" | "default"
  onConfirm: () => void
  isDangerous?: boolean
  warningMessage?: string
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onOpenChange,
  title,
  description,
  icon: Icon,
  iconColor = "text-red-500", // Default to a red color for consistency with danger
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmColor = "danger",
  onConfirm,
  isDangerous = false,
  warningMessage,
}) => {
  // Map confirmColor to shadcn button variant
  const getConfirmButtonVariant = () => {
    switch (confirmColor) {
      case "danger":
        return "destructive"
      case "primary":
      case "success":
      case "warning":
      case "default":
      default:
        return "default" // Default shadcn button variant
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="border border-gray-200 bg-gray-50 sm:max-w-[425px]" // Apply base styles to DialogContent
      >
        <DialogHeader className="flex flex-row items-center gap-2 border-b border-gray-200 pb-4">
          {Icon && <Icon className={cn("h-5 w-5", iconColor)} />}
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {" "}
          {/* Wrapper for body content with padding */}
          {isDangerous && warningMessage && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-4">
              <div className="flex items-start gap-3">
                {Icon && <Icon className={cn("h-5 w-5 mt-0.5 flex-shrink-0", iconColor)} />}
                <div>
                  <p className="font-medium">This action cannot be undone</p>
                  <p className="text-sm mt-1">{warningMessage}</p>
                </div>
              </div>
            </div>
          )}
          <DialogDescription>{description}</DialogDescription>
        </div>
        <DialogFooter className="border-t border-gray-200 pt-4 flex justify-end gap-2">
          <Button
            variant="ghost" // Equivalent to "flat"
            onClick={() => onOpenChange(false)}
          >
            {cancelText}
          </Button>
          <Button
            variant={getConfirmButtonVariant()}
            onClick={() => {
              onConfirm()
              onOpenChange(false)
            }}
          >
            {Icon && <Icon className="h-4 w-4 mr-2" />}
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ConfirmationModal
