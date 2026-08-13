import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | ROMIZ PRINT",
  description:
    "Learn how ROMIZ PRINT collects, uses, and protects your personal information and design files.",
};

export default function PrivacyPolicyPage() {
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
          Privacy Policy
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
              At Romiz.Print, we value your privacy and are committed to
              protecting your personal information. This Privacy Policy outlines
              how we collect, use, and safeguard your data when you use our
              website and printing services.
            </p>

            <div>
              <h3
                className="text-base font-bold mb-2"
                style={{ color: "#0B4DA2" }}
              >
                Information We Collect
              </h3>
              <p className="text-gray-700 leading-relaxed">
                We collect personal details necessary to process your orders,
                including your name, contact phone number, shipping address,
                email address, and uploaded design files or artwork.
              </p>
            </div>

            <div>
              <h3
                className="text-base font-bold mb-2"
                style={{ color: "#0B4DA2" }}
              >
                How We Use Your Data
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Your information is strictly used to fulfill custom printing
                orders, manage delivery, send order status updates, and provide
                customer support.
              </p>
            </div>

            <div>
              <h3
                className="text-base font-bold mb-2"
                style={{ color: "#0B4DA2" }}
              >
                Design &amp; File Security
              </h3>
              <p className="text-gray-700 leading-relaxed">
                All design files, logos, and artwork submitted to us remain your
                intellectual property. We do not sell, share, or reuse your
                custom designs for any unauthorized third-party commercial
                purposes.
              </p>
            </div>

            <div>
              <h3
                className="text-base font-bold mb-2"
                style={{ color: "#0B4DA2" }}
              >
                Data Protection
              </h3>
              <p className="text-gray-700 leading-relaxed">
                We implement industry-standard security measures to keep your
                contact details and project files safe from unauthorized access.
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
              نحن في Romiz.Print نلتزم بحماية خصوصيتك وصيانة بياناتك
              الشخصية. توضح هذه السياسة كيفية جمع بياناتك واستخدامها وحمايتها
              عند التعامل مع موقعنا وخيارات الطباعة لدينا.
            </p>

            <div>
              <h3
                className="text-base font-bold mb-2 text-lg"
                style={{ color: "#0B4DA2" }}
              >
                البيانات التي نجمعها
              </h3>
              <p className="text-gray-700 leading-relaxed">
                نجمع البيانات الضرورية لتنفيذ طلبك وإيصاله، وتشمل الاسم، رقم
                الهاتف، عنوان الشحن، البريد الإلكتروني، بالإضافة إلى ملفات
                والتصميمات المرفقة للطباعة.
              </p>
            </div>

            <div>
              <h3
                className="text-base font-bold mb-2 text-lg"
                style={{ color: "#0B4DA2" }}
              >
                كيفية استخدام البيانات
              </h3>
              <p className="text-gray-700 leading-relaxed">
                تُستخدم بياناتك حصرياً لمعالجة الطلبات، تنظيم عمليات الشحن
                والتوصيل، إرسال تحديثات حالة الطلب، وتوفير الدعم الفني.
              </p>
            </div>

            <div>
              <h3
                className="text-base font-bold mb-2 text-lg"
                style={{ color: "#0B4DA2" }}
              >
                حماية الملكية الفكرية للتصميمات
              </h3>
              <p className="text-gray-700 leading-relaxed">
                جميع التصميمات، الشعارات، والملفات المرفقة من قبل العملاء تُعد
                ملكية خاصة بهم. نلتزم بعدم استخدام، مشاركة، أو إعادة طباعة أي
                تصميم خاص لأي أغراض تجارية أخرى.
              </p>
            </div>

            <div>
              <h3
                className="text-base font-bold mb-2 text-lg"
                style={{ color: "#0B4DA2" }}
              >
                أمان البيانات
              </h3>
              <p className="text-gray-700 leading-relaxed">
                نطبق أعلى معايير الأمان التقنية للحفاظ على معلومات الاتصال
                الخاصة بك وملفات مشروعك بعيداً عن أي وصول غير مصرح به.
              </p>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
