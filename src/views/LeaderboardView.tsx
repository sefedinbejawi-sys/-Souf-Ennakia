import React, { useEffect, useState } from 'react';
import { Trophy, Award, TrendingUp, Sparkles, MapPin, CheckCircle2 } from 'lucide-react';
import { NeighborhoodRank } from '../types';

export const LeaderboardView: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<NeighborhoodRank[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/leaderboard')
      .then(res => res.json())
      .then(data => {
        setLeaderboard(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold">
          <Trophy className="w-4 h-4" />
          <span>لوحة شرف النظافة والبيئة</span>
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          ترتيب أحياء ولاية الوادي تنافسياً
        </h1>
        <p className="text-slate-600 text-sm leading-relaxed">
          يتنافس مواطنو أحياء مدينة الوادي للحفاظ على نظافة محيطهم. يتم احتساب النقاط بناءً على عدد البلاغات المقدمة وسرعة الحل والاستجابة.
        </p>
      </div>

      {/* Top 3 Podiums */}
      {!loading && leaderboard.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-4">
          {/* 2nd Place */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl text-center relative transform md:-translate-y-4">
            <div className="w-14 h-14 bg-slate-100 text-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4 font-black text-xl shadow-inner">
              🥈 2
            </div>
            <h3 className="text-xl font-bold text-slate-900">{leaderboard[1].name}</h3>
            <div className="my-3 inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
              {leaderboard[1].points} نقطة بيئية
            </div>
            <div className="text-xs text-slate-500 space-y-1">
              <p>البلاغات المحلولة: <span className="font-bold text-slate-800">{leaderboard[1].resolvedCount}</span></p>
              <p>إجمالي البلاغات: <span className="font-bold text-slate-800">{leaderboard[1].totalReports}</span></p>
            </div>
          </div>

          {/* 1st Place */}
          <div className="bg-gradient-to-b from-amber-500 to-amber-600 text-white rounded-3xl p-8 shadow-2xl text-center relative transform md:-translate-y-8">
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-white text-amber-600 rounded-full flex items-center justify-center shadow-lg font-black text-xl">
              👑
            </div>
            <div className="w-16 h-16 bg-white/20 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 font-black text-2xl shadow-inner">
              🥇 1
            </div>
            <h3 className="text-2xl font-black text-white">{leaderboard[0].name}</h3>
            <div className="my-3 inline-block px-4 py-1.5 rounded-full bg-white text-amber-700 text-sm font-extrabold shadow-md">
              {leaderboard[0].points} نقطة بيئية
            </div>
            <div className="text-xs text-amber-100 space-y-1">
              <p>البلاغات المحلولة: <span className="font-bold text-white">{leaderboard[0].resolvedCount}</span></p>
              <p>نسبة النظافة: <span className="font-bold text-white">96%</span></p>
            </div>
          </div>

          {/* 3rd Place */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl text-center relative">
            <div className="w-14 h-14 bg-amber-100 text-amber-800 rounded-2xl flex items-center justify-center mx-auto mb-4 font-black text-xl shadow-inner">
              🥉 3
            </div>
            <h3 className="text-xl font-bold text-slate-900">{leaderboard[2].name}</h3>
            <div className="my-3 inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
              {leaderboard[2].points} نقطة بيئية
            </div>
            <div className="text-xs text-slate-500 space-y-1">
              <p>البلاغات المحلولة: <span className="font-bold text-slate-800">{leaderboard[2].resolvedCount}</span></p>
              <p>إجمالي البلاغات: <span className="font-bold text-slate-800">{leaderboard[2].totalReports}</span></p>
            </div>
          </div>
        </div>
      )}

      {/* Full Leaderboard Table */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900 text-lg">جدول الترتيب العام لأحياء الوادي</h3>
          <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-full">
            محدث آنياً
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-xs font-bold border-b border-slate-100">
                <th className="py-4 px-6">المرتبة</th>
                <th className="py-4 px-6">الحي / المنطقة</th>
                <th className="py-4 px-6">البلاغات المحلولة</th>
                <th className="py-4 px-6">إجمالي البلاغات</th>
                <th className="py-4 px-6">النقاط البيئية</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">جاري تحميل لوحة الشرف...</td>
                </tr>
              ) : (
                leaderboard.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-bold font-mono">
                      <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${
                        item.rank === 1 ? 'bg-amber-500 text-white shadow-md' :
                        item.rank === 2 ? 'bg-slate-200 text-slate-800' :
                        item.rank === 3 ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-600'
                      }`}>
                        #{item.rank}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-900 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-600" />
                      {item.name}
                    </td>
                    <td className="py-4 px-6 font-mono text-emerald-700 font-bold">{item.resolvedCount}</td>
                    <td className="py-4 px-6 font-mono text-slate-600">{item.totalReports}</td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 rounded-xl bg-amber-50 text-amber-700 text-xs font-bold font-mono">
                        {item.points} نقطة
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
