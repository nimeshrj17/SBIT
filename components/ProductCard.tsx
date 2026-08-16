import Image from "next/image";
import styles from "./ProductCard.module.css";
import { Heart, ShoppingBag, MessageCircle } from "lucide-react";

interface ProductCardProps {
  image: string;
  title: string;
  productCode?: string;
  price: number;
  isNew?: boolean;
  colors?: string[];
  extraColorsCount?: number;
}

export default function ProductCard({
  image,
  title,
  productCode,
  price,
  isNew = false,
  colors = [],
  extraColorsCount = 0,
}: ProductCardProps) {
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <Image 
          src={image} 
          alt={title} 
          fill 
          className={styles.image} 
        />
        {isNew && <div className={styles.badge}>NEW</div>}
        <button className={styles.wishlistBtn} aria-label="Add to wishlist">
          <Heart size={16} />
        </button>
      </div>
      
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        {productCode && <span className={styles.productCode}>{productCode}</span>}
        <div className={styles.priceRow}>
          <span className={styles.price}>{formattedPrice}</span>
          <span className={styles.gst}>(+12% GST)</span>
        </div>
        
        {colors.length > 0 && (
          <div className={styles.colorsRow}>
            {colors.map((color, index) => (
              <span 
                key={index} 
                className={styles.colorSwatch} 
                style={{ backgroundColor: color }}
              />
            ))}
            {extraColorsCount > 0 && (
              <span className={styles.extraColors}>+{extraColorsCount}</span>
            )}
          </div>
        )}
        
        <div className={styles.actions}>
          <button className={styles.btnAddToCart}>
            <ShoppingBag size={14} />
            Add to Cart
          </button>
          <button className={styles.btnInquiry}>
            <MessageCircle size={14} />
            Inquiry
          </button>
        </div>
      </div>
    </div>
  );
}
