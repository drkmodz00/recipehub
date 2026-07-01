import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useRecipeStore from '../store/useRecipeStore'
import styles from '../module/Recipecard.module.css'

export default function RecipeCard({ recipe }) {
  const navigate = useNavigate()
  const { toggleLike, isLiked } = useRecipeStore()
  const liked = isLiked(recipe.id)
  const [imgError, setImgError] = useState(false)

  const handleLike = (e) => {
    e.stopPropagation()
    toggleLike(recipe.id)
  }

  const showImage = recipe.image && !imgError

  return (
    <div className={styles.card} onClick={() => navigate(`/recipe/${recipe.id}`)}>
      <div className={styles.imageWrap}>
        {showImage ? (
          <img
            src={recipe.image}
            alt={recipe.title}
            className={styles.image}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className={styles.imageFallback}>🍽️</div>
        )}
        <span className={styles.difficultyBadge}>{recipe.difficulty}</span>
      </div>
      <div className={styles.body}>
        <div className={styles.tags}>
          {recipe.tags.slice(0, 2).map((t) => (
            <span key={t} className={styles.tag}>{t}</span>
          ))}
        </div>
        <h3 className={styles.title}>{recipe.title}</h3>
        <div className={styles.meta}>
          <span>⏱ {recipe.time}m</span>
          <span>👥 {recipe.servings}</span>
        </div>
        <div className={styles.footer}>
          <span className={styles.author}>by {recipe.author}</span>
          <button className={styles.likeBtn} onClick={handleLike}>
            {liked ? '❤️' : '🤍'} {recipe.likes + (liked ? 1 : 0)}
          </button>
        </div>
      </div>
    </div>
  )
}