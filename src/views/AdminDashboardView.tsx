import React, { useEffect, useState, useRef } from 'react';
import { LayoutDashboard, CheckCircle2, Clock, AlertTriangle, MapPin, Search, Filter, ShieldCheck, Check, RefreshCw } from 'lucide-react';
import { Report } from '../types';
import L from 'leaflet';

const escapeHtml = (value: string) => value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character] ?? character));

export const AdminDashboardView: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('الكل');
  const [searchQuery, setSearchQuery] = useState('');
  
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const fetchReports = async () => {
    try {
      const res = await fetch('/api/reports');
      const data = await res.json();
      setReports(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapRef.current).setView([33.3656, 6.8614], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);
      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear existing markers if any (we can manage markers layer or re-add)
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    reports.forEach((rep) => {
      const markerColor = rep.status === 'تم الحل' ? '#10B981' : '#F59E0B';
      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `<div style="background-color: ${markerColor}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3);"></div>`,
        iconSize: [24, 24]
      });

      const marker = L.marker([rep.lat, rep.lng], { icon: customIcon }).addTo(map);
      marker.bindPopup(`
        <div style="font-family: 'Cairo', sans-serif; text-align: right; direction: rtl; min-width: 200px;">
          <strong style="color: #0f172a; font-size: 14px;">${escapeHtml(rep.neighborhood)}</strong>
          <p style="margin: 4px 0; font-size: 12px; color: #475569;">${escapeHtml(rep.category)}</p>
          <span style="display: inline-block; padding: 2px 8px; border-radius: 9999px; font-size: 10px; font-weight: bold; background: ${rep.status === 'تم الحل' ? '#d1fae5' : '#fef3c7'}; color: ${rep.status === 'تم الحل' ? '#065f46' : '#92400e'};">
            ${escapeHtml(rep.status)}
          </span>
        </div>
      `);
    });
  }, [reports]);

  const handleStatusChange = async (id: string, newStatus: 'قيد المعالجة' | 'تم الحل') => {
    try {
      const res = await fetch(`/api/reports/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchReports();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredReports = reports.filter(rep => {
    const matchesStatus = filterStatus === 'الكل' || rep.status === filterStatus;
    const matchesSearch = rep.neighborhood.includes(searchQuery) || rep.category.includes(searchQuery) || rep.description.includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  const totalCount = reports.length;
  const pendingCount = reports.filter(r => r.status === 'قيد المعالجة').length;
  const resolvedCount = reports.filter(r => r.status === 'تم الحل').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>بوابة الإدارة المحلية لولاية الوادي</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">لوحة تحكم العمليات البلدية</h1>
        </div>
        <button
          onClick={fetchReports}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-xs transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          <span>تحديث البيانات</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-lg flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xl">
            <LayoutDashboard className="w-7 h-7" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">إجمالي البلاغات الواردة</div>
            <div className="text-3xl font-black text-slate-900 mt-1 tabular-nums">{totalCount}</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-lg flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xl">
            <Clock className="w-7 h-7" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">بلاغات قيد المعالجة والتدخل</div>
            <div className="text-3xl font-black text-slate-900 mt-1 tabular-nums">{pendingCount}</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-lg flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-xl">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">بلاغات تم حلها ورفعها</div>
            <div className="text-3xl font-black text-slate-900 mt-1 tabular-nums">{resolvedCount}</div>
          </div>
        </div>
      </div>

      {/* Interactive Map Section */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden space-y-4">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-slate-900 text-lg">خريطة تمركز البلاغات في مدينة الوادي</h3>
            <p className="text-xs text-slate-500 mt-0.5">تتبع جغرافي حي لنقاط وتراكمات النفايات عبر الأحياء</p>
          </div>
          <div className="flex items-center gap-3 text-xs font-bold">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span> قيد المعالجة</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span> تم الحل</span>
          </div>
        </div>
        <div ref={mapRef} className="w-full h-[400px] z-10"></div>
      </div>

      {/* Reports Table Section */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-80">
              <Search className="absolute right-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="بحث حسب الحي، التصنيف..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {['الكل', 'قيد المعالجة', 'تم الحل'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  filterStatus === status ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-xs font-bold border-b border-slate-100">
                <th className="py-4 px-6">الصورة</th>
                <th className="py-4 px-6">الحي / المنطقة</th>
                <th className="py-4 px-6">التصنيف الذكي</th>
                <th className="py-4 px-6">تحليل الذكاء الاصطناعي</th>
                <th className="py-4 px-6">الحالة</th>
                <th className="py-4 px-6">إجراء البلدية</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">جاري تحميل البلاغات...</td>
                </tr>
              ) : filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">لا توجد بلاغات تطابق بحثك.</td>
                </tr>
              ) : (
                filteredReports.map(report => (
                  <tr key={report.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6">
                      <img
                        src={report.imageUrl}
                        alt={report.category}
                        className="w-14 h-14 rounded-xl object-cover border border-slate-200 shadow-xs"
                      />
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-900">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-emerald-600" />
                        {report.neighborhood}
                      </div>
                      <span className="text-xs text-slate-400 block mt-0.5">{report.reporterName}</span>
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-800">{report.category}</td>
                    <td className="py-4 px-6 text-xs text-slate-600 max-w-xs leading-relaxed">
                      {report.aiAnalysis}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                        report.status === 'تم الحل' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        {report.status === 'قيد المعالجة' ? (
                          <button
                            onClick={() => handleStatusChange(report.id, 'تم الحل')}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs transition-all"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>تعليم كـ "تم الحل"</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStatusChange(report.id, 'قيد المعالجة')}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 transition-all"
                          >
                            <span>إعادة فتح</span>
                          </button>
                        )}
                      </div>
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
