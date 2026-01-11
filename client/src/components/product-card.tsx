import { Link } from "wouter";
import { Heart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Product } from "@shared/schema";
import { useCart } from "@/lib/cart-context";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Link href={`/products/${product.id}`}>
      <Card
        className="group overflow-visible border-0 bg-transparent shadow-none cursor-pointer"
        data-testid={`card-product-${product.id}`}
      >
        <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-muted">
          {product.images[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No Image
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isNew && (
              <Badge variant="default" className="text-xs" data-testid="badge-new">
                New
              </Badge>
            )}
            {discount > 0 && (
              <Badge variant="destructive" className="text-xs" data-testid="badge-sale">
                -{discount}%
              </Badge>
            )}
          </div>

          {/* Wishlist Button */}
          <Button
            variant="secondary"
            size="icon"
            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 rounded-full"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            data-testid="button-wishlist"
          >
            <Heart className="h-4 w-4" />
          </Button>

          {/* Quick Add Button */}
          <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              className="w-full"
              size="sm"
              onClick={handleAddToCart}
              data-testid="button-quick-add"
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>

        <div className="mt-4 space-y-1">
          <p className="text-sm text-muted-foreground">{product.fabric}</p>
          <h3
            className="font-medium text-foreground line-clamp-1"
            data-testid={`text-product-name-${product.id}`}
          >
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground" data-testid={`text-product-price-${product.id}`}>
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ₹{product.originalPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
