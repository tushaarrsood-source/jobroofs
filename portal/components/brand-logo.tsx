'use client';

import React from 'react';
import Link from '@/components/ui/link';

interface BrandLogoProps {
  variant?: 'full' | 'compact' | 'mark' | 'dark';
  className?: string;
  href?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * JOBROOFS Silent Luxury Architectural Mark
 * Minimalist 1.25px rafter truss geometry.
 */
export function JobroofsMark({
  size = 28,
  variant = 'light',
  className = '',
}: {
  size?: number;
  variant?: 'light' | 'dark';
  className?: string;
}) {
  const isDark = variant === 'dark';
  const strokeColor = isDark ? '#FBFBF8' : '#202A31';
  const accentColor = isDark ? '#A0AAA4' : '#7E8A84';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-opacity duration-200 group-hover:opacity-80 ${className}`}
      aria-hidden="true"
    >
      {/* Precision Hairline Roof Chevron (1.5px Stroke) */}
      <path
        d="M5 19L16 7L27 19"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Subtle Structural Rafter Beam */}
      <path
        d="M9.5 19H22.5"
        stroke={accentColor}
        strokeWidth="1"
        strokeLinecap="round"
      />
      {/* Quiet Keystone Aperture Dot */}
      <circle
        cx="16"
        cy="13.5"
        r="1.25"
        fill={strokeColor}
      />
    </svg>
  );
}

export function BrandLogo({
  variant = 'compact',
  className = '',
  href = '/',
  size = 'md',
}: BrandLogoProps) {
  const isDark = variant === 'dark';

  const markSize = size === 'sm' ? 22 : size === 'lg' ? 32 : 26;
  const textSize = size === 'sm' ? 'text-[14px]' : size === 'lg' ? 'text-[20px]' : 'text-[16px]';

  const content = (
    <div className={`group inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Quiet Luxury Architectural Mark */}
      <JobroofsMark size={markSize} variant={isDark ? 'dark' : 'light'} />

      {/* Editorial Wordmark and Tagline */}
      {variant !== 'mark' && (
        <div className="flex flex-col">
          <div className="flex items-baseline">
            <span
              className={`${textSize} font-medium tracking-[0.14em] uppercase ${
                isDark ? 'text-[#FBFBF8]' : 'text-[#202A31]'
              }`}
              style={{ fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, sans-serif" }}
            >
              JOBROOFS
            </span>
          </div>

          {variant === 'full' && (
            <span
              className={`text-[8.5px] font-normal uppercase tracking-[0.22em] -mt-0.5 ${
                isDark ? 'text-[#A0AAA4]' : 'text-[#7E8A84]'
              }`}
              style={{ fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, sans-serif" }}
            >
              The portal for Temp Jobs
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center focus:outline-none cursor-pointer">
        {content}
      </Link>
    );
  }

  return content;
}
