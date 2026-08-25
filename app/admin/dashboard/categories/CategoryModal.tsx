"use client";

import { useState, useEffect } from "react";
import { Category, addCategory, updateCategory } from "@/lib/productService";
import styles from "./CategoryModal.module.css";
import { X } from "lucide-react";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryToEdit?: Category;
  onSaved: () => void;
}

const emptyCategory: Omit<Category, "id"> = {
  name: "",
  slug: "",
  image: ""
};

export default function CategoryModal({ isOpen, onClose, categoryToEdit, onSaved }: CategoryModalProps) {
  const [formData, setFormData] = useState<Omit<Category, "id">>(categoryToEdit || emptyCategory);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State is now initialized from props since the component is conditionally mounted

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const next = { ...prev, [name]: value };
      // Auto-generate slug from name if editing name and slug hasn't been manually touched much
      if (name === "name" && !categoryToEdit) {
        next.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      }
      return next;
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;
          
          const MAX_SIZE = 800;
          if (width > height && width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          } else if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);
          
          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
          setFormData(prev => ({ ...prev, image: compressedBase64 }));
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (categoryToEdit && categoryToEdit.id) {
        await updateCategory(categoryToEdit.id, formData);
      } else {
        await addCategory(formData);
      }
      onSaved();
      onClose();
    } catch (error) {
      alert("Error saving category.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>{categoryToEdit ? "Edit Category" : "Add New Category"}</h2>
          <button onClick={onClose} className={styles.closeBtn}><X size={20} /></button>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Category Name</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label>Upload Category Image</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} className={styles.fileInput} />
            {formData.image && (
              <div className={styles.imagePreview}>
                <img src={formData.image} alt="Preview" />
              </div>
            )}
          </div>
          
          <div className={styles.modalFooter}>
            <button type="button" onClick={onClose} className={styles.btnCancel}>Cancel</button>
            <button type="submit" disabled={isSubmitting} className={styles.btnSave}>
              {isSubmitting ? "Saving..." : "Save Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
