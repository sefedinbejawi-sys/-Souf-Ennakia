import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

interface Report {
  id: string;
  imageUrl: string;
  category: string;
  description: string;
  lat: number;
  lng: number;
  neighborhood: string;
  severity: 'منخفضة' | 'متوسطة' | 'عالية' | 'حرجة';
  aiAnalysis: string;
  status: 'قيد المعالجة' | 'تم الحل' | 'مرفوض';
  createdAt: string;
  reporterName: string;
}

interface NeighborhoodRank {
  id: string;
  name: string;
  resolvedCount: number;
  totalReports: number;
  points: number;
  rank: number;
  trend: 'up' | 'down' | 'stable';
}

// Initial seed data for El Oued (سوف)
let reports: Report[] = [
  {
    id: 'rep-1',
    imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
    category: 'نفايات صلبة',
    description: 'تراكم مخلفات بناء وأكياس بلاستيكية بجانب الطريق الرئيسي في حي 19 مارس.',
    lat: 33.3682,
    lng: 6.8456,
    neighborhood: 'حي 19 مارس',
    severity: 'عالية',
    aiAnalysis: 'تم رصد نفايات صلبة ومواد بناء بحجم يقدر بـ 1.5 متر مكعب. يُنصح بتدخل شاحنة رفع الأنقاض خلال 24 ساعة.',
    status: 'قيد المعالجة',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    reporterName: 'محمد بن عيسى'
  },
  {
    id: 'rep-2',
    imageUrl: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=800&q=80',
    category: 'نفايات منزلية',
    description: 'حاويات ممتلئة وتناثر القمامة حولها في حي الشط قرب السوق اليومي.',
    lat: 33.3591,
    lng: 6.8521,
    neighborhood: 'حي الشط',
    severity: 'متوسطة',
    aiAnalysis: 'حاويات نفايات تجاوزت السعة القصوى مع تناثر مخلفات عضوية وبلاستيكية. يتطلب جدول تفريغ عاجل.',
    status: 'تم الحل',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    reporterName: 'فاطمة الزهراء'
  },
  {
    id: 'rep-3',
    imageUrl: 'https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?auto=format&fit=crop&w=800&q=80',
    category: 'حرق عشوائي',
    description: 'دخان كثيف نتيجة حرق النفايات العشبية والبلاستيك في أراضي فضاء.',
    lat: 33.3754,
    lng: 6.8712,
    neighborhood: 'حي الدبيلة',
    severity: 'حرجة',
    aiAnalysis: 'خطر بيئي وصحي مرتفع جداً بسبب انبعاثات حرق المواد البلاستيكية. تم إخطار فرقة التدخل البيئي.',
    status: 'قيد المعالجة',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    reporterName: 'عبد القادر سوفي'
  },
  {
    id: 'rep-4',
    imageUrl: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=800&q=80',
    category: 'ردم وتلوث',
    description: 'بقايا أشجار نخيل ومخلفات زراعية مهملة تعيق حركة المترجلين.',
    lat: 33.3512,
    lng: 6.8390,
    neighborhood: 'حي الوادي وسط',
    severity: 'منخفضة',
    aiAnalysis: 'مخلفات تقليم نخيل صالحة للتدوير. موصى بتوجيه شاحنة الفرز الزراعي.',
    status: 'تم الحل',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    reporterName: 'خالد لعريبي'
  }
];

