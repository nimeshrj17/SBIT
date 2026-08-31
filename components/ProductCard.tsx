import { useState, useRef } from "react";
import Image from "next/image";
import styles from "./ProductCard.module.css";
import { Heart, ShoppingBag, MessageCircle, X } from "lucide-react";
import SpecularButton from "./SpecularButton";

interface ProductCardProps {
  image: string;
  images?: string[];
  title: string;
  productCode?: string;
  price: number;
  priceDisplay?: string;
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
  images = [],
  title,
  productCode,
  price,
  priceDisplay,
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

  const allImages = images.length > 0 ? images : [image];
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (sliderRef.current) {
      const scrollLeft = sliderRef.current.scrollLeft;
      const width = sliderRef.current.clientWidth;
      const index = Math.round(scrollLeft / width);
      setActiveImageIndex(index);
    }
  };

  return (
    <>
      <div className={styles.card}>
        <div className={styles.imageContainer}>
          <div 
            className={styles.imageSlider} 
            ref={sliderRef}
            onScroll={handleScroll}
          >
            {allImages.map((imgSrc, i) => (
              <div 
                key={i} 
                className={styles.slide}
                onClick={() => setIsModalOpen(true)}
              >
                <Image 
                  src={imgSrc} 
                  alt={`${title} - ${i + 1}`} 
                  fill 
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  loading={i === 0 ? "eager" : "lazy"}
                  className={styles.image} 
                />
              </div>
            ))}
          </div>
          
          {allImages.length > 1 && (
            <div className={styles.dotsContainer}>
              {allImages.map((_, i) => (
                <div 
                  key={i} 
                  className={`${styles.dot} ${activeImageIndex === i ? styles.active : ''}`}
                />
              ))}
            </div>
          )}
        <div className={styles.badges}>
          {isNew && <div className={styles.badge}>NEW</div>}
          {isPopular && <div className={styles.badgePopular}>POPULAR</div>}
          {isBestSeller && <div className={styles.badgeBestSeller}>BEST SELLER</div>}
        </div>
      </div>
      
      <div className={styles.content}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
          {productCode && <h3 className={styles.title} style={{ fontSize: '0.95rem', fontFamily: 'monospace', margin: 0 }}>{productCode}</h3>}
          {colors.length > 0 && (
            <div className={styles.colorsRow} style={{ margin: 0 }}>
              {colors.map((color, index) => {
                const [name, hex] = color.includes('|') ? color.split('|') : [color, 'transparent'];
                return (
                  <span 
                    key={index} 
                    className={styles.colorSwatch} 
                    style={{ backgroundColor: hex !== 'transparent' ? hex : '#ccc' }} 
                    title={name} 
                  />
                );
              })}
              {extraColorsCount > 0 && (
                <span className={styles.extraColors}>+{extraColorsCount}</span>
              )}
            </div>
          )}
        </div>
        
        {colors.length > 0 && (
          <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '0.75rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {colors.map(c => c.includes('|') ? c.split('|')[0] : c).join(', ')}
          </div>
        )}
        
        <div className={styles.actions}>
          <button className={styles.btnAddToCart} onClick={onAddToCart}>
            ADD
          </button>
          <button className={styles.btnInquiry} onClick={onInquiry}>
            INQUIRY
          </button>
        </div>
      </div>
    </div>

      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <button className={styles.modalCloseBtn} onClick={() => setIsModalOpen(false)}>
            <X size={32} />
          </button>
          <div className={styles.modalImageContainer} onClick={(e) => e.stopPropagation()}>
            <Image 
              src={allImages[activeImageIndex]} 
              alt={title} 
              fill 
              style={{ objectFit: 'contain' }}
            />
          </div>
        </div>
      )}
    </>
  );
}
