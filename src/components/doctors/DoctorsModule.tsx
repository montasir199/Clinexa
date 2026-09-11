import React, { useState } from 'react';
import { useMedSync } from '../../context/MedSyncContext';
import { Doctor } from '../../types/medsync';
import { 
  Stethoscope, 
  Search, 
  Filter, 
  Clock, 
  Calendar, 
  Star, 
  Phone, 
  Mail, 
  CheckCircle2, 
  AlertCircle, 
  Activity, 
  UserCheck, 
  Plus,
  DoorOpen
} from 'lucide-react';

export const DoctorsModule: React.FC = () => {
  const { doctors, updateDoctorStatus, appointments, setActiveTab, setSelectedConsultationAptId, t, language } = useMedSync();

  const [searchQuery, setSearchQuery] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('all');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const specialties = [
    { id: 'all', nameAr: 'كافة التخصصات', nameEn: 'All Specialties' },
    { id: 'Cardiology', nameAr: 'أمراض القلب', nameEn: 'Cardiology' },
    { id: 'Orthopedics', nameAr: 'جراحة العظام', nameEn: 'Orthopedics' },
    { id: 'Pediatrics', nameAr: 'طب الأطفال', nameEn: 'Pediatrics' },
    { id: 'Neurology', nameAr: 'المخ والأعصاب', nameEn: 'Neurology' },
    { id: 'Internal Medicine', nameAr: 'أمراض الباطنية', nameEn: 'Internal Medicine' },
  ];

  const filteredDoctors = doctors.filter(doc => {
    const matchesSearch = 
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.nameAr.includes(searchQuery) ||
      doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialtyAr.includes(searchQuery);
    const matchesSpecialty = specialtyFilter === 'all' || doc.specialty === specialtyFilter;
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="p-4 sm:p-8 space-y-6 animate-in fade-in duration-200">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <Stethoscope className="w-6 h-6 text-teal-600" />
            <span>{t('الكادر الطبي والاستشاريين', 'Medical Staff & Clinical Consultants')}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {t('إدارة أطباء العيادات، جداول المناوبات، التوفر اللحظي، ومعدلات الأداء السريري', 'Physician schedules, live duty statuses, opd clinics, and clinical performance ratings')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 rounded-2xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-bold text-xs border border-teal-200 dark:border-teal-800">
            {doctors.filter(d => d.status === 'on_duty').length} {t('طبيب مناوب الآن', 'Doctors On Shift Now')}
          </span>
        </div>
      </div>

      {/* 2. Filter & Search Controls */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('ابحث باسم الطبيب أو التخصص...', 'Search doctor by name or specialty...')}
              className="w-full pl-9 pr-4 rtl:pr-9 rtl:pl-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-800 dark:text-slate-100 outline-none focus:border-teal-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {specialties.map(spec => (
              <button
                key={spec.id}
                onClick={() => setSpecialtyFilter(spec.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  specialtyFilter === spec.id
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-500/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {language === 'ar' ? spec.nameAr : spec.nameEn}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Doctors Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {filteredDoctors.map(doc => {
          const docAppointments = appointments.filter(a => a.doctorId === doc.id);
          const activeQueue = docAppointments.filter(a => a.status === 'waiting' || a.status === 'in_progress').length;

          return (
            <div
              key={doc.id}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative group"
            >
              <div>
                {/* Doctor Avatar & Status Ribbon */}
                <div className="flex items-start justify-between mb-3">
                  <div className="relative">
                    <img
                      src={doc.avatar}
                      alt={doc.name}
                      className="w-16 h-16 rounded-2xl object-cover shadow-md border-2 border-white dark:border-slate-800"
                    />
                    <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 ${
                      doc.status === 'on_duty' ? 'bg-emerald-500' : doc.status === 'in_consultation' ? 'bg-amber-500' : 'bg-slate-400'
                    }`} />
                  </div>

                  {/* Status Switcher Dropdown */}
                  <select
                    value={doc.status}
                    onChange={(e) => updateDoctorStatus(doc.id, e.target.value as any)}
                    className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border outline-none ${
                      doc.status === 'on_duty'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800'
                        : doc.status === 'in_consultation'
                        ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800'
                        : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    <option value="on_duty">{t('مناوب (On Duty)', 'On Duty')}</option>
                    <option value="in_consultation">{t('في جلسة كشف', 'In Consultation')}</option>
                    <option value="off_duty">{t('غير متاح (Off)', 'Off Duty')}</option>
                  </select>
                </div>

                {/* Name & Title */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {language === 'ar' ? doc.nameAr : doc.name}
                  </h3>
                  <p className="text-xs text-teal-600 dark:text-teal-400 font-semibold">
                    {language === 'ar' ? doc.specialtyAr : doc.specialty}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{doc.qualifications}</p>
                </div>

                {/* OPD Room & Shift Hours */}
                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                    <DoorOpen className="w-3.5 h-3.5 text-slate-400" />
                    <span>{doc.opdRoom}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{doc.shiftHours}</span>
                  </div>
                </div>

                {/* Stats: Rating & Active Queue */}
                <div className="flex items-center justify-between mt-3 text-xs bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-2xl">
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{doc.rating}</span>
                    <span className="text-[10px] text-slate-400">({doc.patientCountToday} {t('كشوفات', 'today')})</span>
                  </div>

                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                    {activeQueue} {t('في الانتظار', 'waiting')}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    const firstApt = docAppointments.find(a => a.status === 'waiting' || a.status === 'in_progress');
                    if (firstApt) {
                      setSelectedConsultationAptId(firstApt.id);
                    }
                    setActiveTab('consultation');
                  }}
                  className="w-full py-2 rounded-xl bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-600 text-teal-700 dark:text-teal-300 hover:text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Stethoscope className="w-3.5 h-3.5" />
                  <span>{t('دخول عيادة الكشف الطبي', 'Open Examination')}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
