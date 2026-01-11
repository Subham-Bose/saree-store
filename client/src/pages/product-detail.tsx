import { useState } from "react";
import { useRoute, Link } from "wouter";
import { Minus, Plus, ShoppingBag, Heart, ChevronLeft, Truck, RefreshCw, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { ProductCard } from "@/components/product-card";
import { useQuery } from "@tanstack/react-query";
import { useCart } from "@/lib/cart-context";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@shared/schema";

export default function ProductDetail() {
  const [, params] = useRoute("/products/:id");
  const productId = params?.id;
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ["/api/products/" + productId],
    enabled: !!productId,
  });

  const { data: relatedProducts } = useQuery<Product[]>({
    queryKey: ["/api/products?category=" + (product?.category || "")],
    enabled: !!product?.category,
  });

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      toast({
        title: "Added to cart",
        description: `${product.name} (${quantity}) has been added to your cart.`,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <Skeleton className="aspect-[4/5] rounded-md" />
              <div className="flex gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="w-20 h-24 rounded-md" />
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4" data-testid="text-product-not-found">Product not found</p>
          <Link href="/products">
            <Button data-testid="button-back-to-shop">Back to Shop</Button>
          </Link>
        </div>
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <Link href="/products">
          <span className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-back-to-shop">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Shop
          </span>
        </Link>
      </div>

      {/* Product Details */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-[4/5] overflow-hidden rounded-md bg-muted">
              <img
                src={product.images[selectedImage] || ""}
                alt={product.name}
                className="w-full h-full object-cover"
                data-testid="img-product-main"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-24 rounded-md overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? "border-primary" : "border-transparent"
                    }`}
                    data-testid={`button-thumbnail-${index}`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="lg:sticky lg:top-24 lg:self-start space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {product.isNew && (
                  <Badge variant="default" data-testid="badge-product-new">New</Badge>
                )}
                {discount > 0 && (
                  <Badge variant="destructive" data-testid="badge-product-sale">-{discount}% OFF</Badge>
                )}
              </div>
              <h1 className="font-serif text-2xl md:text-3xl font-semibold text-foreground" data-testid="text-product-name">
                {product.name}
              </h1>
              <p className="text-muted-foreground mt-1">{product.fabric}</p>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-semibold text-foreground" data-testid="text-product-price">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  ₹{product.originalPrice.toLocaleString("en-IN")}
                </span>
              )}
            </div>

            <p className="text-muted-foreground leading-relaxed" data-testid="text-product-description">
              {product.description}
            </p>

            <Separator />

            {/* Quantity & Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Quantity</span>
                <div className="flex items-center border border-border rounded-md">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    data-testid="button-quantity-minus"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium" data-testid="text-quantity">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity((q) => q + 1)}
                    data-testid="button-quantity-plus"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  size="lg"
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  data-testid="button-add-to-cart"
                >
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  {product.inStock ? "Add to Cart" : "Out of Stock"}
                </Button>
                <Button variant="outline" size="lg" data-testid="button-wishlist">
                  <Heart className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="flex flex-col items-center text-center p-3 bg-muted rounded-md">
                <Truck className="h-5 w-5 text-primary mb-2" />
                <span className="text-xs text-muted-foreground">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center p-3 bg-muted rounded-md">
                <RefreshCw className="h-5 w-5 text-primary mb-2" />
                <span className="text-xs text-muted-foreground">Easy Returns</span>
              </div>
              <div className="flex flex-col items-center text-center p-3 bg-muted rounded-md">
                <Shield className="h-5 w-5 text-primary mb-2" />
                <span className="text-xs text-muted-foreground">Secure Payment</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full justify-start border-b border-border rounded-none bg-transparent p-0">
              <TabsTrigger
                value="description"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                data-testid="tab-description"
              >
                Description
              </TabsTrigger>
              <TabsTrigger
                value="fabric"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                data-testid="tab-fabric"
              >
                Fabric Details
              </TabsTrigger>
              <TabsTrigger
                value="care"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                data-testid="tab-care"
              >
                Care Instructions
              </TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="pt-6">
              <p className="text-muted-foreground leading-relaxed max-w-3xl">
                {product.description}
              </p>
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <span className="text-sm font-medium text-foreground">Category</span>
                  <p className="text-sm text-muted-foreground">{product.category}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-foreground">Occasion</span>
                  <p className="text-sm text-muted-foreground">{product.occasion}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-foreground">Color</span>
                  <p className="text-sm text-muted-foreground">{product.color}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-foreground">Fabric</span>
                  <p className="text-sm text-muted-foreground">{product.fabric}</p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="fabric" className="pt-6">
              <p className="text-muted-foreground leading-relaxed max-w-3xl">
                This beautiful {product.fabric.toLowerCase()} saree is crafted with the finest quality materials.
                The fabric is soft to touch, has a natural sheen, and drapes elegantly. Perfect for {product.occasion.toLowerCase()} occasions.
              </p>
            </TabsContent>
            <TabsContent value="care" className="pt-6">
              <ul className="space-y-2 text-muted-foreground max-w-3xl">
                <li>Dry clean recommended for first wash</li>
                <li>Hand wash separately in cold water</li>
                <li>Do not bleach or wring</li>
                <li>Dry in shade</li>
                <li>Iron on low heat on reverse side</li>
                <li>Store in a cotton cloth to maintain fabric quality</li>
              </ul>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts && relatedProducts.filter((p) => p.id !== product.id).length > 0 && (
          <div className="mt-16">
            <h2 className="font-serif text-2xl font-semibold text-foreground mb-8" data-testid="text-related-products">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts
                .filter((p) => p.id !== product.id)
                .slice(0, 4)
                .map((relatedProduct) => (
                  <ProductCard key={relatedProduct.id} product={relatedProduct} />
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
