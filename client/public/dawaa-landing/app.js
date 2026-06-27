const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];
const app = $('#app');
const toast = $('#toast');
window.lucide = window.lucide || {
  createIcons(){
    const paths = {
      'send':'<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
      'users':'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
      'user-round':'<circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/>',
      'check':'<path d="M20 6 9 17l-5-5"/>',
      'x':'<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
      'clock':'<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
      'calendar':'<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
      'calendar-days':'<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/>',
      'search':'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
      'rocket':'<path d="M4.5 16.5c-1.5 1.3-2 3.5-2 3.5s2.2-.5 3.5-2c.7-.8.7-2 0-2.7-.7-.7-1.9-.7-2.7 0Z"/><path d="M9 15 4 10l7-7c3-3 7-1 9 1 2 2 4 6 1 9l-7 7-5-5Z"/><path d="M14 6h.01"/>',
      'menu':'<path d="M4 12h16"/><path d="M4 6h16"/><path d="M4 18h16"/>',
      'log-out':'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/>',
      'monitor-up':'<path d="M12 13V7"/><path d="m9 10 3-3 3 3"/><rect width="20" height="14" x="2" y="3" rx="2"/><path d="M12 17v4"/><path d="M8 21h8"/>',
      'arrow-left':'<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
      'message-circle':'<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
      'bar-chart-3':'<path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>',
      'qr-code':'<rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/>',
      'shield':'<path d="M20 13c0 5-3.5 7.5-7.7 8.8a1 1 0 0 1-.6 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.2-2.4a1 1 0 0 1 1.6 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1Z"/>',
      'bell':'<path d="M6 8a6 6 0 0 1 12 0c0 7 3 6 3 8H3c0-2 3-1 3-8"/><path d="M10.3 21a2 2 0 0 0 3.4 0"/>',
      'map-pin':'<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
      'trending-up':'<path d="m22 7-8.5 8.5-5-5L2 17"/><path d="M16 7h6v6"/>',
      'clipboard-list':'<rect width="8" height="4" x="8" y="2" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/>'
    };
    document.querySelectorAll('i[data-lucide]').forEach(el => {
      const name = el.getAttribute('data-lucide');
      const size = parseInt((el.style.width || '24').replace('px',''),10) || 24;
      const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
      svg.setAttribute('width', size);
      svg.setAttribute('height', size);
      svg.setAttribute('viewBox','0 0 24 24');
      svg.setAttribute('fill','none');
      svg.setAttribute('stroke','currentColor');
      svg.setAttribute('stroke-width','2');
      svg.setAttribute('stroke-linecap','round');
      svg.setAttribute('stroke-linejoin','round');
      svg.setAttribute('class','lucide lucide-'+name);
      svg.innerHTML = paths[name] || '<circle cx="12" cy="12" r="9"/><path d="M12 8v4"/><path d="M12 16h.01"/>';
      el.replaceWith(svg);
    });
  }
};
function safeIcons(){
  try{
    if(window.lucide && typeof window.lucide.createIcons==='function'){
      window.lucide.createIcons();
    }
  }catch(e){ console.warn('icons failed', e); }
}
const currency = n => `${n} ر.ع`;
const now = () => new Date().toISOString();
const fmt = iso => new Date(iso).toLocaleDateString('ar-OM');
const uid = () => Math.random().toString(36).slice(2,10);
let currentUser = JSON.parse(localStorage.getItem('dawaa_user')||'null');
let cmdOpen = false;
let selectedGuestIds = new Set();
let guestStatusFilter = '';
let sendModeState = 'selected';
const env = {
  supabaseUrl: localStorage.getItem('DAWAA_SUPABASE_URL') || '',
  supabaseKey: localStorage.getItem('DAWAA_SUPABASE_ANON_KEY') || '',
};
const supabaseClient = (window.supabase && env.supabaseUrl && env.supabaseKey) ? window.supabase.createClient(env.supabaseUrl, env.supabaseKey) : null;
const defaultPricingSettings = { promoEnabled:false, promoCode:'DAWAA10', promoDiscount:10 };
function getPricingSettings(){
  try { return {...defaultPricingSettings, ...(JSON.parse(localStorage.getItem('dawaa_pricing_settings')||'{}'))}; }
  catch(e){ return defaultPricingSettings; }
}
function savePricingSettingsObject(v){ localStorage.setItem('dawaa_pricing_settings', JSON.stringify({...getPricingSettings(), ...v})); }
const defaultPackages = [
  {id:'starter', title:'البداية', price:85, desc:'بطاقات QR وملفات جاهزة للإرسال', features:['بطاقات دخول QR','ملفات مرتبة للإرسال','دعم أساسي'], featured:false},
  {id:'complete', title:'دعوة المتكامل', price:150, desc:'إرسال واتساب + متابعة حضور + QR + تقرير', features:['إرسال الدعوات عبر واتساب','متابعة الردود','بطاقات QR','تقرير نهائي'], featured:true},
  {id:'premium', title:'المميز', price:220, desc:'كل شيء + شاشة ترحيبية + تنظيم إضافي', features:['كل مميزات المتكامل','شاشة ترحيبية','تنظيم إضافي','أولوية في الدعم'], featured:false}
];
function getPackages(){
  try{
    const saved=JSON.parse(localStorage.getItem('dawaa_packages')||'null');
    return Array.isArray(saved) && saved.length ? saved : defaultPackages;
  }catch(e){return defaultPackages;}
}
function savePackages(list){localStorage.setItem('dawaa_packages', JSON.stringify(list));}
function escapeHtml(v=''){return String(v).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));}

const defaultAccounts = [
  {id:'admin-main', type:'admin', name:'مدير دعوة', email:'admin@dawaa.local', username:'admin@dawaa.local', password:'123456', active:true, role:'admin', permissions:['all'], createdAt:now()},
  {id:'client-main', type:'client', name:'سارة محمد', email:'client@dawaa.local', username:'client@dawaa.local', password:'123456', active:true, role:'client', bookingId:'ev1', permissions:['view_event','view_guests','view_status','view_messages','view_cards','view_reports'], createdAt:now()}
];
function getAccounts(){
  try{
    const saved=JSON.parse(localStorage.getItem('dawaa_accounts')||'null');
    if(Array.isArray(saved) && saved.length) return saved;
  }catch(e){}
  localStorage.setItem('dawaa_accounts', JSON.stringify(defaultAccounts));
  return defaultAccounts;
}
function saveAccounts(list){localStorage.setItem('dawaa_accounts', JSON.stringify(list));}
function findAccount(login){const value=String(login||'').trim().toLowerCase(); return getAccounts().find(a=>a.active!==false && (String(a.email||'').toLowerCase()===value || String(a.username||'').toLowerCase()===value));}
function accountBadge(a){return `<span class="badge ${a.active===false?'b-red':a.type==='admin'?'b-purple':'b-green'}">${a.active===false?'معطل':a.type==='admin'?'إدارة':'عميل'}</span>`}

function seed(){
 if(localStorage.getItem('dawaa_seeded')) return;
 const bookings=[{id:'ev1',clientName:'سارة محمد',clientPhone:'96891234567',eventName:'زفاف سارة و محمد',eventType:'زفاف',eventDate:'2026-10-15',venueName:'قاعة المرجان - مسقط',locationLink:'https://maps.google.com',receptionTime:'8:00 مساءً',hostOne:'أم محمد',hostTwo:'أم سارة',brideName:'سارة',groomName:'محمد',status:'active',health:92,createdAt:now(),screenUploaded:false,cardsReady:true,clientAccount:'client@dawaa.local'},{id:'ev2',clientName:'مريم البلوشي',clientPhone:'96892345678',eventName:'خطوبة مريم',eventType:'خطوبة',eventDate:'2026-11-04',venueName:'فندق كراون بلازا',locationLink:'',receptionTime:'7:30 مساءً',hostOne:'',hostTwo:'',brideName:'مريم',groomName:'خالد',status:'planning',health:67,createdAt:now(),screenUploaded:false,cardsReady:false,clientAccount:'mariam@dawaa.local'}];
 const guests=[
  {id:'g1',bookingId:'ev1',guestName:'أمينة بنت محمد',phoneNumber:'96891111111',cardsCount:2,rsvpStatus:'confirmed',confirmedCount:2,declinedCount:0,pendingCount:0,invitationSentAt:now(),deliveredAt:now(),readAt:now(),repliedAt:now(),shortCode:'DAWAA25',checkedIn:false},
  {id:'g2',bookingId:'ev1',guestName:'ريم السالمية',phoneNumber:'96892222222',cardsCount:1,rsvpStatus:'pending',confirmedCount:0,declinedCount:0,pendingCount:1,invitationSentAt:now(),deliveredAt:now(),readAt:null,repliedAt:null,shortCode:'DAWAA26',checkedIn:false},
  {id:'g3',bookingId:'ev1',guestName:'خالد المعولي',phoneNumber:'96893333333',cardsCount:3,rsvpStatus:'declined',confirmedCount:0,declinedCount:3,pendingCount:0,invitationSentAt:now(),deliveredAt:now(),readAt:now(),repliedAt:now(),shortCode:'DAWAA27',checkedIn:false},
  {id:'g4',bookingId:'ev1',guestName:'هند الحارثية',phoneNumber:'96894444444',cardsCount:1,rsvpStatus:'sent',confirmedCount:0,declinedCount:0,pendingCount:1,invitationSentAt:now(),deliveredAt:null,readAt:null,repliedAt:null,shortCode:'DAWAA28',checkedIn:false},
  {id:'g5',bookingId:'ev2',guestName:'فاطمة الرواحية',phoneNumber:'96895555555',cardsCount:1,rsvpStatus:'pending',confirmedCount:0,declinedCount:0,pendingCount:1,shortCode:'DAWAA29',checkedIn:false}
 ];
 const messages=[{id:'m1',bookingId:'ev1',guestId:'g1',from:'system',text:'تم إرسال الدعوة عبر واتساب',createdAt:now(),status:'read'},{id:'m2',bookingId:'ev1',guestId:'g1',from:'guest',text:'أرغب بالحضور',createdAt:now(),status:'confirmed'},{id:'m3',bookingId:'ev1',guestId:'g2',from:'system',text:'تم إرسال الدعوة، لم يؤكد الرد',createdAt:now(),status:'delivered'}];
 localStorage.setItem('dawaa_bookings',JSON.stringify(bookings));
 localStorage.setItem('dawaa_guests',JSON.stringify(guests));
 localStorage.setItem('dawaa_messages',JSON.stringify(messages));
 localStorage.setItem('dawaa_seeded','1');
}
seed();
const db={
 get bookings(){return JSON.parse(localStorage.getItem('dawaa_bookings')||'[]')}, set bookings(v){localStorage.setItem('dawaa_bookings',JSON.stringify(v))},
 get guests(){return JSON.parse(localStorage.getItem('dawaa_guests')||'[]')}, set guests(v){localStorage.setItem('dawaa_guests',JSON.stringify(v))},
 get messages(){return JSON.parse(localStorage.getItem('dawaa_messages')||'[]')}, set messages(v){localStorage.setItem('dawaa_messages',JSON.stringify(v))},
};

function safeArray(key){try{const v=JSON.parse(localStorage.getItem(key)||'[]'); return Array.isArray(v)?v:[]}catch(e){return []}}
function ensureDataIntegrity(){
  const defaultBookings=[{id:'ev1',clientName:'سارة محمد',clientPhone:'96891234567',eventName:'زفاف سارة و محمد',eventType:'زفاف',eventDate:'2026-10-15',venueName:'قاعة المرجان - مسقط',locationLink:'https://maps.google.com',receptionTime:'8:00 مساءً',hostOne:'أم محمد',hostTwo:'أم سارة',brideName:'سارة',groomName:'محمد',status:'active',health:92,createdAt:now(),screenUploaded:false,cardsReady:true,clientAccount:'client@dawaa.local'},{id:'ev2',clientName:'مريم البلوشي',clientPhone:'96892345678',eventName:'خطوبة مريم',eventType:'خطوبة',eventDate:'2026-11-04',venueName:'فندق كراون بلازا',locationLink:'',receptionTime:'7:30 مساءً',hostOne:'',hostTwo:'',brideName:'مريم',groomName:'خالد',status:'planning',health:67,createdAt:now(),screenUploaded:false,cardsReady:false,clientAccount:'mariam@dawaa.local'}];
  const defaultGuests=[
    {id:'g1',bookingId:'ev1',guestName:'أمينة بنت محمد',phoneNumber:'96891111111',cardsCount:2,rsvpStatus:'confirmed',confirmedCount:2,declinedCount:0,pendingCount:0,invitationSentAt:now(),deliveredAt:now(),readAt:now(),repliedAt:now(),shortCode:'DAWAA25',checkedIn:false},
    {id:'g2',bookingId:'ev1',guestName:'ريم السالمية',phoneNumber:'96892222222',cardsCount:1,rsvpStatus:'pending',confirmedCount:0,declinedCount:0,pendingCount:1,invitationSentAt:now(),deliveredAt:now(),readAt:null,repliedAt:null,shortCode:'DAWAA26',checkedIn:false},
    {id:'g3',bookingId:'ev1',guestName:'خالد المعولي',phoneNumber:'96893333333',cardsCount:3,rsvpStatus:'declined',confirmedCount:0,declinedCount:3,pendingCount:0,invitationSentAt:now(),deliveredAt:now(),readAt:now(),repliedAt:now(),shortCode:'DAWAA27',checkedIn:false},
    {id:'g4',bookingId:'ev1',guestName:'هند الحارثية',phoneNumber:'96894444444',cardsCount:1,rsvpStatus:'sent',confirmedCount:0,declinedCount:0,pendingCount:1,invitationSentAt:now(),deliveredAt:null,readAt:null,repliedAt:null,shortCode:'DAWAA28',checkedIn:false},
    {id:'g5',bookingId:'ev2',guestName:'فاطمة الرواحية',phoneNumber:'96895555555',cardsCount:1,rsvpStatus:'pending',confirmedCount:0,declinedCount:0,pendingCount:1,shortCode:'DAWAA29',checkedIn:false}
  ];
  const defaultMessages=[{id:'m1',bookingId:'ev1',guestId:'g1',from:'system',text:'تم إرسال الدعوة عبر واتساب',createdAt:now(),status:'read'},{id:'m2',bookingId:'ev1',guestId:'g1',from:'guest',text:'أرغب بالحضور',createdAt:now(),status:'confirmed'},{id:'m3',bookingId:'ev1',guestId:'g2',from:'system',text:'تم إرسال الدعوة، لم يؤكد الرد',createdAt:now(),status:'delivered'}];
  if(!safeArray('dawaa_bookings').length) localStorage.setItem('dawaa_bookings', JSON.stringify(defaultBookings));
  if(!safeArray('dawaa_guests').length) localStorage.setItem('dawaa_guests', JSON.stringify(defaultGuests));
  if(!safeArray('dawaa_messages').length) localStorage.setItem('dawaa_messages', JSON.stringify(defaultMessages));
  const accounts=safeArray('dawaa_accounts');
  const hasAdmin=accounts.some(a=>a.type==='admin'||a.role==='admin');
  const hasClient=accounts.some(a=>a.type==='client'||a.role==='client');
  if(!accounts.length || !hasAdmin || !hasClient) localStorage.setItem('dawaa_accounts', JSON.stringify(defaultAccounts));
  try{ const u=JSON.parse(localStorage.getItem('dawaa_user')||'null'); if(u && u.role==='client' && u.bookingId && !safeArray('dawaa_bookings').some(b=>b.id===u.bookingId)){ localStorage.removeItem('dawaa_user'); currentUser=null; } }catch(e){ localStorage.removeItem('dawaa_user'); currentUser=null; }
}
ensureDataIntegrity();
function repairDemoData(){ localStorage.removeItem('dawaa_seeded'); ['dawaa_bookings','dawaa_guests','dawaa_messages','dawaa_accounts','dawaa_user'].forEach(k=>localStorage.removeItem(k)); seed(); ensureDataIntegrity(); currentUser=null; showToast('تم إصلاح البيانات التجريبية'); go('/login'); }

