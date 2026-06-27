import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Clock, MessageCircle, QrCode, Share2, Download } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function CustomerPortalPage() {
  const eventData = {
    name: 'حفل زفاف أحمد وفاطمة',
    date: 'الجمعة، 15 يونيو 2026',
    time: '08:00 مساءً',
    location: 'قاعة الفردوس، الرياض',
    organizer: 'أحمد محمد',
    description: 'يسعدنا دعوتك لحضور حفل زفافنا. نتطلع لحضورك معنا في هذه المناسبة السعيدة.',
    guests: {
      total: 150,
      confirmed: 98,
      declined: 32,
      pending: 20,
    },
  };

  const messages = [
    { id: 1, text: 'مرحباً! تأكد من وصولك قبل الساعة 7:45 مساءً', time: 'منذ ساعة' },
    { id: 2, text: 'تم تحديث قائمة الضيوف', time: 'منذ 3 ساعات' },
    { id: 3, text: 'شكراً على تأكيد حضورك!', time: 'منذ يوم' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender-50 via-lavender-100 to-lavender-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">{eventData.name}</h1>
            <p className="text-gray-600 mt-2">بطاقة الدعوة الخاصة بك</p>
          </div>
          <motion.div
            className="text-right"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <div className="text-4xl">🎉</div>
          </motion.div>
        </div>
      </motion.div>

      {/* Event Details Card */}
      <motion.div
        className="bg-white rounded-2xl shadow-lg p-8 mb-8"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        whileHover={{ boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)' }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">تفاصيل المناسبة</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">التاريخ والوقت</p>
                <p className="text-lg font-semibold text-gray-900">{eventData.date}</p>
                <p className="text-gray-600">{eventData.time}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">المكان</p>
                <p className="text-lg font-semibold text-gray-900">{eventData.location}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">المنظم</p>
                <p className="text-lg font-semibold text-gray-900">{eventData.organizer}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">الوصف</p>
                <p className="text-gray-700 mt-2">{eventData.description}</p>
              </div>
            </div>
          </div>

          {/* QR Code Section */}
          <motion.div
            className="flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-lavender-50 rounded-xl p-8"
            whileHover={{ scale: 1.05 }}
          >
            <h4 className="text-lg font-bold text-gray-900 mb-4">بطاقة الدخول</h4>
            <motion.div
              className="bg-white p-4 rounded-lg shadow-lg mb-4"
              animate={{ rotate: [0, 2, -2, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <div className="w-40 h-40 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
                <QrCode className="w-32 h-32 text-white" />
              </div>
            </motion.div>
            <p className="text-sm text-gray-600 text-center mb-4">
              أظهر هذه البطاقة عند الدخول
            </p>
            <div className="flex gap-2 w-full">
              <motion.button
                className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download className="w-4 h-4" />
                تحميل
              </motion.button>
              <motion.button
                className="flex-1 border-2 border-purple-600 text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 transition-colors flex items-center justify-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Share2 className="w-4 h-4" />
                مشاركة
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Statistics */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {[
          { label: 'إجمالي الضيوف', value: eventData.guests.total, icon: '👥', color: 'from-blue-500 to-blue-600' },
          { label: 'مؤكدون', value: eventData.guests.confirmed, icon: '✓', color: 'from-green-500 to-green-600' },
          { label: 'معتذرون', value: eventData.guests.declined, icon: '✕', color: 'from-red-500 to-red-600' },
          { label: 'قيد الانتظار', value: eventData.guests.pending, icon: '⏳', color: 'from-yellow-500 to-yellow-600' },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            variants={itemVariants}
            className={`bg-gradient-to-br ${stat.color} rounded-xl p-6 text-white shadow-lg`}
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-3xl mb-2">{stat.icon}</div>
            <p className="text-sm opacity-90">{stat.label}</p>
            <p className="text-3xl font-bold">{stat.value}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Messages and Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages */}
        <motion.div
          className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)' }}
        >
          <div className="flex items-center gap-2 mb-6">
            <MessageCircle className="w-6 h-6 text-purple-600" />
            <h3 className="text-xl font-bold text-gray-900">الرسائل</h3>
          </div>
          <div className="space-y-4">
            {messages.map((msg, idx) => (
              <motion.div
                key={msg.id}
                className="bg-gradient-to-r from-purple-50 to-transparent border-r-4 border-purple-600 p-4 rounded-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ x: 5 }}
              >
                <p className="text-gray-900 font-medium">{msg.text}</p>
                <p className="text-sm text-gray-500 mt-2">{msg.time}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Your Response */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-6"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)' }}
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6">ردك</h3>
          <div className="space-y-3">
            <motion.button
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-3 rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2 font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <CheckCircle2 className="w-5 h-5" />
              حاضر
            </motion.button>
            <motion.button
              className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-3 rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2 font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <XCircle className="w-5 h-5" />
              معتذر
            </motion.button>
            <motion.button
              className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-4 py-3 rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2 font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Clock className="w-5 h-5" />
              لم أقرر بعد
            </motion.button>
          </div>

          {/* Current Status */}
          <motion.div
            className="mt-6 p-4 bg-gradient-to-r from-green-50 to-transparent border-l-4 border-green-500 rounded-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-sm text-gray-600">حالتك الحالية</p>
            <p className="text-lg font-bold text-green-600">✓ حاضر</p>
            <p className="text-xs text-gray-500 mt-2">تم تأكيد حضورك في 10 يونيو 2026</p>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer Info */}
      <motion.div
        className="mt-8 bg-gradient-to-r from-purple-50 to-lavender-50 border border-purple-200 rounded-xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h4 className="font-bold text-gray-900 mb-3">معلومات مهمة</h4>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>• يرجى الوصول قبل الموعد المحدد بـ 15 دقيقة</li>
          <li>• أحضر بطاقة الدخول معك (يمكنك حفظها على هاتفك)</li>
          <li>• في حالة أي استفسار، تواصل مع المنظم</li>
          <li>• يمكنك تغيير ردك في أي وقت</li>
        </ul>
      </motion.div>
    </div>
  );
}
