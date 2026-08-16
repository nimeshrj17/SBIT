'use client';
import Image from "next/image";
import styles from "./Hero.module.css";
import Link from "next/link";
import { ArrowRight, Globe, Scissors, ShieldCheck, Factory } from "lucide-react";
import Silk from "./Silk";
import { useState, useEffect } from "react";

const HERO_CATEGORIES = [
  { id: "c1", name: "Bridal Lehengas", image: "/collections/bridal.jpg" },
  { id: "c2", name: "Sarees", image: "/collections/saree.jpg" },
  { id: "c3", name: "Suits", image: "/collections/suits.jpg" },
  { id: "c4", name: "Fusion Wear", image: "/collections/fusion.jpg" },
  { id: "c5", name: "Fabrics", image: "/collections/fabrics.jpg" },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_CATEGORIES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.heroSection}>
      <div className={styles.silkBackground}>
        <Silk
          speed={5}
          scale={1}
          color="#6c1d32"
          noiseIntensity={1.5}
          rotation={0}
        />
      </div>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.overline}>
            MANUFACTURER & EXPORTER &bull; SURAT &bull; INDIA
          </div>
          
          <h1 className={styles.title}>
            Indian occasionwear,<br/>
            thoughtfully crafted.
          </h1>
          
          <p className={styles.description}>
            House of Shri is a Surat-based manufacturer and exporter of lehengas and Indian ethnic wear, 
            supplying international retailers, boutiques and brands.
          </p>
          
          <div className={styles.actions}>
            <Link href="#collections" className={styles.btnPrimary}>
              EXPLORE COLLECTIONS <ArrowRight size={16} />
            </Link>
            <Link href="/quote" className={styles.btnOutline}>GET A QUOTE</Link>
          </div>
          
          <div className={styles.features}>
            <div className={styles.featureItem}>
              <Globe size={28} className={styles.featureIcon} />
              <span className={styles.featureText}><strong>20+ Countries</strong><br/>Exporting Worldwide</span>
            </div>
            <div className={styles.featureDivider}></div>
            <div className={styles.featureItem}>
              <Scissors size={28} className={styles.featureIcon} />
              <span className={styles.featureText}><strong>Custom Designs</strong><br/>You Share. We Manufacture.</span>
            </div>
            <div className={styles.featureDivider}></div>
            <div className={styles.featureItem}>
              <ShieldCheck size={28} className={styles.featureIcon} />
              <span className={styles.featureText}><strong>Premium Quality</strong><br/>Made With Attention to Detail</span>
            </div>
            <div className={styles.featureDivider}></div>
            <div className={styles.featureItem}>
              <Factory size={28} className={styles.featureIcon} />
              <span className={styles.featureText}><strong>Direct Manufacturer</strong><br/>Competitive Factory Pricing</span>
            </div>
          </div>
        </div>
        
        <div className={styles.rightColumn}>
          <div className={styles.heroCarouselFrame}>
            {HERO_CATEGORIES.map((cat, idx) => (
              <div 
                key={cat.id} 
                className={`${styles.heroCarouselSlide} ${idx === currentSlide ? styles.activeSlide : ''}`}
              >
                <Image 
                  src={cat.image} 
                  alt={cat.name} 
                  fill 
                  className={styles.heroCarouselImage}
                  priority={idx === 0}
                />
                <div className={styles.heroCarouselCaption}>
                  <span>{cat.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className={styles.bottomBar}>
         <span className={styles.ornament}>&laquo;</span>
         <span className={styles.bottomBarText}>CRAFTED IN INDIA. MADE FOR THE WORLD.</span>
         <span className={styles.ornament}>&raquo;</span>
      </div>
    </div>
  );
}