function getSelectedBookingId(){
  const bookings=db.bookings;
  let id=localStorage.getItem('dawaa_selected_booking') || bookings[0]?.id || '';
  if(!bookings.some(b=>b.id===id)) id=bookings[0]?.id || '';
  if(id) localStorage.setItem('dawaa_selected_booking', id);
  return id;
}
function setSelectedBooking(id){
  localStorage.setItem('dawaa_selected_booking', id);
  selectedGuestIds.clear();
  render();
}
function bookingSelector(){
  const selected=getSelectedBookingId();
  return `<div class="event-select-panel"><div><span class="eyebrow">اختيار المناسبة</span><h3>اعرضي ضيوف مناسبة واحدة فقط</h3><p>اختاري المناسبة وسيظهر الضيوف المرتبطون بها فقط، حتى لا تختلط القوائم بين الحجوزات.</p></div><select id="bookingFilter" onchange="setSelectedBooking(this.value)">${db.bookings.map(b=>`<option value="${b.id}" ${b.id===selected?'selected':''}>${escapeHtml(b.eventName)} — ${escapeHtml(b.clientName||'')}</option>`).join('')}</select></div>`
}
function showToast(msg){toast.textContent=msg;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),2600)}
function icon(name,size=24){return `<i data-lucide="${name}" style="width:${size}px;height:${size}px"></i>`}
function go(hash){location.hash=hash; window.scrollTo(0,0)}
function nav(){return `<header class="container nav"><a class="brand" href="#/"><div class="logo-mark"><img src="assets/dawaa-logo-purple.png" alt="شعار دعوة"></div><span>دعوة</span></a><nav class="nav-links"><a href="#features">المميزات</a><a href="#pricing">الأسعار</a><a href="#contact">تواصل معنا</a></nav><div class="nav-actions"><button class="btn btn-secondary" onclick="go('/login')">${icon('user-round',20)} تسجيل الدخول</button></div></header>`}
function render(){
 const route = location.hash.replace('#','') || '/';
 if(route.startsWith('/admin')) return renderAdmin(route);
 if(route.startsWith('/client')) return renderClient(route);
 if(route==='/login') return renderLogin();
 if(route==='/demo') return renderDemo();
 if(route==='/about') return renderAbout();
 return renderHome();
}
function renderHome(){app.innerHTML=nav()+`<main class="container">
<section class="hero route-page">
 <div class="hero-text"><h1><span class="grad">منصة متكاملة</span><br>لإدارة الدعوات والمعازيم</h1><p>من إرسال الدعوات عبر واتساب وحتى متابعة الحضور واستقبالهم في المناسبة ببطاقات QR وتقارير لحظية.</p><div class="hero-actions"><button class="btn btn-primary" onclick="openBookingModal()">احجز الآن ${icon('calendar-days',20)}</button><button class="btn btn-secondary" onclick="go('/demo')">جرب الخدمة ${icon('rocket',20)}</button><button class="btn btn-ghost" onclick="document.querySelector('#how').scrollIntoView()">استكشف المنصة ${icon('search',20)}</button></div></div>
 <div class="hero-visual">${heroVisual()}</div>
</section>${statsBar()}${howSection()}${featuresSection()}${showcaseSection()}${demoSection()}${calculatorSection()}${pricingSection()}${faqSection()}${ctaSection()}<footer class="footer" id="contact">دعوة © 2026 — واتساب: 96871136500 — انستجرام @dawaa.events</footer></main>${bookingModal()}${commandPalette()}`; afterRender();}
function heroVisual(){return `<div class="dashed dash1"></div><div class="dashed dash2"></div><div class="dashed dash3"></div><div class="float-card fc-message"><div class="mini-title">رسالة واتساب</div><p>أنتم مدعوون لحضور حفل زفاف سارة & محمد<br><b style="color:var(--p600)">https://dawaah.com/r/abc123</b></p><small>11:30 AM ✓✓</small></div><div class="qr-card"><div class="mini-title">بطاقة الدعوة</div><div class="qr"></div><small>امسح للدخول</small></div><div class="iphone-pro"><div class="iphone-buttons"><span></span><span></span><span></span></div><div class="iphone-glare"></div><div class="iphone-screen"><div class="dynamic-island"></div><div class="statusbar"><b>9:41</b><span>⌁ 5G 🔋</span></div><div class="wa-head"><span>دعوة</span><span class="verified"></span></div><div class="phone-stage"><section class="screen-panel invite-panel"><p>مرحباً أحمد 👋</p><p>حفل زفاف<br><strong>سارة & محمد</strong></p><p>الجمعة 25 أبريل 2026</p><nav><span>التقارير</span><span>الدخول</span><span>المعازيم</span></nav></section><section class="screen-panel confirm-panel"><div class="checkmark">✓</div><strong>تم تأكيد الحضور</strong><p>سيتم إرسال بطاقة الدخول قبل المناسبة.</p></section><section class="screen-panel card-panel"><h4>بطاقة دخول</h4><div class="qr"></div><b>DAWAA25</b><small>قاعة المرجان - مسقط</small></section></div></div></div><div class="float-card fc-donut"><div class="mini-title">لوحة التحكم</div><div class="donut"><span>72%</span></div></div><div class="float-card fc-chart"><div class="mini-title">إحصائيات الدعوات</div><b style="font-size:28px">1,248</b><span style="color:var(--green);font-weight:800"> ↑ 12%</span><div class="spark"></div></div><div class="float-card fc-time"><div class="mini-title">سير العمل</div><div class="tl"><span class="dot"></span><span>تم إرسال الدعوات</span><small>10:30 ص</small></div><div class="tl"><span class="dot"></span><span>تم تأكيد الحضور</span><small>11:20 ص</small></div><div class="tl"><span class="dot"></span><span>تم تسجيل الدخول</span><small>08:00 م</small></div></div>`}
function statsBar(){return `<section class="stats">${[['send','أكثر من','1,250,000+','دعوة تم إرسالها'],['circle-check','نسبة وصول','99%','من الدعوات'],['users-round','آلاف الضيوف','75,000+','تمت إدارتهم'],['chart-pie','تقارير','لحظية','ودقيقة']].map(s=>`<div class="stat"><div class="stat-icon">${icon(s[0],34)}</div><div><small>${s[1]}</small><b data-count="${s[2].replace(/\D/g,'')||99}">${s[2]}</b><span>${s[3]}</span></div></div>`).join('')}</section>`}
function howSection(){const steps=[['clipboard-list','نستقبل منكم بيانات المناسبة','نأخذ التفاصيل والمتطلبات بدقة'],['pencil','نجهز الدعوات','تصميم دعوتكم بشكل احترافي ومخصص'],['phone-call','نرسلها عبر واتساب','تصل الدعوات للضيوف بسهولة وموثوقية'],['message-circle','نتابع الردود','نراقب الردود ونحدث حالة الحضور أولاً بأول'],['qr-code','نصدر بطاقات الدخول','ننشيء بطاقات دخول فريدة لكل ضيف'],['bar-chart-3','نسلم التقرير النهائي','تقرير شامل وإحصائيات دقيقة عن مناسبتكم']];return `<section id="how" class="section"><div class="section-head"><h2>كيف تعمل دعوة؟</h2><div class="underline"></div></div><div class="steps">${steps.map((s,i)=>`<div class="step"><div class="num">${i+1}</div><div class="step-icon">${icon(s[0],34)}</div><h3>${s[1]}</h3><p>${s[2]}</p></div>`).join('')}</div></section>`}
function featuresSection(){const f=[['smartphone','إرسال الدعوات','إرسال دعواتك بسهولة عبر واتساب بضغطة واحدة'],['messages-square','متابعة الردود','متابعة ردود الضيوف وتحديث حالة الحضور تلقائياً'],['ticket-check','بطاقات QR','إنشاء بطاقات دخول فريدة لكل ضيف مع رمز QR'],['shield-check','تنظيم الدخول','تنظيم دخول الضيوف والتحقق من البطاقات بكل سلاسة'],['bar-chart','تقارير مباشرة','تقارير فورية عن الحضور والردود والحالة العامة'],['map-pin','إرسال الموقع','إرسال موقع المناسبة للضيوف عبر خرائط جوجل بسهولة'],['bell-ring','تذكيرات تلقائية','إرسال تذكيرات تلقائية للضيوف قبل موعد المناسبة'],['trending-up','إحصائيات لحظية','لوحة تحكم تعرض جميع الإحصائيات بشكل لحظي ودقيق']];return `<section id="features" class="section"><div class="panel"><div class="section-head"><h2>ماذا تشمل الخدمة؟</h2><div class="underline"></div></div><div class="features">${f.map(x=>`<div class="feature"><div class="feature-icon">${icon(x[0],42)}</div><div><h3>${x[1]}</h3><p>${x[2]}</p></div></div>`).join('')}</div></div></section>`}
function showcaseSection(){return `<section class="section"><div class="section-head"><h2>شاهد كيف تعمل المنصة</h2><p style="color:#767d91;font-weight:700">من أول رسالة واتساب حتى لحظة دخول القاعة</p><div class="underline"></div></div><div class="showcase"><div class="story-list">${['تصل الدعوة عبر واتساب','يؤكد الضيف الحضور','تصدر بطاقة الدخول QR','يتابع العميل الإحصائيات','يفحص الأمن البطاقة','يصدر التقرير النهائي'].map((t,i)=>`<div class="story-item ${i==0?'active':''}" onclick="setStory(${i})"><span class="chip">${i+1}</span>${t}</div>`).join('')}</div><div class="mock-board" id="storyBoard"></div></div></section>`}
const stories=[
 ['رسالة واتساب تصل للضيف', 'تظهر الدعوة بتفاصيل المناسبة وزري الحضور والاعتذار.', 'message-circle'],
 ['تم تأكيد الحضور', 'تتغير حالة الضيف تلقائياً وتُسجّل في النظام مع الوقت.', 'check-circle'],
 ['بطاقة دخول QR', 'بطاقة شخصية لكل ضيف مع كود ورمز QR قابل للفحص.', 'qr-code'],
 ['لوحة العميل الحية', 'إحصائيات واضحة: حاضر، معتذر، لم يؤكد الرد، ورسائل.', 'layout-dashboard'],
 ['فحص الدخول', 'السكانر يميّز بين بطاقة صحيحة، مستخدمة، أو غير صالحة.', 'scan-line'],
 ['التقرير النهائي', 'ملخص كامل بعد المناسبة مع أرقام ونسب قابلة للتنزيل.', 'file-text']
];
function setStory(i){$$('.story-item').forEach((e,idx)=>e.classList.toggle('active',idx===i)); const s=stories[i]; $('#storyBoard').innerHTML=`<h3>${icon(s[2],34)} ${s[0]}</h3><p style="color:#687086;font-weight:700;line-height:1.9">${s[1]}</p><div class="dashboard-grid"><div class="mini-stat"><b>${i===3?'187':'✓'}</b><span>${i===3?'حاضر الحضور':'تم بنجاح'}</span></div><div class="mini-stat"><b>${i===4?'QR':'99%'}</b><span>${i===4?'فحص سريع':'نسبة الوصول'}</span></div></div><div class="timeline"><div class="tl"><span class="dot"></span> تم إنشاء السجل</div><div class="tl"><span class="dot"></span> تم تحديث الحالة</div><div class="tl"><span class="dot"></span> يظهر في لوحة العميل</div></div><div class="phone" style="position:absolute;left:60px;top:110px;transform:scale(.42) rotate(-6deg);transform-origin:top left"><div class="phone-screen"><div class="wa-head">دعوة <span class="verified"></span></div><div class="wa-body"><div class="wa-card"><strong>${s[0]}</strong><p>${s[1]}</p><div class="wa-btn">متابعة</div></div></div></div></div>`; safeIcons();}

function whatsappPhonePreview(opts={}){
 const guest=opts.guest||'أمينة بنت محمد';
 const groom=opts.groom||'محمد';
 const bride=opts.bride||'مريم';
 const venue=opts.venue||'قاعة المرجان';
 const date=opts.date||'15 أكتوبر 2026';
 const cards=opts.cards||1;
 return `<div class="wa-preview-iphone">
  <div class="wa-iphone-frame">
   <div class="wa-iphone-buttons"><span></span><span></span><span></span></div>
   <div class="wa-iphone-glare"></div>
   <div class="wa-iphone-screen">
    <div class="wa-dynamic-island"></div>
    <div class="wa-status"><b>9:41</b><span>5G 🔋</span></div>
    <div class="real-wa-header"><div class="wa-back">‹</div><div class="wa-avatar"><img src="assets/dawaa-logo-white.png" alt="شعار دعوة"></div><div><strong>Dawaa Events</strong><small>online</small></div><div class="wa-menu">•••</div></div>
    <div class="real-wa-body">
      <div class="real-wa-bubble invite-bubble">
        <p class="bubble-title">دعوة زفاف</p>
        <p>الفاضلة / ${guest}</p>
        <p>تتشرف الفاضلتان<br>أم العروس<br>و<br>أم المعرس</p>
        <p>بدعوتكم لحضور حفل زفاف نجليهما</p>
        <p class="names">${groom} & ${bride}</p>
        <p>${date}<br>${venue}<br>عدد بطاقات الدخول المخصصة لكم: ${cards}</p>
        <p>يرجى تأكيد الحضور خلال 24 ساعة.</p>
        <span class="wa-time">11:30 ص</span>
      </div>
      <button class="real-wa-action yes">أرغب في الحضور</button>
      <button class="real-wa-action no">أعتذر عن الحضور</button>
    </div>
   </div>
  </div>
 </div>`
}
function entryCardPreview(opts={}){
 const guest=opts.guest||'أمينة بنت محمد';
 const code=opts.code||'DAWAA25';
 return `<div class="entry-preview-card">
  <h3>بطاقة الدخول</h3>
  <div class="real-qr large"></div>
  <p>ضيف: ${guest}</p>
  <b>${code}</b>
  <small>امسح للدخول</small>
 </div>`
}

