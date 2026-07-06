export default function LoadingSpinner({ text = '加载中...' }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <div className="relative">
        <div className="w-10 h-10 rounded-full border-2 border-orange-100" />
        <div className="w-10 h-10 rounded-full border-2 border-transparent border-t-[#FF6B35] animate-spin absolute inset-0" />
      </div>
      <p className="text-sm text-gray-400">{text}</p>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 space-y-3">
      <div className="skeleton h-4 w-2/3" />
      <div className="skeleton h-3 w-full" />
      <div className="skeleton h-3 w-5/6" />
      <div className="flex gap-2 mt-2">
        <div className="skeleton h-6 w-16" />
        <div className="skeleton h-6 w-20" />
        <div className="skeleton h-6 w-14" />
      </div>
    </div>
  );
}

export function SkeletonLine({ width = '100%' }: { width?: string }) {
  return <div className="skeleton h-4" style={{ width }} />;
}
