import TrustBar from "./components/TrustBar";
import HeroCarousel from "./components/HeroCarousel";
import ShopByCategory from "./components/ShopByCategory";
import TrendingProducts from "./components/TrendingProducts";

export default function HomePage() {
  return (
    <>
      {/* Trust Bar — homepage only, directly below nav */}
      <TrustBar />

      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Shop By Category */}
      <ShopByCategory />

      {/* Trending Products */}
      <TrendingProducts />
    </>
  );
}