function demoSection(){return `<section class="section" id="demo"><div class="demo-wrap demo-wrap-live"><div class="wizard"><h2>🎯 جرّب دعوة بنفسك</h2><p style="color:#697082;font-weight:700;line-height:1.9">أنشئ مناسبة تجريبية وشاهد كيف تصل الدعوة لضيوفك داخل محادثة واتساب حقيقية.</p><button class="btn btn-primary" onclick="go('/demo')">ابدأ التجربة ${icon('rocket',20)}</button></div><div class="demo-phone-holder">${whatsappPhonePreview({guest:'لطيفة الكندي',groom:'راشد',bride:'مريم',venue:'قاعة المرجان',date:'الجمعة 25 أبريل 2026'})}</div></div></section>`}
function calculatorSection(){const ps=getPricingSettings();return `<section class="section" id="calculator"><div class="calc premium-calc client-price-clean"><div class="section-head"><h2>احسب تكلفة المناسبة</h2><p>اختاري عدد الضيوف والخدمات الإضافية، وسيظهر السعر النهائي مباشرة بدون تفاصيل داخلية.</p><div class="underline"></div></div><div class="calc-layout"><div class="calc-controls"><div class="form-row"><div class="field"><label>عدد الضيوف</label><input id="guestRange" type="range" min="100" max="500" step="50" value="250" oninput="calcPrice()"><div class="range-meta"><b id="guestCount">250 ضيف</b><small>حتى 500 ضيف</small></div></div><div class="field"><label>نوع المناسبة</label><select id="eventType" onchange="calcPrice()"><option>زفاف</option><option>خطوبة</option><option>مناسبة خاصة</option></select></div></div><div class="included-box"><h3>الخدمة تشمل:</h3><div class="included-grid"><span>✓ إرسال الدعوات عبر واتساب</span><span>✓ سكيورتي وتنظيم الدخول</span><span>✓ QR Code لكل ضيف</span><span>✓ متابعة الردود والحضور</span><span>✓ تذكير غير المؤكدين</span><span>✓ تقرير نهائي للمناسبة</span></div></div><div class="addon-grid"><label class="addon-card"><input type="checkbox" id="photoOpt" onchange="calcPrice()"><span>تصوير فوري</span><b>+80 ر.ع</b></label><label class="addon-card"><input type="checkbox" id="screenOpt" onchange="calcPrice()"><span>شاشة ترحيبية</span><b>+70 ر.ع</b></label></div><div class="promo-box"><label>كود الخصم</label><div class="promo-row"><input id="promoCodeInput" placeholder="اكتبي كود البروموشن" oninput="calcPrice()"><button class="btn btn-secondary" onclick="calcPrice()">تطبيق</button></div><small id="promoHint">${ps.promoEnabled?'يوجد كوبون مفعّل من الإدارة':'لا يوجد كوبون مفعّل حالياً'}</small></div></div><div class="price-summary"><div class="private-price-note"><span>باقة متكاملة</span><b>الدعوات + QR + السكيورتي + المتابعة</b></div><div class="summary-line discount-line" id="discountLine" style="display:none"><span>الخصم</span><b id="discountOut">-0 ر.ع</b></div><div class="price-before" id="beforeDiscount" style="display:none">قبل الخصم: <span></span></div><div class="final-price"><small>السعر النهائي</small><strong id="priceOut">110 ر.ع</strong></div><button class="btn btn-whatsapp" onclick="openBookingModal()">تواصل لإتمام الحجز</button><p class="calc-note">السعر يشمل الخدمة الأساسية كاملة، وتُضاف الخدمات الاختيارية فقط عند تحديدها.</p></div></div></div></section>`}
function pricingSection(){const packages=getPackages();return `<section class="section" id="pricing"><div class="section-head"><h2>الباقات</h2><p>اختاري الباقة الأقرب لمناسبتك، ويمكننا تخصيص التفاصيل حسب احتياجك.</p><div class="underline"></div></div><div class="pricing">${packages.map((p,i)=>`<div class="price-card ${p.featured?'featured':''}"><h3>${escapeHtml(p.title)}</h3><div class="price">${Number(p.price||0)} ر.ع</div><p>${escapeHtml(p.desc||'')}</p><ul>${(p.features||[]).filter(Boolean).map(f=>`<li>✓ ${escapeHtml(f)}</li>`).join('')}</ul><button class="btn ${p.featured?'btn-primary':'btn-secondary'}" onclick="openBookingModal('${escapeHtml(p.title)}')">اختيار الباقة</button></div>`).join('')}</div></section>`}
function faqSection(){const q=[['هل ترسلون الدعوات عن طريق واتساب؟','نعم، يتم إرسال الدعوات عبر واتساب مع متابعة حالة الإرسال والردود.'],['هل لكل ضيف QR خاص؟','نعم، يمكن إنشاء بطاقة دخول ورمز QR لكل ضيف حسب عدد البطاقات.'],['هل العميل يرى الإحصائيات؟','نعم، بوابة العميل تعرض الإحصائيات والحضور والرسائل والبطاقات.'],['هل يمكن تعديل قائمة الضيوف بعد إرسال الدعوات؟','نعم، يمكن إضافة أو تعديل الضيوف حسب مرحلة المناسبة وبما لا يؤثر على سير التنظيم.'],['ماذا يحدث إذا اعتذر أحد الضيوف؟','يتم تحديث حالته مباشرة، ويمكنكم استبداله أو متابعة القائمة من لوحة العميل.']];return `<section class="section"><div class="section-head"><h2>الأسئلة الشائعة</h2><div class="underline"></div></div><div class="faq">${q.map(x=>`<div class="faq-item"><div class="faq-q" onclick="this.parentElement.classList.toggle('open')">${x[0]} <span>+</span></div><div class="faq-a">${x[1]}</div></div>`).join('')}</div></section>`}
function ctaSection(){return `<section class="section"><div class="cta"><h2>جاهز تبدأ؟</h2><p>دعنا نتولى إدارة مناسبتك بالكامل، من أول دعوة وحتى لحظة استقبال ضيوفك.</p><button class="btn btn-secondary" onclick="openBookingModal()">احجز الآن</button></div></section>`}
function bookingModal(plan=''){return `<div class="modal" id="bookingModal"><div class="modal-box"><h2>طلب حجز جديد</h2><div class="form-row"><div class="field"><label>الاسم</label><input id="leadName"></div><div class="field"><label>رقم الهاتف</label><input id="leadPhone"></div></div><div class="form-row"><div class="field"><label>نوع المناسبة</label><select id="leadType"><option>${plan||'زفاف'}</option><option>خطوبة</option><option>مناسبة خاصة</option></select></div><div class="field"><label>عدد الضيوف</label><input id="leadGuests" type="number" value="250"></div></div><div class="field"><label>ملاحظات</label><textarea id="leadNotes" rows="3"></textarea></div><div style="display:flex;gap:12px"><button class="btn btn-primary" onclick="saveLead()">إرسال الطلب</button><button class="btn btn-ghost" onclick="closeModal('bookingModal')">إغلاق</button></div></div></div>`}
function openBookingModal(plan=''){ if(!$('#bookingModal')) app.insertAdjacentHTML('beforeend',bookingModal(plan)); $('#bookingModal').classList.add('open'); }
function closeModal(id){
  if(id==='demoCompleteModal') saveDemoRatingToAdmin();
  $('#'+id)?.classList.remove('open');
}
function saveLead(){const name=$('#leadName').value.trim(); if(!name) return showToast('اكتبي الاسم أولاً'); const bookings=db.bookings; bookings.unshift({id:uid(),clientName:name,clientPhone:$('#leadPhone').value,eventName:`${$('#leadType').value} ${name}`,eventType:$('#leadType').value,eventDate:new Date(Date.now()+86400000*30).toISOString().slice(0,10),venueName:'لم يؤكد التحديد',receptionTime:'8:00 مساءً',health:28,status:'lead',createdAt:now(),screenUploaded:false,cardsReady:false}); db.bookings=bookings; closeModal('bookingModal'); showToast('تم حفظ الطلب داخل النظام');}
function renderDemo(){let data=JSON.parse(sessionStorage.getItem('demo')||'{}'); let step=Number(data.step||1); app.innerHTML=nav()+`<main class="container section"><div class="demo-wrap"><div class="wizard route-page"><h2>🎯 تجربة دعوة التفاعلية</h2><div class="wizard-steps">${[1,2,3,4,5].map(i=>`<span class="chip ${i===step?'active':''}">${i}</span>`).join('')}</div><div id="demoStep"></div></div><div class="preview-card" id="demoPreview"></div></div></main>`; renderDemoStep(step); afterRender();}
function renderDemoStep(step){const d=JSON.parse(sessionStorage.getItem('demo')||'{}'); const box=$('#demoStep'); const prev=$('#demoPreview'); prev.className='demo-phone-holder live-preview-holder'; prev.innerHTML=whatsappPhonePreview({guest:d.guest1||d.name||'أمينة بنت محمد',groom:d.groom||'محمد',bride:d.bride||'مريم',venue:d.venue||'قاعة المرجان',date:d.date||'15 أكتوبر 2026',cards:d.cards1||1});
 if(step===1) box.innerHTML=`<h3>بيانات العميل</h3><div class="live-hint">كل حرف تكتبينه يظهر مباشرة في المعاينة 👈</div><div class="field"><label>اسمك</label><input id="demoName" data-live="1" value="${d.name||''}" placeholder="مثال: وضحة"></div><div class="field"><label>رقم الهاتف</label><input id="demoPhone" data-live="1" value="${d.phone||''}" placeholder="9689XXXXXXX"></div><button class="btn btn-primary" onclick="demoSave(2)">التالي</button>`;
 if(step===2) box.innerHTML=`<h3>بيانات المناسبة</h3><div class="live-hint">المعاينة Live: الأسماء والقاعة والتاريخ تتغير فوراً داخل الواتساب</div><div class="form-row"><div class="field"><label>اسم العريس</label><input id="demoGroom" data-live="1" value="${d.groom||''}" placeholder="محمد"></div><div class="field"><label>اسم العروس</label><input id="demoBride" data-live="1" value="${d.bride||''}" placeholder="مريم"></div></div><div class="form-row"><div class="field"><label>اسم القاعة</label><input id="demoVenue" data-live="1" value="${d.venue||''}" placeholder="قاعة المرجان"></div><div class="field"><label>التاريخ</label><input id="demoDate" data-live="1" value="${d.date||''}" placeholder="15 أكتوبر 2026"></div></div><button class="btn btn-primary" onclick="demoSave(3)">التالي</button>`;
 if(step===3) box.innerHTML=`<h3>إضافة الضيوف</h3><div class="live-hint">اسم الضيف الأول وعدد بطاقاته يظهران مباشرة في رسالة الواتساب</div><div class="form-row"><div class="field"><label>الضيف الأول</label><input id="demoGuest1" data-live="1" value="${d.guest1||''}" placeholder="أمينة بنت محمد"></div><div class="field"><label>عدد البطاقات</label><input id="demoCards1" data-live="1" type="number" min="1" max="10" value="${d.cards1||1}"></div></div><div class="form-row"><div class="field"><label>الضيف الثاني</label><input id="demoGuest2" data-live="1" value="${d.guest2||''}" placeholder="لطيفة الكندي"></div><div class="field"><label>عدد البطاقات</label><input id="demoCards2" data-live="1" type="number" min="1" max="10" value="${d.cards2||1}"></div></div><button class="btn btn-primary" onclick="demoSave(4)">معاينة</button>`;
 if(step===4) box.innerHTML=`<h3>المراجعة</h3><div class="card"><b>${d.groom||'محمد'} & ${d.bride||'مريم'}</b><p>${d.venue||'قاعة المرجان'} — ضيفان تجريبيان</p><small>المعاينة على اليمين تعرض الرسالة النهائية كما ستصل للضيف الأول.</small></div><button class="btn btn-primary" onclick="runDemoSend()">🚀 إنشاء وإرسال الدعوات</button>`;
 if(step===5) box.innerHTML=`<h3>تمت التجربة بنجاح 🎉</h3><div class="cards"><div class="card"><div class="big-number">2</div><span>ضيف</span></div><div class="card"><div class="big-number">1</div><span>حاضر</span></div><div class="card"><div class="big-number">1</div><span>لم يؤكد</span></div></div><button class="btn btn-primary" onclick="showDemoCompleteModal()">عرض ملخص التجربة</button><button class="btn btn-secondary" onclick="openBookingModal()">احجز مناسبتك الآن</button>`;
 bindDemoLivePreview(); safeIcons();}
function collectDemoLive(){const d=JSON.parse(sessionStorage.getItem('demo')||'{}'); ['Name','Phone','Groom','Bride','Venue','Date','Guest1','Guest2','Cards1','Cards2'].forEach(k=>{const el=$('#demo'+k); if(el)d[k.toLowerCase()]=el.value}); return d;}
function updateDemoLivePreview(){const d=collectDemoLive(); sessionStorage.setItem('demo',JSON.stringify({...d,step:Number((JSON.parse(sessionStorage.getItem('demo')||'{}')).step||1)})); const prev=$('#demoPreview'); if(!prev)return; prev.innerHTML=whatsappPhonePreview({guest:d.guest1||d.name||'أمينة بنت محمد',groom:d.groom||'محمد',bride:d.bride||'مريم',venue:d.venue||'قاعة المرجان',date:d.date||'15 أكتوبر 2026',cards:d.cards1||1}); safeIcons();}
function bindDemoLivePreview(){$$('[data-live]').forEach(el=>{el.addEventListener('input',updateDemoLivePreview);el.addEventListener('change',updateDemoLivePreview)}); updateDemoLivePreview();}
function demoSave(next){const d=collectDemoLive(); d.step=next; sessionStorage.setItem('demo',JSON.stringify(d)); renderDemoStep(next)}
function runDemoSend(){const box=$('#demoStep'); box.innerHTML=`<h3>جاري تجهيز التجربة...</h3><div class="timeline"><div class="tl">⏳ إنشاء المناسبة</div><div class="tl">⏳ توليد QR</div><div class="tl">⏳ تجهيز الرسائل</div></div><div class="progress"><span style="width:15%"></span></div>`; let p=15; const int=setInterval(()=>{p+=22; $('.progress span').style.width=Math.min(p,100)+'%'; if(p>95){clearInterval(int); demoSave(5); setTimeout(showDemoCompleteModal,260); showToast('تم إرسال التجربة بنجاح')}} ,500)}
function renderAbout(){app.innerHTML=nav()+`<main class="container section route-page"><div class="section-head"><h2>استكشف منصة دعوة</h2><p>كل مرحلة مصممة لتقليل العمل اليدوي وزيادة وضوح المناسبة.</p><div class="underline"></div></div>${featuresSection()}${showcaseSection()}</main>`; afterRender();}
function renderLogin(){app.innerHTML=nav()+`<main class="container section"><div class="login-card" style="max-width:520px;margin:auto"><h2>تسجيل الدخول</h2><div class="field"><label>البريد</label><input id="email" placeholder="اكتبي اسم المستخدم أو البريد"></div><div class="field"><label>كلمة المرور</label><input id="pass" type="password" placeholder="كلمة المرور"></div><button class="btn btn-primary" onclick="login()">دخول</button></div></main>`; afterRender();}
async function login(){const email=$('#email').value.trim(); const pass=$('#pass').value; if(supabaseClient){try{const {data,error}=await supabaseClient.auth.signInWithPassword({email,password:pass}); if(!error && data.user){const acc=findAccount(email)||{email,role:email.includes('admin')?'admin':'client'}; currentUser={email,role:acc.role||acc.type,name:acc.name||email,accountId:acc.id,bookingId:acc.bookingId||''}; localStorage.setItem('dawaa_user',JSON.stringify(currentUser)); return go(currentUser.role==='admin'?'/admin/dashboard':'/client/dashboard')}}catch(e){}}
 const acc=findAccount(email); if(!acc || acc.password!==pass) return showToast('بيانات الدخول غير صحيحة أو الحساب معطل'); currentUser={email:acc.email||email,role:acc.role||acc.type,name:acc.name||'',accountId:acc.id,bookingId:acc.bookingId||'',permissions:acc.permissions||[]}; localStorage.setItem('dawaa_user',JSON.stringify(currentUser)); go(currentUser.role==='admin'?'/admin/dashboard':'/client/dashboard')}
