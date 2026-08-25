import { useState, useEffect } from "react";
import { Product, addProduct, updateProduct, getCategories, Category } from "@/lib/productService";
import styles from "./ProductModal.module.css";
import { X } from "lucide-react";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product;
  onSaved: () => void;
}

const emptyProduct: Omit<Product, "id"> = {
  productCode: "",
  title: "",
  price: 0,
  image: "",
  categories: [],
  fabric: "",
  isNew: false,
  isPopular: false,
  isBestSeller: false,
  colors: [],
  extraColorsCount: 0
};



export default function ProductModal({ isOpen, onClose, productToEdit, onSaved }: ProductModalProps) {
  const [formData, setFormData] = useState<Omit<Product, "id">>(emptyProduct);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [colorInput, setColorInput] = useState("");

  useEffect(() => {
    const fetchCats = async () => {
      const cats = await getCategories();
      setCategories(cats);
    };
    fetchCats();
  }, []);

  useEffect(() => {
    if (productToEdit) {
      setFormData(productToEdit);
    } else {
      setFormData(emptyProduct);
    }
    setColorInput("");
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      
      // Handle array of categories via checkboxes
      if (name === 'categories') {
        setFormData(prev => {
          const newCategories = checked 
            ? [...(prev.categories || []), value]
            : (prev.categories || []).filter(c => c !== value);
          return { ...prev, categories: newCategories };
        });
      } else {
        setFormData(prev => ({ ...prev, [name]: checked }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: name === "price" || name === "extraColorsCount" ? Number(value) : value }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddColor = () => {
    if (colorInput) {
      setFormData(prev => ({ ...prev, colors: [...prev.colors, colorInput] }));
      setColorInput("");
    }
  };

  const handleRemoveColor = (index: number) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (productToEdit && productToEdit.id) {
        await updateProduct(productToEdit.id, formData);
      } else {
        await addProduct(formData);
      }
      onSaved();
      onClose();
    } catch (error) {
      alert("Error saving product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>{productToEdit ? "Edit Product" : "Add New Product"}</h2>
          <button onClick={onClose} className={styles.closeBtn}><X size={20} /></button>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label htmlFor="title">Product Title</label>
              <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="productCode">Product Code (SKU)</label>
              <input type="text" id="productCode" name="productCode" value={formData.productCode || ""} onChange={handleChange} placeholder="e.g. BR-1001" />
            </div>
          </div>
          
          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label htmlFor="price">Price (₹)</label>
              <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} required min="0" />
            </div>
            
            <div className={styles.formGroup}>
              <label>Categories (Select Multiple)</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                {categories.map(cat => (
                  <label key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#fff', fontSize: '0.9rem' }}>
                    <input 
                      type="checkbox" 
                      name="categories" 
                      value={cat.slug} 
                      checked={(formData.categories || []).includes(cat.slug)}
                      onChange={handleChange}
                    />
                    {cat.name}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label htmlFor="fabric">Fabric</label>
              <input 
                type="text" 
                id="fabric" 
                name="fabric" 
                value={formData.fabric || ""} 
                onChange={handleChange} 
                placeholder="e.g. Silk, Velvet" 
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="image">Upload Product Image</label>
              <input type="file" id="image" accept="image/*" onChange={handleImageUpload} style={{ padding: '0.5rem 0' }} />
              {formData.image && (
                <div style={{ marginTop: '0.5rem', width: '100px', height: '100px', position: 'relative', borderRadius: '4px', overflow: 'hidden' }}>
                  <img src={formData.image} alt="Preview" style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                </div>
              )}
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label>Colors (Hex Codes)</label>
            <div className={styles.colorInputRow}>
              <input 
                type="color" 
                value={colorInput || "#000000"} 
                onChange={(e) => setColorInput(e.target.value)} 
                style={{ height: '40px', width: '60px', padding: '0', cursor: 'pointer' }}
              />
              <button type="button" onClick={handleAddColor} className={styles.addBtn}>Add Color</button>
            </div>
            <div className={styles.colorChips}>
              {formData.colors.map((c, i) => (
                <div key={i} className={styles.colorChip}>
                  <span className={styles.colorSwatch} style={{backgroundColor: c}}></span>
                  {c}
                  <button type="button" onClick={() => handleRemoveColor(i)}>&times;</button>
                </div>
              ))}
            </div>
          </div>
          
          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label htmlFor="extraColorsCount">Extra Colors (+N)</label>
              <input type="number" id="extraColorsCount" name="extraColorsCount" value={formData.extraColorsCount} onChange={handleChange} min="0" />
            </div>
            
            <div className={styles.formGroupCheckbox} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label>
                <input type="checkbox" name="isNew" checked={formData.isNew} onChange={handleChange} />
                <span>Mark as "NEW" Collection</span>
              </label>
              <label>
                <input type="checkbox" name="isPopular" checked={formData.isPopular || false} onChange={handleChange} />
                <span>Mark as "POPULAR"</span>
              </label>
              <label>
                <input type="checkbox" name="isBestSeller" checked={formData.isBestSeller || false} onChange={handleChange} />
                <span>Mark as "BEST SELLER"</span>
              </label>
            </div>
          </div>
          
          <div className={styles.modalActions}>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>Cancel</button>
            <button type="submit" className={styles.saveBtn} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
