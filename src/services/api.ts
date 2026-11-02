// Menggunakan API_URL (tanpa NEXT_PUBLIC_)
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://personalfinance-api.runasp.net';

// --- HELPER AUTH & SAFE JSON PARSER ---
function getAuthHeaders() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
}

async function handleApiResponse(res: Response) {
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { message: text };
  }

  if (!res.ok) {
    throw new Error(data?.message || data?.title || 'Terjadi kesalahan pada server');
  }

  return data;
}

// --- AUTH ---
export async function loginUser(credentials: { username: string; password: string }) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  const data = await handleApiResponse(res);
  localStorage.setItem('token', data.token);
  localStorage.setItem('username', data.username);
  return data;
}

export async function changePassword(data: { currentPassword: string; newPassword: string }) {
  const res = await fetch(`${API_URL}/auth/change-password`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleApiResponse(res);
}

export async function registerUser(credentials: { username: string; password: string }) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  return handleApiResponse(res);
}

// --- WALLETS ---
export async function getWallets() {
  const res = await fetch(`${API_URL}/wallets`, { headers: getAuthHeaders() });
  return handleApiResponse(res);
}

export async function createWallet(data: { name: string; balance: number }) {
  const res = await fetch(`${API_URL}/wallets`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleApiResponse(res);
}

export async function deleteWallet(id: number) {
  const res = await fetch(`${API_URL}/wallets/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  await handleApiResponse(res);
  return true;
}

export async function transferBalance(data: {
  sourceWalletId: number;
  targetWalletId: number;
  amount: number;
  description?: string;
}) {
  const res = await fetch(`${API_URL}/wallets/transfer`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleApiResponse(res);
}

// --- CATEGORIES ---
export async function getCategories() {
  const res = await fetch(`${API_URL}/categories`, { headers: getAuthHeaders() });
  return handleApiResponse(res);
}

export async function createCategory(data: { name: string }) {
  const res = await fetch(`${API_URL}/categories`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleApiResponse(res);
}

export async function deleteCategory(id: number) {
  const res = await fetch(`${API_URL}/categories/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  await handleApiResponse(res);
  return true;
}

// --- TRANSACTIONS ---
export async function getTransactions() {
  const res = await fetch(`${API_URL}/transactions`, { headers: getAuthHeaders() });
  return handleApiResponse(res);
}

export async function createTransaction(data: {
  amount: number;
  type: number;
  description: string;
  walletId: number;
  categoryId?: number | null;
}) {
  const res = await fetch(`${API_URL}/transactions`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleApiResponse(res);
}

export async function deleteTransaction(id: number) {
  const res = await fetch(`${API_URL}/transactions/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  await handleApiResponse(res);
  return true;
}

// --- BUDGETS ---
export async function getBudgets(month: number, year: number) {
  const res = await fetch(`${API_URL}/budgets?month=${month}&year=${year}`, { headers: getAuthHeaders() });
  return handleApiResponse(res);
}

export async function upsertBudget(data: {
  categoryId: number;
  amount: number;
  month: number;
  year: number;
}) {
  const res = await fetch(`${API_URL}/budgets`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleApiResponse(res);
}

export async function deleteBudget(id: number) {
  const res = await fetch(`${API_URL}/budgets/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  await handleApiResponse(res);
  return true;
}

// --- SAVINGS GOALS ---
export async function getSavingsGoals() {
  const res = await fetch(`${API_URL}/SavingsGoals`, { headers: getAuthHeaders() });
  return handleApiResponse(res);
}

export async function createSavingsGoal(data: { title: string; targetAmount: number; targetDate?: string }) {
  const res = await fetch(`${API_URL}/SavingsGoals`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleApiResponse(res);
}

export async function depositSavingsGoal(id: number, amount: number) {
  const res = await fetch(`${API_URL}/SavingsGoals/${id}/deposit`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ amount }),
  });
  return handleApiResponse(res);
}

export async function deleteSavingsGoal(id: number) {
  const res = await fetch(`${API_URL}/SavingsGoals/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  await handleApiResponse(res);
  return true;
}

// --- RECURRING TRANSACTIONS ---
export async function getRecurringTransactions() {
  const res = await fetch(`${API_URL}/recurringtransactions`, { headers: getAuthHeaders() });
  return handleApiResponse(res);
}

export async function createRecurringTransaction(data: {
  title: string;
  amount: number;
  type: number;
  walletId: number;
  categoryId?: number | null;
  dayOfMonth: number;
}) {
  const res = await fetch(`${API_URL}/recurringtransactions`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleApiResponse(res);
}

export async function deleteRecurringTransaction(id: number) {
  const res = await fetch(`${API_URL}/recurringtransactions/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  await handleApiResponse(res);
  return true;
}

export async function processDueRecurringTransactions() {
  const res = await fetch(`${API_URL}/recurringtransactions/process-due`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  return handleApiResponse(res);
}