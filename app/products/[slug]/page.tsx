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
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  console.log("🔍 [slug] page.tsx - resolvedParams.slug:", resolvedParams.slug);
  
  return <ProductPageClient productSlug={resolvedParams.slug} />;
}
