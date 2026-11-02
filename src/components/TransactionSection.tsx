interface Wallet {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
}

interface Transaction {
  id: number;
  amount: number;
  type: number;
  description: string;
  date: string;
  walletId: number;
  wallet?: { name: string };
  categoryId?: number | null;
  category?: { name: string };
}

interface TransactionSectionProps {
  wallets: Wallet[];
  categories: Category[];
  filteredTransactions: Transaction[];
  selectedWalletId: string;
  setSelectedWalletId: (id: string) => void;
  type: string;
  setType: (type: string) => void;
  categoryId: string;
  setCategoryId: (id: string) => void;
  amount: string;
  setAmount: (amount: string) => void;
  description: string;
  setDescription: (desc: string) => void;
  handleAddTransaction: (e: React.FormEvent) => void;
  handleDeleteTransaction: (id: number) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterWalletId: string;
  setFilterWalletId: (id: string) => void;
  filterType: string;
  setFilterType: (type: string) => void;
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
}

export default function TransactionSection({
  wallets,
  categories,
  filteredTransactions,
  selectedWalletId,
  setSelectedWalletId,
  type,
  setType,
  categoryId,
  setCategoryId,
  amount,
  setAmount,
  description,
  setDescription,
  handleAddTransaction,
  handleDeleteTransaction,
  searchTerm,
  setSearchTerm,
  filterWalletId,
  setFilterWalletId,
  filterType,
  setFilterType,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}: TransactionSectionProps) {

  const getCategoryName = (tx: Transaction) => {
    if (tx.category?.name) return tx.category.name;
    if (tx.categoryId) {
      const found = categories.find((c) => c.id === tx.categoryId);
      if (found) return found.name;
    }
    return 'Tanpa Kategori';
  };

  const handleExportCSV = () => {
    if (!filteredTransactions || filteredTransactions.length === 0) {
      alert('Tidak ada data transaksi untuk diekspor!');
      return;
    }

    const headers = ['ID', 'Tanggal', 'Jenis', 'Dompet', 'Kategori', 'Deskripsi', 'Nominal (Rp)'];

    const rows = filteredTransactions.map((tx) => [
      tx.id,
      new Date(tx.date).toLocaleDateString('id-ID'),
      tx.type === 0 ? 'Pemasukan' : 'Pengeluaran',
      `"${tx.wallet?.name || '-'}"`,
      `"${getCategoryName(tx)}"`,
      `"${tx.description.replace(/"/g, '""')}"`,
      tx.amount,
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Laporan_Transaksi_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintPDF = () => {
    if (!filteredTransactions || filteredTransactions.length === 0) {
      alert('Tidak ada data transaksi untuk dicetak!');
      return;
    }

    const printWindow = window.open('', '_blank', 'height=650,width=900');
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Laporan Riwayat Transaksi</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
            h2 { text-align: center; margin-bottom: 5px; color: #111; }
            p.subtitle { text-align: center; font-size: 12px; color: #666; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #d1d5db; padding: 8px 12px; text-align: left; font-size: 13px; }
            th { background-color: #f3f4f6; color: #374151; }
            .text-right { text-align: right; }
            .income { color: #059669; font-weight: bold; }
            .expense { color: #dc2626; font-weight: bold; }
          </style>
        </head>
        <body>
          <h2>Laporan Riwayat Transaksi Keuangan</h2>
          <p class="subtitle">Dicetak pada: ${new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}</p>
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Tanggal</th>
                <th>Keterangan</th>
                <th>Dompet</th>
                <th>Kategori</th>
                <th>Jenis</th>
                <th class="text-right">Nominal (Rp)</th>
              </tr>
            </thead>
            <tbody>
              ${filteredTransactions.map((tx, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${new Date(tx.date).toLocaleDateString('id-ID')}</td>
                  <td>${tx.description}</td>
                  <td>${tx.wallet?.name || '-'}</td>
                  <td>${getCategoryName(tx)}</td>
                  <td>${tx.type === 0 ? 'Pemasukan' : 'Pengeluaran'}</td>
                  <td class="text-right ${tx.type === 0 ? 'income' : 'expense'}">
                    ${tx.type === 0 ? '+' : '-'} Rp ${tx.amount.toLocaleString('id-ID')}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <script>
            window.onload = function() {
              window.print();
              window.close();
            }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Form Catat Transaksi */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Catat Transaksi</h2>
        <form onSubmit={handleAddTransaction} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Pilih Dompet</label>
            <select
              value={selectedWalletId}
              onChange={(e) => setSelectedWalletId(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
              required
            >
              {wallets.map((w) => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Jenis Transaksi</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
            >
              <option value="0">Pemasukan (Income)</option>
              <option value="1">Pengeluaran (Expense)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Kategori (Opsional)</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
            >
              <option value="">-- Pilih Kategori --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Nominal (Rp)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="50000"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Keterangan</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Contoh: Gaji Bulanan / Makan Siang"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-2 rounded-lg font-medium hover:bg-emerald-700 transition cursor-pointer"
          >
            Simpan Transaksi
          </button>
        </form>
      </div>

      {/* Riwayat Transaksi dengan Filter & Tombol Ekspor/PDF */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">Riwayat Transaksi</h2>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleExportCSV}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition flex items-center space-x-1 cursor-pointer shadow-sm"
              title="Unduh ke CSV"
            >
              <span>📥</span>
              <span>CSV</span>
            </button>
            <button
              onClick={handlePrintPDF}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition flex items-center space-x-1 cursor-pointer shadow-sm"
              title="Cetak atau Simpan PDF Khusus Transaksi"
            >
              <span>🖨️</span>
              <span>PDF</span>
            </button>
          </div>
        </div>
        
        {/* Kontrol Filter, Pencarian & Rentang Tanggal */}
        <div className="space-y-3 mb-4 pb-4 border-b border-gray-100">
          <input
            type="text"
            placeholder="Cari keterangan transaksi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
          
          <div className="grid grid-cols-2 gap-2">
            <select
              value={filterWalletId}
              onChange={(e) => setFilterWalletId(e.target.value)}
              className="px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
            >
              <option value="">Semua Dompet</option>
              {wallets.map((w) => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
            >
              <option value="">Semua Jenis</option>
              <option value="0">Pemasukan (+)</option>
              <option value="1">Pengeluaran (-)</option>
            </select>
          </div>

          {/* Filter Rentang Tanggal Input */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div>
              <label className="block text-[11px] font-medium text-gray-500 mb-1">Dari Tanggal</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-gray-500 mb-1">Sampai Tanggal</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white"
              />
            </div>
          </div>
        </div>

        {filteredTransactions.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Tidak ada transaksi yang cocok.</p>
        ) : (
          <ul className="space-y-3 max-h-[300px] overflow-y-auto">
            {filteredTransactions.map((tx) => (
              <li key={tx.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">{tx.description}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(tx.date).toLocaleDateString('id-ID')} {tx.wallet?.name ? `• ${tx.wallet.name}` : ''}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`font-bold ${tx.type === 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {tx.type === 0 ? '+' : '-'} Rp {tx.amount.toLocaleString('id-ID')}
                  </span>
                  <button
                    onClick={() => handleDeleteTransaction(tx.id)}
                    className="text-red-500 hover:text-red-700 text-sm font-semibold px-2 py-1 bg-red-50 rounded transition cursor-pointer"
                    title="Hapus Transaksi"
                  >
                    ✕
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}