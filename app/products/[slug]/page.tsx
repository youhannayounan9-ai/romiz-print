import ProductPageClient from "./ProductPageClient";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  return {
    title: `Customize ${resolvedParams.slug} | ROMIZ PRINT`,
    description: "Premium custom printing options.",
  };
}

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ image?: string; readyMade?: string }>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  console.log("🔍 [slug] page.tsx - resolvedParams.slug:", resolvedParams.slug);
  
  return <ProductPageClient productSlug={resolvedParams.slug} searchParams={resolvedSearchParams} />;
}
