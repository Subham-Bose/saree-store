import { Link } from "wouter";

const footerLinks = {
  shop: [
    { href: "/products?category=silk", label: "Silk Sarees" },
    { href: "/products?category=cotton", label: "Cotton Sarees" },
    { href: "/products?category=designer", label: "Designer Sarees" },
    { href: "/products?occasion=wedding", label: "Wedding Collection" },
  ],
  support: [
    { href: "#", label: "Contact Us" },
    { href: "#", label: "Shipping Info" },
    { href: "#", label: "Returns & Exchanges" },
    { href: "#", label: "Size Guide" },
  ],
  about: [
    { href: "#", label: "Our Story" },
    { href: "#", label: "Craftsmanship" },
    { href: "#", label: "Sustainability" },
    { href: "#", label: "Blog" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/">
              <span className="font-serif text-2xl font-semibold text-primary" data-testid="text-footer-logo">
                Vastra
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Celebrating the timeless elegance of Indian sarees. Each piece is carefully
              curated to bring you the finest in traditional and contemporary designs.
            </p>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4" data-testid="text-footer-shop-title">Shop</h3>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.label}>
                  <Link href={link.href}>
                    <span className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4" data-testid="text-footer-support-title">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link href={link.href}>
                    <span className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4" data-testid="text-footer-about-title">About</h3>
            <ul className="space-y-3">
              {footerLinks.about.map((link) => (
                <li key={link.label}>
                  <Link href={link.href}>
                    <span className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground" data-testid="text-copyright">
            © 2024 Vastra. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-sm text-muted-foreground">Secure Payments</span>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="text-xs">Visa</span>
              <span className="text-xs">Mastercard</span>
              <span className="text-xs">UPI</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
