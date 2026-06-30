import useRecipeStore from '../store/useRecipeStore'
import RecipeCard from '../components/RecipeCard'
import styles from '../module/Home.module.css'

const CATEGORIES = ['All', 'Pasta', 'Mains', 'Salads', 'Desserts', 'Breakfast']

export default function Home() {
  const { search, setSearch, category, setCategory, getFiltered } = useRecipeStore()
  const filtered = getFiltered()

  return (
    <div>
      {/* Hero */}
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Cook. Share. Inspire.</h1>
        <p className={styles.heroSub}>Discover recipes from home cooks around the world</p>
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Search recipes, cuisines, ingredients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button>Search</button>
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
          <span className={styles.count}> ({filtered.length})</span>
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