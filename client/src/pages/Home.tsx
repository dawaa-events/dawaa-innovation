import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Gift, Send, BarChart3, Users } from "lucide-react";

export default function Home() {
  const { isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (isAuthenticated && !loading) {
      setLocation("/bookings");
    }
  }, [isAuthenticated, loading, setLocation]);

  if (loading || isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-purple-600">دعوة</h1>
          <Button onClick={() => window.location.href = getLoginUrl()} className="bg-purple-600 hover:bg-purple-700">
            تسجيل الدخول
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900">
              إدارة دعوات الأحداث بسهولة
            </h2>
            <p className="text-xl text-gray-600">
              منصة متكاملة لإرسال دعوات الزفاف والحفلات عبر WhatsApp مع تتبع شامل للضيوف والحضور
            </p>
          </div>

          <Button
            onClick={() => window.location.href = getLoginUrl()}
            size="lg"
            className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-6"
          >
            ابدأ الآن
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-6 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-16 text-gray-900">
            المميزات الرئيسية
          </h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center space-y-4">
              <div className="inline-block p-4 bg-purple-100 rounded-lg">
                <Send className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="font-semibold text-lg">إرسال الدعوات</h4>
              <p className="text-gray-600">أرسل دعوات WhatsApp مخصصة لجميع ضيوفك</p>
            </div>

            <div className="text-center space-y-4">
              <div className="inline-block p-4 bg-pink-100 rounded-lg">
                <Users className="w-8 h-8 text-pink-600" />
              </div>
              <h4 className="font-semibold text-lg">إدارة الضيوف</h4>
              <p className="text-gray-600">تنظيم قوائم الضيوف وتتبع حالاتهم</p>
            </div>

            <div className="text-center space-y-4">
              <div className="inline-block p-4 bg-blue-100 rounded-lg">
                <BarChart3 className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-lg">التقارير</h4>
              <p className="text-gray-600">احصل على إحصائيات شاملة عن الحدث</p>
            </div>

            <div className="text-center space-y-4">
              <div className="inline-block p-4 bg-green-100 rounded-lg">
                <Gift className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="font-semibold text-lg">بطاقات الدخول</h4>
              <p className="text-gray-600">إنشاء بطاقات QR للتحقق من الحضور</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-6">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-12 text-white text-center space-y-6">
          <h3 className="text-3xl font-bold">جاهز للبدء؟</h3>
          <p className="text-lg opacity-90">
            انضم إلى مئات المنظمين الذين يستخدمون دعوة لإدارة أحداثهم
          </p>
          <Button
            onClick={() => window.location.href = getLoginUrl()}
            size="lg"
            className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-6"
          >
            تسجيل الدخول الآن
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-8 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p>&copy; 2026 دعوة - جميع الحقوق محفوظة</p>
        </div>
      </div>
    </div>
  );
}
