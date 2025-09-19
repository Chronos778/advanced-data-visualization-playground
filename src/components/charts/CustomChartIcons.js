import React from 'react';

// Custom SVG icons for RAWGraphs chart types
export const AlluvialIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M4 6c0 0 4 2 8 2s8-2 8-2v2c0 0-4 2-8 2s-8-2-8-2V6z" opacity="0.7"/>
    <path d="M4 10c0 0 4 2 8 2s8-2 8-2v2c0 0-4 2-8 2s-8-2-8-2V10z" opacity="0.5"/>
    <path d="M4 14c0 0 4 2 8 2s8-2 8-2v2c0 0-4 2-8 2s-8-2-8-2V14z" opacity="0.3"/>
  </svg>
);

export const ArcIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M2 20h20" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path d="M6 20Q12 10 18 20" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <path d="M4 20Q12 12 20 20" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <circle cx="6" cy="20" r="1.5"/>
    <circle cx="12" cy="20" r="1.5"/>
    <circle cx="18" cy="20" r="1.5"/>
  </svg>
);

export const StackedBarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <rect x="3" y="10" width="4" height="10" opacity="0.8"/>
    <rect x="3" y="6" width="4" height="4" opacity="0.6"/>
    <rect x="9" y="8" width="4" height="12" opacity="0.8"/>
    <rect x="9" y="4" width="4" height="4" opacity="0.6"/>
    <rect x="15" y="12" width="4" height="8" opacity="0.8"/>
    <rect x="15" y="8" width="4" height="4" opacity="0.6"/>
  </svg>
);

export const MultisetBarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <rect x="3" y="10" width="2" height="10" opacity="0.8"/>
    <rect x="5" y="8" width="2" height="12" opacity="0.6"/>
    <rect x="9" y="6" width="2" height="14" opacity="0.8"/>
    <rect x="11" y="4" width="2" height="16" opacity="0.6"/>
    <rect x="15" y="12" width="2" height="8" opacity="0.8"/>
    <rect x="17" y="10" width="2" height="10" opacity="0.6"/>
  </svg>
);

export const BeeswarmIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="4" cy="12" r="1.5" opacity="0.8"/>
    <circle cx="7" cy="10" r="1.5" opacity="0.8"/>
    <circle cx="7" cy="14" r="1.5" opacity="0.8"/>
    <circle cx="10" cy="8" r="1.5" opacity="0.8"/>
    <circle cx="10" cy="12" r="1.5" opacity="0.8"/>
    <circle cx="10" cy="16" r="1.5" opacity="0.8"/>
    <circle cx="13" cy="10" r="1.5" opacity="0.8"/>
    <circle cx="13" cy="14" r="1.5" opacity="0.8"/>
    <circle cx="16" cy="12" r="1.5" opacity="0.8"/>
    <circle cx="19" cy="11" r="1.5" opacity="0.8"/>
    <circle cx="19" cy="13" r="1.5" opacity="0.8"/>
  </svg>
);

export const BoxPlotIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <line x1="6" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="4" y="8" width="4" height="8" fill="none" stroke="currentColor" strokeWidth="1.5"/>
    <line x1="4" y1="12" x2="8" y2="12" stroke="currentColor" strokeWidth="2"/>
    <line x1="12" y1="4" x2="12" y2="20" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="10" y="7" width="4" height="10" fill="none" stroke="currentColor" strokeWidth="1.5"/>
    <line x1="10" y1="11" x2="14" y2="11" stroke="currentColor" strokeWidth="2"/>
    <line x1="18" y1="8" x2="18" y2="16" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="16" y="10" width="4" height="6" fill="none" stroke="currentColor" strokeWidth="1.5"/>
    <line x1="16" y1="13" x2="20" y2="13" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

export const BumpIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M2 6L8 12L14 8L22 14" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path d="M2 10L8 16L14 12L22 18" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.7"/>
    <path d="M2 14L8 8L14 16L22 10" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.5"/>
    <circle cx="2" cy="6" r="1.5"/>
    <circle cx="8" cy="12" r="1.5"/>
    <circle cx="14" cy="8" r="1.5"/>
    <circle cx="22" cy="14" r="1.5"/>
  </svg>
);

