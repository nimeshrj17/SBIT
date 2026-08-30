import { db } from "./firebase";
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  orderBy,
  getDoc,
  setDoc
} from "firebase/firestore";

// --- PRODUCT TYPES & SERVICES ---
export interface Product {
  id?: string;
  productCode?: string;
  title: string;
  price: number;
  image: string;
  images?: string[];
  categories: string[];
  fabric?: string;
  isNew: boolean;
  isPopular?: boolean;
  isBestSeller?: boolean;
  colors: string[];
  extraColorsCount: number;
  createdAt?: number;
}

const COLLECTION_NAME = "products";
let mockProducts: Product[] = [
  {
    id: "mock1",
    productCode: "BR-1001",
    title: "Royal Maroon Bridal Lehenga",
    price: 18500,
    image: "/collections/bridal.jpg",
    categories: ["bridal", "high-range"],
    fabric: "Silk",
    isNew: true,
    isPopular: true,
    isBestSeller: false,
    colors: ["#5e1b20", "#c23a2a"],
    extraColorsCount: 0,
    createdAt: Date.now()
  },
  {
    id: "mock2",
    productCode: "PW-2001",
    title: "Pastel Pink Party Wear Lehenga",
    price: 8500,
    image: "/collections/fusion.jpg",
    categories: ["party-wear", "mid-range"],
    fabric: "Georgette",
    isNew: false,
    isPopular: false,
    isBestSeller: true,
    colors: ["#ffc0cb", "#ffd1dc"],
    extraColorsCount: 0,
    createdAt: Date.now() - 1000
  }
];

const hasRealDb = () => db && typeof db.type !== 'undefined' || db.app;

const withTimeout = <T>(promise: Promise<T>, ms: number = 5000): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error("Firebase connection timeout. Is the database created?")), ms))
  ]);
};

export const getProducts = async (): Promise<Product[]> => {
  if (!hasRealDb()) return [...mockProducts];
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
    const querySnapshot = await withTimeout(getDocs(q));
    return querySnapshot.docs.map(d => ({ id: d.id, ...d.data() } as Product));
  } catch (error) {
    console.warn("Error fetching products with orderBy, trying fallback:", error);
    try {
      const querySnapshot = await withTimeout(getDocs(collection(db, COLLECTION_NAME)));
      return querySnapshot.docs.map(d => ({ id: d.id, ...d.data() } as Product));
    } catch (e) {
      console.error("Error fetching products:", e);
      return [];
    }
  }
};

export const addProduct = async (product: Omit<Product, "id">): Promise<string> => {
  const newProduct = { ...product, createdAt: Date.now() };
  if (!hasRealDb()) {
    const id = `mock_${Date.now()}`;
    mockProducts = [{ id, ...newProduct }, ...mockProducts];
    return id;
  }
  const docRef = await addDoc(collection(db, COLLECTION_NAME), newProduct);
  return docRef.id;
};

export const getProduct = async (id: string): Promise<Product | null> => {
  if (!hasRealDb()) {
    return mockProducts.find(p => p.id === id) || null;
  }
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Product;
    }
    return null;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
};

export const updateProduct = async (id: string, updates: Partial<Product>): Promise<void> => {
  if (!hasRealDb()) {
    mockProducts = mockProducts.map(p => p.id === id ? { ...p, ...updates } : p);
    return;
  }
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, updates);
};

export const deleteProduct = async (id: string): Promise<void> => {
  if (!hasRealDb()) {
    mockProducts = mockProducts.filter(p => p.id !== id);
    return;
  }
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
};

// --- CATEGORY TYPES & SERVICES ---
export interface Category {
  id?: string;
  name: string;
  slug: string;
  image?: string;
  createdAt?: number;
}

const CATEGORIES_COLLECTION = "categories";
let mockCategories: Category[] = [
  { id: "c1", name: "Bridal Lehengas", slug: "bridal", image: "/collections/bridal.jpg", createdAt: Date.now() },
  { id: "c2", name: "Party Wear Lehengas", slug: "party-wear", image: "/collections/fusion.jpg", createdAt: Date.now() - 100 },
  { id: "c3", name: "Haldi Lehengas", slug: "haldi", image: "/collections/suits.jpg", createdAt: Date.now() - 200 },
  { id: "c4", name: "Low Range Lehengas", slug: "low-range", image: "/collections/fabrics.jpg", createdAt: Date.now() - 300 },
  { id: "c5", name: "Mid Range Lehengas", slug: "mid-range", image: "/collections/saree.jpg", createdAt: Date.now() - 400 },
  { id: "c6", name: "High Range Lehengas", slug: "high-range", image: "/collections/bridal_cat.jpg", createdAt: Date.now() - 500 },
];

export const getCategories = async (): Promise<Category[]> => {
  if (!hasRealDb()) return [...mockCategories];
  try {
    const q = query(collection(db, CATEGORIES_COLLECTION), orderBy("createdAt", "asc"));
    const querySnapshot = await withTimeout(getDocs(q));
    return querySnapshot.docs.map(d => ({ id: d.id, ...d.data() } as Category));
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

export const addCategory = async (category: Omit<Category, "id">): Promise<string> => {
  const newCat = { ...category, createdAt: Date.now() };
  if (!hasRealDb()) {
    const id = `mock_cat_${Date.now()}`;
    mockCategories = [...mockCategories, { id, ...newCat }];
    return id;
  }
  const docRef = await addDoc(collection(db, CATEGORIES_COLLECTION), newCat);
  return docRef.id;
};

export const updateCategory = async (id: string, updates: Partial<Category>): Promise<void> => {
  if (!hasRealDb()) {
    mockCategories = mockCategories.map(c => c.id === id ? { ...c, ...updates } : c);
    return;
  }
  const docRef = doc(db, CATEGORIES_COLLECTION, id);
  await updateDoc(docRef, updates);
};

export const deleteCategory = async (id: string): Promise<void> => {
  if (!hasRealDb()) {
    mockCategories = mockCategories.filter(c => c.id !== id);
    return;
  }
  const docRef = doc(db, CATEGORIES_COLLECTION, id);
  await deleteDoc(docRef);
};

// --- SETTINGS SERVICES ---
const SETTINGS_COLLECTION = "settings";
let mockSettings: Record<string, string> = {
  "whatsappNumber": "+911234567890",
  "storeEmail": "contact@houseofshri.com",
  "storeAddress": "Surat, Gujarat, India"
};

export const getSetting = async (key: string): Promise<string | null> => {
  if (!hasRealDb()) {
    // Check local storage for browser persistence in mock mode
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(`setting_${key}`);
      if (stored) return stored;
    }
    return mockSettings[key] || null;
  }
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, key);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().value;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching setting ${key}:`, error);
    return null;
  }
};

export const setSetting = async (key: string, value: string): Promise<void> => {
  if (!hasRealDb()) {
    mockSettings[key] = value;
    if (typeof window !== "undefined") {
      localStorage.setItem(`setting_${key}`, value);
    }
    return;
  }
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, key);
    await setDoc(docRef, { value });
  } catch (error) {
    console.error(`Error setting ${key}:`, error);
    throw error;
  }
};
