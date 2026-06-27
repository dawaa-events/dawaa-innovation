import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'pulse' | 'dots' | 'bars';
  text?: string;
}

export function LoadingSpinner({
  size = 'md',
  variant = 'default',
  text,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  if (variant === 'dots') {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-gradient-to-r from-purple-600 to-purple-400 rounded-full animate-bounce"
              style={{
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>
        {text && (
          <p className={`${textSizeClasses[size]} text-gray-600`}>{text}</p>
        )}
      </div>
    );
  }

  if (variant === 'bars') {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-1 items-end h-8">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-1 bg-gradient-to-t from-purple-600 to-purple-400 rounded-full"
              style={{
                height: `${20 + i * 10}px`,
                animation: `bounce 1.4s infinite`,
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>
        {text && (
          <p className={`${textSizeClasses[size]} text-gray-600`}>{text}</p>
        )}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-r from-purple-600 to-purple-400 animate-pulse`} />
        {text && (
          <p className={`${textSizeClasses[size]} text-gray-600`}>{text}</p>
        )}
      </div>
    );
  }

  // Default spinner
  return (
    <div className="flex flex-col items-center gap-4">
      <div className={`${sizeClasses[size]} relative`}>
        <svg
          className="w-full h-full animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75 text-purple-600"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
      {text && (
        <p className={`${textSizeClasses[size]} text-gray-600`}>{text}</p>
      )}
    </div>
  );
}
