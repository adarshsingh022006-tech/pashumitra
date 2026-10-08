import React from 'react';
import { Shield, Leaf } from 'lucide-react';

export default function BrandLogo({ size = 'default' }) {
  const isLarge = size === 'large';
  const isSmall = size === 'small';

  return (
    <div className="flex items-center gap-1.5 select-none font-bold tracking-tight">
      <div className="relative flex items-center font-sans">
        {/* "Pashu" in dark green #1B5E20 */}
        <span
          className={`font-extrabold tracking-tight ${
            isLarge ? 'text-3xl' : isSmall ? 'text-lg' : 'text-2xl'
          }`}
          style={{ color: '#1B5E20' }}
        >
          Pashu
        </span>

        {/* "Rakshak" in light green #7CB342 with protective shield accent */}
        <span
          className={`relative font-extrabold flex items-center tracking-tight ml-0.5 ${
            isLarge ? 'text-3xl' : isSmall ? 'text-lg' : 'text-2xl'
          }`}
          style={{ color: '#7CB342' }}
        >
          <span>Rakshak</span>
          <Shield
            className="ml-1 text-[#7CB342] fill-[#7CB342]/20"
            size={isLarge ? 20 : isSmall ? 13 : 16}
          />
        </span>
      </div>
    </div>
  );
}
