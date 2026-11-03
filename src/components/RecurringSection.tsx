'use client';

import { useState } from 'react';

interface Wallet {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
}

interface RecurringTransaction {
  id: number;
  title: string;
  amount: number;
  type: number;
  walletId: number;
  wallet?: { name: string };
  categoryId?: number | null;
  category?: { name: string };
  dayOfMonth: number;
  lastProcessedDate?: string;
}

interface Props {
  recurringList: RecurringTransaction[];
  wallets: Wallet[];
  categories: Category[];
  onRefresh: () => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
  createService: (data: any) => Promise<any>;
  deleteService: (id: number) => Promise<any>;
  processService: () => Promise<any>;
}

export default function RecurringSection({
  recurringList,
  wallets,
  categories,
  onRefresh,
  showToast,
  createService,
  deleteService,
  processService,
}: Props) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('1'); // Default Pengeluaran
  const [walletId, setWalletId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [dayOfMonth, setDayOfMonth] = useState('1');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount || !walletId) return;

    try {
      await createService({
        title,
        amount: parseFloat(amount),
        type: parseInt(type),
        walletId: parseInt(walletId),
        categoryId: categoryId ? parseInt(categoryId) : null,
        dayOfMonth: parseInt(dayOfMonth),
      });
      setTitle('');
      setAmount('');
      setDayOfMonth('1');
      onRefresh();
      showToast('Transaksi berulang berhasil ditambahkan!');
    } catch (error) {
      showToast('Gagal menambah transaksi berulang', 'error');
    }
  };

  const handleProcess = async () => {
    try {
      const res = await processService();
      onRefresh();
      showToast(res.message || 'Berhasil memproses transaksi berulang!');
    } catch (error) {
      showToast('Gagal memproses transaksi berulang', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus transaksi berulang ini?')) return;
    try {
      await deleteService(id);
      onRefresh();
      showToast('Transaksi berulang berhasil dihapus!');
    } catch (error) {
      showToast('Gagal menghapus transaksi berulang', 'error');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 space-y-6 transition-colors">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">🔄 Transaksi Berulang (Recurring)</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Otomatisasi pengeluaran atau pemasukan rutin tiap bulan.</p>
        </div>
        <button
          onClick={handleProcess}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition shadow-sm cursor-pointer"
        >
          ⚙️ Proses Jatuh Tempo Sekarang
        </button>
      </div>

      {/* Form Tambah */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
        <input
          type="text"
          placeholder="Judul (Contoh: Internet, Netflix)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="px-4 py-2 border dark:border-gray-700 rounded-xl text-sm bg-white dark:bg-gray-900 text-black dark:text-white"
          required
        />
        <input
          type="text"
          placeholder="Nominal (Rp)"
          value={amount ? Number(amount).toLocaleString('id-ID') : ''}
          onChange={(e) => {
            const rawValue = e.target.value.replace(/\D/g, '');
            setAmount(rawValue);
          }}
          className="px-4 py-2 border dark:border-gray-700 rounded-xl text-sm bg-white dark:bg-gray-900 text-black dark:text-white"
          required
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="px-4 py-2 border dark:border-gray-700 rounded-xl text-sm bg-white dark:bg-gray-900 text-black dark:text-white"
        >
          <option value="0">Pemasukan</option>
          <option value="1">Pengeluaran</option>
        </select>
        <select
          value={walletId}
          onChange={(e) => setWalletId(e.target.value)}
          className="px-4 py-2 border dark:border-gray-700 rounded-xl text-sm bg-white dark:bg-gray-900 text-black dark:text-white"
          required
        >
          <option value="">Pilih Dompet</option>
          {wallets.map((w) => (
            <option key={w.id} value={w.id}>{w.name}</option>
          ))}
        </select>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="px-4 py-2 border dark:border-gray-700 rounded-xl text-sm bg-white dark:bg-gray-900 text-black dark:text-white"
        >
          <option value="">Pilih Kategori (Opsional)</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">Tanggal tiap bulan:</span>
          <input
            type="number"
            min="1"
            max="31"
            value={dayOfMonth}
            onChange={(e) => setDayOfMonth(e.target.value)}
            className="w-full px-4 py-2 border dark:border-gray-700 rounded-xl text-sm bg-white dark:bg-gray-900 text-black dark:text-white"
            required
          />
        </div>
        <div className="sm:col-span-2 lg:col-span-3 flex justify-end">
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl text-sm font-medium transition cursor-pointer shadow-sm"
          >
            + Tambah Transaksi Berulang
          </button>
        </div>
      </form>

      {/* List Transaksi Berulang */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 uppercase text-xs">
            <tr>
              <th className="p-3">Judul</th>
              <th className="p-3">Tipe</th>
              <th className="p-3">Nominal</th>
              <th className="p-3">Dompet</th>
              <th className="p-3">Tanggal Rutin</th>
              <th className="p-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {recurringList.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-400 dark:text-gray-500 text-sm">
                  Belum ada transaksi berulang yang terdaftar.
                </td>
              </tr>
            ) : (
              recurringList.map((rec) => (
                <tr key={rec.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="p-3 font-medium text-gray-800 dark:text-white">{rec.title}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-md text-xs font-semibold ${
                      rec.type === 0 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400'
                    }`}>
                      {rec.type === 0 ? 'Pemasukan' : 'Pengeluaran'}
                    </span>
                  </td>
                  <td className="p-3 font-semibold text-gray-900 dark:text-white">
                    Rp {rec.amount.toLocaleString('id-ID')}
                  </td>
                  <td className="p-3 text-gray-600 dark:text-gray-300">{rec.wallet?.name || '-'}</td>
                  <td className="p-3 text-gray-600 dark:text-gray-300">Tanggal {rec.dayOfMonth} tiap bulan</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleDelete(rec.id)}
                      className="text-red-500 hover:text-red-700 text-xs font-medium px-2 py-1 bg-red-50 hover:bg-red-100 dark:bg-red-950/50 dark:hover:bg-red-900/50 rounded-lg transition cursor-pointer"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}