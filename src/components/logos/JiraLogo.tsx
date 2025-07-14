
import React from 'react';

interface JiraLogoProps {
  className?: string;
  size?: number;
}

const JiraLogo: React.FC<JiraLogoProps> = ({ className = "", size = 24 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path d="M11.571 11.513H0a5.218 5.218 0 0 0 5.232 5.215h2.13v2.127A5.22 5.22 0 0 0 12.575 24c.286 0 .57-.019.848-.06a5.22 5.22 0 0 0 4.367-5.155V7.269a5.22 5.22 0 0 0-5.219-5.22c-.286 0-.57.02-.848.06a5.22 5.22 0 0 0-4.367 5.156v4.248z" fill="#2684FF"/>
      <path d="M5.232 11.513H0a5.218 5.218 0 0 0 5.232 5.215h2.13v2.127A5.22 5.22 0 0 0 12.575 24V12.477a5.22 5.22 0 0 0-5.219-5.22c-.286 0-.57.02-.848.06a5.22 5.22 0 0 0-4.367 5.156v-.96z" fill="#2684FF"/>
    </svg>
  );
};

export default JiraLogo;
