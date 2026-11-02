import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface ChartData {
  name: string;
  total: number;
}

interface ExpenseChartProps {
  data: ChartData[];
}

export default function ExpenseChart({ data }: ExpenseChartProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Grafik Pengeluaran Berdasarkan Kategori</h2>
      {data.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Belum ada data pengeluaran berkategori untuk ditampilkan.</p>
      ) : (
        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(value) => `Rp ${value}`} />
              <Tooltip formatter={(value: any) => [`Rp ${Number(value).toLocaleString('id-ID')}`, 'Total']} />
              <Bar dataKey="total" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}