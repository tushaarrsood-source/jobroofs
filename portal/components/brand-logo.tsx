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
 * JOBROOFS Architectural Apex Roof Vector Emblem
 * Mathematical roofline with precision portal aperture
 */
export function JobroofsMark({
  size = 32,
  variant = 'light',
  className = '',
}: {
  size?: number;
  variant?: 'light' | 'dark';
  className?: string;
}) {
  const isDark = variant === 'dark';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-transform duration-200 group-hover:scale-105 ${className}`}
      aria-hidden="true"
    >
      <defs>
        {/* Obsidian to Forest Gradient */}
        <linearGradient id="roofPrimaryGrad" x1="4" y1="2" x2="32" y2="34" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={isDark ? '#34d399' : '#1b4332'} />
          <stop offset="100%" stopColor={isDark ? '#10b981' : '#0a1c14'} />
        </linearGradient>

        {/* Luminous Apex Highlight */}
        <linearGradient id="apexShine" x1="18" y1="4" x2="18" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={isDark ? '#ffffff' : '#34d399'} stopOpacity="0.9" />
          <stop offset="100%" stopColor={isDark ? '#34d399' : '#1b4332'} stopOpacity="0.2" />
        </linearGradient>
      </defs>

      {/* Rounded Architectural Base Grounding */}
      <rect
        x="3"
        y="3"
        width="30"
        height="30"
        rx="9"
        fill={isDark ? '#1f2b26' : '#ffffff'}
        stroke={isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}
        strokeWidth="1"
      />

      {/* The Architectural Roofline (Peak Chevron) */}
      <path
        d="M18 7.5L6.5 17.5L9.5 20L18 12.5L26.5 20L29.5 17.5L18 7.5Z"
        fill="url(#roofPrimaryGrad)"
      />

      {/* The Portal Doorway / Inner Aperture */}
      <path
        d="M13.5 28.5V20.5C13.5 18.0147 15.5147 16 18 16C20.4853 16 22.5 18.0147 22.5 20.5V28.5H13.5Z"
        fill={isDark ? '#34d399' : '#1b4332'}
        fillOpacity={isDark ? '0.85' : '0.9'}
      />

      {/* Apex Keystone Dot */}
      <circle cx="18" cy="10" r="1.5" fill={isDark ? '#ffffff' : '#34d399'} />
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

  const markSize = size === 'sm' ? 26 : size === 'lg' ? 38 : 32;
  const textSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-xl';

  const content = (
    <div className={`group inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Precision Roof Mark */}
      <JobroofsMark size={markSize} variant={isDark ? 'dark' : 'light'} />

      {/* Wordmark and Tagline */}
      {variant !== 'mark' && (
        <div className="flex flex-col">
          <div className="flex items-baseline">
            <span
              className={`${textSize} font-extrabold tracking-[-0.035em] ${
                isDark ? 'text-white' : 'text-[#111816]'
              }`}
              style={{
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif',
              }}
            >
              JOBROOFS
            </span>
            <span
              className={`font-black ${
                isDark ? 'text-[#34d399]' : 'text-[#1b4332]'
              }`}
            >
              .
            </span>
          </div>

          {variant === 'full' && (
            <span
              className={`text-[9.5px] font-bold uppercase tracking-[0.14em] -mt-1 ${
                isDark ? 'text-[#8fa099]' : 'text-[#5c6863]'
              }`}
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
