import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | ROMIZ PRINT",
  description:
    "Read the Terms of Service for ROMIZ PRINT. Understand our custom printing policies, no-refund policy, design approval responsibilities, and delivery timelines.",
};

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: "#F5F7FA" }}>
      {/* Page Header */}
      <div
        className="py-16 text-center"
        style={{ backgroundColor: "#1E2530" }}
      >
        <h1
          className="text-4xl sm:text-5xl font-bold text-white mb-3"
          style={{ fontFamily: "var(--font-space-grotesk), system-ui, sans-serif" }}
        >
          Terms of Service
        </h1>
        <p className="text-sm text-gray-400">
          Last updated: August 2026
        </p>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">

        {/* English Section */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div
              className="h-1 w-12 rounded-full"
              style={{ backgroundColor: "#FF7A1A" }}
            />
            <h2
              className="text-xl font-bold uppercase tracking-widest"
              style={{ color: "#0B4DA2" }}
            >
              English
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-8 sm:p-10 space-y-6">
            <p className="text-gray-700 leading-relaxed">
              Welcome to Romiz.Print. By placing an order on our website or
              through our official sales channels, you agree to comply with the
              following terms:
            </p>

            <div>
              <h3
                className="text-base font-bold mb-2"
                style={{ color: "#0B4DA2" }}
              >
                Custom Printing &amp; Manufacturing
              </h3>
              <p className="text-gray-700 leading-relaxed">
                All items produced by Romiz.Print (including business cards,
                custom apparel, posters, packaging, stickers, and promotional
                gifts) are custom-made according to client specifications and
                approvals.
              </p>
            </div>

            <div>
              <h3
                className="text-base font-bold mb-2"
                style={{ color: "#0B4DA2" }}
              >
                Strict No Refund &amp; No Cancellation Policy
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Because all products are custom-manufactured specifically for
                you upon purchase, orders cannot be cancelled, modified, or
                refunded once an order is placed and processing has begun.
                Please carefully review your order details, designs, quantities,
                and proof sheets before confirming payment.
              </p>
            </div>

            <div>
              <h3
                className="text-base font-bold mb-2"
                style={{ color: "#0B4DA2" }}
              >
                Client Design Approval
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Clients are solely responsible for verifying the accuracy of
                their submitted artwork (including spelling, image resolution,
                colors, and dimensions) prior to order placement. Romiz.Print
                is not liable for errors present in client-approved design
                files.
              </p>
            </div>

            <div>
              <h3
                className="text-base font-bold mb-2"
                style={{ color: "#0B4DA2" }}
              >
                Color Variations (RGB to CMYK)
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Slight color variations may occur between digital screen
                previews (RGB) and final printed products (CMYK) due to display
                calibration differences. This is a standard aspect of the
                printing industry and does not constitute a manufacturing
                defect.
              </p>
            </div>

            <div>
              <h3
                className="text-base font-bold mb-2"
                style={{ color: "#0B4DA2" }}
              >
                Shipping &amp; Delivery Timelines
              </h3>
              <p className="text-gray-700 leading-relaxed">
                All estimated production and delivery times are approximate.
                Delays caused by third-party shipping carriers do not entitle
                the client to order cancellations or refunds.
              </p>
            </div>

            <div>
              <h3
                className="text-base font-bold mb-2"
                style={{ color: "#0B4DA2" }}
              >
                Defects or Printing Errors
              </h3>
              <p className="text-gray-700 leading-relaxed">
                If your items arrive physically damaged or with a manufacturing
                defect that strays significantly from the approved proof, please
                contact our support team within{" "}
                <strong>48 hours of delivery</strong> with photos of the issue
                for a replacement review.
              </p>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400 uppercase tracking-widest font-semibold">
            النسخة العربية
          </span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Arabic Section */}
        <section dir="rtl">
          <div className="flex items-center gap-3 mb-8 flex-row-reverse">
            <div
              className="h-1 w-12 rounded-full"
              style={{ backgroundColor: "#FF7A1A" }}
            />
            <h2
              className="text-xl font-bold uppercase tracking-widest"
              style={{ color: "#0B4DA2" }}
            >
              العربية
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-8 sm:p-10 space-y-6 text-right">
            <p className="text-gray-700 leading-relaxed text-lg">
              أهلاً بك في Romiz.Print. عند إتمام أي طلب عبر موقعنا الإلكتروني
              أو قنوات البيع الخاصة بنا، فإنك توافق على الالتزام بالشروط
              والأحكام التالية:
            </p>

            <div>
              <h3
                className="text-base font-bold mb-2 text-lg"
                style={{ color: "#0B4DA2" }}
              >
                الطباعة والتصنيع المخصص
              </h3>
              <p className="text-gray-700 leading-relaxed">
                جميع المنتجات المطبوعة (مثل كروت الشخصية، الملابس، البوسترات،
                العلب، الاستيكرات، والهدايا الترويجية) يتم تصنيعها خصيصاً
                بناءً على طلب العميل وتفاصيله المحددة.
              </p>
            </div>

            <div>
              <h3
                className="text-base font-bold mb-2 text-lg"
                style={{ color: "#0B4DA2" }}
              >
                سياسة عدم الإلغاء وعدم الاسترجاع
              </h3>
              <p className="text-gray-700 leading-relaxed">
                نظراً لأن المنتجات تُصنع وتُطبع خصيصاً لك بمجرد تأكيد الطلب،
                فلا يُسمح بإلغاء الطلب، تعديله، أو استرداد قيمته المالية بعد
                إتمامه وبدء عملية التنفيذ. يرجى مراجعة تفاصيل الطلب،
                التصميم، الكميات، والمعاينة جيداً قبل الدفع.
              </p>
            </div>

            <div>
              <h3
                className="text-base font-bold mb-2 text-lg"
                style={{ color: "#0B4DA2" }}
              >
                مسؤولية اعتماد التصميم
              </h3>
              <p className="text-gray-700 leading-relaxed">
                يتحمل العميل المسؤولية الكاملة عن مراجعة وتدقيق التصميمات
                المرفقة (شاملة الأخطاء الإملائية، جودة الصور، الألوان،
                والمقاسات) قبل تأكيد الطلب. لا نتحمل مسؤولية أي أخطاء موجودة
                في الملفات المعتمدة من العميل.
              </p>
            </div>

            <div>
              <h3
                className="text-base font-bold mb-2 text-lg"
                style={{ color: "#0B4DA2" }}
              >
                درجات الألوان (Color Variation)
              </h3>
              <p className="text-gray-700 leading-relaxed">
                قد يوجد اختلاف بسيط جداً وغير ملحوظ في درجات الألوان بين
                الشاشات الرقمية (RGB) وألوان الطباعة الفعلية (CMYK) نظراً
                لاختلاف وسائط العرض، وهذا أمر طبيعي في صناعة الطباعة ولا
                يُعد عيباً مصنعياً.
              </p>
            </div>

            <div>
              <h3
                className="text-base font-bold mb-2 text-lg"
                style={{ color: "#0B4DA2" }}
              >
                مواعيد الشحن والتوصيل
              </h3>
              <p className="text-gray-700 leading-relaxed">
                جميع مواعيد الشحن والتسليم الموضحة هي مواعيد تقديرية. أي
                تأخير خارج عن إرادتنا ناتج عن شركات الشحن والتوصيل لا يعطي
                الحق للعميل في إلغاء الطلب أو المطالبة باسترداد قيمته.
              </p>
            </div>

            <div>
              <h3
                className="text-base font-bold mb-2 text-lg"
                style={{ color: "#0B4DA2" }}
              >
                العيوب المصنعية أو التلف
              </h3>
              <p className="text-gray-700 leading-relaxed">
                في حال وصول الطلب مع وجود تلف في الشحن أو عيب مصنعي واضح
                يختلف عن المعاينة المعتمدة، يرجى التواصل مع فريق الدعم خلال{" "}
                <strong>48 ساعة من الاستلام</strong> مرفقاً بصور المشكلة
                لمراجعة واستبدال المنتج.
              </p>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
