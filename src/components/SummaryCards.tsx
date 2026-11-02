interface SummaryCardsProps {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
}

export default function SummaryCards({ totalBalance, totalIncome, totalExpense }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <p className="text-sm font-medium text-gray-500">Total Saldo</p>
        <p className="text-2xl font-bold text-gray-800 mt-1">
          Rp {totalBalance.toLocaleString('id-ID')}
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <p className="text-sm font-medium text-gray-500">Pemasukan Bulan Ini</p>
        <p className="text-2xl font-bold text-emerald-600 mt-1">
          + Rp {totalIncome.toLocaleString('id-ID')}
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <p className="text-sm font-medium text-gray-500">Pengeluaran Bulan Ini</p>
        <p className="text-2xl font-bold text-red-600 mt-1">
          - Rp {totalExpense.toLocaleString('id-ID')}
        </p>
      </div>
    </div>
  );
}