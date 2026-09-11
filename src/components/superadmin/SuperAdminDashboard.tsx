import React, { useState } from 'react';
import { useMedSync } from '../../context/MedSyncContext';
import { HospitalTenant } from '../../types/medsync';
import { 
  Building2, 
  Users, 
  CreditCard, 
  TrendingUp, 
  Activity, 
  MapPin, 
  ShieldCheck, 
  ArrowUpRight, 
  ArrowDownRight, 
  Search, 
  Filter, 
  Plus, 
  Download, 
  MoreVertical, 
  Calendar, 
  Layers, 
  CheckCircle2, 
  AlertTriangle,
  Server,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

export const SuperAdminDashboard: React.FC = () => {
  const { 
    hospitals, 
    addHospital, 
    updateHospitalStatus, 
    subscriptionPlans, 
    auditLogs, 
    setCurrentHospitalId, 
    t, 
    language 
  } = useMedSync();

  const [dateRange, setDateRange] = useState('30d');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddHospitalOpen, setIsAddHospitalOpen] = useState(false);
  const [selectedMapHosp, setSelectedMapHosp] = useState<HospitalTenant | null>(hospitals[0]);

  // Form State for Onboarding New Hospital
  const [newHospName, setNewHospName] = useState('');
  const [newHospNameAr, setNewHospNameAr] = useState('');
  const [newHospCode, setNewHospCode] = useState('');
  const [newHospCity, setNewHospCity] = useState('');
  const [newHospCityAr, setNewHospCityAr] = useState('');
  const [newHospCountry, setNewHospCountry] = useState('Saudi Arabia');
  const [newHospPlan, setNewHospPlan] = useState<'free' | 'basic' | 'pro' | 'enterprise'>('pro');
  const [newHospBeds, setNewHospBeds] = useState(150);
  const [newHospEmail, setNewHospEmail] = useState('');
  const [newHospPhone, setNewHospPhone] = useState('');

  // Aggregated KPIs
  const totalHospitals = hospitals.length;
  const totalPatients = hospitals.reduce((acc, h) => acc + h.activePatients, 0);
  const totalMonthlyRev = hospitals.reduce((acc, h) => acc + h.monthlyRevenue, 0);
  const totalBeds = hospitals.reduce((acc, h) => acc + h.bedsCount, 0);
  const totalOccupied = hospitals.reduce((acc, h) => acc + h.occupiedBeds, 0);
  const avgOccupancy = Math.round((totalOccupied / totalBeds) * 100);

  // Revenue Trend Mock Data
  const revenueChartData = [
    { month: 'Jan', enterprise: 950000, pro: 380000, basic: 110000 },
    { month: 'Feb', enterprise: 1050000, pro: 420000, basic: 115000 },
    { month: 'Mar', enterprise: 1180000, pro: 460000, basic: 120000 },
    { month: 'Apr', enterprise: 1290000, pro: 490000, basic: 125000 },
    { month: 'May', enterprise: 1420000, pro: 530000, basic: 130000 },
    { month: 'Jun', enterprise: 1540000, pro: 570000, basic: 140000 },
    { month: 'Jul', enterprise: 1680000, pro: 610000, basic: 145000 },
    { month: 'Aug', enterprise: 1750000, pro: 640000, basic: 150000 },
    { month: 'Sep', enterprise: totalMonthlyRev, pro: 680000, basic: 165000 },
  ];

  // Performance Comparison Bar Data
  const performanceData = hospitals.map(h => ({
    name: language === 'ar' ? h.nameAr.split(' ')[0] + ' ' + (h.nameAr.split(' ')[1] || '') : h.name.split(' ')[0],
    patients: h.activePatients,
    doctors: h.activeDoctors * 20, // normalized scale for visual comparison
    beds: h.bedsCount
  }));

  // Subscription Distribution Donut Data
  const planCounts = {
    enterprise: hospitals.filter(h => h.planId === 'enterprise').length,
    pro: hospitals.filter(h => h.planId === 'pro').length,
    basic: hospitals.filter(h => h.planId === 'basic').length,
    free: hospitals.filter(h => h.planId === 'free').length,
  };

  const donutData = [
    { name: t('المؤسسات (Enterprise)', 'Enterprise'), value: planCounts.enterprise || 2, color: '#0284C7' },
    { name: t('المستشفيات (Pro)', 'Hospital Pro'), value: planCounts.pro || 2, color: '#0D9488' },
    { name: t('العيادات (Basic)', 'Clinic Basic'), value: planCounts.basic || 1, color: '#8B5CF6' },
    { name: t('المجتمعية (Free)', 'Starter Free'), value: planCounts.free || 0, color: '#64748B' },
  ].filter(d => d.value > 0);

  // Filtered Hospital Leaderboard
  const filteredHospitals = hospitals.filter(h => {
    const matchesSearch = 
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.nameAr.includes(searchQuery) ||
      h.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || h.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateHospital = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHospName || !newHospNameAr) return;

    addHospital({
      name: newHospName,
      nameAr: newHospNameAr,
      code: newHospCode || `HOSP-${Date.now().toString().slice(-4)}`,
      logo: '🏥',
      city: newHospCity || 'Riyadh',
      cityAr: newHospCityAr || 'الرياض',
      country: newHospCountry,
      countryAr: newHospCountry === 'Saudi Arabia' ? 'المملكة العربية السعودية' : newHospCountry,
      lat: 24.7136 + (Math.random() - 0.5) * 4,
      lng: 46.6753 + (Math.random() - 0.5) * 6,
      status: 'active',
      planId: newHospPlan,
      bedsCount: Number(newHospBeds),
      occupiedBeds: Math.floor(Number(newHospBeds) * 0.6),
      activeDoctors: Math.floor(Number(newHospBeds) * 0.2),
      activePatients: Math.floor(Number(newHospBeds) * 4.5),
      monthlyRevenue: newHospPlan === 'enterprise' ? 450000 : newHospPlan === 'pro' ? 220000 : 90000,
      contactEmail: newHospEmail || 'admin@hospital.com',
      phone: newHospPhone || '+966 11 000 0000',
      establishedYear: new Date().getFullYear(),
      accreditations: ['CBAHI Standard', 'ISO 9001']
    });

    setIsAddHospitalOpen(false);
    // Reset
    setNewHospName('');
    setNewHospNameAr('');
    setNewHospCode('');
  };

  return (
    <div className="min-h-screen bg-[#070D18] text-slate-100 p-4 sm:p-8 space-y-8">
      {/* 1. Super Admin Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">
              {t('منظومة الحوسبة السحابية الطبية الموحدة (SaaS Core)', 'Multi-Tenant Cloud Operations Online')}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
            <span>{t('لوحة تحكم المنصة المركزية', 'Super Admin Command Center')}</span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-blue-900/60 text-blue-400 border border-blue-700/60 font-mono">
              GLOBAL NODE
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {t(
              'المراقبة اللحظية لعمليات المستشفيات المشتركة، الإيرادات المتكررة MRR، وإشغال الأسرّة السريرية',
              'Real-time multi-tenant telemetry, Monthly Recurring Revenue (MRR), and clinical bed capacity'
            )}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Date Filter */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-2xl p-1 text-xs font-semibold">
            {['7d', '30d', '90d', '1y'].map(d => (
              <button
                key={d}
                onClick={() => setDateRange(d)}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  dateRange === d ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                {d.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Add Hospital Button */}
          <button
            onClick={() => setIsAddHospitalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>{t('إضافة مستشفى جديد', 'Onboard Hospital')}</span>
          </button>
        </div>
      </div>

      {/* 2. Top Metric KPI Grid (Dark Corporate Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Metric 1: Hospitals */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition-all shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-2xl group-hover:bg-blue-600/20 transition-all" />
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Building2 className="w-6 h-6" />
            </div>
            <span className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ArrowUpRight className="w-3 h-3" />
              +1 Tenant
            </span>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            {t('المستشفيات المسجلة', 'Total Hospital Tenants')}
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-white">{totalHospitals}</h3>
            <span className="text-xs text-slate-400">
              {hospitals.filter(h => h.status === 'active').length} {t('نشط الآن', 'Active')}
            </span>
          </div>
        </div>

        {/* Metric 2: Patients Across Platform */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition-all shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-600/10 rounded-full blur-2xl group-hover:bg-teal-600/20 transition-all" />
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
              <Users className="w-6 h-6" />
            </div>
            <span className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ArrowUpRight className="w-3 h-3" />
              +18.4%
            </span>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            {t('إجمالي ملفات المرضى المدارة', 'Total Patients Managed')}
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-white">{totalPatients.toLocaleString()}</h3>
            <span className="text-xs text-slate-400">{t('سجل إلكتروني', 'EHR Records')}</span>
          </div>
        </div>

        {/* Metric 3: Monthly Recurring Revenue (MRR) */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition-all shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 rounded-full blur-2xl group-hover:bg-purple-600/20 transition-all" />
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <CreditCard className="w-6 h-6" />
            </div>
            <span className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ArrowUpRight className="w-3 h-3" />
              +12.8%
            </span>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            {t('الإيراد الشهري للمنصة (MRR)', 'Monthly Recurring Revenue')}
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-white">
              {(totalMonthlyRev / 1000).toFixed(0)}k SAR
            </h3>
            <span className="text-xs text-slate-400">{t('شهرياً', '/ month')}</span>
          </div>
        </div>

        {/* Metric 4: Bed Capacity & System Uptime */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition-all shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-600/10 rounded-full blur-2xl group-hover:bg-amber-600/20 transition-all" />
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Activity className="w-6 h-6" />
            </div>
            <span className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Server className="w-3 h-3" />
              99.99%
            </span>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            {t('متوسط إشغال الأسرّة السريرية', 'Average Bed Occupancy')}
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-white">{avgOccupancy}%</h3>
            <span className="text-xs text-slate-400">{totalOccupied} / {totalBeds} {t('سرير', 'beds')}</span>
          </div>
        </div>
      </div>

      {/* 3. Interactive Regional Hospital Map & Revenue Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Interactive Regional Hospital Map (2 Cols) */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/80 border border-slate-800/80 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  {t('خريطة انتشار المستشفيات والمنشآت الصحية', 'Hospital Geo-Distribution & Network Map')}
                </h3>
                <p className="text-xs text-slate-400">
                  {t('مواقع المستشفيات التابعة للمنصة ومؤشرات الكفاءة التشغيلية', 'Interactive cloud telemetry across cities & regions')}
                </p>
              </div>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-slate-800 text-slate-300 font-semibold">
              {hospitals.length} {t('مواقع متصلة', 'Connected Hubs')}
            </span>
          </div>

          {/* Map Canvas / Grid Representation */}
          <div className="relative w-full h-80 rounded-2xl bg-[#091222] border border-slate-800 overflow-hidden flex items-center justify-center p-6">
            {/* Background gridlines */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] opacity-40" />

            {/* Stylized Node Cluster representing Hospital Locations */}
            <div className="relative w-full h-full">
              {hospitals.map((h, i) => {
                // Approximate spread for demo display
                const positions = [
                  { top: '35%', left: '45%' }, // Riyadh
                  { top: '28%', left: '60%' }, // Khobar
                  { top: '48%', left: '70%' }, // Dubai
                  { top: '30%', left: '20%' }, // Cairo
                  { top: '55%', left: '55%' }, // Doha
                ];
                const pos = positions[i % positions.length];
                const isSelected = selectedMapHosp?.id === h.id;

                return (
                  <div
                    key={h.id}
                    style={{ top: pos.top, left: pos.left }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all group z-10"
                    onClick={() => setSelectedMapHosp(h)}
                  >
                    {/* Pulsing ring */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      isSelected ? 'ring-4 ring-blue-500 bg-blue-600 text-white scale-125' : 'bg-slate-800/90 border border-slate-600 text-slate-200 hover:scale-110 hover:border-blue-400'
                    }`}>
                      <span className="text-xs">{h.logo}</span>
                    </div>
                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full mb-2 -translate-x-1/2 left-1/2 whitespace-nowrap px-3 py-1.5 rounded-xl bg-slate-950/95 border border-slate-700 text-[11px] text-white shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30">
                      <p className="font-bold">{language === 'ar' ? h.nameAr : h.name}</p>
                      <p className="text-[10px] text-slate-400">{h.city} • {h.occupiedBeds}/{h.bedsCount} {t('سرير', 'beds')}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Hospital Info Floating Overlay */}
            {selectedMapHosp && (
              <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:w-80 p-4 rounded-2xl bg-slate-950/90 border border-slate-700/80 backdrop-blur-md shadow-2xl z-20 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{selectedMapHosp.logo}</span>
                    <div>
                      <h4 className="text-xs font-bold text-white line-clamp-1">
                        {language === 'ar' ? selectedMapHosp.nameAr : selectedMapHosp.name}
                      </h4>
                      <p className="text-[10px] text-slate-400">{selectedMapHosp.cityAr} • {selectedMapHosp.code}</p>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-blue-900/60 text-blue-300 border border-blue-700">
                    {selectedMapHosp.planId}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-[10px] pt-2 border-t border-slate-800">
                  <div className="p-1 rounded-lg bg-slate-900">
                    <p className="text-slate-400">{t('الأطباء', 'Doctors')}</p>
                    <p className="font-bold text-white">{selectedMapHosp.activeDoctors}</p>
                  </div>
                  <div className="p-1 rounded-lg bg-slate-900">
                    <p className="text-slate-400">{t('المرضى', 'Patients')}</p>
                    <p className="font-bold text-teal-400">{selectedMapHosp.activePatients}</p>
                  </div>
                  <div className="p-1 rounded-lg bg-slate-900">
                    <p className="text-slate-400">{t('الأسرّة', 'Beds')}</p>
                    <p className="font-bold text-blue-400">{selectedMapHosp.occupiedBeds}/{selectedMapHosp.bedsCount}</p>
                  </div>
                </div>
                <button
                  onClick={() => setCurrentHospitalId(selectedMapHosp.id)}
                  className="w-full mt-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>{t('دخول إلى لوحة المستشفى', 'Switch to Hospital View')}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right: Subscriptions Donut Breakdown */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/80 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Layers className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-bold text-white">
                {t('توزيع باقات الاشتراكات', 'Subscription Overview')}
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              {t('حصة كل باقة من إجمالي المنشآت الطبية', 'Tier distribution across tenants')}
            </p>

            <div className="h-48 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {donutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0f172a', 
                      borderRadius: '12px', 
                      border: '1px solid #334155',
                      color: '#f8fafc',
                      fontSize: '12px'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-white">{totalHospitals}</span>
                <span className="text-[10px] text-slate-400 uppercase font-bold">{t('منشأة', 'Tenants')}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-slate-800">
            {donutData.map(d => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-slate-300 font-medium">{d.name}</span>
                </div>
                <span className="font-bold text-white">{d.value} {t('مستشفيات', 'hospitals')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Charts: MRR Growth Area Chart & Hospital Performance Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* MRR Revenue Trend Area Chart */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/80 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">
                {t('نمو الإيرادات المتكررة (MRR Analytics)', 'Monthly Recurring Revenue Analytics')}
              </h3>
              <p className="text-xs text-slate-400">
                {t('تحليل الإيرادات المتراكمة عبر باقات الاشتراكات السحابية', 'Cumulative recurring revenue by subscription tier')}
              </p>
            </div>
            <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              +15.2% MoM
            </span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChartData}>
                <defs>
                  <linearGradient id="colorEnterprise" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPro" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" tickLine={false} fontSize={11} />
                <YAxis stroke="#64748b" tickLine={false} fontSize={11} tickFormatter={(val) => `${val / 1000}k`} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    borderRadius: '16px', 
                    border: '1px solid #334155',
                    color: '#f8fafc',
                    fontSize: '12px'
                  }} 
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="enterprise" name="Enterprise Group" stroke="#0284c7" strokeWidth={2} fillOpacity={1} fill="url(#colorEnterprise)" />
                <Area type="monotone" dataKey="pro" name="Hospital Pro" stroke="#0d9488" strokeWidth={2} fillOpacity={1} fill="url(#colorPro)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hospital Performance Comparison Bar Chart */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/80 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">
                {t('مقارنة كفاءة وأداء المستشفيات', 'Hospital Performance Comparison')}
              </h3>
              <p className="text-xs text-slate-400">
                {t('حجم المرضى والقدرة الاستيعابية للأسرّة الطبية', 'Active patient volume vs bed capacity')}
              </p>
            </div>
            <span className="text-xs text-blue-400 font-bold bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
              {t('مقارنة تشغيلية', 'Operational Benchmarks')}
            </span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" tickLine={false} fontSize={10} />
                <YAxis stroke="#64748b" tickLine={false} fontSize={11} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    borderRadius: '16px', 
                    border: '1px solid #334155',
                    color: '#f8fafc',
                    fontSize: '12px'
                  }} 
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="patients" name={t('المرضى المسجلين', 'Active Patients')} fill="#0284c7" radius={[6, 6, 0, 0]} />
                <Bar dataKey="beds" name={t('سعة الأسرّة', 'Total Beds')} fill="#0d9488" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 5. Hospital Directory Table (Top Hospitals Leaderboard) */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/80 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-400" />
              <span>{t('دليل المستشفيات والمنشآت المشتركة (Tenants Directory)', 'Hospital Tenants Leaderboard & Directory')}</span>
            </h3>
            <p className="text-xs text-slate-400">
              {t('إدارة صلاحيات المستشفيات، حالة الخدمة، والاشتراكات الفعالة', 'Manage tenant lifecycle, subscription status, and access keys')}
            </p>
          </div>

          {/* Search & Status Filters */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('ابحث بالاسم أو المدينة...', 'Search by name or city...')}
                className="pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 outline-none focus:border-blue-500 transition-all w-48 sm:w-60"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-blue-500"
            >
              <option value="all">{t('كافة الحالات', 'All Statuses')}</option>
              <option value="active">{t('نشط (Active)', 'Active')}</option>
              <option value="pending">{t('معلق (Pending)', 'Pending')}</option>
              <option value="suspended">{t('موقوف (Suspended)', 'Suspended')}</option>
            </select>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-right rtl:text-right ltr:text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase tracking-wider text-[11px] border-b border-slate-800">
              <tr>
                <th className="p-4">{t('المستشفى / المنشأة', 'Hospital Tenant')}</th>
                <th className="p-4">{t('المدينة والدولة', 'Location')}</th>
                <th className="p-4">{t('الباقة الحالية', 'Subscription')}</th>
                <th className="p-4">{t('الأطباء والمرضى', 'Doctors & Patients')}</th>
                <th className="p-4">{t('إشغال الأسرّة', 'Bed Occupancy')}</th>
                <th className="p-4">{t('الإيراد الشهري', 'MRR Contribution')}</th>
                <th className="p-4">{t('الحالة', 'Status')}</th>
                <th className="p-4 text-center">{t('الإجراءات', 'Actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredHospitals.map((hosp) => {
                const occupancyRate = (hosp?.bedsCount && hosp.bedsCount > 0)
                  ? Math.round(((hosp.occupiedBeds || 0) / hosp.bedsCount) * 100)
                  : 0;
                return (
                  <tr key={hosp.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{hosp.logo}</span>
                        <div>
                          <p className="font-bold text-white text-sm">
                            {language === 'ar' ? hosp.nameAr : hosp.name}
                          </p>
                          <p className="text-[10px] text-slate-400 font-mono">{hosp.code} • {hosp.contactEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-300">
                      <p className="font-bold">{language === 'ar' ? hosp.cityAr : hosp.city}</p>
                      <p className="text-[10px] text-slate-400">{language === 'ar' ? hosp.countryAr : hosp.country}</p>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${
                        hosp.planId === 'enterprise' 
                          ? 'bg-blue-950/80 text-blue-300 border-blue-700' 
                          : hosp.planId === 'pro'
                          ? 'bg-teal-950/80 text-teal-300 border-teal-700'
                          : 'bg-purple-950/80 text-purple-300 border-purple-700'
                      }`}>
                        {hosp.planId}
                      </span>
                    </td>
                    <td className="p-4 text-slate-300">
                      <p><span className="text-white font-bold">{hosp.activeDoctors}</span> {t('طبيب', 'Doctors')}</p>
                      <p className="text-[10px] text-slate-400">{hosp.activePatients.toLocaleString()} {t('مريض', 'Patients')}</p>
                    </td>
                    <td className="p-4">
                      <div className="w-28 space-y-1">
                        <div className="flex justify-between text-[10px] font-bold">
                          <span className="text-slate-400">{hosp.occupiedBeds}/{hosp.bedsCount}</span>
                          <span className="text-blue-400">{occupancyRate}%</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-blue-500 h-full rounded-full" 
                            style={{ width: `${occupancyRate}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-white font-bold">
                      {(hosp.monthlyRevenue).toLocaleString()} SAR
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        hosp.status === 'active' 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : hosp.status === 'pending'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {hosp.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setCurrentHospitalId(hosp.id)}
                          className="px-3 py-1.5 rounded-xl bg-blue-600/80 hover:bg-blue-600 text-white font-bold text-xs transition-colors flex items-center gap-1"
                          title={t('الدخول كمستشفى', 'Access Hospital Portal')}
                        >
                          <span>{t('دخول', 'View')}</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => {
                            const newStatus = hosp.status === 'active' ? 'suspended' : 'active';
                            updateHospitalStatus(hosp.id, newStatus);
                          }}
                          className={`p-1.5 rounded-xl border text-xs transition-colors ${
                            hosp.status === 'active'
                              ? 'border-rose-900/60 text-rose-400 hover:bg-rose-900/40'
                              : 'border-emerald-900/60 text-emerald-400 hover:bg-emerald-900/40'
                          }`}
                          title={hosp.status === 'active' ? t('إيقاف مؤقت', 'Suspend') : t('تفعيل', 'Activate')}
                        >
                          {hosp.status === 'active' ? '⏸️' : '▶️'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. Recent SaaS System Activity & Security Logs */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/80 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {t('سجل النشاطات المركزية والتدقيق الأمني (Audit Trail)', 'Central SaaS Audit Trail & Security Events')}
              </h3>
              <p className="text-xs text-slate-400">
                {t('تسجيل التغييرات الإدارية ومطابقة معايير الأمان وحماية البيانات الطبية', 'Immutable audit logs with actor IP & severity flags')}
              </p>
            </div>
          </div>
          <span className="text-xs text-slate-400">
            {auditLogs.length} {t('سجلات مسجلة', 'events logged')}
          </span>
        </div>

        <div className="divide-y divide-slate-800">
          {auditLogs.slice(0, 5).map(log => (
            <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full shrink-0 ${
                  log.severity === 'critical' ? 'bg-rose-500 ring-2 ring-rose-500/40 animate-ping' : log.severity === 'warning' ? 'bg-amber-400' : 'bg-blue-400'
                }`} />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-white">{log.action}</p>
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 font-mono">
                      {log.module}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px] mt-0.5">{log.details}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-slate-400 text-[11px] font-mono">
                <span>{log.actorName}</span>
                <span>•</span>
                <span>IP: {log.ipAddress}</span>
                <span>•</span>
                <span>{log.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. Modal: Onboard New Hospital Wizard */}
      {isAddHospitalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-blue-600 text-white">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{t('تسجيل مستشفى جديد في المنصة', 'Onboard New Hospital Tenant')}</h3>
                  <p className="text-xs text-slate-400">{t('إنشاء بيئة معزولة مخصصة للمستشفى مع قاعدة بياناتها', 'Provision isolated tenant environment')}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsAddHospitalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateHospital} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">{t('اسم المستشفى (بالعربية)', 'Hospital Name (Arabic)')} *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: مستشفى السلام الدولي"
                    value={newHospNameAr}
                    onChange={(e) => setNewHospNameAr(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">{t('اسم المستشفى (بالإنجليزية)', 'Hospital Name (English)')} *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Al-Salam International Hospital"
                    value={newHospName}
                    onChange={(e) => setNewHospName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">{t('كود المستشفى', 'Tenant Code')}</label>
                  <input
                    type="text"
                    placeholder="SIH-06"
                    value={newHospCode}
                    onChange={(e) => setNewHospCode(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">{t('المدينة (عربي)', 'City (Ar)')}</label>
                  <input
                    type="text"
                    placeholder="جدة"
                    value={newHospCityAr}
                    onChange={(e) => setNewHospCityAr(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">{t('المدينة (EN)', 'City (En)')}</label>
                  <input
                    type="text"
                    placeholder="Jeddah"
                    value={newHospCity}
                    onChange={(e) => setNewHospCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">{t('باقة الاشتراك', 'Subscription Plan')}</label>
                  <select
                    value={newHospPlan}
                    onChange={(e) => setNewHospPlan(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500 font-bold"
                  >
                    <option value="enterprise">Healthcare Enterprise (1,299 USD/mo)</option>
                    <option value="pro">Hospital Professional (599 USD/mo)</option>
                    <option value="basic">Medical Clinic (249 USD/mo)</option>
                    <option value="free">Community Starter (Free)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">{t('سعة الأسرة السريرية', 'Bed Capacity')}</label>
                  <input
                    type="number"
                    value={newHospBeds}
                    onChange={(e) => setNewHospBeds(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">{t('بريد المشرف الرئيسي', 'Admin Email')}</label>
                  <input
                    type="email"
                    placeholder="admin@hospital.com"
                    value={newHospEmail}
                    onChange={(e) => setNewHospEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">{t('رقم الهاتف للتواصل', 'Contact Phone')}</label>
                  <input
                    type="tel"
                    placeholder="+966 12 345 6789"
                    value={newHospPhone}
                    onChange={(e) => setNewHospPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddHospitalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white font-semibold"
                >
                  {t('إلغاء', 'Cancel')}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-lg shadow-blue-600/30"
                >
                  {t('تأكيد وبدء التجهيز السحابي', 'Provision Tenant')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
