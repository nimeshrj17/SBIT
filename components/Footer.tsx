import Link from "next/link";
import styles from "./Footer.module.css";
import { Mail, MapPin, Phone, Send } from "lucide-react";

interface FooterProps {
  whatsappNumber?: string;
}

export default function Footer({ whatsappNumber = "+91 123 456 7890" }: FooterProps) {
  return (
    <footer id="contact" className={styles.footer}>
      <div className={styles.container}>
        
        {/* Contact Form Section */}
        <div className={styles.contactFormSection}>
          <div className={styles.formHeader}>
            <h2 className={styles.title}>Get in Touch</h2>
            <p className={styles.subtitle}>
              For custom orders, wholesale inquiries, or just to say hello.
            </p>
            <div className={styles.divider}></div>
          </div>
          
          <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
            <div className={styles.inputGroup}>
              <div className={styles.inputField}>
                <label htmlFor="name">Name</label>
                <input type="text" id="name" placeholder="Your full name" required />
              </div>
              <div className={styles.inputField}>
                <label htmlFor="email">Email</label>
                <input type="email" id="email" placeholder="Your email address" required />
              </div>
            </div>
            
            <div className={styles.inputField}>
              <label htmlFor="phone">Phone / WhatsApp (Optional)</label>
              <input type="tel" id="phone" placeholder="Your contact number" />
            </div>
            
            <div className={styles.inputField}>
              <label htmlFor="message">Message</label>
              <textarea id="message" rows={4} placeholder="How can we help you?" required></textarea>
            </div>
            
            <button type="submit" className={styles.submitBtn}>
              Send Message <Send size={16} />
            </button>
          </form>
        </div>

        {/* Footer Info Section */}
        <div className={styles.footerInfoSection}>
          <div className={styles.brandInfo}>
            <div className={styles.logo}>
              <div className={styles.logoCircle}></div>
              <div className={styles.logoText}>
                <span className={styles.logoHouse}>&mdash; HOUSE OF &mdash;</span>
                <span className={styles.logoShri}>SHRI</span>
              </div>
            </div>
            <p className={styles.brandDesc}>
              A Surat-based manufacturer and exporter of lehengas and Indian ethnic wear, 
              supplying international retailers and boutiques worldwide.
            </p>
          </div>
          
          <div className={styles.linksGrid}>
            <div className={styles.linksColumn}>
              <h4 className={styles.columnTitle}>Quick Links</h4>
              <Link href="/">Home</Link>
              <Link href="#collections">Collections</Link>
              <Link href="/about">About Us</Link>
              <Link href="/quote">Custom Quote</Link>
            </div>
            
            <div className={styles.linksColumn}>
              <h4 className={styles.columnTitle}>Collections</h4>
              <Link href="#collections">Bridal Lehengas</Link>
              <Link href="#collections">Sarees</Link>
              <Link href="#collections">Suits</Link>
              <Link href="#collections">Fusion Wear</Link>
            </div>
          </div>
          
          <div className={styles.contactDetails}>
            <div className={styles.contactItem}>
              <MapPin size={18} className={styles.contactIcon} />
              <span>Surat Textile Market, Surat, Gujarat, India</span>
            </div>
            <div className={styles.contactItem}>
              <Phone size={18} className={styles.contactIcon} />
              <span>{whatsappNumber}</span>
            </div>
            <div className={styles.contactItem}>
              <Mail size={18} className={styles.contactIcon} />
              <span>hello@houseofshri.com</span>
            </div>
          </div>
          
          <div className={styles.socialLinks}>
            <a href="#" aria-label="Instagram" className={styles.socialIcon}>IG</a>
          </div>
        </div>
      </div>
      
      <div className={styles.bottomBar}>
        <p>&copy; {new Date().getFullYear()} House of Shri. All rights reserved.</p>
        <p>Crafted with elegance.</p>
      </div>
    </footer>
  );
}
