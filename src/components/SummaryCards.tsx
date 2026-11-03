interface Wallet {
  id: number;
  name: string;
  balance: number;
}

interface SummaryCardsProps {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  wallets?: Wallet[];
}

export default function SummaryCards({ totalBalance, totalIncome, totalExpense, wallets = [] }: SummaryCardsProps) {
  return (
    <div className="space-y-6">
      {/* 3 Kartu Ringkasan Utama */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Saldo Keseluruhan</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
            Rp {totalBalance.toLocaleString('id-ID')}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pemasukan Bulan Ini</p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            + Rp {totalIncome.toLocaleString('id-ID')}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pengeluaran Bulan Ini</p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
            - Rp {totalExpense.toLocaleString('id-ID')}
          </p>
        </div>
      </div>

      {/* Rincian Sisa Saldo Per Dompet */}
      {wallets.length > 0 && (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">💼 Rincian Sisa Saldo Masing-Masing Dompet</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {wallets.map((w) => (
              <div key={w.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{w.name}</p>
                <p className="text-lg font-bold text-gray-800 dark:text-white mt-1">
                  Rp {w.balance.toLocaleString('id-ID')}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}