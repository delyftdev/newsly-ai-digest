
import React from 'react';

interface IntercomLogoProps {
  className?: string;
  size?: number;
}

const IntercomLogo: React.FC<IntercomLogoProps> = ({ className = "", size = 24 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path d="M12.5 2C18.85 2 24 7.184 24 13.5S18.85 25 12.5 25 1 19.816 1 13.5 6.15 2 12.5 2zM12.5 0C5.596 0 0 5.596 0 12.5S5.596 25 12.5 25 25 19.404 25 12.5 19.404 0 12.5 0zm-6.441 8.858c-.441 0-.8.359-.8.8v5.184c0 .441.359.8.8.8s.8-.359.8-.8V9.658c0-.441-.359-.8-.8-.8zm2.4 1.6c-.441 0-.8.359-.8.8v3.584c0 .441.359.8.8.8s.8-.359.8-.8v-3.584c0-.441-.359-.8-.8-.8zm2.4-3.2c-.441 0-.8.359-.8.8v7.984c0 .441.359.8.8.8s.8-.359.8-.8V8.058c0-.441-.359-.8-.8-.8zm2.4 1.6c-.441 0-.8.359-.8.8v4.784c0 .441.359.8.8.8s.8-.359.8-.8V9.658c0-.441-.359-.8-.8-.8zm2.4 1.6c-.441 0-.8.359-.8.8v1.584c0 .441.359.8.8.8s.8-.359.8-.8v-1.584c0-.441-.359-.8-.8-.8z" fill="#4F46E5"/>
    </svg>
  );
};

export default IntercomLogo;
