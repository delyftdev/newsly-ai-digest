
import React from 'react';

const InsightsSvg = () => {
  return (
    <svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        {/* Gradients */}
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:"#0f172a", stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:"#1e293b", stopOpacity:1}} />
        </linearGradient>
        
        <linearGradient id="cardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:"#1e293b", stopOpacity:0.9}} />
          <stop offset="100%" style={{stopColor:"#334155", stopOpacity:0.8}} />
        </linearGradient>
        
        <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:"#10b981", stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:"#059669", stopOpacity:1}} />
        </linearGradient>
        
        <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:"#3b82f6", stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:"#1d4ed8", stopOpacity:1}} />
        </linearGradient>
        
        <linearGradient id="yellowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:"#f59e0b", stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:"#d97706", stopOpacity:1}} />
        </linearGradient>
        
        <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{stopColor:"#10b981", stopOpacity:0.6}} />
          <stop offset="100%" style={{stopColor:"#10b981", stopOpacity:0.1}} />
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
      
      {/* Floating data particles */}
      <circle r="2" fill="#10b981" opacity="0.4">
        <animate attributeName="cx" values="100;700;100" dur="12s" repeatCount="indefinite"/>
        <animate attributeName="cy" values="150;300;150" dur="12s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.2;0.6;0.2" dur="6s" repeatCount="indefinite"/>
      </circle>
      
      <circle r="1.5" fill="#3b82f6" opacity="0.3">
        <animate attributeName="cx" values="650;150;650" dur="10s" repeatCount="indefinite"/>
        <animate attributeName="cy" values="200;400;200" dur="10s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.1;0.5;0.1" dur="5s" repeatCount="indefinite"/>
      </circle>
      
      {/* Main Container */}
      <rect x="20" y="40" width="760" height="520" rx="16" fill="url(#cardGradient)" filter="url(#shadow)" opacity="0.95"/>
      
      {/* Header */}
      <text x="50" y="80" fontFamily="Arial, sans-serif" fontSize="28" fontWeight="bold" fill="#f1f5f9">
        Analytics Dashboard
        <animate attributeName="opacity" values="0;1" dur="1s" fill="freeze"/>
      </text>
      
      {/* KPI Cards Row */}
      <g transform="translate(50, 100)">
        {/* Active Ideas Card */}
        <g>
          <rect width="160" height="80" rx="12" fill="#1e293b" stroke="#334155" strokeWidth="1">
            <animate attributeName="opacity" values="0;1" dur="0.8s" begin="1s" fill="freeze"/>
            <animateTransform attributeName="transform" type="translateY" values="20;0" dur="0.6s" begin="1s" fill="freeze"/>
          </rect>
          
          <text x="15" y="25" fontFamily="Arial, sans-serif" fontSize="12" fill="#94a3b8">
            Active Ideas
            <animate attributeName="opacity" values="0;1" dur="0.5s" begin="1.5s" fill="freeze"/>
          </text>
          
          <text x="15" y="50" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="bold" fill="#f1f5f9">
            <animate attributeName="opacity" values="0;1" dur="0.5s" begin="1.8s" fill="freeze"/>
            <tspan>247</tspan>
          </text>
          
          <text x="15" y="68" fontFamily="Arial, sans-serif" fontSize="11" fill="#10b981">
            <animate attributeName="opacity" values="0;1" dur="0.5s" begin="2s" fill="freeze"/>
            ↗ +12.5%
          </text>
          
          {/* Lightbulb icon */}
          <circle cx="130" cy="35" r="8" fill="none" stroke="#f59e0b" strokeWidth="2" opacity="0.6">
            <animate attributeName="opacity" values="0;0.6" dur="0.5s" begin="2.2s" fill="freeze"/>
          </circle>
          <rect x="126" y="43" width="8" height="4" fill="#f59e0b" opacity="0.6">
            <animate attributeName="opacity" values="0;0.6" dur="0.5s" begin="2.2s" fill="freeze"/>
          </rect>
        </g>
        
        {/* Total Votes Card */}
        <g transform="translate(180, 0)">
          <rect width="160" height="80" rx="12" fill="#1e293b" stroke="#334155" strokeWidth="1">
            <animate attributeName="opacity" values="0;1" dur="0.8s" begin="1.2s" fill="freeze"/>
            <animateTransform attributeName="transform" type="translateY" values="20;0" dur="0.6s" begin="1.2s" fill="freeze"/>
          </rect>
          
          <text x="15" y="25" fontFamily="Arial, sans-serif" fontSize="12" fill="#94a3b8">
            Total Votes
            <animate attributeName="opacity" values="0;1" dur="0.5s" begin="1.7s" fill="freeze"/>
          </text>
          
          <text x="15" y="50" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="bold" fill="#f1f5f9">
            <animate attributeName="opacity" values="0;1" dur="0.5s" begin="2s" fill="freeze"/>
            1,847
          </text>
          
          <text x="15" y="68" fontFamily="Arial, sans-serif" fontSize="11" fill="#10b981">
            <animate attributeName="opacity" values="0;1" dur="0.5s" begin="2.2s" fill="freeze"/>
            ↗ +8.2%
          </text>
          
          {/* Thumbs up icon */}
          <path d="M130 25 L130 35 M125 30 L135 30 M130 20 L130 25 L125 25 Q123 25 123 27 Q123 30 125 30" 
                stroke="#10b981" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6">
            <animate attributeName="opacity" values="0;0.6" dur="0.5s" begin="2.4s" fill="freeze"/>
          </path>
        </g>
        
        {/* Comments Card */}
        <g transform="translate(360, 0)">
          <rect width="160" height="80" rx="12" fill="#1e293b" stroke="#334155" strokeWidth="1">
            <animate attributeName="opacity" values="0;1" dur="0.8s" begin="1.4s" fill="freeze"/>
            <animateTransform attributeName="transform" type="translateY" values="20;0" dur="0.6s" begin="1.4s" fill="freeze"/>
          </rect>
          
          <text x="15" y="25" fontFamily="Arial, sans-serif" fontSize="12" fill="#94a3b8">
            Comments
            <animate attributeName="opacity" values="0;1" dur="0.5s" begin="1.9s" fill="freeze"/>
          </text>
          
          <text x="15" y="50" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="bold" fill="#f1f5f9">
            <animate attributeName="opacity" values="0;1" dur="0.5s" begin="2.2s" fill="freeze"/>
            892
          </text>
          
          <text x="15" y="68" fontFamily="Arial, sans-serif" fontSize="11" fill="#10b981">
            <animate attributeName="opacity" values="0;1" dur="0.5s" begin="2.4s" fill="freeze"/>
            ↗ +15.3%
          </text>
          
          {/* Comment icon */}
          <rect x="122" y="27" width="16" height="12" rx="3" fill="none" stroke="#3b82f6" strokeWidth="2" opacity="0.6">
            <animate attributeName="opacity" values="0;0.6" dur="0.5s" begin="2.6s" fill="freeze"/>
          </rect>
          <path d="M126 43 L130 39 L134 43" stroke="#3b82f6" strokeWidth="2" fill="none" opacity="0.6">
            <animate attributeName="opacity" values="0;0.6" dur="0.5s" begin="2.6s" fill="freeze"/>
          </path>
        </g>
        
        {/* Page Views Card */}
        <g transform="translate(540, 0)">
          <rect width="160" height="80" rx="12" fill="#1e293b" stroke="#334155" strokeWidth="1">
            <animate attributeName="opacity" values="0;1" dur="0.8s" begin="1.6s" fill="freeze"/>
            <animateTransform attributeName="transform" type="translateY" values="20;0" dur="0.6s" begin="1.6s" fill="freeze"/>
          </rect>
          
          <text x="15" y="25" fontFamily="Arial, sans-serif" fontSize="12" fill="#94a3b8">
            Page Views
            <animate attributeName="opacity" values="0;1" dur="0.5s" begin="2.1s" fill="freeze"/>
          </text>
          
          <text x="15" y="50" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="bold" fill="#f1f5f9">
            <animate attributeName="opacity" values="0;1" dur="0.5s" begin="2.4s" fill="freeze"/>
            12.4K
          </text>
          
          <text x="15" y="68" fontFamily="Arial, sans-serif" fontSize="11" fill="#10b981">
            <animate attributeName="opacity" values="0;1" dur="0.5s" begin="2.6s" fill="freeze"/>
            ↗ +24.8%
          </text>
          
          {/* Eye icon */}
          <ellipse cx="130" cy="33" rx="8" ry="5" fill="none" stroke="#06b6d4" strokeWidth="2" opacity="0.6">
            <animate attributeName="opacity" values="0;0.6" dur="0.5s" begin="2.8s" fill="freeze"/>
          </ellipse>
          <circle cx="130" cy="33" r="3" fill="#06b6d4" opacity="0.6">
            <animate attributeName="opacity" values="0;0.6" dur="0.5s" begin="2.8s" fill="freeze"/>
          </circle>
        </g>
      </g>
      
      {/* Navigation Tabs */}
      <g transform="translate(50, 210)">
        <rect width="80" height="32" rx="6" fill="#10b981" opacity="0.9">
          <animate attributeName="opacity" values="0;0.9" dur="0.5s" begin="3s" fill="freeze"/>
        </rect>
        <text x="40" y="22" fontFamily="Arial, sans-serif" fontSize="12" fontWeight="bold" fill="white" textAnchor="middle">
          Overview
          <animate attributeName="opacity" values="0;1" dur="0.5s" begin="3.2s" fill="freeze"/>
        </text>
        
        <rect x="100" width="60" height="32" rx="6" fill="#475569" opacity="0.7">
          <animate attributeName="opacity" values="0;0.7" dur="0.5s" begin="3.3s" fill="freeze"/>
        </rect>
        <text x="130" y="22" fontFamily="Arial, sans-serif" fontSize="12" fill="#cbd5e1" textAnchor="middle">
          Ideas
          <animate attributeName="opacity" values="0;1" dur="0.5s" begin="3.5s" fill="freeze"/>
        </text>
        
        <rect x="180" width="80" height="32" rx="6" fill="#475569" opacity="0.7">
          <animate attributeName="opacity" values="0;0.7" dur="0.5s" begin="3.6s" fill="freeze"/>
        </rect>
        <text x="220" y="22" fontFamily="Arial, sans-serif" fontSize="12" fill="#cbd5e1" textAnchor="middle">
          Comments
          <animate attributeName="opacity" values="0;1" dur="0.5s" begin="3.8s" fill="freeze"/>
        </text>
      </g>
      
      {/* Charts Section */}
      <g transform="translate(50, 270)">
        {/* Engagement Trends Chart */}
        <g>
          <rect width="340" height="200" rx="12" fill="#1e293b" stroke="#334155" strokeWidth="1">
            <animate attributeName="opacity" values="0;1" dur="0.8s" begin="4s" fill="freeze"/>
          </rect>
          
          <text x="20" y="30" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="bold" fill="#f1f5f9">
            Engagement Trends
            <animate attributeName="opacity" values="0;1" dur="0.5s" begin="4.5s" fill="freeze"/>
          </text>
          
          {/* Chart grid */}
          <g stroke="#374151" strokeWidth="1" opacity="0.3">
            <animate attributeName="opacity" values="0;0.3" dur="0.5s" begin="5s" fill="freeze"/>
            <line x1="40" y1="50" x2="320" y2="50"/>
            <line x1="40" y1="80" x2="320" y2="80"/>
            <line x1="40" y1="110" x2="320" y2="110"/>
            <line x1="40" y1="140" x2="320" y2="140"/>
            <line x1="40" y1="170" x2="320" y2="170"/>
          </g>
          
          {/* Chart lines */}
          <path d="M40 160 L90 140 L140 110 L190 95 L240 80 L290 60" 
                stroke="#3b82f6" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0">
            <animate attributeName="opacity" values="0;1" dur="1s" begin="5.5s" fill="freeze"/>
            <animate attributeName="strokeDasharray" values="0 250;250 0" dur="2s" begin="5.5s" fill="freeze"/>
          </path>
          
          <path d="M40 165 L90 163 L140 158 L190 155 L240 150 L290 145" 
                stroke="#f59e0b" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0">
            <animate attributeName="opacity" values="0;1" dur="1s" begin="6s" fill="freeze"/>
            <animate attributeName="strokeDasharray" values="0 250;250 0" dur="2s" begin="6s" fill="freeze"/>
          </path>
          
          {/* Data points */}
          <g opacity="0">
            <animate attributeName="opacity" values="0;1" dur="0.5s" begin="7s" fill="freeze"/>
            <circle cx="40" cy="160" r="4" fill="#3b82f6"/>
            <circle cx="90" cy="140" r="4" fill="#3b82f6"/>
            <circle cx="140" cy="110" r="4" fill="#3b82f6"/>
            <circle cx="190" cy="95" r="4" fill="#3b82f6"/>
            <circle cx="240" cy="80" r="4" fill="#3b82f6"/>
            <circle cx="290" cy="60" r="4" fill="#3b82f6"/>
          </g>
          
          {/* Labels */}
          <g fontFamily="Arial, sans-serif" fontSize="10" fill="#94a3b8" opacity="0">
            <animate attributeName="opacity" values="0;1" dur="0.5s" begin="7.5s" fill="freeze"/>
            <text x="40" y="188" textAnchor="middle">Jan</text>
            <text x="90" y="188" textAnchor="middle">Feb</text>
            <text x="140" y="188" textAnchor="middle">Mar</text>
            <text x="190" y="188" textAnchor="middle">Apr</text>
            <text x="240" y="188" textAnchor="middle">May</text>
            <text x="290" y="188" textAnchor="middle">Jun</text>
          </g>
        </g>
        
        {/* User Activity Chart */}
        <g transform="translate(360, 0)">
          <rect width="340" height="200" rx="12" fill="#1e293b" stroke="#334155" strokeWidth="1">
            <animate attributeName="opacity" values="0;1" dur="0.8s" begin="4.2s" fill="freeze"/>
          </rect>
          
          <text x="20" y="30" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="bold" fill="#f1f5f9">
            User Activity
            <animate attributeName="opacity" values="0;1" dur="0.5s" begin="4.7s" fill="freeze"/>
          </text>
          
          {/* Area chart */}
          <path d="M40 170 L90 150 L140 120 L190 100 L240 85 L290 70 L290 170 L40 170 Z" 
                fill="url(#areaGradient)" opacity="0">
            <animate attributeName="opacity" values="0;0.8" dur="1.5s" begin="8s" fill="freeze"/>
            <animateTransform attributeName="transform" type="scaleY" values="0;1" dur="1.5s" begin="8s" fill="freeze"/>
          </path>
          
          <path d="M40 170 L90 150 L140 120 L190 100 L240 85 L290 70" 
                stroke="#10b981" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0">
            <animate attributeName="opacity" values="0;1" dur="1s" begin="8.5s" fill="freeze"/>
            <animate attributeName="strokeDasharray" values="0 300;300 0" dur="2s" begin="8.5s" fill="freeze"/>
          </path>
          
          {/* Labels */}
          <g fontFamily="Arial, sans-serif" fontSize="10" fill="#94a3b8" opacity="0">
            <animate attributeName="opacity" values="0;1" dur="0.5s" begin="9s" fill="freeze"/>
            <text x="40" y="188" textAnchor="middle">Jan</text>
            <text x="90" y="188" textAnchor="middle">Feb</text>
            <text x="140" y="188" textAnchor="middle">Mar</text>
            <text x="190" y="188" textAnchor="middle">Apr</text>
            <text x="240" y="188" textAnchor="middle">May</text>
            <text x="290" y="188" textAnchor="middle">Jun</text>
          </g>
        </g>
      </g>
      
      {/* Insights Panel */}
      <g transform="translate(550, 480)" opacity="0">
        <animate attributeName="opacity" values="0;0.9" dur="1s" begin="10s" fill="freeze"/>
        <animateTransform attributeName="transform" type="translateX" values="50;0" dur="0.8s" begin="10s" fill="freeze"/>
        
        <rect width="200" height="60" rx="8" fill="#10b981" opacity="0.1" stroke="#10b981" strokeWidth="1"/>
        
        <text x="15" y="20" fontFamily="Arial, sans-serif" fontSize="12" fontWeight="bold" fill="#10b981">
          Key Insight
        </text>
        
        <text x="15" y="35" fontFamily="Arial, sans-serif" fontSize="11" fill="#f1f5f9">
          Engagement up 24% this month
        </text>
        <text x="15" y="48" fontFamily="Arial, sans-serif" fontSize="11" fill="#94a3b8">
          Top feature requests driving growth
        </text>
      </g>
      
      {/* Animated data flow */}
      <g opacity="0">
        <animate attributeName="opacity" values="0;0.7;0" dur="3s" begin="11s" repeatCount="indefinite"/>
        
        <circle r="3" fill="#10b981">
          <animateMotion dur="3s" begin="11s" repeatCount="indefinite">
            <path d="M200 120 Q400 200 600 180"/>
          </animateMotion>
        </circle>
        
        <circle r="2" fill="#3b82f6">
          <animateMotion dur="2.5s" begin="11.5s" repeatCount="indefinite">
            <path d="M100 150 Q300 250 500 200"/>
          </animateMotion>
        </circle>
      </g>
      
      {/* Footer message */}
      <text x="400" y="580" fontFamily="Arial, sans-serif" fontSize="14" fill="#64748b" textAnchor="middle" opacity="0">
        Track what resonates with customers and optimize your engagement strategy
        <animate attributeName="opacity" values="0;0.8" dur="1s" begin="12s" fill="freeze"/>
      </text>
      
      {/* Pulse effect on key metrics */}
      <circle cx="130" cy="140" r="15" fill="#10b981" opacity="0">
        <animate attributeName="opacity" values="0;0.3;0" dur="2s" begin="13s" repeatCount="indefinite"/>
        <animate attributeName="r" values="15;25;15" dur="2s" begin="13s" repeatCount="indefinite"/>
      </circle>
      
      <circle cx="310" cy="140" r="15" fill="#3b82f6" opacity="0">
        <animate attributeName="opacity" values="0;0.3;0" dur="2s" begin="13.5s" repeatCount="indefinite"/>
        <animate attributeName="r" values="15;25;15" dur="2s" begin="13.5s" repeatCount="indefinite"/>
      </circle>
    </svg>
  );
};

export default InsightsSvg;
