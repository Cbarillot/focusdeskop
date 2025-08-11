<template>
  <div class="todo-panel">

    <section class="create card">
      <form @submit.prevent="handleAdd">
        <div class="row">
          <input v-model="title" class="input" type="text" placeholder="📝 Task title" />
        </div>
        <div class="grid-2">
          <div class="col left">
            <div class="section-sub">🔥 PRIORITÉ</div>
            <div class="row types">
              <label class="type" :class="{ selected: types.includes('U') }" @click="toggleType('U')" :style="{ background:'#FF3B30', color:'#fff' }">U</label>
              <label class="type" :class="{ selected: types.includes('I') }" @click="toggleType('I')" :style="{ background:'#FFD60A', color:'#000' }">I</label>
              <label class="type" :class="{ selected: types.includes('PU') }" @click="toggleType('PU')" :style="{ background:'#1ABC9C', color:'#fff' }">PU</label>
              <label class="type" :class="{ selected: types.includes('PI') }" @click="toggleType('PI')" :style="{ background:'#001F7F', color:'#fff' }">PI</label>
            </div>

            <div class="section-sub">🏷 CATÉGORIE</div>
            <div class="cats column">
              <div class="cat-list">
                <button v-for="c in todo.categories" :key="c.id" type="button" class="cat" :class="{ selected: selectedCats.includes(c.id) }" :style="{ borderColor: c.color, color: c.color, background: selectedCats.includes(c.id) ? c.color : 'transparent' }" @click="toggleCat(c.id)">
                  {{ c.name }}
                </button>
              </div>
              <input v-model="newCatName" class="input small" type="text" placeholder="New category" />
              <input v-model="newCatColor" class="color" type="color" />
              <button type="button" class="add small plus" @click="createCategory">+</button>
            </div>
          </div>

          <div class="col right">
            <div class="section-sub">⏱ DURÉE</div>
            <div class="slot-buttons">
              <button type="button" class="slot" :class="{ active: slot==='30' }" title="30 min slot" @click="selectSlot('30')">
                <i class="icon icon-chrono half"></i>
              </button>
              <button type="button" class="slot" :class="{ active: slot==='60' }" title="1h slot" @click="selectSlot('60')">
                <i class="icon icon-chrono"></i>
              </button>
              <button type="button" class="slot" :class="{ active: slot==='90' }" title="1h30 slot" @click="selectSlot('90')">
                <i class="icon icon-chrono"></i><i class="icon icon-chrono half"></i>
              </button>
              <button type="button" class="slot" :class="{ active: slot==='120' }" title="2h slot" @click="selectSlot('120')">
                <i class="icon icon-chrono"></i><i class="icon icon-chrono"></i>
              </button>
            </div>
            <div v-if="slot" class="row fine-duration">
              <input v-model.number="minutes" class="minutes" type="number" step="1" :max="bounds.max" :min="bounds.min" />
              <span class="hint">{{ bounds.min }}-{{ bounds.max }} min</span>
            </div>
          </div>
        </div>

        <div class="row center">
          <button class="add" type="submit">Add Task</button>
        </div>
      </form>
    </section>

    <section class="list">
      <div v-if="!activeTasks.length && !laterTasks.length && !doneTasks.length" class="empty">No tasks yet</div>

      <template v-if="activeTasks.length">
        <h4 class="section-title">To do</h4>
        <ul>
          <li v-for="t in activeTasks" :key="t.id" class="item">
            <button class="check" :style="{ borderColor: colorFor(t), background: t.done ? colorFor(t) : 'transparent', color: t.done ? '#fff' : colorFor(t) }" @click="todo.toggleDone(t.id)">
              <template v-if="t.done">✓</template>
              <template v-else>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" fill="none"/>
                  <path d="M8 12l2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                </svg>
              </template>
            </button>
            <div class="meta">
              <div class="title">{{ t.title }}</div>
              <div class="sub">
                <span v-if="t.types && t.types.length === 2" class="pill" :style="{ background: colorFor(t) }">{{ t.types[0] }}+{{ t.types[1] }}</span>
                <span v-for="cid in (t.categories || [])" :key="cid" class="cat-chip" :style="{ background: catColor(cid) }">{{ catName(cid) }}</span>
                <span class="time-icons" :aria-label="t.durationMin + ' minutes'">
                  <i v-for="(piece, idx) in chronoPieces(t.durationMin)" :key="idx" class="icon icon-chrono" :class="piece" :style="{ backgroundColor: colorFor(t) }"></i>
                </span>
              </div>
            </div>
            <button class="later" title="Do later" @click="todo.toggleLater(t.id)">Later</button>
            <button class="remove" @click="todo.removeTask(t.id)">×</button>
          </li>
        </ul>
      </template>

      <template v-if="laterTasks.length">
        <h4 class="section-title later-title">Do later</h4>
        <ul>
          <li v-for="t in laterTasks" :key="t.id" class="item later-item">
            <button class="check" :style="{ borderColor: laterPink, background: t.done ? laterPink : 'transparent', color: t.done ? '#fff' : laterPink }" @click="todo.toggleDone(t.id)">
              <template v-if="t.done">✓</template>
              <template v-else>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" fill="none"/>
                  <path d="M8 12l2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                </svg>
              </template>
            </button>
            <div class="meta">
              <div class="title">{{ t.title }}</div>
              <div class="sub">
                <span class="pill later-pill">Later</span>
                <span v-for="cid in (t.categories || [])" :key="cid" class="cat-chip" :style="{ background: catColor(cid) }">{{ catName(cid) }}</span>
                <span class="time-icons" :aria-label="t.durationMin + ' minutes'">
                  <i v-for="(piece, idx) in chronoPieces(t.durationMin)" :key="idx" class="icon icon-chrono" :class="piece" :style="{ backgroundColor: laterPink }"></i>
                </span>
              </div>
            </div>
            <button class="later later-on" title="Move to To do" @click="todo.toggleLater(t.id)">Now</button>
            <button class="remove" @click="todo.removeTask(t.id)">×</button>
          </li>
        </ul>
      </template>

      <template v-if="doneTasks.length">
        <h4 class="section-title done-title">Completed</h4>
        <ul>
          <li v-for="t in doneTasks" :key="t.id" class="item done-item">
            <button class="check" :style="{ borderColor: '#bbb', background: t.done ? '#bbb' : 'transparent', color: t.done ? '#fff' : '#bbb' }" @click="todo.toggleDone(t.id)">
              <template v-if="t.done">✓</template>
              <template v-else>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" fill="none"/>
                  <path d="M8 12l2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                </svg>
              </template>
            </button>
            <div class="meta">
              <div class="title">{{ t.title }}</div>
              <div class="sub">
                <span v-if="t.types && t.types.length === 2" class="pill" style="background: #bbb">{{ t.types[0] }}+{{ t.types[1] }}</span>
                <span v-for="cid in (t.categories || [])" :key="cid" class="cat-chip" style="background: #bbb">{{ catName(cid) }}</span>
                <span class="time-icons" :aria-label="t.durationMin + ' minutes'">
                  <i v-for="(piece, idx) in chronoPieces(t.durationMin)" :key="idx" class="icon icon-chrono" :class="piece" style="background-color: #bbb"></i>
                </span>
              </div>
            </div>
            <button class="remove" @click="todo.removeTask(t.id)">×</button>
          </li>
        </ul>
      </template>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useTodoStore, type TodoType, type DurationSlot } from '../../stores/todoStore'

