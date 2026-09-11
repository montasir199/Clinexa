import React, { useState } from 'react';
import { useMedSync } from '../../context/MedSyncContext';
import { UserRole } from '../../types/medsync';
import { 
  Search, 
  Bell, 
  Globe, 
  Moon, 
  Sun, 
  Building2, 
  ShieldCheck, 
  UserCheck, 
  Stethoscope, 
  ChevronDown, 
  Check, 
  Sparkles,
  ExternalLink,
  PlusCircle,
  Menu,
  HeartPulse
} from 'lucide-react';

export const TopNavbar: React.FC<{ onOpenMobileMenu?: () => void }> = ({ onOpenMobileMenu }) => {
  const {
    language,
    setLanguage,
    isDark,
    setIsDark,
    currentHospital,
    setCurrentHospitalId,
    hospitals,
    currentUser,
    switchUserRole,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setIsGlobalSearchOpen,
    setActiveTab,
    t
  } = useMedSync();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isTenantOpen, setIsTenantOpen] = useState(false);
  const [isRoleOpen, setIsRoleOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const roleOptions: { role: UserRole; titleAr: string; titleEn: string; icon: string }[] = [
    { role: 'super_admin', titleAr: 'المدير العام (Super Admin - Dark)', titleEn: 'Super Admin (Platform Dark)', icon: '👑' },
    { role: 'hospital_admin', titleAr: 'مدير المستشفى (Hospital Admin)', titleEn: 'Hospital Admin', icon: '🏛️' },
    { role: 'doctor', titleAr: 'طبيب استشاري (Consultant Doctor)', titleEn: 'Senior Doctor (EHR)', icon: '🩺' },
    { role: 'receptionist', titleAr: 'مسؤول الاستقبال والمواعيد', titleEn: 'Receptionist / Front Desk', icon: '📋' },
    { role: 'pharmacist', titleAr: 'صيدلي المستشفى (Pharmacy)', titleEn: 'Hospital Pharmacist', icon: '💊' },
    { role: 'nurse', titleAr: 'تمريض وفرز سريري (Nurse)', titleEn: 'Triage / Clinic Nurse', icon: '💉' },
    { role: 'accountant', titleAr: 'المحاسبة والتأمين الطبي', titleEn: 'Accountant & Billing', icon: '💳' },
  ];

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-18 px-4 sm:px-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      {/* Left: Mobile Toggle & Hospital Brand */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 lg:hidden rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Tenant Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setIsTenantOpen(!isTenantOpen);
              setIsRoleOpen(false);
              setIsNotifOpen(false);
            }}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 transition-all border border-slate-200/60 dark:border-slate-700/60 text-slate-800 dark:text-slate-100"
          >
            <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              {currentHospital ? currentHospital.logo : '🌐'}
            </div>
            <div className="text-right rtl:text-right ltr:text-left hidden sm:block">
              <p className="text-xs font-bold leading-tight line-clamp-1 max-w-[170px]">
                {currentHospital 
                  ? (language === 'ar' ? currentHospital.nameAr : currentHospital.name)
                  : t('بوابة إدارة المنصة الشاملة', 'Global Platform Gateway')}
              </p>
              <p className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">
                {currentHospital ? `${currentHospital.cityAr || currentHospital.city} • ${currentHospital.planId.toUpperCase()}` : 'SUPER ADMIN'}
              </p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {/* Tenant Dropdown Menu */}
          {isTenantOpen && (
            <div className="absolute top-full mt-2 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-in fade-in zoom-in-95 duration-150 rtl:right-0 ltr:left-0">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {t('المستشفيات والمنشآت المرتبطة (Multi-Tenant)', 'Connected Hospitals (Multi-Tenant)')}
                </p>
              </div>
              <div className="space-y-1 max-h-60 overflow-y-auto">
                <button
                  onClick={() => {
                    setCurrentHospitalId('all');
                    setIsTenantOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-colors ${
                    !currentHospital
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">👑</span>
                    <div className="text-right rtl:text-right ltr:text-left">
                      <p>{t('لوحة تحكم المنصة المركزية', 'Super Admin Global Hub')}</p>
                      <p className="text-[10px] font-normal text-slate-400">{t('إدارة كل المستشفيات والاشتراكات', 'All Hospitals & Subscriptions')}</p>
                    </div>
                  </div>
                  {!currentHospital && <Check className="w-4 h-4 text-blue-600" />}
                </button>

                {hospitals.map(hosp => (
                  <button
                    key={hosp.id}
                    onClick={() => {
                      setCurrentHospitalId(hosp.id);
                      setIsTenantOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-colors ${
                      currentHospital?.id === hosp.id
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{hosp.logo}</span>
                      <div className="text-right rtl:text-right ltr:text-left">
                        <p>{language === 'ar' ? hosp.nameAr : hosp.name}</p>
                        <p className="text-[10px] font-normal text-slate-400">{hosp.cityAr || hosp.city} • {hosp.bedsCount} {t('سرير', 'beds')}</p>
                      </div>
                    </div>
                    {currentHospital?.id === hosp.id && <Check className="w-4 h-4 text-blue-600" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Center: Search Command Bar Trigger */}
      <div className="hidden md:flex flex-1 max-w-md mx-6">
        <button
          onClick={() => setIsGlobalSearchOpen(true)}
          className="w-full flex items-center justify-between px-4 py-2 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all text-sm group"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
            <span>{t('ابحث عن مريض، موعد، طبيب، دواء...', 'Search patients, appointments, doctors, meds...')}</span>
          </div>
          <kbd className="px-2 py-0.5 text-xs font-semibold bg-white dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-500 shadow-2xs">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Controls: Role Switcher, Language, Dark, Notifications, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Search Button */}
        <button
          onClick={() => setIsGlobalSearchOpen(true)}
          className="p-2 md:hidden rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Role Switcher Pill */}
        <div className="relative">
          <button
            onClick={() => {
              setIsRoleOpen(!isRoleOpen);
              setIsTenantOpen(false);
              setIsNotifOpen(false);
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800/60 text-teal-800 dark:text-teal-300 hover:bg-teal-100/80 transition-all text-xs font-bold"
          >
            <span className="hidden sm:inline">{t('الدور:', 'Role:')}</span>
            <span className="truncate max-w-[120px]">
              {currentUser.role === 'super_admin' && '👑 Super Admin'}
              {currentUser.role === 'hospital_admin' && '🏛️ Hosp Admin'}
              {currentUser.role === 'doctor' && '🩺 Doctor'}
              {currentUser.role === 'receptionist' && '📋 Reception'}
              {currentUser.role === 'pharmacist' && '💊 Pharmacy'}
              {currentUser.role === 'nurse' && '💉 Nurse'}
              {currentUser.role === 'accountant' && '💳 Billing'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-teal-600" />
          </button>

          {isRoleOpen && (
            <div className="absolute top-full mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-in fade-in zoom-in-95 duration-150 rtl:left-0 ltr:right-0">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {t('تبديل صلاحية المستخدم (RBAC Testing)', 'Switch User Role (RBAC Testing)')}
                </p>
              </div>
              <div className="space-y-1">
                {roleOptions.map((opt) => (
                  <button
                    key={opt.role}
                    onClick={() => {
                      switchUserRole(opt.role);
                      setIsRoleOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-medium transition-colors ${
                      currentUser.role === opt.role
                        ? 'bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-bold'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{opt.icon}</span>
                      <span>{language === 'ar' ? opt.titleAr : opt.titleEn}</span>
                    </div>
                    {currentUser.role === opt.role && <Check className="w-3.5 h-3.5 text-teal-600" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notifications Button & Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setIsNotifOpen(!isNotifOpen);
              setIsTenantOpen(false);
              setIsRoleOpen(false);
            }}
            className="relative p-2 rounded-2xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute top-full mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-4 z-50 animate-in fade-in zoom-in-95 duration-150 rtl:left-0 ltr:right-0">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-2">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">{t('مركز الإشعارات الطبية', 'Clinical & System Notifications')}</h4>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 text-xs bg-rose-100 text-rose-700 font-bold rounded-full">
                      {unreadCount} {t('جديد', 'new')}
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-xs text-blue-600 hover:underline font-semibold"
                  >
                    {t('قراءة الكل', 'Mark all read')}
                  </button>
                )}
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto">
                {notifications.map(n => (
                  <div
                    key={n.id}
                    onClick={() => {
                      markNotificationRead(n.id);
                      if (n.linkTab) setActiveTab(n.linkTab);
                      setIsNotifOpen(false);
                    }}
                    className={`p-3 rounded-2xl cursor-pointer transition-colors border ${
                      n.read
                        ? 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800/50 opacity-80'
                        : 'bg-blue-50/40 dark:bg-blue-950/30 border-blue-100 dark:border-blue-900/50'
                    } hover:bg-blue-50/80 dark:hover:bg-slate-800`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-100">
                        {language === 'ar' ? n.titleAr : n.title}
                      </p>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap">{n.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                      {language === 'ar' ? n.messageAr : n.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Language Toggle (AR / EN) */}
        <button
          onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={language === 'ar' ? 'Switch to English' : 'التحويل للعربية'}
        >
          <Globe className="w-4 h-4 text-blue-600" />
          <span>{language === 'ar' ? 'English' : 'عربي'}</span>
        </button>

        {/* Dark Mode Toggle */}
        <button
          onClick={() => setIsDark(!isDark)}
          className="p-2 rounded-2xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={isDark ? 'Light Mode' : 'Dark Mode'}
        >
          {isDark ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4.5 h-4.5" />}
        </button>

        {/* User Profile Avatar */}
        <div className="flex items-center gap-2 pl-1 rtl:pr-1">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-9 h-9 rounded-2xl object-cover border-2 border-blue-500/30 shadow-xs"
          />
          <div className="hidden xl:block text-right rtl:text-right ltr:text-left">
            <p className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight">
              {language === 'ar' ? currentUser.nameAr : currentUser.name}
            </p>
            <p className="text-[10px] text-slate-400">{currentUser.role.replace('_', ' ').toUpperCase()}</p>
          </div>
        </div>
      </div>
    </header>
  );
};