function ensure(role){if(!currentUser){go('/login');return false} if(role && currentUser.role!==role){showToast('ليس لديك صلاحية لهذه الصفحة');go('/login');return false} return true}
function logout(){localStorage.removeItem('dawaa_user');currentUser=null;go('/')}
function adminShell(content,active='dashboard'){app.innerHTML=`<div class="app-shell command-admin"><aside class="side" id="side"><div class="brand"><div class="logo-mark"><img src="assets/dawaa-logo-purple.png" alt="شعار دعوة"></div><span>دعوة</span></div><div class="side-caption">غرفة عمليات المناسبات</div><div class="side-menu">${[['dashboard','الرئيسية','home','dashboard'],['operations','المناسبات','calendar-days','operations'],['guests','الضيوف','users','guests'],['clients','العملاء','user-round','clients'],['accounts','الحسابات','user-cog','accounts'],['send','الإرسال','send','send'],['messages','الرسائل','message-circle','messages'],['ratings','تقييم الزوار','star','ratings'],['reports','التقارير','bar-chart-3','reports'],['packages','الباقات','badge-dollar-sign','packages'],['integrations','التكاملات','plug-zap','integrations'],['settings','الإعدادات','settings','settings']].map(x=>`<div class="side-link ${active===x[0]?'active':''}" onclick="go('/admin/${x[3]}')">${icon(x[2],20)} ${x[1]}</div>`).join('')}<div class="side-divider"></div><div class="side-link" onclick="toggleCommand(true)">${icon('search',20)} البحث السريع</div><div class="side-link" onclick="logout()">${icon('log-out',20)} خروج</div></div></aside><main class="main"><div class="topbar admin-topbar"><button class="btn btn-secondary mobile-toggle" onclick="$('#side').classList.toggle('open')">${icon('menu',20)}</button><button class="search command-search" onclick="toggleCommand(true)">ابحثي عن مناسبة، ضيف، رقم، أو نفذي أمر… <b>Ctrl K</b></button><div class="quick-actions"><button class="btn btn-secondary" onclick="openGuestModal()">ضيف جديد</button><button class="btn btn-primary" onclick="openEventModal()">مناسبة جديدة</button></div></div><div class="route-page">${content}</div></main></div>${eventModal()}${guestModal()}${commandPalette()}<div class="drawer wide-drawer" id="drawer"></div>`; afterRender();}
function renderAdmin(route){if(!ensure('admin'))return; const page=route.split('/')[2]||'dashboard'; if(page==='dashboard') return adminDashboard(); if(page==='operations') return adminOperations(); if(page==='events') return adminOperations(); if(page==='guests') return adminGuests(); if(page==='clients') return adminClients(); if(page==='accounts') return adminAccounts(); if(page==='send') return adminSend(); if(page==='messages') return adminMessages(); if(page==='ratings') return adminRatings(); if(page==='recovery') return adminRecovery(); if(page==='reports') return adminReports(); if(page==='status') return adminStatus(); if(page==='packages') return adminPackages(); if(page==='integrations') return adminIntegrations(); if(page==='settings') return adminSettings(); adminDashboard();}
function statsFor(bookingId){const gs=db.guests.filter(g=>!bookingId||g.bookingId===bookingId); return {total:gs.length,pending:gs.filter(g=>g.rsvpStatus==='pending').length,confirmed:gs.filter(g=>g.rsvpStatus==='confirmed').length,declined:gs.filter(g=>g.rsvpStatus==='declined').length,sent:gs.filter(g=>['sent','delivered','read'].includes(g.rsvpStatus)).length,failed:gs.filter(g=>g.rsvpStatus==='failed').length}}
function adminDashboard(){const bookings=db.bookings; const s=statsFor(); const today=bookings.filter(b=>new Date(b.eventDate).toDateString()===new Date().toDateString()).length; const needs=bookings.filter(b=>(b.health||0)<85).length; adminShell(`<div class="ops-hero"><div><span class="eyebrow">لوحة عمليات دعوة</span><h1>كل ما يحتاج انتباهك اليوم في مكان واحد</h1><p>ابدئي من المهام العاجلة وتابعي كل مناسبة من مكان واحد.</p></div><div class="ops-live"><span></span> آخر تحديث قبل ثواني</div></div><div class="focus-grid"><div class="focus-card purple"><small>مناسبات اليوم</small><b>${today||1}</b><span>جاهزة للمتابعة</span></div><div class="focus-card red"><small>تحتاج تدخل</small><b>${needs}</b><span>مناسبة غير مكتملة</span></div><div class="focus-card orange"><small>لم يؤكد الرد</small><b>${s.pending}</b><span>ضيف يحتاج تذكير</span></div><div class="focus-card green"><small>ردود مؤكدة</small><b>${s.confirmed}</b><span>تم تأكيد حضورهم</span></div></div><section class="attention-panel"><div class="section-title-row"><h2>يحتاج تدخلك الآن</h2><button class="btn btn-secondary" onclick="go('/admin/operations')">عرض كل المناسبات</button></div><div class="todo-list"><button onclick="go('/admin/send')"><b>إرسال تذكير</b><span>${s.pending} ضيف لم يؤكد الحضور بعد</span>${icon('arrow-left',18)}</button><button onclick="go('/admin/operations')"><b>مراجعة الجاهزية</b><span>${needs} مناسبة أقل من 85%</span>${icon('arrow-left',18)}</button><button onclick="go('/admin/packages')"><b>تحديث الباقات</b><span>إدارة الأسعار والمميزات المعروضة للزوار</span>${icon('arrow-left',18)}</button></div></section><section class="workspace-list"><div class="section-title-row"><h2>مساحات العمل النشطة</h2><button class="btn btn-primary" onclick="openEventModal()">إنشاء مناسبة</button></div>${bookings.map(eventWorkspaceCard).join('')}</section>`, 'dashboard')}
function card(t,n,ic){return `<div class="card"><div style="color:var(--p600)">${icon(ic,30)}</div><h3>${t}</h3><div class="big-number">${n}</div></div>`}
function eventWorkspaceCard(b){const s=statsFor(b.id); const need=(b.health||0)<85; return `<article class="workspace-card ${need?'needs':''}"><div class="workspace-main"><div class="workspace-icon">${icon(need?'alert-circle':'sparkles',28)}</div><div><div class="workspace-meta"><span>${fmt(b.eventDate)}</span><span>${b.venueName||'بدون قاعة'}</span><span>${s.total} ضيف</span></div><h3>${b.eventName}</h3><div class="stage-strip"><span class="done">الحجز</span><span class="${s.total?'done':'wait'}">الضيوف</span><span class="${s.sent?'done':'wait'}">الدعوات</span><span class="active">الردود</span><span class="${b.cardsReady?'done':'wait'}">QR</span><span class="${b.screenUploaded?'done':'wait'}">الشاشة</span></div></div></div><div class="workspace-side"><div class="health-ring" style="--score:${b.health||50}%"><b>${b.health||50}%</b></div><button class="btn btn-primary" onclick="openEventWorkspace('${b.id}')">إدارة المناسبة</button></div></article>`}
function activityFeed(){return db.messages.slice(-6).reverse().map(m=>`<div class="tl"><span class="dot"></span>${m.text}<small style="margin-right:auto;color:#777">قبل قليل</small></div>`).join('') || '<p>لا توجد نشاطات بعد.</p>'}
function adminOperations(){adminShell(`<div class="section-title-row"><div><span class="eyebrow">المناسبات</span><h1>غرفة العمليات</h1><p class="muted">كل مناسبة تظهر كمساحة عمل واضحة، مع المرحلة الحالية والإجراء التالي.</p></div><button class="btn btn-primary" onclick="openEventModal()">مناسبة جديدة</button></div><div class="ops-board">${db.bookings.map(eventWorkspaceCard).join('')}</div>`, 'operations')}
function adminEvents(){adminOperations()}
function adminGuests(){
 const selectedBooking=getSelectedBookingId();
 const booking=db.bookings.find(b=>b.id===selectedBooking);
 const guests=filteredGuestsList();
 adminShell(`<div class="section-title-row"><div><span class="eyebrow">الضيوف</span><h1>ضيوف ${escapeHtml(booking?.eventName||'المناسبة')}</h1><p class="muted">كل مناسبة لها قائمة ضيوف منفصلة. اختاري المناسبة أولاً ثم أضيفي أو عدلي أو أرسلي لضيوفها فقط.</p></div><div class="quick-actions"><button class="btn btn-secondary" onclick="triggerImportGuests()">رفع Excel/CSV</button><button class="btn btn-primary" onclick="openGuestModal()">إضافة ضيف</button><button class="btn btn-secondary" onclick="exportGuests()">تصدير CSV</button></div></div>
 ${bookingSelector()}
 <input id="guestImportFile" type="file" accept=".csv,.txt,.xlsx,.xls" style="display:none" onchange="importGuestsFile(event)">
 <div class="filter-bar compact-filter"><input class="search" id="guestSearch" oninput="renderGuestListOnly()" placeholder="ابحثي بالاسم أو الرقم"><div class="filter-chips"><button onclick="filterGuestsByStatus('')">الكل</button><button onclick="filterGuestsByStatus('confirmed')">حاضر</button><button onclick="filterGuestsByStatus('pending')">لم يؤكد</button><button onclick="filterGuestsByStatus('declined')">معتذر</button><button onclick="filterGuestsByStatus('sent')">مرسل</button></div></div>
 <div class="bulk-bar"><b id="bulkCount">${selectedGuestIds.size} محدد</b><button class="btn btn-secondary" onclick="selectAllVisibleGuests()">تحديد الظاهر</button><button class="btn btn-secondary" onclick="clearGuestSelection()">إلغاء التحديد</button><button class="btn btn-primary" onclick="sendSelectedGuests()">إرسال المحددين</button><button class="btn btn-secondary" onclick="bulkSetStatus('confirmed')">تحويل إلى حاضر</button><button class="btn btn-secondary" onclick="bulkSetStatus('pending')">تحويل إلى لم يؤكد</button><button class="btn btn-ghost" onclick="deleteSelectedGuests()">حذف المحددين</button></div>
 <div id="guestTable">${guestTable(guests, true)}</div>`, 'guests')
}
function filteredGuestsList(){const q=$('#guestSearch')?.value||''; const bookingId=getSelectedBookingId(); return db.guests.filter(g=>(!bookingId||g.bookingId===bookingId)&&(!guestStatusFilter||g.rsvpStatus===guestStatusFilter)&&(g.guestName.includes(q)||g.phoneNumber.includes(q)))}
function guestTable(guests, selectable=false){return `<div class="guest-card-grid compact-guests">${guests.length?guests.map(g=>{const b=db.bookings.find(x=>x.id===g.bookingId);return `<article class="guest-mini-card ${selectedGuestIds.has(g.id)?'selected':''}" onclick="openGuestDrawer('${g.id}')">${selectable?`<label class="select-dot" onclick="event.stopPropagation()"><input type="checkbox" ${selectedGuestIds.has(g.id)?'checked':''} onchange="toggleGuestSelection('${g.id}')"></label>`:''}<div class="guest-avatar">${escapeHtml((g.guestName||'ض')[0])}</div><div class="guest-info"><h3>${escapeHtml(g.guestName)}</h3><p>${g.phoneNumber} • ${g.cardsCount} بطاقات</p><small>${b?.eventName||''}</small></div><div class="guest-actions">${statusBadge(g.rsvpStatus)}<button class="btn btn-secondary btn-mini" onclick="event.stopPropagation();editGuest('${g.id}')">تعديل</button><button class="btn btn-secondary btn-mini" onclick="event.stopPropagation();sendOne('${g.id}')">إرسال</button><button class="btn btn-ghost btn-mini" onclick="event.stopPropagation();deleteGuest('${g.id}')">حذف</button></div></article>`}).join(''):`<div class="empty-state"><b>لا يوجد ضيوف لهذه المناسبة</b><span>ارفعي ملف Excel/CSV أو أضيفي ضيفاً جديداً.</span></div>`}</div>`}
function statusBadge(st){const map={pending:['لم يؤكد','b-orange'],confirmed:['حاضر','b-green'],declined:['معتذر','b-red'],sent:['مرسل','b-blue'],delivered:['تم التسليم','b-purple'],read:['مقروء','b-purple'],failed:['فشل','b-red'],'checked-in':['دخل','b-green']}; const m=map[st]||map.pending; return `<span class="badge ${m[1]}">${m[0]}</span>`}
function filterGuests(){renderGuestListOnly()}
function filterGuestsByStatus(st){guestStatusFilter=st; renderGuestListOnly()}
function renderGuestListOnly(){const box=$('#guestTable'); if(box) box.innerHTML=guestTable(filteredGuestsList(), true); const bc=$('#bulkCount'); if(bc) bc.textContent=selectedGuestIds.size+' محدد'; safeIcons();}
function toggleGuestSelection(id){selectedGuestIds.has(id)?selectedGuestIds.delete(id):selectedGuestIds.add(id); renderGuestListOnly()}
function selectAllVisibleGuests(){filteredGuestsList().forEach(g=>selectedGuestIds.add(g.id)); renderGuestListOnly()}
function clearGuestSelection(){selectedGuestIds.clear(); renderGuestListOnly()}
function deleteSelectedGuests(){if(!selectedGuestIds.size)return showToast('اختاري ضيوف أولاً'); if(!confirm('حذف الضيوف المحددين؟'))return; db.guests=db.guests.filter(g=>!selectedGuestIds.has(g.id)); selectedGuestIds.clear(); showToast('تم حذف الضيوف المحددين'); render()}
function bulkSetStatus(st){if(!selectedGuestIds.size)return showToast('اختاري ضيوف أولاً'); db.guests=db.guests.map(g=>selectedGuestIds.has(g.id)?{...g,rsvpStatus:st,repliedAt:st==='pending'?null:now(),confirmedCount:st==='confirmed'?g.cardsCount:0,declinedCount:st==='declined'?g.cardsCount:0,pendingCount:st==='pending'?g.cardsCount:0}:g); showToast('تم تحديث الحالة'); render()}
function sendSelectedGuests(){if(!selectedGuestIds.size)return showToast('اختاري ضيوف أولاً'); let count=0; db.guests=db.guests.map(g=>selectedGuestIds.has(g.id)?(count++,{...g,rsvpStatus:'sent',invitationSentAt:now()}):g); db.messages=[...db.messages,{id:uid(),bookingId:'bulk',text:`تم إرسال ${count} دعوة محددة`,createdAt:now(),status:'sent'}]; showToast(`تم إرسال ${count} دعوة`); selectedGuestIds.clear(); render()}
function triggerImportGuests(){$('#guestImportFile')?.click()}
function importGuestsFile(e){const file=e.target.files?.[0]; if(!file)return; const reader=new FileReader(); reader.onload=()=>{const text=String(reader.result||''); const lines=text.split(/\r?\n/).map(x=>x.trim()).filter(Boolean); const bookingId=getSelectedBookingId() || db.bookings[0]?.id; let added=0; const current=db.guests; lines.forEach((line,i)=>{if(i===0 && /name|اسم|phone|هاتف/i.test(line))return; const parts=line.split(/[,;\t]/).map(x=>x.trim()); const guestName=parts[0]||''; const phoneNumber=(parts[1]||'').replace(/\D/g,''); const cardsCount=Number(parts[2]||1); if(guestName && phoneNumber){current.push({id:uid(),bookingId,guestName,phoneNumber:phoneNumber.startsWith('968')?phoneNumber:'968'+phoneNumber,cardsCount,rsvpStatus:'pending',confirmedCount:0,declinedCount:0,pendingCount:cardsCount,shortCode:'DAWAA'+Math.floor(Math.random()*9999),checkedIn:false}); added++;}}); db.guests=current; showToast(`تم استيراد ${added} ضيف`); render()}; reader.readAsText(file)}

function normalizeMatchText(v=''){
  return String(v).toLowerCase().replace(/\.[a-z0-9]+$/i,'').replace(/[ً-ٰٟ]/g,'').replace(/[أإآا]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/[^؀-ۿa-z0-9]+/g,'');
}
function entryCardMatchStats(bookingId=getSelectedBookingId()){
  const guests=db.guests.filter(g=>g.bookingId===bookingId);
  const matched=guests.filter(g=>g.entryCardFile).length;
  const missing=guests.length-matched;
  const files=getEntryCardFiles(bookingId);
  const unmatched=files.filter(f=>!f.matchedGuestId).length;
  return {total:guests.length, matched, missing, files:files.length, unmatched};
}
function getEntryCardFiles(bookingId=getSelectedBookingId()){
  try{const all=JSON.parse(localStorage.getItem('dawaa_entry_card_files')||'{}'); return all[bookingId]||[]}catch(e){return []}
}
function saveEntryCardFiles(bookingId, files){
  let all={}; try{all=JSON.parse(localStorage.getItem('dawaa_entry_card_files')||'{}')||{}}catch(e){}
  all[bookingId]=files; localStorage.setItem('dawaa_entry_card_files', JSON.stringify(all));
}
function entryCardsMatcherPanel(bookingId=getSelectedBookingId()){
  const guests=db.guests.filter(g=>g.bookingId===bookingId);
  const st=entryCardMatchStats(bookingId);
  const rows=guests.slice(0,18).map(g=>`<div class="match-row ${g.entryCardFile?'matched':'missing'}"><div><b>${escapeHtml(g.guestName)}</b><small>${escapeHtml(g.shortCode||'بدون كود')} • ${escapeHtml(g.phoneNumber||'')}</small></div><span>${g.entryCardFile?escapeHtml(g.entryCardFile):'لا توجد بطاقة'}</span><button class="btn btn-secondary btn-mini" onclick="openManualCardMatch('${g.id}')">${g.entryCardFile?'تغيير':'مطابقة'}</button></div>`).join('');
  return `<div class="panel entry-match-panel"><div class="entry-match-head"><div><h3>مطابقة بطاقات الدخول مع المعازيم</h3><p class="muted">ارفعي صور أو PDF بطاقات الدخول. النظام يطابقها تلقائياً حسب اسم الضيف أو رقم الهاتف أو كود البطاقة، وبعدها تقدري تراجعي قبل الإرسال.</p></div><div class="quick-actions"><button class="btn btn-secondary" onclick="triggerEntryCardsUpload()">رفع بطاقات الدخول</button><button class="btn btn-primary" onclick="autoMatchEntryCards()">مطابقة تلقائية</button><button class="btn btn-ghost" onclick="clearEntryCardMatches()">مسح المطابقة</button></div></div><div class="entry-upload-dropzone" onclick="triggerEntryCardsUpload()" ondragover="event.preventDefault();this.classList.add('dragover')" ondragleave="this.classList.remove('dragover')" ondrop="handleEntryCardsDrop(event)"><div class="drop-icon">🎫</div><div><b>اضغطي هنا لرفع بطاقات الدخول</b><span>اختاري صور PNG/JPG/WebP أو ملفات PDF. يمكن رفع أكثر من ملف مرة واحدة.</span></div><button type="button" class="btn btn-primary" onclick="event.stopPropagation();triggerEntryCardsUpload()">اختيار الملفات</button></div><div class="match-stats"><div><b>${st.files}</b><span>ملف مرفوع</span></div><div class="ok"><b>${st.matched}</b><span>مطابقة</span></div><div class="warn"><b>${st.missing}</b><span>بدون بطاقة</span></div><div class="bad"><b>${st.unmatched}</b><span>ملفات غير مطابقة</span></div></div><div class="match-list">${rows || '<div class="empty-state"><b>اختاري مناسبة فيها ضيوف أولاً</b></div>'}</div>${st.files?`<details class="unmatched-files"><summary>عرض الملفات المرفوعة وغير المطابقة</summary>${getEntryCardFiles(bookingId).map(f=>`<div class="file-pill ${f.matchedGuestId?'ok':'warn'}">${escapeHtml(f.name)} ${f.matchedGuestId?'✓':'— غير مطابق'}</div>`).join('')}</details>`:''}</div>`;
}
function triggerEntryCardsUpload(){ $('#entryCardsInput')?.click(); }

function handleEntryCardsDrop(event){
  event.preventDefault();
  event.currentTarget.classList.remove('dragover');
  const files=[...(event.dataTransfer?.files||[])];
  if(!files.length) return;
  importEntryCards({target:{files}});
}

