import React, { useState } from 'react';
import { useMedSync } from '../../context/MedSyncContext';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  Lock, 
  UserCheck, 
  Key, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  Server,
  Terminal,
  Activity
} from 'lucide-react';

export const AuditLogsModule: React.FC = () => {
  const { auditLogs, t, language } = useMedSync();

  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = 
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.ipAddress.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAction = actionFilter === 'all' || log.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  return (
    <div className="p-4 sm:p-8 space-y-6 animate-in fade-in duration-200">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
            <span>{t('سجلات الأمان والتدقيق الشامل (Security & Audit Logs)', 'System Audit & Compliance Trails')}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {t('تتبع غير قابل للتعديل لجميع العمليات الحساسة، فتح الملفات الطبية، والتحصيل المالي', 'Immutable audit trails for EHR access, prescription dispensing, and administrative events')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-xs border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-4 h-4" />
            <span>HIPAA & ZATCA Compliant</span>
          </span>
        </div>
      </div>

      {/* 2. Security Posture Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">{t('عزل البيانات (Multi-Tenant)', 'Tenant Isolation')}</span>
            <Lock className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-lg font-black text-emerald-600 mt-2">RLS Active (Strict)</p>
          <span className="text-[11px] text-slate-400 block mt-1">Tenant ID isolation enforced</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">{t('تشفير السجلات الطبية', 'EHR Encryption')}</span>
            <Key className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-lg font-black text-blue-600 mt-2">AES-256 GCM</p>
          <span className="text-[11px] text-slate-400 block mt-1">At rest & in transit (TLS 1.3)</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">{t('الجلسات النشطة للمستخدمين', 'Active Sessions')}</span>
            <UserCheck className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">128</p>
          <span className="text-[11px] text-emerald-600 font-bold block mt-1">0 Suspicious Logins</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">{t('النسخ الاحتياطي السحابي', 'Cloud Backup')}</span>
            <Server className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-lg font-black text-purple-600 mt-2">{t('مكتمل قبل 14 دقيقة', 'Healthy (14m ago)')}</p>
          <span className="text-[11px] text-slate-400 block mt-1">Automated Point-in-time recovery</span>
        </div>
      </div>

      {/* 3. Filter and Search */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('ابحث بالمستخدم، الإجراء، أو التفاصيل...', 'Search user, action, or IP address...')}
            className="w-full pl-9 pr-4 rtl:pr-9 rtl:pl-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-800 dark:text-slate-100 outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {['all', 'CONSULTATION_SAVE', 'MEDICINE_DISPENSED', 'LAB_RESULT_VERIFIED', 'INVOICE_GENERATED', 'USER_LOGIN'].map((act) => (
            <button
              key={act}
              onClick={() => setActionFilter(act)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono whitespace-nowrap transition-all ${
                actionFilter === act
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {act === 'all' ? t('كافة السجلات', 'All Logs') : act}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Immutable Audit Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden font-mono text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-right rtl:text-right ltr:text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-200/80 dark:border-slate-800">
              <tr>
                <th className="p-4">{t('الوقت والختم الزمني', 'Timestamp')}</th>
                <th className="p-4">{t('نوع العملية', 'Action Type')}</th>
                <th className="p-4">{t('المستخدم والدور', 'Actor & Role')}</th>
                <th className="p-4">{t('تفاصيل السجل', 'Event Details')}</th>
                <th className="p-4">{t('عنوان IP', 'Client IP')}</th>
                <th className="p-4">{t('النتيجة', 'Outcome')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 text-slate-500 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-[10px]">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-slate-900 dark:text-white font-sans">{log.actorName}</p>
                    <p className="text-[10px] text-teal-600 dark:text-teal-400 uppercase">{log.actorRole}</p>
                  </td>
                  <td className="p-4 text-slate-700 dark:text-slate-300 font-sans max-w-xs truncate" title={log.details}>
                    {log.details}
                  </td>
                  <td className="p-4 text-slate-500">
                    {log.ipAddress}
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                      SUCCESS
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
