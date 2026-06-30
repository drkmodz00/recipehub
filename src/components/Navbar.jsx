import { Link, useLocation } from 'react-router-dom'
import styles from '../module/Navbar.module.css'

export default function Navbar() {
  const { pathname } = useLocation()

  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.logo}>
        🍴 RecipeHub
      </Link>
      <div className={styles.links}>
        <Link to="/" className={pathname === '/' ? styles.active : ''}>
          Browse
        </Link>
        <Link
          to="/add-recipe"
          className={`${styles.addBtn} ${
            pathname === "/add-recipe" ? styles.active : ""
          }`}
        >
          + Add Recipe
        </Link>
      </div>
    </nav>
  )
}