import ProductPageClient from "./ProductPageClient";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  // A real implementation would fetch proper metadata
  return {
    title: `Customize ${params.slug} | ROMIZ PRINT`,
    description: "Premium custom printing options.",
  };
}

export default function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  return <ProductPageClient productSlug={params.slug} />;
}
