import React, { useState } from 'react';
import { useMedSync } from '../../context/MedSyncContext';
import { 
  BarChart3, 
  FileText, 
  Download, 
  Printer, 
  Calendar, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Activity, 
  BedDouble, 
  ShieldCheck,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const ReportsModule: React.FC = () => {
  const { invoices, appointments, patients, hospitalKpis, currentHospital, openPrintDocument, t, language } = useMedSync();

  const [dateRange, setDateRange] = useState('month');

  const totalBeds = currentHospital?.bedsCount || 240;
  const occupiedBeds = currentHospital?.occupiedBeds || 184;
  const occupancyRate = hospitalKpis?.occupancyRate ?? (totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 76);

  // Revenue by Month Data
  const monthlyRevenueData = [
    { month: 'Jan', revenue: 380000, collections: 350000, claims: 120000 },
    { month: 'Feb', revenue: 420000, collections: 390000, claims: 140000 },
    { month: 'Mar', revenue: 460000, collections: 430000, claims: 155000 },
    { month: 'Apr', revenue: 490000, collections: 460000, claims: 170000 },
    { month: 'May', revenue: 530000, collections: 500000, claims: 185000 },
    { month: 'Jun', revenue: 580000, collections: 545000, claims: 210000 },
  ];

  // Department Distribution Data
  const departmentData = [
    { name: 'Cardiology', visits: 412, fill: '#0d9488' },
    { name: 'Pediatrics', visits: 350, fill: '#2563eb' },
    { name: 'Orthopedics', visits: 280, fill: '#8b5cf6' },
    { name: 'Neurology', visits: 195, fill: '#ec4899' },
    { name: 'Internal Med', visits: 385, fill: '#f59e0b' },
  ];

  const exportCsv = (type: 'financial' | 'clinical') => {
    let csvContent = "data:text/csv;charset=utf-8,";
    if (type === 'financial') {
      csvContent += "Invoice Number,Patient,MRN,Date,Total Amount,Paid Amount,Balance Due,Status\n";
      invoices.forEach(inv => {
        csvContent += `"${inv.invoiceNumber}","${inv.patientName}","${inv.patientMrn}","${inv.issueDate}",${inv.totalAmount},${inv.paidAmount},${inv.balanceDue},"${inv.status}"\n`;
      });
    } else {
      csvContent += "MRN,Patient Name,Age,Gender,Blood Type,Total Visits,Insurance\n";
      patients.forEach(pat => {
        csvContent += `"${pat.mrn}","${pat.name}",${pat.age},"${pat.gender}","${pat.bloodType}",${pat.totalVisits},"${pat.insuranceProvider || 'Self'}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `medsync_${type}_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 sm:p-8 space-y-6 animate-in fade-in duration-200">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-teal-600" />
            <span>{t('التقارير السريرية والتحليلات المالية', 'Clinical Intelligence & Financial Reports')}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {t('مؤشرات كفاءة المستشفى، التدفق النقدي، ومعدلات استهلاك الأسرة والخدمات', 'Operational census, cash flow analytics, and hospital performance exports')}
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => exportCsv('financial')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>{t('تصدير المالي (Excel)', 'Export Finance (CSV)')}</span>
          </button>

          <button
            onClick={() => exportCsv('clinical')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all"
          >
            <FileSpreadsheet className="w-4 h-4 text-blue-600" />
            <span>{t('تصدير السريري (CSV)', 'Export Clinical (CSV)')}</span>
          </button>

          <button
            onClick={() => openPrintDocument({
              type: 'performance_report',
              data: {
                bedOccupancy: `${occupancyRate}%`,
                totalPatients: patients.length || 1420
              },
              title: t('التقرير الإداري والطبي الشامل للمستشفى', 'Hospital Executive Performance Report')
            })}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-md shadow-teal-500/20 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>{t('طباعة التقرير الشامل (PDF)', 'Print Full PDF')}</span>
          </button>
        </div>
      </div>

      {/* 2. Top Summary KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">{t('إجمالي الإيرادات المسجلة', 'Gross Revenue')}</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">2,860,000 SAR</p>
          <span className="text-xs text-emerald-600 font-bold mt-1 block">↑ +14.2% {t('نمو سنوي', 'YoY')}</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">{t('نسبة إشغال الأسرة (Bed Occupancy)', 'Bed Occupancy Rate')}</span>
            <BedDouble className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-2xl font-black text-teal-600 mt-2">{occupancyRate}%</p>
          <span className="text-xs text-slate-400 mt-1 block">{occupiedBeds} / {totalBeds} {t('سرير شاغر ومشغول', 'beds active')}</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">{t('متوسط مدة الإقامة (ALOS)', 'Avg Length of Stay')}</span>
            <Calendar className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-blue-600 mt-2">3.4 {t('أيام', 'Days')}</p>
          <span className="text-xs text-emerald-600 font-bold mt-1 block">↓ -0.5 {t('أيام كفاءة تشغيل', 'days faster')}</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">{t('معدل رضا المرضى (Patient CSAT)', 'Patient Satisfaction')}</span>
            <Activity className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-black text-purple-600 mt-2">94.8%</p>
          <span className="text-xs text-purple-600 font-bold mt-1 block">★ 4.85 / 5.0 (Press Ganey)</span>
        </div>
      </div>

      {/* 3. Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue & Collections Chart */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {t('التدفقات النقدية ومطالبات التأمين (SAR)', 'Revenue, Collections & Insurance Claims')}
              </h3>
              <p className="text-xs text-slate-400">{t('المقارنة الشهرية للنصف الأول من العام', 'Monthly trend breakdown')}</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-bold">
              <span className="flex items-center gap-1 text-teal-600"><span className="w-2.5 h-2.5 rounded-full bg-teal-600" /> Revenue</span>
              <span className="flex items-center gap-1 text-blue-600"><span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Collections</span>
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyRevenueData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCol" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b820" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(val) => `${val / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '16px', color: '#fff' }}
                  formatter={(val: number) => [`${val.toLocaleString()} SAR`]}
                />
                <Area type="monotone" dataKey="revenue" stroke="#0d9488" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="collections" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCol)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Distribution Bar Chart */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {t('إقبال المرضى حسب التخصص', 'Visits by Specialty')}
            </h3>
            <p className="text-xs text-slate-400">{t('توزيع استشارات العيادات الخارجية OPD', 'Outpatient clinic distribution')}</p>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b820" />
                <XAxis type="number" stroke="#94a3b8" fontSize={10} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} width={80} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '16px', color: '#fff' }}
                />
                <Bar dataKey="visits" radius={[0, 8, 8, 0]}>
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
