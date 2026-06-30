import { create } from 'zustand'
import sampleRecipes from '../data/sampleRecipes'

// Load persisted data from localStorage
const loadRecipes = () => {
  try {
    const saved = localStorage.getItem('rh_recipes')
    return saved ? JSON.parse(saved) : sampleRecipes
  } catch {
    return sampleRecipes
  }
}

const loadLiked = () => {
  try {
    const saved = localStorage.getItem('rh_liked')
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

const useRecipeStore = create((set, get) => ({
  // ── State ──
  recipes: loadRecipes(),
  liked: loadLiked(),
  search: '',
  category: 'All',

  // ── Actions ──
  setSearch: (search) => set({ search }),
  setCategory: (category) => set({ category }),

  addRecipe: (recipe) => {
    const newRecipe = {
      ...recipe,
      id: Date.now(),
      likes: 0,
    }
    const updated = [newRecipe, ...get().recipes]
    localStorage.setItem('rh_recipes', JSON.stringify(updated))
    set({ recipes: updated })
    return newRecipe.id
  },

  toggleLike: (id) => {
    const liked = [...get().liked]
    const index = liked.indexOf(id)
    if (index > -1) {
      liked.splice(index, 1)
    } else {
      liked.push(id)
    }
    localStorage.setItem('rh_liked', JSON.stringify(liked))
    set({ liked })
  },

  // Returns filtered recipes based on current search + category
  getFiltered: () => {
    const { recipes, search, category } = get()
    const q = search.toLowerCase().trim()
    return recipes.filter((r) => {
      const matchSearch =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.author.toLowerCase().includes(q) ||
        r.tags.some((t) => t.toLowerCase().includes(q))
      const matchCategory = category === 'All' || r.category === category
      return matchSearch && matchCategory
    })
  },

  isLiked: (id) => get().liked.includes(id),
}))

export default useRecipeStore