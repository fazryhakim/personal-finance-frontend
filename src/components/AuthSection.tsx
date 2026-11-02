'use client';

import { useState } from 'react';
import { loginUser, registerUser } from '@/src/services/api';

interface Props {
  onLoginSuccess: () => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export default function AuthSection({ onLoginSuccess, showToast }: Props) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;

    setLoading(true);
    try {
      if (isLogin) {
        await loginUser({ username, password });
        showToast('Login berhasil! Selamat datang kembali.');
        onLoginSuccess();
      } else {
        await registerUser({ username, password });
        showToast('Registrasi berhasil! Silakan login.');
        setIsLogin(true);
        setPassword('');
      }
    } catch (err: any) {
      showToast(err.message || 'Terjadi kesalahan', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-gray-800">
            {isLogin ? '🔐 Login Dashboard' : '📝 Buat Akun Baru'}
          </h1>
          <p className="text-sm text-gray-500">
            {isLogin ? 'Masuk untuk mengakses data keuangan Anda' : 'Daftar akun untuk mulai mengelola keuangan'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2.5 border rounded-xl text-sm bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              placeholder="Masukkan username"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 border rounded-xl text-sm bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              placeholder="Masukkan password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-xl transition shadow-sm disabled:opacity-50"
          >
            {loading ? 'Memproses...' : (isLogin ? 'Masuk' : 'Daftar')}
          </button>
        </form>

        <div className="text-center">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-indigo-600 hover:underline font-medium"
          >
            {isLogin ? 'Belum punya akun? Daftar di sini' : 'Sudah punya akun? Login di sini'}
          </button>
        </div>
      </div>
    </div>
  );
}