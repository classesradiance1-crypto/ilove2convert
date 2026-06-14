import Link from "next/link";

export default function DonateSuccessPage({
  searchParams,
}: {
  searchParams: { amount?: string };
}) {
  const dollars = searchParams.amount
    ? (parseInt(searchParams.amount) / 100).toFixed(2)
    : null;

  return (
    <div className="bg-[#f5f5f5] min-h-screen flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 max-w-md w-full text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Thank you!</h1>
        {dollars && (
          <p className="text-[#e8394d] font-bold text-xl mb-3">${dollars} donated</p>
        )}
        <p className="text-gray-500 mb-8">
          Your support keeps ILove2Convert free for everyone. We really appreciate it!
        </p>
        <Link
          href="/"
          className="inline-block bg-[#e8394d] text-white font-bold px-8 py-3 rounded-full hover:bg-[#d42a3e] transition-colors"
        >
          Back to Tools
        </Link>
      </div>
    </div>
  );
}
