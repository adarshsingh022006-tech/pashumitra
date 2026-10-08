import React from 'react';
import { Leaf } from 'lucide-react';

export default function BrandLogo({ size = 'default' }) {
  const isLarge = size === 'large';
  const isSmall = size === 'small';

  return (
    <div className="flex items-center gap-1.5 select-none font-bold tracking-tight">
      <div className="relative flex items-baseline font-sans">
        {/* "Pashu" in dark green #1B5E20 */}
        <span
          className={`font-extrabold ${
            isLarge ? 'text-3xl' : isSmall ? 'text-lg' : 'text-2xl'
          }`}
          style={{ color: '#1B5E20' }}
        >
          Pashu
        </span>

        {/* "Mitra" in light green #7CB342 with leaf on the "i" */}
        <span
          className={`relative font-extrabold flex items-baseline ${
            isLarge ? 'text-3xl' : isSmall ? 'text-lg' : 'text-2xl'
          }`}
          style={{ color: '#7CB342' }}
        >
          <span>M</span>
          {/* Customized 'i' with small leaf on top */}
          <span className="relative inline-block">
            <span className="opacity-0">i</span>
            <span className="absolute bottom-0 left-0 right-0 text-center">ı</span>
            <Leaf
              className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-[#7CB342] fill-[#7CB342] rotate-12"
              size={isLarge ? 13 : isSmall ? 8 : 10}
            />
          </span>
          <span>tra</span>
        </span>
      </div>
    </div>
  );
}
