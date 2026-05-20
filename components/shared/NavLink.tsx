// components/nav-link.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface NavLinkProps extends React.ComponentPropsWithoutRef<typeof Link> {
  className?: string;
  activeClassName?: string;
  pendingClassName?: string;
  exact?: boolean;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ className, activeClassName, pendingClassName, exact = false, href, ...props }, ref) => {
    const pathname = usePathname();
    
    // Vérifier si le lien est actif
    const isActive = exact 
      ? pathname === href 
      : pathname?.startsWith(href as string);
    
    // Pour le "pending", Next.js n'a pas d'état équivalent par défaut
    // Vous pouvez utiliser un état de chargement personnalisé si nécessaire
    const isPending = false; // À personnaliser selon vos besoins
    
    return (
      <Link
        ref={ref}
        href={href}
        className={cn(
          className,
          isActive && activeClassName,
          isPending && pendingClassName
        )}
        {...props}
      />
    );
  }
);

NavLink.displayName = "NavLink";

export { NavLink };