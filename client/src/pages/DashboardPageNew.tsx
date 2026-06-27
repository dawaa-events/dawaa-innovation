import { motion } from 'framer-motion';
import { Users, Calendar, MessageSquare, TrendingUp, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

// Mock data
const chartData = [
  { name: 'السبت', guests: 45, confirmed: 32 },
  { name: 'الأحد', guests: 52, confirmed: 38 },
  { name: 'الاثنين', guests: 48, confirmed: 35 },
  { name: 'الثلاثاء', guests: 61, confirmed: 45 },
  { name: 'الأربعاء', guests: 55, confirmed: 40 },
  { name: 'الخميس', guests: 67, confirmed: 52 },
  { name: 'الجمعة', guests: 72, confirmed: 58 },
];

const todayEvents = [
  { id: 1, name: 'حفل زفاف أحمد وفاطمة', time: '08:00 PM', guests: 150, confirmed: 98 },
  { id: 2, name: 'حفل خطوبة محمد', time: '06:00 PM', guests: 80, confirmed: 65 },
  { id: 3, name: 'عشاء عائلي', time: '07:30 PM', guests: 25, confirmed: 22 },
];

const recentActivity = [
  { id: 1, text: 'تم تأكيد حضور 5 ضيوف جدد', time: 'منذ 5 دقائق', type: 'confirmed' },
  { id: 2, text: 'تم إرسال دعوات إلى 50 ضيف', time: 'منذ 15 دقيقة', type: 'sent' },
  { id: 3, text: 'تم إنشاء مناسبة جديدة', time: 'منذ ساعة', type: 'created' },
  { id: 4, text: 'تم تحميل بطاقات QR', time: 'منذ ساعتين', type: 'qr' },
];

export default function DashboardPageNew() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender-50 via-lavender-100 to-lavender-50 p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-2">غرفة العمليات</h1>
        <p className="text-gray-600">مراقبة جميع مناسباتك في مكان واحد</p>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {[
          { label: 'إجمالي الضيوف', value: '1,250', icon: Users, color: 'from-blue-500 to-blue-600' },
          { label: 'مؤكدون', value: '892', icon: CheckCircle2, color: 'from-green-500 to-green-600' },
          { label: 'قيد الانتظار', value: '358', icon: Clock, color: 'from-yellow-500 to-yellow-600' },
          { label: 'المناسبات', value: '12', icon: Calendar, color: 'from-purple-500 to-purple-600' },
        ].map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)' }}
              className={`bg-gradient-to-br ${metric.color} rounded-2xl p-6 text-white shadow-lg`}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm opacity-90">{metric.label}</p>
                  <p className="text-3xl font-bold">{metric.value}</p>
                </div>
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <Icon className="w-12 h-12 opacity-80" />
                </motion.div>
              </div>
              <div className="h-1 bg-white/30 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-white/80"
                  animate={{ width: ['0%', '100%', '0%'] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Line Chart */}
        <motion.div
          className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)' }}
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4">إحصائيات الأسبوع</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '2px solid #6c3f90',
                  borderRadius: '12px',
                }}
              />
              <Line
                type="monotone"
                dataKey="guests"
                stroke="#6c3f90"
                strokeWidth={3}
                dot={{ fill: '#6c3f90', r: 5 }}
                activeDot={{ r: 7 }}
              />
              <Line
                type="monotone"
                dataKey="confirmed"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: '#10b981', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Bar Chart */}
        <motion.div
          className="bg-white rounded-2xl p-6 shadow-lg"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)' }}
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4">معدل التأكيد</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.slice(0, 5)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '2px solid #6c3f90',
                  borderRadius: '12px',
                }}
              />
              <Bar dataKey="confirmed" fill="#6c3f90" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Today's Events & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Events */}
        <motion.div
          className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)' }}
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6">مناسبات اليوم</h3>
          <div className="space-y-4">
            {todayEvents.map((event, idx) => (
              <motion.div
                key={event.id}
                className="border-r-4 border-purple-600 bg-gradient-to-r from-purple-50 to-transparent p-4 rounded-lg hover:shadow-md transition-all"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ x: 5 }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-bold text-gray-900">{event.name}</h4>
                    <p className="text-sm text-gray-500">{event.time}</p>
                  </div>
                  <motion.div
                    className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {event.confirmed}/{event.guests}
                  </motion.div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-purple-600 to-purple-700 h-2 rounded-full"
                    style={{ width: `${(event.confirmed / event.guests) * 100}%` }}
                    animate={{ width: [`${(event.confirmed / event.guests) * 100}%`, `${(event.confirmed / event.guests) * 100 + 5}%`, `${(event.confirmed / event.guests) * 100}%`] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          className="bg-white rounded-2xl p-6 shadow-lg"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)' }}
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6">النشاط الأخير</h3>
          <div className="space-y-4">
            {recentActivity.map((activity, idx) => (
              <motion.div
                key={activity.id}
                className="flex items-start gap-3 pb-4 border-b border-gray-200 last:border-b-0"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <motion.div
                  className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    activity.type === 'confirmed'
                      ? 'bg-green-500'
                      : activity.type === 'sent'
                      ? 'bg-blue-500'
                      : activity.type === 'created'
                      ? 'bg-purple-500'
                      : 'bg-yellow-500'
                  }`}
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: idx * 0.2 }}
                />
                <div className="flex-1">
                  <p className="text-sm text-gray-700">{activity.text}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Alerts Section */}
      <motion.div
        className="mt-8 bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-500 rounded-lg p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-bold text-gray-900 mb-2">تنبيهات مهمة</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• 15 ضيف لم يؤكدوا حضورهم بعد - أرسل تذكير</li>
              <li>• مناسبة غداً الساعة 6 مساءً - تأكد من الاستعدادات</li>
              <li>• 3 ضيوف لم يحملوا بطاقات QR بعد</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
