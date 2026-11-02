'use client';

import { useEffect, useState } from 'react';
import { 
  getWallets, 
  createWallet, 
  deleteWallet,
  getTransactions, 
  createTransaction, 
  deleteTransaction,
  getCategories,
  createCategory,
  deleteCategory,
  transferBalance,
  getBudgets, 
  upsertBudget, 
  deleteBudget,
  getSavingsGoals, 
  createSavingsGoal, 
  depositSavingsGoal, 
  deleteSavingsGoal,
  getRecurringTransactions,
  createRecurringTransaction,
  deleteRecurringTransaction,
  processDueRecurringTransactions,
  changePassword,
} from '@/src/services/api';

import SummaryCards from '@/src/components/SummaryCards';
import WalletSection from '@/src/components/WalletSection';
import CategorySection from '@/src/components/CategorySection';
import ExpenseChart from '@/src/components/ExpenseChart';
import TransactionSection from '@/src/components/TransactionSection';
import TransferSection from '@/src/components/TransferSection';
import BudgetSection from '@/src/components/BudgetSection';
import SavingsSection from '@/src/components/SavingsSection';
import RecurringSection from '@/src/components/RecurringSection';
import MonthlyTrendChart from '@/src/components/MonthlyTrendChart';
import AuthSection from '@/src/components/AuthSection';
import { exportTransactionsToCSV } from '@/src/utils/exportCsv';

interface Wallet {
  id: number;
  name: string;
  balance: number;
}

interface Category {
  id: number;
  name: string;
}

interface SavingsGoal {
  id: number;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate?: string;
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

interface Budget {
  id: number;
  categoryId: number;
  categoryName: string;
  amount: number;
  spent: number;
  percentage: number;
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

export default function Home() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');

  const [recurringList, setRecurringList] = useState<RecurringTransaction[]>([]);

  const [currentMonth, setCurrentMonth] = useState<number>(0);
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [isClient, setIsClient] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // State Modal Ganti Password
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const [walletName, setWalletName] = useState('');
  const [initialBalance, setInitialBalance] = useState('');
  const [categoryName, setCategoryName] = useState('');

  const [amount, setAmount] = useState('');
  const [type, setType] = useState('0');
  const [description, setDescription] = useState('');
  const [selectedWalletId, setSelectedWalletId] = useState('');
  const [categoryId, setCategoryId] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [filterWalletId, setFilterWalletId] = useState('');
  const [filterType, setFilterType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchData = async () => {
    try {
      const now = new Date();
      const month = now.getMonth() + 1;
      const year = now.getFullYear();

      const walletsData = await getWallets();
      const categoriesData = await getCategories();
      const txData = await getTransactions();
      const budgetsData = await getBudgets(month, year);
      const goalsData = await getSavingsGoals();
      const recurringData = await getRecurringTransactions();
      
      setWallets(walletsData);
      setCategories(categoriesData);
      setTransactions(txData);
      setBudgets(budgetsData);
      setSavingsGoals(goalsData);
      setRecurringList(recurringData);

      if (walletsData.length > 0 && !selectedWalletId) {
        setSelectedWalletId(walletsData[0].id.toString());
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsClient(true);
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('username');
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    if (token) {
      setIsAuthenticated(true);
      if (storedUser) setUsername(storedUser);
      const now = new Date();
      setCurrentMonth(now.getMonth());
      setCurrentYear(now.getFullYear());
      fetchData();
    } else {
      setLoading(false);
    }
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      setDarkMode(false);
      localStorage.setItem('theme', 'light');
      document.documentElement.classList.remove('dark');
    } else {
      setDarkMode(true);
      localStorage.setItem('theme', 'dark');
      document.documentElement.classList.add('dark');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsAuthenticated(false);
    showToast('Berhasil logout.');
  };

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      showToast('Semua kolom harus diisi!', 'error');
      return;
    }

    try {
      setIsChangingPassword(true);
      await changePassword({ currentPassword, newPassword });
      setCurrentPassword('');
      setNewPassword('');
      setShowPasswordModal(false);
      showToast('Kata sandi berhasil diperbarui!');
    } catch (error: any) {
      showToast(error.message || 'Gagal mengubah kata sandi', 'error');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleAddWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletName) return;
    try {
      await createWallet({ name: walletName, balance: parseFloat(initialBalance) || 0 });
      setWalletName('');
      setInitialBalance('');
      fetchData();
      showToast('Dompet berhasil ditambahkan!');
    } catch (error) {
      showToast('Gagal menambah dompet', 'error');
    }
  };

  const handleDeleteWallet = async (id: number) => {
    if (!confirm('Yakin ingin menghapus dompet ini?')) return;
    try {
      await deleteWallet(id);
      fetchData();
      showToast('Dompet berhasil dihapus!');
    } catch (error) {
      showToast('Gagal menghapus dompet', 'error');
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName) return;
    try {
      await createCategory({ name: categoryName });
      setCategoryName('');
      fetchData();
      showToast('Kategori berhasil ditambahkan!');
    } catch (error) {
      showToast('Gagal menambah kategori', 'error');
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm('Yakin ingin menghapus kategori ini?')) return;
    try {
      await deleteCategory(id);
      fetchData();
      showToast('Kategori berhasil dihapus!');
    } catch (error) {
      showToast('Gagal menghapus kategori', 'error');
    }
  };

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description || !selectedWalletId) return;
    try {
      await createTransaction({
        amount: parseFloat(amount),
        type: parseInt(type),
        description,
        walletId: parseInt(selectedWalletId),
        categoryId: categoryId ? parseInt(categoryId) : null,
      });
      setAmount('');
      setDescription('');
      setCategoryId('');
      fetchData();
      showToast('Transaksi berhasil dicatat!');
    } catch (error) {
      showToast('Gagal mencatat transaksi', 'error');
    }
  };

