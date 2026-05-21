"use client";

import {
  LayoutDashboard,
  Heart,
  Users,
  Ticket,
  BarChart3,
  Settings,
} from "lucide-react";

import { NavLink } from "@/components/NavLink";
import { usePathname, useRouter } from "next/navigation";


import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useLanguage } from "@/lib/contexts/LanguageContexte";

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = usePathname();
  const route = useRouter();
  const { t } = useLanguage();

  const items = [
    { title: t("dashboard"), url: "/board", icon: LayoutDashboard },
    { title: t("weddings"), url: "/weddings", icon: Heart },
    { title: t("guests"), url: "/guests", icon: Users },
    { title: t("tickets"), url: "/tickets", icon: Ticket },

    { title: t("settings"), url: "/parametre", icon: Settings },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="pt-6">
        <div
          className={`px-4 mb-8 flex items-center gap-2 ${collapsed ? "justify-center" : ""
            }`}
        >
          <Heart className="h-7 w-7 text-primary fill-primary" />
          {!collapsed && (
            <span onClick={() => route.push('/')} className="text-xl font-bold gold-text tracking-tight cursor-pointer">
              Tiely
            </span>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = pathname === item.url;

                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        href={item.url} // ✅ Next.js
                        exact={item.url === "/"} // remplace "end"
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${isActive
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                          }`}
                        activeClassName="bg-primary/10 text-primary font-medium"
                      >
                        <item.icon className="h-5 w-5 shrink-0" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}