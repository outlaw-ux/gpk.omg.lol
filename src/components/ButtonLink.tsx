import type { AnchorHTMLAttributes, ReactNode } from 'react';

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  tone?: 'primary' | 'secondary';
};

function isExternalHref(href?: string) {
  return typeof href === 'string' && /^https?:\/\//.test(href);
}

export function ButtonLink({
  children,
  className = '',
  tone = 'primary',
  href,
  rel,
  target,
  ...props
}: ButtonLinkProps) {
  const external = isExternalHref(href);

  return (
    <a
      className={`button-link button-link--${tone} ${className}`.trim()}
      href={href}
      rel={rel ?? (external ? 'noreferrer' : undefined)}
      target={target ?? (external ? '_blank' : undefined)}
      {...props}
    >
      <span>{children}</span>
    </a>
  );
}
