"use client";

import Link, { LinkProps } from "next/link";
import { forwardRef } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavLinkProps extends LinkProps {
  className?: string;
  activeClassName?: string;
  pendingClassName?: string; // optionnel (pas natif Next)
  exact?: boolean;
  children: React.ReactNode;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  (
    {
      href,
      className,
      activeClassName,
      pendingClassName,
      exact = false,
      children,
      ...props
    },
    ref
  ) => {
    const pathname = usePathname();

    const isActive = exact
      ? pathname === href
      : pathname?.startsWith(href.toString());

    return (
      <Link
        ref={ref}
        href={href}
        className={cn(className, isActive && activeClassName)}
        {...props}
      >
        {children}
      </Link>
    );
  }
);

NavLink.displayName = "NavLink";

export { NavLink };