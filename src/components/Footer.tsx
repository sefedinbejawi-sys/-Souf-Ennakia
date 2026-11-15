import React from 'react';
import { Sparkles, Heart, ShieldCheck, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">سوف النقية (Souf Ennakia)</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              منصة رقمية ذكية تدمج قوة الذكاء الاصطناعي مع مشاركة مواطني ولاية الوادي (سوف) للحفاظ على نظافة البيئة، تحسين إطار الحياة، وتسهيل التدخل البلدي العاجل.
            </p>
            <div className="flex items-center gap-4 text-xs text-emerald-400 pt-2">
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> ولاية الوادي، الجزائر</span>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm mb-4 tracking-wide">روابط سريعة</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#home" className="hover:text-emerald-400 transition-colors">الرئيسية</a></li>
              <li><a href="#report" className="hover:text-emerald-400 transition-colors">تقديم بلاغ فوري</a></li>
              <li><a href="#leaderboard" className="hover:text-emerald-400 transition-colors">لوحة شرف الأحياء</a></li>
              <li><a href="#admin" className="hover:text-emerald-400 transition-colors">بوابة البلدية</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm mb-4 tracking-wide">خدمة الطوارئ والتبليغ</h4>
            <p className="text-slate-400 text-sm mb-3">للتبليغ الهاتفي المباشر أو حالات الطوارئ البيئية:</p>
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/60 inline-flex items-center gap-3">
              <Phone className="w-5 h-5 text-emerald-400" />
              <div className="text-left font-mono font-bold text-white text-lg" dir="ltr">
                1547 / 032.21.00.00
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} سوف النقية. جميع الحقوق محفوظة لولاية الوادي.</p>
          <p className="flex items-center gap-1">
            صُمم بِحب لمدينة ألف دومة ودومة <Heart className="w-3.5 h-3.5 text-emerald-500 inline fill-emerald-500" />
          </p>
        </div>
      </div>
    </footer>
  );
};
