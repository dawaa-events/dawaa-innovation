import { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle, MessageCircle, Users, QrCode, BarChart3, Clock } from 'lucide-react';

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0);
  const [phoneY, setPhoneY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setPhoneY(window.scrollY * 0.5);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender-50 via-lavender-100 to-lavender-50 overflow-hidden">
      {/* Floating Blobs Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      {/* Header */}
      <header className="fixed top-0 w-full z-50 backdrop-blur-md bg-white/70 border-b border-lavender-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img 
              src="https://manus-storage-prod.s3.amazonaws.com/manus-storage/dawaa-logo_bba17934.jpg" 
              alt="Dawaa Logo" 
              className="w-10 h-10 rounded-lg object-cover"
            />
            <span className="text-xl font-bold text-purple-700">دعوة</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-700 hover:text-purple-600 transition-colors">الميزات</a>
            <a href="#how-it-works" className="text-gray-700 hover:text-purple-600 transition-colors">كيف تعمل</a>
            <a href="#pricing" className="text-gray-700 hover:text-purple-600 transition-colors">السعر</a>
            <button className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all">
              تسجيل الدخول
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                من أول دعوة وحتى لحظة استقبال ضيوفك
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                منصة متكاملة لإدارة الدعوات والمعازيم. أرسل الدعوات عبر واتساب، تابع الردود، أصدر بطاقات QR، ونظم دخول الضيوف من مكان واحد.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="group bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-xl transition-all hover:scale-105">
                احجز الآن
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="border-2 border-purple-300 text-purple-600 px-8 py-4 rounded-xl font-semibold hover:bg-purple-50 transition-all">
                جرب الخدمة
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8">
              <div className="bg-white/50 backdrop-blur rounded-lg p-4">
                <div className="text-3xl font-bold text-purple-600">1000+</div>
                <div className="text-sm text-gray-600">مناسبة</div>
              </div>
              <div className="bg-white/50 backdrop-blur rounded-lg p-4">
                <div className="text-3xl font-bold text-purple-600">50K+</div>
                <div className="text-sm text-gray-600">ضيف</div>
              </div>
              <div className="bg-white/50 backdrop-blur rounded-lg p-4">
                <div className="text-3xl font-bold text-purple-600">99%</div>
                <div className="text-sm text-gray-600">رضا</div>
              </div>
            </div>
          </div>

          {/* Right - iPhone Mockup */}
          <div className="relative h-full min-h-96 flex items-center justify-center">
            {/* iPhone Frame */}
            <div 
              className="relative w-64 h-96 bg-black rounded-3xl shadow-2xl overflow-hidden float-animation"
              style={{ transform: `translateY(${phoneY}px)` }}
            >
              {/* iPhone Notch */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-7 bg-black rounded-b-3xl z-10"></div>

              {/* Screen Content - WhatsApp Style */}
              <div className="w-full h-full bg-gradient-to-b from-gray-50 to-gray-100 pt-8 px-4 overflow-hidden">
                {/* WhatsApp Header */}
                <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-4 rounded-t-2xl mb-4">
                  <div className="font-semibold text-sm">دعوة حفل الزفاف</div>
                  <div className="text-xs opacity-90">من دعوة</div>
                </div>

                {/* Messages */}
                <div className="space-y-3 text-xs">
                  {/* Incoming Message */}
                  <div className="flex justify-start">
                    <div className="bg-gray-200 text-gray-900 px-4 py-2 rounded-2xl rounded-tl-none max-w-xs">
                      السلام عليكم ورحمة الله وبركاته 🎉
                      <br />
                      يسعدنا دعوتك لحفل زفافنا
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex justify-start gap-2">
                    <button className="bg-green-500 text-white px-3 py-1 rounded-lg text-xs font-semibold">
                      ✓ حاضر
                    </button>
                    <button className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs font-semibold">
                      ✕ معتذر
                    </button>
                  </div>

                  {/* QR Code Message */}
                  <div className="flex justify-start mt-4">
                    <div className="bg-purple-100 text-purple-900 px-4 py-2 rounded-2xl rounded-tl-none max-w-xs text-center">
                      <div className="text-xs font-semibold mb-2">بطاقة الدخول</div>
                      <div className="w-20 h-20 bg-white rounded border-2 border-purple-300 flex items-center justify-center mx-auto">
                        <QrCode className="w-12 h-12 text-purple-600" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Cards Around iPhone */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Total Guests Card */}
              <div className="absolute top-0 right-0 bg-white rounded-xl p-4 shadow-lg float-fast">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  <div>
                    <div className="text-2xl font-bold text-gray-900">150</div>
                    <div className="text-xs text-gray-500">إجمالي الضيوف</div>
                  </div>
                </div>
              </div>

              {/* Confirmed Card */}
              <div className="absolute top-24 left-0 bg-white rounded-xl p-4 shadow-lg float-animation">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <div>
                    <div className="text-2xl font-bold text-gray-900">98</div>
                    <div className="text-xs text-gray-500">حاضر</div>
                  </div>
                </div>
              </div>

              {/* Pending Card */}
              <div className="absolute bottom-24 right-0 bg-white rounded-xl p-4 shadow-lg float-slow">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-yellow-500" />
                  <div>
                    <div className="text-2xl font-bold text-gray-900">32</div>
                    <div className="text-xs text-gray-500">لم يؤكد</div>
                  </div>
                </div>
              </div>

              {/* Sent Card */}
              <div className="absolute bottom-0 left-0 bg-white rounded-xl p-4 shadow-lg float-fast">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-blue-500" />
                  <div>
                    <div className="text-2xl font-bold text-gray-900">150</div>
                    <div className="text-xs text-gray-500">تم الإرسال</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">كيف تعمل دعوة</h2>
          <p className="text-xl text-gray-600">6 خطوات بسيطة لإدارة مناسبتك</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { num: 1, title: 'إنشاء المناسبة', desc: 'أنشئ مناسبتك الجديدة بسهولة', icon: MessageCircle },
            { num: 2, title: 'إضافة الضيوف', desc: 'أضف قائمة الضيوف من Excel أو يدوياً', icon: Users },
            { num: 3, title: 'إرسال الدعوات', desc: 'أرسل الدعوات عبر واتساب فوراً', icon: MessageCircle },
            { num: 4, title: 'متابعة الردود', desc: 'تابع ردود الضيوف بشكل مباشر', icon: CheckCircle },
            { num: 5, title: 'بطاقات QR', desc: 'أصدر بطاقات دخول QR فريدة', icon: QrCode },
            { num: 6, title: 'التقارير', desc: 'احصل على تقارير شاملة عن المناسبة', icon: BarChart3 },
          ].map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="group">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-2">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-xl flex items-center justify-center font-bold text-lg">
                      {step.num}
                    </div>
                    <Icon className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">ماذا تشمل الخدمة</h2>
          <p className="text-xl text-gray-600">كل ما تحتاجه لإدارة مناسبتك بنجاح</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            'إرسال الدعوات عبر واتساب',
            'متابعة الحضور',
            'بطاقات دخول QR',
            'سكيورتي وتنظيم الدخول',
            'رسائل تذكير',
            'تقارير نهائية',
            'شاشة ترحيبية',
            'تصوير فوري',
            'إدارة العملاء',
            'تكاملات احترافية',
            'دعم 24/7',
            'ضمان 100%',
          ].map((feature, idx) => (
            <div key={idx} className="bg-white/70 backdrop-blur rounded-xl p-6 border border-lavender-200 hover:border-purple-300 transition-colors">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                <span className="text-gray-700 font-medium">{feature}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-3xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">جاهز لتنظيم مناسبتك؟</h2>
          <p className="text-xl mb-8 opacity-90">ابدأ الآن واستمتع بتجربة إدارة دعوات احترافية</p>
          <button className="bg-white text-purple-600 px-8 py-4 rounded-xl font-bold hover:shadow-lg transition-all hover:scale-105">
            احجز الآن
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
            <div className="flex items-center gap-2 mb-4">
              <img 
                src="https://manus-storage-prod.s3.amazonaws.com/manus-storage/dawaa-logo_bba17934.jpg" 
                alt="Dawaa Logo" 
                className="w-8 h-8 rounded object-cover"
              />
              <span className="text-white font-bold">دعوة</span>
            </div>
              <p className="text-sm">منصة متكاملة لإدارة الدعوات والمعازيم</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">الروابط</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">الرئيسية</a></li>
                <li><a href="#" className="hover:text-white transition">الميزات</a></li>
                <li><a href="#" className="hover:text-white transition">السعر</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">الشركة</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">عن الشركة</a></li>
                <li><a href="#" className="hover:text-white transition">المدونة</a></li>
                <li><a href="#" className="hover:text-white transition">التواصل</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">القانونية</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">الخصوصية</a></li>
                <li><a href="#" className="hover:text-white transition">الشروط</a></li>
                <li><a href="#" className="hover:text-white transition">الاستخدام</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2026 دعوة. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
