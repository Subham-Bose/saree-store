import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import { storage } from "./storage";
import { insertUserSchema, loginSchema, addressSchema } from "@shared/schema";
import { createHash } from "crypto";

// Simple password hashing
function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

// Extend express-session types
declare module "express-session" {
  interface SessionData {
    userId?: string;
  }
}

// Auth middleware
function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Session setup
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "vastra-saree-shop-secret-key",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      },
    })
  );

  // ============ AUTH ROUTES ============

  // Register
  app.post("/api/auth/register", async (req, res) => {
    try {
      const parsed = insertUserSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid input", errors: parsed.error.errors });
      }

      const existing = await storage.getUserByEmail(parsed.data.email);
      if (existing) {
        return res.status(400).json({ message: "Email already registered" });
      }

      const user = await storage.createUser({
        ...parsed.data,
        password: hashPassword(parsed.data.password),
      });

      req.session.userId = user.id;
      
      // Return user without password
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Registration failed" });
    }
  });

  // Login
  app.post("/api/auth/login", async (req, res) => {
    try {
      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid input" });
      }

      const user = await storage.getUserByEmail(parsed.data.email);
      if (!user || user.password !== hashPassword(parsed.data.password)) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      req.session.userId = user.id;
      
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Logout
  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.clearCookie("connect.sid");
      res.json({ message: "Logged out successfully" });
    });
  });

  // Get current user
  app.get("/api/auth/me", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });

  // ============ ADDRESS ROUTES ============

  // Add address
  app.post("/api/addresses", requireAuth, async (req, res) => {
    try {
      const parsed = addressSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid input", errors: parsed.error.errors });
      }

      const address = await storage.addAddress(req.session.userId!, parsed.data);
      res.status(201).json(address);
    } catch (error) {
      console.error("Add address error:", error);
      res.status(500).json({ message: "Failed to add address" });
    }
  });

  // Update address
  app.patch("/api/addresses/:id", requireAuth, async (req, res) => {
    try {
      const parsed = addressSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid input", errors: parsed.error.errors });
      }

      const address = await storage.updateAddress(req.session.userId!, req.params.id, parsed.data);
      if (!address) {
        return res.status(404).json({ message: "Address not found" });
      }
      res.json(address);
    } catch (error) {
      console.error("Update address error:", error);
      res.status(500).json({ message: "Failed to update address" });
    }
  });

  // Delete address
  app.delete("/api/addresses/:id", requireAuth, async (req, res) => {
    try {
      const deleted = await storage.deleteAddress(req.session.userId!, req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Address not found" });
      }
      res.json({ message: "Address deleted" });
    } catch (error) {
      console.error("Delete address error:", error);
      res.status(500).json({ message: "Failed to delete address" });
    }
  });

  // ============ PRODUCT ROUTES ============

  // Get all products
  app.get("/api/products", async (req, res) => {
    try {
      const { featured, new: isNew, category } = req.query;
      
      let products;
      if (featured === "true") {
        products = await storage.getFeaturedProducts();
      } else if (isNew === "true") {
        products = await storage.getNewProducts();
      } else if (category && typeof category === "string") {
        products = await storage.getProductsByCategory(category);
      } else {
        products = await storage.getAllProducts();
      }
      
      res.json(products);
    } catch (error) {
      console.error("Get products error:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  // Get single product
  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Get product error:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // ============ ORDER ROUTES ============

  // Create order
  app.post("/api/orders", requireAuth, async (req, res) => {
    try {
      const { items, addressId, address: addressData, subtotal, shipping } = req.body;
      
      const user = await storage.getUser(req.session.userId!);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      let address;
      
      // If addressId is provided, use saved address
      if (addressId) {
        address = user.addresses.find(a => a.id === addressId);
        if (!address) {
          return res.status(400).json({ message: "Address not found" });
        }
      } else if (addressData) {
        // If full address data is provided, use it directly
        address = {
          id: "temp-" + Date.now(),
          fullName: addressData.fullName,
          phone: addressData.phone,
          addressLine1: addressData.addressLine1,
          addressLine2: addressData.addressLine2,
          city: addressData.city,
          state: addressData.state,
          pincode: addressData.pincode,
        };
      } else {
        return res.status(400).json({ message: "Address required" });
      }

      const order = await storage.createOrder(
        req.session.userId!,
        items,
        address,
        subtotal,
        shipping
      );

      res.status(201).json(order);
    } catch (error) {
      console.error("Create order error:", error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  // Get user orders
  app.get("/api/orders", requireAuth, async (req, res) => {
    try {
      const orders = await storage.getOrdersByUser(req.session.userId!);
      res.json(orders);
    } catch (error) {
      console.error("Get orders error:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  return httpServer;
}
