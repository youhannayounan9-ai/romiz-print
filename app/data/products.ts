export interface CategoryProduct {
  id: number;
  name: string;
  description: string;
  emoji: string;
  bgColor: string;
  isNew?: boolean;
}

const productData: Record<string, CategoryProduct[]> = {
  stickers: [
    { id: 1, name: "Custom Die-Cut Stickers", description: "Any shape, any size. Weather-resistant vinyl, vibrant full-colour print. Perfect for branding & packaging.", emoji: "🏷️", bgColor: "#E8EEF7", isNew: true },
    { id: 2, name: "Round Circle Stickers", description: "Classic round stickers in glossy or matte finish. Ideal for labels, seals, and promotions.", emoji: "⭕", bgColor: "#F0EBE3" },
    { id: 3, name: "Holographic Stickers", description: "Eye-catching rainbow holographic finish. Stand out on shelves, packaging, and social media.", emoji: "✨", bgColor: "#E3EBF0", isNew: true },
    { id: 4, name: "Clear Vinyl Stickers", description: "Transparent background for a seamless look. Waterproof and UV-resistant for indoor & outdoor use.", emoji: "💎", bgColor: "#EBE3F0" },
    { id: 5, name: "Oval Stickers", description: "Elegant oval shape, perfect for product labels, gift stickers, and event branding.", emoji: "🔖", bgColor: "#E8F5E9" },
    { id: 6, name: "Rectangle Stickers", description: "Versatile rectangular stickers for address labels, barcodes, branding patches, and more.", emoji: "📋", bgColor: "#FFF3E0" },
    { id: 7, name: "Square Stickers", description: "Bold square format, great for social icons, product seals, and sticker packs.", emoji: "🟦", bgColor: "#E8EEF7" },
    { id: 8, name: "Sticker Sheets (A4)", description: "Multiple stickers on a single A4 sheet. Perfect for kits, events, or variety packs.", emoji: "📄", bgColor: "#F0EBE3" },
  ],
  "business-cards": [
    { id: 1, name: "Matte Finish Business Cards", description: "Smooth, non-glare matte lamination. Premium 400gsm card stock. Pack of 100.", emoji: "💼", bgColor: "#E8EEF7", isNew: true },
    { id: 2, name: "Glossy Business Cards", description: "High-shine glossy lamination for vivid colour reproduction. Pack of 100.", emoji: "✨", bgColor: "#F0EBE3" },
    { id: 3, name: "Spot UV Business Cards", description: "Matte base with raised UV gloss accents on logo or text. Premium, tactile finish.", emoji: "🌟", bgColor: "#E3EBF0", isNew: true },
    { id: 4, name: "Rounded Corner Cards", description: "Soft rounded corners for a modern, distinctive look. Available matte or glossy.", emoji: "🃏", bgColor: "#EBE3F0" },
    { id: 5, name: "Foil Business Cards", description: "Gold or silver foil stamping for a luxury, high-impact impression.", emoji: "🥇", bgColor: "#E8F5E9" },
    { id: 6, name: "Thick 600gsm Cards", description: "Double-layer ultra-thick card for a truly premium feel. Impressive and durable.", emoji: "📐", bgColor: "#FFF3E0" },
    { id: 7, name: "Mini Business Cards", description: "Compact 55×85mm cards — perfect for loyalty cards, appointment reminders.", emoji: "🪪", bgColor: "#E8EEF7" },
    { id: 8, name: "Square Business Cards", description: "Bold 55×55mm square format that stands out in any stack.", emoji: "🔲", bgColor: "#F0EBE3" },
  ],
  "t-shirts": [
    { id: 1, name: "Custom Cotton T-Shirt (Unisex)", description: "100% combed cotton, 180gsm. Full-colour DTF print, front & back options. S–4XL available.", emoji: "👕", bgColor: "#E8EEF7", isNew: true },
    { id: 2, name: "Premium Oversized Tee", description: "Drop-shoulder oversized fit, 220gsm. Streetwear-ready with bold print placement.", emoji: "🧥", bgColor: "#F0EBE3" },
    { id: 3, name: "Custom Polo Shirt", description: "Corporate-ready polo with embroidered or printed logo. Pique fabric, sizes S–3XL.", emoji: "👔", bgColor: "#E3EBF0" },
    { id: 4, name: "Printed Hoodie", description: "Heavyweight 320gsm fleece hoodie. All-over or chest/back print. Kangaroo pocket.", emoji: "🧤", bgColor: "#EBE3F0", isNew: true },
    { id: 5, name: "Sublimation All-Over Print Tee", description: "Edge-to-edge sublimation for maximum visual impact. Polyester blend, vibrant colours.", emoji: "🌈", bgColor: "#E8F5E9" },
    { id: 6, name: "Custom Raglan Tee", description: "Baseball-style 3/4 sleeve raglan. Sporty look for teams, events, and promotions.", emoji: "⚾", bgColor: "#FFF3E0" },
    { id: 7, name: "Kids' Printed T-Shirt", description: "Soft 160gsm cotton tee for children. Ages 2–14. Safe, non-toxic ink.", emoji: "👶", bgColor: "#E8EEF7" },
    { id: 8, name: "Team Uniform Pack (10+)", description: "Bulk team shirts with individual names & numbers. Discounts from 10 units.", emoji: "🏆", bgColor: "#F0EBE3" },
  ],
  mugs: [
    { id: 1, name: "Personalised Photo Mug (11oz)", description: "Ceramic 11oz mug with full wrap-around sublimation print. Dishwasher-safe.", emoji: "☕", bgColor: "#E8EEF7", isNew: true },
    { id: 2, name: "Magic Colour-Changing Mug", description: "Reveals your design when filled with a hot drink. Perfect for gifting.", emoji: "🔮", bgColor: "#F0EBE3" },
    { id: 3, name: "Jumbo Latte Mug (15oz)", description: "Extra-large 15oz ceramic mug. Full-colour sublimation, great for offices & gifting.", emoji: "🫖", bgColor: "#E3EBF0", isNew: true },
    { id: 4, name: "Frosted Glass Beer Mug", description: "Clear frosted glass with your logo or design. Perfect for corporate events.", emoji: "🍺", bgColor: "#EBE3F0" },
    { id: 5, name: "Stainless Steel Travel Mug", description: "Double-walled insulated 350ml travel mug with printed logo. Keeps drinks hot 6 hrs.", emoji: "🥤", bgColor: "#E8F5E9" },
    { id: 6, name: "Enamel Camping Mug", description: "Retro enamel mug with vibrant screen-print. Durable for outdoor use.", emoji: "⛺", bgColor: "#FFF3E0" },
    { id: 7, name: "Two-Tone Mug (11oz)", description: "Coloured handle & inner in your brand colour, white outer for your print.", emoji: "🎨", bgColor: "#E8EEF7" },
    { id: 8, name: "Mug Gift Box Set", description: "Custom mug presented in a branded gift box. Ideal for client & employee gifting.", emoji: "🎁", bgColor: "#F0EBE3" },
  ],
  banners: [
    { id: 1, name: "PVC Vinyl Banner (Custom Size)", description: "Durable 510gsm PVC, vivid UV print. Eyelets included. Suitable for outdoor events.", emoji: "🚩", bgColor: "#E8EEF7", isNew: true },
    { id: 2, name: "Retractable Pull-Up Banner", description: "85x200cm retractable stand with premium print. Lightweight, carry bag included.", emoji: "📢", bgColor: "#F0EBE3" },
    { id: 3, name: "Mesh Banner (Wind-Resistant)", description: "Perforated mesh for high-wind locations. Ideal for outdoor fences & scaffolding.", emoji: "🌬️", bgColor: "#E3EBF0" },
    { id: 4, name: "Fabric Tension Display", description: "Wrinkle-free fabric stretch display for exhibitions & trade shows.", emoji: "🎪", bgColor: "#EBE3F0", isNew: true },
    { id: 5, name: "Double-Sided Banner", description: "Print on both sides for maximum visibility at entrances and walkways.", emoji: "🔄", bgColor: "#E8F5E9" },
    { id: 6, name: "X-Frame Banner Stand", description: "Affordable X-frame with custom print. Quick-swap print panel, foldable frame.", emoji: "✖️", bgColor: "#FFF3E0" },
    { id: 7, name: "Teardrop Flag Banner", description: "Eye-catching teardrop shape ideal for storefronts, events, and exhibitions.", emoji: "💧", bgColor: "#E8EEF7" },
    { id: 8, name: "Step-and-Repeat Backdrop", description: "Custom branded backdrop for press events, photo booths, and brand activations.", emoji: "📸", bgColor: "#F0EBE3" },
  ],
  "vinyl-banners": [
    { id: 1, name: "Standard Vinyl Banner", description: "510gsm PVC vinyl, full-colour UV print with welded hems and eyelets. Custom sizes.", emoji: "🏳️", bgColor: "#E8EEF7", isNew: true },
    { id: 2, name: "Heavy-Duty Outdoor Banner", description: "650gsm super-strong vinyl for extreme weather. Reinforced corners and edges.", emoji: "💪", bgColor: "#F0EBE3" },
    { id: 3, name: "Blockout Vinyl Banner", description: "Opaque blockout layer prevents light show-through. Ideal for window and backlit use.", emoji: "🪟", bgColor: "#E3EBF0" },
    { id: 4, name: "Scrim Vinyl Banner", description: "Reinforced scrim mesh core for extra tear resistance. Popular for large-format prints.", emoji: "🔗", bgColor: "#EBE3F0", isNew: true },
    { id: 5, name: "Feather Flag Banner", description: "Swooping feather-blade shape for maximum attention at road-side and events.", emoji: "🪶", bgColor: "#E8F5E9" },
    { id: 6, name: "Custom Cut-Out Vinyl", description: "Die-cut vinyl shapes for unique silhouette banners and floor graphics.", emoji: "✂️", bgColor: "#FFF3E0" },
    { id: 7, name: "Hanging Vinyl Banner", description: "Grommets top and bottom for horizontal or vertical hanging indoors or outdoors.", emoji: "📌", bgColor: "#E8EEF7" },
    { id: 8, name: "Floor-Standing Vinyl Sign", description: "Vinyl graphic mounted on rigid board or foam. Perfect for wayfinding & retail.", emoji: "🗺️", bgColor: "#F0EBE3" },
  ],
  flyers: [
    { id: 1, name: "A5 Full-Colour Flyers (100 pack)", description: "148x210mm, 150gsm gloss or silk. Vibrant double-sided print. Next-day dispatch.", emoji: "📄", bgColor: "#E8EEF7", isNew: true },
    { id: 2, name: "A4 Flyers — Glossy Finish", description: "210x297mm, 150gsm gloss art paper. Bold visuals for promotions and events.", emoji: "📰", bgColor: "#F0EBE3" },
    { id: 3, name: "A6 Postcard-Size Flyers", description: "105x148mm — compact, mail-friendly. Matte or glossy. From 50 units.", emoji: "✉️", bgColor: "#E3EBF0" },
    { id: 4, name: "DL Flyers (One-Third A4)", description: "99x210mm — ideal for racks, mail inserts, and menus. Double-sided available.", emoji: "📬", bgColor: "#EBE3F0", isNew: true },
    { id: 5, name: "Premium Matte Flyers", description: "Luxury matte finish with subtle sheen. Feels premium in the hand — perfect for high-end brands.", emoji: "🎨", bgColor: "#E8F5E9" },
    { id: 6, name: "Uncoated Flyers (Writable)", description: "Natural uncoated stock — great for handwritten notes, event schedules, menus.", emoji: "✏️", bgColor: "#FFF3E0" },
    { id: 7, name: "Recycled Eco Flyers", description: "100% recycled stock for eco-conscious brands. FSC-certified, responsibly printed.", emoji: "♻️", bgColor: "#E8EEF7" },
    { id: 8, name: "Flyer Bundle (500 pack)", description: "Bulk A5 flyer pack at a discounted rate. Ideal for campaigns, letterbox drops, and events.", emoji: "📦", bgColor: "#F0EBE3" },
  ],
  folders: [
    { id: 1, name: "A4 Presentation Folder", description: "Full-colour printed A4 folder with business card slit and document pockets.", emoji: "📁", bgColor: "#E8EEF7", isNew: true },
    { id: 2, name: "Gloss Laminated Folder", description: "High-gloss lamination for a premium, professional look. Perfect for corporate use.", emoji: "✨", bgColor: "#F0EBE3" },
    { id: 3, name: "Matte Soft-Touch Folder", description: "Velvet-soft matte lamination — luxurious feel for agencies and premium brands.", emoji: "🤍", bgColor: "#E3EBF0" },
    { id: 4, name: "Two-Pocket Document Folder", description: "Twin-pocket design with business card slit and CD slot. Holds A4 documents.", emoji: "📂", bgColor: "#EBE3F0", isNew: true },
    { id: 5, name: "Printed Document Wallet", description: "Polypropylene wallet with full-colour insert label. Light and practical.", emoji: "🗂️", bgColor: "#E8F5E9" },
    { id: 6, name: "Spot UV Presentation Folder", description: "Matte base with raised glossy UV highlights on logo and key elements.", emoji: "🌟", bgColor: "#FFF3E0" },
    { id: 7, name: "Ring Binder with Wrap-Print", description: "Full-colour printed wrap on ring binder. Branded inside and out.", emoji: "📒", bgColor: "#E8EEF7" },
    { id: 8, name: "Folder + Insert Pack", description: "Presentation folder complete with custom-printed inserts. One-stop solution.", emoji: "🗃️", bgColor: "#F0EBE3" },
  ],
  magazines: [
    { id: 1, name: "Perfect Bound Magazine (A4)", description: "Glue-bound spine, A4 format, 130gsm gloss pages with 250gsm cover. 8-100 pages.", emoji: "📖", bgColor: "#E8EEF7", isNew: true },
    { id: 2, name: "Saddle-Stitched Booklet", description: "Staple-bound booklet, 8-48 pages. Great for programmes, lookbooks, catalogues.", emoji: "📔", bgColor: "#F0EBE3" },
    { id: 3, name: "Glossy Catalogue Printing", description: "Product catalogues with vibrant gloss pages and matte or gloss cover. Custom page count.", emoji: "🗒️", bgColor: "#E3EBF0" },
    { id: 4, name: "Matte Digest Magazine", description: "Half-A4 digest size — compact, modern format. 350gsm matte cover.", emoji: "📰", bgColor: "#EBE3F0", isNew: true },
    { id: 5, name: "Lookbook (A5 Portrait)", description: "Fashion and lifestyle lookbooks with premium paper and rich colour profiles.", emoji: "👗", bgColor: "#E8F5E9" },
    { id: 6, name: "Annual Report Printing", description: "Corporate annual reports with full-colour printing, charts, and professional finish.", emoji: "📊", bgColor: "#FFF3E0" },
    { id: 7, name: "Event Programme Booklet", description: "Event programmes, wedding booklets, and conference materials. From 20 copies.", emoji: "🎟️", bgColor: "#E8EEF7" },
    { id: 8, name: "Digital + Print Bundle", description: "Printed magazine with a companion PDF digital edition. Hybrid solution for modern brands.", emoji: "💻", bgColor: "#F0EBE3" },
  ],
  pens: [
    { id: 1, name: "Ballpoint Pen (Branded)", description: "Classic click-top ballpoint with your logo engraved or printed. Smooth blue ink.", emoji: "🖊️", bgColor: "#E8EEF7", isNew: true },
    { id: 2, name: "Executive Metal Pen", description: "Premium metal barrel with laser-engraved logo. Feels and writes like luxury.", emoji: "✒️", bgColor: "#F0EBE3" },
    { id: 3, name: "Stylus Touch Pen", description: "Dual-function ballpoint + capacitive stylus for tablets and phones. Branded grip.", emoji: "📱", bgColor: "#E3EBF0" },
    { id: 4, name: "Eco-Friendly Recycled Pen", description: "Made from recycled materials. Pad-printed logo. Great for sustainable brands.", emoji: "♻️", bgColor: "#EBE3F0", isNew: true },
    { id: 5, name: "Gel Ink Pen (Branded)", description: "Smooth-writing gel ink pen with full-colour barrel wrap. Comfortable rubber grip.", emoji: "🖋️", bgColor: "#E8F5E9" },
    { id: 6, name: "Highlighter Set (Branded)", description: "Set of 3 fluorescent highlighters with your brand printed on each barrel.", emoji: "🌈", bgColor: "#FFF3E0" },
    { id: 7, name: "Marker Pen (Branded)", description: "Permanent or whiteboard marker with printed logo. Boxed for gifting.", emoji: "🖌️", bgColor: "#E8EEF7" },
    { id: 8, name: "Pen Gift Set (Box of 3)", description: "Branded pen trio in a custom gift box. Ideal for client gifts and corporate events.", emoji: "🎁", bgColor: "#F0EBE3" },
  ],
  "wall-stickers": [
    { id: 1, name: "Custom Wall Decal (Any Size)", description: "Removable vinyl wall sticker. No residue, repositionable. Interior walls only.", emoji: "🖼️", bgColor: "#E8EEF7", isNew: true },
    { id: 2, name: "Office Quote Wall Sticker", description: "Inspirational or brand quote in your chosen font and colour. Easy peel-and-stick.", emoji: "💬", bgColor: "#F0EBE3" },
    { id: 3, name: "Company Logo Wall Sticker", description: "Large-format logo for reception areas, meeting rooms, and brand walls.", emoji: "🏢", bgColor: "#E3EBF0", isNew: true },
    { id: 4, name: "Kids Room Wall Art", description: "Fun, colourful, non-toxic wall stickers. Characters, animals, names. Easy to apply.", emoji: "🎨", bgColor: "#EBE3F0" },
    { id: 5, name: "Shop Window Decal", description: "Frosted, clear, or full-colour window vinyl. Promotions, hours, branding.", emoji: "🪟", bgColor: "#E8F5E9" },
    { id: 6, name: "Floor Graphic Sticker", description: "Anti-slip floor vinyl for wayfinding, branding, and safety messaging.", emoji: "👇", bgColor: "#FFF3E0" },
    { id: 7, name: "Wallpaper Mural (Custom)", description: "Full-wall photographic mural printed on premium wallpaper stock.", emoji: "🏔️", bgColor: "#E8EEF7" },
    { id: 8, name: "Frosted Glass Film", description: "Privacy frosted window film with cut-out logo or pattern. Office and retail.", emoji: "❄️", bgColor: "#F0EBE3" },
  ],
  "tote-bags": [
    { id: 1, name: "Natural Cotton Tote Bag", description: "140gsm natural cotton, full-colour screen or DTF print. Holds 10kg. 38x42cm.", emoji: "👜", bgColor: "#E8EEF7", isNew: true },
    { id: 2, name: "Canvas Tote — Heavy Duty", description: "280gsm thick canvas. Durable long-handle bag for everyday use and gifting.", emoji: "🛍️", bgColor: "#F0EBE3" },
    { id: 3, name: "Sublimation Tote Bag", description: "Full all-over sublimation print on white polyester tote. 360 degree design coverage.", emoji: "🌈", bgColor: "#E3EBF0", isNew: true },
    { id: 4, name: "Non-Woven Promo Bag", description: "Lightweight non-woven polypropylene bag. Budget-friendly for events and trade shows.", emoji: "🎪", bgColor: "#EBE3F0" },
    { id: 5, name: "Jute Eco Tote Bag", description: "Natural jute fibre bag — eco-friendly and stylish. Branded silk-screen print.", emoji: "♻️", bgColor: "#E8F5E9" },
    { id: 6, name: "Drawstring Bag", description: "Lightweight polyester drawstring backpack with full-colour logo print.", emoji: "🎒", bgColor: "#FFF3E0" },
    { id: 7, name: "Zip-Top Tote Bag", description: "Cotton tote with zip closure for secure carry. Ideal for staff and event kits.", emoji: "🤐", bgColor: "#E8EEF7" },
    { id: 8, name: "Tote Bag Bundle (50+)", description: "Bulk tote bags at discounted rates. Great for events, retail, and brand campaigns.", emoji: "📦", bgColor: "#F0EBE3" },
  ],
  brochures: [
    { id: 1, name: "Tri-Fold Brochures (100 pack)", description: "A4 folded to DL. 150gsm gloss or silk. Vibrant double-sided print, same-week dispatch.", emoji: "📋", bgColor: "#E8EEF7", isNew: true },
    { id: 2, name: "Bi-Fold Brochures (A4)", description: "A4 folded to A5. Classic 4-panel layout. 170gsm silk paper, gloss or matte laminate.", emoji: "📑", bgColor: "#F0EBE3" },
    { id: 3, name: "Z-Fold Brochures", description: "Accordion Z-fold for timeline layouts, menus, and stepped content presentation.", emoji: "📜", bgColor: "#E3EBF0" },
    { id: 4, name: "Gate-Fold Brochure", description: "Elegant double-fold opening — perfect for product launches and luxury presentations.", emoji: "🚪", bgColor: "#EBE3F0", isNew: true },
    { id: 5, name: "Premium Gloss Brochures", description: "300gsm cover with gloss laminate. Rich colour depth for premium product catalogues.", emoji: "✨", bgColor: "#E8F5E9" },
    { id: 6, name: "Soft-Touch Matte Brochures", description: "Velvety matte lamination — tactile and sophisticated. Ideal for luxury brands.", emoji: "🤍", bgColor: "#FFF3E0" },
    { id: 7, name: "Company Profile Brochure (8pp)", description: "8-page saddle-stitched company brochure. Impactful intro to your brand.", emoji: "🏢", bgColor: "#E8EEF7" },
    { id: 8, name: "Product Catalogue (16pp)", description: "16-page perfect-bound product catalogue. Full-colour with pricing grid layout.", emoji: "📗", bgColor: "#F0EBE3" },
  ],
  "roll-labels": [
    { id: 1, name: "Custom Roll Labels (White)", description: "White gloss or matte vinyl labels on a roll. Perfect for product labelling and packaging.", emoji: "🏷️", bgColor: "#E8EEF7", isNew: true },
    { id: 2, name: "Clear Transparent Roll Labels", description: "See-through labels for a no-label look. Waterproof and UV-resistant.", emoji: "💎", bgColor: "#F0EBE3" },
    { id: 3, name: "Kraft Paper Roll Labels", description: "Eco brown kraft labels for artisan, handmade, and organic product branding.", emoji: "🌿", bgColor: "#E3EBF0", isNew: true },
    { id: 4, name: "Waterproof Roll Labels", description: "100% waterproof vinyl labels for bottles, jars, outdoor products.", emoji: "💧", bgColor: "#EBE3F0" },
    { id: 5, name: "Holographic Roll Labels", description: "Silver or gold holographic foil substrate for premium product packaging.", emoji: "✨", bgColor: "#E8F5E9" },
    { id: 6, name: "Barcode & QR Roll Labels", description: "Thermal or digital printed barcode and QR code labels. Any size, core to fit your printer.", emoji: "📲", bgColor: "#FFF3E0" },
    { id: 7, name: "Food-Safe Roll Labels", description: "FDA-compliant food-safe adhesive labels for packaging, jars, and bakery products.", emoji: "🍞", bgColor: "#E8EEF7" },
    { id: 8, name: "Fragile / Warning Labels", description: "Printed alert and handling labels on roll. Customisable text and icons.", emoji: "⚠️", bgColor: "#F0EBE3" },
  ],
  "poster-printing": [
    { id: 1, name: "A1 Poster (Full Colour)", description: "594x841mm, 150gsm gloss or silk poster. Vivid print for events, retail, and displays.", emoji: "🖼️", bgColor: "#E8EEF7", isNew: true },
    { id: 2, name: "A2 Poster Print", description: "420x594mm vibrant poster. Available glossy, matte, or satin. Same-day print available.", emoji: "📸", bgColor: "#F0EBE3" },
    { id: 3, name: "A0 Large-Format Poster", description: "841x1189mm — maximum impact. Ideal for exhibitions, offices, and retail windows.", emoji: "🗺️", bgColor: "#E3EBF0" },
    { id: 4, name: "Canvas Print (Stretched)", description: "Artistic canvas prints stretched over a wooden frame. Ready to hang. Any size.", emoji: "🎨", bgColor: "#EBE3F0", isNew: true },
    { id: 5, name: "Foam Board Poster", description: "Rigid foam-backed poster for standing displays, counters, and presentations.", emoji: "📌", bgColor: "#E8F5E9" },
    { id: 6, name: "Backlit Film Poster", description: "Transparent backlit film for lightbox displays and illuminated signs.", emoji: "💡", bgColor: "#FFF3E0" },
    { id: 7, name: "Photo Poster Print", description: "High-resolution photo printing on premium photo paper. Gloss or pearl finish.", emoji: "📷", bgColor: "#E8EEF7" },
    { id: 8, name: "Event Poster Pack (10 prints)", description: "Bundle of 10 identical event posters for wider distribution. Great value.", emoji: "🎉", bgColor: "#F0EBE3" },
  ],
};

