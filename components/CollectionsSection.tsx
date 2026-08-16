"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./CollectionsSection.module.css";
import ProductCard from "./ProductCard";
import AccordionGallery from "./AccordionGallery";
import { Filter, Search, ChevronDown, ChevronRight, Flower } from "lucide-react";
import Link from "next/link";
import { getProducts, getCategories, getSetting, Product, Category } from "@/lib/productService";

interface CollectionsSectionProps {
  onAddToCart?: (product: Product) => void;
}

export default function CollectionsSection({ onAddToCart }: CollectionsSectionProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPrice, setSelectedPrice] = useState<string>("All Prices");
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  
  const [priceFilterInterval, setPriceFilterInterval] = useState(4000);
  const [priceBuckets, setPriceBuckets] = useState<string[]>(["All Prices"]);
  
  const filteredProducts = products.filter(p => {
    if (selectedCategory !== "all" && p.category !== selectedCategory) return false;
    if (searchQuery && !p.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    
    if (selectedPrice !== "All Prices") {
      const parts = selectedPrice.split(" - ");
      if (parts.length === 2) {
        const min = parseInt(parts[0].replace(/\D/g, ''), 10);
        const max = parseInt(parts[1].replace(/\D/g, ''), 10);
        if (p.price < min || p.price >= max) return false;
      }
    }
    
    if (selectedColor && !p.colors.includes(selectedColor)) return false;
    
    return true;
  });

  useEffect(() => {
    const fetchLiveData = async () => {
      setLoading(true);
      const [prods, cats, intervalStr] = await Promise.all([getProducts(), getCategories(), getSetting("priceFilterInterval")]);
      
      const interval = intervalStr ? parseInt(intervalStr, 10) : 4000;
      setPriceFilterInterval(interval);
      
      let maxPrice = 0;
      prods.forEach(p => { if (p.price > maxPrice) maxPrice = p.price; });
      
      const buckets = ["All Prices"];
      let current = 0;
      while (current < maxPrice) {
        buckets.push(`₹${current.toLocaleString('en-IN')} - ₹${(current + interval).toLocaleString('en-IN')}`);
        current += interval;
      }
      if (maxPrice === 0) buckets.push(`₹0 - ₹${interval.toLocaleString('en-IN')}`);
      
      setPriceBuckets(buckets);
      setProducts(prods);
      setCategories([{ id: "all", name: "All Collections", slug: "all" }, ...cats]);
      setLoading(false);
    };
    fetchLiveData();
  }, []);
  return (
    <section id="collections" className={styles.section}>
      <div className={styles.container}>
        
        {/* Header Area */}
        <div className={styles.header}>
          <h2 className={styles.title}>Collections</h2>
          <div className={styles.divider}>
            <span className={styles.dividerLine}></span>
          </div>
          <p className={styles.subtitle}>Timeless craftsmanship. Unmatched elegance.</p>
        </div>
        
        {/* Accordion Gallery Showcase */}
        <div style={{ height: '400px', width: '100%', marginBottom: '4rem' }}>
          {categories.length > 1 && (
            <AccordionGallery
              items={categories.filter(c => c.slug !== "all").map(c => ({
                image: c.image || "https://picsum.photos/800/800",
                label: c.name,
                alt: c.name
              }))}
              defaultIndex={Math.floor(categories.filter(c => c.slug !== "all").length / 2) || 0}
            expandRatio={0.52}
            trigger="hover"
            accentColor="#c9a15a"
            overlayColor="#1f1113"
            textColor="#ffffff"
            grayscale={false}
            showLabels={true}
            duration={0.6}
            ease="power3.out"
            parallax={0.5}
            tilt={8}
            stagger={0.06}
            height={400}
            gap={10}
            radius={8}
            orientation="horizontal"
          />
          )}
        </div>
        
        {/* Category Navigation */}
        <div className={styles.categoryNav}>
          {categories.map((cat, index) => (
            <div key={cat.id} className={styles.navItemWrapper}>
              <button className={`${styles.navItem} ${index === 0 ? styles.activeNav : ''}`}>
                <span className={styles.navIcon}>&#10086;</span>
                {cat.name}
              </button>
              {index < categories.length - 1 && <div className={styles.navSeparator}></div>}
            </div>
          ))}
          <button className={styles.navArrow}><ChevronRight size={16} /></button>
        </div>
        
        {/* Main Layout Grid */}
        <div className={styles.mainLayout}>
          
          {/* Sidebar */}
          <aside className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
              <h3 className={styles.sidebarTitle}><Filter size={16} /> Filters</h3>
              <button className={styles.resetBtn}>Reset</button>
            </div>
            
            {/* Filter Groups */}
            <div className={styles.filterGroup}>
              <h4 className={styles.filterHeader}>Categories <span className={styles.minus}>&minus;</span></h4>
              {categories.map((cat, idx) => (
                <label key={cat.id} className={styles.radioLabel}>
                  <input 
                    type="radio" 
                    name="category" 
                    checked={selectedCategory === cat.slug}
                    onChange={() => setSelectedCategory(cat.slug)}
                  />
                  <span className={styles.radioText}>
                    {cat.name} 
                    {cat.slug !== "all" && ` (${products.filter(p => p.category === cat.slug).length})`}
                  </span>
                </label>
              ))}
            </div>
            
            <div className={styles.filterGroup}>
              <h4 className={styles.filterHeader}>Price Range <span className={styles.minus}>&minus;</span></h4>
              {priceBuckets.map((bucket, idx) => (
                <label key={idx} className={styles.radioLabel}>
                  <input type="radio" name="price" checked={selectedPrice === bucket} onChange={() => setSelectedPrice(bucket)} />
                  <span className={styles.radioText}>{bucket}</span>
                </label>
              ))}
            </div>
            
            <div className={styles.filterGroup}>
              <h4 className={styles.filterHeader}>Color <span className={styles.minus}>&minus;</span></h4>
              <div className={styles.colorFilters}>
                {['#5e1b20', '#c23a2a', '#dfafa3', '#3a4a2b', '#1a1210'].map(color => (
                  <span 
                    key={color}
                    className={styles.colorFilter} 
                    style={{ 
                      backgroundColor: color, 
                      border: selectedColor === color ? '2px solid #c9a15a' : '2px solid transparent'
                    }}
                    onClick={() => setSelectedColor(selectedColor === color ? null : color)}
                  />
                ))}
                <span className={styles.colorFilterMore}>+</span>
              </div>
            </div>
            
            <div className={styles.filterGroup}>
              <h4 className={styles.filterHeader}>Fabric <span className={styles.plus}>+</span></h4>
            </div>
            
            <div className={styles.filterGroup}>
              <h4 className={styles.filterHeader}>Availability <span className={styles.plus}>+</span></h4>
            </div>
            
          </aside>
          
          {/* Product Grid Area */}
          <div className={styles.productsArea}>
            
            {/* Top Bar */}
            <div className={styles.productsTopBar}>
              <span className={styles.showingText}>Showing {filteredProducts.length} of {products.length} products</span>
              
              <div className={styles.topBarControls}>
                <div className={styles.searchBox}>
                  <Search size={14} className={styles.searchIcon} />
                  <input 
                    type="text" 
                    placeholder="Search products..." 
                    className={styles.searchInput} 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className={styles.sortBox}>
                  <span>Sort by: <strong>Newest</strong></span>
                  <ChevronDown size={14} />
                </div>
              </div>
            </div>
            
            {/* The Grid */}
            <div className={styles.grid}>
              {loading ? (
                <p style={{ color: 'rgba(245, 239, 230, 0.5)', gridColumn: '1 / -1' }}>Loading collections...</p>
              ) : products.length === 0 ? (
                <p style={{ color: 'rgba(245, 239, 230, 0.5)', gridColumn: '1 / -1' }}>No products found.</p>
              ) : filteredProducts.length === 0 ? (
                <p style={{ color: 'rgba(245, 239, 230, 0.5)', gridColumn: '1 / -1' }}>No products match your filters.</p>
              ) : (
                filteredProducts.map((product) => (
                  <ProductCard 
                    key={product.id}
                    image={product.image}
                    title={product.title}
                    productCode={product.productCode || product.id}
                    price={product.price}
                    isNew={product.isNew}
                    colors={product.colors}
                    extraColorsCount={product.extraColorsCount}
                    onAddToCart={() => onAddToCart && onAddToCart(product)}
                    onInquiry={() => window.location.href = '/quote'}
                  />
                ))
              )}
            </div>
            
          </div>
          
        </div>
        
        {/* Bottom Banner */}
        <div className={styles.bottomBanner}>
          <div className={styles.bannerContent}>
            <Flower className={styles.bannerIcon} size={32} />
            <div>
              <h3 className={styles.bannerTitle}>Looking for something special?</h3>
              <p className={styles.bannerDesc}>We create bespoke outfits tailored just for you.</p>
            </div>
          </div>
          <Link href="/quote" className={styles.bannerBtn}>
            Get a Custom Quote &rarr;
          </Link>
        </div>
        
      </div>
    </section>
  );
}