function importEntryCards(e){
  const bookingId=getSelectedBookingId(); const files=[...(e.target.files||[])];
  if(!bookingId) return showToast('اختاري المناسبة أولاً');
  if(!files.length) return;
  const existing=getEntryCardFiles(bookingId);
  const incoming=files.map(f=>({id:uid(),name:f.name,size:f.size,type:f.type,createdAt:now(),matchedGuestId:null}));
  saveEntryCardFiles(bookingId,[...existing,...incoming]);
  showToast(`تم رفع ${incoming.length} بطاقة دخول`);
  autoMatchEntryCards(false);
}
function autoMatchEntryCards(show=true){
  const bookingId=getSelectedBookingId();
  let files=getEntryCardFiles(bookingId).map(f=>({...f, matchedGuestId:null}));
  let guests=db.guests.filter(g=>g.bookingId===bookingId).map(g=>({...g, entryCardFile:null, entryCardFileId:null, entryCardMatchedAt:null}));
  const used=new Set();
  files=files.map(file=>{
    const fileNorm=normalizeMatchText(file.name); const fileDigits=String(file.name).replace(/\D/g,'');
    let match=guests.find(g=>!used.has(g.id) && g.shortCode && fileNorm.includes(normalizeMatchText(g.shortCode)));
    if(!match) match=guests.find(g=>!used.has(g.id) && g.phoneNumber && (fileDigits.includes(String(g.phoneNumber).slice(-8)) || fileDigits.includes(String(g.phoneNumber).slice(-4))));
    if(!match) match=guests.find(g=>!used.has(g.id) && normalizeMatchText(g.guestName).length>2 && fileNorm.includes(normalizeMatchText(g.guestName)));
    if(!match){
      const num=Number((file.name.match(/(?:^|\D)(\d{1,4})(?:\D|$)/)||[])[1]);
      if(num && guests[num-1] && !used.has(guests[num-1].id)) match=guests[num-1];
    }
    if(match){used.add(match.id); file.matchedGuestId=match.id;}
    return file;
  });
  const updated=db.guests.map(g=>{
    if(g.bookingId!==bookingId) return g;
    const file=files.find(f=>f.matchedGuestId===g.id);
    return file?{...g, entryCardFile:file.name, entryCardFileId:file.id, entryCardMatchedAt:now()}:{...g, entryCardFile:null, entryCardFileId:null, entryCardMatchedAt:null};
  });
  db.guests=updated; saveEntryCardFiles(bookingId,files);
  const st=entryCardMatchStats(bookingId);
  if(show) showToast(`تمت مطابقة ${st.matched} من ${st.total} بطاقة`);
  render();
}
function clearEntryCardMatches(){
  const bookingId=getSelectedBookingId();
  if(!confirm('مسح مطابقة بطاقات الدخول لهذه المناسبة؟')) return;
  saveEntryCardFiles(bookingId, getEntryCardFiles(bookingId).map(f=>({...f, matchedGuestId:null})));
  db.guests=db.guests.map(g=>g.bookingId===bookingId?{...g, entryCardFile:null, entryCardFileId:null, entryCardMatchedAt:null}:g);
  showToast('تم مسح المطابقة'); render();
}
function openManualCardMatch(guestId){
  const bookingId=getSelectedBookingId(); const g=db.guests.find(x=>x.id===guestId); const files=getEntryCardFiles(bookingId);
  if(!files.length) return showToast('ارفعي بطاقات الدخول أولاً');
  const options=files.map(f=>`<option value="${f.id}" ${g.entryCardFileId===f.id?'selected':''}>${escapeHtml(f.name)}</option>`).join('');
  openRawModal(`<div class="modal-box"><h2>مطابقة بطاقة دخول</h2><p class="muted">${escapeHtml(g.guestName)}</p><div class="field"><label>اختاري ملف البطاقة</label><select id="manualCardFile"><option value="">بدون بطاقة</option>${options}</select></div><button class="btn btn-primary" onclick="saveManualCardMatch('${guestId}')">حفظ المطابقة</button><button class="btn btn-ghost" onclick="closeModal('rawModal')">إغلاق</button></div>`);
}
function saveManualCardMatch(guestId){
  const bookingId=getSelectedBookingId(); const fileId=$('#manualCardFile').value; let files=getEntryCardFiles(bookingId).map(f=>f.matchedGuestId===guestId?{...f,matchedGuestId:null}:f);
  const file=files.find(f=>f.id===fileId); if(file) file.matchedGuestId=guestId;
  saveEntryCardFiles(bookingId,files);
  db.guests=db.guests.map(g=>g.id===guestId?{...g,entryCardFile:file?file.name:null,entryCardFileId:file?file.id:null,entryCardMatchedAt:file?now():null}:g);
  closeModal('rawModal'); showToast('تم حفظ المطابقة'); render();
}
function openRawModal(html){let m=$('#rawModal'); if(!m){m=document.createElement('div');m.id='rawModal';m.className='modal';document.body.appendChild(m)} m.innerHTML=html; m.classList.add('open');}
function adminClients(){
 const bookings=db.bookings;
 adminShell(`<div class="section-title-row"><div><span class="eyebrow">العملاء</span><h1>إدارة العملاء</h1><p class="muted">هذه الصفحة مخصصة للعملاء والحجوزات فقط، منفصلة عن صفحة الضيوف.</p></div><button class="btn btn-primary" onclick="openEventModal()">إضافة عميل / مناسبة</button></div><div class="guest-card-grid">${bookings.map(b=>{const s=statsFor(b.id);return `<article class="guest-mini-card" onclick="openEventWorkspace('${b.id}')"><div class="guest-avatar">${escapeHtml((b.clientName||'ع')[0])}</div><div class="guest-info"><h3>${escapeHtml(b.clientName||'عميل')}</h3><p>${b.clientPhone||''} • ${b.eventName}</p><small>${fmt(b.eventDate)} • ${b.venueName||'بدون قاعة'}</small></div><div class="guest-actions"><span class="badge b-purple">${s.total} ضيف</span><button class="btn btn-secondary" onclick="event.stopPropagation();openEventWorkspace('${b.id}')">إدارة</button></div></article>`}).join('')}</div>`, 'clients')
}
function adminSend(){
 const selectedBooking=getSelectedBookingId();
 const booking=db.bookings.find(b=>b.id===selectedBooking);
 const guests=filteredGuestsList(); const pending=db.guests.filter(g=>g.bookingId===selectedBooking && g.rsvpStatus==='pending');
 adminShell(`<div class="section-title-row"><div><span class="eyebrow">الإرسال</span><h1>إرسال دعوات ${escapeHtml(booking?.eventName||'المناسبة')}</h1><p class="muted">اختاري المناسبة أولاً. كل الرفع والتحديد والإرسال يتم لضيوف هذه المناسبة فقط.</p></div><div class="quick-actions"><button class="btn btn-secondary" onclick="triggerImportGuests()">رفع Excel/CSV</button><button class="btn btn-secondary entry-upload-top" onclick="triggerEntryCardsUpload()">رفع بطاقات الدخول</button><button class="btn btn-primary" onclick="openGuestModal()">إضافة ضيف</button></div></div>
 ${bookingSelector()}
 <input id="guestImportFile" type="file" accept=".csv,.txt,.xlsx,.xls" style="display:none" onchange="importGuestsFile(event)">
 <input id="entryCardsInput" type="file" multiple accept="image/*,.pdf,.png,.jpg,.jpeg,.webp" style="display:none" onchange="importEntryCards(event)">
 <div class="send-workflow"><div class="workflow-step done"><b>1</b><h3>القالب</h3><p>جاهز للإرسال</p></div><div class="workflow-step done"><b>2</b><h3>الأرقام</h3><p>${guests.length} رقم داخل المناسبة</p></div><div class="workflow-step active"><b>3</b><h3>بطاقات الدخول</h3><p>${entryCardMatchStats(selectedBooking).matched}/${guests.length} مطابقة</p></div><div class="workflow-step"><b>4</b><h3>الإرسال</h3><p>${pending.length} ضيف لم يؤكد</p></div></div>
 ${entryCardsMatcherPanel(selectedBooking)}
 <div class="panel" style="margin-top:22px"><h3>طريقة الإرسال</h3><div class="send-mode-grid"><label class="addon-card"><input type="radio" name="sendMode" value="all" ${sendModeState==='all'?'checked':''} onchange="sendModeState='all'"> إرسال جماعي لكل من لم يؤكد في هذه المناسبة</label><label class="addon-card"><input type="radio" name="sendMode" value="selected" ${sendModeState==='selected'?'checked':''} onchange="sendModeState='selected'"> إرسال للمحددين فقط</label><label class="addon-card"><input type="radio" name="sendMode" value="single" ${sendModeState==='single'?'checked':''} onchange="sendModeState='single'"> إرسال مفرد من بطاقة الضيف</label></div><div class="checklist" style="margin-top:16px"><div class="check">✔ القالب جاهز</div><div class="check">✔ الأرقام قابلة للتنظيف</div><div class="check">✔ ضيوف المناسبة محددون</div><div class="check">${supabaseClient?'✔ Supabase متصل':'🟡 يعمل محلياً — أضيفي مفاتيح Supabase للتفعيل'}</div></div><button class="btn btn-primary" onclick="sendByMode()">تنفيذ الإرسال</button></div>
 <div class="filter-bar compact-filter"><input class="search" id="guestSearch" oninput="renderGuestListOnly()" placeholder="ابحثي بالاسم أو الرقم"><div class="filter-chips"><button onclick="filterGuestsByStatus('')">الكل</button><button onclick="filterGuestsByStatus('confirmed')">حاضر</button><button onclick="filterGuestsByStatus('pending')">لم يؤكد</button><button onclick="filterGuestsByStatus('declined')">معتذر</button><button onclick="filterGuestsByStatus('sent')">مرسل</button></div></div><div class="bulk-bar"><b id="bulkCount">${selectedGuestIds.size} محدد</b><button class="btn btn-secondary" onclick="selectAllVisibleGuests()">تحديد الظاهر</button><button class="btn btn-secondary" onclick="clearGuestSelection()">إلغاء التحديد</button><button class="btn btn-secondary" onclick="bulkSetStatus('pending')">تحويل إلى لم يؤكد</button><button class="btn btn-ghost" onclick="deleteSelectedGuests()">حذف المحددين</button></div><div id="guestTable">${guestTable(guests,true)}</div>`, 'send')
}
function sendByMode(){
 const st=entryCardMatchStats(getSelectedBookingId());
 if(st.total && st.missing>0 && !confirm(`يوجد ${st.missing} ضيف بدون بطاقة دخول مطابقة. هل تريدين المتابعة؟`)) return;
 if(sendModeState==='all') return sendInvitations();
 if(sendModeState==='selected') return sendSelectedGuests();
 showToast('لإرسال مفرد اضغطي زر إرسال داخل بطاقة الضيف')
}
function sendInvitations(){const bookingId=getSelectedBookingId(); let guests=db.guests; let count=0; guests=guests.map(g=>{if(g.bookingId===bookingId && g.rsvpStatus==='pending'){count++; return {...g,rsvpStatus:'sent',invitationSentAt:now()}} return g}); db.guests=guests; db.messages=[...db.messages,{id:uid(),bookingId:bookingId,text:`تم إرسال ${count} دعوة`,createdAt:now(),status:'sent'}]; showToast(`تم إرسال ${count} دعوة تجريبياً`); render()}
function sendOne(id){let guests=db.guests; const g=guests.find(x=>x.id===id); if(!g)return; g.rsvpStatus='sent'; g.invitationSentAt=now(); db.guests=guests; db.messages=[...db.messages,{id:uid(),bookingId:g.bookingId,guestId:id,text:`تم إرسال الدعوة إلى ${g.guestName}`,createdAt:now(),status:'sent'}]; showToast('تم الإرسال'); render()}
function editGuest(id){const g=db.guests.find(x=>x.id===id); if(!g)return; openGuestModal(); setTimeout(()=>{ $('#gEditingId').value=g.id; $('#gBooking').value=g.bookingId; $('#gName').value=g.guestName; $('#gPhone').value=g.phoneNumber; $('#gCards').value=g.cardsCount; $('#guestModalTitle').textContent='تعديل ضيف'; },0)}
function sendReminders(bid){showToast('تم إرسال التذكير للضيوف غير المؤكدين')}
function uploadScreen(bid){let b=db.bookings; const x=b.find(e=>e.id===bid); if(x){x.screenUploaded=true;x.health=Math.min(100,(x.health||70)+5);db.bookings=b;} showToast('تم رفع الشاشة الترحيبية'); render()}
function adminMessages(){adminShell(`<h1>مركز الرسائل</h1><div class="showcase"><div class="panel"><h3>المحادثات</h3>${db.guests.map(g=>`<div class="story-item" onclick="openGuestDrawer('${g.id}')"><span>${g.guestName}</span><small style="margin-right:auto">${statusBadge(g.rsvpStatus)}</small></div>`).join('')}</div><div class="mock-board"><h3>محادثة واتساب</h3><div class="wa-card"><p>مرحباً، كم سعر الخدمة؟</p></div><div class="wa-card" style="background:var(--p50);margin-top:16px"><p>مرحباً، باقة دعوة المتكامل تبدأ من 150 ر.ع وتشمل الإرسال والمتابعة وبطاقات QR.</p></div><div style="display:flex;gap:10px;margin-top:20px"><input class="search" placeholder="اكتب رسالة..."><button class="btn btn-primary" onclick="showToast('تم إرسال الرسالة تجريبياً')">إرسال</button></div></div></div>`,'messages')}
function adminRecovery(){adminShell(`<h1>مركز استعادة الإرسال</h1><div class="cards">${card('فاشلة',db.guests.filter(g=>g.rsvpStatus==='failed').length,'x-circle')} ${card('غير مقروءة',2,'eye-off')} ${card('أرقام تحتاج مراجعة',1,'phone-off')} ${card('قابلة للإعادة',3,'refresh-cw')}</div><div class="panel" style="margin-top:22px"><h3>اقتراحات ذكية</h3><div class="tl"><span class="dot"></span> الرقم 9944507 يحتاج مفتاح الدولة +968 <button class="btn btn-secondary" onclick="showToast('تم إصلاح الرقم')">إصلاح</button></div><div class="tl"><span class="dot"></span> يمكن إعادة إرسال الدعوات التي لم تُقرأ منذ 3 أيام</div></div>`,'recovery')}
function adminReports(){
 const selectedBooking=getSelectedBookingId();
 const booking=db.bookings.find(b=>b.id===selectedBooking) || db.bookings[0];
 const guests=db.guests.filter(g=>!booking || g.bookingId===booking.id);
 const s=statsFor(booking?.id);
 const totalCards=guests.reduce((sum,g)=>sum+Number(g.cardsCount||1),0);
 const confirmedCards=guests.reduce((sum,g)=>sum+Number(g.confirmedCount||0),0);
 const declinedCards=guests.reduce((sum,g)=>sum+Number(g.declinedCount||0),0);
 const pendingCards=Math.max(0,totalCards-confirmedCards-declinedCards);
 const sentCount=guests.filter(g=>g.invitationSentAt || ['sent','delivered','read','confirmed','declined'].includes(g.rsvpStatus)).length;
 const deliveredCount=guests.filter(g=>g.deliveredAt || ['delivered','read','confirmed','declined'].includes(g.rsvpStatus)).length;
 const readCount=guests.filter(g=>g.readAt || ['read','confirmed','declined'].includes(g.rsvpStatus)).length;
 const responseRate=s.total?Math.round(((s.confirmed+s.declined)/s.total)*100):0;
 const attendanceRate=totalCards?Math.round((confirmedCards/totalCards)*100):0;
 const deliveryRate=s.total?Math.round((deliveredCount/s.total)*100):0;
 const reportRows=guests.map(g=>`<tr><td><b>${escapeHtml(g.guestName)}</b><small>${escapeHtml(g.phoneNumber)}</small></td><td>${g.cardsCount||1}</td><td>${statusBadge(g.rsvpStatus)}</td><td>${g.confirmedCount||0}</td><td>${g.declinedCount||0}</td><td>${g.pendingCount||0}</td></tr>`).join('');
 adminShell(`<div class="section-title-row"><div><span class="eyebrow">التقارير</span><h1>تقرير ${escapeHtml(booking?.eventName||'المناسبة')}</h1><p class="muted">اختاري المناسبة وشوفي ملخص الحضور، الردود، الإرسال، والبطاقات بشكل واضح وقابل للتصدير.</p></div><div class="quick-actions"><button class="btn btn-secondary" onclick="print()">طباعة التقرير</button><button class="btn btn-primary" onclick="exportReportCsv()">تصدير CSV</button></div></div>
 ${bookingSelector()}
 <div class="report-summary-grid">
   <div class="report-hero-card"><span>نسبة الحضور</span><b>${attendanceRate}%</b><div class="progress"><span style="width:${attendanceRate}%"></span></div><small>${confirmedCards} بطاقة حضور من أصل ${totalCards}</small></div>
   <div class="report-hero-card"><span>نسبة الردود</span><b>${responseRate}%</b><div class="progress"><span style="width:${responseRate}%"></span></div><small>${s.confirmed+s.declined} رد من أصل ${s.total} ضيف</small></div>
   <div class="report-hero-card"><span>نسبة التسليم</span><b>${deliveryRate}%</b><div class="progress"><span style="width:${deliveryRate}%"></span></div><small>${deliveredCount} رسالة تم تسليمها</small></div>
 </div>
 <div class="cards report-cards">${card('إجمالي الضيوف',s.total,'users')} ${card('حاضر',s.confirmed,'check-circle')} ${card('لم يؤكد',s.pending,'clock')} ${card('معتذر',s.declined,'x-circle')} ${card('إجمالي البطاقات',totalCards,'ticket')} ${card('بطاقات حضور',confirmedCards,'qr-code')} </div>
 <div class="reports-layout">
   <div class="panel report-panel"><h3>توزيع حالات الضيوف</h3><div class="donut big-donut" style="--a:${s.total?Math.round(s.confirmed/s.total*100):0}%;--b:${s.total?Math.round(s.declined/s.total*100):0}%"><span>${responseRate}%<small>ردود</small></span></div><div class="legend"><span><i class="green-dot"></i> حاضر ${s.confirmed}</span><span><i class="orange-dot"></i> لم يؤكد ${s.pending}</span><span><i class="red-dot"></i> معتذر ${s.declined}</span></div></div>
   <div class="panel report-panel"><h3>قناة الإرسال</h3><div class="bar-list"><div><b>تم الإرسال</b><span>${sentCount}/${s.total}</span><i style="width:${s.total?sentCount/s.total*100:0}%"></i></div><div><b>تم التسليم</b><span>${deliveredCount}/${s.total}</span><i style="width:${deliveryRate}%"></i></div><div><b>تمت القراءة</b><span>${readCount}/${s.total}</span><i style="width:${s.total?readCount/s.total*100:0}%"></i></div><div><b>تم الرد</b><span>${s.confirmed+s.declined}/${s.total}</span><i style="width:${responseRate}%"></i></div></div></div>
 </div>
 <div class="panel smart-report"><h3>ملخص ذكي</h3><p>${s.pending>0?`يوجد ${s.pending} ضيف لم يؤكدوا بعد. أنسب إجراء الآن هو إرسال تذكير قبل المناسبة.`:'كل الضيوف ردوا على الدعوة، التقرير جاهز للمراجعة النهائية.'}</p><p>${confirmedCards>0?`عدد بطاقات الحضور المؤكدة ${confirmedCards} بطاقة، ونسبة الحضور الحالية ${attendanceRate}%.`: 'لم يتم تسجيل بطاقات حضور مؤكدة حتى الآن.'}</p><button class="btn btn-primary" onclick="go('/admin/send')">فتح صفحة الإرسال</button></div>
 <div class="panel report-table-panel"><h3>تفاصيل الضيوف</h3><div class="table-wrap"><table class="report-table"><thead><tr><th>الضيف</th><th>البطاقات</th><th>الحالة</th><th>حاضر</th><th>معتذر</th><th>لم يؤكد</th></tr></thead><tbody>${reportRows||'<tr><td colspan="6">لا توجد بيانات ضيوف لهذه المناسبة.</td></tr>'}</tbody></table></div></div>`, 'reports')
}
function exportReportCsv(){
 const selectedBooking=getSelectedBookingId();
 const booking=db.bookings.find(b=>b.id===selectedBooking);
 const guests=db.guests.filter(g=>g.bookingId===selectedBooking);
 const rows=[['event','guest','phone','cards','status','confirmed','declined','pending'],...guests.map(g=>[booking?.eventName||'',g.guestName,g.phoneNumber,g.cardsCount,g.rsvpStatus,g.confirmedCount||0,g.declinedCount||0,g.pendingCount||0])];
 const csv='\ufeff'+rows.map(r=>r.map(x=>`"${String(x).replaceAll('"','""')}"`).join(',')).join('\n');
 const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'})); a.download='dawaa-report.csv'; a.click();
}
function adminStatus(){adminShell(`<h1>حالة النظام</h1><div class="cards status-grid">${['Meta WhatsApp API','n8n Workflows','Supabase Database','QR Scanner','Client Portal','Visitor Website'].map(x=>`<div class="card"><h3>${x}</h3><span class="badge b-green">Operational</span></div>`).join('')}</div><div class="panel" style="margin-top:22px"><h3>آخر 24 ساعة</h3><p>رسائل أُرسلت: 1,247 — نسبة النجاح: 99.2% — متوسط الاستجابة: 1.4 ث</p></div>`, 'status')}
function adminPackages(){const packages=getPackages();adminShell(`<h1>إدارة الباقات</h1><p style="color:#697082;font-weight:700">من هنا تقدري تغيري الباقات بالكامل: الاسم، السعر، الوصف، المميزات، وترتيب ظهورها في صفحة الزوار.</p><div class="panel"><div style="display:flex;justify-content:space-between;gap:12px;align-items:center;flex-wrap:wrap"><h3>الباقات الحالية</h3><button class="btn btn-primary" onclick="addPackageRow()">إضافة باقة جديدة</button></div><div id="packagesEditor" class="packages-editor">${packages.map((p,i)=>packageEditorRow(p,i)).join('')}</div><div style="display:flex;gap:12px;margin-top:22px;flex-wrap:wrap"><button class="btn btn-primary" onclick="saveAdminPackages()">حفظ الباقات</button><button class="btn btn-secondary" onclick="resetPackages()">استرجاع الباقات الافتراضية</button></div></div><div class="panel" style="margin-top:22px"><h3>معاينة الباقات كما تظهر للزائر</h3><div class="pricing admin-package-preview">${packages.map((p,i)=>`<div class="price-card ${p.featured?'featured':''}"><h3>${escapeHtml(p.title)}</h3><div class="price">${Number(p.price||0)} ر.ع</div><p>${escapeHtml(p.desc||'')}</p><ul>${(p.features||[]).filter(Boolean).map(f=>`<li>✓ ${escapeHtml(f)}</li>`).join('')}</ul></div>`).join('')}</div></div>`,'packages')}
function packageEditorRow(p={},i=0){return `<div class="package-row" data-package-row><div class="package-row-head"><b>باقة ${i+1}</b><label class="mini-check"><input type="checkbox" data-p-featured ${p.featured?'checked':''}> مميزة</label><button class="btn btn-ghost" onclick="this.closest('[data-package-row]').remove()">حذف</button></div><div class="form-row"><div class="field"><label>اسم الباقة</label><input data-p-title value="${escapeHtml(p.title||'')}"></div><div class="field"><label>السعر بالريال</label><input data-p-price type="number" min="0" value="${Number(p.price||0)}"></div></div><div class="field"><label>وصف مختصر</label><input data-p-desc value="${escapeHtml(p.desc||'')}"></div><div class="field"><label>المميزات — كل ميزة في سطر</label><textarea data-p-features rows="4">${escapeHtml((p.features||[]).join('\n'))}</textarea></div></div>`}
function addPackageRow(){const box=$('#packagesEditor'); box.insertAdjacentHTML('beforeend',packageEditorRow({id:uid(),title:'باقة جديدة',price:0,desc:'وصف الباقة',features:['ميزة 1','ميزة 2'],featured:false}, box.querySelectorAll('[data-package-row]').length)); safeIcons();}
function saveAdminPackages(){const rows=$$('#packagesEditor [data-package-row]'); const packages=rows.map((row,i)=>({id:'pkg_'+i+'_'+uid(),title:row.querySelector('[data-p-title]').value.trim()||'باقة بدون اسم',price:Number(row.querySelector('[data-p-price]').value||0),desc:row.querySelector('[data-p-desc]').value.trim(),features:row.querySelector('[data-p-features]').value.split('\n').map(x=>x.trim()).filter(Boolean),featured:!!row.querySelector('[data-p-featured]').checked})); if(!packages.length)return showToast('لازم تضيفي باقة واحدة على الأقل'); savePackages(packages); showToast('تم حفظ الباقات وتحديث صفحة الزوار'); adminPackages();}
function resetPackages(){if(!confirm('استرجاع الباقات الافتراضية؟'))return; localStorage.removeItem('dawaa_packages'); showToast('تم استرجاع الباقات الافتراضية'); adminPackages();}
function adminAccounts(){
 const accounts=getAccounts();
 const adminAcc=accounts.find(a=>a.type==='admin') || defaultAccounts[0];
 const clients=accounts.filter(a=>a.type==='client');
 const adminCount=accounts.filter(a=>a.type==='admin').length;
 const activeClients=clients.filter(a=>a.active!==false).length;
 adminShell(`<div class="section-title-row"><div><span class="eyebrow">الحسابات والصلاحيات</span><h1>إدارة حسابات العملاء والإدارة</h1><p class="muted">أنشئي حساب عميل، اربطيه بمناسبته، وحددي بالضبط ما يمكنه مشاهدته داخل بوابة العميل.</p></div><div class="quick-actions"><button class="btn btn-secondary" onclick="resetAccountForm()">تفريغ النموذج</button><button class="btn btn-primary" onclick="focusAccountForm()">حساب جديد</button></div></div>
 <div class="cards account-stats"><div class="card"><h3>حسابات العملاء</h3><b>${clients.length}</b><span class="muted">${activeClients} نشط</span></div><div class="card"><h3>حسابات الإدارة</h3><b>${adminCount}</b><span class="muted">صلاحيات كاملة</span></div><div class="card"><h3>مرتبطة بمناسبة</h3><b>${clients.filter(a=>a.bookingId).length}</b><span class="muted">تفتح بوابة LIVE مباشرة</span></div></div>
 <div class="accounts-layout">
  <section class="panel account-form-panel" id="accountFormPanel"><h2 id="accountFormTitle">إنشاء حساب عميل</h2><p class="muted">اختاري المناسبة والصلاحيات التي تظهر للعميل داخل بوابته.</p><input type="hidden" id="accId"><div class="form-row"><div class="field"><label>نوع الحساب</label><select id="accType" onchange="toggleAccountType()"><option value="client">عميل</option><option value="admin">إدارة</option></select></div><div class="field"><label>الحالة</label><select id="accActive"><option value="true">نشط</option><option value="false">معطل</option></select></div></div><div class="form-row"><div class="field"><label>اسم الحساب</label><input id="accName" placeholder="مثال: أمينة بنت محمد"></div><div class="field"><label>اسم المستخدم / البريد</label><input id="accEmail" placeholder="client@example.com"></div></div><div class="form-row"><div class="field"><label>كلمة المرور</label><input id="accPass" placeholder="كلمة مرور العميل"></div><div class="field" id="bookingLinkField"><label>المناسبة المرتبطة</label><select id="accBooking"><option value="">اختاري المناسبة</option>${db.bookings.map(b=>`<option value="${b.id}">${escapeHtml(b.eventName)} — ${escapeHtml(b.clientName||'')}</option>`).join('')}</select></div></div>${clientPermissionsEditor()}<div class="quick-actions"><button class="btn btn-primary" onclick="saveAccount()">حفظ الحساب</button><button class="btn btn-secondary" onclick="previewClientLogin()">معاينة بوابة العميل</button></div></section>
  <section class="panel"><div class="section-title-row"><h2>حسابات العملاء</h2><span class="badge b-green">LIVE</span></div><div class="account-list">${clients.map(accountRow).join('') || '<div class="empty-state"><b>لا توجد حسابات عملاء</b><span>أنشئي أول حساب من النموذج.</span></div>'}</div></section>
 </div>
 <section class="panel admin-account-panel"><h2>تعديل حساب الإدارة</h2><div class="form-row"><div class="field"><label>اسم الإدارة</label><input id="adminName" value="${escapeHtml(adminAcc.name||'')}"></div><div class="field"><label>بريد الإدارة / اسم المستخدم</label><input id="adminEmail" value="${escapeHtml(adminAcc.email||'')}"></div></div><div class="form-row"><div class="field"><label>كلمة المرور الجديدة</label><input id="adminPass" value="${escapeHtml(adminAcc.password||'')}"></div><div class="field"><label>الصلاحية</label><input value="إدارة كاملة" disabled></div></div><button class="btn btn-primary" onclick="saveAdminAccount()">حفظ حساب الإدارة</button></section>`, 'accounts')
}
function clientPermissionsEditor(selected=[]){
 const opts=[
  ['view_event','بيانات المناسبة','التاريخ، القاعة، واسم المناسبة'],
  ['view_guests','قائمة الضيوف','الأسماء والأرقام وعدد البطاقات'],
  ['view_status','حالة الحضور','حاضر / لم يؤكد / معتذر'],
  ['view_messages','الرسائل الواردة','الرسائل التي يتم مشاركتها مع العميل'],
  ['view_cards','بطاقات الدخول','إحصائيات وحالة بطاقات الدخول'],
  ['view_reports','التقرير','ملخص ونسب الحضور'],
  ['export_report','تصدير التقرير','إظهار خيار الطباعة أو التصدير'],
  ['request_resend','طلب إعادة إرسال','يسمح بطلب إعادة إرسال من الإدارة']
 ];
 const defaults=selected.length?selected:['view_event','view_guests','view_status','view_reports'];
 return `<div class="account-permissions" id="clientPermsBox"><h3>صلاحيات العميل</h3><p class="muted">حددي ما يظهر للعميل في بوابة LIVE.</p><div class="permission-grid">${opts.map(([key,label,desc])=>`<label class="permission-card"><input type="checkbox" data-perm="${key}" ${defaults.includes(key)?'checked':''}><span><b>${label}</b><small>${desc}</small></span></label>`).join('')}</div></div>`
}
function accountRow(a){const booking=db.bookings.find(b=>b.id===a.bookingId);return `<article class="account-row"><div class="account-avatar"><img src="assets/dawaa-logo-purple.png" alt="دعوة"></div><div class="account-info"><h3>${escapeHtml(a.name||'عميل')}</h3><p>${escapeHtml(a.email||a.username||'')}</p><small>${booking?escapeHtml(booking.eventName):'غير مرتبط بمناسبة'} • ${(a.permissions||[]).filter(x=>x!=='all').length||0} صلاحيات</small></div><div class="account-actions">${accountBadge(a)}<button class="btn btn-secondary btn-mini" onclick="editAccount('${a.id}')">تعديل</button><button class="btn btn-ghost btn-mini" onclick="toggleAccount('${a.id}')">${a.active===false?'تفعيل':'تعطيل'}</button><button class="btn btn-ghost btn-mini" onclick="deleteAccount('${a.id}')">حذف</button></div></article>`}
function focusAccountForm(){setTimeout(()=>$('#accountFormPanel')?.scrollIntoView({behavior:'smooth',block:'center'}),50)}
function toggleAccountType(){const type=$('#accType')?.value; if($('#bookingLinkField')) $('#bookingLinkField').style.display=type==='admin'?'none':'block'; if($('#clientPermsBox')) $('#clientPermsBox').style.display=type==='admin'?'none':'block';}
function resetAccountForm(){['accId','accName','accEmail','accPass'].forEach(id=>{const el=$('#'+id); if(el) el.value=''}); if($('#accType')) $('#accType').value='client'; if($('#accActive')) $('#accActive').value='true'; if($('#accBooking')) $('#accBooking').value=getSelectedBookingId(); $$('[data-perm]').forEach(cb=>cb.checked=['view_event','view_guests','view_status','view_reports'].includes(cb.dataset.perm)); if($('#accountFormTitle')) $('#accountFormTitle').textContent='إنشاء حساب عميل'; toggleAccountType(); focusAccountForm();}
function saveAccount(){const id=$('#accId').value||uid(); const type=$('#accType').value; const name=$('#accName').value.trim(); const email=$('#accEmail').value.trim(); const pass=$('#accPass').value.trim(); if(!name||!email||!pass) return showToast('املئي الاسم واسم المستخدم وكلمة المرور'); const list=getAccounts(); const exists=list.find(a=>a.id!==id && String(a.email||a.username).toLowerCase()===email.toLowerCase()); if(exists) return showToast('اسم المستخدم مستخدم مسبقاً'); const perms=type==='admin'?['all']:$$('[data-perm]:checked').map(cb=>cb.dataset.perm); if(type==='client'&&!perms.length) return showToast('اختاري صلاحية واحدة على الأقل للعميل'); const next={id,type,role:type,name,email,username:email,password:pass,active:$('#accActive').value==='true',bookingId:type==='client'?$('#accBooking').value:'',permissions:perms,createdAt:list.find(a=>a.id===id)?.createdAt||now(),updatedAt:now()}; const idx=list.findIndex(a=>a.id===id); if(idx>=0) list[idx]=next; else list.unshift(next); saveAccounts(list); if(next.bookingId){const bookings=db.bookings; const b=bookings.find(x=>x.id===next.bookingId); if(b){b.clientAccount=email; db.bookings=bookings;}} showToast('تم حفظ الحساب والصلاحيات'); adminAccounts();}
function editAccount(id){const a=getAccounts().find(x=>x.id===id); if(!a)return; $('#accId').value=a.id; $('#accType').value=a.type; $('#accActive').value=String(a.active!==false); $('#accName').value=a.name||''; $('#accEmail').value=a.email||a.username||''; $('#accPass').value=a.password||''; if($('#accBooking')) $('#accBooking').value=a.bookingId||''; $$('[data-perm]').forEach(cb=>cb.checked=(a.permissions||[]).includes(cb.dataset.perm)); $('#accountFormTitle').textContent='تعديل حساب'; toggleAccountType(); focusAccountForm();}
function toggleAccount(id){const list=getAccounts(); const a=list.find(x=>x.id===id); if(a){a.active=a.active===false; a.updatedAt=now(); saveAccounts(list); showToast(a.active?'تم تفعيل الحساب':'تم تعطيل الحساب'); adminAccounts();}}
function deleteAccount(id){const a=getAccounts().find(x=>x.id===id); if(!a || a.type==='admin') return showToast('لا يمكن حذف حساب الإدارة الرئيسي من هنا'); if(!confirm('حذف حساب العميل؟')) return; saveAccounts(getAccounts().filter(x=>x.id!==id)); showToast('تم حذف الحساب'); adminAccounts();}
function saveAdminAccount(){const list=getAccounts(); let a=list.find(x=>x.type==='admin')||{id:'admin-main',type:'admin',role:'admin',permissions:['all'],active:true,createdAt:now()}; a.name=$('#adminName').value.trim()||'مدير دعوة'; a.email=$('#adminEmail').value.trim()||'admin@dawaa.local'; a.username=a.email; a.password=$('#adminPass').value||'123456'; a.updatedAt=now(); const idx=list.findIndex(x=>x.id===a.id); if(idx>=0) list[idx]=a; else list.unshift(a); saveAccounts(list); showToast('تم حفظ حساب الإدارة');}
function previewClientLogin(){const booking=$('#accBooking')?.value||getSelectedBookingId(); if(booking){const tmp={email:$('#accEmail')?.value||'client@dawaa.local',role:'client',name:$('#accName')?.value||'عميل',bookingId:booking,permissions:$$('[data-perm]:checked').map(cb=>cb.dataset.perm)}; localStorage.setItem('dawaa_user',JSON.stringify(tmp)); currentUser=tmp; go('/client/dashboard')}else showToast('اختاري مناسبة لمعاينة بوابة العميل')}

