'use client'

import { Bell, Globe, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useLanguage } from "@/lib/contexts/LanguageContexte";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import Link from "next/link";
import { useAuth } from "@/lib/contexts/AuthContexte";


export function Topbar() {
  const { lang, toggleLang } = useLanguage();
  const { signOut, user } = useAuth()

  return (
    <header className="h-14 flex items-center justify-between border-b border-border px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
      </div>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" onClick={toggleLang} className="text-muted-foreground hover:text-foreground">
          <Globe className="h-4 w-4" />
          <span className="sr-only">Toggle language</span>
        </Button>
        <span className="text-xs font-medium text-muted-foreground uppercase">{lang}</span>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground ml-1">
          <Bell className="h-4 w-4" />
        </Button>
        
         <DropdownMenu>
              <DropdownMenuTrigger asChild>
                {
                  user ? 
                  <p className=" cursor-pointer">{user?.email} </p> :
                   <Button
                  variant="ghost"
                  className="relative h-10 w-10 cursor-pointer rounded-full"
                >
                  
                      <User className="h-5 w-5" />
                    
                </Button>
                }
               
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Mon Profil
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {'Dylane'}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href={"/users/setting"}>Mon Compte</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href={"/users/setting"}>Paramètres</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
      </div>
    </header>
  );
}
