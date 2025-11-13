import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-5xl font-bold mb-4">404 - Halaman Tidak Ditemukan</h1>
      <p className="text-gray-500 mb-6">Oops... Sepertinya halaman yang kamu cari tidak ada.</p>
      <Link href="/" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
        Kembali ke Beranda
      </Link>
    </div>
  )
}
