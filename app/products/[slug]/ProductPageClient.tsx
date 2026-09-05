"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShoppingCart, CheckCircle2, Ruler, Calculator } from "lucide-react";
import { siteConfig } from "../../config/site";
import { getProductBySlug, productData, QUOTE_BASED_SLUGS, BANNER_PRICE_PER_METER } from "../../data/products";
import { useCart } from "../../context/CartContext";
import DesignFileUploader from "../../components/DesignFileUploader";

/* ── Frame Size Options (Pills UI) ── */
const FRAME_SIZES = [
  { label: "15×21 cm", format: "(A5)", price: 200, badge: null },
  { label: "20×30 cm", format: "(A4)", price: 300, badge: "MOST PICKED" },
  { label: "30×40 cm", format: "(A3)", price: 450, badge: "BEST VALUE" },
];

/* ── Size Chart Modal ── */
function SizeChartModal({ src, label, onClose }: { src: string; label: string; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-[200] p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#1a1f2e] rounded-2xl p-4 max-w-2xl w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold">{label}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-2xl font-bold leading-none"
          >
            ×
          </button>
        </div>
        <div className="relative w-full" style={{ minHeight: 300 }}>
          <Image src={src} alt={label} fill className="object-contain rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export default function ProductPageClient({
  productSlug,
  searchParams,
}: {
  productSlug: string;
  searchParams?: { image?: string; altImage?: string; readyMade?: string };
}) {
  const router = useRouter();
  const { addItem } = useCart();

  const [loaded, setLoaded] = useState(false);
  const [options, setOptions] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [isEditingQuantity, setIsEditingQuantity] = useState(false);
  const [quantityInput, setQuantityInput] = useState("1");
  const [addedToCart, setAddedToCart] = useState(false);
  const [totalPrice, setTotalPrice] = useState(1);
  const [sizeChartOpen, setSizeChartOpen] = useState(false);

  // Active preview image (supports switching between Front & Back for Football Kits)
  const [activePreviewImage, setActivePreviewImage] = useState<string>("");

  // Banner calculator
  const [bannerMeters, setBannerMeters] = useState(1);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  if (typeof window !== "undefined") {
    console.log("🔍 ProductPageClient - received slug:", productSlug);
  }

  const result = getProductBySlug(productSlug);
  const product = result?.product;
  const categorySlug = result?.categorySlug;

  const isQuoteBased = product ? QUOTE_BASED_SLUGS.has(product.slug) : false;
  const isBanner = product?.slug === "custom-vinyl-banner";
  const isPens = product?.slug === "custom-pens";
  const isFlyers = product?.slug === "custom-flyers";
  const isStamp = product?.slug === "custom-stamp";

  const isCap = categorySlug === "caps";
  const isTShirts = categorySlug === "t-shirts";
  const isFootballKit = categorySlug === "football-kits";
  const isLabCoat = categorySlug === "lab-coats";
  const isApparel = isTShirts || isFootballKit || isLabCoat;

  const qtyMin = isPens ? 50 : 1;
  const qtyStep = isPens ? 50 : 1;

  useEffect(() => {
    if (product) {
      const defaultQty = isPens ? 50 : isFlyers ? 1000 : 1;
      setQuantity(defaultQty);
      setQuantityInput(defaultQty.toString());
      setTotalPrice(product.basePrice);

      const initialImg = searchParams?.image || product.image;
      setActivePreviewImage(initialImg);

      if (categorySlug === "frame") {
        setOptions({ Size: "15×21 cm (A5)", Color: "Black", "Custom Design": "No" });
      } else if (isApparel) {
        setOptions({ Size: "M" });
      } else if (isFlyers) {
        setOptions({ Size: "A5 (Half Page)", Paper: "80g (Simple)", Notes: "" });
      } else if (isStamp) {
        setOptions({ Type: "Rectangular Standard", Ink: "Blue" });
      }
    }
    setLoaded(true);
  }, [product, categorySlug, isPens, isApparel, isFlyers, isStamp, searchParams?.image]);

  useEffect(() => {
    if (!product) return;
    let newPrice = product.basePrice;

    if (categorySlug === "frame") {
      const currentSize = options.Size || "15×21 cm (A5)";
      if (currentSize.includes("20×30") || currentSize.includes("20x30")) newPrice = 300;
      else if (currentSize.includes("30×40") || currentSize.includes("30x40")) newPrice = 450;
      else newPrice = 200; // 15×21 cm (A5)

      if (options["Custom Design"] === "Yes") newPrice += 50;
    } else if (isBanner) {
      newPrice = bannerMeters * BANNER_PRICE_PER_METER;
    } else if (isPens) {
      newPrice = product.basePrice * quantity;
    } else if (isStamp) {
      if (options.Type === "Pocket Stamp") newPrice = 150;
      else if (options.Type === "Rectangular Standard") newPrice = 250;
      else if (options.Type === "Round/Square") newPrice = 350;
      else if (options.Type === "Date Stamp") newPrice = 450;
    } else if (isFlyers) {
      let base = 1200;
      if (options.Size === "A4 (Full Page)") base = 1800;
      else if (options.Size === "A3") base = 2800;
      if (options.Paper === "150g Glossy (Standard)") base += 200;
      else if (options.Paper === "250g Glossy (Heavy)") base += 500;
      else if (options.Paper === "300g Cardstock (Premium)") base += 900;
      newPrice = base * (quantity / 1000);
    }

    setTotalPrice(newPrice);
  }, [options, categorySlug, product, isBanner, bannerMeters, isPens, quantity, isStamp, isFlyers]);

  if (!loaded) return <div className="min-h-screen pt-20 text-center">Loading...</div>;
  if (!product) {
    return <div className="min-h-screen pt-20 text-center">Product not found.</div>;
  }

  const handleOptionChange = (key: string, value: string) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  const handleQuantitySubmit = () => {
    setIsEditingQuantity(false);
    const parsed = parseInt(quantityInput, 10);
    const customStep = isFlyers ? 1000 : qtyStep;
    if (!isNaN(parsed) && parsed >= qtyMin) {
      const snapped = Math.round(parsed / customStep) * customStep;
      setQuantity(Math.max(qtyMin, snapped));
      setQuantityInput(Math.max(qtyMin, snapped).toString());
    } else {
      setQuantityInput(quantity.toString());
    }
  };

  const handleAddToCart = () => {
    const isReadyMade = searchParams?.readyMade === "true";
    const selectedImage = activePreviewImage || searchParams?.image || product.image;
    const unitPrice = (isPens || isFlyers) ? totalPrice / quantity : totalPrice;

    const finalOptions = {
      ...options,
      ...(isBanner ? { "Meters": bannerMeters.toString() } : {}),
      ...(isReadyMade && selectedImage ? { "Ready-Made Design": selectedImage } : {}),
    };

    addItem({
      productId: product.id,
      productSlug: product.slug,
      name: product.name,
      image: selectedImage,
      uploadedImage: uploadedUrl || (isReadyMade ? selectedImage : undefined),
      price: unitPrice,
      quantity: isBanner ? 1 : quantity,
      options: finalOptions,
    });

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  const isReadyMade = searchParams?.readyMade === "true";
  const primaryImage = searchParams?.image || product.image;
  const altImage = searchParams?.altImage;
  const hasDualViews = Boolean(altImage);

  // Size chart config (Only show for Frames, T-Shirts, and Football Kits)
  const showApparelSizeChart = isTShirts || isFootballKit;

  const sizeChartSrc = categorySlug === "frame" ? "/Frame sizes.png.png"
    : showApparelSizeChart ? "/T-shirt sizes.png.png"
      : null;

  const sizeChartLabel = categorySlug === "frame" ? "Frame Size Chart"
    : showApparelSizeChart ? "Apparel Size Chart"
      : null;

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#0f1219]">
      {sizeChartOpen && sizeChartSrc && sizeChartLabel && (
        <SizeChartModal src={sizeChartSrc} label={sizeChartLabel} onClose={() => setSizeChartOpen(false)} />
      )}

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10">

        {/* Left: Image Gallery & View Switcher */}
        <div className="flex-1">
          <div className="relative w-full h-[400px] sm:h-[500px] rounded-2xl overflow-hidden bg-gray-50 dark:bg-[#1a1f2e] border border-gray-100 dark:border-gray-800 flex items-center justify-center">
            <Image src={activePreviewImage || primaryImage} alt={product.name} fill className="object-contain p-8" unoptimized />
          </div>

          {/* Dual-View Switcher Thumbnails (Football Kits) */}
          {hasDualViews && (
            <div className="flex items-center justify-center gap-3 mt-4">
              <button
                onClick={() => setActivePreviewImage(primaryImage)}
                className={`relative w-16 h-16 rounded-xl border-2 overflow-hidden transition-all ${activePreviewImage === primaryImage ? "border-[#0B4DA2] scale-105 shadow-md" : "border-gray-200 opacity-70"
                  }`}
              >
                <Image src={primaryImage} alt="Main View" fill className="object-cover" unoptimized />
                <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[9px] text-white text-center py-0.5 font-bold">
                  Selected
                </span>
              </button>

              <button
                onClick={() => setActivePreviewImage(altImage!)}
                className={`relative w-16 h-16 rounded-xl border-2 overflow-hidden transition-all ${activePreviewImage === altImage ? "border-[#0B4DA2] scale-105 shadow-md" : "border-gray-200 opacity-70"
                  }`}
              >
                <Image src={altImage!} alt="Alt View" fill className="object-cover" unoptimized />
                <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[9px] text-white text-center py-0.5 font-bold">
                  Alt View
                </span>
              </button>
            </div>
          )}

          {/* Flyers pricing info image */}
          {isFlyers && (
            <div className="mt-6">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Pricing Details</p>
              <div className="relative w-full rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm" style={{ height: 300 }}>
                <Image src="/FlyersInfo.png" alt="Flyers Pricing" fill className="object-contain" />
              </div>
            </div>
          )}

          {/* Size chart button */}
          {sizeChartSrc && (
            <button
              onClick={() => setSizeChartOpen(true)}
              className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed font-medium text-sm transition-colors hover:opacity-80"
              style={{ borderColor: siteConfig.colors.primary, color: siteConfig.colors.primary }}
            >
              <Ruler size={16} />
              View Size Chart
            </button>
          )}
        </div>

        {/* Right: Details & Form */}
        <div className="flex-1 flex flex-col gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-900 dark:text-white">
              {product.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">{product.description}</p>
          </div>

          {/* Price Display */}
          {isQuoteBased ? (
            <div className="flex items-center gap-3">
              <span
                className="inline-block px-4 py-2 rounded-xl text-sm font-bold"
                style={{ backgroundColor: siteConfig.colors.lightBar, color: siteConfig.colors.primary }}
              >
                Price varies by specs — Get a Quote
              </span>
            </div>
          ) : isBanner ? (
            <div>
              <div className="text-3xl font-bold" style={{ color: siteConfig.colors.primary }}>
                {totalPrice.toLocaleString()}{" "}
                <span className="text-xl">EGP</span>
              </div>
              <div className="text-sm text-gray-500 mt-1">{BANNER_PRICE_PER_METER} EGP / meter</div>
            </div>
          ) : (isPens || isFlyers) ? (
            <div>
              <div className="text-3xl font-bold" style={{ color: siteConfig.colors.primary }}>
                {totalPrice.toLocaleString()}{" "}
                <span className="text-xl">EGP</span>
              </div>
              <div className="text-sm text-gray-500 mt-1">Total price for {quantity} items</div>
            </div>
          ) : (
            <div className="text-3xl font-bold" style={{ color: siteConfig.colors.primary }}>
              {totalPrice.toLocaleString()} <span className="text-xl">EGP</span>
            </div>
          )}

          <hr className="border-gray-100 dark:border-gray-800" />

          {/* Banner Calculator */}
          {isBanner && (
            <div className="rounded-2xl border-2 p-5" style={{ borderColor: siteConfig.colors.lightBar, backgroundColor: "var(--light-bar)" }}>
              <div className="flex items-center gap-2 mb-3">
                <Calculator size={20} style={{ color: siteConfig.colors.primary }} />
                <span className="font-bold text-sm" style={{ color: siteConfig.colors.primary }}>Banner Size Calculator</span>
              </div>
              <label className="block text-sm font-semibold mb-1 text-gray-900 dark:text-white">How many meters do you need?</label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={bannerMeters}
                onChange={(e) => setBannerMeters(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
                className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 focus:border-[#0B4DA2] bg-white dark:bg-gray-800 outline-none text-lg font-semibold"
              />
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Rate: {BANNER_PRICE_PER_METER} EGP / meter</span>
                <span className="font-bold text-lg" style={{ color: siteConfig.colors.accent }}>
                  Total: {totalPrice.toLocaleString()} EGP
                </span>
              </div>
            </div>
          )}

          {/* Dynamic Options Form */}
          <div className="flex flex-col gap-4">
            {categorySlug === "frame" && (
              <>
                {/* Modern Frame Size Selector (Pills UI) */}
                <div>
                  <label className="block text-sm font-semibold mb-3 text-gray-900 dark:text-white">Size</label>
                  <div className="grid grid-cols-3 gap-3">
                    {FRAME_SIZES.map((sizeObj) => {
                      const fullValue = `${sizeObj.label} ${sizeObj.format}`;
                      const isSelected = (options.Size || "15×21 cm (A5)").includes(sizeObj.label);

                      return (
                        <button
                          key={sizeObj.label}
                          type="button"
                          onClick={() => handleOptionChange("Size", fullValue)}
                          className={`relative flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl border-2 transition-all duration-200 ${isSelected
                              ? "border-[#0B4DA2] bg-[#0B4DA2] text-white shadow-lg scale-[1.02]"
                              : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:border-gray-400"
                            }`}
                        >
                          {sizeObj.badge && (
                            <span
                              className={`absolute -top-2.5 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${isSelected ? "bg-[#10B981] text-white" : "bg-[#0B4DA2] text-white"
                                }`}
                            >
                              {sizeObj.badge}
                            </span>
                          )}
                          <span className="text-sm font-bold">{sizeObj.label}</span>
                          <span className={`text-xs font-semibold ${isSelected ? "text-blue-100" : "text-gray-400"}`}>
                            {sizeObj.format}
                          </span>
                          <span className={`text-xs mt-1 font-semibold ${isSelected ? "text-white" : "text-gray-500"}`}>
                            {sizeObj.price} EGP
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-900 dark:text-white">Frame Color</label>
                  <select
                    value={options.Color || "Black"}
                    onChange={(e) => handleOptionChange("Color", e.target.value)}
                    className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-[#0B4DA2] outline-none"
                  >
                    <option value="Black">Black</option>
                    <option value="Brown">Brown</option>
                    <option value="White">White</option>
                  </select>
                </div>

                {!isReadyMade && (
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      id="customDesign"
                      checked={options["Custom Design"] === "Yes"}
                      onChange={(e) => handleOptionChange("Custom Design", e.target.checked ? "Yes" : "No")}
                      className="w-4 h-4 rounded border-gray-300 text-[#0B4DA2]"
                    />
                    <label htmlFor="customDesign" className="text-sm font-medium text-gray-900 dark:text-white">Add Custom Design (+50 EGP)</label>
                  </div>
                )}
              </>
            )}

            {isApparel && (
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-900 dark:text-white">Size</label>
                <select
                  value={options.Size || "M"}
                  onChange={(e) => handleOptionChange("Size", e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-[#0B4DA2] outline-none"
                >
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                  <option value="2XL">2XL</option>
                </select>
              </div>
            )}

            {isStamp && (
              <>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-900 dark:text-white">Stamp Type & Size</label>
                  <select
                    value={options.Type || "Rectangular Standard"}
                    onChange={(e) => handleOptionChange("Type", e.target.value)}
                    className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-[#0B4DA2] outline-none"
                  >
                    <option value="Pocket Stamp">Pocket Stamp (150 EGP)</option>
                    <option value="Rectangular Standard">Rectangular Standard (250 EGP)</option>
                    <option value="Round/Square">Round/Square (350 EGP)</option>
                    <option value="Date Stamp">Date Stamp (450 EGP)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-900 dark:text-white">Ink Color</label>
                  <select
                    value={options.Ink || "Blue"}
                    onChange={(e) => handleOptionChange("Ink", e.target.value)}
                    className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-[#0B4DA2] outline-none"
                  >
                    <option value="Blue">Blue</option>
                    <option value="Black">Black</option>
                    <option value="Red">Red</option>
                  </select>
                </div>
              </>
            )}

            {isFlyers && (
              <>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-900 dark:text-white">Flyer Size</label>
                  <select
                    value={options.Size || "A5 (Half Page)"}
                    onChange={(e) => handleOptionChange("Size", e.target.value)}
                    className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-[#0B4DA2] outline-none"
                  >
                    <option value="A5 (Half Page)">A5 — Half Page</option>
                    <option value="A4 (Full Page)">A4 — Full Page</option>
                    <option value="A3">A3</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-900 dark:text-white">Paper Weight</label>
                  <select
                    value={options.Paper || "80g (Simple)"}
                    onChange={(e) => handleOptionChange("Paper", e.target.value)}
                    className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-[#0B4DA2] outline-none"
                  >
                    <option value="80g (Simple)">80g — Simple</option>
                    <option value="150g Glossy (Standard)">150g Glossy — Standard</option>
                    <option value="250g Glossy (Heavy)">250g Glossy — Heavy</option>
                    <option value="300g Cardstock (Premium)">300g Cardstock — Premium</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-900 dark:text-white">Custom Notes</label>
                  <textarea
                    value={options.Notes || ""}
                    onChange={(e) => handleOptionChange("Notes", e.target.value)}
                    placeholder="E.g. brand colours, text, logo placement..."
                    className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-[#0B4DA2] outline-none h-24 resize-none"
                  />
                </div>
              </>
            )}

            {!isReadyMade && !isQuoteBased && !isFlyers && (
              <>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-900 dark:text-white">Customization Notes</label>
                  <textarea
                    value={options.Notes || ""}
                    onChange={(e) => handleOptionChange("Notes", e.target.value)}
                    placeholder="E.g. brand colours, text, logo placement..."
                    className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-[#0B4DA2] outline-none h-24 resize-none"
                  />
                </div>

                <DesignFileUploader onUploadComplete={(url) => setUploadedUrl(url)} />
              </>
            )}

            {isQuoteBased && (
              <div className="rounded-xl p-4" style={{ backgroundColor: siteConfig.colors.lightBar }}>
                <p className="text-sm text-gray-600 mb-3">
                  Pricing for this product depends on your specifications (quantity, size, paper type, etc.).
                  Please contact us on WhatsApp to get a custom quote!
                </p>
                <button
                  onClick={() => {
                    const msg = `Hello, I'd like a quote for: ${product.name}`;
                    window.open(`https://wa.me/201041998484?text=${encodeURIComponent(msg)}`, "_blank");
                  }}
                  className="w-full py-3 rounded-xl font-bold text-white transition-all hover:-translate-y-0.5"
                  style={{ backgroundColor: "#25D366" }}
                >
                  💬 Get a Quote on WhatsApp
                </button>
              </div>
            )}
          </div>

          <hr className="border-gray-100 dark:border-gray-800 my-2" />

          {!isQuoteBased && (
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-1">
                <button
                  onClick={() => setQuantity(q => Math.max(isFlyers ? 1000 : qtyMin, q - (isFlyers ? 1000 : qtyStep)))}
                  className="w-10 h-10 flex items-center justify-center text-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors"
                >-</button>

                {isEditingQuantity ? (
                  <input
                    type="number"
                    min={isFlyers ? 1000 : qtyMin}
                    step={isFlyers ? 1000 : qtyStep}
                    autoFocus
                    value={quantityInput}
                    onChange={(e) => setQuantityInput(e.target.value)}
                    onBlur={handleQuantitySubmit}
                    onKeyDown={(e) => e.key === "Enter" && handleQuantitySubmit()}
                    className="w-16 text-center font-semibold bg-white dark:bg-gray-900 border border-[#0B4DA2] rounded outline-none text-gray-900 dark:text-white"
                  />
                ) : (
                  <span
                    onDoubleClick={() => {
                      setQuantityInput(quantity.toString());
                      setIsEditingQuantity(true);
                    }}
                    className="w-16 text-center font-semibold cursor-text select-none text-gray-900 dark:text-white"
                    title="Double-click to edit"
                  >
                    {quantity}
                  </span>
                )}

                <button
                  onClick={() => setQuantity(q => q + (isFlyers ? 1000 : qtyStep))}
                  className="w-10 h-10 flex items-center justify-center text-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors"
                >+</button>
              </div>

              {isPens && (
                <span className="text-xs text-gray-500">Min. 50 pcs • Steps of 50</span>
              )}
              {isFlyers && (
                <span className="text-xs text-gray-500">Min. 1000 pcs • Steps of 1000</span>
              )}

              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl text-white font-bold transition-transform hover:-translate-y-0.5 shadow-md hover:shadow-lg"
                style={{ backgroundColor: addedToCart ? "#10B981" : siteConfig.colors.accent }}
              >
                {addedToCart ? (
                  <><CheckCircle2 size={20} /> Added to Cart</>
                ) : (
                  <><ShoppingCart size={20} /> Add to Cart</>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}