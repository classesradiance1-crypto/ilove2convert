import Link from "next/link";

export default function PremiumBanner() {
  return (
    <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-100 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="text-4xl">❤️</div>
        <div>
          <p className="font-bold text-gray-800">All tools are free, forever</p>
          <p className="text-sm text-gray-500">If this saved you time, consider a small donation to keep the servers running.</p>
        </div>
      </div>
      <Link
        href="/donate"
        className="shrink-0 bg-[#e8394d] hover:bg-[#d42a3e] text-white font-bold px-6 py-2.5 rounded-full transition-colors text-sm"
      >
        Donate ❤️
      </Link>
    </div>
  );
}
