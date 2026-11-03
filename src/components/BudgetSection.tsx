import { useState, useEffect } from 'react';

interface Category {
  id: number;
  name: string;
}

interface Budget {
  id: number;
  categoryId: number;
  categoryName: string;
  amount: number;
  spent: number;
  percentage: number;
}

interface BudgetSectionProps {
  categories: Category[];
  budgets: Budget[];
  currentMonth: number;
  currentYear: number;
  onBudgetChange: () => void;
  showToast: (message: string, type?: 'success' | 'error') => void;
  upsertBudgetService: (data: { categoryId: number; amount: number; month: number; year: number }) => Promise<any>;
  deleteBudgetService: (id: number) => Promise<any>;
}

export default function BudgetSection({
  categories,
  budgets,
  currentMonth,
  currentYear,
  onBudgetChange,
  showToast,
  upsertBudgetService,
  deleteBudgetService,
}: BudgetSectionProps) {
  const [categoryId, setCategoryId] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  // Sinkronisasi otomatis nilai categoryId default saat daftar kategori dimuat
  useEffect(() => {
    if (categories.length > 0 && !categoryId) {
      setCategoryId(categories[0].id.toString());
    }
  }, [categories]);

  const handleSaveBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId || !amount) {
      showToast('Pilih kategori dan isi nominal anggaran!', 'error');
      return;
    }

    try {
      setLoading(true);
      await upsertBudgetService({
        categoryId: parseInt(categoryId),
        amount: parseFloat(amount),
        month: currentMonth + 1, // JavaScript month 0-11 to 1-12
        year: currentYear,
      });

      setAmount('');
      onBudgetChange();
      showToast('Anggaran berhasil disimpan!');
    } catch (error: any) {
      showToast(error.message || 'Gagal menyimpan anggaran', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus batas anggaran ini?')) return;
    try {
      await deleteBudgetService(id);
      onBudgetChange();
      showToast('Anggaran berhasil dihapus!');
    } catch (error: any) {
      showToast('Gagal menghapus anggaran', 'error');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Daftar Anggaran & Progress Bar */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-white">Anggaran Bulan Ini</h2>
        {budgets.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4 text-sm">Belum ada anggaran yang ditetapkan untuk bulan ini.</p>
        ) : (
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
            {budgets.map((b) => {
              const isOver = b.percentage > 100;
              const barColor = isOver ? 'bg-red-500' : b.percentage > 80 ? 'bg-amber-500' : 'bg-emerald-500';
              
              return (
                <div key={b.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2 border border-gray-100 dark:border-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-800 dark:text-white text-sm">{b.categoryName}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                        Rp {b.spent.toLocaleString('id-ID')} / <span className="text-gray-800 dark:text-white">Rp {b.amount.toLocaleString('id-ID')}</span>
                      </span>
                      <button
                        onClick={() => handleDelete(b.id)}
                        className="text-red-500 hover:text-red-700 text-xs font-bold px-1.5 py-0.5 bg-red-50 dark:bg-red-950/50 rounded cursor-pointer"
                        title="Hapus Anggaran"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-2.5 rounded-full transition-all duration-500 ${barColor}`}
                      style={{ width: `${Math.min(b.percentage, 100)}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className={isOver ? 'text-red-600 dark:text-red-400 font-bold' : 'text-gray-500 dark:text-gray-400'}>
                      {isOver ? `Melebihi batas (${b.percentage}%)` : `${b.percentage}% terpakai`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Form Set / Update Anggaran */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-white">Atur Anggaran Kategori</h2>
        {categories.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 py-4">
            Silakan tambahkan **Kategori** terlebih dahulu pada menu di bawah untuk dapat mengatur anggaran.
          </p>
        ) : (
          <form onSubmit={handleSaveBudget} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Pilih Kategori</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-4 py-2 border dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-black dark:text-white text-sm"
                required
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Batas Maksimal Pengeluaran (Rp)</label>
              <input
                type="text"
                value={amount ? Number(amount).toLocaleString('id-ID') : ''}
                onChange={(e) => {
                  const rawValue = e.target.value.replace(/\D/g, '');
                  setAmount(rawValue);
                }}
                placeholder="Contoh: 1.500.000"
                className="w-full px-4 py-2 border dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black dark:text-white bg-white dark:bg-gray-800 text-sm"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition disabled:bg-indigo-300 cursor-pointer text-sm shadow-sm"
            >
              {loading ? 'Menyimpan...' : 'Simpan Anggaran'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}