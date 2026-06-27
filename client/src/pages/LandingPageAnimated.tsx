import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle, MessageCircle, Users, QrCode, BarChart3, Clock } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8 },
  },
};

const floatingVariants = {
  animate: {
    y: [0, -20, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
    },
  },
};

const phoneVariants = {
  hidden: { opacity: 0, scale: 0.8, x: 100 },
  visible: {
    opacity: 1,
    scale: 1,
    x: 0,
    transition: { duration: 0.8 },
  },
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6 },
  },
};

const pulseVariants = {
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
    },
  },
};

export default function LandingPageAnimated() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender-50 via-lavender-100 to-lavender-50 overflow-hidden">
      {/* Animated Floating Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="blob blob-1"
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -50, 20, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="blob blob-2"
          animate={{
            x: [0, -30, 20, 0],
            y: [0, 50, -20, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="blob blob-3"
          animate={{
            x: [0, 20, -30, 0],
            y: [0, 30, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Header */}
      <motion.header
        className="fixed top-0 w-full z-50 backdrop-blur-md bg-white/70 border-b border-lavender-200"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.img
              src="https://manus-storage-prod.s3.amazonaws.com/manus-storage/dawaa-logo_bba17934.jpg"
              alt="Dawaa Logo"
              className="w-10 h-10 rounded-lg object-cover"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <span className="text-xl font-bold text-purple-700">دعوة</span>
          </motion.div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {['الميزات', 'كيف تعمل', 'السعر'].map((item, idx) => (
              <motion.a
                key={idx}
                href={`#${item}`}
                className="text-gray-700 hover:text-purple-600 transition-colors"
                whileHover={{ scale: 1.1 }}
              >
                {item}
              </motion.a>
            ))}
            <motion.button
              className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              تسجيل الدخول
            </motion.button>
          </nav>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="space-y-4" variants={itemVariants}>
              <motion.h1
                className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight"
                variants={itemVariants}
              >
                من أول دعوة وحتى لحظة استقبال ضيوفك
              </motion.h1>
              <motion.p
                className="text-xl text-gray-600 leading-relaxed"
                variants={itemVariants}
              >
                منصة متكاملة لإدارة الدعوات والمعازيم. أرسل الدعوات عبر واتساب، تابع الردود، أصدر بطاقات QR، ونظم دخول الضيوف من مكان واحد.
              </motion.p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              variants={itemVariants}
            >
              <motion.button
                className="group bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-xl transition-all"
                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(147, 51, 234, 0.3)' }}
                whileTap={{ scale: 0.95 }}
              >
                احجز الآن
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </motion.button>
              <motion.button
                className="border-2 border-purple-300 text-purple-600 px-8 py-4 rounded-xl font-semibold hover:bg-purple-50 transition-all"
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(147, 51, 234, 0.05)' }}
                whileTap={{ scale: 0.95 }}
              >
                جرب الخدمة
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-3 gap-4 pt-8"
              variants={containerVariants}
            >
              {[
                { value: '1000+', label: 'مناسبة' },
                { value: '50K+', label: 'ضيف' },
                { value: '99%', label: 'رضا' },
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  className="bg-white/50 backdrop-blur rounded-lg p-4"
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.7)' }}
                >
                  <motion.div
                    className="text-3xl font-bold text-purple-600"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right - iPhone Mockup */}
          <motion.div
            className="relative h-full min-h-96 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {/* iPhone Frame */}
            <motion.div
              className="relative w-64 h-96 bg-black rounded-3xl shadow-2xl overflow-hidden"
              variants={phoneVariants}
              initial="hidden"
              animate={['visible', 'animate']}
            >
              {/* iPhone Notch */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-7 bg-black rounded-b-3xl z-10"></div>

              {/* Screen Content */}
              <motion.div
                className="w-full h-full bg-gradient-to-b from-gray-50 to-gray-100 pt-8 px-4 overflow-hidden"
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                {/* WhatsApp Header */}
                <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-4 rounded-t-2xl mb-4">
                  <div className="font-semibold text-sm">دعوة حفل الزفاف</div>
                  <div className="text-xs opacity-90">من دعوة</div>
                </div>

                {/* Messages */}
                <div className="space-y-3 text-xs">
                  <motion.div
                    className="flex justify-start"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="bg-gray-200 text-gray-900 px-4 py-2 rounded-2xl rounded-tl-none max-w-xs">
                      السلام عليكم ورحمة الله وبركاته 🎉
                      <br />
                      يسعدنا دعوتك لحفل زفافنا
                    </div>
                  </motion.div>

                  {/* Buttons */}
                  <motion.div
                    className="flex justify-start gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                  >
                    <motion.button
                      className="bg-green-500 text-white px-3 py-1 rounded-lg text-xs font-semibold"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      ✓ حاضر
                    </motion.button>
                    <motion.button
                      className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs font-semibold"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      ✕ معتذر
                    </motion.button>
                  </motion.div>

                  {/* QR Code */}
                  <motion.div
                    className="flex justify-start mt-4"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.5 }}
                  >
                    <div className="bg-purple-100 text-purple-900 px-4 py-2 rounded-2xl rounded-tl-none max-w-xs text-center">
                      <div className="text-xs font-semibold mb-2">بطاقة الدخول</div>
                      <motion.div
                        className="w-20 h-20 bg-white rounded border-2 border-purple-300 flex items-center justify-center mx-auto"
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        <QrCode className="w-12 h-12 text-purple-600" />
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>

            {/* Floating Cards */}
            <div className="absolute inset-0 pointer-events-none">
              {[
                { top: 0, right: 0, icon: Users, value: '150', label: 'إجمالي الضيوف', delay: 0 },
                { top: 24, left: 0, icon: CheckCircle, value: '98', label: 'حاضر', delay: 0.2 },
                { bottom: 24, right: 0, icon: Clock, value: '32', label: 'لم يؤكد', delay: 0.4 },
                { bottom: 0, left: 0, icon: MessageCircle, value: '150', label: 'تم الإرسال', delay: 0.6 },
              ].map((card, idx) => {
                const Icon = card.icon;
                return (
                  <motion.div
                    key={idx}
                    className={`absolute bg-white rounded-xl p-4 shadow-lg`}
                    style={{
                      top: card.top !== undefined ? `${card.top}px` : 'auto',
                      bottom: card.bottom !== undefined ? `${card.bottom}px` : 'auto',
                      left: card.left !== undefined ? `${card.left}px` : 'auto',
                      right: card.right !== undefined ? `${card.right}px` : 'auto',
                    }}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: card.delay }}
                    whileHover={{ scale: 1.1, boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)' }}
                  >
                    <motion.div
                      className="flex items-center gap-2"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: card.delay }}
                    >
                      <Icon className="w-5 h-5 text-purple-600" />
                      <div>
                        <div className="text-2xl font-bold text-gray-900">{card.value}</div>
                        <div className="text-xs text-gray-500">{card.label}</div>
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <motion.section
        id="how-it-works"
        className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <motion.div
          className="text-center mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            variants={itemVariants}
          >
            كيف تعمل دعوة
          </motion.h2>
          <motion.p
            className="text-xl text-gray-600"
            variants={itemVariants}
          >
            6 خطوات بسيطة لإدارة مناسبتك
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
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
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -10 }}
              >
                <motion.div
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <motion.div
                      className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-xl flex items-center justify-center font-bold text-lg"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: idx * 0.1 }}
                    >
                      {step.num}
                    </motion.div>
                    <Icon className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.desc}</p>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        id="features"
        className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <motion.div
          className="text-center mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            variants={itemVariants}
          >
            ماذا تشمل الخدمة
          </motion.h2>
          <motion.p
            className="text-xl text-gray-600"
            variants={itemVariants}
          >
            كل ما تحتاجه لإدارة مناسبتك بنجاح
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
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
            <motion.div
              key={idx}
              className="bg-white/70 backdrop-blur rounded-xl p-6 border border-lavender-200 hover:border-purple-300 transition-colors"
              variants={itemVariants}
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
            >
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: idx * 0.05 }}
                >
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                </motion.div>
                <span className="text-gray-700 font-medium">{feature}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <motion.div
          className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-3xl p-12 text-center text-white"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <motion.h2
            className="text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            جاهز لتنظيم مناسبتك؟
          </motion.h2>
          <motion.p
            className="text-xl mb-8 opacity-90"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            ابدأ الآن واستمتع بتجربة إدارة دعوات احترافية
          </motion.p>
          <motion.button
            className="bg-white text-purple-600 px-8 py-4 rounded-xl font-bold hover:shadow-lg transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            احجز الآن
          </motion.button>
        </motion.div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        className="bg-gray-900 text-gray-400 py-12 px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
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
            {[
              { title: 'الروابط', links: ['الرئيسية', 'الميزات', 'السعر'] },
              { title: 'الشركة', links: ['عن الشركة', 'المدونة', 'التواصل'] },
              { title: 'القانونية', links: ['الخصوصية', 'الشروط', 'الاستخدام'] },
            ].map((section, idx) => (
              <div key={idx}>
                <h4 className="text-white font-bold mb-4">{section.title}</h4>
                <ul className="space-y-2 text-sm">
                  {section.links.map((link, linkIdx) => (
                    <motion.li
                      key={linkIdx}
                      whileHover={{ x: 5 }}
                    >
                      <a href="#" className="hover:text-white transition">
                        {link}
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2026 دعوة. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
