import React, { useState } from 'react';
import { useMedSync } from '../../context/MedSyncContext';
import { MedicineInventory } from '../../types/medsync';
import { 
  Pill, 
  Search, 
  Plus, 
  AlertTriangle, 
  CheckCircle2, 
  Package, 
  Calendar, 
  ArrowUpRight, 
  DollarSign, 
  Check, 
  Clock,
  Sparkles,
  Layers
} from 'lucide-react';

export const PharmacyModule: React.FC = () => {
  const { medicines, addMedicine, updateStock, dispensePrescription, consultations, t, language } = useMedSync();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isAddMedOpen, setIsAddMedOpen] = useState(false);

  // New Medicine Form State
  const [brandName, setBrandName] = useState('');
  const [genericName, setGenericName] = useState('');
  const [code, setCode] = useState('');
  const [category, setCategory] = useState('Cardiovascular');
  const [dosageForm, setDosageForm] = useState('Tablet');
  const [strength, setStrength] = useState('10mg');
  const [stockQuantity, setStockQuantity] = useState(100);
  const [minStockLevel, setMinStockLevel] = useState(25);
  const [unitPrice, setUnitPrice] = useState(45);
  const [expiryDate, setExpiryDate] = useState('2027-12-31');
  const [batchNumber, setBatchNumber] = useState('BATCH-2026');
  const [locationShelf, setLocationShelf] = useState('Aisle 2 - Shelf B');

  // Aggregates
  const totalItems = medicines.length;
  const lowStockCount = medicines.filter(m => m.status === 'low_stock' || m.stockQuantity <= m.minStockLevel).length;
  const outOfStockCount = medicines.filter(m => m.status === 'out_of_stock' || m.stockQuantity === 0).length;
  const totalValuation = medicines.reduce((acc, m) => acc + (m.stockQuantity * m.unitPrice), 0);

  // Filtered
  const filteredMeds = medicines.filter(m => {
    const matchesSearch = 
      m.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'all' || m.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const handleCreateMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName) return;

    addMedicine({
      hospitalId: 'hosp-1',
      brandName,
      genericName: genericName || brandName,
      code: code || `MED-${Math.floor(100 + Math.random() * 900)}`,
      category,
      dosageForm,
      strength,
      stockQuantity: Number(stockQuantity),
      minStockLevel: Number(minStockLevel),
      unitPrice: Number(unitPrice),
      expiryDate,
      batchNumber,
      manufacturer: 'Pharma MedCare Int.',
      locationShelf,
      status: Number(stockQuantity) > Number(minStockLevel) ? 'in_stock' : Number(stockQuantity) > 0 ? 'low_stock' : 'out_of_stock'
    });

    setIsAddMedOpen(false);
  };

  return (
    <div className="p-4 sm:p-8 space-y-6 animate-in fade-in duration-200">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <Pill className="w-6 h-6 text-purple-600" />
            <span>{t('الصيدلية وإدارة المخزون الدوائي', 'Pharmacy & Medication Inventory')}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {t('متابعة أرصدة الأدوية، تنبيهات النواقص والصلاحية، وصرف الوصفات الطبية الإلكترونية', 'Real-time drug stocks, batch expirations, and e-prescription dispensing')}
          </p>
        </div>

        <button
          onClick={() => setIsAddMedOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>{t('إضافة دواء للمخزون', 'Add Medication')}</span>
        </button>
      </div>

      {/* 2. Inventory KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('إجمالي الأصناف المسجلة', 'Total Drug Formulations')}</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{totalItems}</p>
          </div>
          <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
            <Package className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('أدوية قريبة من النفاد', 'Low Stock Threshold')}</p>
            <p className="text-2xl font-black text-amber-600 mt-1">{lowStockCount}</p>
          </div>
          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('أصناف منتهية الرصيد', 'Out of Stock')}</p>
            <p className="text-2xl font-black text-rose-600 mt-1">{outOfStockCount}</p>
          </div>
          <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
            <Pill className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('قيمة المخزون الإجمالية', 'Inventory Valuation')}</p>
            <p className="text-2xl font-black text-emerald-600 mt-1">{(totalValuation).toLocaleString()} SAR</p>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 3. Search & Category Filters */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('ابحث بالاسم التجاري، العلمي، أو الكود...', 'Search brand, generic, or code...')}
            className="w-full pl-9 pr-4 rtl:pr-9 rtl:pl-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-800 dark:text-slate-100 outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {['all', 'Cardiovascular', 'Antibiotic', 'Analgesic', 'Endocrine', 'Respiratory'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                categoryFilter === cat
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {cat === 'all' ? t('كافة التصنيفات', 'All Categories') : cat}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Medicines Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right rtl:text-right ltr:text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200/80 dark:border-slate-800">
              <tr>
                <th className="p-4">{t('الدواء والمادة الفعالة', 'Medication & Generic')}</th>
                <th className="p-4">{t('التصنيف والعيار', 'Category & Strength')}</th>
                <th className="p-4">{t('الرصيد المتاح', 'Stock Units')}</th>
                <th className="p-4">{t('موقع الرف والمخزن', 'Storage Shelf')}</th>
                <th className="p-4">{t('تاريخ الصلاحية والتشغيلة', 'Expiry & Batch')}</th>
                <th className="p-4">{t('سعر الوحدة', 'Unit Price')}</th>
                <th className="p-4">{t('الحالة', 'Status')}</th>
                <th className="p-4 text-center">{t('تعديل الرصيد', 'Stock Adjustment')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {filteredMeds.map(med => (
                <tr key={med.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-slate-900 dark:text-white text-sm">
                      💊 {med.brandName}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      {med.genericName} • {med.code}
                    </p>
                  </td>
                  <td className="p-4 text-slate-700 dark:text-slate-300">
                    <p className="font-bold">{med.category}</p>
                    <p className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold">{med.strength} ({med.dosageForm})</p>
                  </td>
                  <td className="p-4">
                    <span className="text-base font-black text-slate-900 dark:text-white font-mono">{med.stockQuantity}</span>
                    <span className="text-[10px] text-slate-400 block">{t('حد أمان:', 'Min:')} {med.minStockLevel}</span>
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                    {med.locationShelf}
                  </td>
                  <td className="p-4 text-slate-700 dark:text-slate-300 font-mono">
                    <p className="font-bold">{med.expiryDate}</p>
                    <p className="text-[10px] text-slate-400">{med.batchNumber}</p>
                  </td>
                  <td className="p-4 font-bold text-slate-900 dark:text-white">
                    {med.unitPrice} SAR
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      med.status === 'in_stock' 
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' 
                        : med.status === 'low_stock'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                    }`}>
                      {med.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => updateStock(med.id, Math.max(0, med.stockQuantity - 10))}
                        className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold hover:bg-rose-100 hover:text-rose-700 transition-colors"
                        title={t('صرف 10 وحدات', 'Dispense 10 units')}
                      >
                        -10
                      </button>
                      <button
                        onClick={() => updateStock(med.id, med.stockQuantity + 50)}
                        className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold hover:bg-emerald-100 hover:text-emerald-700 transition-colors"
                        title={t('توريد 50 وحدة', 'Restock 50 units')}
                      >
                        +50
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Add Medicine Modal */}
      {isAddMedOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-purple-600 text-white">
                  <Pill className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t('إضافة دواء جديد للصيدلية', 'Add Medication to Inventory')}</h3>
                  <p className="text-xs text-slate-400">{t('تسجيل صنف دوائي في قاعدة بيانات المستشفى', 'Register drug specs, dosage, and shelf location')}</p>
                </div>
              </div>
              <button onClick={() => setIsAddMedOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreateMedicine} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">{t('الاسم التجاري (Brand Name)', 'Brand Name')} *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lipitor"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-purple-500 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">{t('الاسم العلمي (Generic Name)', 'Generic Name')}</label>
                  <input
                    type="text"
                    placeholder="e.g. Atorvastatin Calcium"
                    value={genericName}
                    onChange={(e) => setGenericName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">{t('التصنيف الدوائي', 'Category')}</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-purple-500 font-bold"
                  >
                    <option value="Cardiovascular">Cardiovascular</option>
                    <option value="Antibiotic">Antibiotic</option>
                    <option value="Analgesic">Analgesic</option>
                    <option value="Endocrine">Endocrine</option>
                    <option value="Respiratory">Respiratory</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">{t('العيار / القوة', 'Strength')}</label>
                  <input
                    type="text"
                    placeholder="20mg"
                    value={strength}
                    onChange={(e) => setStrength(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">{t('الشكل الصيدلاني', 'Dosage Form')}</label>
                  <input
                    type="text"
                    placeholder="Tablet / Capsule / Syrup"
                    value={dosageForm}
                    onChange={(e) => setDosageForm(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">{t('الكمية الأولية', 'Initial Stock')}</label>
                  <input
                    type="number"
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">{t('حد إعادة الطلب', 'Reorder Level')}</label>
                  <input
                    type="number"
                    value={minStockLevel}
                    onChange={(e) => setMinStockLevel(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">{t('سعر البيع (SAR)', 'Unit Price')}</label>
                  <input
                    type="number"
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">{t('تاريخ انتهاء الصلاحية', 'Expiry Date')}</label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">{t('موقع الرف في الصيدلية', 'Shelf Location')}</label>
                  <input
                    type="text"
                    placeholder="Aisle 1 - Shelf C"
                    value={locationShelf}
                    onChange={(e) => setLocationShelf(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-purple-500 font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddMedOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-slate-600 font-semibold"
                >
                  {t('إلغاء', 'Cancel')}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all shadow-lg shadow-purple-500/25"
                >
                  {t('حفظ وإدراج في الصيدلية', 'Add to Pharmacy Stock')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
