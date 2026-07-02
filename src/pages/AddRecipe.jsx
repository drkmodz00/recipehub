import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useRecipeStore from '../store/useRecipeStore'
import styles from '../module/Addrecipe.module.css'

const DIFFICULTIES = ['Easy', 'Medium', 'Hard']
const CATEGORIES = ['Pasta', 'Mains', 'Salads', 'Desserts', 'Breakfast']

const empty = {
  image: '', title: '', author: '', time: '', servings: '',
  difficulty: 'Easy', category: 'Mains', tags: '', ingredients: '', steps: '',
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

  const ingredientCount = form.ingredients.split('\n').map((l) => l.trim()).filter(Boolean).length
  const stepCount = form.steps.split('\n').map((l) => l.trim()).filter(Boolean).length

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <button className={styles.backBtn} onClick={() => navigate('/')}>
          ← Back to browse
        </button>

        <div className={styles.pageHead}>
          <span className={styles.eyebrow}>New recipe</span>
          <h1 className={styles.heading}>Share Your Culinary Masterpiece</h1>
          <p className={styles.subheading}>Fields marked with an asterisk (*) are required</p>
        </div>

        <div className={styles.form}>
          {/* 01 — Basics */}
          <div className={styles.card}>
            <div className={styles.sectionHead}>
              <span className={styles.sectionNum}>01</span>
              <div>
                <h2 className={styles.sectionTitle}>The Basics</h2>
                <p className={styles.sectionSub}>What is it, and who made it?</p>
              </div>
            </div>
            
            <div className={styles.sectionBody}>
              <div className={styles.photoRow}>
                <div className={styles.photoFrame}>
                  {form.image ? (
                    <img
                      src={form.image}
                      alt="Preview"
                      onError={(e) => { e.target.style.display = 'none' }}
                      onLoad={(e) => { e.target.style.display = 'block' }}
                    />
                  ) : (
                    <span className={styles.photoPlaceholder}>🍽️</span>
                  )}
                </div>
                <div className={styles.group}>
                  <label>Image URL <span className={styles.hint}>(paste a link to a photo)</span></label>
                  <input
                    type="text"
                    placeholder="https://example.com/my-dish.jpg"
                    value={form.image}
                    onChange={set('image')}
                  />
                </div>
              </div>

              <div className={styles.grid2}>
                <div className={styles.group}>
                  <label>Recipe title *</label>
                  <input
                    type="text"
                    placeholder="e.g. Creamy Mushroom Risotto"
                    value={form.title}
                    onChange={set('title')}
                    className={errors.title ? styles.inputError : ''}
                  />
                  {errors.title && <span className={styles.error}>{errors.title}</span>}
                </div>

                <div className={styles.group}>
                  <label>Your name</label>
                  <input type="text" placeholder="e.g. Alex Chen" value={form.author} onChange={set('author')} />
                </div>
              </div>
            </div>
          </div>

          {/* 02 — Details */}
          <div className={styles.card}>
            <div className={styles.sectionHead}>
              <span className={styles.sectionNum}>02</span>
              <div>
                <h2 className={styles.sectionTitle}>Details</h2>
                <p className={styles.sectionSub}>Time, servings, and categories</p>
              </div>
            </div>
            <div className={styles.sectionBody}>
              <div className={styles.grid3}>
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
              
              <div className={styles.grid2}>
                <div className={styles.group}>
                  <label>Category</label>
                  <select value={form.category} onChange={set('category')}>
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className={styles.group}>
                  <label>Tags <span className={styles.hint}>(comma-separated)</span></label>
                  <input type="text" placeholder="Italian, Pasta, Quick" value={form.tags} onChange={set('tags')} />
                </div>
              </div>
            </div>
          </div>

          {/* 03 — Ingredients */}
          <div className={styles.card}>
            <div className={styles.sectionHead}>
              <span className={styles.sectionNum}>03</span>
              <div>
                <h2 className={styles.sectionTitle}>Ingredients</h2>
                <p className={styles.sectionSub}>Type or paste your ingredients (one per line)</p>
              </div>
              {ingredientCount > 0 && <span className={styles.liveCount}>{ingredientCount} listed</span>}
            </div>
            <div className={styles.sectionBody}>
              <div className={styles.group}>
                <textarea
                  rows={6}
                  placeholder={'400g pasta\n2 cloves garlic\n100ml olive oil'}
                  value={form.ingredients}
                  onChange={set('ingredients')}
                  className={errors.ingredients ? styles.inputError : ''}
                />
                {errors.ingredients && <span className={styles.error}>{errors.ingredients}</span>}
              </div>
            </div>
          </div>

          {/* 04 — Steps */}
          <div className={styles.card}>
            <div className={styles.sectionHead}>
              <span className={styles.sectionNum}>04</span>
              <div>
                <h2 className={styles.sectionTitle}>Instructions</h2>
                <p className={styles.sectionSub}>Describe the process step-by-step (one per line)</p>
              </div>
              {stepCount > 0 && <span className={styles.liveCount}>{stepCount} steps</span>}
            </div>
            <div className={styles.sectionBody}>
              <div className={styles.group}>
                <textarea
                  rows={7}
                  placeholder={'Boil a large pot of salted water...\nSauté garlic in olive oil...'}
                  value={form.steps}
                  onChange={set('steps')}
                  className={errors.steps ? styles.inputError : ''}
                />
                {errors.steps && <span className={styles.error}>{errors.steps}</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky submit bar */}
      <div className={styles.submitBar}>
        <div className={styles.submitBarInner}>
          <p className={styles.submitHint}>Double-check everything before publishing!</p>
          <button className={styles.submitBtn} onClick={handleSubmit}>
            Publish Recipe 🍽️
          </button>
        </div>
      </div>
    </div>
  )
}