const todo = useTodoStore()

todo.hydrate()

const title = ref('')
const types = ref<TodoType[]>([])
const slot = ref<DurationSlot>('30')
const minutes = ref(15)
const selectedCats = ref<string[]>([])
const newCatName = ref('')
const newCatColor = ref('#9b59b6')

const activeTasks = computed(() => todo.activeTasks)
const laterTasks = computed(() => todo.laterTasks)
const doneTasks = computed(() => todo.sortedTasks.filter(t => t.done))
const laterPink = '#FF69B4'
const bounds = computed(() => todo.slotBounds(slot.value))

watch(slot, () => {
  // clamp minutes when slot changes
  const b = bounds.value
  if (minutes.value < b.min) minutes.value = b.min
  if (minutes.value > b.max) minutes.value = b.max
})

function selectSlot(s: DurationSlot) {
  slot.value = s
}

// no internal settings emitter; settings button moved to modal header

function toggleType(t: TodoType) {
  // prevent contradictory pairs: U vs PU, I vs PI
  const conflicts: Record<TodoType, TodoType> = { U: 'PU', PU: 'U', I: 'PI', PI: 'I' }
  const i = types.value.indexOf(t)
  if (i >= 0) {
    types.value.splice(i, 1)
    return
  }
  // if empty, add; if one exists and not conflicting, add to make 2; if conflicting, replace
  if (types.value.length === 0) {
    types.value.push(t)
    return
  }
  const first = types.value[0]
  if (conflicts[t] === first) {
    // conflicting with first: treat as replacing first
    types.value.splice(0, 1, t)
    return
  }
  if (types.value.length === 1) {
    types.value.push(t)
    return
  }
  // already two: replace the second
  types.value.splice(1, 1, t)
}

