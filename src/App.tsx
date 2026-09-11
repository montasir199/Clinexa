import React, { useState } from 'react';
import { MedSyncProvider, useMedSync } from './context/MedSyncContext';
import { Sidebar } from './components/common/Sidebar';
import { TopNavbar } from './components/common/TopNavbar';
import { CommandPalette } from './components/common/CommandPalette';
import { ToastContainer } from './components/common/ToastContainer';
import { DocumentPrintModal } from './components/common/DocumentPrintModal';

// Dashboards
import { SuperAdminDashboard } from './components/superadmin/SuperAdminDashboard';
import { HospitalDashboard } from './components/hospital/HospitalDashboard';

// Clinical & Operational Modules
import { PatientsModule } from './components/patients/PatientsModule';
import { DoctorsModule } from './components/doctors/DoctorsModule';
import { AppointmentsModule } from './components/appointments/AppointmentsModule';
import { ConsultationRoom } from './components/consultation/ConsultationRoom';
import { PharmacyModule } from './components/pharmacy/PharmacyModule';
import { LaboratoryModule } from './components/laboratory/LaboratoryModule';
import { RadiologyModule } from './components/radiology/RadiologyModule';
import { BillingModule } from './components/billing/BillingModule';
import { ReportsModule } from './components/reports/ReportsModule';
import { AuditLogsModule } from './components/audit/AuditLogsModule';

// Simple Settings Sub-View
import { Settings, Shield, Building2, Bell, Key, Save } from 'lucide-react';

const SettingsView: React.FC = () => {
  const { currentHospital, currentUser, t, language } = useMedSync();

  return (
    <div className="p-4 sm:p-8 space-y-6 animate-in fade-in duration-200 max-w-5xl mx-auto">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <Settings className="w-6 h-6 text-teal-600" />
            <span>{t('إعدادات النظام والمنشأة الطبية', 'Hospital & System Configuration')}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {t('تخصيص بيانات المستشفى، سياسات الأمان، وقواعد الفوترة الإلكترونية', 'General preferences, security protocols, and e-health parameters')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hospital Profile Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-4 h-4 text-teal-600" />
            <span>{t('بيانات المستشفى أو المركز الطبي', 'Hospital Organization Profile')}</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-500 font-bold mb-1">{t('اسم المستشفى (العربية)', 'Hospital Name (Arabic)')}</label>
              <input
                type="text"
                defaultValue={currentHospital?.nameAr}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-bold"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">{t('اسم المستشفى (English)', 'Hospital Name (English)')}</label>
              <input
                type="text"
                defaultValue={currentHospital?.nameEn}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-bold"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-500 font-bold mb-1">{t('المدينة والمنطقة', 'City')}</label>
                <input
                  type="text"
                  defaultValue={currentHospital?.city}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-500 font-bold mb-1">{t('الرقم الضريبي VAT', 'Tax VAT ID')}</label>
                <input
                  type="text"
                  defaultValue="300482910400003"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Security & Access Controls */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>{t('سياسات الأمان والمصادقة', 'Security & Access Controls')}</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800">
              <div>
                <p className="font-bold text-slate-800 dark:text-white">{t('المصادقة الثنائية (2FA)', 'Two-Factor Authentication')}</p>
                <p className="text-[11px] text-slate-400">{t('إلزام الأطباء والإداريين بتأكيد الدخول عبر SMS/OTP', 'Require OTP for clinical access')}</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                {t('مفعل', 'Enabled')}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800">
              <div>
                <p className="font-bold text-slate-800 dark:text-white">{t('عزل قاعدة البيانات (Tenant Isolation)', 'Row-Level Isolation')}</p>
                <p className="text-[11px] text-slate-400">PostgreSQL RLS strict multi-tenant boundary</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">
                Active
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800">
              <div>
                <p className="font-bold text-slate-800 dark:text-white">{t('تشفير الملفات الطبية EHR', 'EHR Storage Encryption')}</p>
                <p className="text-[11px] text-slate-400">AES-256 GCM cloud at rest encryption</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700">
                HIPAA / ZATCA
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MainContent: React.FC = () => {
  const { activeTab, currentUser } = useMedSync();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const renderActiveModule = () => {
    // If user is super admin and on super views
    if (currentUser.role === 'super_admin') {
      switch (activeTab) {
        case 'super_dashboard':
        case 'super_hospitals':
        case 'super_plans':
        case 'super_revenue':
        case 'super_support':
          return <SuperAdminDashboard />;
        case 'super_logs':
        case 'audit_logs':
          return <AuditLogsModule />;
        case 'settings':
          return <SettingsView />;
        default:
          return <SuperAdminDashboard />;
      }
    }

    // Hospital Staff / Doctor / Admin Views
    switch (activeTab) {
      case 'dashboard':
        return <HospitalDashboard />;
      case 'patients':
        return <PatientsModule />;
      case 'doctors':
        return <DoctorsModule />;
      case 'appointments':
        return <AppointmentsModule />;
      case 'consultation':
        return <ConsultationRoom />;
      case 'pharmacy':
        return <PharmacyModule />;
      case 'laboratory':
        return <LaboratoryModule />;
      case 'radiology':
        return <RadiologyModule />;
      case 'billing':
        return <BillingModule />;
      case 'reports':
        return <ReportsModule />;
      case 'audit_logs':
        return <AuditLogsModule />;
      case 'settings':
        return <SettingsView />;
      default:
        return <HospitalDashboard />;
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 font-sans transition-colors">
      {/* 1. Collapsible & Responsive Sidebar */}
      <Sidebar 
        isMobileOpen={isMobileSidebarOpen} 
        onCloseMobile={() => setIsMobileSidebarOpen(false)} 
      />

      {/* 2. Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navigation Bar */}
        <TopNavbar onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)} />

        {/* Dynamic Route Content */}
        <main className="flex-1 overflow-y-auto pb-12">
          {renderActiveModule()}
        </main>
      </div>

      {/* Global Interactive Modals & Telemetry */}
      <CommandPalette />
      <ToastContainer />
      <DocumentPrintModal />
    </div>
  );
};

export default function App() {
  return (
    <MedSyncProvider>
      <MainContent />
    </MedSyncProvider>
  );
}
