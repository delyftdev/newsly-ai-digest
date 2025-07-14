
import React from 'react';

interface GmailLogoProps {
  className?: string;
  size?: number;
}

const GmailLogo: React.FC<GmailLogoProps> = ({ className = "", size = 24 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h.182L12 10.91l10.182-7.09h.182c.904 0 1.636.732 1.636 1.636z" fill="#EA4335"/>
    </svg>
  );
};

export default GmailLogo;
