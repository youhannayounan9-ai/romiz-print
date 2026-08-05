"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { siteConfig } from "../config/site";

export default function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div
      style={{ backgroundColor: siteConfig.colors.dark }}
      className="relative flex items-center justify-center py-2.5 px-4 text-white text-sm font-medium"
    >
      <span className="text-center">
        <span className="inline-block w-2 h-2 rounded-full bg-[#FF7A1A] mr-2 align-middle animate-pulse" />
        Express Dispatch across Greater Cairo &nbsp;·&nbsp; Request your{" "}
        <span className="text-[#FF7A1A] font-semibold underline underline-offset-2 cursor-pointer hover:text-orange-300 transition-colors">
          free quote
        </span>{" "}
        today
      </span>
      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss announcement"
        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-white/10 transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  );
}
