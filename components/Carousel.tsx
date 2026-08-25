"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./Carousel.module.css";

interface CarouselItem {
  image: string;
  label: string;
  alt: string;
}

interface CarouselProps {
  items: CarouselItem[];
  autoPlayInterval?: number;
}

export default function Carousel({ items, autoPlayInterval = 3000 }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    if (items.length <= 1) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, autoPlayInterval);
    
    return () => clearInterval(timer);
  }, [items.length, autoPlayInterval]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      goToNext(); // swipe left
    }
    if (touchStartX.current - touchEndX.current < -50) {
      goToPrev(); // swipe right
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <div 
      className={styles.carouselContainer}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className={styles.carouselTrack}>
        {items.map((item, idx) => {
          let offset = idx - currentIndex;
          // Handle infinite wrapping for smooth effect
          if (offset > Math.floor(items.length / 2)) {
            offset -= items.length;
          } else if (offset < -Math.floor(items.length / 2)) {
            offset += items.length;
          }
          
          let className = styles.carouselSlide;
          let inlineStyle: React.CSSProperties = {
            zIndex: 10 - Math.abs(offset),
            transform: `translateX(${offset * 120}%) scale(${1 - Math.abs(offset) * 0.15})`,
            opacity: Math.abs(offset) >= 3 ? 0 : 1,
            pointerEvents: offset === 0 ? 'auto' : 'none',
          };

          return (
            <div 
              key={idx} 
              className={className}
              style={inlineStyle}
              onClick={() => {
                if (offset !== 0) setCurrentIndex(idx);
              }}
            >
              <Image 
                src={item.image} 
                alt={item.alt} 
                fill 
                className={styles.carouselImage}
                priority={idx === 0}
              />
              <div className={`${styles.carouselCaption} ${offset === 0 ? styles.captionActive : ''}`}>
                <h3>{item.label}</h3>
              </div>
            </div>
          );
        })}
      </div>

      {items.length > 1 && (
        <>
          <button className={`${styles.navButton} ${styles.prevButton}`} onClick={goToPrev}>
            <ChevronLeft size={24} />
          </button>
          <button className={`${styles.navButton} ${styles.nextButton}`} onClick={goToNext}>
            <ChevronRight size={24} />
          </button>
          
          <div className={styles.indicators}>
            {items.map((_, idx) => (
              <button 
                key={idx} 
                className={`${styles.indicatorDot} ${idx === currentIndex ? styles.activeDot : ''}`}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
