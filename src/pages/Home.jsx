import { useState, useEffect } from 'react'
import useRecipeStore from '../store/useRecipeStore'
import RecipeCard from '../components/RecipeCard'
import styles from '../module/Home.module.css'

const CATEGORIES = ['All', 'Pasta', 'Mains', 'Salads', 'Desserts', 'Breakfast']

const SLIDES = [
  {
    url: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1600&auto=format&fit=crop',
    alt: 'Fresh pasta being plated',
  },
  {
    url: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1600&auto=format&fit=crop',
    alt: 'Colorful salad bowl',
  },
  {
    url: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?q=80&w=1600&auto=format&fit=crop',
    alt: 'Breakfast spread on a table',
  },
  {
    url: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=1600&auto=format&fit=crop',
    alt: 'Dessert close up',
  },
]

export default function Home() {
  const { search, setSearch, category, setCategory, getFiltered } = useRecipeStore()
  const filtered = getFiltered()
  const [slide, setSlide] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setSlide((s) => (s + 1) % SLIDES.length)
    }, 6000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className={styles.page}>
      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.slideshow}>
          {SLIDES.map((s, i) => (
            <div
              key={s.url}
              className={`${styles.slide} ${i === slide ? styles.slideActive : ''}`}
              style={{ backgroundImage: `url(${s.url})` }}
              role="img"
              aria-label={s.alt}
            />
          ))}
          <div className={styles.heroScrim} />
        </div>

        <div className={styles.heroContent}>
          <span className={styles.eyebrow}>A home cooking community</span>
          <h1 className={styles.heroTitle}>Cook. Share. Inspire.</h1>
          <p className={styles.heroSub}>Discover recipes from home cooks around the world</p>
        </div>

        <button
          className={styles.heroDots}
          aria-hidden="true"
          tabIndex={-1}
        >
          {SLIDES.map((s, i) => (
            <span
              key={s.url}
              className={`${styles.dot} ${i === slide ? styles.dotActive : ''}`}
              onClick={(e) => { e.stopPropagation(); setSlide(i) }}
            />
          ))}
        </button>

        {/* Floating search card — overlaps hero/content seam */}
        <div className={styles.searchCard}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search recipes, cuisines, ingredients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className={styles.searchButton}>Search</button>
        </div>
      </div>

      {/* Category filters */}
      <div className={styles.filters}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`${styles.chip} ${category === cat ? styles.active : ''}`}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Recipe grid */}
      <div className={styles.content}>
        <h2 className={styles.sectionTitle}>
          {category === 'All' ? 'All Recipes' : category}
          <span className={styles.count}>{filtered.length}</span>
        </h2>

        {filtered.length === 0 ? (
          <div className={styles.empty}>
            <span>🔍</span>
            <p>No recipes found. Try a different search!</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {filtered.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}