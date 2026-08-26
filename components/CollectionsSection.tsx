"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import styles from "./CollectionsSection.module.css";
import ProductCard from "./ProductCard";
import Carousel from "./Carousel";
import { ArrowRight, ShoppingBag, MessageCircle, ChevronDown, Filter, ChevronRight, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { getProducts, getCategories, getSetting, Product, Category } from "@/lib/productService";

interface CollectionsSectionProps {
  onAddToCart?: (product: Product) => void;
}

export default function CollectionsSection({ onAddToCart }: CollectionsSectionProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPrice, setSelectedPrice] = useState<string>("₹4,000 - ₹8,000");
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedFabric, setSelectedFabric] = useState<string | null>(null);
  
  const [priceFilterInterval, setPriceFilterInterval] = useState(4000);
  const [enablePriceRange, setEnablePriceRange] = useState(true);
  const [priceBuckets, setPriceBuckets] = useState<string[]>(["All Prices"]);
  const [availableColors, setAvailableColors] = useState<string[]>([]);
  const [availableFabrics, setAvailableFabrics] = useState<string[]>([]);
  const [whatsappNumber, setWhatsappNumber] = useState<string>("");
  
  const filteredProducts = products.filter(p => {
    if (selectedCategory !== "all" && !(p.categories || []).includes(selectedCategory)) return false;
    if (searchQuery && !p.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    
    if (selectedPrice !== "All Prices") {
      const parts = selectedPrice.split(" - ");
      if (parts.length === 2) {
        const min = parseInt(parts[0].replace(/\D/g, ''), 10);
        const max = parseInt(parts[1].replace(/\D/g, ''), 10);
        if (p.price < min || p.price >= max) return false;
      } else if (selectedPrice.includes('+')) {
        const min = parseInt(selectedPrice.replace(/\D/g, ''), 10);
        if (p.price < min) return false;
      }
    }
    
    if (selectedColor && !(p.colors || []).includes(selectedColor)) return false;
    
    if (selectedFabric && p.fabric !== selectedFabric) return false;
    
    return true;
  });

  useEffect(() => {
    const fetchLiveData = async () => {
      setLoading(true);
      const [prods, cats, intervalStr, enablePrice] = await Promise.all([
        getProducts(), 
        getCategories(), 
        getSetting("priceFilterInterval"),
        getSetting("enablePriceRange")
      ]);
      
      const interval = intervalStr ? parseInt(intervalStr, 10) : 4000;
      setPriceFilterInterval(interval);
      if (enablePrice !== null) {
        setEnablePriceRange(enablePrice === "true");
      }
      
      const buckets = ["All Prices"];
      let current = 0;
      const MAX_LIMIT = 12000;
      
      while (current < MAX_LIMIT) {
        buckets.push(`₹${current.toLocaleString('en-IN')} - ₹${(current + interval).toLocaleString('en-IN')}`);
        current += interval;
      }
      buckets.push(`₹${MAX_LIMIT.toLocaleString('en-IN')}+`);
      
      const uniqueColors = new Set<string>();
      const uniqueFabrics = new Set<string>();
      
      prods.forEach(p => {
        if (p.colors) p.colors.forEach(c => uniqueColors.add(c));
        if (p.fabric) uniqueFabrics.add(p.fabric);
      });
      
      setAvailableColors(Array.from(uniqueColors));
      setAvailableFabrics(Array.from(uniqueFabrics));
      
      setPriceBuckets(buckets);
      setProducts(prods);
      setCategories([{ id: "all", name: "All Collections", slug: "all" }, ...cats]);
      setLoading(false);
      
      const num = await getSetting("whatsappNumber");
      if (num) setWhatsappNumber(num);
    };
    fetchLiveData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as Element).closest(`.${styles.filterDropdownContainer}`)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const categoryNavRef = useRef<HTMLDivElement>(null);

  const scrollNav = (direction: 'left' | 'right') => {
    if (categoryNavRef.current) {
      const scrollAmount = 200;
      categoryNavRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

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
          {(categories.length > 1 || products.length > 0) && (
            <Carousel
              items={[
                ...categories.filter(c => c.slug !== "all").map(c => ({
                  image: c.image || "https://picsum.photos/800/800",
                  label: c.name,
                  alt: c.name
                })),
                ...products.filter(p => p.isPopular || p.isBestSeller).map(p => ({
                  image: p.image,
                  label: `${p.title} ${p.isBestSeller ? '(Best Seller)' : '(Popular)'}`,
                  alt: p.title
                }))
              ]}
              autoPlayInterval={4000}
            />
          )}
        </div>
        
        {/* Category Navigation */}
        <div className={styles.categoryNavContainer}>
          <button className={styles.navArrowLeft} onClick={() => scrollNav('left')} aria-label="Scroll left">
            <ChevronLeft size={16} />
          </button>
          <div className={styles.categoryNav} ref={categoryNavRef}>
            {categories.map((cat, index) => (
              <div key={cat.id} style={{ display: 'flex', alignItems: 'center' }}>
                <button 
                  className={`${styles.navItem} ${selectedCategory === cat.slug ? styles.active : ''}`}
                  onClick={() => setSelectedCategory(cat.slug)}
                >
                  <span className={styles.navIcon}>&#10086;</span>
                  {cat.name}
                </button>
                {index < categories.length - 1 && <div className={styles.navSeparator}></div>}
              </div>
            ))}
          </div>
          <button className={styles.navArrowRight} onClick={() => scrollNav('right')} aria-label="Scroll right">
            <ChevronRight size={16} />
          </button>
        </div>
        
        {/* Main Layout Grid */}
        <div className={styles.mainLayout}>
          
          {/* Sticky Horizontal Filter Bar */}
          <div className={styles.horizontalFilterBar}>
            <div className={styles.filterBarInner}>
              <div className={styles.filterDropdowns}>
                {/* Categories Dropdown */}
                <div className={styles.filterDropdownContainer}>
                  <button 
                    className={styles.dropdownTrigger}
                    onClick={() => setOpenDropdown(openDropdown === 'category' ? null : 'category')}
                  >
                    Category: {categories.find(c => c.slug === selectedCategory)?.name || "All"} <ChevronDown size={14} />
                  </button>
                  {openDropdown === 'category' && (
                    <div className={styles.dropdownMenu}>
                      {categories.map((cat, idx) => (
                        <label key={cat.id} className={styles.dropdownItem}>
                          <input 
                            type="radio" 
                            name="category" 
                            checked={selectedCategory === cat.slug}
                            onChange={() => {
                              setSelectedCategory(cat.slug);
                              setOpenDropdown(null);
                            }}
                          />
                          <span>
                            {cat.name} 
                            {cat.slug !== "all" && ` (${products.filter(p => (p.categories || []).includes(cat.slug)).length})`}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Price Dropdown */}
                {enablePriceRange && (
                  <div className={styles.filterDropdownContainer}>
                    <button 
                      className={styles.dropdownTrigger}
                      onClick={() => setOpenDropdown(openDropdown === 'price' ? null : 'price')}
                    >
                      Price: {selectedPrice} <ChevronDown size={14} />
                    </button>
                    {openDropdown === 'price' && (
                      <div className={styles.dropdownMenu}>
                        {priceBuckets.map((bucket, idx) => (
                          <label key={idx} className={styles.dropdownItem}>
                            <input 
                              type="radio" 
                              name="price" 
                              checked={selectedPrice === bucket} 
                              onChange={() => {
                                setSelectedPrice(bucket);
                                setOpenDropdown(null);
                              }} 
                            />
                            <span>{bucket}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Color Dropdown */}
                <div className={styles.filterDropdownContainer}>
                  <button 
                    className={styles.dropdownTrigger}
                    onClick={() => setOpenDropdown(openDropdown === 'color' ? null : 'color')}
                  >
                    Color: {selectedColor || "Any"} <ChevronDown size={14} />
                  </button>
                  {openDropdown === 'color' && (
                    <div className={styles.dropdownMenu}>
                      <div className={styles.colorFilters}>
                        {availableColors.map(color => {
                          const [name, hex] = color.includes('|') ? color.split('|') : [color, 'transparent'];
                          return (
                            <span 
                              key={color}
                              onClick={() => {
                                setSelectedColor(selectedColor === color ? null : color);
                                setOpenDropdown(null);
                              }}
                              style={{ 
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontSize: '0.8rem', 
                                backgroundColor: selectedColor === color ? '#c9a15a' : '#222', 
                                color: selectedColor === color ? '#000' : '#fff',
                                padding: '4px 10px', 
                                borderRadius: '4px', 
                                cursor: 'pointer',
                                border: selectedColor === color ? '1px solid #c9a15a' : '1px solid #444',
                                transition: 'all 0.2s ease'
                              }}
                            >
                              {hex !== 'transparent' && <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: hex }}></span>}
                              {name}
                            </span>
                          );
                        })}
                        {availableColors.length === 0 && <span style={{fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)'}}>No colors</span>}
                      </div>
                    </div>
                  )}
                </div>

                {/* Fabric Dropdown */}
                <div className={styles.filterDropdownContainer}>
                  <button 
                    className={styles.dropdownTrigger}
                    onClick={() => setOpenDropdown(openDropdown === 'fabric' ? null : 'fabric')}
                  >
                    Fabric: {selectedFabric || "Any"} <ChevronDown size={14} />
                  </button>
                  {openDropdown === 'fabric' && (
                    <div className={styles.dropdownMenu}>
                      {availableFabrics.map(fabric => (
                        <label key={fabric} className={styles.dropdownItem}>
                          <input 
                            type="radio" 
                            name="fabric" 
                            checked={selectedFabric === fabric} 
                            onChange={() => {
                              setSelectedFabric(selectedFabric === fabric ? null : fabric);
                              setOpenDropdown(null);
                            }} 
                            onClick={(e) => {
                              if (selectedFabric === fabric) {
                                e.preventDefault();
                                setSelectedFabric(null);
                                setOpenDropdown(null);
                              }
                            }}
                          />
                          <span>{fabric}</span>
                        </label>
                      ))}
                      {availableFabrics.length === 0 && <span style={{fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', padding: '0.5rem'}}>No fabrics</span>}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Reset Button */}
              <button className={styles.resetBtnHorizontal} onClick={() => {
                setSelectedCategory("all");
                setSearchQuery("");
                setSelectedPrice("All Prices");
                setSelectedColor(null);
                setSelectedFabric(null);
              }}>
                <Filter size={14} /> Reset Filters
              </button>
            </div>
          </div>
          
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
                filteredProducts.map((product) => {
                  const lower = product.price;
                  const upper = lower + priceFilterInterval - 1;
                  const priceDisplay = `₹${lower.toLocaleString('en-IN')} - ₹${upper.toLocaleString('en-IN')}`;
                  
                  return (
                    <ProductCard 
                      key={product.id}
                      image={product.image}
                      title={product.title}
                      productCode={product.productCode || product.id}
                      price={product.price}
                      priceDisplay={priceDisplay}
                      isNew={product.isNew}
                      isPopular={product.isPopular}
                      isBestSeller={product.isBestSeller}
                      colors={product.colors}
                      extraColorsCount={product.extraColorsCount}
                      onAddToCart={() => onAddToCart && onAddToCart(product)}
                      onInquiry={() => {
                        if (!whatsappNumber) return;
                        const text = `Hi, I would like to inquire about this product:\n\n${product.title} (Code: ${product.productCode || product.id})\nLink: ${window.location.origin}/#collections`;
                        const formattedNumber = whatsappNumber.replace(/\D/g, '');
                        window.open(`https://wa.me/${formattedNumber}?text=${encodeURIComponent(text)}`, "_blank");
                      }}
                    />
                  );
                })
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
