'use client';

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

interface Transaction {
  amount: number;
  type: number; // 0 = Pemasukan, 1 = Pengeluaran
  date: string;
}

interface Props {
  transactions: Transaction[];
  currentYear: number;
}

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 
  'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'
];

export default function MonthlyTrendChart({ transactions, currentYear }: Props) {
  // Olah data transaksi per bulan untuk tahun yang aktif
  const chartData = MONTH_NAMES.map((monthName, index) => {
    const monthIndex = index; // 0 sampai 11

    const monthlyTxs = transactions.filter((tx) => {
      const txDate = new Date(tx.date);
      return txDate.getFullYear() === currentYear && txDate.getMonth() === monthIndex;
    });

    const income = monthlyTxs
      .filter((tx) => tx.type === 0)
      .reduce((acc, tx) => acc + tx.amount, 0);

    const expense = monthlyTxs
      .filter((tx) => tx.type === 1)
      .reduce((acc, tx) => acc + tx.amount, 0);

    return {
      month: monthName,
      Pemasukan: income,
      Pengeluaran: expense,
    };
  });

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
      <div>
        <h2 className="text-xl font-bold text-gray-800">📈 Analisis Tren Bulanan ({currentYear})</h2>
        <p className="text-sm text-gray-500">Perbandingan total pemasukan dan pengeluaran sepanjang tahun.</p>
      </div>

      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="month" stroke="#888888" fontSize={12} />
            <YAxis 
              stroke="#888888" 
              fontSize={12} 
              tickFormatter={(value) => `Rp ${(value / 1000).toLocaleString('id-ID')}rb`}
            />
            <Tooltip 
              formatter={(value: any) => [`Rp ${Number(value).toLocaleString('id-ID')}`, '']}
              contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            <Line 
              type="monotone" 
              dataKey="Pemasukan" 
              stroke="#059669" 
              strokeWidth={3} 
              dot={{ r: 4 }} 
              activeDot={{ r: 8 }} 
            />
            <Line 
              type="monotone" 
              dataKey="Pengeluaran" 
              stroke="#dc2626" 
              strokeWidth={3} 
              dot={{ r: 4 }} 
              activeDot={{ r: 8 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}