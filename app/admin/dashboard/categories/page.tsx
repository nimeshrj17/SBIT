"use client";

import { useState, useEffect } from "react";
import { getCategories, deleteCategory, Category } from "@/lib/productService";
import CategoryModal from "./CategoryModal";
import styles from "./page.module.css";
import { Plus, Edit2, Trash2 } from "lucide-react";
import Image from "next/image";

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>(undefined);

  const fetchCategories = async () => {
    setLoading(true);
    const data = await getCategories();
    setCategories(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = () => {
    setEditingCategory(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      await deleteCategory(id);
      fetchCategories();
    }
  };

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Categories</h1>
          <p className={styles.subtitle}>Manage product collections and ranges.</p>
        </div>
        
        <button onClick={handleAdd} className={styles.addBtn}>
          <Plus size={18} />
          Add New Category
        </button>
      </header>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Slug</th>
              <th className={styles.actionsCol}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className={styles.emptyState}>Loading categories...</td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan={4} className={styles.emptyState}>No categories found.</td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr key={category.id}>
                  <td>
                    {category.image ? (
                      <div style={{ width: '40px', height: '40px', position: 'relative', borderRadius: '4px', overflow: 'hidden' }}>
                        <Image src={category.image} alt={category.name} fill style={{ objectFit: 'cover' }} />
                      </div>
                    ) : (
                      <div style={{ width: '40px', height: '40px', backgroundColor: '#eee', borderRadius: '4px' }} />
                    )}
                  </td>
                  <td>
                    <strong>{category.name}</strong>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'monospace', color: '#888' }}>{category.slug}</span>
                  </td>
                  <td className={styles.actionsCol}>
                    <button onClick={() => handleEdit(category)} className={styles.actionBtn} aria-label="Edit">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(category.id!)} className={`${styles.actionBtn} ${styles.deleteBtn}`} aria-label="Delete">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <CategoryModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categoryToEdit={editingCategory}
        onSaved={fetchCategories}
      />
    </div>
  );
}
