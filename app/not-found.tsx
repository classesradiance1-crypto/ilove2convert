import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <div className="text-6xl mb-4">📄</div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Tool not found</h1>
      <p className="text-gray-500 mb-6">The tool you&apos;re looking for doesn&apos;t exist.</p>
      <Link href="/" className="bg-[#e8394d] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#d42a3e] transition-colors">
        Back to Home
      </Link>
    </div>
  );
}