function getVisitorRatings(){
  try{return JSON.parse(localStorage.getItem('dawaa_visitor_ratings')||'[]')}catch(e){return []}
}
function saveVisitorRatings(list){localStorage.setItem('dawaa_visitor_ratings', JSON.stringify(list));}
function saveDemoRatingToAdmin(){
  const rating=Number(localStorage.getItem('dawaa_demo_rating')||0);
  if(!rating) return;
  if(sessionStorage.getItem('dawaa_demo_rating_saved')==='1') return;
  const demo=JSON.parse(sessionStorage.getItem('demo')||'{}');
  const list=getVisitorRatings();
  list.unshift({id:uid(), name:demo.name||'زائر تجربة دعوة', eventName:`${demo.groom||'محمد'} & ${demo.bride||'مريم'}`, rating, message:'تجربة الموقع التفاعلية', approved:false, createdAt:now()});
  saveVisitorRatings(list);
  sessionStorage.setItem('dawaa_demo_rating_saved','1');
  showToast('تم إرسال التقييم إلى بوابة الإدارة');
}
function adminRatings(){
  const list=getVisitorRatings();
  adminShell(`<div class="section-title-row"><div><span class="eyebrow">التقييمات</span><h1>تقييم الزوار</h1><p class="muted">كل تقييم يصل من نافذة تجربة دعوة. اختاري ما تريدين إظهاره في واجهة الموقع.</p></div><button class="btn btn-secondary" onclick="clearRatings()">مسح الكل</button></div>
  <div class="cards" style="grid-template-columns:repeat(3,1fr)">${card('إجمالي التقييمات',list.length,'star')} ${card('المفعّل في الواجهة',list.filter(r=>r.approved).length,'eye')} ${card('متوسط النجوم', list.length ? (list.reduce((a,b)=>a+Number(b.rating||0),0)/list.length).toFixed(1) : 0,'sparkles')}</div>
  <div class="panel" style="margin-top:22px"><h3>التقييمات الواردة</h3><div class="rating-admin-list">${list.length?list.map(ratingRow).join(''):'<div class="empty-state"><b>لا توجد تقييمات بعد</b><span>بعد انتهاء تجربة الزائر سيصل تقييمه هنا.</span></div>'}</div></div>`, 'ratings')
}
function ratingRow(r){return `<article class="rating-row"><div><h3>${escapeHtml(r.name||'زائر')}</h3><p>${escapeHtml(r.eventName||'تجربة دعوة')} • ${new Date(r.createdAt).toLocaleString('ar-OM')}</p><div class="stars static-stars">${'★'.repeat(Number(r.rating||0))}${'☆'.repeat(5-Number(r.rating||0))}</div></div><div class="rating-actions"><span class="badge ${r.approved?'b-green':'b-orange'}">${r.approved?'ظاهر في الواجهة':'مخفي'}</span><button class="btn btn-secondary" onclick="toggleRatingPublic('${r.id}')">${r.approved?'إخفاء':'إظهار في الواجهة'}</button><button class="btn btn-ghost" onclick="deleteRating('${r.id}')">حذف</button></div></article>`}
function toggleRatingPublic(id){const list=getVisitorRatings(); const r=list.find(x=>x.id===id); if(r){r.approved=!r.approved; saveVisitorRatings(list); adminRatings();}}
function deleteRating(id){saveVisitorRatings(getVisitorRatings().filter(r=>r.id!==id)); adminRatings();}
function clearRatings(){if(confirm('مسح كل تقييمات الزوار؟')){saveVisitorRatings([]);adminRatings();}}

