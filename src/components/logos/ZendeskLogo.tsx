
import React from 'react';

interface ZendeskLogoProps {
  className?: string;
  size?: number;
}

const ZendeskLogo: React.FC<ZendeskLogoProps> = ({ className = "", size = 24 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path d="M12.533 17.897L24 12.045V21.6c0 1.326-1.074 2.4-2.4 2.4h-9.067v-6.103zM11.467 6.103L0 11.955V2.4C0 1.074 1.074 0 2.4 0h9.067v6.103zM13.6 0h8.533V10.133L13.6 13.867zM10.4 24H1.867V13.867L10.4 10.133z" fill="#03363D"/>
    </svg>
  );
};

export default ZendeskLogo;
