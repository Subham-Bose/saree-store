import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Check, ChevronLeft, MapPin, CreditCard, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Address, OrderItem } from "@shared/schema";

const steps = [
  { id: "address", label: "Address", icon: MapPin },
  { id: "payment", label: "Payment", icon: CreditCard },
  { id: "review", label: "Review", icon: Package },
];

export default function Checkout() {
  const [, navigate] = useLocation();
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [newAddress, setNewAddress] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const shipping = subtotal >= 2999 ? 0 : 199;
  const total = subtotal + shipping;

  const handleNewAddressChange = (field: string, value: string) => {
    setNewAddress((prev) => ({ ...prev, [field]: value }));
  };

  const isNewAddressValid = () => {
    return (
      newAddress.fullName &&
      newAddress.phone.length >= 10 &&
      newAddress.addressLine1 &&
      newAddress.city &&
      newAddress.state &&
      newAddress.pincode.length === 6
    );
  };

  const canProceed = () => {
    if (currentStep === 0) {
      return selectedAddress || isNewAddressValid();
    }
    return true;
  };

  const getShippingAddress = (): Address | null => {
    if (selectedAddress && user?.addresses) {
      return user.addresses.find(a => a.id === selectedAddress) || null;
    }
    if (isNewAddressValid()) {
      return {
        id: "new",
        fullName: newAddress.fullName,
        phone: newAddress.phone,
        addressLine1: newAddress.addressLine1,
        addressLine2: newAddress.addressLine2 || undefined,
        city: newAddress.city,
        state: newAddress.state,
        pincode: newAddress.pincode,
      };
    }
    return null;
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    
    try {
      const address = getShippingAddress();
      if (!address) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please provide a shipping address.",
        });
        setIsProcessing(false);
        return;
      }

      // Prepare order items
      const orderItems: OrderItem[] = items.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.images[0] || "",
      }));

      // If user is logged in, create order via API
      if (user) {
        if (selectedAddress) {
          // Using saved address
          await apiRequest("POST", "/api/orders", {
            items: orderItems,
            addressId: selectedAddress,
            subtotal,
            shipping,
          });
        } else {
          // Using new address
          await apiRequest("POST", "/api/orders", {
            items: orderItems,
            address: newAddress,
            subtotal,
            shipping,
          });
        }
      }
      
      toast({
        title: "Order placed successfully!",
        description: "You will receive a confirmation email shortly.",
      });
      
      clearCart();
      navigate("/");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to place order. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="font-serif text-2xl font-semibold text-foreground mb-2" data-testid="text-checkout-empty">
            No items to checkout
          </h1>
          <p className="text-muted-foreground mb-6">Add some items to your cart first</p>
          <Link href="/products">
            <Button data-testid="button-shop-now">Shop Now</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Back Link */}
        <Link href="/cart">
          <span className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-6" data-testid="link-back-to-cart">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Cart
          </span>
        </Link>

        <h1 className="font-serif text-3xl font-semibold text-foreground mb-8" data-testid="text-checkout-title">
          Checkout
        </h1>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                  index < currentStep
                    ? "bg-primary border-primary text-primary-foreground"
                    : index === currentStep
                    ? "border-primary text-primary"
                    : "border-muted text-muted-foreground"
                }`}
                data-testid={`step-${step.id}`}
              >
                {index < currentStep ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <step.icon className="h-5 w-5" />
                )}
              </div>
              <span
                className={`ml-2 text-sm font-medium ${
                  index <= currentStep ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {step.label}
              </span>
              {index < steps.length - 1 && (
                <div
                  className={`w-16 md:w-24 h-0.5 mx-4 ${
                    index < currentStep ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Address Step */}
            {currentStep === 0 && (
              <Card>
                <CardHeader>
                  <CardTitle data-testid="text-address-title">Shipping Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Saved Addresses */}
                  {user?.addresses && user.addresses.length > 0 && (
                    <div className="space-y-4">
                      <Label>Saved Addresses</Label>
                      <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress}>
                        {user.addresses.map((address) => (
                          <div
                            key={address.id}
                            className={`flex items-start gap-3 p-4 rounded-md border transition-colors ${
                              selectedAddress === address.id
                                ? "border-primary bg-primary/5"
                                : "border-border"
                            }`}
                          >
                            <RadioGroupItem value={address.id} id={address.id} className="mt-1" />
                            <label htmlFor={address.id} className="flex-1 cursor-pointer">
                              <p className="font-medium text-foreground">{address.fullName}</p>
                              <p className="text-sm text-muted-foreground">
                                {address.addressLine1}
                                {address.addressLine2 && `, ${address.addressLine2}`}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {address.city}, {address.state} - {address.pincode}
                              </p>
                              <p className="text-sm text-muted-foreground">{address.phone}</p>
                            </label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  )}

                  {/* New Address Form */}
                  <div className="space-y-4">
                    <Label className="text-base">
                      {user?.addresses?.length ? "Or add a new address" : "Enter your address"}
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          value={newAddress.fullName}
                          onChange={(e) => handleNewAddressChange("fullName", e.target.value)}
                          placeholder="Enter full name"
                          data-testid="input-fullname"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={newAddress.phone}
                          onChange={(e) => handleNewAddressChange("phone", e.target.value)}
                          placeholder="Enter phone number"
                          data-testid="input-phone"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="addressLine1">Address Line 1</Label>
                      <Input
                        id="addressLine1"
                        value={newAddress.addressLine1}
                        onChange={(e) => handleNewAddressChange("addressLine1", e.target.value)}
                        placeholder="House/Flat No., Building Name"
                        data-testid="input-address1"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
                      <Input
                        id="addressLine2"
                        value={newAddress.addressLine2}
                        onChange={(e) => handleNewAddressChange("addressLine2", e.target.value)}
                        placeholder="Street, Landmark"
                        data-testid="input-address2"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={newAddress.city}
                          onChange={(e) => handleNewAddressChange("city", e.target.value)}
                          placeholder="City"
                          data-testid="input-city"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          value={newAddress.state}
                          onChange={(e) => handleNewAddressChange("state", e.target.value)}
                          placeholder="State"
                          data-testid="input-state"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pincode">Pincode</Label>
                        <Input
                          id="pincode"
                          value={newAddress.pincode}
                          onChange={(e) => handleNewAddressChange("pincode", e.target.value)}
                          placeholder="6-digit pincode"
                          maxLength={6}
                          data-testid="input-pincode"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Payment Step */}
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle data-testid="text-payment-title">Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup defaultValue="cod" className="space-y-4">
                    <div className="flex items-center gap-3 p-4 rounded-md border border-primary bg-primary/5">
                      <RadioGroupItem value="cod" id="cod" />
                      <label htmlFor="cod" className="flex-1 cursor-pointer">
                        <p className="font-medium text-foreground">Cash on Delivery</p>
                        <p className="text-sm text-muted-foreground">
                          Pay when your order arrives
                        </p>
                      </label>
                    </div>
                    <div className="flex items-center gap-3 p-4 rounded-md border border-border opacity-50">
                      <RadioGroupItem value="card" id="card" disabled />
                      <label htmlFor="card" className="flex-1">
                        <p className="font-medium text-foreground">Credit/Debit Card</p>
                        <p className="text-sm text-muted-foreground">Coming soon</p>
                      </label>
                    </div>
                    <div className="flex items-center gap-3 p-4 rounded-md border border-border opacity-50">
                      <RadioGroupItem value="upi" id="upi" disabled />
                      <label htmlFor="upi" className="flex-1">
                        <p className="font-medium text-foreground">UPI</p>
                        <p className="text-sm text-muted-foreground">Coming soon</p>
                      </label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            )}

            {/* Review Step */}
            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle data-testid="text-review-title">Review Your Order</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Shipping Address */}
                  <div>
                    <h3 className="font-medium text-foreground mb-2">Shipping Address</h3>
                    <div className="p-4 bg-muted rounded-md">
                      <p className="font-medium">{newAddress.fullName || user?.addresses?.[0]?.fullName}</p>
                      <p className="text-sm text-muted-foreground">
                        {newAddress.addressLine1 || user?.addresses?.[0]?.addressLine1}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {newAddress.city || user?.addresses?.[0]?.city},{" "}
                        {newAddress.state || user?.addresses?.[0]?.state} -{" "}
                        {newAddress.pincode || user?.addresses?.[0]?.pincode}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {newAddress.phone || user?.addresses?.[0]?.phone}
                      </p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h3 className="font-medium text-foreground mb-2">Order Items</h3>
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 p-3 bg-muted rounded-md">
                          <div className="w-16 h-20 rounded overflow-hidden bg-background">
                            {item.product.images[0] && (
                              <img
                                src={item.product.images[0]}
                                alt={item.product.name}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground line-clamp-1">
                              {item.product.name}
                            </p>
                            <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-medium">
                            ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <h3 className="font-medium text-foreground mb-2">Payment Method</h3>
                    <p className="text-muted-foreground">Cash on Delivery</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep((prev) => prev - 1)}
                  data-testid="button-back"
                >
                  Back
                </Button>
              )}
              {currentStep < 2 ? (
                <Button
                  className="ml-auto"
                  onClick={() => setCurrentStep((prev) => prev + 1)}
                  disabled={!canProceed()}
                  data-testid="button-continue"
                >
                  Continue
                </Button>
              ) : (
                <Button
                  className="ml-auto"
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  data-testid="button-place-order"
                >
                  {isProcessing ? "Processing..." : "Place Order"}
                </Button>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6 space-y-4">
                <h2 className="font-semibold text-foreground" data-testid="text-checkout-summary">Order Summary</h2>
                <Separator />
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground truncate max-w-[150px]">
                        {item.product.name} x {item.quantity}
                      </span>
                      <span className="font-medium">
                        ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">
                      {shipping === 0 ? "Free" : `₹${shipping}`}
                    </span>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="font-semibold text-lg" data-testid="text-checkout-total">
                    ₹{total.toLocaleString("en-IN")}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