  const handleDeleteTransaction = async (id: number) => {
    if (!confirm('Yakin ingin menghapus transaksi ini?')) return;
    try {
      await deleteTransaction(id);
      fetchData();
      showToast('Transaksi berhasil dihapus!');
    } catch (error) {
      showToast('Gagal menghapus transaksi', 'error');
    }
  };

  const totalBalance = wallets.reduce((acc, w) => acc + w.balance, 0);

  const currentMonthTransactions = isClient ? transactions.filter((tx) => {
    const txDate = new Date(tx.date);
    return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear;
  }) : [];

  const totalIncome = currentMonthTransactions
    .filter((tx) => tx.type === 0)
    .reduce((acc, tx) => acc + tx.amount, 0);

  const totalExpense = currentMonthTransactions
    .filter((tx) => tx.type === 1)
    .reduce((acc, tx) => acc + tx.amount, 0);

  const expenseChartData = categories.map((cat) => {
    const total = transactions
      .filter((tx) => tx.type === 1 && tx.categoryId === cat.id)
      .reduce((acc, tx) => acc + tx.amount, 0);
    return { name: cat.name, total: total };
  }).filter((item) => item.total > 0);

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch = tx.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesWallet = filterWalletId === '' || tx.walletId.toString() === filterWalletId;
    const matchesType = filterType === '' || tx.type.toString() === filterType;
    
    const txDateOnly = tx.date.split('T')[0];
    const matchesStartDate = startDate === '' || txDateOnly >= startDate;
    const matchesEndDate = endDate === '' || txDateOnly <= endDate;

