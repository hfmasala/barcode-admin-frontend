// frontend/src/components/layout/MainLayout.jsx

import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Toaster } from "@/components/ui/sonner";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'; // Import Sheet components
import { Menu } from 'lucide-react'; // Import Menu icon

// Helper for NavLink active styling
const getNavLinkClass = ({ isActive }) =>
  isActive
    ? 'text-foreground'
    : 'text-muted-foreground transition-colors hover:text-foreground';

export default function MainLayout() {
  const { logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 md:px-6">
        
        {/* Left side: Logo + Desktop Nav */}
        <nav className="flex items-center gap-6 text-lg font-medium md:gap-5 lg:gap-6">
          <NavLink
            to="/dashboard"
            className="flex items-center gap-2 text-lg font-semibold text-foreground"
          >
            <img src="/logo.png" alt="HF Masala Logo" className="h-8 w-auto" />
            <span className="hidden sm:inline">HF Masala</span>
          </NavLink>
          
          {/* --- DESKTOP NAV --- */}
          <NavLink
            to="/dashboard"
            className={(navData) => `${getNavLinkClass(navData)} hidden md:block`}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/skus"
            className={(navData) => `${getNavLinkClass(navData)} hidden md:block`}
          >
            Manage SKUs
          </NavLink>
        </nav>

        {/* Right side: Mobile Menu + Logout */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={logout}>
            Logout
          </Button>

          {/* --- MOBILE MENU --- */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden" // Only show on mobile
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <nav className="grid gap-6 text-lg font-medium">
                <NavLink
                  to="/dashboard"
                  className="flex items-center gap-2 text-lg font-semibold"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <img src="/logo.png" alt="HF Masala Logo" className="h-8 w-auto" />
                  <span>HF Masala</span>
                </NavLink>
                <NavLink
                  to="/dashboard"
                  className={getNavLinkClass}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/skus"
                  className={getNavLinkClass}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Manage SKUs
                </NavLink>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Main content */}
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Outlet />
      </main>
      <Toaster />
    </div>
  );
}