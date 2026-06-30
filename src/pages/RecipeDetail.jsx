import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useRecipeStore from '../store/useRecipeStore'
import styles from '../module/Recipedetail.module.css'

export default function RecipeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { recipes, toggleLike, isLiked } = useRecipeStore()
  const [imgError, setImgError] = useState(false)

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

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <button className={styles.backBtn} onClick={() => navigate('/')}>
          ← Back to recipes
        </button>

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
        </div>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.tags}>
            {recipe.tags.map((t) => (
              <span key={t} className={styles.tag}>{t}</span>
            ))}
          </div>
          <h1 className={styles.title}>{recipe.title}</h1>
          <div className={styles.meta}>
            <span>⏱ {recipe.time} min</span>
            <span>👥 {recipe.servings} servings</span>
            <span>📊 {recipe.difficulty}</span>
            <span>👤 {recipe.author}</span>
          </div>
          <button
            className={`${styles.likeBtn} ${liked ? styles.liked : ''}`}
            onClick={() => toggleLike(recipe.id)}
          >
            {liked ? '❤️' : '🤍'} {recipe.likes + (liked ? 1 : 0)} likes
          </button>
        </div>

        {/* Body */}
        <div className={styles.body}>
          {/* Ingredients */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Ingredients</h2>
            <ul className={styles.ingredientList}>
              {recipe.ingredients.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

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