function adminIntegrations(){
 const meta=JSON.parse(localStorage.getItem('dawaa_meta_settings')||'{}');
 const n8n=JSON.parse(localStorage.getItem('dawaa_n8n_settings')||'{}');
 adminShell(`<h1>التكاملات الاحترافية</h1><p class="muted">ضعي بيانات الربط الأساسية هنا. عند نقل الموقع للإنتاج يمكن استخدام نفس القيم داخل env.</p><div class="cards" style="grid-template-columns:repeat(3,1fr);margin-bottom:22px"><div class="card"><h3>Supabase</h3><span class="badge ${supabaseClient?'b-green':'b-orange'}">${supabaseClient?'متصل':'غير مفعل'}</span></div><div class="card"><h3>Meta WhatsApp</h3><span class="badge ${meta.token?'b-green':'b-orange'}">${meta.token?'جاهز':'يحتاج بيانات'}</span></div><div class="card"><h3>n8n</h3><span class="badge ${n8n.webhook?'b-green':'b-orange'}">${n8n.webhook?'جاهز':'يحتاج Webhook'}</span></div></div><div class="panel"><h3>Supabase</h3><div class="field"><label>SUPABASE URL</label><input id="supUrl" value="${env.supabaseUrl}"></div><div class="field"><label>SUPABASE ANON KEY</label><input id="supKey" value="${env.supabaseKey}"></div><button class="btn btn-primary" onclick="saveSupabaseKeys()">حفظ Supabase</button></div><div class="panel" style="margin-top:22px"><h3>Meta WhatsApp Cloud API</h3><div class="form-row"><div class="field"><label>Phone Number ID</label><input id="metaPhoneId" value="${meta.phoneId||''}" placeholder="مثال: 123456789"></div><div class="field"><label>WABA ID</label><input id="metaWabaId" value="${meta.wabaId||''}"></div></div><div class="field"><label>Access Token</label><input id="metaToken" value="${meta.token||''}" placeholder="Meta permanent token"></div><div class="field"><label>Verify Token</label><input id="metaVerify" value="${meta.verify||''}" placeholder="Webhook verify token"></div><button class="btn btn-primary" onclick="saveMetaSettings()">حفظ Meta</button></div><div class="panel" style="margin-top:22px"><h3>n8n Automation</h3><div class="field"><label>Webhook URL</label><input id="n8nWebhook" value="${n8n.webhook||''}" placeholder="https://.../webhook/dawaa-send-whatsapp"></div><div class="form-row"><div class="field"><label>Workflow Name</label><input id="n8nName" value="${n8n.name||'Dawaa WhatsApp Flow'}"></div><div class="field"><label>API Key / Secret</label><input id="n8nKey" value="${n8n.key||''}"></div></div><button class="btn btn-primary" onclick="saveN8nSettings()">حفظ n8n</button></div>`, 'integrations')
}
function saveMetaSettings(){localStorage.setItem('dawaa_meta_settings',JSON.stringify({phoneId:$('#metaPhoneId').value,wabaId:$('#metaWabaId').value,token:$('#metaToken').value,verify:$('#metaVerify').value})); showToast('تم حفظ إعدادات Meta')}
function saveN8nSettings(){localStorage.setItem('dawaa_n8n_settings',JSON.stringify({webhook:$('#n8nWebhook').value,name:$('#n8nName').value,key:$('#n8nKey').value})); showToast('تم حفظ إعدادات n8n')}
function adminSettings(){const ps=getPricingSettings();adminShell(`<h1>الإعدادات</h1><div class="panel"><h3>كود الخصم</h3><p>من هنا تقدري تفعلي/تعطلي البروموشن كود وتحددي مقدار الخصم الذي يظهر في حاسبة السعر. إدارة الباقات صارت في صفحة مستقلة باسم الباقات.</p><div class="form-row"><label class="addon-card admin-toggle"><input type="checkbox" id="promoEnabledAdmin" ${ps.promoEnabled?'checked':''}><span>تفعيل كود الخصم</span></label><div class="field"><label>كود الخصم</label><input id="promoCodeAdmin" value="${ps.promoCode||''}" placeholder="DAWAA10"></div></div><div class="form-row"><div class="field"><label>مقدار الخصم بالريال</label><input id="promoDiscountAdmin" type="number" min="0" value="${ps.promoDiscount||0}"></div><div class="field"><label>منطق السعر الحالي</label><input value="أول 100 ضيف = 70 ر.ع، وكل 50 ضيف إضافي = +10 ر.ع" disabled></div></div><button class="btn btn-primary" onclick="savePricingSettings()">حفظ إعدادات التسعير</button></div>`,'settings')}
function savePricingSettings(){
 savePricingSettingsObject({promoEnabled:!!$('#promoEnabledAdmin')?.checked,promoCode:($('#promoCodeAdmin')?.value||'').trim(),promoDiscount:Number($('#promoDiscountAdmin')?.value||0)});
 showToast('تم حفظ إعدادات التسعير وكود الخصم');
}
function saveSupabaseKeys(){localStorage.setItem('DAWAA_SUPABASE_URL',$('#supUrl').value);localStorage.setItem('DAWAA_SUPABASE_ANON_KEY',$('#supKey').value);showToast('تم الحفظ — أعيدي تحميل الصفحة لتفعيل الاتصال')}

function showDemoCompleteModal(){
  let existing=document.getElementById('demoCompleteModal');
  if(existing) existing.remove();
  const d=JSON.parse(sessionStorage.getItem('demo')||'{}');
  const total=2;
  const confirmed=1;
  const pending=1;
  const declined=0;
  const m=document.createElement('div');
  m.className='modal demo-complete-modal open';
  m.id='demoCompleteModal';
  m.innerHTML=`<div class="modal-box demo-complete-box">
    <button class="modal-x" onclick="closeModal('demoCompleteModal')">×</button>
    <div class="celebration-stars"><span>✦</span><span>★</span><span>✧</span><span>✦</span><span>★</span></div>
    <div class="success-orb">✓</div>
    <h2>هكذا تعمل خدمة دعوة</h2>
    <p>من إنشاء المناسبة وإرسال الدعوات إلى متابعة حضور الضيوف وإصدار بطاقات الدخول.</p>
    <div class="demo-mini-stats colored-stats">
      <div class="stat-neutral"><b>${total}</b><span>ضيف</span></div>
      <div class="stat-green"><b>${confirmed}</b><span>حاضر</span></div>
      <div class="stat-yellow"><b>${pending}</b><span>لم يؤكد</span></div>
      <div class="stat-red"><b>${declined}</b><span>معتذر</span></div>
    </div>
    <div class="rating-box">
      <h3>قيّم تجربتك مع دعوة</h3>
      <div class="stars" id="demoStars">${[1,2,3,4,5].map(i=>`<button type="button" onclick="setDemoRating(${i})" aria-label="${i} نجوم">☆</button>`).join('')}</div>
      <small id="ratingText">اختاري عدد النجوم</small>
    </div>
    <div class="modal-actions">
      <button class="btn btn-primary" onclick="openBookingModal();closeModal('demoCompleteModal')">احجز مناسبتك الآن</button>
      <button class="btn btn-secondary" onclick="closeModal('demoCompleteModal')">إغلاق</button>
    </div>
  </div>`;
  document.body.appendChild(m);
  requestAnimationFrame(()=>m.classList.add('open'));
}
function setDemoRating(n){
  localStorage.setItem('dawaa_demo_rating', String(n));
  $$('#demoStars button').forEach((b,i)=>{ b.textContent = i < n ? '★' : '☆'; b.classList.toggle('active', i < n); });
  const labels=['','ضعيف','مقبول','جيد','ممتاز','رائع جداً'];
  const t=$('#ratingText'); if(t) t.textContent=`${labels[n]} — سيُرسل تقييمك عند الإغلاق`;
}


