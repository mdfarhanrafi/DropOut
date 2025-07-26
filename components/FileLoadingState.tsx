"use client";

import { Skeleton } from "@/components/ui/skeleton"
export default function FileLoadingState() {
  return (
    <div className="flex flex-col justify-center items-center py-20">
      <Skeleton className="h-[20px] w-[100px] rounded-full" />
      <p className="mt-4 text-default-600">Loading your files...</p>
    </div>
  );
}