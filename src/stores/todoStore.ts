import { defineStore } from 'pinia'

export type TodoType = 'U' | 'I' | 'PU' | 'PI'
export interface Category {
  id: string
  name: string
  color: string
}
export type DurationSlot = '30' | '60' | '90' | '120'

export interface TaskItem {
  id: string
  title: string
  types: TodoType[] // either 0 or 2 labels
  durationSlot: DurationSlot
  durationMin: number
  done: boolean
  later: boolean
  categories?: string[] // category ids
  createdAt: number
}

const boundsBySlot: Record<DurationSlot, { min: number; max: number }> = {
  '30': { min: 1, max: 30 },
  '60': { min: 30, max: 60 },
  '90': { min: 60, max: 90 },
  '120': { min: 90, max: 120 }
}

const colorByType: Record<TodoType, string> = {
  U: '#FF3B30',      // red (Urgent)
  I: '#FFD60A',      // yellow (Important)
  PU: '#1ABC9C',     // turquoise (Pas urgent)
  PI: '#001F7F'      // navy blue (Pas important)
}

// Combination color map per spec
const colorByCombo: Record<string, string> = {
  'I+U': '#FF8800',   // bright orange
  'U+PI': '#9B00FF',  // bright purple
  'I+PU': '#22CC55',  // bright green
  'PU+PI': '#66CCFF'  // light blue
}

const priorityByCombo: Record<string, 1 | 2 | 3 | 4> = {
  'I+U': 1,
  'U+PI': 2,
  'I+PU': 3,
  'PU+PI': 4
}

function comboKey(a: TodoType, b: TodoType): string {
  const set = new Set<TodoType>([a, b])
  if (set.has('I') && set.has('U')) return 'I+U'
  if (set.has('U') && set.has('PI')) return 'U+PI'
  if (set.has('I') && set.has('PU')) return 'I+PU'
  if (set.has('PU') && set.has('PI')) return 'PU+PI'
  return `${a}+${b}`
}

function clampToSlot(slot: DurationSlot, value: number): number {
  const { min, max } = boundsBySlot[slot]
  return Math.max(min, Math.min(max, Math.round(value)))
}

const STORAGE_KEY = 'focusdeskop.todo.tasks'
const STORAGE_CATS = 'focusdeskop.todo.categories'

