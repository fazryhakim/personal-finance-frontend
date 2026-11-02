interface Wallet {
  id: number;
  name: string;
  balance: number;
}

interface WalletSectionProps {
  wallets: Wallet[];
  loading: boolean;
  walletName: string;
  setWalletName: (name: string) => void;
  initialBalance: string;
  setInitialBalance: (balance: string) => void;
  handleAddWallet: (e: React.FormEvent) => void;
  handleDeleteWallet: (id: number) => void;
}

export default function WalletSection({
  wallets,
  loading,
  walletName,
  setWalletName,
  initialBalance,
  setInitialBalance,
  handleAddWallet,
  handleDeleteWallet,
}: WalletSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Daftar Dompet */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Daftar Dompet</h2>
        {loading ? (
          <p className="text-gray-500">Memuat data...</p>
        ) : wallets.length === 0 ? (
          <p className="text-gray-500">Belum ada dompet terdaftar.</p>
        ) : (
          <ul className="space-y-3">
            {wallets.map((wallet) => (
              <li key={wallet.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-800">{wallet.name}</span>
                <div className="flex items-center space-x-3">
                  <span className="font-bold text-emerald-600">
                    Rp {wallet.balance.toLocaleString('id-ID')}
                  </span>
                  <button
                    onClick={() => handleDeleteWallet(wallet.id)}
                    className="text-red-500 hover:text-red-700 text-sm font-semibold px-2 py-1 bg-red-50 rounded transition"
                    title="Hapus Dompet"
                  >
                    ✕
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Tambah Dompet Baru */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Tambah Dompet Baru</h2>
        <form onSubmit={handleAddWallet} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Nama Dompet</label>
            <input
              type="text"
              value={walletName}
              onChange={(e) => setWalletName(e.target.value)}
              placeholder="Contoh: BCA, Dompet Tunai"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Saldo Awal</label>
            <input
              type="number"
              value={initialBalance}
              onChange={(e) => setInitialBalance(e.target.value)}
              placeholder="0"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Simpan Dompet
          </button>
        </form>
      </div>
    </div>
  );
}