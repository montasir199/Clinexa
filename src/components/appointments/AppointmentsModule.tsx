import React, { useState } from 'react';
import { useMedSync } from '../../context/MedSyncContext';
import { Appointment } from '../../types/medsync';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Search, 
  Filter, 
  User, 
  Stethoscope, 
  CheckCircle2, 
  AlertCircle, 
  DoorOpen, 
  ChevronLeft, 
  ChevronRight,
  List,
  CalendarDays
} from 'lucide-react';

export const AppointmentsModule: React.FC = () => {
  const { 
    appointments, 
    bookAppointment, 
    updateAppointmentStatus, 
    patients, 
    doctors, 
    setActiveTab, 
    setSelectedConsultationAptId, 
    t, 
    language 
  } = useMedSync();

  const [viewMode, setViewMode] = useState<'table' | 'schedule'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);

  // Booking Form State
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || '');
  const [selectedDoctorId, setSelectedDoctorId] = useState(doctors[0]?.id || '');
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
  const [bookingTime, setBookingTime] = useState('10:30 AM');
  const [appointmentType, setAppointmentType] = useState<'consultation' | 'follow_up' | 'emergency' | 'routine'>('consultation');
  const [chiefComplaint, setChiefComplaint] = useState('');

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = 
      apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.patientNameAr.includes(searchQuery) ||
      apt.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.doctorNameAr.includes(searchQuery) ||
      apt.patientMrn.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const pat = patients.find(p => p.id === selectedPatientId);
    const doc = doctors.find(d => d.id === selectedDoctorId);
    if (!pat || !doc) return;

    bookAppointment({
      hospitalId: 'hosp-1',
      patientId: pat.id,
      patientName: pat.name,
      patientNameAr: pat.nameAr,
      patientMrn: pat.mrn,
      doctorId: doc.id,
      doctorName: doc.name,
      doctorNameAr: doc.nameAr,
      department: doc.specialty,
      departmentAr: doc.specialtyAr,
      opdRoom: doc.opdRoom,
      date: bookingDate,
      time: bookingTime,
      type: appointmentType,
      status: 'confirmed',
      notes: chiefComplaint || 'Routine medical check-up and evaluation'
    });

    setIsBookModalOpen(false);
  };

  const getStatusBadge = (status: Appointment['status']) => {
    switch (status) {
      case 'in_consultation':
        return <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 animate-pulse">{t('قيد الكشف', 'In Consultation')}</span>;
      case 'waiting':
        return <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">{t('في صالة الانتظار', 'Waiting')}</span>;
      case 'confirmed':
        return <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">{t('مؤكد', 'Confirmed')}</span>;
      case 'completed':
        return <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">{t('مكتمل', 'Completed')}</span>;
      default:
        return <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">{t('ملغي', 'Cancelled')}</span>;
    }
  };

  return (
    <div className="p-4 sm:p-8 space-y-6 animate-in fade-in duration-200">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <Calendar className="w-6 h-6 text-blue-600" />
            <span>{t('إدارة جدول المواعيد والعيادات', 'Appointments & OPD Scheduling')}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {t('تنظيم مواعيد الكشوفات، إدارة طابور الانتظار، واستدعاء المرضى للعيادة', 'Comprehensive booking, queue telemetry, and appointment statuses')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                viewMode === 'table' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs' : 'text-slate-500'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>{t('جدول', 'List')}</span>
            </button>
            <button
              onClick={() => setViewMode('schedule')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                viewMode === 'schedule' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs' : 'text-slate-500'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>{t('الجدول الزمني', 'Timeline')}</span>
            </button>
          </div>

          <button
            onClick={() => setIsBookModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>{t('حجز موعد جديد', 'Book Appointment')}</span>
          </button>
        </div>
      </div>

      {/* 2. Filters & Search */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('ابحث بالمريض أو الطبيب أو رقم الملف...', 'Search patient, doctor, or MRN...')}
            className="w-full pl-9 pr-4 rtl:pr-9 rtl:pl-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-800 dark:text-slate-100 outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {['all', 'waiting', 'in_consultation', 'confirmed', 'completed', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize whitespace-nowrap transition-all ${
                statusFilter === status
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {status === 'all' ? t('الكل', 'All') : status.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* 3. View: Table Mode */}
      {viewMode === 'table' ? (
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right rtl:text-right ltr:text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200/80 dark:border-slate-800">
                <tr>
                  <th className="p-4">{t('المريض ورقم الملف', 'Patient & MRN')}</th>
                  <th className="p-4">{t('الطبيب والعيادة', 'Doctor & OPD')}</th>
                  <th className="p-4">{t('التاريخ والوقت', 'Date & Time')}</th>
                  <th className="p-4">{t('نوع الكشف', 'Type')}</th>
                  <th className="p-4">{t('الحالة', 'Status')}</th>
                  <th className="p-4 text-center">{t('الإجراء السريري', 'Clinical Actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {filteredAppointments.map(apt => (
                  <tr key={apt.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-slate-900 dark:text-white text-sm">
                        {language === 'ar' ? apt.patientNameAr : apt.patientName}
                      </p>
                      <p className="text-[10px] text-blue-600 dark:text-blue-400 font-mono font-bold">{apt.patientMrn}</p>
                    </td>
                    <td className="p-4 text-slate-700 dark:text-slate-300">
                      <p className="font-bold">{language === 'ar' ? apt.doctorNameAr : apt.doctorName}</p>
                      <p className="text-[10px] text-slate-400">{language === 'ar' ? apt.departmentAr : apt.department} • {apt.opdRoom}</p>
                    </td>
                    <td className="p-4 text-slate-700 dark:text-slate-300 font-mono">
                      <p className="font-bold">{apt.time}</p>
                      <p className="text-[10px] text-slate-400">{apt.date}</p>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {apt.type}
                      </span>
                    </td>
                    <td className="p-4">
                      {getStatusBadge(apt.status)}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedConsultationAptId(apt.id);
                            setActiveTab('consultation');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-xs transition-colors"
                        >
                          {t('بدء الكشف السريري', 'Consultation Desk')}
                        </button>

                        <select
                          value={apt.status}
                          onChange={(e) => updateAppointmentStatus(apt.id, e.target.value as any)}
                          className="px-2 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] font-bold outline-none text-slate-700 dark:text-slate-300"
                        >
                          <option value="confirmed">{t('مؤكد', 'Confirmed')}</option>
                          <option value="waiting">{t('في الانتظار', 'Waiting')}</option>
                          <option value="in_consultation">{t('قيد الكشف', 'In Consultation')}</option>
                          <option value="completed">{t('مكتمل', 'Completed')}</option>
                          <option value="cancelled">{t('إلغاء', 'Cancel')}</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* 4. View: Timeline / Schedule Mode */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAppointments.map(apt => (
            <div key={apt.id} className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2 font-mono text-blue-600 font-bold text-sm">
                  <Clock className="w-4 h-4" />
                  <span>{apt.time}</span>
                </div>
                {getStatusBadge(apt.status)}
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {language === 'ar' ? apt.patientNameAr : apt.patientName}
                </h4>
                <p className="text-xs text-slate-400 font-mono">{apt.patientMrn}</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                <p><strong>{t('الطبيب:', 'Doctor:')}</strong> {language === 'ar' ? apt.doctorNameAr : apt.doctorName}</p>
                <p><strong>{t('العيادة:', 'Clinic:')}</strong> {apt.opdRoom} ({language === 'ar' ? apt.departmentAr : apt.department})</p>
                {apt.notes && <p className="text-[11px] text-slate-400 italic">"{apt.notes}"</p>}
              </div>

              <button
                onClick={() => {
                  setSelectedConsultationAptId(apt.id);
                  setActiveTab('consultation');
                }}
                className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors"
              >
                {t('فتح الكشف الطبي', 'Open Consultation Desk')}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 5. Booking Modal */}
      {isBookModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-blue-600 text-white">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t('حجز موعد جديد', 'Book New Clinical Appointment')}</h3>
                  <p className="text-xs text-slate-400">{t('إدراج المريض في جدول عيادة الطبيب المختص', 'Schedule patient visit in OPD clinic')}</p>
                </div>
              </div>
              <button onClick={() => setIsBookModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreateBooking} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">{t('اختر المريض', 'Select Patient')} *</label>
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500 font-bold"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>
                      {language === 'ar' ? p.nameAr : p.name} ({p.mrn}) - {p.phone}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">{t('اختر الطبيب المعالج والعيادة', 'Select Physician & Clinic')} *</label>
                <select
                  value={selectedDoctorId}
                  onChange={(e) => setSelectedDoctorId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500 font-bold"
                >
                  {doctors.map(d => (
                    <option key={d.id} value={d.id}>
                      {language === 'ar' ? d.nameAr : d.name} - {language === 'ar' ? d.specialtyAr : d.specialty} ({d.opdRoom})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">{t('تاريخ الموعد', 'Appointment Date')} *</label>
                  <input
                    type="date"
                    required
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">{t('الوقت المختار', 'Preferred Time')} *</label>
                  <input
                    type="text"
                    required
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    placeholder="10:30 AM"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">{t('نوع الزيارة', 'Visit Classification')}</label>
                <select
                  value={appointmentType}
                  onChange={(e) => setAppointmentType(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500 font-bold"
                >
                  <option value="consultation">{t('كشف استشاري لأول مرة (Consultation)', 'New Consultation')}</option>
                  <option value="follow_up">{t('متابعة وإعادة كشف (Follow-up)', 'Follow-up')}</option>
                  <option value="routine">{t('فحص دوري روتيني (Routine)', 'Routine Check')}</option>
                  <option value="emergency">{t('كشف عاجل / طوارئ (Emergency)', 'Emergency')}</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">{t('سبب الزيارة أو الشكوى الأولية', 'Chief Complaint or Reason for Visit')}</label>
                <textarea
                  rows={2}
                  value={chiefComplaint}
                  onChange={(e) => setChiefComplaint(e.target.value)}
                  placeholder={t('مثال: ألم متكرر في الصدر وضيق في التنفس عند المشي...', 'e.g. Chest discomfort, shortness of breath on exertion...')}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsBookModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-slate-600 font-semibold"
                >
                  {t('إلغاء', 'Cancel')}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-lg shadow-blue-500/25"
                >
                  {t('تأكيد حجز الموعد', 'Confirm Booking')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
