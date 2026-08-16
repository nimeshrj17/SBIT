import styles from "../products/page.module.css";
import { Users } from "lucide-react";

export default function InquiriesPage() {
  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Inquiries</h1>
          <p className={styles.subtitle}>Manage customer quotes and contact requests.</p>
        </div>
      </header>
      
      <div style={{ backgroundColor: 'rgba(30, 15, 20, 0.6)', padding: '4rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Users size={48} style={{ color: 'rgba(201, 161, 90, 0.4)', marginBottom: '1rem' }} />
        <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', fontWeight: 500, color: '#f7f4ee' }}>No Inquiries Yet</h2>
        <p style={{ color: 'rgba(245, 239, 230, 0.5)', margin: 0 }}>Customer inquiries submitted through the contact form will appear here.</p>
      </div>
    </div>
  );
}
