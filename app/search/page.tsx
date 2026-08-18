import { Suspense } from "react";
import SearchResults from "./SearchResults";
import { siteConfig } from "../config/site";

export const metadata = {
  title: `Search Results | ${siteConfig.name}`,
  description: "Search results for ROMIZ PRINT products.",
};

export default function SearchPage() {
  return (
    <div style={{ backgroundColor: siteConfig.colors.background }} className="min-h-screen">
      <Suspense fallback={<div className="p-20 text-center text-gray-500 font-medium">Loading search results...</div>}>
        <SearchResults />
      </Suspense>
    </div>
  );
}
