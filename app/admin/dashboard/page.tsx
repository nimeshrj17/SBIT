"use client";

import { useState, useEffect } from "react";
import styles from "./products/page.module.css";
import { Package, Users, Plus, Edit2, Trash2, Check, X } from "lucide-react";
import { getProducts, getCategories, addCategory, updateCategory, deleteCategory, Category } from "@/lib/productService";

export default function DashboardOverview() {
  const [totalProducts, setTotalProducts] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatImage, setNewCatImage] = useState("");
  
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editCatName, setEditCatName] = useState("");

  const fetchData = async () => {
    setLoading(true);
    const [prods, cats] = await Promise.all([getProducts(), getCategories()]);
    setTotalProducts(prods.length);
    setCategories(cats);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCatImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewCatImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddCategory = async () => {
    if (!newCatName.trim()) return;
    const slug = newCatName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    await addCategory({ name: newCatName, slug, image: newCatImage });
    setNewCatName("");
    setNewCatImage("");
    setIsAddingCategory(false);
    fetchData();
  };

  const startEditCategory = (cat: Category) => {
    setEditingCatId(cat.id!);
    setEditCatName(cat.name);
  };

  const saveEditCategory = async (id: string) => {
    if (!editCatName.trim()) return;
    const slug = editCatName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    await updateCategory(id, { name: editCatName, slug });
    setEditingCatId(null);
    fetchData();
  };

  const handleDeleteCategory = async (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      await deleteCategory(id);
      fetchData();
    }
  };

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Dashboard Overview</h1>
          <p className={styles.subtitle}>Welcome back! Here's your store at a glance.</p>
        </div>
      </header>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
        <div style={{ backgroundColor: 'rgba(30, 15, 20, 0.6)', padding: '1.5rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ padding: '0.75rem', backgroundColor: 'rgba(201, 161, 90, 0.1)', color: '#c9a15a', borderRadius: '8px' }}>
              <Package size={24} />
            </div>
            <h3 style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(245, 239, 230, 0.6)', fontWeight: 500 }}>Total Products</h3>
          </div>
          <p style={{ margin: 0, fontSize: '2rem', fontWeight: 600, color: '#f7f4ee' }}>
            {loading ? "..." : totalProducts}
          </p>
        </div>
        
        <div style={{ backgroundColor: 'rgba(30, 15, 20, 0.6)', padding: '1.5rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ padding: '0.75rem', backgroundColor: 'rgba(76, 175, 80, 0.1)', color: '#4caf50', borderRadius: '8px' }}>
              <Users size={24} />
            </div>
            <h3 style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(245, 239, 230, 0.6)', fontWeight: 500 }}>Inquiries Received</h3>
          </div>
          <p style={{ margin: 0, fontSize: '2rem', fontWeight: 600, color: '#f7f4ee' }}>0</p>
        </div>
      </div>
      
      {/* Category Management Section */}
      <div style={{ backgroundColor: 'rgba(30, 15, 20, 0.6)', padding: '2rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', fontWeight: 500, color: '#f7f4ee' }}>Category Management</h2>
            <p style={{ margin: 0, color: 'rgba(245, 239, 230, 0.5)', fontSize: '0.9rem' }}>Manage the categories that appear on your storefront.</p>
          </div>
          
          {!isAddingCategory && (
            <button onClick={() => setIsAddingCategory(true)} className={styles.addBtn} style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
              <Plus size={16} /> Add Category
            </button>
          )}
        </div>

        {isAddingCategory && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem', padding: '1.5rem', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '6px' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <input 
                type="text" 
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="Category Name (e.g. Bridal Lehengas)"
                style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem', color: '#fff', borderRadius: '4px' }}
                autoFocus
              />
              <input 
                type="file" 
                accept="image/*"
                onChange={handleCatImageUpload}
                style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.5rem', color: '#fff', borderRadius: '4px' }}
              />
            </div>
            {newCatImage && (
              <div style={{ width: '80px', height: '80px', borderRadius: '4px', overflow: 'hidden' }}>
                <img src={newCatImage} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={handleAddCategory} style={{ backgroundColor: '#c9a15a', color: '#000', border: 'none', padding: '0.75rem 2rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}>Save Category</button>
              <button onClick={() => { setIsAddingCategory(false); setNewCatImage(""); }} style={{ backgroundColor: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '0.75rem 2rem', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        )}

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Category Name</th>
                <th>Slug</th>
                <th className={styles.actionsCol}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={3} className={styles.emptyState}>Loading categories...</td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={3} className={styles.emptyState}>No categories created yet.</td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id}>
                    <td>
                      {editingCatId === cat.id ? (
                        <input 
                          type="text" 
                          value={editCatName}
                          onChange={(e) => setEditCatName(e.target.value)}
                          style={{ backgroundColor: 'rgba(0,0,0,0.4)', border: '1px solid #c9a15a', padding: '0.5rem', color: '#fff', borderRadius: '4px', width: '100%' }}
                        />
                      ) : (
                        <span style={{ color: '#f7f4ee', fontWeight: 500 }}>{cat.name}</span>
                      )}
                    </td>
                    <td>
                      <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>{cat.slug}</span>
                    </td>
                    <td className={styles.actionsCol}>
                      {editingCatId === cat.id ? (
                        <>
                          <button onClick={() => saveEditCategory(cat.id!)} className={styles.actionBtn} style={{ color: '#4caf50' }}><Check size={16} /></button>
                          <button onClick={() => setEditingCatId(null)} className={styles.actionBtn}><X size={16} /></button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => startEditCategory(cat)} className={styles.actionBtn}><Edit2 size={16} /></button>
                          <button onClick={() => handleDeleteCategory(cat.id!)} className={`${styles.actionBtn} ${styles.deleteBtn}`}><Trash2 size={16} /></button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
