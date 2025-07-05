
import React from 'react';

const ChangelogSvg = () => {
  return (
    <svg viewBox="0 0 400 320" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        {/* Premium dark gradient background */}
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:"#0a0a0a", stopOpacity:1}} />
          <stop offset="30%" style={{stopColor:"#111111", stopOpacity:1}} />
          <stop offset="70%" style={{stopColor:"#0d1117", stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:"#050505", stopOpacity:1}} />
        </linearGradient>
        
        {/* Card gradient */}
        <linearGradient id="cardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:"#1c1c1c", stopOpacity:1}} />
          <stop offset="50%" style={{stopColor:"#21262d", stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:"#161b22", stopOpacity:1}} />
        </linearGradient>
        
        {/* Content area gradient */}
        <linearGradient id="contentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:"#0d1117", stopOpacity:1}} />
          <stop offset="50%" style={{stopColor:"#161b22", stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:"#0a0e13", stopOpacity:1}} />
        </linearGradient>
        
        {/* Changelog entry gradient */}
        <linearGradient id="entryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:"#1a1f26", stopOpacity:1}} />
          <stop offset="50%" style={{stopColor:"#21262d", stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:"#161b22", stopOpacity:1}} />
        </linearGradient>
        
        {/* Green glow effect */}
        <filter id="greenGlow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        {/* AI sparkle animation */}
        <g id="sparkle">
          <circle cx="0" cy="0" r="1.5" fill="#00d4ff" opacity="0.9">
            <animate attributeName="r" values="1;2.5;1" dur="1.5s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.6;1;0.6" dur="1.5s" repeatCount="indefinite"/>
          </circle>
        </g>
      </defs>
      
      {/* Background */}
      <rect width="400" height="320" fill="url(#bgGradient)" rx="12"/>
      
      {/* Header */}
      <rect x="20" y="20" width="360" height="45" fill="url(#cardGradient)" rx="8" stroke="#30363d" strokeWidth="1"/>
      <text x="30" y="47" fill="#f0f6fc" fontFamily="system-ui, -apple-system, sans-serif" fontSize="18" fontWeight="600">Product Changelogs</text>
      
      {/* AI Assistant Badge */}
      <rect x="280" y="30" width="90" height="24" fill="#1f2937" rx="12" stroke="#374151" strokeWidth="1"/>
      <circle cx="295" cy="42" r="6" fill="none" stroke="#00d4ff" strokeWidth="1.5" opacity="0.9"/>
      <circle cx="292" cy="40" r="1" fill="#00d4ff"/>
      <circle cx="298" cy="40" r="1" fill="#00d4ff"/>
      <path d="M 292 44 Q 295 46 298 44" stroke="#00d4ff" strokeWidth="1" fill="none"/>
      <text x="310" y="47" fill="#9ca3af" fontFamily="system-ui, -apple-system, sans-serif" fontSize="10" fontWeight="500">AI Writer</text>
      
      {/* AI processing animation */}
      <g transform="translate(295, 42)">
        <animateTransform attributeName="transform" attributeType="XML" type="rotate" 
                          values="0 0 0;360 0 0" dur="4s" repeatCount="indefinite"/>
      </g>
      
      {/* AI Sparkles */}
      <use href="#sparkle" transform="translate(275, 35)">
        <animateTransform attributeName="transform" type="translate" 
                          values="275 35;280 30;275 35" dur="2s" repeatCount="indefinite"/>
      </use>
      <use href="#sparkle" transform="translate(375, 40)">
        <animateTransform attributeName="transform" type="translate" 
                          values="375 40;370 35;375 40" dur="2.5s" repeatCount="indefinite"/>
      </use>
      
      {/* Content Generation Area */}
      <rect x="20" y="85" width="360" height="100" fill="url(#contentGradient)" rx="8" stroke="#21262d" strokeWidth="1"/>
      
      {/* AI Writing Progress */}
      <text x="30" y="105" fill="#6e7681" fontFamily="system-ui, -apple-system, sans-serif" fontSize="11" fontWeight="500">✨ AI Writing Assistant</text>
      
      {/* Typing animation lines */}
      <g id="typingLines">
        <rect x="30" y="115" width="0" height="2" fill="#00d4ff" rx="1">
          <animate attributeName="width" values="0;220;220" dur="3s" repeatCount="indefinite"/>
        </rect>
        <rect x="30" y="125" width="0" height="2" fill="#7c3aed" rx="1">
          <animate attributeName="width" values="0;0;180" dur="3s" begin="0.5s" repeatCount="indefinite"/>
        </rect>
        <rect x="30" y="135" width="0" height="2" fill="#059669" rx="1">
          <animate attributeName="width" values="0;0;200" dur="3s" begin="1s" repeatCount="indefinite"/>
        </rect>
        <rect x="30" y="145" width="0" height="2" fill="#f59e0b" rx="1">
          <animate attributeName="width" values="0;0;160" dur="3s" begin="1.5s" repeatCount="indefinite"/>
        </rect>
      </g>
      
      {/* Status text */}
      <text x="30" y="170" fill="#6e7681" fontFamily="system-ui, -apple-system, sans-serif" fontSize="10" opacity="0">
        Generating changelog content...
        <animate attributeName="opacity" values="0;0;1;1;0" dur="4s" repeatCount="indefinite"/>
      </text>
      
      {/* Arrow pointing down */}
      <g transform="translate(192, 200)" opacity="0">
        <path d="M 0 0 L 6 6 L 12 0" stroke="#00d4ff" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <animateTransform attributeName="transform" type="translate" 
                          values="192 195;192 205;192 195" dur="1s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0;0;0.8;0.8;0" dur="5s" repeatCount="indefinite"/>
      </g>
      
      {/* Changelog Entry */}
      <g transform="translate(0, 225)" opacity="0">
        <rect x="20" y="0" width="360" height="40" fill="url(#entryGradient)" rx="8" stroke="#30363d" strokeWidth="1"/>
        
        {/* Feature icon with glow */}
        <circle cx="38" cy="20" r="8" fill="#238636" filter="url(#greenGlow)"/>
        <text x="38" y="24" fill="white" fontFamily="system-ui, -apple-system, sans-serif" fontSize="10" textAnchor="middle" fontWeight="600">✨</text>
        
        {/* Content */}
        <text x="55" y="17" fill="#f0f6fc" fontFamily="system-ui, -apple-system, sans-serif" fontSize="14" fontWeight="600">
          Enhanced SSO Login Experience
        </text>
        <text x="55" y="30" fill="#7d8590" fontFamily="system-ui, -apple-system, sans-serif" fontSize="10">
          New Feature • Shared with customers
        </text>
        
        {/* Tags */}
        <rect x="250" y="12" width="45" height="16" fill="#1f2937" rx="8"/>
        <text x="272" y="22" fill="#9ca3af" fontFamily="system-ui, -apple-system, sans-serif" fontSize="8" textAnchor="middle">security</text>
        
        {/* Published badge */}
        <rect x="310" y="8" width="60" height="20" fill="#238636" rx="10" filter="url(#greenGlow)"/>
        <text x="340" y="20" fill="white" fontFamily="system-ui, -apple-system, sans-serif" fontSize="9" textAnchor="middle" fontWeight="700">PUBLISHED</text>
        
        {/* Entry animation */}
        <animate attributeName="opacity" values="0;0;0;0;1" dur="5s" repeatCount="indefinite"/>
        <animateTransform attributeName="transform" type="translate" 
                          values="0 240;0 240;0 240;0 240;0 225" dur="5s" repeatCount="indefinite"/>
      </g>
      
      {/* Notification indicator */}
      <circle cx="365" cy="35" r="5" fill="#f85149" opacity="0" filter="url(#greenGlow)">
        <animate attributeName="opacity" values="0;0;0;0;1;0" dur="6s" repeatCount="indefinite"/>
      </circle>
      <text x="365" y="38" fill="white" fontFamily="system-ui, -apple-system, sans-serif" fontSize="8" textAnchor="middle" opacity="0" fontWeight="600">1
        <animate attributeName="opacity" values="0;0;0;0;1;0" dur="6s" repeatCount="indefinite"/>
      </text>
      
      {/* Success message */}
      <text x="200" y="300" fill="#238636" fontFamily="system-ui, -apple-system, sans-serif" fontSize="12" textAnchor="middle" fontWeight="500" opacity="0">
        Changelog published • Users notified
        <animate attributeName="opacity" values="0;0;0;0;1;0" dur="6s" repeatCount="indefinite"/>
      </text>
    </svg>
  );
};

export default ChangelogSvg;
