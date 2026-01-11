import { useState } from "react";
import { Link, useLocation } from "wouter";
import { User, MapPin, Package, LogOut, Plus, Edit, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Address, InsertAddress } from "@shared/schema";

export default function Account() {
  const [, navigate] = useLocation();
  const { user, logout, refetchUser } = useAuth();
  const { toast } = useToast();
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addressForm, setAddressForm] = useState<InsertAddress>({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: false,
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="font-serif text-2xl font-semibold text-foreground mb-2" data-testid="text-login-required">
            Please sign in
          </h1>
          <p className="text-muted-foreground mb-6">You need to be logged in to view your account</p>
          <Link href="/login">
            <Button data-testid="button-go-to-login">Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/");
  };

  const resetAddressForm = () => {
    setAddressForm({
      fullName: "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      pincode: "",
      isDefault: false,
    });
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await apiRequest("POST", "/api/addresses", addressForm);
      await refetchUser();
      toast({
        title: "Address added",
        description: "Your new address has been saved.",
      });
      setIsAddingAddress(false);
      resetAddressForm();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add address. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAddress) return;
    setIsSubmitting(true);

    try {
      await apiRequest("PATCH", `/api/addresses/${editingAddress.id}`, addressForm);
      await refetchUser();
      toast({
        title: "Address updated",
        description: "Your address has been updated.",
      });
      setEditingAddress(null);
      resetAddressForm();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update address. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      await apiRequest("DELETE", `/api/addresses/${addressId}`);
      await refetchUser();
      toast({
        title: "Address deleted",
        description: "The address has been removed.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete address. Please try again.",
      });
    }
  };

  const openEditDialog = (address: Address) => {
    setAddressForm({
      fullName: address.fullName,
      phone: address.phone,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || "",
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      isDefault: address.isDefault || false,
    });
    setEditingAddress(address);
  };

  const AddressForm = ({ onSubmit, isEdit }: { onSubmit: (e: React.FormEvent) => void; isEdit: boolean }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            value={addressForm.fullName}
            onChange={(e) => setAddressForm((prev) => ({ ...prev, fullName: e.target.value }))}
            placeholder="Enter full name"
            required
            data-testid="input-address-fullname"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            value={addressForm.phone}
            onChange={(e) => setAddressForm((prev) => ({ ...prev, phone: e.target.value }))}
            placeholder="Enter phone number"
            required
            data-testid="input-address-phone"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="addressLine1">Address Line 1</Label>
        <Input
          id="addressLine1"
          value={addressForm.addressLine1}
          onChange={(e) => setAddressForm((prev) => ({ ...prev, addressLine1: e.target.value }))}
          placeholder="House/Flat No., Building Name"
          required
          data-testid="input-address-line1"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
        <Input
          id="addressLine2"
          value={addressForm.addressLine2}
          onChange={(e) => setAddressForm((prev) => ({ ...prev, addressLine2: e.target.value }))}
          placeholder="Street, Landmark"
          data-testid="input-address-line2"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={addressForm.city}
            onChange={(e) => setAddressForm((prev) => ({ ...prev, city: e.target.value }))}
            placeholder="City"
            required
            data-testid="input-address-city"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            value={addressForm.state}
            onChange={(e) => setAddressForm((prev) => ({ ...prev, state: e.target.value }))}
            placeholder="State"
            required
            data-testid="input-address-state"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pincode">Pincode</Label>
          <Input
            id="pincode"
            value={addressForm.pincode}
            onChange={(e) => setAddressForm((prev) => ({ ...prev, pincode: e.target.value }))}
            placeholder="6-digit pincode"
            maxLength={6}
            required
            data-testid="input-address-pincode"
          />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            isEdit ? setEditingAddress(null) : setIsAddingAddress(false);
            resetAddressForm();
          }}
          data-testid="button-cancel-address"
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} data-testid="button-save-address">
          {isSubmitting ? "Saving..." : isEdit ? "Update Address" : "Add Address"}
        </Button>
      </div>
    </form>
  );

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl font-semibold text-foreground" data-testid="text-account-title">
              My Account
            </h1>
            <p className="text-muted-foreground mt-1">Manage your profile and addresses</p>
          </div>
          <Button variant="outline" onClick={handleLogout} data-testid="button-logout">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:inline-grid">
            <TabsTrigger value="profile" data-testid="tab-profile">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="addresses" data-testid="tab-addresses">
              <MapPin className="h-4 w-4 mr-2" />
              Addresses
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-muted-foreground">Full Name</Label>
                    <p className="font-medium text-foreground" data-testid="text-user-name">{user.fullName}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Email</Label>
                    <p className="font-medium text-foreground" data-testid="text-user-email">{user.email}</p>
                  </div>
                  {user.phone && (
                    <div>
                      <Label className="text-muted-foreground">Phone</Label>
                      <p className="font-medium text-foreground" data-testid="text-user-phone">{user.phone}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="addresses">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-4">
                <div>
                  <CardTitle>Saved Addresses</CardTitle>
                  <CardDescription>Manage your delivery addresses</CardDescription>
                </div>
                <Dialog open={isAddingAddress} onOpenChange={setIsAddingAddress}>
                  <DialogTrigger asChild>
                    <Button data-testid="button-add-address">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Address
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Add New Address</DialogTitle>
                    </DialogHeader>
                    <AddressForm onSubmit={handleAddAddress} isEdit={false} />
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {user.addresses && user.addresses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user.addresses.map((address) => (
                      <Card key={address.id} className="relative" data-testid={`card-address-${address.id}`}>
                        <CardContent className="p-4">
                          {address.isDefault && (
                            <span className="absolute top-2 right-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">
                              Default
                            </span>
                          )}
                          <p className="font-medium text-foreground">{address.fullName}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {address.addressLine1}
                            {address.addressLine2 && <>, {address.addressLine2}</>}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {address.city}, {address.state} - {address.pincode}
                          </p>
                          <p className="text-sm text-muted-foreground">{address.phone}</p>
                          <div className="flex gap-2 mt-4">
                            <Dialog open={editingAddress?.id === address.id} onOpenChange={(open) => !open && setEditingAddress(null)}>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openEditDialog(address)}
                                  data-testid={`button-edit-address-${address.id}`}
                                >
                                  <Edit className="h-3 w-3 mr-1" />
                                  Edit
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-lg">
                                <DialogHeader>
                                  <DialogTitle>Edit Address</DialogTitle>
                                </DialogHeader>
                                <AddressForm onSubmit={handleUpdateAddress} isEdit={true} />
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteAddress(address.id)}
                              className="text-destructive hover:text-destructive"
                              data-testid={`button-delete-address-${address.id}`}
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground" data-testid="text-no-addresses">
                      No addresses saved yet
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => setIsAddingAddress(true)}
                      data-testid="button-add-first-address"
                    >
                      Add your first address
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
