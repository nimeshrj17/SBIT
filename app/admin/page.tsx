"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { Lock } from "lucide-react";

export default function AdminLogin() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const router = useRouter();

  // Check if already authenticated
  useEffect(() => {
    const auth = localStorage.getItem("adminAuth");
    if (auth === "true") {
      router.push("/admin/dashboard");
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Using a simple hardcoded PIN for the MVP
    if (pin === "1234") {
      localStorage.setItem("adminAuth", "true");
      router.push("/admin/dashboard");
    } else {
      setError(true);
      setPin("");
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <div className={styles.logo}>
          <div className={styles.logoCircle}></div>
          <div className={styles.logoText}>
            <span className={styles.logoHouse}>&mdash; HOUSE OF &mdash;</span>
            <span className={styles.logoShri}>SHRI</span>
          </div>
        </div>
        
        <h1 className={styles.title}>Admin Panel</h1>
        <p className={styles.subtitle}>Enter your secure PIN to access the dashboard.</p>
        
        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.inputWrapper}>
            <Lock size={18} className={styles.icon} />
            <input 
              type="password" 
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                setError(false);
              }}
              placeholder="Enter PIN (1234)" 
              className={styles.input}
              autoFocus
            />
          </div>
          {error && <p className={styles.errorText}>Incorrect PIN. Please try again.</p>}
          
          <button type="submit" className={styles.submitBtn}>
            Unlock Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}
