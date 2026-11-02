interface Transaction {
  id: number;
  amount: number;
  type: number; // 0 = Income, 1 = Expense
  description: string;
  date: string;
  wallet?: { name: string };
  category?: { name: string };
}

export function exportTransactionsToCSV(transactions: Transaction[], fileName = 'Laporan_Keuangan.csv') {
  if (!transactions || transactions.length === 0) {
    alert('Tidak ada data transaksi untuk diekspor!');
    return;
  }

  // Header CSV
  const headers = ['ID', 'Tanggal', 'Jenis', 'Dompet', 'Kategori', 'Deskripsi', 'Nominal (Rp)'];

  // Baris Data
  const rows = transactions.map((tx) => [
    tx.id,
    new Date(tx.date).toLocaleDateString('id-ID'),
    tx.type === 0 ? 'Pemasukan' : 'Pengeluaran',
    `"${tx.wallet?.name || '-'}"`,
    `"${tx.category?.name || 'Tanpa Kategori'}"`,
    `"${tx.description.replace(/"/g, '""')}"`, // Escape tanda petik ganda
    tx.amount,
  ]);

  // Gabungkan header dan baris
  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

  // Tambahkan BOM (\uFEFF) agar karakter UTF-8 terbaca sempurna di Microsoft Excel
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}