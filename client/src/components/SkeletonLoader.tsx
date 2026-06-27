import React from 'react';

interface SkeletonLoaderProps {
  count?: number;
  type?: 'card' | 'row' | 'text' | 'circle';
  height?: string;
  width?: string;
}

export function SkeletonLoader({
  count = 1,
  type = 'card',
  height = 'h-20',
  width = 'w-full',
}: SkeletonLoaderProps) {
  const skeletons = Array.from({ length: count });

  if (type === 'circle') {
    return (
      <div className="flex gap-4">
        {skeletons.map((_, i) => (
          <div
            key={i}
            className="w-12 h-12 rounded-full bg-gradient-to-r from-gray-200 to-gray-100 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (type === 'text') {
    return (
      <div className="space-y-3">
        {skeletons.map((_, i) => (
          <div
            key={i}
            className={`${width} h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded-md animate-pulse`}
          />
        ))}
      </div>
    );
  }

  if (type === 'row') {
    return (
      <div className="space-y-4">
        {skeletons.map((_, i) => (
          <div
            key={i}
            className="flex gap-4 p-4 bg-white rounded-lg border border-gray-100"
          >
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-gray-200 to-gray-100 animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded-md animate-pulse w-3/4" />
              <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-100 rounded-md animate-pulse w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default card skeleton
  return (
    <div className="space-y-4">
      {skeletons.map((_, i) => (
        <div
          key={i}
          className={`${width} ${height} bg-gradient-to-r from-gray-200 to-gray-100 rounded-xl animate-pulse`}
        />
      ))}
    </div>
  );
}
