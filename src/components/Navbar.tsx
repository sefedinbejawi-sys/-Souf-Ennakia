import React, { useState } from 'react';
import { FileText, Home, LayoutDashboard, Menu, Sparkles, Trophy, UserCheck, X } from 'lucide-react';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

const links = [
  { id: 'home', label: 'الرئيسية', icon: Home },
  { id: 'report', label: 'تقديم بلاغ', icon: FileText },
  { id: 'leaderboard', label: 'ترتيب الأحياء', icon: Trophy },
];

export const Navbar: React.FC<NavbarProps> = ({ currentView, setCurrentView }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isAdminView = currentView === 'admin';

  const navigate = (view: string) => {
    setCurrentView(view);
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 shadow-sm backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[76px] items-center justify-between gap-4">
          <button onClick={() => navigate('home')} className="group flex items-center gap-3 text-right focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 rounded-2xl" aria-label="العودة إلى الصفحة الرئيسية">
            <span className={`flex h-11 w-11 items-center justify-center rounded-2xl text-white shadow-lg transition-transform group-hover:scale-105 ${isAdminView ? 'bg-slate-900' : 'bg-gradient-to-br from-emerald-500 to-teal-700'}`}>
              {isAdminView ? <LayoutDashboard className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
            </span>
            <span className="hidden sm:block">
              <span className="block text-lg font-black tracking-tight text-slate-950">{isAdminView ? 'بوابة البلدية' : 'سوف النقية'}</span>
              <span className="block text-[11px] font-bold text-emerald-700">{isAdminView ? 'لوحة العمليات الميدانية' : 'مدينة الوادي • منصة بيئية ذكية'}</span>
            </span>
          </button>

          <nav className="hidden items-center gap-1 rounded-2xl border border-slate-200 bg-slate-50/80 p-1 md:flex" aria-label="التنقل الرئيسي">
            {!isAdminView && links.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => navigate(id)} className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${currentView === id ? 'bg-white text-emerald-700 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:bg-white/70 hover:text-slate-900'}`} aria-current={currentView === id ? 'page' : undefined}>
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
            {isAdminView && <span className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-slate-700"><LayoutDashboard className="h-4 w-4" /> متابعة البلاغات والتدخلات</span>}
          </nav>

          <div className="flex items-center gap-2">
            <button onClick={() => navigate(isAdminView ? 'home' : 'admin')} className={`hidden items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black transition-all sm:inline-flex ${isAdminView ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700' : 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'}`}>
              {isAdminView ? <Home className="h-4 w-4" /> : <LayoutDashboard className="h-4 w-4" />}
              {isAdminView ? 'واجهة المواطن' : 'واجهة الإدارة'}
            </button>
            <button onClick={() => setIsMenuOpen((open) => !open)} className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 md:hidden" aria-label={isMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'} aria-expanded={isMenuOpen}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="border-t border-slate-100 py-3 md:hidden">
            <div className="grid gap-1">
              {!isAdminView && links.map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => navigate(id)} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold ${currentView === id ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-50'}`}><Icon className="h-4 w-4" />{label}</button>
              ))}
              <button onClick={() => navigate(isAdminView ? 'home' : 'admin')} className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50"><UserCheck className="h-4 w-4" />{isAdminView ? 'العودة لواجهة المواطن' : 'دخول واجهة الإدارة'}</button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
