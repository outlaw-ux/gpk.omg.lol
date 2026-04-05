import type { AnchorHTMLAttributes, ReactNode } from 'react';

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  tone?: 'primary' | 'secondary';
};

export function ButtonLink({
  children,
  className = '',
  tone = 'primary',
  ...props
}: ButtonLinkProps) {
  return (
    <a
      className={`button-link button-link--${tone} ${className}`.trim()}
      {...props}
    >
      <span>{children}</span>
    </a>
  );
}
