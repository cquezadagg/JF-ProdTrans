
export function SkeletonCard() {

  return (
    <div className="animate-pulse bg-gray-200 rounded-lg p-5">
      <div className="h-6 bg-gray-300 rounded mb-4 w-1/2"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        <div className="h-4 bg-gray-300 rounded w-5/6"></div>
        <div className="pt-4">
          <div className="h-10 bg-gray-300 rounded w-full mb-2"></div>
          <div className="h-10 bg-gray-300 rounded w-full"></div>
        </div>
      </div>
    </div>
  );
}
