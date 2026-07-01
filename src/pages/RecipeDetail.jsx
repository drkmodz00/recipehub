import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useRecipeStore from '../store/useRecipeStore'
import styles from '../module/Recipedetail.module.css'

export default function RecipeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { recipes, toggleLike, isLiked } = useRecipeStore()
  const [imgError, setImgError] = useState(false)
  const [checked, setChecked] = useState({})

  const recipe = recipes.find((r) => r.id === Number(id))
  const liked = recipe ? isLiked(recipe.id) : false

  if (!recipe) {
    return (
      <div className={styles.notFound}>
        <span>😕</span>
        <p>Recipe not found.</p>
        <button onClick={() => navigate('/')}>Go back home</button>
      </div>
    )
  }

  const showImage = recipe.image && !imgError

  const toggleCheck = (i) => {
    setChecked((prev) => ({ ...prev, [i]: !prev[i] }))
  }

  return (
    <div className={styles.page}>
      {/* Hero */}
      <div className={styles.hero}>
        {showImage ? (
          <img
            src={recipe.image}
            alt={recipe.title}
            className={styles.heroImage}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className={styles.heroFallback}>🍽️</div>
        )}
        <div className={styles.heroScrim} />

        <button className={styles.backBtn} onClick={() => navigate('/')}>
          ← Back to recipes
        </button>

        <div className={styles.heroOverlay}>
          <div className={styles.tags}>
            {recipe.tags.map((t) => (
              <span key={t} className={styles.tag}>{t}</span>
            ))}
          </div>
          <h1 className={styles.title}>{recipe.title}</h1>
        </div>
      </div>

      <div className={styles.container}>
        {/* Stat bar + like */}
        <div className={styles.statBar}>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statIcon}>⏱</span>
              <div>
                <p className={styles.statValue}>{recipe.time} min</p>
                <p className={styles.statLabel}>Cook time</p>
              </div>
            </div>
            <div className={styles.stat}>
              <span className={styles.statIcon}>👥</span>
              <div>
                <p className={styles.statValue}>{recipe.servings}</p>
                <p className={styles.statLabel}>Servings</p>
              </div>
            </div>
            <div className={styles.stat}>
              <span className={styles.statIcon}>📊</span>
              <div>
                <p className={styles.statValue}>{recipe.difficulty}</p>
                <p className={styles.statLabel}>Difficulty</p>
              </div>
            </div>
            <div className={styles.stat}>
              <span className={styles.statIcon}>👤</span>
              <div>
                <p className={styles.statValue}>{recipe.author}</p>
                <p className={styles.statLabel}>Author</p>
              </div>
            </div>
          </div>

          <button
            className={`${styles.likeBtn} ${liked ? styles.liked : ''}`}
            onClick={() => toggleLike(recipe.id)}
          >
            {liked ? '❤️' : '🤍'} {recipe.likes + (liked ? 1 : 0)}
          </button>
        </div>

        {/* Body */}
        <div className={styles.body}>
          {/* Ingredients — sticky sidebar, checkable */}
          <aside className={styles.section}>
            <h2 className={styles.sectionTitle}>
              Ingredients
              <span className={styles.sectionCount}>{recipe.ingredients.length}</span>
            </h2>
            <ul className={styles.ingredientList}>
              {recipe.ingredients.map((item, i) => (
                <li
                  key={i}
                  className={checked[i] ? styles.checkedItem : ''}
                  onClick={() => toggleCheck(i)}
                >
                  <span className={`${styles.checkbox} ${checked[i] ? styles.checkboxOn : ''}`}>
                    {checked[i] ? '✓' : ''}
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </aside>

          {/* Steps */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Instructions</h2>
            <ol className={styles.stepList}>
              {recipe.steps.map((step, i) => (
                <li key={i}>
                  <span className={styles.stepNum}>{i + 1}</span>
                  <p>{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}