function handleAdd() {
  if (!title.value.trim() || types.value.length === 1) return
  todo.addTask({
    title: title.value,
    types: types.value.slice(0, 2),
    durationSlot: slot.value,
    durationMin: minutes.value,
    categories: selectedCats.value.slice()
  })
  title.value = ''
  types.value = []
  slot.value = '30'
  minutes.value = 15
  selectedCats.value = []
}

function colorFor(t: any) {
  return todo.colorForTask(t)
}

function toggleCat(id: string) {
  const i = selectedCats.value.indexOf(id)
  if (i >= 0) selectedCats.value.splice(i, 1)
  else selectedCats.value.push(id)
}

function createCategory() {
  const name = newCatName.value.trim()
  if (!name) return
  const id = todo.addCategory(name, newCatColor.value)
  selectedCats.value.push(id)
  newCatName.value = ''
}

function catName(id: string): string {
  const c = todo.categories.find(c => c.id === id)
  return c ? c.name : ''
}

function catColor(id: string): string {
  const c = todo.categories.find(c => c.id === id)
  return c ? c.color : '#888'
}

function chronoPieces(min: number): ("half"|"full")[] {
  if (min <= 30) return ['half']
  if (min <= 60) return ['full']
  if (min <= 90) return ['full', 'half']
  return ['full', 'full']
}
</script>

<style scoped>
.todo-panel { padding: 16px; color: #0c0c0c; }

.card { background: rgba(255,255,255,0.85); border: 1px solid rgba(0,0,0,0.08); border-radius: 14px; padding: 12px; transition: box-shadow .2s ease, transform .2s ease; backdrop-filter: blur(6px); }
.card:hover { box-shadow: 0 12px 28px rgba(0,0,0,0.18), 0 4px 10px rgba(0,0,0,0.12); transform: translateY(-1px); }

.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; align-items: start; }
.col.right { border-left: 1px solid rgba(0,0,0,0.08); padding-left: 14px; }
.section-sub { margin: 6px 0 4px; font-weight: 400; text-transform: uppercase; font-size: 12px; letter-spacing: 0.06em; opacity: 0.85; }
.left .types { gap: 8px; }
.cats.column { display: flex; flex-direction: column; gap: 8px; }
.slot-buttons { display: flex; gap: 8px; flex-wrap: wrap; }
.slot { padding: 8px 10px; border-radius: 12px; border: 1px solid rgba(0,0,0,0.13); background: rgba(255,255,255,0.6); cursor: pointer; display: inline-flex; align-items: center; gap: 4px; }
.slot.active { outline: 2px solid rgba(0,0,0,0.2); }
.fine-duration { align-items: center; gap: 8px; margin-top: 8px; }
.row.center { justify-content: center; }