export const CalendarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <rect x="3" y="4" width="18" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="5" y="12" width="2" height="2" opacity="0.3"/>
    <rect x="9" y="12" width="2" height="2" opacity="0.7"/>
    <rect x="13" y="12" width="2" height="2" opacity="0.5"/>
    <rect x="17" y="12" width="2" height="2" opacity="0.9"/>
    <rect x="5" y="16" width="2" height="2" opacity="0.6"/>
    <rect x="9" y="16" width="2" height="2" opacity="0.4"/>
    <rect x="13" y="16" width="2" height="2" opacity="0.8"/>
  </svg>
);

export const ChordIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M12 3A9 9 0 0 1 21 12" fill="currentColor" opacity="0.3"/>
    <path d="M21 12A9 9 0 0 1 12 21" fill="currentColor" opacity="0.5"/>
    <path d="M12 21A9 9 0 0 1 3 12" fill="currentColor" opacity="0.7"/>
    <path d="M3 12A9 9 0 0 1 12 3" fill="currentColor" opacity="0.4"/>
    <path d="M12 3Q18 9 21 12" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.6"/>
    <path d="M21 12Q15 18 12 21" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.6"/>
  </svg>
);

export const CirclePackingIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="8" cy="8" r="3" fill="none" stroke="currentColor" strokeWidth="1"/>
    <circle cx="16" cy="8" r="2.5" fill="none" stroke="currentColor" strokeWidth="1"/>
    <circle cx="8" cy="16" r="2" fill="none" stroke="currentColor" strokeWidth="1"/>
    <circle cx="16" cy="16" r="3" fill="none" stroke="currentColor" strokeWidth="1"/>
    <circle cx="6" cy="8" r="1" opacity="0.7"/>
    <circle cx="10" cy="8" r="0.8" opacity="0.7"/>
    <circle cx="16" cy="6" r="0.6" opacity="0.7"/>
  </svg>
);

export const DendrogramIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M4 20v-4h8v-4h4v-4h4" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <path d="M12 12v4h-4v4" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <path d="M16 8v4h-4" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <circle cx="4" cy="20" r="1.5"/>
    <circle cx="8" cy="20" r="1.5"/>
    <circle cx="12" cy="16" r="1.5"/>
    <circle cx="16" cy="12" r="1.5"/>
    <circle cx="20" cy="8" r="1.5"/>
  </svg>
);

export const ConvexHullIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="4,18 8,6 16,4 20,8 18,16 10,20" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.5"/>
    <circle cx="6" cy="15" r="1"/>
    <circle cx="9" cy="8" r="1"/>
    <circle cx="15" cy="7" r="1"/>
    <circle cx="18" cy="10" r="1"/>
    <circle cx="16" cy="16" r="1"/>
    <circle cx="12" cy="18" r="1"/>
    <circle cx="12" cy="12" r="1"/>
    <circle cx="10" cy="14" r="1"/>
    <circle cx="14" cy="11" r="1"/>
  </svg>
);

export const GanttIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <rect x="2" y="4" width="8" height="2" opacity="0.8"/>
    <rect x="4" y="8" width="12" height="2" opacity="0.6"/>
    <rect x="6" y="12" width="6" height="2" opacity="0.7"/>
    <rect x="3" y="16" width="10" height="2" opacity="0.5"/>
    <rect x="8" y="20" width="8" height="2" opacity="0.9"/>
    <line x1="2" y1="2" x2="22" y2="2" stroke="currentColor" strokeWidth="1"/>
    <text x="1" y="5" fontSize="2" fill="currentColor">A</text>
    <text x="1" y="9" fontSize="2" fill="currentColor">B</text>
    <text x="1" y="13" fontSize="2" fill="currentColor">C</text>
  </svg>
);

export const HexbinIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="12,2 22,8 22,16 12,22 2,16 2,8" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
    <polygon points="8,6 14,6 17,12 14,18 8,18 5,12" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
    <polygon points="10,8 14,8 16,12 14,16 10,16 8,12" fill="currentColor" opacity="0.7"/>
    <polygon points="11,10 13,10 14,12 13,14 11,14 10,12" fill="currentColor" opacity="0.9"/>
  </svg>
);

