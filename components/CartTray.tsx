import styles from "./CartTray.module.css";
import { X, Send } from "lucide-react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  gstPercent: number;
  image?: string;
}

interface CartTrayProps {
  items: CartItem[];
  onRemove: (id: string) => void;
  whatsappNumber?: string;
}

export default function CartTray({ items, onRemove, whatsappNumber }: CartTrayProps) {
  if (items.length === 0) return null;

  const total = items.reduce((acc, item) => acc + (item.price + (item.price * item.gstPercent) / 100), 0);

  const handleCheckout = () => {
    if (!whatsappNumber) return;
    
    let text = "Hi, I'm interested in ordering the following items:\n\n";
    items.forEach((item, index) => {
      text += `${index + 1}. ${item.name} - ₹${item.price} (+${item.gstPercent}% GST)\n`;
    });
    text += `\nTotal Estimated Value: ₹${total.toLocaleString()}`;
    
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className={styles.tray}>
      <div className={styles.header}>
        <h3>Review Order ({items.length})</h3>
      </div>
      <div className={styles.items}>
        {items.map((item) => (
          <div key={item.id} className={styles.item}>
            <div className={styles.itemInfo}>
              <span className={styles.itemName}>{item.name}</span>
              <span className={styles.itemPrice}>₹{item.price}</span>
            </div>
            <button className={styles.removeBtn} onClick={() => onRemove(item.id)}>
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
      <div className={styles.footer}>
        <div className={styles.total}>
          <span>Total</span>
          <span>₹{total.toLocaleString()}</span>
        </div>
        <button className="btn-primary" onClick={handleCheckout} style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
          <Send size={18} /> Send Inquiry via WhatsApp
        </button>
      </div>
    </div>
  );
}
