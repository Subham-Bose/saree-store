import { Link } from "wouter";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/lib/cart-context";

export default function Cart() {
  const { items, updateQuantity, removeFromCart, subtotal, totalItems } = useCart();

  const shipping = subtotal >= 2999 ? 0 : 199;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="font-serif text-2xl font-semibold text-foreground mb-2" data-testid="text-cart-empty-title">
            Your cart is empty
          </h1>
          <p className="text-muted-foreground mb-6" data-testid="text-cart-empty-description">
            Add some beautiful sarees to get started
          </p>
          <Link href="/products">
            <Button data-testid="button-continue-shopping">
              Continue Shopping
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="font-serif text-3xl font-semibold text-foreground mb-8" data-testid="text-cart-title">
          Shopping Cart ({totalItems})
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id} data-testid={`card-cart-item-${item.id}`}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="w-24 h-32 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                      {item.product.images[0] ? (
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                          No Image
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <Link href={`/products/${item.product.id}`}>
                            <h3 className="font-medium text-foreground hover:text-primary transition-colors line-clamp-1" data-testid={`text-cart-item-name-${item.id}`}>
                              {item.product.name}
                            </h3>
                          </Link>
                          <p className="text-sm text-muted-foreground">{item.product.fabric}</p>
                          <p className="text-sm text-muted-foreground">{item.product.color}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(item.id)}
                          className="text-muted-foreground hover:text-destructive"
                          data-testid={`button-remove-${item.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border border-border rounded-md">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            data-testid={`button-decrease-${item.id}`}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-10 text-center text-sm font-medium" data-testid={`text-quantity-${item.id}`}>
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            data-testid={`button-increase-${item.id}`}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <span className="font-semibold text-foreground" data-testid={`text-item-total-${item.id}`}>
                          ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6 space-y-4">
                <h2 className="font-semibold text-foreground" data-testid="text-order-summary">Order Summary</h2>
                <Separator />
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium" data-testid="text-subtotal">₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium" data-testid="text-shipping">
                      {shipping === 0 ? "Free" : `₹${shipping}`}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Free shipping on orders above ₹2,999
                    </p>
                  )}
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="font-semibold text-lg" data-testid="text-total">
                    ₹{total.toLocaleString("en-IN")}
                  </span>
                </div>
                <Link href="/checkout" className="block">
                  <Button className="w-full" size="lg" data-testid="button-checkout">
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/products" className="block">
                  <Button variant="outline" className="w-full" data-testid="button-continue-shopping">
                    Continue Shopping
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