export const HorizonIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M2 12h20" stroke="currentColor" strokeWidth="1"/>
    <path d="M2 8Q6 4 10 8T18 12T22 8" fill="currentColor" opacity="0.3"/>
    <path d="M2 12Q6 16 10 12T18 8T22 12" fill="currentColor" opacity="0.5"/>
    <path d="M2 16Q6 20 10 16T18 12T22 16" fill="currentColor" opacity="0.7"/>
  </svg>
);

export const MatrixIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <rect x="3" y="3" width="3" height="3" opacity="0.3"/>
    <rect x="7" y="3" width="3" height="3" opacity="0.7"/>
    <rect x="11" y="3" width="3" height="3" opacity="0.5"/>
    <rect x="15" y="3" width="3" height="3" opacity="0.9"/>
    <rect x="3" y="7" width="3" height="3" opacity="0.8"/>
    <rect x="7" y="7" width="3" height="3" opacity="0.4"/>
    <rect x="11" y="7" width="3" height="3" opacity="1"/>
    <rect x="15" y="7" width="3" height="3" opacity="0.2"/>
    <rect x="3" y="11" width="3" height="3" opacity="0.6"/>
    <rect x="7" y="11" width="3" height="3" opacity="0.9"/>
    <rect x="11" y="11" width="3" height="3" opacity="0.3"/>
    <rect x="15" y="11" width="3" height="3" opacity="0.8"/>
  </svg>
);

export const ParallelIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <line x1="4" y1="2" x2="4" y2="22" stroke="currentColor" strokeWidth="1.5"/>
    <line x1="12" y1="2" x2="12" y2="22" stroke="currentColor" strokeWidth="1.5"/>
    <line x1="20" y1="2" x2="20" y2="22" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M4 6L12 10L20 4" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.7"/>
    <path d="M4 12L12 8L20 14" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.5"/>
    <path d="M4 18L12 16L20 20" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.8"/>
  </svg>
);

export const RadarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="12,3 19,8 19,16 12,21 5,16 5,8" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
    <polygon points="12,6 16,9 16,15 12,18 8,15 8,9" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
    <polygon points="12,9 14,10.5 14,13.5 12,15 10,13.5 10,10.5" fill="currentColor" opacity="0.7"/>
    <path d="M12 12L12 3M12 12L19 8M12 12L19 16M12 12L12 21M12 12L5 16M12 12L5 8" stroke="currentColor" strokeWidth="0.5"/>
  </svg>
);

export const SankeyIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <rect x="2" y="4" width="2" height="4" opacity="0.8"/>
    <rect x="2" y="10" width="2" height="6" opacity="0.6"/>
    <rect x="2" y="18" width="2" height="4" opacity="0.7"/>
    <rect x="20" y="6" width="2" height="6" opacity="0.5"/>
    <rect x="20" y="14" width="2" height="8" opacity="0.9"/>
    <path d="M4 6C8 6 12 8 16 10C18 11 20 8 20 9" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.4"/>
    <path d="M4 13C8 13 12 15 16 17C18 18 20 17 20 18" fill="none" stroke="currentColor" strokeWidth="4" opacity="0.6"/>
  </svg>
);

export const SlopeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <line x1="4" y1="2" x2="4" y2="22" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
    <line x1="20" y1="2" x2="20" y2="22" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
    <line x1="4" y1="6" x2="20" y2="8" stroke="currentColor" strokeWidth="2" opacity="0.7"/>
    <line x1="4" y1="10" x2="20" y2="14" stroke="currentColor" strokeWidth="2" opacity="0.5"/>
    <line x1="4" y1="14" x2="20" y2="10" stroke="currentColor" strokeWidth="2" opacity="0.8"/>
    <line x1="4" y1="18" x2="20" y2="18" stroke="currentColor" strokeWidth="2" opacity="0.6"/>
    <circle cx="4" cy="6" r="1.5"/>
    <circle cx="20" cy="8" r="1.5"/>
  </svg>
);

