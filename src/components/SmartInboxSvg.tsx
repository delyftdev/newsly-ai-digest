const SmartInboxSvg = () => {
  return (
    <svg viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
      <defs>
        {/* Background gradient */}
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:"#0a0a0a", stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:"#1a1a1a", stopOpacity:1}} />
        </linearGradient>
        
        {/* Glow effect for notifications */}
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        {/* Drop shadow */}
        <filter id="shadow">
          <feDropShadow dx="1" dy="1" stdDeviation="2" floodColor="#000" floodOpacity="0.5"/>
        </filter>
      </defs>
      
      {/* Background */}
      <rect width="1200" height="800" fill="url(#bgGradient)"/>
      
      {/* Header */}
      <rect x="0" y="0" width="1200" height="80" fill="#1a1a1a"/>
      <text x="50" y="35" fill="#ffffff" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="bold">
        Inbox
      </text>
      <circle cx="1150" cy="40" r="8" fill="#666" stroke="#888" strokeWidth="1"/>
      
      {/* Subtitle */}
      <text x="50" y="120" fill="#666" fontFamily="Arial, sans-serif" fontSize="14">
        Manage your incoming emails and create releases.
      </text>
      
      {/* Shared Email Box */}
      <rect x="50" y="150" width="400" height="100" rx="8" fill="#1a1a1a" stroke="#333" strokeWidth="1"/>
      <circle cx="80" cy="180" r="12" fill="#4a90e2" stroke="#5aa3f0" strokeWidth="2"/>
      <path d="M 74 176 L 78 180 L 86 172" stroke="#fff" strokeWidth="2" fill="none"/>
      <text x="110" y="185" fill="#ffffff" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="bold">
        Your Inbox Email
      </text>
      <text x="110" y="205" fill="#888" fontFamily="Arial, sans-serif" fontSize="12">
        team@company.com - Auto-forward enabled
      </text>
      <text x="110" y="225" fill="#666" fontFamily="Arial, sans-serif" fontSize="11">
        All team emails automatically categorized and prioritized
      </text>
      
      {/* Navigation Tabs */}
      <g id="tabs">
        <rect x="50" y="300" width="1100" height="50" fill="#0a0a0a" stroke="#333" strokeWidth="1"/>
        
        {/* All Tab */}
        <rect x="70" y="315" width="80" height="20" fill="#333" rx="3"/>
        <text x="110" y="327" textAnchor="middle" fill="#fff" fontFamily="Arial, sans-serif" fontSize="12">
          All (<tspan id="allCount">5</tspan>)
        </text>
        
        {/* Newsletters Tab */}
        <rect x="170" y="315" width="120" height="20" fill="transparent"/>
        <text x="230" y="327" textAnchor="middle" fill="#888" fontFamily="Arial, sans-serif" fontSize="12">
          Newsletters (<tspan id="newsletterCount">1</tspan>)
        </text>
        
        {/* Product Briefs Tab */}
        <rect x="310" y="315" width="130" height="20" fill="transparent"/>
        <text x="375" y="327" textAnchor="middle" fill="#888" fontFamily="Arial, sans-serif" fontSize="12">
          Product Briefs (<tspan id="productCount">1</tspan>)
        </text>
        
        {/* Announcements Tab */}
        <rect x="460" y="315" width="140" height="20" fill="transparent"/>
        <text x="530" y="327" textAnchor="middle" fill="#888" fontFamily="Arial, sans-serif" fontSize="12">
          Announcements (<tspan id="announcementCount">1</tspan>)
        </text>
        
        {/* Feedback Tab */}
        <rect x="620" y="315" width="100" height="20" fill="transparent"/>
        <text x="670" y="327" textAnchor="middle" fill="#888" fontFamily="Arial, sans-serif" fontSize="12">
          Feedback (<tspan id="feedbackCount">1</tspan>)
        </text>
        
        {/* Other Tab */}
        <rect x="740" y="315" width="90" height="20" fill="transparent"/>
        <text x="785" y="327" textAnchor="middle" fill="#888" fontFamily="Arial, sans-serif" fontSize="12">
          Other (<tspan id="otherCount">1</tspan>)
        </text>
      </g>
      
      {/* Main Content Area */}
      <rect x="50" y="350" width="1100" height="400" fill="#0a0a0a" stroke="#333" strokeWidth="1"/>
      
      {/* Existing Emails in Inbox */}
      <g id="existingEmails">
        {/* Product Brief Email */}
        <rect x="70" y="370" width="1060" height="50" fill="#1a1a1a" stroke="#333" strokeWidth="1"/>
        <circle cx="90" cy="390" r="6" fill="#4a90e2"/>
        <text x="110" y="385" fill="#ccc" fontFamily="Arial, sans-serif" fontSize="11" fontWeight="bold">
          alex@partner.com
        </text>
        <text x="110" y="400" fill="#888" fontFamily="Arial, sans-serif" fontSize="10">
          Integration Proposal - API Partnership Discussion
        </text>
        <text x="1000" y="385" fill="#666" fontFamily="Arial, sans-serif" fontSize="9">
          2h ago
        </text>
        <rect x="1050" y="375" width="70" height="18" rx="3" fill="#4a90e2" opacity="0.2"/>
        <text x="1085" y="386" textAnchor="middle" fill="#4a90e2" fontFamily="Arial, sans-serif" fontSize="8">
          Product Brief
        </text>
        
        {/* Feedback Email */}
        <rect x="70" y="430" width="1060" height="50" fill="#1a1a1a" stroke="#333" strokeWidth="1"/>
        <circle cx="90" cy="450" r="6" fill="#f59e0b"/>
        <text x="110" y="445" fill="#ccc" fontFamily="Arial, sans-serif" fontSize="11" fontWeight="bold">
          customer@client.com
        </text>
        <text x="110" y="460" fill="#888" fontFamily="Arial, sans-serif" fontSize="10">
          Love the new dashboard! Some suggestions for improvement
        </text>
        <text x="1000" y="445" fill="#666" fontFamily="Arial, sans-serif" fontSize="9">
          4h ago
        </text>
        <rect x="1050" y="435" width="70" height="18" rx="3" fill="#f59e0b" opacity="0.2"/>
        <text x="1085" y="446" textAnchor="middle" fill="#f59e0b" fontFamily="Arial, sans-serif" fontSize="8">
          Feedback
        </text>
        
        {/* Announcement Email */}
        <rect x="70" y="490" width="1060" height="50" fill="#1a1a1a" stroke="#333" strokeWidth="1"/>
        <circle cx="90" cy="510" r="6" fill="#8b5cf6"/>
        <text x="110" y="505" fill="#ccc" fontFamily="Arial, sans-serif" fontSize="11" fontWeight="bold">
          ceo@company.com
        </text>
        <text x="110" y="520" fill="#888" fontFamily="Arial, sans-serif" fontSize="10">
          Company All-Hands Meeting - Q3 Results and Q4 Planning
        </text>
        <text x="1000" y="505" fill="#666" fontFamily="Arial, sans-serif" fontSize="9">
          1d ago
        </text>
        <rect x="1050" y="495" width="70" height="18" rx="3" fill="#8b5cf6" opacity="0.2"/>
        <text x="1085" y="506" textAnchor="middle" fill="#8b5cf6" fontFamily="Arial, sans-serif" fontSize="8">
          Announcement
        </text>
        
        {/* Other Email */}
        <rect x="70" y="550" width="1060" height="50" fill="#1a1a1a" stroke="#333" strokeWidth="1"/>
        <circle cx="90" cy="570" r="6" fill="#666"/>
        <text x="110" y="565" fill="#ccc" fontFamily="Arial, sans-serif" fontSize="11" fontWeight="bold">
          billing@vendor.com
        </text>
        <text x="110" y="580" fill="#888" fontFamily="Arial, sans-serif" fontSize="10">
          Monthly Invoice - Software License Renewal
        </text>
        <text x="1000" y="565" fill="#666" fontFamily="Arial, sans-serif" fontSize="9">
          2d ago
        </text>
        <rect x="1050" y="555" width="70" height="18" rx="3" fill="#666" opacity="0.2"/>
        <text x="1085" y="566" textAnchor="middle" fill="#666" fontFamily="Arial, sans-serif" fontSize="8">
          Other
        </text>
        
        {/* Newsletter Email */}
        <rect x="70" y="610" width="1060" height="50" fill="#1a1a1a" stroke="#333" strokeWidth="1"/>
        <circle cx="90" cy="630" r="6" fill="#10b981"/>
        <text x="110" y="625" fill="#ccc" fontFamily="Arial, sans-serif" fontSize="11" fontWeight="bold">
          newsletter@techcrunch.com
        </text>
        <text x="110" y="640" fill="#888" fontFamily="Arial, sans-serif" fontSize="10">
          The Latest in SaaS: AI-Powered Customer Success Tools
        </text>
        <text x="1000" y="625" fill="#666" fontFamily="Arial, sans-serif" fontSize="9">
          3d ago
        </text>
        <rect x="1050" y="615" width="70" height="18" rx="3" fill="#10b981" opacity="0.2"/>
        <text x="1085" y="626" textAnchor="middle" fill="#10b981" fontFamily="Arial, sans-serif" fontSize="8">
          Newsletter
        </text>
      </g>
      
      {/* Incoming Email Animations */}
      <g id="incomingEmails">
        {/* Email 1 */}
        <g className="email-item" opacity="0">
          <rect x="500" y="100" width="200" height="60" rx="5" fill="#2a2a2a" stroke="#4a90e2" strokeWidth="1" filter="url(#shadow)"/>
          <text x="510" y="120" fill="#4a90e2" fontFamily="Arial, sans-serif" fontSize="11" fontWeight="bold">
            From: sarah@client.com
          </text>
          <text x="510" y="135" fill="#ccc" fontFamily="Arial, sans-serif" fontSize="10">
            Feature Request - Dashboard
          </text>
          <text x="510" y="150" fill="#888" fontFamily="Arial, sans-serif" fontSize="9">
            → Product Brief (High Priority)
          </text>
          <animate attributeName="opacity" values="0;1;1;0" dur="3s" begin="1s" fill="freeze"/>
          <animateTransform attributeName="transform" type="translate" values="0,0; 0,250; 0,250" dur="3s" begin="1s" fill="freeze"/>
        </g>
        
        {/* Email 2 */}
        <g className="email-item" opacity="0">
          <rect x="500" y="100" width="200" height="60" rx="5" fill="#2a2a2a" stroke="#f59e0b" strokeWidth="1" filter="url(#shadow)"/>
          <text x="510" y="120" fill="#f59e0b" fontFamily="Arial, sans-serif" fontSize="11" fontWeight="bold">
            From: john@company.com
          </text>
          <text x="510" y="135" fill="#ccc" fontFamily="Arial, sans-serif" fontSize="10">
            User Feedback Summary
          </text>
          <text x="510" y="150" fill="#888" fontFamily="Arial, sans-serif" fontSize="9">
            → Feedback (Medium Priority)
          </text>
          <animate attributeName="opacity" values="0;1;1;0" dur="3s" begin="3s" fill="freeze"/>
          <animateTransform attributeName="transform" type="translate" values="0,0; 0,250; 0,250" dur="3s" begin="3s" fill="freeze"/>
        </g>
        
        {/* Email 3 */}
        <g className="email-item" opacity="0">
          <rect x="500" y="100" width="200" height="60" rx="5" fill="#2a2a2a" stroke="#8b5cf6" strokeWidth="1" filter="url(#shadow)"/>
          <text x="510" y="120" fill="#8b5cf6" fontFamily="Arial, sans-serif" fontSize="11" fontWeight="bold">
            From: hr@company.com
          </text>
          <text x="510" y="135" fill="#ccc" fontFamily="Arial, sans-serif" fontSize="10">
            Q3 Team Meeting
          </text>
          <text x="510" y="150" fill="#888" fontFamily="Arial, sans-serif" fontSize="9">
            → Announcement (Low Priority)
          </text>
          <animate attributeName="opacity" values="0;1;1;0" dur="3s" begin="5s" fill="freeze"/>
          <animateTransform attributeName="transform" type="translate" values="0,0; 0,250; 0,250" dur="3s" begin="5s" fill="freeze"/>
        </g>
        
        {/* Email 4 */}
        <g className="email-item" opacity="0">
          <rect x="500" y="100" width="200" height="60" rx="5" fill="#2a2a2a" stroke="#666" strokeWidth="1" filter="url(#shadow)"/>
          <text x="510" y="120" fill="#666" fontFamily="Arial, sans-serif" fontSize="11" fontWeight="bold">
            From: vendor@external.com
          </text>
          <text x="510" y="135" fill="#ccc" fontFamily="Arial, sans-serif" fontSize="10">
            Invoice #INV-2024-001
          </text>
          <text x="510" y="150" fill="#888" fontFamily="Arial, sans-serif" fontSize="9">
            → Other (Standard Priority)
          </text>
          <animate attributeName="opacity" values="0;1;1;0" dur="3s" begin="7s" fill="freeze"/>
          <animateTransform attributeName="transform" type="translate" values="0,0; 0,250; 0,250" dur="3s" begin="7s" fill="freeze"/>
        </g>
      </g>
      
      {/* Counter Animations */}
      <g id="counters">
        {/* All count */}
        <animate 
          xlinkHref="#allCount" 
          attributeName="opacity" 
          values="1;0.5;1" 
          dur="0.5s" 
          begin="1s;3s;5s;7s"/>
        
        {/* Product count */}
        <animate 
          xlinkHref="#productCount" 
          attributeName="opacity" 
          values="1;0.5;1" 
          dur="0.5s" 
          begin="1s"/>
        
        {/* Feedback count */}
        <animate 
          xlinkHref="#feedbackCount" 
          attributeName="opacity" 
          values="1;0.5;1" 
          dur="0.5s" 
          begin="3s"/>
        
        {/* Announcement count */}
        <animate 
          xlinkHref="#announcementCount" 
          attributeName="opacity" 
          values="1;0.5;1" 
          dur="0.5s" 
          begin="5s"/>
        
        {/* Other count */}
        <animate 
          xlinkHref="#otherCount" 
          attributeName="opacity" 
          values="1;0.5;1" 
          dur="0.5s" 
          begin="7s"/>
      </g>
      
      {/* Processing notification */}
      <g id="processing" opacity="0">
        <rect x="400" y="400" width="400" height="40" rx="5" fill="#1a4a1a" stroke="#2a6a2a" strokeWidth="1"/>
        <text x="600" y="425" textAnchor="middle" fill="#4ade80" fontFamily="Arial, sans-serif" fontSize="12">
          ✓ Email automatically categorized and prioritized
        </text>
        <animate attributeName="opacity" values="0;1;1;0" dur="2s" begin="1.5s;3.5s;5.5s;7.5s"/>
      </g>
      
      {/* Tab count updates */}
      <g id="countUpdates">
        <set attributeName="textContent" to="6" begin="1s" xlinkHref="#allCount"/>
        <set attributeName="textContent" to="2" begin="1s" xlinkHref="#productCount"/>
        
        <set attributeName="textContent" to="7" begin="3s" xlinkHref="#allCount"/>
        <set attributeName="textContent" to="2" begin="3s" xlinkHref="#feedbackCount"/>
        
        <set attributeName="textContent" to="8" begin="5s" xlinkHref="#allCount"/>
        <set attributeName="textContent" to="2" begin="5s" xlinkHref="#announcementCount"/>
        
        <set attributeName="textContent" to="9" begin="7s" xlinkHref="#allCount"/>
        <set attributeName="textContent" to="2" begin="7s" xlinkHref="#otherCount"/>
      </g>
      
      {/* AI Processing indicator */}
      <g id="aiIndicator" opacity="0">
        <circle cx="600" cy="250" r="3" fill="#4ade80"/>
        <text x="610" y="255" fill="#4ade80" fontFamily="Arial, sans-serif" fontSize="10">
          AI Processing...
        </text>
        <animate attributeName="opacity" values="0;1;0" dur="1s" begin="1s;3s;5s;7s"/>
      </g>
      
      {/* Restart Animation */}
      <animate attributeName="opacity" values="1;1" dur="0.1s" begin="10s; 20s; 30s; 40s"/>
      
      {/* Reset counters */}
      <g id="reset">
        <set attributeName="textContent" to="5" begin="10s; 20s; 30s; 40s" xlinkHref="#allCount"/>
        <set attributeName="textContent" to="1" begin="10s; 20s; 30s; 40s" xlinkHref="#productCount"/>
        <set attributeName="textContent" to="1" begin="10s; 20s; 30s; 40s" xlinkHref="#feedbackCount"/>
        <set attributeName="textContent" to="1" begin="10s; 20s; 30s; 40s" xlinkHref="#announcementCount"/>
        <set attributeName="textContent" to="1" begin="10s; 20s; 30s; 40s" xlinkHref="#otherCount"/>
        <set attributeName="textContent" to="1" begin="10s; 20s; 30s; 40s" xlinkHref="#newsletterCount"/>
      </g>
    </svg>
  );
};

export default SmartInboxSvg;