.content-scroll { max-height: min(70vh, 640px); overflow-y: auto; }
.create h3 {
  margin: 0 0 8px 0;
  color: #0c0c0c;
}
.row { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
.input { flex: 1; padding: 10px 12px; border-radius: 8px; border: 1px solid rgba(0,0,0,0.12); background: rgba(0,0,0,0.03); color: #0c0c0c; }
.select { padding: 8px 10px; border-radius: 8px; background: rgba(0,0,0,0.03); color: #0c0c0c; border: 1px solid rgba(0,0,0,0.12); }
.minutes { width: 90px; padding: 8px 10px; border-radius: 8px; background: rgba(0,0,0,0.03); color: #0c0c0c; border: 1px solid rgba(0,0,0,0.12); }
.hint { font-size: 12px; opacity: 0.65; }
.add { background: var(--color-primary, #8B5CF6); border: none; padding: 10px 16px; border-radius: 10px; color: #fff; font-weight: 600; cursor: pointer; transition: filter 0.2s ease; }
.add:hover { filter: brightness(1.05); }
.types { gap: 8px; }
.type { padding: 6px 10px; border-radius: 8px; border: 1px solid rgba(0,0,0,0.15); cursor: pointer; user-select: none; color: #0c0c0c; }
.type.selected { background: rgba(0,0,0,0.06); }
.cats { align-items: stretch; }
.cat-list { display: flex; flex-wrap: wrap; gap: 6px; }
.cat { padding: 6px 10px; border-radius: 999px; border: 2px solid currentColor; background: transparent; cursor: pointer; font-weight: 600; }
.cat.selected { color: #fff !important; }
.plus { width: 36px; height: 32px; display: inline-flex; align-items: center; justify-content: center; font-size: 18px; border-radius: 8px; }
.input.small { padding: 6px 8px; }
.add.small { padding: 6px 10px; }
.color { width: 36px; height: 32px; padding: 0; border: none; background: transparent; }
.cat-chip { color: #fff; padding: 2px 6px; border-radius: 999px; font-weight: 700; }

.list { margin-top: 10px; }
.empty { opacity: 0.7; padding: 12px; text-align: center; }
ul { list-style: none; padding: 0; margin: 0; }
.item { display: flex; align-items: center; gap: 12px; padding: 10px 6px; border-bottom: 1px solid rgba(0,0,0,0.06); }
.section-title { margin: 12px 0 6px; font-size: 13px; font-weight: 700; opacity: 0.8; }
.later-title { color: #b83280; }
.done-title { color: #666; }
.check { width: 22px; height: 22px; border-radius: 50%; border: 2px solid rgba(0,0,0,0.3); background: transparent; color: #0c0c0c; display: flex; align-items: center; justify-content: center; cursor: pointer; }
.meta { flex: 1; }
.title { font-weight: 600; }
.title.done { opacity: 0.55; text-decoration: line-through; }
.sub { font-size: 12px; opacity: 0.85; display: flex; align-items: center; gap: 8px; }
.pill { color: #000; padding: 2px 6px; border-radius: 6px; font-weight: 700; }
.later-pill { background: rgba(255,105,180,0.15); color: #b83280; border: 1px solid rgba(255,105,180,0.3); }
.later { background: rgba(255,105,180,0.15); color: #b83280; border: 1px solid rgba(255,105,180,0.35); padding: 6px 10px; border-radius: 8px; font-weight: 600; cursor: pointer; }
.later:hover { filter: brightness(1.05); }
.later-on { background: rgba(27, 197, 189, 0.12); color: #0f766e; border-color: rgba(27,197,189,0.3); }
.done-item .title { text-decoration: line-through; opacity: 0.55; }
.time-icons { display: inline-flex; gap: 3px; }
.icon { width: 14px; height: 14px; display: inline-block; background-color: rgba(0,0,0,0.75); -webkit-mask-repeat: no-repeat; -webkit-mask-position: center; -webkit-mask-size: contain; mask-repeat: no-repeat; mask-position: center; mask-size: contain; }
.icon-chrono { -webkit-mask-image: url('/assets/icons/focus%20icon.svg'); mask-image: url('/assets/icons/focus%20icon.svg'); }
.icon.half { clip-path: inset(0 50% 0 0); }
.remove { background: transparent; border: none; color: rgba(0,0,0,0.5); font-size: 20px; cursor: pointer; }
.remove:hover { color: #000; }
</style>
