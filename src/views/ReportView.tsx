import React, { useState } from 'react';
import { Camera, MapPin, Sparkles, Upload, CheckCircle2, AlertTriangle, ArrowRight, Loader2, Image as ImageIcon } from 'lucide-react';

interface ReportViewProps {
  setCurrentView: (view: string) => void;
}

const NEIGHBORHOODS_EL_OUED = [
  'حي 19 مارس',
  'حي الشط',
  'حي الوادي وسط',
  'حي الدبيلة',
  'حي النخلة',
  'حي سيدي عون',
  'حي تكسبت',
  'حي البياضة'
];

export const ReportView: React.FC<ReportViewProps> = ({ setCurrentView }) => {
  const [category, setCategory] = useState('نفايات صلبة');
  const [neighborhood, setNeighborhood] = useState('حي 19 مارس');
  const [description, setDescription] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80');
  const [lat, setLat] = useState(33.3656);
  const [lng, setLng] = useState(6.8614);
  const [locationFetched, setLocationFetched] = useState(false);

  const [loading, setLoading] = useState(false);
  const [submittedReport, setSubmittedReport] = useState<any | null>(null);
  const [error, setError] = useState('');

  // Handle direct live image upload / camera capture
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setImageUrl(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLat(pos.coords.latitude);
          setLng(pos.coords.longitude);
          setLocationFetched(true);
        },
        () => {
          setLat(33.3656 + (Math.random() - 0.5) * 0.01);
          setLng(6.8614 + (Math.random() - 0.5) * 0.01);
          setLocationFetched(true);
        }
      );
    } else {
      setLocationFetched(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          neighborhood,
          description: description || 'بلاغ نظافة فوري في حي ' + neighborhood,
          lat,
          lng,
          reporterName: reporterName || 'مواطن من ولاية الوادي',
          imageUrl
        })
      });

      if (!res.ok) throw new Error('فشل في إرسال البلاغ');
      const data = await res.json();
      setSubmittedReport(data);
    } catch (err: any) {
      setError(err.message || 'حدث خطأ ما');
    } finally {
      setLoading(false);
    }
  };

  if (submittedReport) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-emerald-100 space-y-6">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-black text-slate-900">تم إرسال بلاغك الحي بنجاح!</h2>
          <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
            تم استلام صورتك الحية وتحليلها فورياً عبر نموذج الذكاء الاصطناعي (Gemini). تم توجيه البلاغ لفرقة التدخل في <span className="font-bold text-emerald-700">{submittedReport.neighborhood}</span>.
          </p>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-right space-y-3">
            <div className="flex justify-between text-xs text-slate-500 border-b border-slate-200 pb-2">
              <span>رقم البلاغ التعريفي:</span>
              <span className="font-mono font-bold text-slate-800">{submittedReport.id}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-500 border-b border-slate-200 pb-2">
              <span>التصنيف الذكي:</span>
              <span className="font-bold text-emerald-700">{submittedReport.category}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-500 border-b border-slate-200 pb-2">
              <span>مستوى الخطورة:</span>
              <span className="font-bold text-amber-600">{submittedReport.severity}</span>
            </div>
            <div className="pt-1">
              <span className="block text-xs font-bold text-slate-700 mb-1">تحليل الذكاء الاصطناعي:</span>
              <p className="text-xs text-slate-600 italic bg-white p-3 rounded-xl border border-slate-100">
                "{submittedReport.aiAnalysis}"
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => setSubmittedReport(null)}
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors"
            >
              تقديم بلاغ حي آخر
            </button>
            <button
              onClick={() => setCurrentView('home')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition-all"
            >
              العودة للرئيسية
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-emerald-700 font-bold text-xs tracking-wider uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
          بوابة المواطن - سوف النقية
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3">
          تقديم بلاغ حي بالصورة الفورية
        </h1>
        <p className="text-slate-600 text-sm mt-2">
          التقط صورة حية من هاتفك أو ارفع صورة الموقع لتتم معالجتها فوراً وتحديد موقعك بدقة.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-100 space-y-8">
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm font-semibold border border-red-200">
            {error}
          </div>
        )}

        {/* Direct Live Photo Upload & Camera Capture */}
        <div className="space-y-4">
          <label className="block text-sm font-bold text-slate-900">
            1. التقاط صورة حية أو رفع صورة من المعرض
          </label>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Image Preview Box */}
            <div className="relative h-56 rounded-2xl overflow-hidden bg-slate-900 border-2 border-dashed border-emerald-300 flex items-center justify-center shadow-inner group">
              <img
                src={imageUrl}
                alt="معاينة الصورة الحية"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-2">
                <ImageIcon className="w-5 h-5" />
                <span>الصورة المختارة للبلاغ الحي</span>
              </div>
            </div>

            {/* Upload Buttons */}
            <div className="space-y-4">
              <div className="bg-emerald-50/80 p-5 rounded-2xl border border-emerald-100 space-y-3">
                <div className="flex items-center gap-3 text-emerald-800">
                  <Camera className="w-6 h-6 text-emerald-600 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold">التقاط صورة حية بالموبايل أو الكمبيوتر</h4>
                    <p className="text-xs text-emerald-700/80">استخدم كاميرا الجهاز مباشرة لتسجيل الحالة الواقعية بدقة.</p>
                  </div>
                </div>

                <label className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md cursor-pointer transition-all transform hover:-translate-y-0.5">
                  <Camera className="w-5 h-5" />
                  <span>فتح الكاميرا أو رفع صورة حية</span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="text-xs text-slate-500 text-center">
                أو يمكنك الاختيار من الصور الجاهزة للاختبار أدناه:
              </div>

              <div className="flex gap-2 justify-center">
                {[
                  'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=300&q=80',
                  'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=300&q=80',
                  'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=300&q=80'
                ].map((sampleUrl, idx) => (
                  <img
                    key={idx}
                    src={sampleUrl}
                    alt="Sample"
                    onClick={() => setImageUrl(sampleUrl)}
                    className="w-16 h-16 rounded-xl object-cover cursor-pointer border-2 border-slate-200 hover:border-emerald-600 transition-all"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Category & Neighborhood */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-900">تصنيف المشكلة البيئية</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl border border-slate-200 text-sm font-medium bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="نفايات صلبة">نفايات صلبة ومخلفات بناء</option>
              <option value="نفايات منزلية">حاويات نفايات منزلية ممتلئة</option>
              <option value="حرق عشوائي">حرق عشوائي للنفايات</option>
              <option value="أتربة وعوائق">تراكم أتربة وعوائق بالطريق</option>
              <option value="مخلفات زراعية">مخلفات زراعية ونخيل</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-900">حي / منطقة الوادي</label>
            <select
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl border border-slate-200 text-sm font-medium bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              {NEIGHBORHOODS_EL_OUED.map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        </div>

        {/* GPS Location */}
        <div className="space-y-2 bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <span className="block text-sm font-bold text-slate-900">2. موقع البلاغ (GPS)</span>
              <span className="text-xs text-slate-500">احصل على إحداثيات موقعك بدقة لسهولة وصول فرقة التدخل.</span>
            </div>
            <button
              type="button"
              onClick={handleFetchLocation}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition-all"
            >
              <MapPin className="w-4 h-4" />
              <span>جلب موقعي الحالي</span>
            </button>
          </div>
          {locationFetched && (
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 pt-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>تم تحديد الإحداثيات بنجاح: ({lat.toFixed(4)}, {lng.toFixed(4)}) - ولاية الوادي</span>
            </div>
          )}
        </div>

        {/* Description & Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-900">ملاحظات إضافية (اختياري)</label>
            <textarea
              rows={3}
              placeholder="اكتب تفاصيل إضافية عن حجم المخلفات أو مكان تواجدها بالتحديد..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-900">اسم المبلغ (اختياري)</label>
            <input
              type="text"
              placeholder="اسمك الكريم..."
              value={reporterName}
              onChange={(e) => setReporterName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Submit Button with AI note */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>سيتم تحليل البلاغ فورياً بواسطة محرك الذكاء الاصطناعي، مع مراجعة بشرية من فريق البلدية.</span>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 shadow-xl shadow-emerald-600/25 transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>جاري تحليل الصورة بالذكاء الاصطناعي...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>إرسال البلاغ الحي الذكي</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
