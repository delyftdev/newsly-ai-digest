
import React from 'react';

interface LinearLogoProps {
  className?: string;
  size?: number;
}

const LinearLogo: React.FC<LinearLogoProps> = ({ className = "", size = 24 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12z" fill="url(#a)"/>
      <path d="M9.12 8.4c-.36.36-.36.96 0 1.32l4.2 4.2c.36.36.96.36 1.32 0s.36-.96 0-1.32l-4.2-4.2c-.36-.36-.96-.36-1.32 0z" fill="#fff"/>
      <defs>
        <linearGradient id="a" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#5E6AD2"/>
          <stop offset="1" stopColor="#A855F7"/>
        </linearGradient>
      </defs>
    </svg>
  );
};

export default LinearLogo;
