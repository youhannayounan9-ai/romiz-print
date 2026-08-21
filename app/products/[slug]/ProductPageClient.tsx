"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShoppingCart, Upload, CheckCircle2 } from "lucide-react";
import { siteConfig } from "../../config/site";
import { getProductBySlug, productData } from "../../data/products";
import { useCart } from "../../context/CartContext";

export default function ProductPageClient({ 
  productSlug,
  searchParams,
}: { 
  productSlug: string;
  searchParams?: { image?: string; readyMade?: string };
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

  // Upload simulation state
  const [uploadState, setUploadState] = useState<"idle" | "uploading" | "success">("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  if (typeof window !== "undefined") {
    console.log("🔍 ProductPageClient - received slug:", productSlug);
    const allProducts = Object.values(productData).flat();
    console.log("🔍 Available product slugs:", allProducts.map(p => ({ name: p.name, slug: p.slug })));
  }

  const result = getProductBySlug(productSlug);
  const product = result?.product;
  const categorySlug = result?.categorySlug;

  if (typeof window !== "undefined") {
    console.log("🔍 Found product:", product ? product.name : "NOT FOUND");
    if (!product) {
      console.error("❌ Product not found for slug:", productSlug);
    }
  }

  useEffect(() => {
    if (product) {
      setTotalPrice(product.basePrice);
      // Initialize default options
      if (categorySlug === "frame") {
        setOptions({ size: "15x21 cm", color: "Black", "custom design": "No" });
      } else if (categorySlug === "t-shirts") {
        setOptions({ print: "Standard" });
      }
    }
    setLoaded(true);
  }, [product, categorySlug]);

  // Recalculate price when options change
  useEffect(() => {
    if (!product) return;
    let newPrice = product.basePrice;

    if (categorySlug === "frame") {
      if (options.size === "20x30 cm") newPrice = 350;
      else if (options.size === "30x40 cm") newPrice = 500;
      else newPrice = 250; // 15x21 cm

      if (options["custom design"] === "Yes") newPrice += 50;
    } else if (categorySlug === "t-shirts") {
      if (options.print === "Custom Print") newPrice = 750;
      else newPrice = 700;
    }

    setTotalPrice(newPrice);
  }, [options, categorySlug, product]);

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
    if (!isNaN(parsed) && parsed > 0) {
      setQuantity(parsed);
    } else {
      setQuantityInput(quantity.toString());
    }
  };

  const handleSimulatedUpload = () => {
    setUploadState("uploading");
    setUploadProgress(0);
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setUploadState("success");
        setUploadedUrl("https://uploadthing.com/f/simulated-file.pdf");
      }
    }, 200);
  };

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      image: searchParams?.image || product.image,
      price: totalPrice,
      quantity: quantity,
      options: {
        ...options,
        ...(uploadedUrl ? { "Design File": uploadedUrl } : {})
      },
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  const isReadyMade = searchParams?.readyMade === "true";
  const displayImage = searchParams?.image || product.image;

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10">
        
        {/* Left: Image Gallery */}
        <div className="flex-1">
          <div className="relative w-full h-[400px] sm:h-[500px] rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center">
            <Image src={displayImage} alt={product.name} fill className="object-contain p-8" />
          </div>
          {/* Note: We could add a mini carousel here for extra images if needed */}
        </div>

        {/* Right: Details & Form */}
        <div className="flex-1 flex flex-col gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2" style={{ color: siteConfig.colors.dark }}>
              {product.name}
            </h1>
            <p className="text-gray-600 leading-relaxed text-lg">{product.description}</p>
          </div>

          <div className="text-3xl font-bold" style={{ color: siteConfig.colors.primary }}>
            {totalPrice} <span className="text-xl">EGP</span>
          </div>

          <hr className="border-gray-100" />

          {/* Dynamic Options Form */}
          <div className="flex flex-col gap-4">
            {categorySlug === "frame" && (
              <>
                <div>
                  <label className="block text-sm font-semibold mb-1">Size</label>
                  <select 
                    value={options.size || "15x21 cm"}
                    onChange={(e) => handleOptionChange("size", e.target.value)}
                    className="w-full p-3 rounded-lg border border-gray-200 focus:border-[#0B4DA2] focus:ring-1 focus:ring-[#0B4DA2] outline-none transition-colors"
                  >
                    <option value="15x21 cm">15x21 cm (250 EGP)</option>
                    <option value="20x30 cm">20x30 cm (350 EGP)</option>
                    <option value="30x40 cm">30x40 cm (500 EGP)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Frame Color</label>
                  <select 
                    value={options.color || "Black"}
                    onChange={(e) => handleOptionChange("color", e.target.value)}
                    className="w-full p-3 rounded-lg border border-gray-200 focus:border-[#0B4DA2] outline-none"
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
                      checked={options["custom design"] === "Yes"}
                      onChange={(e) => handleOptionChange("custom design", e.target.checked ? "Yes" : "No")}
                      className="w-4 h-4 rounded border-gray-300 text-[#0B4DA2]"
                    />
                    <label htmlFor="customDesign" className="text-sm font-medium">Add Custom Design (+50 EGP)</label>
                  </div>
                )}
              </>
            )}

            {categorySlug === "t-shirts" && (
              <div>
                <label className="block text-sm font-semibold mb-1">Print Option</label>
                <select 
                  value={options.print || "Standard"}
                  onChange={(e) => handleOptionChange("print", e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-200 focus:border-[#0B4DA2] outline-none"
                >
                  <option value="Standard">Standard (700 EGP)</option>
                  <option value="Custom Print">Custom Print (750 EGP)</option>
                </select>
              </div>
            )}

            {/* General Customization Note & File Upload (simulated) */}
            {!isReadyMade && (
              <>
                <div>
                  <label className="block text-sm font-semibold mb-1">Customization Notes</label>
                  <textarea 
                    value={options.notes || ""}
                    onChange={(e) => handleOptionChange("notes", e.target.value)}
                    placeholder="E.g. brand colours, text, logo placement..."
                    className="w-full p-3 rounded-lg border border-gray-200 focus:border-[#0B4DA2] outline-none h-24 resize-none"
                  />
                </div>
                
                {uploadState === "idle" && (
                  <button 
                    onClick={handleSimulatedUpload}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-lg border-2 border-dashed border-gray-300 text-gray-600 hover:border-[#0B4DA2] hover:text-[#0B4DA2] transition-colors"
                  >
                    <Upload size={18} />
                    Upload Design File (Optional)
                  </button>
                )}
                
                {uploadState === "uploading" && (
                  <div className="w-full py-3 px-4 rounded-lg border-2 border-gray-200 bg-gray-50 flex flex-col gap-2">
                    <div className="flex justify-between text-sm font-medium text-gray-600">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-[#0B4DA2] h-2 rounded-full transition-all duration-200" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                  </div>
                )}
                
                {uploadState === "success" && (
                  <div className="w-full py-3 px-4 rounded-lg border-2 border-green-500 bg-green-50 flex items-center justify-center gap-2 text-green-700 font-medium">
                    <CheckCircle2 size={18} />
                    Design File Uploaded
                  </div>
                )}
              </>
            )}
          </div>

          <hr className="border-gray-100 my-2" />

          {/* Add to Cart / Quantity */}
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 p-1">
              <button 
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center text-xl font-medium hover:bg-gray-200 rounded-md transition-colors"
              >-</button>
              
              {isEditingQuantity ? (
                <input 
                  type="number"
                  min="1"
                  autoFocus
                  value={quantityInput}
                  onChange={(e) => setQuantityInput(e.target.value)}
                  onBlur={handleQuantitySubmit}
                  onKeyDown={(e) => e.key === "Enter" && handleQuantitySubmit()}
                  className="w-12 text-center font-semibold bg-white border border-[#0B4DA2] rounded outline-none"
                />
              ) : (
                <span 
                  onDoubleClick={() => {
                    setQuantityInput(quantity.toString());
                    setIsEditingQuantity(true);
                  }}
                  className="w-12 text-center font-semibold cursor-text select-none"
                  title="Double-click to edit"
                >
                  {quantity}
                </span>
              )}

              <button 
                onClick={() => setQuantity(q => q + 1)}
                className="w-10 h-10 flex items-center justify-center text-xl font-medium hover:bg-gray-200 rounded-md transition-colors"
              >+</button>
            </div>
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
        </div>
      </div>
    </div>
  );
}
