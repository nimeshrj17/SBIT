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
        <h3 className={styles.title}>{title}</h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          {productCode && <span className={styles.productCode}>{productCode}</span>}
          
          {colors.length > 0 && (
            <div className={styles.colorsRow} style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', margin: 0 }}>
              {colors.map((color, index) => {
                const [name, hex] = color.includes('|') ? color.split('|') : [color, 'transparent'];
                return (
                  <span 
                    key={index} 
                    style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', backgroundColor: '#eee', padding: '2px 6px', borderRadius: '4px', color: '#333' }}
                  >
                    {hex !== 'transparent' && <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: hex }}></span>}
                    {name}
                  </span>
                );
              })}
              {extraColorsCount > 0 && (
                <span className={styles.extraColors}>+{extraColorsCount}</span>
              )}
            </div>
          )}
        </div>
        
        <div className={styles.priceRow} style={{ display: 'none' }}>
        </div>
        
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
            <span className={styles.hideOnMobile}>Add to Cart</span>
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
            <span className={styles.hideOnMobile} style={{ display: 'flex' }}><MessageCircle size={14} /></span>
            Inquiry
          </SpecularButton>
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
