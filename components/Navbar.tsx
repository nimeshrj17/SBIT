import Link from "next/link";
import Image from "next/image";
import styles from "./Navbar.module.css";

export default function Navbar() {
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
        <div className={styles.links}>
          <Link href="/" className={`${styles.link} ${styles.active}`}>Home</Link>
          <Link href="#collections" className={styles.link}>Collections</Link>
          <Link href="/about" className={styles.link}>About</Link>
          <Link href="/instagram" className={styles.link}>Instagram</Link>
          <Link href="/contact" className={styles.link}>Contact</Link>
        </div>
        <div className={styles.actions}>
          <Link href="/quote" className={styles.btnOutline}>Get a Quote</Link>
        </div>
      </div>
    </nav>
  );
}
