import { Link } from "wouter";
import { ArrowRight, Truck, Shield, RefreshCw, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/components/product-card";
import { useQuery } from "@tanstack/react-query";
import type { Product } from "@shared/schema";

const features = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On orders above ₹2,999",
  },
  {
    icon: Shield,
    title: "Secure Payment",
    description: "100% secure transactions",
  },
  {
    icon: RefreshCw,
    title: "Easy Returns",
    description: "15-day return policy",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Dedicated customer care",
  },
];

const categories = [
  {
    name: "Silk Sarees",
    href: "/products?category=silk",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=800&fit=crop",
  },
  {
    name: "Cotton Sarees",
    href: "/products?category=cotton",
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&h=800&fit=crop",
  },
  {
    name: "Designer Collection",
    href: "/products?category=designer",
    image: "https://images.unsplash.com/photo-1594463750939-ebb28c3f7f75?w=600&h=800&fit=crop",
  },
];

export default function Home() {
  const { data: featuredProducts, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products?featured=true"],
  });

  const { data: newArrivals, isLoading: isLoadingNew } = useQuery<Product[]>({
    queryKey: ["/api/products?new=true"],
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1920&h=1200&fit=crop')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <h1
            className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-white mb-6 leading-tight"
            data-testid="text-hero-title"
          >
            Timeless Elegance in Every Drape
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Discover our exquisite collection of handcrafted sarees, where tradition
            meets contemporary design.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button
                size="lg"
                className="bg-white text-black hover:bg-white/90 backdrop-blur px-8"
                data-testid="button-shop-collection"
              >
                Shop Collection
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/products?category=new">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white bg-white/10 backdrop-blur hover:bg-white/20"
                data-testid="button-new-arrivals"
              >
                New Arrivals
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="flex flex-col items-center text-center p-4">
                <feature.icon className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-medium text-foreground text-sm md:text-base" data-testid={`text-feature-${feature.title.toLowerCase().replace(/\s+/g, "-")}`}>
                  {feature.title}
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-4" data-testid="text-categories-title">
              Shop by Category
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our curated collections of premium sarees, crafted for every occasion.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link key={category.name} href={category.href}>
                <Card className="group overflow-hidden border-0 cursor-pointer hover-elevate">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="font-serif text-2xl font-semibold text-white" data-testid={`text-category-${category.name.toLowerCase().replace(/\s+/g, "-")}`}>
                        {category.name}
                      </h3>
                      <p className="text-white/80 mt-2 flex items-center">
                        Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 md:py-24 bg-card">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground" data-testid="text-featured-title">
                Featured Collection
              </h2>
              <p className="text-muted-foreground mt-2">Handpicked favorites from our collection</p>
            </div>
            <Link href="/products">
              <Button variant="outline" data-testid="button-view-all-featured">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="aspect-[4/5] rounded-md" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                ))
              : featuredProducts?.slice(0, 4).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground" data-testid="text-new-arrivals-title">
                New Arrivals
              </h2>
              <p className="text-muted-foreground mt-2">Fresh additions to our collection</p>
            </div>
            <Link href="/products?new=true">
              <Button variant="outline" data-testid="button-view-all-new">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {isLoadingNew
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="aspect-[4/5] rounded-md" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                ))
              : newArrivals?.slice(0, 4).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-4" data-testid="text-newsletter-title">
            Join Our Community
          </h2>
          <p className="text-primary-foreground/80 mb-8">
            Subscribe to receive exclusive offers, new arrivals, and styling tips.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-md bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
              data-testid="input-newsletter-email"
            />
            <Button
              className="bg-white text-primary hover:bg-white/90"
              data-testid="button-subscribe"
            >
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