export const useTodoStore = defineStore('todo', {
  state: () => ({
    tasks: [] as TaskItem[],
    categories: [] as Category[]
  }),
  getters: {
    pendingCount: (state) => state.tasks.filter(t => !t.done && !t.later).length,
    sortedTasks: (state) => {
      return [...state.tasks].sort((a, b) => {
        const ra = priorityByCombo[comboKeyFromTypes(a.types)] || 99
        const rb = priorityByCombo[comboKeyFromTypes(b.types)] || 99
        if (ra !== rb) return ra - rb
        return a.createdAt - b.createdAt
      })
    },
    activeTasks(): TaskItem[] {
      return (this as any).sortedTasks.filter((t: TaskItem) => !t.done && !t.later)
    },
    laterTasks(): TaskItem[] {
      return (this as any).sortedTasks.filter((t: TaskItem) => !t.done && t.later)
    },
    colorForTask: () => (t: TaskItem) => {
      const key = comboKeyFromTypes(t.types)
      return colorByCombo[key] || (t.types && t.types[0] ? colorByType[t.types[0]] : '#001F7F')
    },
    chronoIcons: () => (minutes: number): 0.5 | 1 | 1.5 | 2 => {
      if (minutes <= 30) return 0.5
      if (minutes <= 60) return 1
      if (minutes <= 90) return 1.5
      return 2
    },
    slotBounds: () => (slot: DurationSlot) => boundsBySlot[slot]
  },
  actions: {
    hydrate() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (raw) {
          const items = JSON.parse(raw)
          if (Array.isArray(items)) {
            // migration: ensure 'later' flag exists
            this.tasks = items.map((it: any) => ({
              later: !!it.later,
              types: Array.isArray(it.types) ? it.types : (it.types ? [it.types[0], it.types[1]].filter(Boolean) : []),
              ...it
            }))
          }
        }
        const rawCats = localStorage.getItem(STORAGE_CATS)
        if (rawCats) {
          const cats = JSON.parse(rawCats)
          if (Array.isArray(cats)) this.categories = cats
        }
      } catch (e) {
        console.warn('Failed to hydrate todo store', e)
      }
    },
    persist() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.tasks))
        localStorage.setItem(STORAGE_CATS, JSON.stringify(this.categories))
      } catch (e) {
        console.warn('Failed to persist todo store', e)
      }
    },
    addTask(payload: { title: string; types: TodoType[]; durationSlot: DurationSlot; durationMin: number; categories?: string[] }) {
      const arr = Array.isArray(payload.types) ? payload.types : []
      if (!(arr.length === 0 || arr.length === 2)) throw new Error('Types must be 0 or 2')
      const slot = payload.durationSlot
      const minutes = clampToSlot(slot, payload.durationMin)
      const item: TaskItem = {
        id: Math.random().toString(36).slice(2),
        title: payload.title.trim(),
        types: arr,
        durationSlot: slot,
        durationMin: minutes,
        done: false,
        later: false,
        categories: payload.categories || [],
        createdAt: Date.now()
      }
      if (!item.title) throw new Error('Title required')
      this.tasks.push(item)
      this.persist()
    },
    toggleDone(id: string) {
      const t = this.tasks.find(t => t.id === id)
      if (t) {
        t.done = !t.done
        this.persist()
      }
    },
    toggleLater(id: string) {
      const t = this.tasks.find(t => t.id === id)
      if (t) {
        t.later = !t.later
        this.persist()
      }
    },
    removeTask(id: string) {
      this.tasks = this.tasks.filter(t => t.id !== id)
      this.persist()
    },
    updateTask(id: string, patch: Partial<Omit<TaskItem, 'id' | 'createdAt'>>) {
      const i = this.tasks.findIndex(t => t.id === id)
      if (i >= 0) {
        const current = this.tasks[i]
        const next = { ...current, ...patch }
        // Enforce rules
        if (next.types && !(next.types.length === 0 || next.types.length === 2)) throw new Error('Types must be 0 or 2')
        if (next.durationSlot && typeof next.durationMin === 'number') {
          next.durationMin = clampToSlot(next.durationSlot as DurationSlot, next.durationMin)
        }
        this.tasks.splice(i, 1, next as TaskItem)
        this.persist()
      }
    },
    addCategory(name: string, color: string) {
      const id = Math.random().toString(36).slice(2)
      this.categories.push({ id, name: name.trim(), color })
      this.persist()
      return id
    },
    updateCategory(id: string, patch: Partial<Category>) {
      const i = this.categories.findIndex(c => c.id === id)
      if (i >= 0) {
        this.categories.splice(i, 1, { ...this.categories[i], ...patch })
        this.persist()
      }
    },
    removeCategory(id: string) {
      this.categories = this.categories.filter(c => c.id !== id)
      // also remove from tasks
      this.tasks = this.tasks.map(t => ({ ...t, categories: (t.categories || []).filter(cid => cid !== id) }))
      this.persist()
    },
    toggleTaskCategory(taskId: string, categoryId: string) {
      const t = this.tasks.find(t => t.id === taskId)
      if (!t) return
      const set = new Set(t.categories || [])
      if (set.has(categoryId)) {
        set.delete(categoryId)
      } else {
        set.add(categoryId)
      }
      t.categories = Array.from(set)
      this.persist()
    }
  }
})

function comboKeyFromTypes(types: TodoType[]): string {
  const set = new Set<TodoType>(types || [])
  if (set.has('I') && set.has('U')) return 'I+U'
  if (set.has('U') && set.has('PI')) return 'U+PI'
  if (set.has('I') && set.has('PU')) return 'I+PU'
  if (set.has('PU') && set.has('PI')) return 'PU+PI'
  return ''
}