    return matchesSearch && matchesWallet && matchesType && matchesStartDate && matchesEndDate;
  });

  if (isClient && !isAuthenticated) {
    return (
      <>
        <AuthSection 
          onLoginSuccess={() => {
            setIsAuthenticated(true);
            setUsername(localStorage.getItem('username') || '');
            fetchData();
          }} 
          showToast={showToast} 
        />
        {toast && (
          <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-xl border text-white font-medium transition-all duration-300 flex items-center space-x-2 ${
            toast.type === 'success' ? 'bg-emerald-600 border-emerald-700' : 'bg-red-600 border-red-700'
          }`}>
            <span>{toast.type === 'success' ? '✅' : '❌'}</span>
            <span>{toast.message}</span>
          </div>
        )}
      </>
    );
  }

  return (
    <main className={`min-h-screen p-8 transition-colors relative ${darkMode ? 'bg-gray-950 text-white' : 'bg-gray-50 text-black'}`}>
      <div className="max-w-5xl mx-auto space-y-8">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">💰 Personal Finance Dashboard</h1>
            {username && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Halo, <span className="font-semibold text-indigo-600 dark:text-indigo-400">{username}</span> 👋</p>}
          </div>
          
          <div className="flex items-center gap-3 flex-wrap">
            {/* Tombol Ganti Password */}
            <button
              onClick={() => setShowPasswordModal(true)}
              className="bg-indigo-50 dark:bg-indigo-950 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-medium px-4 py-2 rounded-xl text-sm transition border border-indigo-200 dark:border-indigo-800 flex items-center gap-2"
            >
              🔐 Ganti Password
            </button>

            {/* Tombol Toggle Dark Mode */}
            <button
              onClick={toggleDarkMode}
              className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-yellow-400 font-medium px-4 py-2 rounded-xl text-sm transition border border-gray-200 dark:border-gray-700 flex items-center gap-2"
              title="Ubah Tema"
            >
              {darkMode ? '☀️ Light' : '🌙 Dark'}
            </button>

            {/* Tombol Ekspor CSV */}
            <button
              onClick={() => exportTransactionsToCSV(filteredTransactions, 'Laporan_Keuangan_Pribadi.csv')}
              className="bg-emerald-50 dark:bg-emerald-950 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-700 dark:text-emerald-300 font-medium px-4 py-2 rounded-xl text-sm transition border border-emerald-200 dark:border-emerald-800 flex items-center gap-2"
            >
              📥 Ekspor CSV
            </button>

            {/* Tombol Logout */}
            <button
              onClick={handleLogout}
              className="bg-red-50 dark:bg-red-950 hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400 font-medium px-4 py-2 rounded-xl text-sm transition border border-red-200 dark:border-red-800"
            >
              🚪 Logout
            </button>
          </div>
        </div>

        <SummaryCards totalBalance={totalBalance} totalIncome={totalIncome} totalExpense={totalExpense} />
        <MonthlyTrendChart transactions={transactions} currentYear={currentYear} />
        <ExpenseChart data={expenseChartData} />
        
        <WalletSection 
          wallets={wallets} loading={loading} walletName={walletName} setWalletName={setWalletName}
          initialBalance={initialBalance} setInitialBalance={setInitialBalance}
          handleAddWallet={handleAddWallet} handleDeleteWallet={handleDeleteWallet}
        />

        <TransferSection wallets={wallets} onTransferSuccess={fetchData} showToast={showToast} transferService={transferBalance} />

        <BudgetSection 
          categories={categories} budgets={budgets} currentMonth={currentMonth} currentYear={currentYear}
          onBudgetChange={fetchData} showToast={showToast} upsertBudgetService={upsertBudget} deleteBudgetService={deleteBudget}
        />

        <SavingsSection 
          goals={savingsGoals}
          onGoalChange={fetchData}
          showToast={showToast}
          createGoalService={createSavingsGoal}
          depositService={depositSavingsGoal}
          deleteGoalService={deleteSavingsGoal}
        />

        <RecurringSection 
          recurringList={recurringList}
          wallets={wallets}
          categories={categories}
          onRefresh={fetchData}
          showToast={showToast}
          createService={createRecurringTransaction}
          deleteService={deleteRecurringTransaction}
          processService={processDueRecurringTransactions}
        />

        <CategorySection 
          categories={categories} categoryName={categoryName} setCategoryName={setCategoryName}
          handleAddCategory={handleAddCategory} handleDeleteCategory={handleDeleteCategory}
        />

        <TransactionSection 
          wallets={wallets}
          categories={categories}
          filteredTransactions={filteredTransactions}
          selectedWalletId={selectedWalletId}
          setSelectedWalletId={setSelectedWalletId}
          type={type}
          setType={setType}
          categoryId={categoryId}
          setCategoryId={setCategoryId}
          amount={amount}
          setAmount={setAmount}
          description={description}
          setDescription={setDescription}
          handleAddTransaction={handleAddTransaction}
          handleDeleteTransaction={handleDeleteTransaction}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterWalletId={filterWalletId}
          setFilterWalletId={setFilterWalletId}
          filterType={filterType}
          setFilterType={setFilterType}
          startDate={startDate}      
          setStartDate={setStartDate} 
          endDate={endDate}          
          setEndDate={setEndDate}    
        />

      </div>

      {/* Modal Ganti Password */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">🔐 Ganti Kata Sandi</h3>
              <button 
                onClick={() => setShowPasswordModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Kata Sandi Saat Ini</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 border dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-black dark:text-white text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Kata Sandi Baru</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 border dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-black dark:text-white text-sm"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition disabled:bg-indigo-300 cursor-pointer shadow-sm"
                >
                  {isChangingPassword ? 'Menyimpan...' : 'Simpan Password Baru'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-xl border text-white font-medium transition-all duration-300 flex items-center space-x-2 ${
          toast.type === 'success' ? 'bg-emerald-600 border-emerald-700' : 'bg-red-600 border-red-700'
        }`}>
          <span>{toast.type === 'success' ? '✅' : '❌'}</span>
          <span>{toast.message}</span>
        </div>
      )}
    </main>
  );
}