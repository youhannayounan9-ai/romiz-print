"use client";

import { useState } from "react";
import { UploadDropzone } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

interface Props {
  onUploadComplete: (url: string) => void;
}

export default function DesignFileUploader({ onUploadComplete }: Props) {
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  return (
    <div className="space-y-2 mt-4">
      <label className="block text-sm font-semibold mb-1">Upload Design File (Optional)</label>
      {!uploaded ? (
        <UploadDropzone<OurFileRouter, "designUploader">
          endpoint="designUploader"
          onUploadBegin={() => setUploading(true)}
          onClientUploadComplete={(res) => {
            setUploading(false);
            setUploaded(true);
            if (res && res[0]) {
              onUploadComplete(res[0].url);
            }
          }}
          onUploadError={(error: Error) => {
            setUploading(false);
            console.error("Upload error:", error);
            alert("Upload failed. Please try again.");
          }}
          className="ut-allowed-content:text-gray-600 ut-label:text-[#0B4DA2] ut-button:bg-[#0B4DA2] ut-button:ut-uploading:bg-[#0B4DA2]/50 ut-button:ut-readying:bg-[#0B4DA2]/50 outline-none border-2 border-dashed border-gray-300 rounded-lg p-8"
        />
      ) : (
        <div className="w-full py-4 px-4 rounded-lg border-2 border-green-500 bg-green-50 flex items-center justify-center gap-2 text-green-700 font-medium">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>Design File Uploaded!</span>
        </div>
      )}
    </div>
  );
}
