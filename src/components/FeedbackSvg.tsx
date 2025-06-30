
import React from 'react';

const FeedbackSvg = () => {
  return (
    <svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        {/* Gradients */}
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:"#0f172a", stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:"#1e293b", stopOpacity:1}} />
        </linearGradient>
        
        <linearGradient id="cardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:"#334155", stopOpacity:0.8}} />
          <stop offset="100%" style={{stopColor:"#1e293b", stopOpacity:0.9}} />
        </linearGradient>
        
        <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:"#10b981", stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:"#059669", stopOpacity:1}} />
        </linearGradient>
        
        {/* Filters */}
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        <filter id="shadow">
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.3"/>
        </filter>
      </defs>
      
      {/* Background */}
      <rect width="100%" height="100%" fill="url(#bgGradient)"/>
      
      {/* Floating particles */}
      <circle r="2" fill="#10b981" opacity="0.6">
        <animate attributeName="cx" values="50;750;50" dur="8s" repeatCount="indefinite"/>
        <animate attributeName="cy" values="100;200;100" dur="8s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.3;0.8;0.3" dur="4s" repeatCount="indefinite"/>
      </circle>
      
      <circle r="1.5" fill="#3b82f6" opacity="0.5">
        <animate attributeName="cx" values="700;100;700" dur="10s" repeatCount="indefinite"/>
        <animate attributeName="cy" values="150;350;150" dur="10s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.2;0.7;0.2" dur="5s" repeatCount="indefinite"/>
      </circle>
      
      {/* Main Container */}
      <rect x="50" y="80" width="700" height="480" rx="16" fill="url(#cardGradient)" filter="url(#shadow)" opacity="0.95"/>
      
      {/* Header */}
      <text x="80" y="120" fontFamily="Arial, sans-serif" fontSize="28" fontWeight="bold" fill="#f1f5f9">
        Customer Feedback Portal
        <animate attributeName="opacity" values="0;1" dur="1s" fill="freeze"/>
      </text>
      
      {/* Submit Button */}
      <g transform="translate(580, 140)">
        <rect width="140" height="40" rx="8" fill="url(#greenGradient)" filter="url(#glow)">
          <animate attributeName="opacity" values="0;1" dur="1.5s" fill="freeze"/>
          <animateTransform attributeName="transform" type="scale" values="0.8;1.1;1" dur="0.6s" begin="1.5s" fill="freeze"/>
        </rect>
        <text x="70" y="26" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="bold" fill="white" textAnchor="middle">
          + Submit Idea
          <animate attributeName="opacity" values="0;1" dur="2s" fill="freeze"/>
        </text>
      </g>
      
      {/* Filter Tabs */}
      <g transform="translate(80, 200)">
        <rect width="60" height="32" rx="6" fill="#10b981" opacity="0.9">
          <animate attributeName="opacity" values="0;0.9" dur="2s" fill="freeze"/>
        </rect>
        <text x="30" y="22" fontFamily="Arial, sans-serif" fontSize="12" fontWeight="bold" fill="white" textAnchor="middle">
          Trending
          <animate attributeName="opacity" values="0;1" dur="2.2s" fill="freeze"/>
        </text>
        
        <rect x="80" width="40" height="32" rx="6" fill="#475569" opacity="0.7">
          <animate attributeName="opacity" values="0;0.7" dur="2.3s" fill="freeze"/>
        </rect>
        <text x="100" y="22" fontFamily="Arial, sans-serif" fontSize="12" fill="#cbd5e1" textAnchor="middle">
          New
          <animate attributeName="opacity" values="0;1" dur="2.5s" fill="freeze"/>
        </text>
        
        <rect x="140" width="35" height="32" rx="6" fill="#475569" opacity="0.7">
          <animate attributeName="opacity" values="0;0.7" dur="2.6s" fill="freeze"/>
        </rect>
        <text x="157" y="22" fontFamily="Arial, sans-serif" fontSize="12" fill="#cbd5e1" textAnchor="middle">
          Top
          <animate attributeName="opacity" values="0;1" dur="2.8s" fill="freeze"/>
        </text>
      </g>
      
      {/* Feedback Card */}
      <g transform="translate(80, 260)">
        <rect width="640" height="120" rx="12" fill="#1e293b" stroke="#334155" strokeWidth="1" filter="url(#shadow)">
          <animate attributeName="opacity" values="0;1" dur="1s" begin="3s" fill="freeze"/>
          <animateTransform attributeName="transform" type="translateY" values="20;0" dur="0.8s" begin="3s" fill="freeze"/>
        </rect>
        
        {/* Vote Button */}
        <g transform="translate(20, 20)">
          <rect width="50" height="80" rx="8" fill="#10b981" opacity="0.1" stroke="#10b981" strokeWidth="1">
            <animate attributeName="opacity" values="0;0.1" dur="1s" begin="3.5s" fill="freeze"/>
          </rect>
          
          {/* Thumbs up icon */}
          <path d="M25 35 L25 45 M20 40 L30 40 M25 30 L25 35 L20 35 Q18 35 18 37 Q18 40 20 40" 
                stroke="#10b981" strokeWidth="2" fill="none" strokeLinecap="round">
            <animate attributeName="opacity" values="0;1" dur="0.5s" begin="4s" fill="freeze"/>
            <animateTransform attributeName="transform" type="scale" values="1;1.2;1" dur="0.4s" begin="4.5s" fill="freeze"/>
          </path>
          
          <text x="25" y="68" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="bold" fill="#10b981" textAnchor="middle">
            1
            <animate attributeName="opacity" values="0;1" dur="0.5s" begin="4.2s" fill="freeze"/>
            <animateTransform attributeName="transform" type="scale" values="0.5;1.3;1" dur="0.6s" begin="4.5s" fill="freeze"/>
          </text>
        </g>
        
        {/* Content */}
        <g transform="translate(90, 20)">
          <text x="0" y="20" fontFamily="Arial, sans-serif" fontSize="18" fontWeight="bold" fill="#f1f5f9">
            Google Sign In
            <animate attributeName="opacity" values="0;1" dur="0.8s" begin="3.8s" fill="freeze"/>
          </text>
          
          <text x="0" y="45" fontFamily="Arial, sans-serif" fontSize="14" fill="#94a3b8">
            I would like to be able to sign in with Google
            <animate attributeName="opacity" values="0;1" dur="0.8s" begin="4.2s" fill="freeze"/>
          </text>
          
          {/* Tag */}
          <rect x="0" y="55" width="90" height="24" rx="4" fill="#374151">
            <animate attributeName="opacity" values="0;1" dur="0.5s" begin="4.5s" fill="freeze"/>
          </rect>
          <text x="45" y="70" fontFamily="Arial, sans-serif" fontSize="11" fill="#9ca3af" textAnchor="middle">
            #new-feature
            <animate attributeName="opacity" values="0;1" dur="0.5s" begin="4.7s" fill="freeze"/>
          </text>
        </g>
        
        {/* Status Badge */}
        <g transform="translate(520, 20)">
          <rect width="100" height="24" rx="12" fill="#374151">
            <animate attributeName="opacity" values="0;1" dur="0.5s" begin="5s" fill="freeze"/>
          </rect>
          <text x="50" y="16" fontFamily="Arial, sans-serif" fontSize="11" fill="#9ca3af" textAnchor="middle">
            Under Review
            <animate attributeName="opacity" values="0;1" dur="0.5s" begin="5.2s" fill="freeze"/>
          </text>
        </g>
      </g>
      
      {/* Interaction Animations */}
      {/* Cursor pointer */}
      <circle r="8" fill="#10b981" opacity="0.8">
        <animate attributeName="cx" values="500;520;540;560;580;600" dur="2s" begin="6s" fill="freeze"/>
        <animate attributeName="cy" values="400;380;360;340;320;300" dur="2s" begin="6s" fill="freeze"/>
        <animate attributeName="opacity" values="0;0.8;0.8;0.8;0.8;0" dur="2s" begin="6s" fill="freeze"/>
      </circle>
      
      {/* Click effect */}
      <circle r="0" fill="none" stroke="#10b981" strokeWidth="2" opacity="0">
        <animate attributeName="cx" values="600" dur="0.1s" begin="8s" fill="freeze"/>
        <animate attributeName="cy" values="300" dur="0.1s" begin="8s" fill="freeze"/>
        <animate attributeName="r" values="0;20;30" dur="0.5s" begin="8s" fill="freeze"/>
        <animate attributeName="opacity" values="0;0.8;0" dur="0.5s" begin="8s" fill="freeze"/>
      </circle>
      
      {/* New idea form popup */}
      <g transform="translate(250, 200)" opacity="0">
        <animate attributeName="opacity" values="0;0.95" dur="0.5s" begin="8.5s" fill="freeze"/>
        <animateTransform attributeName="transform" type="scale" values="0.8;1.05;1" dur="0.6s" begin="8.5s" fill="freeze"/>
        
        <rect width="300" height="200" rx="12" fill="#1e293b" stroke="#10b981" strokeWidth="2" filter="url(#shadow)"/>
        
        <text x="150" y="30" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="bold" fill="#f1f5f9" textAnchor="middle">
          Submit New Idea
        </text>
        
        {/* Form fields */}
        <rect x="20" y="45" width="260" height="32" rx="6" fill="#0f172a" stroke="#334155" strokeWidth="1"/>
        <text x="25" y="65" fontFamily="Arial, sans-serif" fontSize="12" fill="#64748b">
          Describe your idea in a few words
        </text>
        
        <rect x="20" y="85" width="260" height="60" rx="6" fill="#0f172a" stroke="#334155" strokeWidth="1"/>
        <text x="25" y="105" fontFamily="Arial, sans-serif" fontSize="12" fill="#64748b">
          Provide more details about your idea
        </text>
        
        {/* Submit button */}
        <rect x="200" y="160" width="80" height="28" rx="6" fill="url(#greenGradient)">
          <animate attributeName="opacity" values="0;1" dur="0.5s" begin="9s" fill="freeze"/>
        </rect>
        <text x="240" y="178" fontFamily="Arial, sans-serif" fontSize="12" fontWeight="bold" fill="white" textAnchor="middle">
          Submit Idea
        </text>
      </g>
      
      {/* Success animation */}
      <g transform="translate(400, 300)" opacity="0">
        <animate attributeName="opacity" values="0;1;0" dur="2s" begin="10s" fill="freeze"/>
        <animateTransform attributeName="transform" type="scale" values="0.5;1.2;1" dur="1s" begin="10s" fill="freeze"/>
        
        <circle r="30" fill="#10b981" opacity="0.2"/>
        <path d="M-10 0 L-3 7 L10 -7" stroke="#10b981" strokeWidth="3" fill="none" strokeLinecap="round"/>
      </g>
      
      {/* Footer text */}
      <text x="400" y="540" fontFamily="Arial, sans-serif" fontSize="14" fill="#64748b" textAnchor="middle" opacity="0">
        Collect, prioritize, and act on customer feedback
        <animate attributeName="opacity" values="0;0.8" dur="1s" begin="11s" fill="freeze"/>
      </text>
      
      {/* Floating feedback bubbles */}
      <g opacity="0">
        <animate attributeName="opacity" values="0;0.6;0" dur="3s" begin="12s" repeatCount="indefinite"/>
        
        <circle cx="150" cy="400" r="4" fill="#3b82f6">
          <animateTransform attributeName="transform" type="translateY" values="0;-100" dur="3s" begin="12s" repeatCount="indefinite"/>
        </circle>
        
        <circle cx="650" cy="450" r="3" fill="#10b981">
          <animateTransform attributeName="transform" type="translateY" values="0;-80" dur="2.5s" begin="12.5s" repeatCount="indefinite"/>
        </circle>
        
        <circle cx="300" cy="480" r="5" fill="#f59e0b">
          <animateTransform attributeName="transform" type="translateY" values="0;-120" dur="3.5s" begin="13s" repeatCount="indefinite"/>
        </circle>
      </g>
    </svg>
  );
};

export default FeedbackSvg;
