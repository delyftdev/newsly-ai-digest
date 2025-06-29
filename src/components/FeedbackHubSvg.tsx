
import React from 'react';

const FeedbackHubSvg = () => {
  return (
    <svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        {/* Gradients */}
        <linearGradient id="cardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:"#1a1a1a", stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:"#2d2d2d", stopOpacity:1}} />
        </linearGradient>
        
        <linearGradient id="thumbsUpGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:"#4a9eff", stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:"#00d4ff", stopOpacity:1}} />
        </linearGradient>
        
        <radialGradient id="glowEffect" cx="50%" cy="50%" r="50%">
          <stop offset="0%" style={{stopColor:"#4a9eff", stopOpacity:0.6}} />
          <stop offset="100%" style={{stopColor:"#4a9eff", stopOpacity:0}} />
        </radialGradient>
        
        {/* Filters */}
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        <filter id="shadow">
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#000" floodOpacity="0.3"/>
        </filter>
      </defs>
      
      {/* Background */}
      <rect width="800" height="600" fill="#0a0a0a"/>
      
      {/* Product Release Card */}
      <rect x="50" y="50" width="700" height="200" rx="16" fill="url(#cardGradient)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" filter="url(#shadow)">
        <animate attributeName="opacity" values="0;1" dur="1s" fill="freeze"/>
        <animateTransform attributeName="transform" type="translate" values="0,20;0,0" dur="1s" fill="freeze"/>
      </rect>
      
      {/* Release Icon */}
      <circle cx="100" cy="120" r="20" fill="url(#thumbsUpGradient)">
        <animate attributeName="r" values="15;20;15" dur="2s" repeatCount="indefinite"/>
      </circle>
      <text x="100" y="128" textAnchor="middle" fill="white" fontSize="16" fontFamily="Arial">🚀</text>
      
      {/* Release Title */}
      <text x="140" y="110" fill="white" fontSize="24" fontWeight="bold" fontFamily="Arial">
        Enhanced Dashboard Analytics
        <animate attributeName="opacity" values="0;1" dur="1.5s" begin="0.5s" fill="freeze"/>
      </text>
      
      {/* Release Description */}
      <text x="140" y="135" fill="rgba(255,255,255,0.7)" fontSize="14" fontFamily="Arial">
        New advanced metrics and real-time insights for better decision making
        <animate attributeName="opacity" values="0;1" dur="1.5s" begin="1s" fill="freeze"/>
      </text>
      
      {/* Date and Tag */}
      <text x="140" y="155" fill="rgba(255,255,255,0.5)" fontSize="12" fontFamily="Arial">
        June 30, 2025 • New Feature
        <animate attributeName="opacity" values="0;1" dur="1.5s" begin="1.2s" fill="freeze"/>
      </text>
      
      {/* Thumbs Up Button */}
      <g id="thumbsUpButton" transform="translate(600, 100)" style={{cursor:"pointer"}}>
        <circle cx="0" cy="0" r="25" fill="rgba(74,158,255,0.1)" stroke="rgba(74,158,255,0.3)" strokeWidth="2">
          <animate id="thumbsUpHover" attributeName="fill" values="rgba(74,158,255,0.1);rgba(74,158,255,0.2);rgba(74,158,255,0.1)" dur="0.3s" begin="thumbsUpClick.begin" fill="freeze"/>
        </circle>
        
        {/* Thumbs Up Icon */}
        <path d="M-8,-5 L-5,-8 L-2,-8 L2,-4 L2,2 L-8,2 Z M2,-4 L5,-7 L8,-7 L8,-4 L5,-1 L2,-1" 
              fill="url(#thumbsUpGradient)" stroke="none">
          <animateTransform id="thumbsUpClick" attributeName="transform" type="scale" 
                           values="1;1.3;1" dur="0.6s" begin="2s;thumbsUpClick.end+3s" repeatCount="indefinite"/>
        </path>
        
        {/* Like Counter */}
        <text x="35" y="5" fill="rgba(255,255,255,0.8)" fontSize="14" fontFamily="Arial">
          <animate attributeName="opacity" values="0;1" dur="1s" begin="2s" fill="freeze"/>
          23
          <animate values="23;24;25;26" dur="8s" begin="2s" fill="freeze"/>
        </text>
      </g>
      
      {/* Floating Hearts Animation */}
      <g id="hearts">
        <text x="600" y="100" fill="#ff6b6b" fontSize="20" opacity="0">❤️
          <animate attributeName="opacity" values="0;1;0" dur="1s" begin="2.2s;7.2s;12.2s" />
          <animateTransform attributeName="transform" type="translate" 
                           values="0,0;10,-30;20,-60" dur="1s" begin="2.2s;7.2s;12.2s" />
        </text>
        <text x="610" y="105" fill="#4a9eff" fontSize="16" opacity="0">👍
          <animate attributeName="opacity" values="0;1;0" dur="1.2s" begin="2.5s;7.5s;12.5s" />
          <animateTransform attributeName="transform" type="translate" 
                           values="0,0;-15,-40;-30,-80" dur="1.2s" begin="2.5s;7.5s;12.5s" />
        </text>
        <text x="590" y="95" fill="#00d4ff" fontSize="18" opacity="0">🎉
          <animate attributeName="opacity" values="0;1;0" dur="1.1s" begin="2.8s;7.8s;12.8s" />
          <animateTransform attributeName="transform" type="translate" 
                           values="0,0;5,-35;10,-70" dur="1.1s" begin="2.8s;7.8s;12.8s" />
        </text>
      </g>
      
      {/* Comment Button */}
      <g id="commentButton" transform="translate(680, 100)" style={{cursor:"pointer"}}>
        <circle cx="0" cy="0" r="25" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth="2">
          <animate attributeName="fill" values="rgba(255,255,255,0.05);rgba(255,255,255,0.1);rgba(255,255,255,0.05)" 
                   dur="0.3s" begin="commentClick.begin" fill="freeze"/>
        </circle>
        
        {/* Comment Icon */}
        <rect x="-8" y="-6" width="16" height="10" rx="2" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2"/>
        <path d="M-2,4 L0,7 L2,4" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2">
          <animateTransform id="commentClick" attributeName="transform" type="scale" 
                           values="1;1.2;1" dur="0.5s" begin="3s;commentClick.end+4s" repeatCount="indefinite"/>
        </path>
        
        {/* Comment Counter */}
        <text x="35" y="5" fill="rgba(255,255,255,0.8)" fontSize="14" fontFamily="Arial">
          <animate attributeName="opacity" values="0;1" dur="1s" begin="3s" fill="freeze"/>
          8
          <animate values="8;9;10;11" dur="10s" begin="3s" fill="freeze"/>
        </text>
      </g>
      
      {/* Comments Section */}
      <g id="commentsSection" transform="translate(50, 280)">
        {/* Comment 1 */}
        <g opacity="0">
          <animate attributeName="opacity" values="0;1" dur="0.8s" begin="4s" fill="freeze"/>
          <animateTransform attributeName="transform" type="translate" values="0,20;0,0" dur="0.8s" begin="4s" fill="freeze"/>
          
          <rect x="0" y="0" width="650" height="60" rx="12" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
          
          {/* User Avatar */}
          <circle cx="25" cy="30" r="15" fill="url(#thumbsUpGradient)"/>
          <text x="25" y="35" textAnchor="middle" fill="white" fontSize="12" fontFamily="Arial">JD</text>
          
          {/* Comment Text */}
          <text x="55" y="20" fill="white" fontSize="14" fontWeight="bold" fontFamily="Arial">John Davis</text>
          <text x="55" y="38" fill="rgba(255,255,255,0.8)" fontSize="13" fontFamily="Arial">This is exactly what we needed! The new charts are incredibly detailed.</text>
          <text x="55" y="52" fill="rgba(255,255,255,0.5)" fontSize="11" fontFamily="Arial">2 minutes ago</text>
        </g>
        
        {/* Comment 2 */}
        <g transform="translate(0, 80)" opacity="0">
          <animate attributeName="opacity" values="0;1" dur="0.8s" begin="5s" fill="freeze"/>
          <animateTransform attributeName="transform" type="translate" values="0,100;0,80" dur="0.8s" begin="5s" fill="freeze"/>
          
          <rect x="0" y="0" width="650" height="60" rx="12" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
          
          {/* User Avatar */}
          <circle cx="25" cy="30" r="15" fill="#22c55e"/>
          <text x="25" y="35" textAnchor="middle" fill="white" fontSize="12" fontFamily="Arial">SM</text>
          
          {/* Comment Text */}
          <text x="55" y="20" fill="white" fontSize="14" fontWeight="bold" fontFamily="Arial">Sarah Miller</text>
          <text x="55" y="38" fill="rgba(255,255,255,0.8)" fontSize="13" fontFamily="Arial">Love the real-time updates! Makes monitoring so much easier 📊</text>
          <text x="55" y="52" fill="rgba(255,255,255,0.5)" fontSize="11" fontFamily="Arial">5 minutes ago</text>
        </g>
        
        {/* Comment 3 */}
        <g transform="translate(0, 160)" opacity="0">
          <animate attributeName="opacity" values="0;1" dur="0.8s" begin="6s" fill="freeze"/>
          <animateTransform attributeName="transform" type="translate" values="0,180;0,160" dur="0.8s" begin="6s" fill="freeze"/>
          
          <rect x="0" y="0" width="650" height="60" rx="12" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
          
          {/* User Avatar */}
          <circle cx="25" cy="30" r="15" fill="#ffd93d"/>
          <text x="25" y="35" textAnchor="middle" fill="white" fontSize="12" fontFamily="Arial">AL</text>
          
          {/* Comment Text */}
          <text x="55" y="20" fill="white" fontSize="14" fontWeight="bold" fontFamily="Arial">Alex Liu</text>
          <text x="55" y="38" fill="rgba(255,255,255,0.8)" fontSize="13" fontFamily="Arial">Great work team! When can we expect the mobile version? 📱</text>
          <text x="55" y="52" fill="rgba(255,255,255,0.5)" fontSize="11" fontFamily="Arial">8 minutes ago</text>
        </g>
      </g>
      
      {/* Engagement Metrics Popup */}
      <g id="engagementPopup" transform="translate(500, 20)" opacity="0">
        <animate attributeName="opacity" values="0;1;1;0" dur="4s" begin="8s" fill="freeze"/>
        <animateTransform attributeName="transform" type="translate" values="500,0;500,20" dur="4s" begin="8s" fill="freeze"/>
        
        <rect x="0" y="0" width="250" height="100" rx="12" fill="rgba(20, 20, 20, 0.95)" stroke="rgba(74,158,255,0.3)" strokeWidth="2" filter="url(#glow)"/>
        
        <text x="125" y="25" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold" fontFamily="Arial">Engagement Stats</text>
        
        <text x="20" y="45" fill="rgba(255,255,255,0.8)" fontSize="12" fontFamily="Arial">👍 Likes: 26</text>
        <text x="20" y="60" fill="rgba(255,255,255,0.8)" fontSize="12" fontFamily="Arial">💬 Comments: 11</text>
        <text x="20" y="75" fill="rgba(255,255,255,0.8)" fontSize="12" fontFamily="Arial">👀 Views: 1,247</text>
        
        <text x="130" y="45" fill="rgba(255,255,255,0.8)" fontSize="12" fontFamily="Arial">📈 +45% vs last</text>
        <text x="130" y="60" fill="rgba(255,255,255,0.8)" fontSize="12" fontFamily="Arial">🔥 Trending #2</text>
        <text x="130" y="75" fill="rgba(255,255,255,0.8)" fontSize="12" fontFamily="Arial">⭐ 4.8/5 rating</text>
      </g>
      
      {/* Floating Notification */}
      <g id="notification" transform="translate(-300, 10)" opacity="0">
        <animate attributeName="opacity" values="0;1;1;0" dur="3s" begin="10s" fill="freeze"/>
        <animateTransform attributeName="transform" type="translate" values="-300,10;20,10" dur="3s" begin="10s" fill="freeze"/>
        
        <rect x="0" y="0" width="300" height="50" rx="25" fill="rgba(34, 197, 94, 0.9)" filter="url(#shadow)"/>
        <circle cx="30" cy="25" r="8" fill="white"/>
        <path d="M26,25 L29,28 L34,21" stroke="rgba(34, 197, 94, 1)" strokeWidth="2" fill="none"/>
        
        <text x="50" y="30" fill="white" fontSize="14" fontWeight="bold" fontFamily="Arial">
          Release shared with 2,847 customers!
        </text>
      </g>
      
      {/* Pulse Effect for Active Elements */}
      <circle cx="600" cy="100" r="40" fill="url(#glowEffect)" opacity="0">
        <animate attributeName="opacity" values="0;0.3;0" dur="2s" begin="2s" repeatCount="indefinite"/>
        <animate attributeName="r" values="25;50;25" dur="2s" begin="2s" repeatCount="indefinite"/>
      </circle>
      
      <circle cx="680" cy="100" r="40" fill="url(#glowEffect)" opacity="0">
        <animate attributeName="opacity" values="0;0.2;0" dur="2.5s" begin="3s" repeatCount="indefinite"/>
        <animate attributeName="r" values="25;45;25" dur="2.5s" begin="3s" repeatCount="indefinite"/>
      </circle>
    </svg>
  );
};

export default FeedbackHubSvg;
