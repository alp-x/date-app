"use client";

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'white';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md',
  color = 'blue'
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const colorClasses = {
    blue: 'text-blue-500',
    white: 'text-white'
  };

  return (
    <div role="status" className={`loading-spinner ${sizeClasses[size]} ${colorClasses[color]}`}>
      <span className="sr-only">Yükleniyor...</span>
    </div>
  );
};

export default LoadingSpinner; 