import { useState, useEffect } from 'react';

interface Wallet {
  id: number;
  name: string;
  balance: number;
}

interface TransferSectionProps {
  wallets: Wallet[];
  onTransferSuccess: () => void;
  showToast: (message: string, type?: 'success' | 'error') => void;
  transferService: (data: { sourceWalletId: number; targetWalletId: number; amount: number; description: string }) => Promise<any>;
}

export default function TransferSection({ wallets, onTransferSuccess, showToast, transferService }: TransferSectionProps) {
  const [sourceWalletId, setSourceWalletId] = useState('');
  const [targetWalletId, setTargetWalletId] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  // Sinkronisasi otomatis nilai default saat data dompet tersedia
  useEffect(() => {
    if (wallets.length >= 2) {
      if (!sourceWalletId) setSourceWalletId(wallets[0].id.toString());
      if (!targetWalletId) setTargetWalletId(wallets[1].id.toString());
    }
  }, [wallets]);

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceWalletId || !targetWalletId || !amount) {
      showToast('Semua field wajib diisi!', 'error');
      return;
    }

    if (sourceWalletId === targetWalletId) {
      showToast('Dompet asal dan tujuan tidak boleh sama!', 'error');
      return;
    }

    try {
      setLoading(true);
      await transferService({
        sourceWalletId: parseInt(sourceWalletId),
        targetWalletId: parseInt(targetWalletId),
        amount: parseFloat(amount),
        description: description || 'Transfer antar dompet',
      });

      setAmount('');
      setDescription('');
      onTransferSuccess();
      showToast('Transfer saldo berhasil dilakukan!');
    } catch (error: any) {
      showToast(error.message || 'Gagal melakukan transfer', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Jika dompet kurang dari 2, tampilkan pesan informatif
  if (wallets.length < 2) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-2 text-gray-700">Transfer Saldo Antar Dompet</h2>
        <p className="text-sm text-gray-500">
          Anda memerlukan minimal **2 dompet** terdaftar untuk melakukan transfer saldo. Silakan buat dompet tambahan pada menu di atas terlebih dahulu.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Transfer Saldo Antar Dompet</h2>
      <form onSubmit={handleTransfer} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Dari Dompet (Asal)</label>
            <select
              value={sourceWalletId}
              onChange={(e) => setSourceWalletId(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
              required
            >
              {wallets.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name} (Rp {w.balance.toLocaleString('id-ID')})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Ke Dompet (Tujuan)</label>
            <select
              value={targetWalletId}
              onChange={(e) => setTargetWalletId(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
              required
            >
              {wallets.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name} (Rp {w.balance.toLocaleString('id-ID')})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Nominal Transfer (Rp)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="100000"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Keterangan (Opsional)</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Contoh: Tarik tunai / Pindah tabungan"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:bg-blue-300 cursor-pointer"
        >
          {loading ? 'Memproses Transfer...' : 'Kirim Transfer'}
        </button>
      </form>
    </div>
  );
}