import { randomUUID } from "crypto";
import type { 
  User, 
  InsertUser, 
  Product, 
  InsertProduct, 
  Address, 
  InsertAddress,
  Order,
  OrderItem 
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Addresses
  addAddress(userId: string, address: InsertAddress): Promise<Address>;
  updateAddress(userId: string, addressId: string, address: InsertAddress): Promise<Address | undefined>;
  deleteAddress(userId: string, addressId: string): Promise<boolean>;
  
  // Products
  getAllProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  getFeaturedProducts(): Promise<Product[]>;
  getNewProducts(): Promise<Product[]>;
  getProductsByCategory(category: string): Promise<Product[]>;
  
  // Orders
  createOrder(userId: string, items: OrderItem[], address: Address, subtotal: number, shipping: number): Promise<Order>;
  getOrdersByUser(userId: string): Promise<Order[]>;
}

// Sample saree products
const sampleProducts: Product[] = [
  {
    id: "1",
    name: "Royal Banarasi Silk Saree",
    description: "Exquisite Banarasi silk saree with intricate gold zari work. This masterpiece features traditional motifs and a rich pallu that adds elegance to any occasion. Perfect for weddings and festive celebrations.",
    price: 15999,
    originalPrice: 19999,
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&h=1000&fit=crop"
    ],
    category: "Silk",
    fabric: "Pure Banarasi Silk",
    occasion: "Wedding",
    color: "Red",
    inStock: true,
    isNew: false,
    isFeatured: true
  },
  {
    id: "2",
    name: "Kanjeevaram Silk Saree",
    description: "Authentic Kanjeevaram silk saree handwoven by master weavers. Features a stunning temple border and contrast pallu with traditional designs. A timeless addition to your wardrobe.",
    price: 24999,
    originalPrice: 29999,
    images: [
      "https://images.unsplash.com/photo-1594463750939-ebb28c3f7f75?w=800&h=1000&fit=crop"
    ],
    category: "Silk",
    fabric: "Kanjeevaram Silk",
    occasion: "Wedding",
    color: "Gold",
    inStock: true,
    isNew: true,
    isFeatured: true
  },
  {
    id: "3",
    name: "Chanderi Cotton Saree",
    description: "Light and comfortable Chanderi cotton saree with subtle zari detailing. Perfect for daily wear and office occasions. The fabric is breathable and drapes beautifully.",
    price: 3999,
    images: [
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&h=1000&fit=crop"
    ],
    category: "Cotton",
    fabric: "Chanderi Cotton",
    occasion: "Office",
    color: "Blue",
    inStock: true,
    isNew: true,
    isFeatured: false
  },
  {
    id: "4",
    name: "Designer Georgette Saree",
    description: "Stunning designer georgette saree with contemporary prints and sequin work. Lightweight and easy to carry, perfect for parties and evening events.",
    price: 7999,
    originalPrice: 9999,
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&h=1000&fit=crop"
    ],
    category: "Designer",
    fabric: "Georgette",
    occasion: "Party",
    color: "Pink",
    inStock: true,
    isNew: false,
    isFeatured: true
  },
  {
    id: "5",
    name: "Tussar Silk Saree",
    description: "Natural Tussar silk saree with hand-painted Madhubani art. Each piece is unique and tells a story of Indian heritage and craftsmanship.",
    price: 12999,
    images: [
      "https://images.unsplash.com/photo-1594463750939-ebb28c3f7f75?w=800&h=1000&fit=crop"
    ],
    category: "Silk",
    fabric: "Tussar Silk",
    occasion: "Festive",
    color: "Green",
    inStock: true,
    isNew: true,
    isFeatured: true
  },
  {
    id: "6",
    name: "Linen Handloom Saree",
    description: "Premium linen handloom saree with a beautiful texture. Ideal for formal occasions and summer events. Easy to maintain and supremely comfortable.",
    price: 5499,
    images: [
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&h=1000&fit=crop"
    ],
    category: "Cotton",
    fabric: "Linen",
    occasion: "Casual",
    color: "White",
    inStock: true,
    isNew: false,
    isFeatured: false
  },
  {
    id: "7",
    name: "Patola Silk Saree",
    description: "Rare double ikat Patola silk saree from Gujarat. Features geometric patterns created using traditional tie-dye technique. A collector's piece.",
    price: 45999,
    originalPrice: 52999,
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&h=1000&fit=crop"
    ],
    category: "Silk",
    fabric: "Patola Silk",
    occasion: "Wedding",
    color: "Red",
    inStock: true,
    isNew: false,
    isFeatured: true
  },
  {
    id: "8",
    name: "Cotton Jamdani Saree",
    description: "Bengali Jamdani cotton saree with floating floral motifs. Hand-woven using ancient techniques, this saree represents the finest of Bengal's textile heritage.",
    price: 8999,
    images: [
      "https://images.unsplash.com/photo-1594463750939-ebb28c3f7f75?w=800&h=1000&fit=crop"
    ],
    category: "Cotton",
    fabric: "Cotton Jamdani",
    occasion: "Festive",
    color: "Black",
    inStock: true,
    isNew: true,
    isFeatured: false
  },
  {
    id: "9",
    name: "Chiffon Party Saree",
    description: "Elegant chiffon saree with crystal embellishments and contemporary design. The lightweight fabric ensures comfort while the sparkle adds glamour.",
    price: 6499,
    originalPrice: 7999,
    images: [
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&h=1000&fit=crop"
    ],
    category: "Designer",
    fabric: "Chiffon",
    occasion: "Party",
    color: "Blue",
    inStock: true,
    isNew: false,
    isFeatured: false
  },
  {
    id: "10",
    name: "Mysore Crepe Silk Saree",
    description: "Graceful Mysore crepe silk saree known for its natural sheen and smooth texture. Features a traditional gold border that adds richness to the drape.",
    price: 9999,
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&h=1000&fit=crop"
    ],
    category: "Silk",
    fabric: "Mysore Silk",
    occasion: "Festive",
    color: "Green",
    inStock: true,
    isNew: true,
    isFeatured: true
  },
  {
    id: "11",
    name: "Sambalpuri Ikat Saree",
    description: "Odisha's famous Sambalpuri ikat saree with traditional bandha patterns. Each color blend is carefully tied and dyed to create stunning visual effects.",
    price: 4999,
    images: [
      "https://images.unsplash.com/photo-1594463750939-ebb28c3f7f75?w=800&h=1000&fit=crop"
    ],
    category: "Cotton",
    fabric: "Cotton Ikat",
    occasion: "Casual",
    color: "Red",
    inStock: true,
    isNew: false,
    isFeatured: false
  },
  {
    id: "12",
    name: "Designer Leheriya Saree",
    description: "Vibrant Rajasthani Leheriya saree with wave patterns in multiple colors. Perfect for adding a pop of color to festive celebrations.",
    price: 3499,
    images: [
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&h=1000&fit=crop"
    ],
    category: "Designer",
    fabric: "Georgette",
    occasion: "Festive",
    color: "Pink",
    inStock: true,
    isNew: true,
    isFeatured: false
  }
];

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private products: Map<string, Product>;
  private orders: Map<string, Order>;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.orders = new Map();
    
    // Initialize with sample products
    sampleProducts.forEach(product => {
      this.products.set(product.id, product);
    });
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      addresses: []
    };
    this.users.set(id, user);
    return user;
  }

  // Address methods
  async addAddress(userId: string, address: InsertAddress): Promise<Address> {
    const user = await this.getUser(userId);
    if (!user) throw new Error("User not found");

    const newAddress: Address = {
      ...address,
      id: randomUUID(),
      addressLine2: address.addressLine2 || undefined
    };

    // If this is the first address or marked as default, set it as default
    if (user.addresses.length === 0 || address.isDefault) {
      user.addresses.forEach(a => a.isDefault = false);
      newAddress.isDefault = true;
    }

    user.addresses.push(newAddress);
    this.users.set(userId, user);
    return newAddress;
  }

  async updateAddress(userId: string, addressId: string, address: InsertAddress): Promise<Address | undefined> {
    const user = await this.getUser(userId);
    if (!user) throw new Error("User not found");

    const index = user.addresses.findIndex(a => a.id === addressId);
    if (index === -1) return undefined;

    const updatedAddress: Address = {
      ...address,
      id: addressId,
      addressLine2: address.addressLine2 || undefined
    };

    if (address.isDefault) {
      user.addresses.forEach(a => a.isDefault = false);
    }

    user.addresses[index] = updatedAddress;
    this.users.set(userId, user);
    return updatedAddress;
  }

  async deleteAddress(userId: string, addressId: string): Promise<boolean> {
    const user = await this.getUser(userId);
    if (!user) throw new Error("User not found");

    const initialLength = user.addresses.length;
    user.addresses = user.addresses.filter(a => a.id !== addressId);
    
    if (user.addresses.length !== initialLength) {
      // If we deleted the default address, make the first one default
      if (user.addresses.length > 0 && !user.addresses.some(a => a.isDefault)) {
        user.addresses[0].isDefault = true;
      }
      this.users.set(userId, user);
      return true;
    }
    return false;
  }

  // Product methods
  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.isFeatured);
  }

  async getNewProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.isNew);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      p => p.category.toLowerCase() === category.toLowerCase()
    );
  }

  // Order methods
  async createOrder(userId: string, items: OrderItem[], address: Address, subtotal: number, shipping: number): Promise<Order> {
    const order: Order = {
      id: randomUUID(),
      userId,
      items,
      shippingAddress: address,
      subtotal,
      shipping,
      total: subtotal + shipping,
      status: "confirmed",
      createdAt: new Date().toISOString()
    };
    this.orders.set(order.id, order);
    return order;
  }

  async getOrdersByUser(userId: string): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(o => o.userId === userId);
  }
}

export const storage = new MemStorage();
