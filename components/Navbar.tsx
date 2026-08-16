'use client';
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close menu on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (isMobileMenuOpen) setIsMobileMenuOpen(false);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobileMenuOpen]);

  return (
    <nav className={styles.navbarWrapper}>
      <div className={styles.navbar}>
        <div className={styles.logoContainer}>
          <div className={styles.logoImageWrapper}>
            <Image src="/logo.jpg" alt="Logo Icon" width={60} height={60} className={styles.logoIcon} />
          </div>
          <div className={styles.logoTextContainer}>
            <span className={styles.overline}>&mdash; HOUSE OF &mdash;</span>
            <Link href="/" className={styles.logo}>
              SHRI
            </Link>
          </div>
        </div>
        
        {/* Mobile Toggle Button */}
        <button 
          className={styles.mobileMenuBtn} 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          )}
        </button>

        <div className={`${styles.links} ${isMobileMenuOpen ? styles.mobileOpen : ''}`}>
          <Link href="/" className={`${styles.link} ${styles.active}`} onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
          <a href="#collections" className={styles.link} onClick={() => setIsMobileMenuOpen(false)}>Collections</a>
          <a href="#contact" className={styles.link} onClick={() => setIsMobileMenuOpen(false)}>Contact</a>
        </div>
      </div>
    </nav>
  );
}
