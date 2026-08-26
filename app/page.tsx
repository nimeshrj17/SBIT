"use client";

import { useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import FilterBar from "@/components/FilterBar";
import CartTray from "@/components/CartTray";
import styles from "./page.module.css";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CollectionsSection from "@/components/CollectionsSection";
import Footer from "@/components/Footer";

// Mock Data for the catalogue
const MOCK_CATEGORIES = [
  { id: "c1", name: "Bridal Lehengas" },
  { id: "c2", name: "Sarees" },
  { id: "c3", name: "Suits" },
  { id: "c4", name: "Fabrics" },
];

const MOCK_PRICE_BUCKETS = ["Under ₹3,000", "₹3,000 - ₹5,000", "Over ₹5,000"];

const MOCK_PRODUCTS = [
  { id: "p1", name: "Crimson Velvet Bridal Lehenga", price: 15000, gstPercent: 12, categoryId: "c1", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600&auto=format&fit=crop", colors: ["#8b0000", "#ffd700"] },
  { id: "p2", name: "Banarasi Silk Saree", price: 4500, gstPercent: 5, categoryId: "c2", image: "https://images.unsplash.com/photo-1610189013233-1df08ceee707?q=80&w=600&auto=format&fit=crop", colors: ["#ff0000", "#008000"] },
  { id: "p3", name: "Embroidered Georgette Suit", price: 2800, gstPercent: 5, categoryId: "c3", image: "https://images.unsplash.com/photo-1583391733958-69363574c86f?q=80&w=600&auto=format&fit=crop", colors: ["#4b0082", "#ffb6c1"] },
  { id: "p4", name: "Premium Raw Silk Fabric (Per Meter)", price: 800, gstPercent: 5, categoryId: "c4", image: "https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?q=80&w=600&auto=format&fit=crop", colors: ["#ffffff", "#000000"] },
  { id: "p5", name: "Pastel Net Lehenga", price: 8500, gstPercent: 12, categoryId: "c1", image: "https://images.unsplash.com/photo-1601267865768-45ec061c0e3a?q=80&w=600&auto=format&fit=crop", colors: ["#ffb6c1", "#e6e6fa"] },
  { id: "p6", name: "Kanjeevaram Silk Saree", price: 6000, gstPercent: 5, categoryId: "c2", image: "https://images.unsplash.com/photo-1585468274064-16a30c5e3fbe?q=80&w=600&auto=format&fit=crop", colors: ["#ffd700", "#ff8c00"] },
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPriceBucket, setSelectedPriceBucket] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("+91 123 456 7890");
  const [storeEmail, setStoreEmail] = useState("contact@houseofshri.com");
  const [storeAddress, setStoreAddress] = useState("Surat, Gujarat, India");
  const [cartItems, setCartItems] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    // If no specific hash is provided, default to scrolling to collections
    if (typeof window !== "undefined" && !window.location.hash) {
      router.replace('/#collections');
    }
  }, [router]);

  useEffect(() => {
    import('@/lib/productService').then(({ getSetting }) => {
      getSetting("whatsappNumber").then(num => {
        if (num) setWhatsappNumber(num);
      });
      getSetting("storeEmail").then(email => {
        if (email) setStoreEmail(email);
      });
      getSetting("storeAddress").then(addr => {
        if (addr) setStoreAddress(addr);
      });
      getSetting("backgroundColor").then(color => {
        if (color) {
          document.body.style.backgroundColor = color;
        }
      });
    });
  }, []);

  const handleAddToCart = (product: any) => {
    if (!cartItems.find(item => item.id === product.id)) {
      setCartItems([...cartItems, product]);
    }
  };

  const handleRemoveFromCart = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const filteredProducts = MOCK_PRODUCTS.filter(p => {
    if (selectedCategory && p.categoryId !== selectedCategory) return false;
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    
    if (selectedPriceBucket === "Under ₹3,000" && p.price >= 3000) return false;
    if (selectedPriceBucket === "₹3,000 - ₹5,000" && (p.price < 3000 || p.price > 5000)) return false;
    if (selectedPriceBucket === "Over ₹5,000" && p.price <= 5000) return false;
    
    return true;
  });

  return (
    <div className={styles.page}>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, backgroundColor: '#c9a15a', color: '#1a0a0d', textAlign: 'center', padding: '0.4rem', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em' }}>
        MADE FOR BUSINESSES AND TRADE
      </div>
      <Navbar />
      <Hero />
      <CollectionsSection onAddToCart={handleAddToCart} />
      <Footer 
        whatsappNumber={whatsappNumber} 
        storeEmail={storeEmail}
        storeAddress={storeAddress}
      />

      {/* Floating Cart Tray */}
      <CartTray 
        items={cartItems} 
        onRemove={handleRemoveFromCart}
        whatsappNumber={whatsappNumber}
      />
    </div>
  );
}
