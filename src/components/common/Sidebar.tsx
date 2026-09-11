import React from 'react';
import { useMedSync } from '../../context/MedSyncContext';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  Stethoscope, 
  Calendar, 
  Pill, 
  FlaskConical, 
  Scan, 
  Receipt, 
  BarChart3, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  Building2, 
  Layers, 
  ShieldAlert, 
  CreditCard,
  FileHeart,
  PlusCircle,
  HelpCircle,
  LogOut,
  Activity
} from 'lucide-react';

export const Sidebar: React.FC<{ isMobileOpen?: boolean; onCloseMobile?: () => void }> = ({ 
  isMobileOpen, 
  onCloseMobile 
}) => {
  const {
    currentHospital,
    currentUser,
    activeTab,
    setActiveTab,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    patients,
    appointments,
    medicines,
    labTests,
    t,
    language
  } = useMedSync();

  const isSuperAdmin = currentUser.role === 'super_admin';

  interface NavItem {
    id: string;
    labelAr: string;
    labelEn: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
    alert?: boolean;
    highlight?: boolean;
  }

  // Hospital Navigation Links
  const hospitalNavItems: NavItem[] = [
    { id: 'dashboard', labelAr: 'لوحة القيادة', labelEn: 'Dashboard', icon: LayoutDashboard },
    { id: 'patients', labelAr: 'سجل المرضى (EHR)', labelEn: 'Patients (EHR)', icon: Users, badge: patients.length },
    { id: 'doctors', labelAr: 'الكادر الطبي والعيادات', labelEn: 'Doctors & Clinics', icon: Stethoscope },
    { id: 'appointments', labelAr: 'جدول المواعيد', labelEn: 'Appointments', icon: Calendar, badge: appointments.filter(a => a.status === 'waiting' || a.status === 'confirmed').length },
    { id: 'consultation', labelAr: 'عيادة الكشف السريري', labelEn: 'Clinical Consultation', icon: FileHeart, highlight: true },
    { id: 'pharmacy', labelAr: 'الصيدلية والمخزون', labelEn: 'Pharmacy & Stock', icon: Pill, alert: medicines.some(m => m.status === 'low_stock') },
    { id: 'laboratory', labelAr: 'المختبر والتحاليل', labelEn: 'Laboratory Diagnostics', icon: FlaskConical, badge: labTests.filter(l => l.status === 'pending' || l.status === 'processing').length },
    { id: 'radiology', labelAr: 'الأشعة والتصوير الطبي', labelEn: 'Radiology & Imaging', icon: Scan },
    { id: 'billing', labelAr: 'الفواتير والتأمين', labelEn: 'Billing & Insurance', icon: Receipt },
    { id: 'reports', labelAr: 'التقارير والإحصائيات', labelEn: 'Analytics & Reports', icon: BarChart3 },
    { id: 'settings', labelAr: 'إعدادات المستشفى', labelEn: 'Hospital Settings', icon: Settings }
  ];

  // Super Admin Navigation Links (Dark Corporate)
  const superAdminNavItems: NavItem[] = [
    { id: 'super_dashboard', labelAr: 'الرئيسية العامة للمنصة', labelEn: 'Platform Analytics', icon: LayoutDashboard },
    { id: 'super_hospitals', labelAr: 'دليل المستشفيات (Tenants)', labelEn: 'Hospital Directory', icon: Building2 },
    { id: 'super_plans', labelAr: 'باقات الاشتراكات والأسعار', labelEn: 'Subscription Plans', icon: Layers },
    { id: 'super_revenue', labelAr: 'تحليلات الإيرادات (MRR)', labelEn: 'MRR & Revenue', icon: CreditCard },
    { id: 'super_logs', labelAr: 'سجلات النظام والمطابقة', labelEn: 'Audit Logs & Security', icon: ShieldAlert },
    { id: 'super_support', labelAr: 'مركز الدعم الفني', labelEn: 'Tenant Support', icon: HelpCircle },
    { id: 'settings', labelAr: 'إعدادات النظام العام', labelEn: 'Global Settings', icon: Settings }
  ];

  const currentNavItems = isSuperAdmin ? superAdminNavItems : hospitalNavItems;

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 z-40 flex flex-col h-screen transition-all duration-300 ${
          isSuperAdmin 
            ? 'bg-[#0B1120] text-slate-200 border-r border-slate-800' 
            : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-r border-slate-200 dark:border-slate-800'
        } ${isSidebarCollapsed ? 'w-20' : 'w-68'} ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo & Brand Header */}
        <div className="flex items-center justify-between h-18 px-5 border-b border-slate-200/80 dark:border-slate-800/80">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 shrink-0">
              <Activity className="w-6 h-6 stroke-[2.5]" />
            </div>
            {!isSidebarCollapsed && (
              <div>
                <h1 className="text-lg font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>MedSync</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                    {isSuperAdmin ? 'SUPER' : 'HOSPITAL'}
                  </span>
                </h1>
                <p className="text-[10px] text-slate-400 font-medium truncate max-w-[150px]">
                  {isSuperAdmin ? 'Multi-Tenant SaaS' : (language === 'ar' ? currentHospital?.nameAr : currentHospital?.name)}
                </p>
              </div>
            )}
          </div>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="hidden lg:flex p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isSidebarCollapsed ? (
              language === 'ar' ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
            ) : (
              language === 'ar' ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Quick Action Button */}
        {!isSidebarCollapsed && !isSuperAdmin && (
          <div className="p-4 pb-2">
            <button
              onClick={() => handleTabClick('appointments')}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t('حجز موعد / تسجيل مريض', 'Book Appointment / New Patient')}</span>
            </button>
          </div>
        )}

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          {currentNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                title={isSidebarCollapsed ? (language === 'ar' ? item.labelAr : item.labelEn) : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-bold transition-all relative ${
                  isActive
                    ? isSuperAdmin
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : 'bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400'
                    : isSuperAdmin
                    ? 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                } ${item.highlight && !isActive ? 'ring-1 ring-teal-500/40 text-teal-600 dark:text-teal-400 bg-teal-50/50 dark:bg-teal-950/20' : ''}`}
              >
                <Icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? (isSuperAdmin ? 'text-white' : 'text-blue-600 dark:text-blue-400') : ''}`} />

                {!isSidebarCollapsed && (
                  <span className="flex-1 text-right rtl:text-right ltr:text-left truncate">
                    {language === 'ar' ? item.labelAr : item.labelEn}
                  </span>
                )}

                {/* Badge counters */}
                {!isSidebarCollapsed && item.badge !== undefined && item.badge > 0 && (
                  <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full ${
                    isActive 
                      ? 'bg-white/20 text-white' 
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}>
                    {item.badge}
                  </span>
                )}

                {/* Low Stock or Alert indicator */}
                {item.alert && (
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping absolute right-2 top-3" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer info & Hospital Bed Stats */}
        {!isSidebarCollapsed && !isSuperAdmin && currentHospital && (
          <div className="p-4 m-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              <span>{t('إشغال الأسرة السريرية', 'Bed Occupancy')}</span>
              <span className="text-blue-600 font-extrabold">
                {Math.round((currentHospital.occupiedBeds / currentHospital.bedsCount) * 100)}%
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-600 to-teal-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${(currentHospital.occupiedBeds / currentHospital.bedsCount) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-1.5">
              <span>{currentHospital.occupiedBeds} {t('مشغول', 'Occupied')}</span>
              <span>{currentHospital.bedsCount - currentHospital.occupiedBeds} {t('متاح', 'Available')}</span>
            </div>
          </div>
        )}

        {/* Version info */}
        <div className="p-4 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          {!isSidebarCollapsed && (
            <div>
              <p className="font-semibold text-slate-500 dark:text-slate-400">MedSync SaaS v3.2</p>
              <p className="text-[10px]">HIPAA & CBAHI Ready</p>
            </div>
          )}
          <div className="flex items-center gap-1 text-emerald-500 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            {!isSidebarCollapsed && <span>{t('متصل', 'Online')}</span>}
          </div>
        </div>
      </aside>
    </>
  );
};
