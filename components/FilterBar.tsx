import styles from "./FilterBar.module.css";
import { Filter } from "lucide-react";

interface FilterBarProps {
  categories: { id: string; name: string }[];
  priceBuckets: string[];
  selectedCategory: string | null;
  selectedPriceBucket: string | null;
  onSelectCategory: (id: string | null) => void;
  onSelectPriceBucket: (bucket: string | null) => void;
}

export default function FilterBar({
  categories,
  priceBuckets,
  selectedCategory,
  selectedPriceBucket,
  onSelectCategory,
  onSelectPriceBucket,
}: FilterBarProps) {
  return (
    <div className={styles.filterContainer}>
      <div className={styles.header}>
        <Filter size={18} />
        <h3>Filters</h3>
      </div>
      
      <div className={styles.filterGroup}>
        <h4>Categories</h4>
        <button 
          className={`${styles.filterBtn} ${selectedCategory === null ? styles.active : ""}`}
          onClick={() => onSelectCategory(null)}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`${styles.filterBtn} ${selectedCategory === cat.id ? styles.active : ""}`}
            onClick={() => onSelectCategory(cat.id)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className={styles.filterGroup}>
        <h4>Price Range</h4>
        <button 
          className={`${styles.filterBtn} ${selectedPriceBucket === null ? styles.active : ""}`}
          onClick={() => onSelectPriceBucket(null)}
        >
          All
        </button>
        {priceBuckets.map((bucket) => (
          <button
            key={bucket}
            className={`${styles.filterBtn} ${selectedPriceBucket === bucket ? styles.active : ""}`}
            onClick={() => onSelectPriceBucket(bucket)}
          >
            {bucket}
          </button>
        ))}
      </div>
    </div>
  );
}
