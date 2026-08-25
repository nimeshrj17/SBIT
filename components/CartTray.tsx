import { useState } from "react";
import styles from "./CartTray.module.css";
import { X, ShoppingCart, Minus, Plus, Trash2, ShieldCheck, RefreshCcw, CheckCircle, Send } from "lucide-react";

interface CartItem {
  id: string;
  title: string;
  price: number;
  productCode?: string;
  image?: string;
  category?: string;
  quantity?: number;
  selectedSize?: string;
  selectedColor?: string;
}

interface CartTrayProps {
  items: CartItem[];
  onRemove: (id: string) => void;
  whatsappNumber?: string;
}

export default function CartTray({ items, onRemove, whatsappNumber }: CartTrayProps) {
  const [isOpen, setIsOpen] = useState(false);

  const FREE_SHIPPING_THRESHOLD = 10000;
  
  // Fake state for quantity to demonstrate UI
  const [quantities, setQuantities] = useState<Record<string, number>>(
    items.reduce((acc, item) => ({ ...acc, [item.id]: 1 }), {})
  );

  const [summaryExpanded, setSummaryExpanded] = useState(true);

  if (items.length === 0) return null;

  const updateQuantity = (id: string, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + delta)
    }));
  };

  const handleCheckout = () => {
    if (!whatsappNumber) return;
    
    let text = "Hi, I'm interested in ordering the following items:\n\n";
    items.forEach((item, index) => {
      text += `${index + 1}. ${item.title} (Code: ${item.productCode || item.id}) - Qty: ${quantities[item.id] || 1}\n`;
      text += `Link: ${window.location.origin}/#collections\n\n`;
    });
    
    const formattedNumber = whatsappNumber.replace(/\D/g, '');
    window.open(`https://wa.me/${formattedNumber}?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <>
      {/* Floating Action Button */}
      <button 
        className={styles.fab} 
        onClick={() => setIsOpen(true)}
        aria-label="Open Cart"
      >
        <ShoppingCart size={24} />
        <span className={styles.fabBadge}>{items.length}</span>
      </button>

      {/* Backdrop */}
      <div 
        className={`${styles.backdrop} ${isOpen ? styles.backdropOpen : ''}`} 
        onClick={() => setIsOpen(false)}
      />

      {/* Side Drawer */}
      <div className={`${styles.tray} ${isOpen ? styles.trayOpen : ''}`}>
        <div className={styles.header}>
          <h3>Your Cart ({items.length})</h3>
          <button className={styles.closeDrawerBtn} onClick={() => setIsOpen(false)}>
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        <div className={styles.items}>
          {items.map((item) => (
            <div key={item.id} className={styles.item}>
              <div className={styles.itemImageContainer}>
                <img src={item.image || "https://picsum.photos/200/300"} alt={item.title} className={styles.itemImage} />
              </div>
              <div className={styles.itemDetails}>
                <div className={styles.itemHeader}>
                  <h4 className={styles.itemName}>{item.title}</h4>
                </div>
                
                <div className={styles.itemVariants}>
                  <span>Size: {item.selectedSize || "Free Size"}</span>
                  <span className={styles.dot}>•</span>
                  <span>Color: {item.selectedColor || "Standard"}</span>
                </div>
                
                <div className={styles.itemActions}>
                  <button className={styles.removeBtn} onClick={() => onRemove(item.id)}>
                    <Trash2 size={16} strokeWidth={1.5} />
                  </button>
                  
                  <div className={styles.quantitySelector}>
                    <button onClick={() => updateQuantity(item.id, -1)}><Minus size={14} /></button>
                    <span>{quantities[item.id] || 1}</span>
                    <button onClick={() => updateQuantity(item.id, 1)}><Plus size={14} /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.footer}>

          <button className={styles.checkoutBtn} onClick={handleCheckout}>
            <Send size={14} /> Send in for inquiry
          </button>
          
          <div className={styles.trustBadges}>
            <div className={styles.trustBadge}>
              <ShieldCheck size={18} strokeWidth={1.5} />
              <span>Secure<br/>Payments</span>
            </div>
            <div className={styles.trustBadge}>
              <RefreshCcw size={18} strokeWidth={1.5} />
              <span>Easy<br/>Returns</span>
            </div>
            <div className={styles.trustBadge}>
              <CheckCircle size={18} strokeWidth={1.5} />
              <span>100% Original<br/>Products</span>
            </div>
            <div className={styles.trustBadge}>
              <ShieldCheck size={18} strokeWidth={1.5} />
              <span>Assured<br/>Quality</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
