import React from 'react';
import { Sparkles, Trophy, LayoutDashboard, FileText, Home, ShieldCheck, UserCheck } from 'lucide-react';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setCurrentView }) => {
  const isAdminView = currentView === 'admin';

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-8">
          {/* Zone 1: Brand Wordmark */}
          <button 
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-3 text-right group focus:outline-none"
          >
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-105 ${
              isAdminView ? 'bg-gradient-to-br from-slate-800 to-slate-950' : 'bg-gradient-to-br from-emerald-600 to-emerald-800 shadow-emerald-600/20'
            }`}>
              {isAdminView ? <ShieldCheck className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
            </div>
            <div>
              <span className="text-xl font-extrabold text-slate-900 tracking-tight block">
                {isAdminView ? 'بوابة إدارة البلدية' : 'سوف النقية'}
              </span>
              <span className="text-xs font-semibold text-emerald-700 block">
                {isAdminView ? 'النظام المركزي للعمليات' : 'منصة الذكاء الاصطناعي لمدينة الوادي'}
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links separated into Citizen vs Admin */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold">
            {!isAdminView ? (
              <div className="flex items-center gap-6 bg-emerald-50/60 px-4 py-2 rounded-2xl border border-emerald-100">
                <span className="text-xs font-bold text-emerald-800 bg-emerald-200/60 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5" /> بوابة المواطن
                </span>
                <button
                  onClick={() => setCurrentView('home')}
                  className={`transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                    currentView === 'home' ? 'text-emerald-700 font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Home className="w-4 h-4" />
                  الرئيسية
                </button>
                <button
                  onClick={() => setCurrentView('report')}
                  className={`transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                    currentView === 'report' ? 'text-emerald-700 font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  تقديم بلاغ (رفع صورة حية)
                </button>
                <button
                  onClick={() => setCurrentView('leaderboard')}
                  className={`transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                    currentView === 'leaderboard' ? 'text-emerald-700 font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Trophy className="w-4 h-4" />
                  ترتيب الأحياء
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-6 bg-slate-100 px-4 py-2 rounded-2xl border border-slate-200">
                <span className="text-xs font-bold text-slate-800 bg-slate-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> بوابة الإدارة والبلدية
                </span>
                <span className="text-xs text-slate-500 font-medium">لوحة تحكم وتدخلات ميدانية</span>
              </div>
            )}
          </nav>

          {/* Zone 3: Portal Switcher CTA */}
          <div className="flex items-center gap-3 shrink-0">
            {!isAdminView ? (
              <button
                onClick={() => setCurrentView('admin')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all whitespace-nowrap"
              >
                <ShieldCheck className="w-4 h-4 text-slate-600" />
                <span>دخول واجهة الإدارة</span>
              </button>
            ) : (
              <button
                onClick={() => setCurrentView('home')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition-all whitespace-nowrap"
              >
                <Home className="w-4 h-4" />
                <span>العودة لواجهة المواطن</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
