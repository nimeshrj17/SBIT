"use client";

import { useState, useEffect } from "react";
import styles from "../products/page.module.css";
import { Settings, Save, Phone } from "lucide-react";
import { getSetting, setSetting } from "@/lib/productService";

export default function SettingsPage() {
  const [whatsapp, setWhatsapp] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      const number = await getSetting("whatsappNumber");
      if (number) setWhatsapp(number);
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    
    try {
      await setSetting("whatsappNumber", whatsapp);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      alert("Failed to save settings.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Settings</h1>
          <p className={styles.subtitle}>Configure admin panel and storefront settings.</p>
        </div>
      </header>
      
      <div style={{ backgroundColor: 'rgba(30, 15, 20, 0.6)', padding: '2rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', maxWidth: '600px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}>
          <Settings size={24} style={{ color: '#c9a15a' }} />
          <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 500, color: '#f7f4ee' }}>General Configuration</h2>
        </div>
        
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="whatsapp" style={{ color: 'rgba(245, 239, 230, 0.8)', fontSize: '0.9rem' }}>
              WhatsApp Contact Number
            </label>
            <p style={{ color: 'rgba(245, 239, 230, 0.5)', fontSize: '0.8rem', margin: '0 0 0.5rem 0' }}>
              All cart checkouts, inquiries, and orders will be sent to this number.
            </p>
            
            <div style={{ position: 'relative' }}>
              <Phone size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
              <input 
                type="text" 
                id="whatsapp"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+91 1234567890"
                style={{ 
                  width: '100%', 
                  backgroundColor: 'rgba(0,0,0,0.3)', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  padding: '1rem 1rem 1rem 3rem', 
                  borderRadius: '6px',
                  color: '#fff',
                  fontFamily: 'inherit',
                  fontSize: '1rem'
                }}
                required
              />
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
            <button 
              type="submit" 
              disabled={isSaving}
              style={{ 
                backgroundColor: '#c9a15a', 
                color: '#000', 
                border: 'none', 
                padding: '0.75rem 2rem', 
                borderRadius: '6px',
                fontWeight: 600,
                cursor: isSaving ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                opacity: isSaving ? 0.7 : 1
              }}
            >
              <Save size={18} />
              {isSaving ? "Saving..." : "Save Settings"}
            </button>
            
            {saveSuccess && (
              <span style={{ color: '#4caf50', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                Settings saved successfully!
              </span>
            )}
          </div>
          
        </form>
      </div>
    </div>
  );
}
