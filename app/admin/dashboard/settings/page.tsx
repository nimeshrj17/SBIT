"use client";

import { useState, useEffect } from "react";
import styles from "../products/page.module.css";
import { Settings, Save, Phone } from "lucide-react";
import { getSetting, setSetting, uploadImageToStorage } from "@/lib/productService";

export default function SettingsPage() {
  const [whatsapp, setWhatsapp] = useState("");
  const [storeEmail, setStoreEmail] = useState("");
  const [storeAddress, setStoreAddress] = useState("");
  const [priceFilterInterval, setPriceFilterInterval] = useState("4000");
  const [enablePriceRange, setEnablePriceRange] = useState(true);
  const [availableColors, setAvailableColors] = useState("Peach, Multi Colour, Off White, Maroon, Wine, Baby Pink, Yellow, Orange, Gold, Grey, Black, Rani");
  const [availableFabrics, setAvailableFabrics] = useState("Silk, Georgette, Velvet, Net, Crepe, Organza");
  const [backgroundColor, setBackgroundColor] = useState("#1a0a0d");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const [aboutUsData, setAboutUsData] = useState({
    heroTitle: "Rooted in tradition,\ncrafted for today.",
    heroText: "House of Shri is a Surat-based manufacturer and exporter of premium lehngas and Indian ethnic wear. With decades of craftsmanship behind us, we blend heritage techniques with modern aesthetics to create timeless pieces for every occasion.",
    heroImage: "",
    storyTitle: "From Surat to\nthe world",
    storyText: "What began as a small family-run atelier in Surat has grown into a trusted name in ethnic wear. Our commitment to quality, detail and delivery has helped us build lasting relationships with retailers and boutiques across India and around the globe.",
    cards: [
      { title: "Hand Embroidery", text: "Intricate detailing by skilled artisans", image: "" },
      { title: "Skilled Craftsmanship", text: "Years of experience passed down through generations", image: "" },
      { title: "Quality & Precision", text: "Every piece undergoes strict quality checks", image: "" },
      { title: "Global Shipping", text: "Delivered with care, across the world", image: "" }
    ]
  });

  const processImageFile = async (file: File, callback: (url: string) => void) => {
    try {
      const url = await uploadImageToStorage(file, 'settings');
      callback(url);
    } catch (e) {
      console.error("Error uploading image:", e);
      alert("Failed to upload image.");
    }
  };

  useEffect(() => {
    const fetchSettings = async () => {
      const number = await getSetting("whatsappNumber");
      if (number) setWhatsapp(number);
      const email = await getSetting("storeEmail");
      if (email) setStoreEmail(email);
      const address = await getSetting("storeAddress");
      if (address) setStoreAddress(address);
      const interval = await getSetting("priceFilterInterval");
      if (interval) setPriceFilterInterval(interval);
      const enablePrice = await getSetting("enablePriceRange");
      if (enablePrice !== null) setEnablePriceRange(enablePrice === "true");
      const colors = await getSetting("availableColors");
      if (colors) setAvailableColors(colors);
      const fabrics = await getSetting("availableFabrics");
      if (fabrics) setAvailableFabrics(fabrics);
      const bgColor = await getSetting("backgroundColor");
      if (bgColor) setBackgroundColor(bgColor);
      const about = await getSetting("aboutUsData");
      if (about) {
        try { setAboutUsData(JSON.parse(about)); } catch(e) {}
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    
    try {
      await setSetting("whatsappNumber", whatsapp);
      await setSetting("storeEmail", storeEmail);
      await setSetting("storeAddress", storeAddress);
      await setSetting("priceFilterInterval", priceFilterInterval);
      await setSetting("enablePriceRange", enablePriceRange.toString());
      await setSetting("availableColors", availableColors);
      await setSetting("availableFabrics", availableFabrics);
      await setSetting("backgroundColor", backgroundColor);
      await setSetting("aboutUsData", JSON.stringify(aboutUsData));
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
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="priceFilterInterval" style={{ color: 'rgba(245, 239, 230, 0.8)', fontSize: '0.9rem' }}>
              Price Filter Interval (₹)
            </label>
            <p style={{ color: 'rgba(245, 239, 230, 0.5)', fontSize: '0.8rem', margin: '0 0 0.5rem 0' }}>
              The gap between price filter categories on the storefront (e.g. 4000 generates 0-4000, 4000-8000, etc.)
            </p>
            
            <input 
              type="number" 
              id="priceFilterInterval"
              value={priceFilterInterval}
              onChange={(e) => setPriceFilterInterval(e.target.value)}
              min="1000"
              step="1000"
              style={{ 
                width: '100%', 
                backgroundColor: 'rgba(0,0,0,0.3)', 
                border: '1px solid rgba(255,255,255,0.1)', 
                padding: '1rem', 
                borderRadius: '6px',
                color: '#fff',
                fontFamily: 'inherit',
                fontSize: '1rem'
              }}
              required
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <input 
              type="checkbox" 
              id="enablePriceRange"
              checked={enablePriceRange}
              onChange={(e) => setEnablePriceRange(e.target.checked)}
              style={{ width: '1.2rem', height: '1.2rem', cursor: 'pointer' }}
            />
            <label htmlFor="enablePriceRange" style={{ color: 'rgba(245, 239, 230, 0.8)', fontSize: '0.9rem', cursor: 'pointer' }}>
              Enable Price Range filter and inputs for products
            </label>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="storeEmail" style={{ color: 'rgba(245, 239, 230, 0.8)', fontSize: '0.9rem' }}>
              Store Email
            </label>
            <input 
              type="email" 
              id="storeEmail"
              value={storeEmail}
              onChange={(e) => setStoreEmail(e.target.value)}
              placeholder="contact@houseofshri.com"
              style={{ 
                width: '100%', 
                backgroundColor: 'rgba(0,0,0,0.3)', 
                border: '1px solid rgba(255,255,255,0.1)', 
                padding: '1rem', 
                borderRadius: '6px',
                color: '#fff',
                fontFamily: 'inherit',
                fontSize: '1rem'
              }}
              required
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="storeAddress" style={{ color: 'rgba(245, 239, 230, 0.8)', fontSize: '0.9rem' }}>
              Store Address
            </label>
            <input 
              type="text" 
              id="storeAddress"
              value={storeAddress}
              onChange={(e) => setStoreAddress(e.target.value)}
              placeholder="Surat, Gujarat, India"
              style={{ 
                width: '100%', 
                backgroundColor: 'rgba(0,0,0,0.3)', 
                border: '1px solid rgba(255,255,255,0.1)', 
                padding: '1rem', 
                borderRadius: '6px',
                color: '#fff',
                fontFamily: 'inherit',
                fontSize: '1rem'
              }}
              required
            />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="backgroundColor" style={{ color: 'rgba(245, 239, 230, 0.8)', fontSize: '0.9rem' }}>
              Storefront Background Color
            </label>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <input 
                type="color" 
                id="backgroundColorPicker"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                style={{ 
                  width: '50px', 
                  height: '50px', 
                  padding: '0', 
                  border: 'none', 
                  borderRadius: '4px',
                  cursor: 'pointer',
                  backgroundColor: 'transparent'
                }}
              />
              <input 
                type="text" 
                id="backgroundColor"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                placeholder="#1a0a0d"
                style={{ 
                  flex: 1,
                  backgroundColor: 'rgba(0,0,0,0.3)', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  padding: '1rem', 
                  borderRadius: '6px',
                  color: '#fff',
                  fontFamily: 'monospace',
                  fontSize: '1rem'
                }}
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ color: 'rgba(245, 239, 230, 0.8)', fontSize: '0.9rem' }}>
              Available Colors
            </label>
            <p style={{ color: 'rgba(245, 239, 230, 0.5)', fontSize: '0.8rem', margin: '0 0 0.5rem 0' }}>
              Add color names and their matching hex dot. These appear when adding products.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input 
                type="text" 
                id="newColorName"
                placeholder="e.g. Emerald Green"
                style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem', borderRadius: '6px', color: '#fff', fontSize: '0.9rem' }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const nameInput = document.getElementById('newColorName') as HTMLInputElement;
                    const hexInput = document.getElementById('newColorHex') as HTMLInputElement;
                    if (nameInput.value.trim()) {
                      const newColor = `${nameInput.value.trim()}|${hexInput.value}`;
                      setAvailableColors(prev => prev ? `${prev}, ${newColor}` : newColor);
                      nameInput.value = "";
                    }
                  }
                }}
              />
              <input 
                type="color"
                id="newColorHex"
                defaultValue="#c9a15a"
                style={{ width: '45px', height: '45px', padding: '0', cursor: 'pointer', borderRadius: '6px', border: 'none' }}
                title="Select matching color dot"
              />
              <button 
                type="button" 
                style={{ backgroundColor: '#c9a15a', color: '#111', border: 'none', borderRadius: '6px', padding: '0 1rem', fontWeight: 600, cursor: 'pointer' }}
                onClick={() => {
                  const nameInput = document.getElementById('newColorName') as HTMLInputElement;
                  const hexInput = document.getElementById('newColorHex') as HTMLInputElement;
                  if (nameInput.value.trim()) {
                    const newColor = `${nameInput.value.trim()}|${hexInput.value}`;
                    setAvailableColors(prev => prev ? `${prev}, ${newColor}` : newColor);
                    nameInput.value = "";
                  }
                }}
              >
                Add
              </button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {availableColors.split(',').map(c => c.trim()).filter(Boolean).map((color, idx) => {
                const [name, hex] = color.includes('|') ? color.split('|') : [color, '#ccc'];
                return (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(255,255,255,0.1)', padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem', color: '#fff' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: hex }}></span>
                    {name}
                    <button 
                      type="button" 
                      style={{ background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', fontSize: '1rem', marginLeft: '4px', display: 'flex', alignItems: 'center' }}
                      onClick={() => {
                        const arr = availableColors.split(',').map(c => c.trim()).filter(Boolean);
                        arr.splice(idx, 1);
                        setAvailableColors(arr.join(', '));
                      }}
                    >&times;</button>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ color: 'rgba(245, 239, 230, 0.8)', fontSize: '0.9rem' }}>
              Available Fabrics
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input 
                type="text" 
                id="newFabricName"
                placeholder="e.g. Silk, Velvet"
                style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem', borderRadius: '6px', color: '#fff', fontSize: '0.9rem' }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const nameInput = document.getElementById('newFabricName') as HTMLInputElement;
                    if (nameInput.value.trim()) {
                      const newFab = nameInput.value.trim();
                      setAvailableFabrics(prev => prev ? `${prev}, ${newFab}` : newFab);
                      nameInput.value = "";
                    }
                  }
                }}
              />
              <button 
                type="button" 
                style={{ backgroundColor: '#c9a15a', color: '#111', border: 'none', borderRadius: '6px', padding: '0 1rem', fontWeight: 600, cursor: 'pointer' }}
                onClick={() => {
                  const nameInput = document.getElementById('newFabricName') as HTMLInputElement;
                  if (nameInput.value.trim()) {
                    const newFab = nameInput.value.trim();
                    setAvailableFabrics(prev => prev ? `${prev}, ${newFab}` : newFab);
                    nameInput.value = "";
                  }
                }}
              >
                Add
              </button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {availableFabrics.split(',').map(c => c.trim()).filter(Boolean).map((fabric, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(255,255,255,0.1)', padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem', color: '#fff' }}>
                  {fabric}
                  <button 
                    type="button" 
                    style={{ background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', fontSize: '1rem', marginLeft: '4px', display: 'flex', alignItems: 'center' }}
                    onClick={() => {
                      const arr = availableFabrics.split(',').map(c => c.trim()).filter(Boolean);
                      arr.splice(idx, 1);
                      setAvailableFabrics(arr.join(', '));
                    }}
                  >&times;</button>
                </div>
              ))}
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <button 
              type="submit" 
              disabled={isSaving}
              style={{ 
                backgroundColor: '#c9a15a', 
                color: '#111', 
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

      <div style={{ backgroundColor: 'rgba(30, 15, 20, 0.6)', padding: '2rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', maxWidth: '600px', marginTop: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}>
          <Settings size={24} style={{ color: '#c9a15a' }} />
          <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 500, color: '#f7f4ee' }}>About Us Configuration</h2>
        </div>
        
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ color: 'rgba(245, 239, 230, 0.8)', fontSize: '0.9rem' }}>Hero Title</label>
            <textarea 
              value={aboutUsData.heroTitle}
              onChange={(e) => setAboutUsData({...aboutUsData, heroTitle: e.target.value})}
              style={{ width: '100%', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '6px', color: '#fff', minHeight: '80px' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ color: 'rgba(245, 239, 230, 0.8)', fontSize: '0.9rem' }}>Hero Text</label>
            <textarea 
              value={aboutUsData.heroText}
              onChange={(e) => setAboutUsData({...aboutUsData, heroText: e.target.value})}
              style={{ width: '100%', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '6px', color: '#fff', minHeight: '120px' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ color: 'rgba(245, 239, 230, 0.8)', fontSize: '0.9rem' }}>Hero Image</label>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <input 
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    processImageFile(file, (base64) => {
                      setAboutUsData({...aboutUsData, heroImage: base64});
                    });
                  }
                }}
                style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem', borderRadius: '6px', color: '#fff' }}
              />
              {aboutUsData.heroImage && (
                <img src={aboutUsData.heroImage} alt="Hero Preview" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
              )}
            </div>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', margin: 0 }}>Or paste URL:</p>
            <input 
              type="text"
              value={aboutUsData.heroImage}
              onChange={(e) => setAboutUsData({...aboutUsData, heroImage: e.target.value})}
              placeholder="https://..."
              style={{ width: '100%', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem', borderRadius: '6px', color: '#fff' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ color: 'rgba(245, 239, 230, 0.8)', fontSize: '0.9rem' }}>Story Title</label>
            <textarea 
              value={aboutUsData.storyTitle}
              onChange={(e) => setAboutUsData({...aboutUsData, storyTitle: e.target.value})}
              style={{ width: '100%', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '6px', color: '#fff', minHeight: '80px' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ color: 'rgba(245, 239, 230, 0.8)', fontSize: '0.9rem' }}>Story Text</label>
            <textarea 
              value={aboutUsData.storyText}
              onChange={(e) => setAboutUsData({...aboutUsData, storyText: e.target.value})}
              style={{ width: '100%', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '6px', color: '#fff', minHeight: '120px' }}
            />
          </div>

          <div style={{ marginTop: '1rem' }}>
            <h3 style={{ fontSize: '1rem', color: '#c9a15a', marginBottom: '1rem' }}>Media Cards (Video/Images)</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {aboutUsData.cards.map((card, idx) => (
                <div key={idx} style={{ padding: '1rem', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', backgroundColor: 'rgba(0,0,0,0.2)' }}>
                  <label style={{ color: 'rgba(245, 239, 230, 0.8)', fontSize: '0.8rem', display: 'block', marginBottom: '0.5rem' }}>Card {idx + 1} Title</label>
                  <input 
                    type="text" 
                    value={card.title}
                    onChange={(e) => {
                      const newCards = [...aboutUsData.cards];
                      newCards[idx].title = e.target.value;
                      setAboutUsData({...aboutUsData, cards: newCards});
                    }}
                    style={{ width: '100%', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.5rem', borderRadius: '4px', color: '#fff', marginBottom: '1rem' }}
                  />
                  <label style={{ color: 'rgba(245, 239, 230, 0.8)', fontSize: '0.8rem', display: 'block', marginBottom: '0.5rem' }}>Card {idx + 1} Text</label>
                  <input 
                    type="text" 
                    value={card.text}
                    onChange={(e) => {
                      const newCards = [...aboutUsData.cards];
                      newCards[idx].text = e.target.value;
                      setAboutUsData({...aboutUsData, cards: newCards});
                    }}
                    style={{ width: '100%', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.5rem', borderRadius: '4px', color: '#fff', marginBottom: '1rem' }}
                  />
                  <label style={{ color: 'rgba(245, 239, 230, 0.8)', fontSize: '0.8rem', display: 'block', marginBottom: '0.5rem' }}>Card {idx + 1} Image / Video Cover</label>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                    <input 
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          processImageFile(file, (base64) => {
                            const newCards = [...aboutUsData.cards];
                            newCards[idx].image = base64;
                            setAboutUsData({...aboutUsData, cards: newCards});
                          });
                        }
                      }}
                      style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.5rem', borderRadius: '4px', color: '#fff', fontSize: '0.8rem' }}
                    />
                    {card.image && (
                      <img src={card.image} alt="Preview" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                    )}
                  </div>
                  <input 
                    type="text" 
                    value={card.image}
                    onChange={(e) => {
                      const newCards = [...aboutUsData.cards];
                      newCards[idx].image = e.target.value;
                      setAboutUsData({...aboutUsData, cards: newCards});
                    }}
                    placeholder="Or paste URL (https://...)"
                    style={{ width: '100%', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.5rem', borderRadius: '4px', color: '#fff' }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <button type="submit" disabled={isSaving} style={{ backgroundColor: '#c9a15a', color: '#111', border: 'none', padding: '0.75rem 2rem', borderRadius: '6px', fontWeight: 600, cursor: isSaving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Save size={18} /> {isSaving ? "Saving..." : "Save Settings"}
            </button>
            {saveSuccess && <span style={{ color: '#4caf50', fontSize: '0.9rem' }}>Settings saved successfully!</span>}
          </div>
        </form>
      </div>

    </div>
  );
}
