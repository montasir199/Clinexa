import React from 'react';
import { useMedSync } from '../../context/MedSyncContext';
import { 
  Users, 
  Calendar, 
  Activity, 
  Stethoscope, 
  BedDouble, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownRight, 
  Plus, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  ChevronRight, 
  UserPlus, 
  FilePlus, 
  Receipt, 
  Pill, 
  TrendingUp,
  Sparkles,
  HeartPulse
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
  ResponsiveContainer 
} from 'recharts';

export const HospitalDashboard: React.FC = () => {
  const { 
    currentHospital, 
    currentUser, 
    patients, 
    doctors, 
    appointments, 
    invoices, 
    setActiveTab, 
    setSelectedConsultationAptId,
    updateAppointmentStatus,
    t, 
    language 
  } = useMedSync();

  // Metrics for Hospital
  const totalHospitalPatients = patients.length;
  const todayAppointments = appointments.filter(a => a.date === new Date().toISOString().split('T')[0] || a.status === 'waiting' || a.status === 'in_progress');
  const onDutyDoctors = doctors.filter(d => d.status === 'on_duty').length;
  const totalBeds = currentHospital?.bedsCount || 200;
  const occupiedBeds = currentHospital?.occupiedBeds || 142;
  const bedOccupancyRate = Math.round((occupiedBeds / totalBeds) * 100);
  const totalRevenue = invoices.reduce((acc, inv) => acc + (inv.status === 'paid' ? inv.subtotal : 0), 0);

  // Weekly Patient Visits Chart Data
  const weeklyVisitsData = [
    { day: t('السبت', 'Sat'), visits: 142, emergency: 28 },
    { day: t('الأحد', 'Sun'), visits: 185, emergency: 34 },
    { day: t('الاثنين', 'Mon'), visits: 220, emergency: 45 },
    { day: t('الثلاثاء', 'Tue'), visits: 198, emergency: 30 },
    { day: t('الأربعاء', 'Wed'), visits: 215, emergency: 40 },
    { day: t('الخميس', 'Thu'), visits: 240, emergency: 52 },
    { day: t('الجمعة', 'Fri'), visits: 95, emergency: 60 },
  ];

  // Department Distribution Donut Data
  const departmentData = [
    { name: t('القلب والأوعية', 'Cardiology'), value: 35, color: '#0ea5e9' },
    { name: t('العظام والمفاصل', 'Orthopedics'), value: 25, color: '#14b8a6' },
    { name: t('طب الأطفال', 'Pediatrics'), value: 20, color: '#8b5cf6' },
    { name: t('الباطنية والغدد', 'Internal Med'), value: 12, color: '#f59e0b' },
    { name: t('الأنف والأذن', 'ENT & General'), value: 8, color: '#ec4899' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in_progress':
        return <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 animate-pulse">{t('قيد الكشف', 'In Progress')}</span>;
      case 'waiting':
        return <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">{t('في الانتظار', 'Waiting')}</span>;
      case 'confirmed':
        return <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">{t('مؤكد', 'Confirmed')}</span>;
      case 'completed':
        return <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">{t('مكتمل', 'Completed')}</span>;
      default:
        return <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">{t('ملغي', 'Cancelled')}</span>;
    }
  };

  return (
    <div className="p-4 sm:p-8 space-y-8 animate-in fade-in duration-200">
      {/* 1. Welcome & Quick Hospital Status Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-700 via-blue-600 to-teal-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-blue-500/15 relative overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold tracking-wide uppercase">
              {currentHospital ? (language === 'ar' ? currentHospital.nameAr : currentHospital.name) : 'MedSync Portal'}
            </span>
            <span className="text-xs text-blue-100 font-mono">
              {new Date().toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            {t('أهلاً بك دكتور', 'Welcome back,')} {language === 'ar' ? currentUser.nameAr : currentUser.name}
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
            {t(
              'النظام الطبي يعمل بكفاءة كاملة. هناك 3 مرضى في صالة انتظار العيادة، ومعدل إشغال الأسرّة السريرية مستقر.',
              'Clinical systems operating normally. 3 patients currently waiting in OPD queue, bed occupancy stable.'
            )}
          </p>
        </div>

        {/* Quick Direct Actions on Header */}
        <div className="relative z-10 flex items-center gap-3 flex-wrap">
          <button
            onClick={() => setActiveTab('patients')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white text-blue-700 font-bold text-xs shadow-lg hover:bg-blue-50 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <UserPlus className="w-4 h-4 text-blue-600" />
            <span>{t('تسجيل مريض جديد', 'Register Patient')}</span>
          </button>
          <button
            onClick={() => setActiveTab('consultation')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-teal-500 hover:bg-teal-400 text-white font-bold text-xs shadow-lg shadow-teal-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <HeartPulse className="w-4 h-4" />
            <span>{t('دخول عيادة الكشف', 'Open Consultation')}</span>
          </button>
        </div>
      </div>

      {/* 2. Primary KPI Cards (Soft corporate shadows, crisp borders) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Card 1: Total Patients */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
              <Users className="w-5 h-5" />
            </div>
            <span className="flex items-center text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded-full">
              <ArrowUpRight className="w-3 h-3" /> +14%
            </span>
          </div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{t('إجمالي المرضى', 'Total Patients')}</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{totalHospitalPatients}</p>
        </div>

        {/* Card 2: Today Appointments */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.5 rounded-full">
              {todayAppointments.filter(a => a.status === 'in_progress').length} {t('نشط', 'Active')}
            </span>
          </div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{t('مواعيد اليوم', 'Today Appts')}</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{todayAppointments.length}</p>
        </div>

        {/* Card 3: Surgeries / Critical */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
              <Activity className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/60 px-1.5 py-0.5 rounded-full">
              ICU: 6
            </span>
          </div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{t('حالات حرجة / طوارئ', 'Critical & ICU')}</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">9</p>
        </div>

        {/* Card 4: On-Duty Doctors */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
              <Stethoscope className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-teal-600 bg-teal-50 dark:bg-teal-950/60 px-1.5 py-0.5 rounded-full">
              {t('مناوب', 'Shift')}
            </span>
          </div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{t('الأطباء المناوبين', 'On-Duty Doctors')}</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{onDutyDoctors}</p>
        </div>

        {/* Card 5: Bed Occupancy */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <BedDouble className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 rounded-full">
              {bedOccupancyRate}%
            </span>
          </div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{t('إشغال الأسرّة', 'Bed Occupancy')}</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {occupiedBeds}<span className="text-xs font-normal text-slate-400">/{totalBeds}</span>
          </p>
        </div>

        {/* Card 6: Revenue Today */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <CreditCard className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded-full">
              SAR
            </span>
          </div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{t('الإيراد المحصل', 'Collected Today')}</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {(totalRevenue / 1000).toFixed(1)}k
          </p>
        </div>
      </div>

      {/* 3. Charts Section (Weekly Patient Visits & Department Donut) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Visits Line/Area Chart (2 Cols) */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {t('حركة المرضى الأسبوعية (Weekly Patient Visits)', 'Weekly Patient Census & Visits')}
              </h3>
              <p className="text-xs text-slate-400">
                {t('مقارنة بين كشوفات العيادات الخارجية وحالات الطوارئ السريعة', 'OPD Consultations vs Emergency Admissions')}
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-bold">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                <span className="text-slate-600 dark:text-slate-300">{t('عيادات OPD', 'OPD Clinics')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="text-slate-600 dark:text-slate-300">{t('طوارئ ER', 'Emergency')}</span>
              </div>
            </div>
          </div>

          <div className="h-68 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyVisitsData}>
                <defs>
                  <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorEmergency" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} vertical={false} />
                <XAxis dataKey="day" stroke="#94a3b8" tickLine={false} fontSize={11} />
                <YAxis stroke="#94a3b8" tickLine={false} fontSize={11} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    borderRadius: '16px', 
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px'
                  }} 
                />
                <Area type="monotone" dataKey="visits" name={t('العيادات الخارجية', 'OPD Visits')} stroke="#0284c7" strokeWidth={2.5} fillOpacity={1} fill="url(#colorVisits)" />
                <Area type="monotone" dataKey="emergency" name={t('طوارئ', 'Emergency')} stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorEmergency)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Distribution Donut Chart (1 Col) */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {t('توزيع المرضى حسب الأقسام', 'Department Distribution')}
            </h3>
            <p className="text-xs text-slate-400 mb-2">
              {t('نسبة المراجعين عبر التخصصات الطبية', 'Patient allocation across medical specialties')}
            </p>

            <div className="h-44 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={68}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-black text-slate-800 dark:text-white">100%</span>
                <span className="text-[9px] text-slate-400 uppercase font-bold">{t('الاستيعاب', 'Capacity')}</span>
              </div>
            </div>
          </div>

          <div className="space-y-1.5 pt-3 border-t border-slate-100 dark:border-slate-800">
            {departmentData.map(d => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-slate-600 dark:text-slate-300 font-medium">{d.name}</span>
                </div>
                <span className="font-bold text-slate-800 dark:text-slate-100">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Lower Grid: Today's Appointments & Active Doctors Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Today's Appointments Table (2 Cols) */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>{t('طابور مواعيد العيادات اليوم', "Today's Clinical Queue")}</span>
              </h3>
              <p className="text-xs text-slate-400">
                {t('قائمة المرضى المنتظرين في العيادات مع التحديث اللحظي للحالة', 'Live OPD waiting list with one-click consultation entry')}
              </p>
            </div>
            <button
              onClick={() => setActiveTab('appointments')}
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              <span>{t('عرض كل المواعيد', 'View All Appointments')}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right rtl:text-right ltr:text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 font-bold uppercase tracking-wider text-[10px] rounded-xl">
                <tr>
                  <th className="p-3">{t('المريض', 'Patient')}</th>
                  <th className="p-3">{t('الطبيب والعيادة', 'Doctor & OPD')}</th>
                  <th className="p-3">{t('الوقت والنوع', 'Time & Type')}</th>
                  <th className="p-3">{t('الحالة', 'Status')}</th>
                  <th className="p-3 text-center">{t('الإجراء السريري', 'Clinical Action')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {appointments.slice(0, 5).map(apt => (
                  <tr key={apt.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-3">
                      <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                        {language === 'ar' ? apt.patientNameAr : apt.patientName}
                      </p>
                      <p className="text-[10px] text-slate-400">{apt.patientMrn}</p>
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-300">
                      <p className="font-bold">{language === 'ar' ? apt.doctorNameAr : apt.doctorName}</p>
                      <p className="text-[10px] text-slate-400">{language === 'ar' ? apt.departmentAr : apt.department}</p>
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-300">
                      <p className="font-bold">{apt.time}</p>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">{apt.type}</span>
                    </td>
                    <td className="p-3">
                      {getStatusBadge(apt.status)}
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedConsultationAptId(apt.id);
                            setActiveTab('consultation');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm transition-all"
                        >
                          {t('بدء الكشف', 'Examine')}
                        </button>
                        {apt.status === 'waiting' && (
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'in_progress')}
                            className="p-1.5 rounded-xl border border-teal-200 text-teal-600 hover:bg-teal-50 text-xs font-bold"
                            title={t('إدخال إلى غرفة الطبيب', 'Call Patient')}
                          >
                            🔔
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: On-Duty Active Doctors (1 Col) */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-teal-600" />
                <span>{t('الأطباء المناوبون اليوم', 'Doctors On Shift')}</span>
              </h3>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300 font-bold">
                {onDutyDoctors} {t('طبيب', 'Active')}
              </span>
            </div>

            <div className="space-y-3">
              {doctors.slice(0, 4).map(doc => (
                <div key={doc.id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img src={doc.avatar} alt={doc.name} className="w-10 h-10 rounded-2xl object-cover" />
                      <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 ${
                        doc.status === 'on_duty' ? 'bg-emerald-500' : doc.status === 'in_consultation' ? 'bg-amber-500' : 'bg-slate-400'
                      }`} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        {language === 'ar' ? doc.nameAr : doc.name}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {language === 'ar' ? doc.specialtyAr : doc.specialty} • {doc.opdRoom}
                      </p>
                    </div>
                  </div>
                  <div className="text-right rtl:text-right ltr:text-left">
                    <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 block">{doc.shiftHours}</span>
                    <span className="text-[9px] text-slate-400">{doc.patientCountToday} {t('كشف', 'seen')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('doctors')}
            className="w-full py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            {t('عرض جدول مناوبات الأطباء', 'View Full Duty Schedule')}
          </button>
        </div>
      </div>
    </div>
  );
};
