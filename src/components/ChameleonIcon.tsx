import React from 'react';

interface ChameleonIconProps {
  size?: number;
  className?: string;
}

export const ChameleonIcon: React.FC<ChameleonIconProps> = ({ size = 120, className = '' }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Body */}
      <ellipse cx="100" cy="110" rx="55" ry="60" fill="url(#bodyGradient)" />
      
      {/* Head */}
      <circle cx="100" cy="70" r="45" fill="url(#headGradient)" />
      
      {/* Eyes - big cute eyes */}
      <circle cx="85" cy="65" r="12" fill="white" />
      <circle cx="115" cy="65" r="12" fill="white" />
      <circle cx="87" cy="65" r="6" fill="#1a1b1f" />
      <circle cx="117" cy="65" r="6" fill="#1a1b1f" />
      <circle cx="89" cy="63" r="2" fill="white" />
      <circle cx="119" cy="63" r="2" fill="white" />
      
      {/* Smile */}
      <path d="M 90 85 Q 100 92 110 85" stroke="#1a1b1f" stroke-width="2.5" fill="none" stroke-linecap="round" />
      
      {/* Horns/Crest on head */}
      <path d="M 75 35 Q 80 25 85 35" fill="url(#hornGradient)" />
      <path d="M 115 35 Q 120 25 125 35" fill="url(#hornGradient)" />
      
      {/* Tail */}
      <path d="M 155 110 Q 175 100 170 120 Q 165 140 150 130" fill="url(#tailGradient)" />
      
      {/* Arms */}
      <ellipse cx="60" cy="120" rx="12" ry="20" fill="url(#bodyGradient)" transform="rotate(-20 60 120)" />
      <ellipse cx="140" cy="120" rx="12" ry="20" fill="url(#bodyGradient)" transform="rotate(20 140 120)" />
      
      {/* Legs */}
      <ellipse cx="80" cy="165" rx="15" ry="10" fill="url(#bodyGradient)" />
      <ellipse cx="120" cy="165" rx="15" ry="10" fill="url(#bodyGradient)" />
      
      {/* Belly pattern */}
      <ellipse cx="100" cy="115" rx="30" ry="35" fill="url(#bellyGradient)" opacity="0.6" />
      
      {/* Spots */}
      <circle cx="70" cy="100" r="4" fill="#99ff00" opacity="0.4" />
      <circle cx="130" cy="105" r="3" fill="#99ff00" opacity="0.4" />
      <circle cx="85" cy="140" r="3.5" fill="#99ff00" opacity="0.4" />
      <circle cx="115" cy="145" r="3" fill="#99ff00" opacity="0.4" />
      
      {/* Gradients */}
      <defs>
        <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7cb342" />
          <stop offset="50%" stopColor="#8bc34a" />
          <stop offset="100%" stopColor="#689f38" />
        </linearGradient>
        <linearGradient id="headGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8bc34a" />
          <stop offset="50%" stopColor="#9ccc65" />
          <stop offset="100%" stopColor="#7cb342" />
        </linearGradient>
        <linearGradient id="hornGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#c6ff00" />
          <stop offset="100%" stopColor="#99ff00" />
        </linearGradient>
        <linearGradient id="tailGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8bc34a" />
          <stop offset="100%" stopColor="#689f38" />
        </linearGradient>
        <radialGradient id="bellyGradient">
          <stop offset="0%" stopColor="#c6ff00" />
          <stop offset="100%" stopColor="#99ff00" />
        </radialGradient>
      </defs>
    </svg>
  );
};