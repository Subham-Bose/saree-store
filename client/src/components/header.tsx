import { Link, useLocation } from "wouter";
import { ShoppingBag, User, Menu, X, Moon, Sun, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { useTheme } from "@/components/theme-provider";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop" },
  { href: "/products?category=silk", label: "Silk Sarees" },
  { href: "/products?category=cotton", label: "Cotton Sarees" },
];

export function Header() {
  const [location] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const { totalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" data-testid="button-mobile-menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <div className="flex flex-col gap-6 mt-8">
                <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                  <span className="font-serif text-2xl font-semibold text-primary">Vastra</span>
                </Link>
                <nav className="flex flex-col gap-2">
                  {navLinks.map((link) => (
                    <SheetClose asChild key={link.href}>
                      <Link href={link.href}>
                        <span
                          className={`block py-2 px-3 rounded-md text-base transition-colors hover-elevate ${
                            location === link.href
                              ? "bg-primary text-primary-foreground"
                              : "text-foreground"
                          }`}
                          data-testid={`link-nav-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                        >
                          {link.label}
                        </span>
                      </Link>
                    </SheetClose>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location === link.href ? "text-primary" : "text-muted-foreground"
                  }`}
                  data-testid={`link-nav-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {link.label}
                </span>
              </Link>
            ))}
          </nav>

          {/* Logo - Centered */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2">
            <span className="font-serif text-2xl md:text-3xl font-semibold text-primary tracking-wide" data-testid="text-logo">
              Vastra
            </span>
          </Link>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              data-testid="button-theme-toggle"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            <Link href={user ? "/account" : "/login"}>
              <Button variant="ghost" size="icon" data-testid="button-account">
                <User className="h-5 w-5" />
              </Button>
            </Link>

            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative" data-testid="button-cart">
                <ShoppingBag className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    data-testid="badge-cart-count"
                  >
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
