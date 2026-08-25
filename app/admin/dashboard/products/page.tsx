"use client";

import { useState, useEffect } from "react";
import { Product, getProducts, deleteProduct, getSetting } from "@/lib/productService";
import ProductModal from "./ProductModal";
import styles from "./page.module.css";
import { Plus, Edit2, Trash2, Search } from "lucide-react";
import Image from "next/image";

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  const [priceInterval, setPriceInterval] = useState(4000);
  const [enablePriceRange, setEnablePriceRange] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    const [data, intervalStr, enablePrice] = await Promise.all([
      getProducts(), 
      getSetting("priceFilterInterval"),
      getSetting("enablePriceRange")
    ]);
    setProducts(data);
    if (intervalStr) {
      setPriceInterval(parseInt(intervalStr, 10));
    }
    if (enablePrice !== null) {
      setEnablePriceRange(enablePrice === "true");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAdd = () => {
    setEditingProduct(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(id);
      fetchProducts();
    }
  };

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.categories && p.categories.join(", ").toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Products</h1>
          <p className={styles.subtitle}>Manage your store's inventory and collections.</p>
        </div>
        
        <button onClick={handleAdd} className={styles.addBtn}>
          <Plus size={18} />
          Add New Product
        </button>
      </header>

      <div className={styles.controlsBar}>
        <div className={styles.searchBox}>
          <Search size={16} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.resultsCount}>
          {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'}
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              {enablePriceRange && <th>Price</th>}
              <th className={styles.actionsCol}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className={styles.emptyState}>Loading products...</td>
              </tr>
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={4} className={styles.emptyState}>No products found.</td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className={styles.productCell}>
                      <div className={styles.imageThumb}>
                        <Image src={product.image} alt={product.title} fill className={styles.image} />
                      </div>
                      <div className={styles.productInfo}>
                        <span className={styles.productTitle}>{product.title}</span>
                        {product.productCode && <span className={styles.productCode} style={{ fontSize: '0.8rem', color: '#888' }}>{product.productCode}</span>}
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '4px' }}>
                          {product.colors.map((c, i) => {
                            const [name, hex] = c.includes('|') ? c.split('|') : [c, '#ccc'];
                            return (
                              <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', backgroundColor: '#eee', padding: '2px 6px', borderRadius: '4px', color: '#333' }}>
                                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: hex }}></span>
                                {name}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={styles.categoryBadge}>{(product.categories || []).join(", ")}</span>
                  </td>
                  {enablePriceRange && (
                    <td>
                      <span className={styles.priceText}>
                        {product.price > 12000 
                          ? `₹12,000+` 
                          : `₹${product.price.toLocaleString('en-IN')} - ₹${(product.price + priceInterval - 1).toLocaleString('en-IN')}`}
                      </span>
                    </td>
                  )}
                  <td className={styles.actionsCol}>
                    <button onClick={() => handleEdit(product)} className={styles.actionBtn} aria-label="Edit">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(product.id!)} className={`${styles.actionBtn} ${styles.deleteBtn}`} aria-label="Delete">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <ProductModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          productToEdit={editingProduct}
          onSaved={fetchProducts}
        />
      )}
    </div>
  );
}
