import React, { useEffect, useState } from 'react';
import { Sparkles, Camera, MapPin, Trophy, ArrowLeft, CheckCircle2, ShieldCheck, Activity, Users, Truck } from 'lucide-react';
import { PlatformStats, Report } from '../types';

interface HomeViewProps {
  setCurrentView: (view: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ setCurrentView }) => {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [recentReports, setRecentReports] = useState<Report[]>([]);

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error(err));

    fetch('/api/reports')
      .then(res => res.json())
      .then(data => setRecentReports(data.slice(0, 3)))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-900 via-emerald-800 to-teal-900 text-white pt-20 pb-28 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-right">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-700/60 border border-emerald-500/40 text-emerald-200 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>الذكاء الاصطناعي في خدمة نظافة مدينة الوادي</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15]">
              معاً لمدينة أنظف، <br />
              <span className="text-amber-400">سوف النقية</span> تفخر بأهلها
            </h1>
            <p className="text-slate-200 text-lg sm:text-xl font-normal leading-relaxed max-w-2xl">
              منصة ذكية تتيح لمواطني ولاية الوادي التبليغ عن النفايات والأتربة بكل سهولة بفضل تحليل الصور الذكي، لضمان تدخل فوري من مصالح البلدية وتحقيق بيئة مستدامة.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={() => setCurrentView('report')}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-base font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 shadow-xl shadow-amber-400/20 transition-all transform hover:-translate-y-1"
              >
                <Camera className="w-5 h-5" />
                <span>بلغ عن مشكلة الآن</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentView('admin')}
                className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl text-base font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md transition-all"
              >
                <span>خريطة العمليات البلدية</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-400 to-emerald-500 rounded-3xl blur-xl opacity-30 animate-pulse"></div>
              <div className="relative rounded-3xl overflow-hidden border border-white/20 shadow-2xl bg-slate-900">
                <img
                  src="https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80"
                  alt="سوف النظافة والبيئة"
                  className="w-full h-[380px] object-cover opacity-90 hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent flex flex-col justify-end p-6">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold mb-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    <span>نظام تحليل ذكي نشط في الوادي</span>
                  </div>
                  <h3 className="text-white text-lg font-bold">حي 19 مارس - قطاع رقم 03</h3>
                  <p className="text-slate-300 text-xs mt-1">تم إرسال فرقة الرفع الآلي وإصدار تقرير معالجة فوري.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Stats Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100">
          <div className="text-center p-4 border-l border-slate-100 last:border-0">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3 font-bold shadow-xs">
              <Activity className="w-6 h-6" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tabular-nums">
              {stats ? stats.totalReports : '...'}
            </div>
            <div className="text-xs sm:text-sm text-slate-500 font-medium mt-1">إجمالي البلاغات المسجلة</div>
          </div>
          <div className="text-center p-4 border-l border-slate-100 last:border-0">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3 font-bold shadow-xs">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tabular-nums">
              {stats ? stats.resolvedReports : '...'}
            </div>
            <div className="text-xs sm:text-sm text-slate-500 font-medium mt-1">بلاغات تم حلها بنجاح</div>
          </div>
          <div className="text-center p-4 border-l border-slate-100 last:border-0">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-3 font-bold shadow-xs">
              <Users className="w-6 h-6" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tabular-nums">
              {stats ? stats.activeNeighborhoods : '...'}
            </div>
            <div className="text-xs sm:text-sm text-slate-500 font-medium mt-1">أحياء مشاركة بفعالية</div>
          </div>
          <div className="text-center p-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3 font-bold shadow-xs">
              <Truck className="w-6 h-6" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tabular-nums">
              {stats ? `${stats.tonsRemoved} طن` : '...'}
            </div>
            <div className="text-xs sm:text-sm text-slate-500 font-medium mt-1">نفايات وأتربة تم رفعها</div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-emerald-700 font-bold text-xs tracking-wider uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            خطوات بسيطة وفعالة
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3">
            كيف تعمل منصة سوف النقية؟
          </h2>
          <p className="text-slate-600 text-base mt-2">
            ثلاث خطوات فقط تفصلنا عن حي أنظف وأجمل في ولاية الوادي.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-lg relative group hover:-translate-y-1 transition-transform">
            <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-xl mb-6 shadow-md">
              01
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">صور المشكلة</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              قم بالتقاط صورة مباشرة لتراكم القمامة أو مخلفات البناء عبر هاتفك الذكي من موقع الحدث في أي حي من أحياء الوادي.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-lg relative group hover:-translate-y-1 transition-transform">
            <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black text-xl mb-6 shadow-md">
              02
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">التحليل الذكي بالذكاء الاصطناعي</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              يقوم نموذج Gemini الفوري بتصنيف نوع النفايات، تقدير الحجم، وتحديد درجة الخطورة وتوجيه البلاغ للقسم البلدي المعني تلقائياً.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-lg relative group hover:-translate-y-1 transition-transform">
            <div className="w-14 h-14 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-black text-xl mb-6 shadow-md">
              03
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">التدخل البلدي الفوري</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              تستقبل مصالح البلدية البلاغ عبر خريطة العمليات المباشرة، ويتم التدخل السريع لرفع النفايات وإشعارك بحل المشكلة.
            </p>
          </div>
        </div>
      </section>

      {/* Recent Reports Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">أحدث البلاغات المجتمعية</h2>
            <p className="text-slate-500 text-sm mt-1">تابع جهود التدخل السريع في أحياء مدينة الوادي</p>
          </div>
          <button
            onClick={() => setCurrentView('admin')}
            className="text-sm font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5"
          >
            <span>عرض كل البلاغات</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentReports.map(report => (
            <div key={report.id} className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-md flex flex-col">
              <div className="relative h-48 overflow-hidden bg-slate-100">
                <img
                  src={report.imageUrl}
                  alt={report.category}
                  className="w-full h-full object-cover"
                />
                <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold text-white shadow-md ${
                  report.status === 'تم الحل' ? 'bg-emerald-600' : 'bg-amber-500'
                }`}>
                  {report.status}
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="font-semibold text-emerald-700 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {report.neighborhood}
                    </span>
                    <span>{report.category}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mb-2 line-clamp-1">{report.description}</h3>
                  <p className="text-slate-600 text-xs line-clamp-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    🤖 {report.aiAnalysis}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>المبلغ: {report.reporterName}</span>
                  <span className="font-mono">{new Date(report.createdAt).toLocaleDateString('ar-DZ')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="rounded-3xl bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-8 sm:p-12 relative overflow-hidden shadow-2xl">
          <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-emerald-700/30 rounded-full blur-3xl"></div>
          <div className="relative z-10 max-w-2xl space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">كن جزءاً من التغيير في مدينة الوادي</h2>
            <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
              كل بلاغ ترسله يساهم في رفع كفاءة النظافة العامة ورفع تصنيف حيك في لوحة الشرف السنوية. شاركنا اليوم وكن مواطناً فاعلاً.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setCurrentView('report')}
                className="px-8 py-3.5 rounded-xl font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 shadow-lg transition-all"
              >
                ابدأ التبليغ الآن
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
