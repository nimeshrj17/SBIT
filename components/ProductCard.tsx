import Image from "next/image";
import styles from "./ProductCard.module.css";
import { Heart, ShoppingBag, MessageCircle } from "lucide-react";
import SpecularButton from "./SpecularButton";

interface ProductCardProps {
  image: string;
  title: string;
  productCode?: string;
  price: number;
  isNew?: boolean;
  isPopular?: boolean;
  isBestSeller?: boolean;
  colors?: string[];
  extraColorsCount?: number;
  onAddToCart?: () => void;
  onInquiry?: () => void;
}

export default function ProductCard({
  image,
  title,
  productCode,
  price,
  isNew = false,
  isPopular = false,
  isBestSeller = false,
  colors = [],
  extraColorsCount = 0,
  onAddToCart,
  onInquiry,
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
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          loading="lazy"
          className={styles.image} 
        />
        <div className={styles.badges}>
          {isNew && <div className={styles.badge}>NEW</div>}
          {isPopular && <div className={styles.badgePopular}>POPULAR</div>}
          {isBestSeller && <div className={styles.badgeBestSeller}>BEST SELLER</div>}
        </div>
      </div>
      
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        {productCode && <span className={styles.productCode}>{productCode}</span>}
        
        {colors.length > 0 && (
          <div className={styles.colorsRow} style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {colors.map((color, index) => (
              <span 
                key={index} 
                style={{ fontSize: '0.75rem', backgroundColor: '#eee', padding: '2px 6px', borderRadius: '4px', color: '#333' }}
              >
                {color}
              </span>
            ))}
            {extraColorsCount > 0 && (
              <span className={styles.extraColors}>+{extraColorsCount}</span>
            )}
          </div>
        )}
        
        <div className={styles.actions}>
          <SpecularButton
            size="sm"
            radius={8}
            tint="#000000"
            tintOpacity={1}
            blur={0}
            textColor="#ffffff"
            lineColor="#555555"
            baseColor="#000000"
            intensity={1.2}
            shineSize={10}
            shineFade={40}
            thickness={1}
            speed={0.35}
            followMouse={true}
            proximity={250}
            autoAnimate={false}
            onClick={onAddToCart}
          >
            <ShoppingBag size={14} />
            Add to Cart
          </SpecularButton>
          <SpecularButton
            size="sm"
            radius={8}
            tint="#000000"
            tintOpacity={1}
            blur={0}
            textColor="#ffffff"
            lineColor="#555555"
            baseColor="#000000"
            intensity={1}
            shineSize={10}
            shineFade={40}
            thickness={1}
            speed={0.35}
            followMouse={true}
            proximity={250}
            autoAnimate={false}
            onClick={onInquiry}
          >
            <MessageCircle size={14} />
            Inquiry
          </SpecularButton>
        </div>
      </div>
    </div>
  );
}