/** Default fallback products for any future categories */
function defaultProducts(categoryName: string): CategoryProduct[] {
  const palettes = ["#E8EEF7", "#F0EBE3", "#E3EBF0", "#EBE3F0", "#E8F5E9", "#FFF3E0"];
  const items = [
    { name: `Custom ${categoryName}`, desc: "High-quality print, express turnaround. Free design consultation included.", emoji: "🖨️" },
    { name: `Premium ${categoryName}`, desc: "Professional finish, vibrant colours. Any quantity from 1 to 10,000.", emoji: "⭐" },
    { name: `${categoryName} — Gloss Finish`, desc: "Cairo-made quality, shipped nationwide. Multiple finishes available.", emoji: "✨" },
    { name: `${categoryName} — Matte Finish`, desc: "Perfect for branding, gifting, or events. Bulk discounts available.", emoji: "🎨" },
    { name: `Bulk ${categoryName} Pack`, desc: "Cost-effective bulk pricing. Consistent quality across every unit.", emoji: "📦" },
    { name: `Express ${categoryName}`, desc: "Rush order available. Same-week dispatch across Egypt.", emoji: "⚡" },
    { name: `${categoryName} Gift Set`, desc: "Presentation-ready set for client and employee gifting.", emoji: "🎁" },
    { name: `Branded ${categoryName}`, desc: "Your logo, your colours, your message. From 1 to 10,000 units.", emoji: "🏷️" },
  ];
  return items.map((item, i) => ({
    id: i + 1,
    name: item.name,
    description: item.desc,
    emoji: item.emoji,
    bgColor: palettes[i % palettes.length],
    isNew: i === 0 || i === 3,
  }));
}

/** Get products for any category slug */
export function getProductsForCategory(slug: string, categoryName: string): CategoryProduct[] {
  return productData[slug] ?? defaultProducts(categoryName);
}