function eventModal(){return `<div class="modal" id="eventModal"><div class="modal-box"><h2>حجز جديد</h2><div class="form-row"><div class="field"><label>اسم العميل</label><input id="evClient"></div><div class="field"><label>رقم الهاتف</label><input id="evPhone"></div></div><div class="form-row"><div class="field"><label>اسم المناسبة</label><input id="evName"></div><div class="field"><label>التاريخ</label><input id="evDate" type="date"></div></div><div class="field"><label>القاعة</label><input id="evVenue"></div><button class="btn btn-primary" onclick="saveEvent()">حفظ الحجز</button><button class="btn btn-ghost" onclick="closeModal('eventModal')">إغلاق</button></div></div>`}
function openEventModal(){$('#eventModal').classList.add('open')}
function saveEvent(){const name=$('#evName').value.trim(); if(!name)return showToast('اكتبي اسم المناسبة'); const b=db.bookings; b.unshift({id:uid(),clientName:$('#evClient').value,clientPhone:$('#evPhone').value,eventName:name,eventType:'زفاف',eventDate:$('#evDate').value||new Date().toISOString(),venueName:$('#evVenue').value,health:35,status:'planning',createdAt:now(),screenUploaded:false,cardsReady:false}); db.bookings=b; closeModal('eventModal'); showToast('تم إنشاء الحجز'); render()}
function guestModal(){return `<div class="modal" id="guestModal"><div class="modal-box"><h2 id="guestModalTitle">إضافة ضيف</h2><input type="hidden" id="gEditingId"><div class="field"><label>الحجز</label><select id="gBooking">${db.bookings.map(b=>`<option value="${b.id}" ${b.id===getSelectedBookingId()?'selected':''}>${b.eventName}</option>`).join('')}</select></div><div class="form-row"><div class="field"><label>اسم الضيف</label><input id="gName"></div><div class="field"><label>الهاتف</label><input id="gPhone"></div></div><div class="field"><label>عدد البطاقات</label><input id="gCards" type="number" value="1"></div><button class="btn btn-primary" onclick="saveGuest()">حفظ الضيف</button><button class="btn btn-ghost" onclick="closeModal('guestModal')">إغلاق</button></div></div>`}
function openGuestModal(){const m=$('#guestModal'); if(m){m.classList.add('open'); $('#guestModalTitle').textContent='إضافة ضيف'; $('#gEditingId').value=''; $('#gName').value=''; $('#gPhone').value=''; $('#gCards').value='1'; if($('#gBooking')) $('#gBooking').value=getSelectedBookingId();}}
function saveGuest(){const name=$('#gName').value.trim(); if(!name)return showToast('اكتبي اسم الضيف'); const editId=$('#gEditingId')?.value; let guests=db.guests; if(editId){guests=guests.map(g=>g.id===editId?{...g,bookingId:$('#gBooking').value,guestName:name,phoneNumber:$('#gPhone').value,cardsCount:Number($('#gCards').value||1),pendingCount:g.rsvpStatus==='pending'?Number($('#gCards').value||1):g.pendingCount}:g); showToast('تم تعديل الضيف')}else{guests.unshift({id:uid(),bookingId:$('#gBooking').value,guestName:name,phoneNumber:$('#gPhone').value,cardsCount:Number($('#gCards').value||1),rsvpStatus:'pending',confirmedCount:0,declinedCount:0,pendingCount:Number($('#gCards').value||1),shortCode:'DAWAA'+Math.floor(Math.random()*9999),checkedIn:false}); showToast('تم إضافة الضيف')} db.guests=guests; closeModal('guestModal'); render()}
function deleteGuest(id){if(!confirm('حذف الضيف؟'))return; db.guests=db.guests.filter(g=>g.id!==id); showToast('تم الحذف'); render()}
function openEventDrawer(id){openEventWorkspace(id)}
function openEventWorkspace(id){const b=db.bookings.find(x=>x.id===id); const s=statsFor(id); const guests=db.guests.filter(g=>g.bookingId===id); const d=$('#drawer'); d.innerHTML=`<div class="drawer-head"><button class="btn btn-ghost" onclick="closeDrawer()">إغلاق</button><span class="badge ${b.health>=85?'b-green':'b-orange'}">${b.health}% جاهزية</span></div><h2>${b.eventName}</h2><p class="muted">${fmt(b.eventDate)} • ${b.venueName||'بدون قاعة'} • ${b.receptionTime||''}</p><div class="workspace-tabs"><button class="active">نظرة عامة</button><button onclick="showToast('الضيوف ظاهرون أسفل المساحة')">الضيوف</button><button onclick="go('/admin/send')">الإرسال</button><button onclick="go('/admin/messages')">الرسائل</button><button onclick="go('/admin/status')">التقرير</button></div><div class="client-hero"><h3>مسار المناسبة</h3><div class="big-number">${b.health}%</div><div class="progress"><span style="width:${b.health}%"></span></div><div class="stage-strip drawer-stage"><span class="done">الحجز</span><span class="${s.total?'done':'wait'}">الضيوف</span><span class="${s.sent?'done':'wait'}">الدعوات</span><span class="active">الردود</span><span class="${b.cardsReady?'done':'wait'}">QR</span><span class="${b.screenUploaded?'done':'wait'}">الشاشة</span></div></div><div class="cards drawer-stats" style="grid-template-columns:repeat(2,1fr);margin-top:16px">${card('إجمالي',s.total,'users')} ${card('حاضر',s.confirmed,'check')} ${card('معتذر',s.declined,'x')} ${card('لم يؤكد',s.pending,'clock')}</div><h3>الإجراء التالي</h3><div class="todo-list"><button onclick="sendReminders('${b.id}')"><b>إرسال تذكير</b><span>${s.pending} ضيف لم يردوا</span>${icon('send',18)}</button><button onclick="uploadScreen('${b.id}')"><b>رفع الشاشة الترحيبية</b><span>${b.screenUploaded?'تم الرفع':'لم يؤكد الرفع'}</span>${icon('monitor-up',18)}</button></div><h3>ضيوف المناسبة</h3>${guestTable(guests.slice(0,6))}`; d.classList.add('open'); safeIcons();}
function openGuestDrawer(id){const g=db.guests.find(x=>x.id===id); const b=db.bookings.find(x=>x.id===g.bookingId); const d=$('#drawer'); d.innerHTML=`<div class="drawer-head"><button class="btn btn-ghost" onclick="closeDrawer()">إغلاق</button>${statusBadge(g.rsvpStatus)}</div><div class="guest-profile-head"><div class="guest-avatar big">${escapeHtml((g.guestName||'ض')[0])}</div><div><h2>${g.guestName}</h2><p class="muted">${g.phoneNumber} • ${g.cardsCount} بطاقات • ${b?.eventName||''}</p></div></div><div class="quick-actions" style="margin:18px 0"><button class="btn btn-primary" onclick="sendOne('${g.id}')">إعادة إرسال</button><button class="btn btn-secondary" onclick="showToast('تم نسخ الرقم')">نسخ الرقم</button><button class="btn btn-secondary" onclick="editGuest('${g.id}')">تعديل</button><button class="btn btn-ghost" onclick="deleteGuest('${g.id}')">حذف</button></div><h3>Timeline التفصيلي</h3><div class="timeline proof-timeline"><div class="tl"><span class="dot"></span> تم إنشاء سجل الضيف</div><div class="tl"><span class="dot"></span> ${g.invitationSentAt?'تم إرسال الدعوة عبر WhatsApp':'لم تُرسل الدعوة بعد'}</div><div class="tl"><span class="dot"></span> ${g.deliveredAt?'تم تسليم الرسالة':'لم يؤكد التسليم'}</div><div class="tl"><span class="dot"></span> ${g.readAt?'تمت قراءة الرسالة':'لم تُقرأ بعد'}</div><div class="tl"><span class="dot"></span> ${g.repliedAt?'تم تسجيل الرد':'لم يؤكد الرد'}</div></div><h3>بطاقة الدخول</h3><div style="margin-top:12px">${entryCardPreview({guest:g.guestName,code:g.shortCode})}</div>`; d.classList.add('open'); safeIcons();}
function closeDrawer(){$('#drawer')?.classList.remove('open')}
function exportGuests(){const rows=[['name','phone','cards','status'],...filteredGuestsList().map(g=>[g.guestName,g.phoneNumber,g.cardsCount,g.rsvpStatus])]; const csv=rows.map(r=>r.join(',')).join('\n'); const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'})); a.download='dawaa-guests.csv'; a.click();}
function renderClient(route){
 if(!ensure('client'))return;
 const account=currentUser?.accountId?getAccounts().find(a=>a.id===currentUser.accountId):findAccount(currentUser?.email);
 const linkedId=currentUser?.bookingId||account?.bookingId||db.bookings[0]?.id;
 const b=db.bookings.find(x=>x.id===linkedId)||db.bookings[0];
 if(!b){ app.innerHTML='<main class="container section"><div class="empty-state"><b>لا توجد مناسبة مرتبطة بهذا الحساب</b><span>يرجى إنشاء مناسبة أو ربط الحساب بمناسبة من بوابة الإدارة.</span><button class="btn btn-primary" onclick="logout()">العودة لتسجيل الدخول</button></div></main>'; return; }
 const guests=db.guests.filter(g=>g.bookingId===b.id);
 const s=statsFor(b.id);
 const totalCards=guests.reduce((sum,g)=>sum+Number(g.cardsCount||1),0);
 const sentCards=guests.filter(g=>g.invitationSentAt||['sent','delivered','read','confirmed','declined'].includes(g.rsvpStatus)).reduce((a,g)=>a+Number(g.cardsCount||1),0);
 const confirmedCards=guests.reduce((sum,g)=>sum+Number(g.confirmedCount||0),0);
 const declinedCards=guests.reduce((sum,g)=>sum+Number(g.declinedCount||0),0);
 const pendingCards=Math.max(0,totalCards-confirmedCards-declinedCards);
 const failed=s.failed;
 const interaction=s.total?Math.round(((s.confirmed+s.declined)/s.total)*100):0;
 const progressSent=totalCards?Math.round((sentCards/totalCards)*100):0;
 const progressCards=totalCards?Math.round((confirmedCards/totalCards)*100):0;
 const recent=guests.slice(0,6).map(g=>`<div class="client-invitee"><b>${escapeHtml(g.guestName)}</b>${canView('view_status')?`<span>${statusBadge(g.rsvpStatus)}</span>`:''}<small>${canView('view_guests')?`${g.phoneNumber} • ${g.cardsCount} بطاقة`:'بيانات محدودة حسب الصلاحيات'}</small></div>`).join('');
 const cardsMetrics = canView('view_status') ? `<section class="client-metric-grid"><div class="metric purple"><span>💌</span><h3>تم الإرسال</h3><b>${sentCards}</b><small>${sentCards} دعوة</small></div><div class="metric green"><span>✅</span><h3>الحضور</h3><b>${confirmedCards}</b><small>${confirmedCards} بطاقة</small></div><div class="metric orange"><span>⌛</span><h3>لم يؤكد</h3><b>${pendingCards}</b><small>لم يؤكد</small></div><div class="metric red"><span>🌹</span><h3>معتذر</h3><b>${declinedCards}</b><small>معتذر</small></div><div class="metric dark"><span>⚠️</span><h3>فشل الإرسال</h3><b>${failed}</b><small>يحتاج مراجعة</small></div>${canView('view_cards')?`<div class="metric blue"><span>🎫</span><h3>بطاقات الدخول</h3><b>${totalCards}</b><small>${totalCards} بطاقة</small></div>`:''}</section>` : `<section class="panel"><div class="empty-state"><b>لا توجد صلاحية لعرض حالات الحضور</b><span>يمكن للإدارة تفعيل هذه الصلاحية من صفحة الحسابات.</span></div></section>`;
 const progressBlocks = canView('view_cards') ? `<section class="client-progress-grid"><div class="client-progress purple"><h3>حالة إرسال الدعوات</h3><b>${progressSent}%</b><div class="progress"><span style="width:${progressSent}%"></span></div><p>${progressSent? 'تم إرسال جزء من الدعوات':'لم يتم الإرسال بعد'}</p></div><div class="client-progress blue"><h3>حالة بطاقات الدخول</h3><b>${progressCards}%</b><div class="progress"><span style="width:${progressCards}%"></span></div><p>${confirmedCards? 'تم تجهيز بطاقات الحضور':'لم يتم إرسال البطاقات بعد'}</p></div></section>` : '';
 const inviteesBlock = canView('view_guests') ? `<div class="panel"><h3>كل المدعوين</h3><button class="btn btn-secondary" onclick="document.querySelector('.client-invitees').classList.toggle('show-all')">عرض الكل</button><div class="client-invitees">${recent||'<div class="empty-state">لا توجد بيانات حالياً</div>'}</div></div>` : '';
 const updatesBlock = canView('view_event') ? `<div class="panel"><h3>آخر التحديثات</h3>${activityFeed()||'<div class="empty-state">لا توجد تحديثات بعد</div>'}</div>` : '';
 const messagesBlock = canView('view_messages') ? `<section class="panel client-messages-box"><div><span class="badge b-purple">${db.messages.filter(m=>m.bookingId===b.id).length} محادثة</span><h3>الرسائل الواردة</h3><p class="muted">رسائل المدعوين التي تمت مشاركتها مع الإدارة.</p></div><div class="empty-state"><b>🔔 لا توجد رسائل واردة حالياً</b><span>عند مشاركة الإدارة لأي رسالة من المدعوين ستظهر هنا مباشرة.</span></div></section>` : '';
 app.innerHTML=`<div class="client-live-page route-page"><div class="client-live-top"><div><span class="badge b-green">LIVE •</span><h1>حضور العميل</h1><p>متابعة مباشرة للمناسبة. العميل يرى فقط الأسماء والأرقام وحالة الحضور.</p></div><button class="btn btn-secondary" onclick="logout()">خروج</button></div>
 <section class="client-live-hero"><div class="live-ring"><div class="donut" style="--score:${interaction}%"><span>${interaction}%</span></div><small>نسبة التفاعل</small></div><div class="client-live-title"><span class="badge b-green">LIVE •</span><h2>${escapeHtml(b.eventName)}</h2><p>${fmt(b.eventDate)} • ${escapeHtml(b.venueName||'بدون قاعة')}</p></div></section>
 ${cardsMetrics}
 ${progressBlocks}
 <section class="client-live-grid">${updatesBlock}${inviteesBlock}</section>
 ${messagesBlock}</div>`;
 afterRender();
}


function currentPermissions(){
 if(currentUser?.role==='admin') return ['all'];
 const acc=currentUser?.accountId ? getAccounts().find(a=>a.id===currentUser.accountId) : findAccount(currentUser?.email||'');
 return currentUser?.permissions || acc?.permissions || ['view_event','view_guests','view_status','view_reports'];
}
function canView(key){const p=currentPermissions(); return p.includes('all') || p.includes(key);}

function commandPalette(){
  return `<div class="cmd-overlay" id="cmdOverlay" onclick="if(event.target===this)toggleCommand(false)">
    <div class="cmd-box">
      <div class="cmd-head"><b>البحث السريع</b><button class="btn btn-ghost" onclick="toggleCommand(false)">إغلاق</button></div>
      <input id="cmdInput" placeholder="ابحثي عن مناسبة أو ضيف أو أمر..." oninput="cmdSearch()" autocomplete="off">
      <div id="cmdResults" class="cmd-results"></div>
    </div>
  </div>`;
}
function toggleCommand(force){
  cmdOpen = typeof force === 'boolean' ? force : !cmdOpen;
  const overlay=$('#cmdOverlay');
  if(!overlay) return;
  overlay.classList.toggle('open', cmdOpen);
  if(cmdOpen){ setTimeout(()=>{ const input=$('#cmdInput'); if(input){input.focus(); cmdSearch();} }, 30); }
}

function cmdSearch(){const q=$('#cmdInput').value||''; const items=[['إنشاء حجز جديد',()=>openEventModal()],['إضافة ضيف',()=>openGuestModal()],['فتح غرفة العمليات',()=>go('/admin/operations')],['فتح مركز الرسائل',()=>go('/admin/messages')],['فتح العملاء',()=>go('/admin/clients')],['فتح الحسابات',()=>go('/admin/accounts')],['فتح التكاملات',()=>go('/admin/integrations')],...db.bookings.map(b=>[b.eventName,()=>{go('/admin/events');setTimeout(()=>openEventWorkspace(b.id),100)}]),...db.guests.map(g=>[g.guestName,()=>{go('/admin/guests');setTimeout(()=>openGuestDrawer(g.id),100)}])].filter(x=>x[0].includes(q)); $('#cmdResults').innerHTML=items.slice(0,9).map((x,i)=>`<div class="cmd-item" onclick="window.__cmd[${i}]();toggleCommand(false)">${x[0]}</div>`).join(''); window.__cmd=items.map(x=>x[1]);}
function calcPrice(){
 const guests=Number($('#guestRange')?.value||100);
 const guestCount=$('#guestCount'); if(guestCount) guestCount.textContent=guests+' ضيف';
 const extraBlocks=Math.ceil(Math.max(0, guests-100)/50);
 const invitationsCost=20+(extraBlocks*10);
 const securityQrCost=50;
 const screenCost=$('#screenOpt')?.checked?70:0;
 const photoCost=$('#photoOpt')?.checked?80:0;
 const addons=screenCost+photoCost;
 const subtotal=invitationsCost+securityQrCost+addons;
 const ps=getPricingSettings();
 const entered=($('#promoCodeInput')?.value||'').trim().toUpperCase();
 const activeCode=(ps.promoCode||'').trim().toUpperCase();
 const discount=(ps.promoEnabled && entered && activeCode && entered===activeCode) ? Math.min(Number(ps.promoDiscount)||0, subtotal) : 0;
 const total=subtotal-discount;
 if($('#inviteCost')) $('#inviteCost').textContent=currency(invitationsCost);
 if($('#addonsCost')) $('#addonsCost').textContent=currency(addons);
 if($('#priceOut')) $('#priceOut').textContent=currency(total);
 const dl=$('#discountLine'), bd=$('#beforeDiscount'), hint=$('#promoHint');
 if(dl) dl.style.display=discount?'flex':'none';
 if($('#discountOut')) $('#discountOut').textContent='-'+currency(discount);
 if(bd){bd.style.display=discount?'block':'none'; const span=bd.querySelector('span'); if(span) span.textContent=currency(subtotal);}
 if(hint){
   if(!ps.promoEnabled) hint.textContent='لا يوجد كوبون مفعّل حالياً';
   else if(!entered) hint.textContent='أدخلي كود الخصم إذا كان متوفراً';
   else if(discount) hint.textContent='تم تطبيق الخصم بنجاح';
   else hint.textContent='كود الخصم غير صحيح';
 }
}
function afterRender(){if($('#guestRange')) calcPrice(); safeIcons(); const board=$('#storyBoard'); if(board) setStory(0); $$('.modal').forEach(m=>m.addEventListener('click',e=>{if(e.target===m)m.classList.remove('open')})); animateCounters();}
function animateCounters(){$$('[data-count]').forEach(el=>{const target=Number(el.dataset.count); if(!target)return; let n=0; const step=Math.max(1,Math.floor(target/30)); const plus=el.textContent.includes('+'); const percent=el.textContent.includes('%'); const int=setInterval(()=>{n+=step;if(n>=target){n=target;clearInterval(int)}el.textContent=n.toLocaleString('en-US')+(plus?'+':'')+(percent?'%':'')},22)})}
window.addEventListener('hashchange',render); window.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();toggleCommand(true)} if(e.key==='Escape'){toggleCommand(false);closeDrawer();$$('.modal').forEach(m=>m.classList.remove('open'))} if(currentUser?.role==='admin' && e.key.toLowerCase()==='n')openEventModal();});
render();
