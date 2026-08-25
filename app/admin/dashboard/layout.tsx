"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LogOut, LayoutDashboard, Package, Settings, Users } from "lucide-react";
import styles from "./layout.module.css";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const auth = localStorage.getItem("adminAuth");
    if (auth !== "true") {
      router.push("/admin");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    router.push("/admin");
  };

  if (!isAuthenticated) return null; // Or a loading spinner

  return (
    <div className={styles.adminContainer}>
      {/* Sidebar Navigation */}
      <aside className={styles.sidebar}>
        <div className={styles.logoArea}>
          <div className={styles.logoCircle}></div>
          <div className={styles.logoText}>
            <span className={styles.logoHouse}>HOUSE OF</span>
            <span className={styles.logoShri}>SHRI</span>
          </div>
        </div>

        <nav className={styles.navMenu}>
          <Link 
            href="/admin/dashboard" 
            className={`${styles.navItem} ${pathname === "/admin/dashboard" ? styles.active : ""}`}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
          <Link 
            href="/admin/dashboard/products" 
            className={`${styles.navItem} ${pathname.startsWith("/admin/dashboard/products") ? styles.active : ""}`}
          >
            <Package size={20} />
            <span>Products</span>
          </Link>
          <Link 
            href="/admin/dashboard/categories" 
            className={`${styles.navItem} ${pathname.startsWith("/admin/dashboard/categories") ? styles.active : ""}`}
          >
            <Package size={20} />
            <span>Categories</span>
          </Link>
          <Link 
            href="/admin/dashboard/inquiries" 
            className={`${styles.navItem} ${pathname.startsWith("/admin/dashboard/inquiries") ? styles.active : ""}`}
          >
            <Users size={20} />
            <span>Inquiries</span>
          </Link>
          <Link 
            href="/admin/dashboard/settings" 
            className={`${styles.navItem} ${pathname.startsWith("/admin/dashboard/settings") ? styles.active : ""}`}
          >
            <Settings size={20} />
            <span>Settings</span>
          </Link>
        </nav>

        <button onClick={handleLogout} className={styles.logoutBtn}>
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </aside>

      {/* Main Content Area */}
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
