"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./CollectionsSection.module.css";
import ProductCard from "./ProductCard";
import AccordionGallery from "./AccordionGallery";
import { Filter, Search, ChevronDown, ChevronRight, Flower } from "lucide-react";
import Link from "next/link";
import { getProducts, getCategories, Product, Category } from "@/lib/productService";

export default function CollectionsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLiveData = async () => {
      setLoading(true);
      const [prods, cats] = await Promise.all([getProducts(), getCategories()]);
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
            springConfig={{ stiffness: 300, damping: 30, mass: 1 }}
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
                  <input type="radio" name="category" defaultChecked={idx === 0} />
                  <span className={styles.radioText}>
                    {cat.name} 
                    {cat.slug !== "all" && ` (${products.filter(p => p.category === cat.slug).length})`}
                  </span>
                </label>
              ))}
            </div>
            
            <div className={styles.filterGroup}>
              <h4 className={styles.filterHeader}>Price Range <span className={styles.minus}>&minus;</span></h4>
              <label className={styles.radioLabel}>
                <input type="radio" name="price" defaultChecked />
                <span className={styles.radioText}>All Prices</span>
              </label>
              <label className={styles.radioLabel}>
                <input type="radio" name="price" />
                <span className={styles.radioText}>Under ₹3,000</span>
              </label>
              <label className={styles.radioLabel}>
                <input type="radio" name="price" />
                <span className={styles.radioText}>₹3,000 - ₹5,000</span>
              </label>
              <label className={styles.radioLabel}>
                <input type="radio" name="price" />
                <span className={styles.radioText}>₹5,000 - ₹10,000</span>
              </label>
              <label className={styles.radioLabel}>
                <input type="radio" name="price" />
                <span className={styles.radioText}>Above ₹10,000</span>
              </label>
            </div>
            
            <div className={styles.filterGroup}>
              <h4 className={styles.filterHeader}>Color <span className={styles.minus}>&minus;</span></h4>
              <div className={styles.colorFilters}>
                <span className={styles.colorFilter} style={{ backgroundColor: '#5e1b20' }}></span>
                <span className={styles.colorFilter} style={{ backgroundColor: '#c23a2a' }}></span>
                <span className={styles.colorFilter} style={{ backgroundColor: '#dfafa3' }}></span>
                <span className={styles.colorFilter} style={{ backgroundColor: '#3a4a2b' }}></span>
                <span className={styles.colorFilter} style={{ backgroundColor: '#1a1210' }}></span>
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
              <span className={styles.showingText}>Showing 8 of 120 products</span>
              
              <div className={styles.topBarControls}>
                <div className={styles.searchBox}>
                  <Search size={14} className={styles.searchIcon} />
                  <input type="text" placeholder="Search products..." className={styles.searchInput} />
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
              ) : (
                products.map((product) => (
                  <ProductCard 
                    key={product.id}
                    image={product.image}
                    title={product.title}
                    price={product.price}
                    isNew={product.isNew}
                    colors={product.colors}
                    extraColorsCount={product.extraColorsCount}
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
