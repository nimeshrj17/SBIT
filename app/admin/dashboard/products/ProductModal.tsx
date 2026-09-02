import { useState, useEffect } from "react";
import { Product, addProduct, updateProduct, getCategories, Category, getSetting, uploadImageToStorage } from "@/lib/productService";
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
  extraColorsCount: 0,
  images: []
};



export default function ProductModal({ isOpen, onClose, productToEdit, onSaved }: ProductModalProps) {
  const [formData, setFormData] = useState<Omit<Product, "id">>(productToEdit || emptyProduct);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [colorInput, setColorInput] = useState("");

  const [priceInterval, setPriceInterval] = useState(4000);
  const [enablePriceRange, setEnablePriceRange] = useState(true);
  const [availableColors, setAvailableColors] = useState<string[]>([]);
  const [availableFabrics, setAvailableFabrics] = useState<string[]>([]);

  useEffect(() => {
    const fetchCatsAndSettings = async () => {
      const [cats, intervalStr, colorsStr, fabricsStr, enablePrice] = await Promise.all([
        getCategories(), 
        getSetting("priceFilterInterval"),
        getSetting("availableColors"),
        getSetting("availableFabrics"),
        getSetting("enablePriceRange")
      ]);
      setCategories(cats);
      if (intervalStr) {
        setPriceInterval(parseInt(intervalStr, 10));
      }
      if (enablePrice !== null) {
        setEnablePriceRange(enablePrice === "true");
      }
      
      const defaultColors = "Peach, Multi Colour, Off White, Maroon, Wine, Baby Pink, Yellow, Orange, Gold, Grey, Black, Rani";
      const defaultFabrics = "Silk, Georgette, Velvet, Net, Crepe, Organza";
      
      setAvailableColors((colorsStr || defaultColors).split(',').map(s => s.trim()).filter(Boolean));
      setAvailableFabrics((fabricsStr || defaultFabrics).split(',').map(s => s.trim()).filter(Boolean));
    };
    fetchCatsAndSettings();
  }, []);

  // State is now initialized from props since the component is conditionally mounted

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      try {
        setIsSubmitting(true);
        for (const file of files) {
          const downloadUrl = await uploadImageToStorage(file, 'products');
          setFormData(prev => {
            const currentImages = prev.images?.length ? prev.images : (prev.image ? [prev.image] : []);
            const newImages = [...currentImages, downloadUrl];
            return { 
              ...prev, 
              image: newImages[0],
              images: newImages
            };
          });
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Failed to upload image. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
    e.target.value = '';
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => {
      const currentImages = prev.images?.length ? prev.images : (prev.image ? [prev.image] : []);
      const newImages = currentImages.filter((_, i) => i !== index);
      return {
        ...prev,
        images: newImages,
        image: newImages.length > 0 ? newImages[0] : ""
      };
    });
  };

  const handleAddColor = () => {
    const currentColors = formData.colors || [];
    if (colorInput && !currentColors.includes(colorInput)) {
      setFormData(prev => ({ ...prev, colors: [...(prev.colors || []), colorInput] }));
      setColorInput("");
    }
  };

  const handleRemoveColor = (index: number) => {
    setFormData(prev => ({
      ...prev,
      colors: (prev.colors || []).filter((_, i) => i !== index)
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
            {enablePriceRange && (
              <div className={styles.formGroup}>
                <label htmlFor="price">Price Range</label>
                <select 
                  id="price" 
                  name="price" 
                  value={formData.price} 
                  onChange={handleChange}
                  style={{ width: '100%', padding: '0.75rem', backgroundColor: '#222', border: '1px solid #444', borderRadius: '4px', color: '#fff', fontSize: '1rem' }}
                  required
                >
                  <option value={0} disabled>Select a price range</option>
                  {(() => {
                    const options = [];
                    let current = 0;
                    const MAX_LIMIT = 12000;
                    
                    while (current < MAX_LIMIT) {
                      const lower = current + 1;
                      const upper = current + priceInterval;
                      options.push(
                        <option key={lower} value={lower}>
                          ₹{lower.toLocaleString('en-IN')} - ₹{upper.toLocaleString('en-IN')}
                        </option>
                      );
                      current += priceInterval;
                    }
                    options.push(
                      <option key={MAX_LIMIT + 1} value={MAX_LIMIT + 1}>
                        ₹{(MAX_LIMIT).toLocaleString('en-IN')}+
                      </option>
                    );
                    return options;
                  })()}
                </select>
              </div>
            )}
            
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
              <select 
                id="fabric" 
                name="fabric" 
                value={formData.fabric || ""} 
                onChange={handleChange}
                style={{ width: '100%', padding: '0.75rem', backgroundColor: '#222', border: '1px solid #444', borderRadius: '4px', color: '#fff', fontSize: '1rem' }}
              >
                <option value="" disabled>Select Fabric</option>
                {availableFabrics.map((f, i) => (
                  <option key={i} value={f}>{f}</option>
                ))}
              </select>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="image">Upload Product Images</label>
              <input type="file" id="image" accept="image/*" multiple onChange={handleImageUpload} style={{ padding: '0.5rem 0' }} />
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                {(formData.images?.length ? formData.images : (formData.image ? [formData.image] : [])).map((imgSrc, i) => (
                  <div key={i} style={{ width: '80px', height: '80px', position: 'relative', borderRadius: '4px', overflow: 'hidden', border: '1px solid #444' }}>
                    <img src={imgSrc} alt="Preview" style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                    <button type="button" onClick={() => handleRemoveImage(i)} style={{ position: 'absolute', top: '2px', right: '2px', background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', lineHeight: '1' }}>&times;</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label>Color Names</label>
            <div className={styles.colorInputRow}>
              <select
                value={colorInput}
                onChange={(e) => setColorInput(e.target.value)}
                style={{ height: '40px', flex: 1, padding: '0 1rem', borderRadius: '4px', border: '1px solid #444', background: '#222', color: '#fff' }}
              >
                <option value="" disabled>Select Color</option>
                {availableColors.map((c, i) => {
                  const [name] = c.includes('|') ? c.split('|') : [c];
                  return <option key={i} value={c}>{name}</option>;
                })}
              </select>
              <button type="button" onClick={handleAddColor} className={styles.addBtn}>Add Color</button>
            </div>
            <div className={styles.colorChips}>
              {(formData.colors || []).map((c, i) => {
                const [name, hex] = c.includes('|') ? c.split('|') : [c, '#ccc'];
                return (
                  <div key={i} className={styles.colorChip}>
                    <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: hex, marginRight: '6px' }}></span>
                    {name}
                    <button type="button" onClick={() => handleRemoveColor(i)}>&times;</button>
                  </div>
                );
              })}
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
