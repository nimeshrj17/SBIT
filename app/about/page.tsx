"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloating from "@/components/WhatsAppFloating";
import { getSetting } from "@/lib/productService";
import styles from "./page.module.css";
import { Play } from "lucide-react";

export default function AboutUsPage() {
  const [whatsappNumber, setWhatsappNumber] = useState("919999999999");
  const [storeEmail, setStoreEmail] = useState("");
  const [storeAddress, setStoreAddress] = useState("");
  
  const [aboutData, setAboutData] = useState({
    heroTitle: "Rooted in tradition,\ncrafted for today.",
    heroText: "House of Shri is a Surat-based manufacturer and exporter of premium lehngas and Indian ethnic wear. With decades of craftsmanship behind us, we blend heritage techniques with modern aesthetics to create timeless pieces for every occasion.",
    heroImage: "/placeholder-bridal.jpg", // fallback
    storyTitle: "From Surat to\nthe world",
    storyText: "What began as a small family-run atelier in Surat has grown into a trusted name in ethnic wear. Our commitment to quality, detail and delivery has helped us build lasting relationships with retailers and boutiques across India and around the globe.",
    cards: [
      { title: "Hand Embroidery", text: "Intricate detailing by skilled artisans", image: "" },
      { title: "Skilled Craftsmanship", text: "Years of experience passed down through generations", image: "" },
      { title: "Quality & Precision", text: "Every piece undergoes strict quality checks", image: "" },
      { title: "Global Shipping", text: "Delivered with care, across the world", image: "" }
    ]
  });

  useEffect(() => {
    const fetchSettings = async () => {
      const number = await getSetting("whatsappNumber");
      if (number) setWhatsappNumber(number);
      const email = await getSetting("storeEmail");
      if (email) setStoreEmail(email);
      const address = await getSetting("storeAddress");
      if (address) setStoreAddress(address);
      
      const aboutSetting = await getSetting("aboutUsData");
      if (aboutSetting) {
        try {
          const parsed = JSON.parse(aboutSetting);
          setAboutData(parsed);
        } catch(e) {}
      }
    };
    fetchSettings();
  }, []);

  return (
    <div className={styles.page}>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, backgroundColor: '#c9a15a', color: '#1a0a0d', textAlign: 'center', padding: '0.4rem', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em' }}>
        MADE FOR BUSINESSES AND TRADE
      </div>
      
      <Navbar />

      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className={styles.overline}>ABOUT HOUSE OF SHRI</div>
          <h1 className={styles.heroTitle}>{aboutData.heroTitle}</h1>
          <p className={styles.heroText}>{aboutData.heroText}</p>
          
          <div className={styles.featuresGrid}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v18"/><path d="M12 3c-3 0-6 2.5-6 6s3 6 6 6s6-2.5 6-6s-3-6-6-6Z"/></svg>
              </div>
              <span className={styles.featureText}>Heritage<br/>Craftsmanship</span>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 12l3 3l5-5"/></svg>
              </div>
              <span className={styles.featureText}>Premium<br/>Quality Fabrics</span>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2L2 14l4 4l12-12-4-4Z"/><path d="M14 2l4 4"/><path d="M18 6l4-4"/></svg>
              </div>
              <span className={styles.featureText}>Intricate Hand<br/>Embellishments</span>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>
              </div>
              <span className={styles.featureText}>Global Reach &<br/>Trusted Partnership</span>
            </div>
          </div>
        </div>

        <div className={styles.heroImageWrapper}>
          {aboutData.heroImage ? (
            <img src={aboutData.heroImage} alt="Bridal Lehenga" className={styles.heroImage} />
          ) : (
            <div style={{ width: '100%', height: '100%', backgroundColor: 'rgba(255,255,255,0.1)' }}></div>
          )}
          <div className={styles.playButtonOverlay}>
            <div className={styles.playIcon}>
              <Play size={24} fill="currentColor" style={{ marginLeft: '4px' }} />
            </div>
            <span className={styles.playText}>Watch Our Story</span>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className={styles.storySection}>
        <div className={styles.storyContent}>
          <div className={styles.overline}>OUR STORY</div>
          <h2 className={styles.storyTitle}>{aboutData.storyTitle}</h2>
          <p className={styles.storyText}>{aboutData.storyText}</p>
          <Link href="/#collections" className={styles.journeyBtn}>
            OUR COLLECTION &rarr;
          </Link>
        </div>

        <div className={styles.cardsGrid}>
          {aboutData.cards.map((card, idx) => (
            <div key={idx} className={styles.card}>
              <div className={styles.cardImageWrapper}>
                {card.image ? (
                  <img src={card.image} alt={card.title} className={styles.cardImage} />
                ) : (
                  <div style={{ width: '100%', height: '100%', backgroundColor: 'rgba(255,255,255,0.05)' }}></div>
                )}
                <div className={styles.cardPlayIcon}>
                  <Play size={18} fill="currentColor" style={{ marginLeft: '2px' }} />
                </div>
              </div>
              <div>
                <h3 className={styles.cardTitle}>{card.title}</h3>
                <p className={styles.cardText}>{card.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer 
        whatsappNumber={whatsappNumber} 
        storeEmail={storeEmail}
        storeAddress={storeAddress}
      />
      <WhatsAppFloating phoneNumber={whatsappNumber} />
    </div>
  );
}
