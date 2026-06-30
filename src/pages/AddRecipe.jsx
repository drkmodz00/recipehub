import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useRecipeStore from '../store/useRecipeStore'
import styles from '../module/AddRecipe.module.css'

const DIFFICULTIES = ['Easy', 'Medium', 'Hard']
const CATEGORIES = ['Pasta', 'Mains', 'Salads', 'Desserts', 'Breakfast']

const empty = {
  image: '',
  title: '',
  author: '',
  time: '',
  servings: '',
  difficulty: 'Easy',
  category: 'Mains',
  tags: '',
  ingredients: '',
  steps: '',
}

export default function AddRecipe() {
  const [form, setForm] = useState(empty)
  const [errors, setErrors] = useState({})
  const { addRecipe } = useRecipeStore()
  const navigate = useNavigate()

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const validate = () => {
    const e = {}
    if (!form.title.trim()) e.title = 'Title is required'
    if (!form.ingredients.trim()) e.ingredients = 'Add at least one ingredient'
    if (!form.steps.trim()) e.steps = 'Add at least one step'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    const id = addRecipe({
      image: form.image.trim(),
      title: form.title.trim(),
      author: form.author.trim() || 'Anonymous',
      time: parseInt(form.time) || 30,
      servings: parseInt(form.servings) || 4,
      difficulty: form.difficulty,
      category: form.category,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      ingredients: form.ingredients.split('\n').map((l) => l.trim()).filter(Boolean),
      steps: form.steps.split('\n').map((l) => l.trim()).filter(Boolean),
    })
    navigate(`/recipe/${id}`)
  }

  return (
    <div className={styles.page}>
      <button className={styles.backBtn} onClick={() => navigate('/')}>
        ← Back to browse
      </button>
      <h1 className={styles.heading}>Share a Recipe</h1>

      <div className={styles.form}>
        {/* Image + Title */}
        <div className={styles.group}>
          <label>Image URL <span className={styles.hint}>(paste a link to a photo)</span></label>
          <input
            type="text"
            placeholder="https://example.com/my-dish.jpg"
            value={form.image}
            onChange={set('image')}
          />
          {form.image && (
            <div className={styles.preview}>
              <img
                src={form.image}
                alt="Preview"
                onError={(e) => { e.target.style.display = 'none' }}
                onLoad={(e) => { e.target.style.display = 'block' }}
              />
            </div>
          )}
        </div>

        <div className={styles.group}>
          <label>Recipe title *</label>
          <input
            type="text"
            placeholder="e.g. Creamy Mushroom Risotto"
            value={form.title}
            onChange={set('title')}
          />
          {errors.title && <span className={styles.error}>{errors.title}</span>}
        </div>

        {/* Author */}
        <div className={styles.group}>
          <label>Your name</label>
          <input type="text" placeholder="e.g. Alex Chen" value={form.author} onChange={set('author')} />
        </div>

        {/* Time, Servings, Difficulty */}
        <div className={styles.row}>
          <div className={styles.group}>
            <label>Time (minutes)</label>
            <input type="number" placeholder="30" value={form.time} onChange={set('time')} min={1} />
          </div>
          <div className={styles.group}>
            <label>Servings</label>
            <input type="number" placeholder="4" value={form.servings} onChange={set('servings')} min={1} />
          </div>
          <div className={styles.group}>
            <label>Difficulty</label>
            <select value={form.difficulty} onChange={set('difficulty')}>
              {DIFFICULTIES.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
        </div>

        {/* Category + Tags */}
        <div className={styles.row}>
          <div className={styles.group}>
            <label>Category</label>
            <select value={form.category} onChange={set('category')}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className={`${styles.group} ${styles.grow}`}>
            <label>Tags (comma-separated)</label>
            <input type="text" placeholder="Italian, Pasta, Quick" value={form.tags} onChange={set('tags')} />
          </div>
        </div>

        {/* Ingredients */}
        <div className={styles.group}>
          <label>Ingredients * <span className={styles.hint}>(one per line)</span></label>
          <textarea
            rows={6}
            placeholder={'400g pasta\n2 cloves garlic\n100ml olive oil'}
            value={form.ingredients}
            onChange={set('ingredients')}
          />
          {errors.ingredients && <span className={styles.error}>{errors.ingredients}</span>}
        </div>

        {/* Steps */}
        <div className={styles.group}>
          <label>Steps * <span className={styles.hint}>(one per line)</span></label>
          <textarea
            rows={7}
            placeholder={'Boil a large pot of salted water...\nSauté garlic in olive oil...'}
            value={form.steps}
            onChange={set('steps')}
          />
          {errors.steps && <span className={styles.error}>{errors.steps}</span>}
        </div>

        <button className={styles.submitBtn} onClick={handleSubmit}>
          Publish Recipe 🍽️
        </button>
      </div>
    </div>
  )
}