let neighborhoods: NeighborhoodRank[] = [
  { id: 'n1', name: 'حي 19 مارس', resolvedCount: 42, totalReports: 48, points: 1250, rank: 1, trend: 'up' },
  { id: 'n2', name: 'حي الشط', resolvedCount: 38, totalReports: 45, points: 1100, rank: 2, trend: 'up' },
  { id: 'n3', name: 'حي الوادي وسط', resolvedCount: 35, totalReports: 40, points: 980, rank: 3, trend: 'stable' },
  { id: 'n4', name: 'حي الدبيلة', resolvedCount: 29, totalReports: 36, points: 850, rank: 4, trend: 'down' },
  { id: 'n5', name: 'حي النخلة', resolvedCount: 24, totalReports: 30, points: 720, rank: 5, trend: 'up' },
  { id: 'n6', name: 'حي سيدي عون', resolvedCount: 19, totalReports: 25, points: 590, rank: 6, trend: 'stable' }
];

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  const PORT = Number(process.env.PORT) || 3000;

  // Initialize Gemini AI if available
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

  // API Routes
  app.get('/api/stats', (req, res) => {
    const totalReports = reports.length + 120; // Simulated historical pool
    const resolvedReports = reports.filter(r => r.status === 'تم الحل').length + 104;
    const activeNeighborhoods = neighborhoods.length;
    const tonsRemoved = 48.5;

    res.json({
      totalReports,
      resolvedReports,
      activeNeighborhoods,
      tonsRemoved,
      responseRate: '92.4%'
    });
  });

  app.get('/api/reports', (req, res) => {
    res.json(reports);
  });

  app.post('/api/reports', async (req, res) => {
    try {
      const { category, description, lat, lng, neighborhood, reporterName, imageUrl } = req.body;

      let aiAnalysis = 'تم تحليل الصورة بنجاح وتصنيف البلاغ وإرساله للفرقة البلدية المختصة.';
      let severity: 'منخفضة' | 'متوسطة' | 'عالية' | 'حرجة' = 'متوسطة';

      if (ai) {
        try {
          const prompt = `أنت نظام ذكاء اصطناعي لمدينة الوادي (سوف النقية) لتحليل بلاغات النظافة.
          تصنيف البلاغ: ${category}
          الوصف: ${description}
          قم بتقديم تحليل موجز بالعربية (في حدود 2 جملتين) يوضح خطورة المخلفات والإجراء المقترح للبلدية، وحدد مستوى الخطورة بدقة واحدة من الكلمات التالية حصراً: منخفضة، متوسطة، عالية، حرجة.
          أعط النتيجة بصيغة JSON كالتالي:
          {
            "severity": "متوسطة",
            "analysis": "التحليل هنا..."
          }`;

          const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [prompt],
          });

          const text = response.text || '';
          const jsonMatch = text.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            if (parsed.severity) severity = parsed.severity;
            if (parsed.analysis) aiAnalysis = parsed.analysis;
          }
        } catch (aiErr) {
          console.error('Gemini analysis error:', aiErr);
        }
      }

      const newReport: Report = {
        id: `rep-${Date.now()}`,
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
        category: category || 'نفايات عامة',
        description: description || 'بلاغ نظافة جديد',
        lat: lat ? parseFloat(lat) : 33.3656,
        lng: lng ? parseFloat(lng) : 6.8614,
        neighborhood: neighborhood || 'حي الوادي وسط',
        severity,
        aiAnalysis,
        status: 'قيد المعالجة',
        createdAt: new Date().toISOString(),
        reporterName: reporterName || 'مواطن كريم'
      };

      reports.unshift(newReport);

      // Update neighborhood stats
      const nb = neighborhoods.find(n => n.name === neighborhood);
      if (nb) {
        nb.totalReports += 1;
        nb.points += 25;
      }

      res.status(201).json(newReport);
    } catch (err: any) {
      console.error('Error creating report:', err);
      res.status(500).json({ error: err.message || 'Server error' });
    }
  });

  app.patch('/api/reports/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const report = reports.find(r => r.id === id);
    if (!report) {
      return res.status(404).json({ error: 'البلاغ غير موجود' });
    }

    report.status = status;
    if (status === 'تم الحل') {
      const nb = neighborhoods.find(n => n.name === report.neighborhood);
      if (nb) {
        nb.resolvedCount += 1;
        nb.points += 50;
      }
    }

    res.json(report);
  });

  app.get('/api/leaderboard', (req, res) => {
    // Sort by points descending
    const sorted = [...neighborhoods].sort((a, b) => b.points - a.points);
    sorted.forEach((n, idx) => {
      n.rank = idx + 1;
    });
    res.json(sorted);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Souf Ennakia server running on http://localhost:${PORT}`);
  });
}

startServer();
