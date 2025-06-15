function SkeletonLoader({ count = 3, type = 'default', className = '' }) {
  const skeletonTypes = {
    default: (
      <div className="animate-pulse space-y-3">
        <div className="h-4 bg-surface-200 rounded w-3/4"></div>
        <div className="h-4 bg-surface-200 rounded w-1/2"></div>
        <div className="h-4 bg-surface-200 rounded w-5/6"></div>
      </div>
    ),
    card: (
      <div className="animate-pulse bg-white rounded-xl p-6 shadow-sm border border-surface-100">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-surface-200 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-surface-200 rounded w-3/4"></div>
            <div className="h-3 bg-surface-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    ),
    table: (
      <div className="animate-pulse">
        <div className="space-y-3">
          <div className="grid grid-cols-4 gap-4">
            <div className="h-4 bg-surface-200 rounded"></div>
            <div className="h-4 bg-surface-200 rounded"></div>
            <div className="h-4 bg-surface-200 rounded"></div>
            <div className="h-4 bg-surface-200 rounded"></div>
          </div>
        </div>
      </div>
    ),
    clockButton: (
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-48 h-48 bg-surface-200 rounded-full mb-4"></div>
        <div className="h-6 bg-surface-200 rounded w-32 mb-2"></div>
        <div className="h-4 bg-surface-200 rounded w-24"></div>
      </div>
    )
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {[...Array(count)].map((_, i) => (
        <div key={i}>
          {skeletonTypes[type]}
        </div>
      ))}
    </div>
  );
}

export default SkeletonLoader;