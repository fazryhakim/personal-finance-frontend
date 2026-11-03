'use client';

import { useState } from 'react';

interface SavingsGoal {
  id: number;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate?: string;
}

interface SavingsSectionProps {
  goals: SavingsGoal[];
  onGoalChange: () => void;
  showToast: (message: string, type?: 'success' | 'error') => void;
  createGoalService: (data: { title: string; targetAmount: number; targetDate?: string }) => Promise<any>;
  depositService: (id: number, amount: number) => Promise<any>;
  deleteGoalService: (id: number) => Promise<any>;
}

export default function SavingsSection({
  goals,
  onGoalChange,
  showToast,
  createGoalService,
  depositService,
  deleteGoalService,
}: SavingsSectionProps) {
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [depositAmounts, setDepositAmounts] = useState<{ [key: number]: string }>({});

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !targetAmount) return;

    try {
      await createGoalService({
        title,
        targetAmount: parseFloat(targetAmount),
        targetDate: targetDate ? new Date(targetDate).toISOString() : undefined,
      });
      setTitle('');
      setTargetAmount('');
      setTargetDate('');
      onGoalChange();
      showToast('Target tabungan berhasil dibuat!');
    } catch (error) {
      showToast('Gagal membuat target tabungan', 'error');
    }
  };

  const handleDepositSubmit = async (id: number) => {
    const amt = parseFloat(depositAmounts[id] || '0');
    if (isNaN(amt) || amt <= 0) {
      showToast('Masukkan nominal tabungan yang valid', 'error');
      return;
    }

    try {
      await depositService(id, amt);
      setDepositAmounts({ ...depositAmounts, [id]: '' });
      onGoalChange();
      showToast('Berhasil menabung ke target!');
    } catch (error) {
      showToast('Gagal menabung', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus target tabungan ini?')) return;
    try {
      await deleteGoalService(id);
      onGoalChange();
      showToast('Target tabungan berhasil dihapus!');
    } catch (error) {
      showToast('Gagal menghapus target', 'error');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 space-y-6 transition-colors">
      <h2 className="text-xl font-semibold text-gray-700 dark:text-white">🎯 Target Tabungan (Savings Goals)</h2>

      {/* Form Buat Target */}
      <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Nama Target</label>
          <input
            type="text"
            placeholder="Contoh: Dana Darurat"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 text-sm border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-black dark:text-white"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Target Nominal (Rp)</label>
          <input
            type="text"
            placeholder="5.000.000"
            value={targetAmount ? Number(targetAmount).toLocaleString('id-ID') : ''}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/\D/g, '');
              setTargetAmount(rawValue);
            }}
            className="w-full px-3 py-2 text-sm border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-black dark:text-white"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Target Waktu (Opsional)</label>
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="w-full px-3 py-2 text-sm border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-black dark:text-white"
          />
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium py-2 rounded-lg transition cursor-pointer shadow-sm"
          >
            Buat Target
          </button>
        </div>
      </form>

      {/* Daftar Target Tabungan */}
      {goals.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-4 text-sm">Belum ada target tabungan yang dibuat.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map((goal) => {
            const percentage = Math.min(Math.round((goal.currentAmount / goal.targetAmount) * 100), 100);
            return (
              <div key={goal.id} className="p-4 border border-gray-100 dark:border-gray-800 rounded-xl bg-gray-50/50 dark:bg-gray-800/50 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white text-sm">{goal.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Target: {goal.targetDate ? new Date(goal.targetDate).toLocaleDateString('id-ID') : 'Tidak ditentukan'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(goal.id)}
                    className="text-red-500 hover:text-red-700 text-xs font-semibold px-2 py-1 bg-red-50 dark:bg-red-950/50 rounded cursor-pointer"
                    title="Hapus Target"
                  >
                    ✕
                  </button>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                    <span>Rp {goal.currentAmount.toLocaleString('id-ID')} / Rp {goal.targetAmount.toLocaleString('id-ID')}</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">{percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 dark:bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Form Menabung Cepat */}
                <div className="flex items-center space-x-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                  <input
                    type="text"
                    placeholder="Nominal tabung..."
                    value={depositAmounts[goal.id] ? Number(depositAmounts[goal.id]).toLocaleString('id-ID') : ''}
                    onChange={(e) => {
                      const rawValue = e.target.value.replace(/\D/g, '');
                      setDepositAmounts({ ...depositAmounts, [goal.id]: rawValue });
                    }}
                    className="w-full px-3 py-1.5 text-xs border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-black dark:text-white"
                  />
                  <button
                    onClick={() => handleDepositSubmit(goal.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer shadow-sm"
                  >
                    Tabung ➕
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}