export const StreamIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M2 12Q6 8 10 12T18 12T22 12" fill="none" stroke="currentColor" strokeWidth="0"/>
    <path d="M2 12Q6 8 10 12T18 12T22 12 Q18 16 14 12T6 12T2 12Z" fill="currentColor" opacity="0.3"/>
    <path d="M2 12Q6 10 10 12T18 12T22 12 Q18 14 14 12T6 12T2 12Z" fill="currentColor" opacity="0.5"/>
    <path d="M2 12Q6 11 10 12T18 12T22 12 Q18 13 14 12T6 12T2 12Z" fill="currentColor" opacity="0.7"/>
  </svg>
);

export const SunburstIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.9"/>
    <path d="M12 3A9 9 0 0 1 21 12A9 9 0 0 1 12 21A9 9 0 0 1 3 12A9 9 0 0 1 12 3Z" fill="none" stroke="currentColor" strokeWidth="1"/>
    <path d="M12 6A6 6 0 0 1 18 12L15 12A3 3 0 0 0 12 9Z" fill="currentColor" opacity="0.6"/>
    <path d="M18 12A6 6 0 0 1 12 18L12 15A3 3 0 0 0 15 12Z" fill="currentColor" opacity="0.7"/>
    <path d="M12 18A6 6 0 0 1 6 12L9 12A3 3 0 0 0 12 15Z" fill="currentColor" opacity="0.5"/>
    <path d="M6 12A6 6 0 0 1 12 6L12 9A3 3 0 0 0 9 12Z" fill="currentColor" opacity="0.8"/>
  </svg>
);

export const TreemapIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <rect x="2" y="2" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="3" y="3" width="9" height="7" fill="currentColor" opacity="0.3"/>
    <rect x="13" y="3" width="8" height="7" fill="currentColor" opacity="0.6"/>
    <rect x="3" y="11" width="6" height="10" fill="currentColor" opacity="0.8"/>
    <rect x="10" y="11" width="5" height="6" fill="currentColor" opacity="0.4"/>
    <rect x="16" y="11" width="5" height="6" fill="currentColor" opacity="0.7"/>
    <rect x="10" y="18" width="11" height="3" fill="currentColor" opacity="0.5"/>
  </svg>
);

export const ViolinIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 4C6 4 8 6 8 12C8 18 6 20 6 20C6 20 4 18 4 12C4 6 6 4 6 4" fill="currentColor" opacity="0.6"/>
    <path d="M12 3C12 3 15 5 15 12C15 19 12 21 12 21C12 21 9 19 9 12C9 5 12 3 12 3" fill="currentColor" opacity="0.8"/>
    <path d="M18 5C18 5 20 7 20 12C20 17 18 19 18 19C18 19 16 17 16 12C16 7 18 5 18 5" fill="currentColor" opacity="0.4"/>
    <line x1="4" y1="12" x2="8" y2="12" stroke="currentColor" strokeWidth="1"/>
    <line x1="9" y1="12" x2="15" y2="12" stroke="currentColor" strokeWidth="1"/>
    <line x1="16" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="1"/>
  </svg>
);

export const VoronoiIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="2,2 12,2 8,12 2,12" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
    <polygon points="12,2 22,2 22,8 16,12 8,12" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
    <polygon points="2,12 8,12 12,22 2,22" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
    <polygon points="8,12 16,12 22,8 22,22 12,22" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
    <circle cx="5" cy="7" r="1" opacity="0.8"/>
    <circle cx="17" cy="5" r="1" opacity="0.8"/>
    <circle cx="7" cy="17" r="1" opacity="0.8"/>
    <circle cx="18" cy="15" r="1" opacity="0.8"/>
  </svg>
);

export const VoronoiTreemapIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C18.6 2 22 5.4 22 12C22 18.6 18.6 22 12 22C5.4 22 2 18.6 2 12C2 5.4 5.4 2 12 2Z" fill="none" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M12 5C12 5 8 8 6 12C8 16 12 19 12 19C16 16 18 12 16 8C14 6 12 5 12 5" fill="currentColor" opacity="0.3"/>
    <path d="M12 7C12 7 10 9 9 12C10 15 12 17 12 17C14 15 15 12 14 9C13 8 12 7 12 7" fill="currentColor" opacity="0.6"/>
    <path d="M12 9C12 9 11 10 11 12C11 14 12 15 12 15C13 14 13 12 13 10C12.5 9.5 12 9 12 9" fill="currentColor" opacity="0.9"/>
  </svg>
);