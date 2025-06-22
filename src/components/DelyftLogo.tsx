
import React from 'react';

interface DelyftLogoProps {
  className?: string;
  size?: number;
}

const DelyftLogo: React.FC<DelyftLogoProps> = ({ className = "", size = 32 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background circle */}
      <circle cx="50" cy="50" r="45" fill="currentColor" />
      
      {/* Letter D shape */}
      <path
        d="M25 20 L25 80 L50 80 Q75 80 75 50 Q75 20 50 20 L25 20 Z"
        fill="white"
        strokeWidth="2"
      />
      
      {/* Inner curve detail */}
      <path
        d="M35 30 L45 30 Q60 30 60 50 Q60 70 45 70 L35 70"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
};

export default DelyftLogo;
