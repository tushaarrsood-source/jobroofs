'use client';

import React, { forwardRef } from 'react';

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string | { pathname?: string; query?: Record<string, string | number>; hash?: string };
  prefetch?: boolean;
  replace?: boolean;
  scroll?: boolean;
  shallow?: boolean;
  legacyBehavior?: boolean;
  passHref?: boolean;
}

function formatHref(
  href: string | { pathname?: string; query?: Record<string, string | number>; hash?: string }
): string {
  if (typeof href === 'string') return href;
  let url = href.pathname || '';
  if (href.query) {
    const params = new URLSearchParams();
    Object.entries(href.query).forEach(([k, v]) => params.set(k, String(v)));
    const qs = params.toString();
    if (qs) url += (url.includes('?') ? '&' : '?') + qs;
  }
  if (href.hash) {
    url += href.hash.startsWith('#') ? href.hash : `#${href.hash}`;
  }
  return url || '/';
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  {
    href,
    replace = false,
    scroll = true,
    shallow,
    prefetch,
    legacyBehavior,
    passHref,
    onClick,
    children,
    ...rest
  },
  ref
) {
  const url = formatHref(href);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      onClick(e);
    }
    // Allow user to use modifier keys for opening in new tabs
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
      return;
    }

    if (rest.target && rest.target !== '_self') {
      return;
    }

    if (replace) {
      e.preventDefault();
      window.location.replace(url);
    }
  };

  return (
    <a
      ref={ref}
      href={url}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </a>
  );
});

export default Link;

