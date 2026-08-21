import ProductPageClient from "./ProductPageClient";

export async function generateMetadata({ params, searchParams }: { params: { slug: string }, searchParams: { p?: string } }) {
  // A real implementation would fetch proper metadata
  return {
    title: `Customize ${params.slug} | ROMIZ PRINT`,
    description: "Premium custom printing options.",
  };
}

export default function ProductPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { p?: string };
}) {
  return <ProductPageClient categorySlug={params.slug} productSlug={searchParams.p} />;
}
