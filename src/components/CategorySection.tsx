interface Category {
  id: number;
  name: string;
}

interface CategorySectionProps {
  categories: Category[];
  categoryName: string;
  setCategoryName: (name: string) => void;
  handleAddCategory: (e: React.FormEvent) => void;
  handleDeleteCategory: (id: number) => void;
}

export default function CategorySection({
  categories,
  categoryName,
  setCategoryName,
  handleAddCategory,
  handleDeleteCategory,
}: CategorySectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Daftar Kategori */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Daftar Kategori</h2>
        {categories.length === 0 ? (
          <p className="text-gray-500">Belum ada kategori terdaftar.</p>
        ) : (
          <ul className="space-y-3 max-h-[250px] overflow-y-auto">
            {categories.map((cat) => (
              <li key={cat.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-800">{cat.name}</span>
                <button
                  onClick={() => handleDeleteCategory(cat.id)}
                  className="text-red-500 hover:text-red-700 text-sm font-semibold px-2 py-1 bg-red-50 rounded transition"
                  title="Hapus Kategori"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Tambah Kategori Baru */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Tambah Kategori Baru</h2>
        <form onSubmit={handleAddCategory} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Nama Kategori</label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Contoh: Transportasi, Makanan, Gaji"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-lg font-medium hover:bg-purple-700 transition"
          >
            Simpan Kategori
          </button>
        </form>
      </div>
    </div>
  );
}