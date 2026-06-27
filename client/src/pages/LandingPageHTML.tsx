import { useState } from 'react';
import { Mail, MessageCircle, Send } from 'lucide-react';
import { trpc } from '../lib/trpc';

export default function LandingPageHTML() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    groom: '',
    bride: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleDemoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsLoading(true);

    try {
      const mutation = trpc.demo.createDemoBooking.useMutation();
      const result = await mutation.mutateAsync(formData);
      setSuccess(true);
      setFormData({ name: '', phone: '', location: '', groom: '', bride: '' });
      alert('تم إنشاء مناسبة تجريبية بنجاح! تحقق من رسائل الواتساب.');
    } catch (err: any) {
      setError(err.message || 'حدث خطأ في إنشاء المناسبة التجريبية');
      alert('خطأ: ' + (err.message || 'فشل في إنشاء المناسبة'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: '"Tahoma", "Arial", sans-serif' }}>
      <style>{`
        :root {
          --purple: #6c3f90;
          --purple-dark: #3f235b;
          --lavender: #f5eef8;
          --lavender-2: #efe1f5;
          --gold: #d6a85f;
          --ivory: #fffaf3;
          --white: #ffffff;
          --text: #1f1b2e;
          --muted: #7b7288;
          --green: #27ae60;
          --red: #e74c3c;
          --yellow: #f2b94b;
          --blue: #3f7ee8;
          --radius: 26px;
          --shadow: 0 20px 60px rgba(108, 63, 144, 0.14);
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          background: linear-gradient(180deg, var(--ivory), var(--lavender));
          color: var(--text);
          line-height: 1.8;
        }

        a {
          text-decoration: none;
          color: inherit;
        }

        .container {
          width: min(1180px, 92%);
          margin: auto;
        }

        header {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(255, 250, 243, 0.82);
          backdrop-filter: blur(18px);
          border-bottom: 1px solid rgba(108, 63, 144, 0.12);
        }

        .nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 0;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 900;
          color: var(--purple);
          font-size: 26px;
        }

        .logo-mark {
          width: 44px;
          height: 44px;
          border-radius: 16px;
          background: linear-gradient(135deg, var(--purple), var(--gold));
          display: grid;
          place-items: center;
          color: white;
          font-weight: 900;
          box-shadow: var(--shadow);
        }

        .nav-links {
          display: flex;
          gap: 26px;
          color: var(--muted);
          font-size: 15px;
        }

        .nav-actions {
          display: flex;
          gap: 12px;
        }

        .btn {
          border: none;
          padding: 13px 22px;
          border-radius: 999px;
          font-weight: 800;
          cursor: pointer;
          transition: 0.25s;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 15px;
        }

        .btn-primary {
          background: linear-gradient(135deg, var(--purple), var(--purple-dark));
          color: white;
          box-shadow: 0 14px 35px rgba(108, 63, 144, 0.28);
        }

        .btn-secondary {
          background: white;
          color: var(--purple);
          border: 1px solid rgba(108, 63, 144, 0.18);
        }

        .btn:hover {
          transform: translateY(-3px);
        }

        .hero {
          padding: 90px 0 70px;
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 40px;
          align-items: center;
        }

        .badge {
          display: inline-flex;
          padding: 8px 16px;
          border-radius: 999px;
          background: white;
          color: var(--purple);
          font-weight: 800;
          margin-bottom: 22px;
          box-shadow: var(--shadow);
          border: 1px solid rgba(108, 63, 144, 0.12);
        }

        h1 {
          font-size: clamp(38px, 5vw, 72px);
          line-height: 1.18;
          color: var(--purple-dark);
          margin-bottom: 24px;
          letter-spacing: -1px;
        }

        .hero p {
          font-size: 21px;
          color: var(--muted);
          max-width: 680px;
          margin-bottom: 30px;
        }

        .hero-actions {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
        }

        .hero-card {
          background: rgba(255, 255, 255, 0.72);
          border: 1px solid rgba(108, 63, 144, 0.12);
          border-radius: 36px;
          padding: 26px;
          box-shadow: var(--shadow);
          position: relative;
          overflow: hidden;
        }

        .hero-card::before {
          content: "";
          position: absolute;
          width: 240px;
          height: 240px;
          background: radial-gradient(circle, rgba(214,168,95,0.25), transparent 65%);
          left: -80px;
          top: -80px;
        }

        .phone {
          background: #14101d;
          border-radius: 34px;
          padding: 18px;
          color: white;
          position: relative;
          z-index: 2;
          box-shadow: 0 30px 70px rgba(20, 16, 29, 0.25);
        }

        .phone h3 {
          margin-bottom: 12px;
        }

        .message {
          background: #ffffff;
          color: var(--text);
          border-radius: 22px;
          padding: 18px;
          margin: 16px 0;
          font-size: 14px;
          line-height: 1.6;
        }

        .whatsapp-actions {
          display: grid;
          gap: 10px;
          margin-top: 16px;
        }

        .whatsapp-actions button {
          padding: 12px;
          border-radius: 14px;
          border: none;
          background: var(--lavender);
          color: var(--purple);
          font-weight: 800;
          cursor: pointer;
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
          margin-top: 26px;
        }

        .stat {
          background: white;
          border-radius: 22px;
          padding: 20px;
          box-shadow: var(--shadow);
          border: 1px solid rgba(108, 63, 144, 0.1);
        }

        .stat strong {
          display: block;
          color: var(--purple);
          font-size: 30px;
          margin-bottom: 5px;
        }

        section {
          padding: 78px 0;
        }

        .section-title {
          text-align: center;
          max-width: 760px;
          margin: 0 auto 42px;
        }

        .section-title h2 {
          font-size: clamp(30px, 4vw, 48px);
          color: var(--purple-dark);
          margin-bottom: 14px;
        }

        .section-title p {
          color: var(--muted);
          font-size: 18px;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .card {
          background: rgba(255,255,255,0.82);
          border-radius: var(--radius);
          padding: 26px;
          box-shadow: var(--shadow);
          border: 1px solid rgba(108, 63, 144, 0.1);
          transition: 0.25s;
        }

        .card:hover {
          transform: translateY(-6px);
        }

        .icon {
          width: 52px;
          height: 52px;
          border-radius: 18px;
          background: linear-gradient(135deg, var(--purple), #9e6cc2);
          color: white;
          display: grid;
          place-items: center;
          font-size: 24px;
          margin-bottom: 18px;
        }

        .card h3 {
          font-size: 22px;
          margin-bottom: 10px;
          color: var(--purple-dark);
        }

        .card p {
          color: var(--muted);
        }

        .steps {
          display: grid;
          gap: 16px;
          counter-reset: step;
        }

        .step {
          background: white;
          border-radius: 24px;
          padding: 22px;
          display: flex;
          gap: 18px;
          align-items: center;
          box-shadow: var(--shadow);
          border: 1px solid rgba(108, 63, 144, 0.1);
        }

        .step::before {
          counter-increment: step;
          content: counter(step);
          width: 42px;
          height: 42px;
          border-radius: 14px;
          background: var(--purple);
          color: white;
          display: grid;
          place-items: center;
          font-weight: 900;
          flex-shrink: 0;
        }

        .step h3 {
          color: var(--purple-dark);
          margin-bottom: 5px;
        }

        .step p {
          color: var(--muted);
          font-size: 14px;
        }

        .portal-preview {
          display: grid;
          grid-template-columns: 290px 1fr;
          gap: 18px;
          background: #fbf7ff;
          border-radius: 34px;
          padding: 22px;
          box-shadow: var(--shadow);
          border: 1px solid rgba(108, 63, 144, 0.12);
        }

        .sidebar {
          background: var(--purple-dark);
          color: white;
          border-radius: 26px;
          padding: 22px;
        }

        .sidebar h3 {
          margin-bottom: 16px;
        }

        .side-item {
          padding: 13px 14px;
          border-radius: 16px;
          margin-bottom: 8px;
          background: rgba(255,255,255,0.08);
        }

        .workspace {
          background: white;
          border-radius: 26px;
          padding: 24px;
        }

        .priority {
          background: linear-gradient(135deg, var(--purple), var(--purple-dark));
          color: white;
          padding: 24px;
          border-radius: 26px;
          margin-bottom: 18px;
        }

        .priority h3 {
          margin-bottom: 10px;
        }

        .mini-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }

        .mini {
          background: var(--lavender);
          padding: 18px;
          border-radius: 20px;
          text-align: center;
        }

        .mini strong {
          display: block;
          color: var(--purple);
          margin-bottom: 8px;
        }

        .pricing {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 22px;
        }

        .price-card {
          background: white;
          border-radius: 30px;
          padding: 30px;
          box-shadow: var(--shadow);
          border: 1px solid rgba(108, 63, 144, 0.12);
        }

        .price-card.featured {
          background: linear-gradient(180deg, white, var(--lavender));
          border: 2px solid var(--purple);
          transform: translateY(-10px);
        }

        .price-card h3 {
          color: var(--purple-dark);
          margin-bottom: 12px;
        }

        .price {
          font-size: 42px;
          color: var(--purple);
          font-weight: 900;
          margin: 18px 0;
        }

        .price-card ul {
          list-style: none;
          display: grid;
          gap: 12px;
          color: var(--muted);
          margin: 20px 0;
        }

        .price-card li::before {
          content: "✓";
          color: var(--green);
          font-weight: 900;
          margin-left: 8px;
        }

        .demo {
          background: linear-gradient(135deg, var(--purple-dark), var(--purple));
          border-radius: 42px;
          padding: 42px;
          color: white;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          align-items: center;
          box-shadow: var(--shadow);
        }

        .demo form {
          background: white;
          color: var(--text);
          padding: 24px;
          border-radius: 28px;
          display: grid;
          gap: 14px;
        }

        input, select {
          width: 100%;
          border: 1px solid rgba(108,63,144,0.18);
          background: #fff;
          padding: 14px 16px;
          border-radius: 16px;
          font-size: 15px;
          outline: none;
        }

        input:focus {
          border-color: var(--purple);
          box-shadow: 0 0 0 4px rgba(108,63,144,0.08);
        }

        footer {
          padding: 40px 0;
          background: var(--purple-dark);
          color: white;
          text-align: center;
          margin-top: 60px;
        }

        footer h3 {
          margin-bottom: 10px;
        }

        @media (max-width: 900px) {
          .hero, .demo, .portal-preview {
            grid-template-columns: 1fr;
          }

          .grid, .pricing, .stats, .mini-grid {
            grid-template-columns: 1fr;
          }

          .nav-links {
            display: none;
          }
        }
      `}</style>

      <header>
        <div className="container nav">
          <div className="logo">
            <div className="logo-mark">د</div>
            دعوة
          </div>

          <nav className="nav-links">
            <a href="#service">الخدمة</a>
            <a href="#how">كيف تعمل</a>
            <a href="#portals">البوابات</a>
            <a href="#pricing">الأسعار</a>
            <a href="#demo">التجربة</a>
          </nav>

          <div className="nav-actions">
            <a className="btn btn-secondary" href="/login">دخول العميل</a>
            <a className="btn btn-primary" href="https://wa.me/96871136500?text=مرحباً دعوة! أود الاستفسار عن خدمة دعوة">احجز الآن</a>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="container hero">
          <div>
            <span className="badge">نظام تشغيل متكامل للمناسبات</span>
            <h1>مرحباً بك في دعوة</h1>
            <p>
              منصة متكاملة لإدارة الدعوات والمعازيم، ومتابعة الحضور، وإصدار بطاقات الدخول QR حتى انتهاء المناسبة.
            </p>

            <div className="hero-actions">
              <a className="btn btn-primary" href="https://wa.me/96871136500?text=مرحباً دعوة! أود الاستفسار عن خدمة دعوة">احجز موعد</a>
              <a className="btn btn-secondary" href="#demo">جرب الخدمة</a>
              <a className="btn btn-secondary" href="#service">استكشف المنصة</a>
            </div>

            <div className="stats">
              <div className="stat"><strong>+10K</strong><span>دعوة مرسلة</span></div>
              <div className="stat"><strong>Live</strong><span>متابعة مباشرة</span></div>
              <div className="stat"><strong>QR</strong><span>دخول منظم</span></div>
              <div className="stat"><strong>24h</strong><span>تقارير سريعة</span></div>
            </div>
          </div>

          <div className="hero-card">
            <div className="phone">
              <h3>معاينة دعوة واتساب</h3>
              <div className="message">
                الفاضلة / مريم<br /><br />
                تتشرف عائلة دعوة بدعوتكم لحضور مناسبة الزفاف.<br /><br />
                عدد بطاقات الدخول: 2
              </div>
              <div className="whatsapp-actions">
                <button>أرغب في الحضور</button>
                <button>أعتذر عن الحضور</button>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="service" className="container">
          <div className="section-title">
            <h2>كل ما تحتاجه لإدارة الدعوات في مكان واحد</h2>
            <p>دعوة تجمع الإرسال، المتابعة، بطاقات الدخول، التقارير، وبوابة العميل داخل تجربة واحدة منظمة.</p>
          </div>

          <div className="grid">
            <div className="card">
              <div className="icon">💬</div>
              <h3>إرسال الدعوات</h3>
              <p>إرسال دعوات واتساب للضيوف مع أزرار تأكيد الحضور أو الاعتذار.</p>
            </div>

            <div className="card">
              <div className="icon">👥</div>
              <h3>إدارة المعازيم</h3>
              <p>إضافة، بحث، تصفية، واستيراد الضيوف مع متابعة حالة كل ضيف.</p>
            </div>

            <div className="card">
              <div className="icon">🎫</div>
              <h3>بطاقات QR</h3>
              <p>إصدار بطاقات دخول إلكترونية لكل ضيف وتنظيم الدخول عبر الماسح.</p>
            </div>

            <div className="card">
              <div className="icon">📊</div>
              <h3>تقارير مباشرة</h3>
              <p>معرفة عدد الحضور، المعتذرين، غير المؤكدين، ونسبة التفاعل.</p>
            </div>

            <div className="card">
              <div className="icon">🧠</div>
              <h3>مساعد ذكي</h3>
              <p>اقتراح الخطوة التالية، تحليل الأخطاء، ومساعدة الإدارة في التشغيل.</p>
            </div>

            <div className="card">
              <div className="icon">🖥️</div>
              <h3>بوابة العميل</h3>
              <p>العميل يتابع مناسبته مباشرة دون الحاجة للسؤال عن كل تحديث.</p>
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section id="how" className="container">
          <div className="section-title">
            <h2>كيف تعمل دعوة؟</h2>
            <p>رحلة واضحة من استلام بيانات الضيوف إلى التقرير النهائي.</p>
          </div>

          <div className="steps">
            <div className="step"><div><h3>إنشاء المناسبة</h3><p>تسجيل بيانات العميل والمناسبة والتاريخ والموقع.</p></div></div>
            <div className="step"><div><h3>إضافة المعازيم</h3><p>رفع ملف الضيوف أو إضافتهم يدويًا داخل النظام.</p></div></div>
            <div className="step"><div><h3>إرسال الدعوات</h3><p>إرسال الدعوات عبر واتساب ومتابعة حالة كل رسالة.</p></div></div>
            <div className="step"><div><h3>متابعة الردود</h3><p>عرض المؤكدين والمعتذرين وغير المؤكدين مباشرة.</p></div></div>
            <div className="step"><div><h3>إصدار بطاقات الدخول</h3><p>إنشاء بطاقات QR للضيوف المؤكدين.</p></div></div>
            <div className="step"><div><h3>التقرير النهائي</h3><p>تسليم تقرير واضح بعد انتهاء المناسبة.</p></div></div>
          </div>
        </section>

        {/* Portals Section */}
        <section id="portals" className="container">
          <div className="section-title">
            <h2>ثلاث بوابات داخل نظام واحد</h2>
            <p>بوابة للزوار، بوابة للعميل، وبوابة للإدارة.</p>
          </div>

          <div className="portal-preview">
            <aside className="sidebar">
              <h3>دعوة</h3>
              <div className="side-item">مركز العمليات</div>
              <div className="side-item">المناسبات</div>
              <div className="side-item">المعازيم</div>
              <div className="side-item">الدعوات</div>
              <div className="side-item">QR والدخول</div>
              <div className="side-item">التقارير</div>
            </aside>

            <div className="workspace">
              <div className="priority">
                <h3>أولوية اليوم</h3>
                <p>مناسبة الغد لديها 18 ضيفًا لم يؤكدوا حضورهم.</p>
                <br />
                <button className="btn btn-secondary">إرسال تذكير الآن</button>
              </div>

              <div className="mini-grid">
                <div className="mini"><strong>جاهزية المناسبة</strong><br />82%</div>
                <div className="mini"><strong>المؤكدون</strong><br />143</div>
                <div className="mini"><strong>رسائل فاشلة</strong><br />3</div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="container">
          <div className="section-title">
            <h2>باقات دعوة</h2>
            <p>باقات مرنة لإدارة الدعوات حسب حجم المناسبة.</p>
          </div>

          <div className="pricing">
            <div className="price-card">
              <h3>الباقة الأساسية</h3>
              <div className="price">70 ر.ع</div>
              <ul>
                <li>إرسال الدعوات</li>
                <li>متابعة الردود</li>
                <li>تقرير الحضور</li>
              </ul>
              <a className="btn btn-secondary" href="https://wa.me/96871136500">استفسار</a>
            </div>

            <div className="price-card featured">
              <h3>الباقة المتكاملة</h3>
              <div className="price">150 ر.ع</div>
              <ul>
                <li>إرسال واتساب</li>
                <li>بطاقات QR</li>
                <li>متابعة مباشرة</li>
                <li>تقرير نهائي</li>
              </ul>
              <a className="btn btn-primary" href="https://wa.me/96871136500">احجز الآن</a>
            </div>

            <div className="price-card">
              <h3>إضافات</h3>
              <div className="price">حسب الطلب</div>
              <ul>
                <li>شاشة ترحيبية</li>
                <li>تصوير فوري</li>
                <li>حارسات أمن</li>
              </ul>
              <a className="btn btn-secondary" href="https://wa.me/96871136500">تواصل معنا</a>
            </div>
          </div>
        </section>

        {/* Demo Section */}
        <section id="demo" className="container">
          <div className="demo">
            <div>
              <span className="badge">تجربة تفاعلية</span>
              <h2>جرب دعوة بنفسك</h2>
              <p>
                أنشئ مناسبة تجريبية، أضف ضيفين، وشاهد كيف تعمل الدعوات والمتابعة داخل النظام.
              </p>
            </div>

            <form onSubmit={handleDemoSubmit}>
              <input
                type="text"
                name="name"
                placeholder="اسمك"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="رقم الهاتف"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="location"
                placeholder="مكان المناسبة"
                value={formData.location}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="groom"
                placeholder="اسم المعرس"
                value={formData.groom}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="bride"
                placeholder="اسم العروس"
                value={formData.bride}
                onChange={handleInputChange}
                required
              />
              <button type="submit" className="btn btn-primary">إنشاء مناسبة تجريبية</button>
            </form>
          </div>
        </section>
      </main>

      <footer>
        <div className="container">
          <h3>دعوة</h3>
          <p>منصة متكاملة لإدارة الدعوات والمعازيم ومتابعة الحضور حتى انتهاء المناسبة.</p>
        </div>
      </footer>
    </div>
  );
}
