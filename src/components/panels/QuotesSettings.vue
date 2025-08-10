<template>
  <div class="panel-section">
    <h3>Quotes</h3>
    <p class="section-description">Display inspirational quotes to keep you motivated during focus sessions.</p>
    
    <div class="current-quote">
      <div class="quote-card">
        <div class="quote-text">"{{ currentQuote.text }}"</div>
        <div class="quote-author">— {{ currentQuote.author }}</div>
      </div>
      <button class="refresh-btn" @click="getNewQuote">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 4V10H7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M23 20V14H17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M20.49 9C20.0 6.5 18.3 4.4 16.1 3.2C13.9 2 11.3 1.7 8.8 2.3C6.3 2.9 4.1 4.3 2.6 6.3L1 10M23 14L21.4 17.7C19.9 19.7 17.7 21.1 15.2 21.7C12.7 22.3 10.1 22 7.9 20.8C5.7 19.6 4 17.5 3.51 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
    
    <div class="setting-group">
      <h4>Display Settings</h4>
      
      <div class="setting-item">
        <label class="setting-label">Show quotes</label>
        <label class="toggle-switch">
          <input type="checkbox" v-model="showQuotes" />
          <span class="slider"></span>
        </label>
      </div>
      
      <div class="setting-item">
        <label class="setting-label">Change quote automatically</label>
        <label class="toggle-switch">
          <input type="checkbox" v-model="autoChange" />
          <span class="slider"></span>
        </label>
      </div>
      
      <div class="setting-item" v-if="autoChange">
        <label class="setting-label">Change interval</label>
        <select v-model="changeInterval" class="select-input">
          <option value="session">Every session</option>
          <option value="hour">Every hour</option>
          <option value="day">Daily</option>
        </select>
      </div>
      
      <div class="setting-item">
        <label class="setting-label">Quote position</label>
        <select v-model="quotePosition" class="select-input">
          <option value="bottom">Bottom</option>
          <option value="top">Top</option>
          <option value="center">Center</option>
        </select>
      </div>
    </div>
    
    <div class="setting-group">
      <h4>Quote Categories</h4>
      
      <div class="category-grid">
        <label v-for="category in categories" :key="category.key" class="category-option">
          <input 
            type="checkbox" 
            :value="category.key" 
            v-model="selectedCategories"
          />
          <span class="category-label">{{ category.label }}</span>
        </label>
      </div>
    </div>
    
    <div class="setting-group">
      <h4>Custom Quotes</h4>
      <p class="setting-description">Add your own inspirational quotes.</p>
      
      <div class="custom-quote-form">
        <textarea 
          v-model="newQuoteText"
          placeholder="Enter your quote..."
          class="quote-input"
        ></textarea>
        <input 
          v-model="newQuoteAuthor"
          placeholder="Author (optional)"
          class="author-input"
        />
        <button @click="addCustomQuote" class="add-btn" :disabled="!newQuoteText.trim()">
          Add Quote
        </button>
      </div>
      
      <div v-if="customQuotes.length > 0" class="custom-quotes-list">
        <div v-for="(quote, index) in customQuotes" :key="index" class="custom-quote-item">
          <div class="custom-quote-content">
            <div class="custom-quote-text">"{{ quote.text }}"</div>
            <div class="custom-quote-author" v-if="quote.author">— {{ quote.author }}</div>
          </div>
          <button @click="removeCustomQuote(index)" class="remove-btn">×</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const currentQuote = reactive({
  text: "The way to get started is to quit talking and begin doing.",
  author: "Walt Disney"
})

const showQuotes = ref(true)
const autoChange = ref(true)
const changeInterval = ref('session')
const quotePosition = ref('bottom')
const selectedCategories = ref(['motivation', 'productivity', 'success'])
const newQuoteText = ref('')
const newQuoteAuthor = ref('')
const customQuotes = ref([])

const categories = [
  { key: 'motivation', label: 'Motivation' },
  { key: 'productivity', label: 'Productivity' },
  { key: 'success', label: 'Success' },
  { key: 'mindfulness', label: 'Mindfulness' },
  { key: 'creativity', label: 'Creativity' },
  { key: 'leadership', label: 'Leadership' },
  { key: 'wisdom', label: 'Wisdom' },
  { key: 'perseverance', label: 'Perseverance' }
]

const quotes = [
  { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" }
]

function getNewQuote() {
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]
  currentQuote.text = randomQuote.text
  currentQuote.author = randomQuote.author
}

function addCustomQuote() {
  if (newQuoteText.value.trim()) {
    customQuotes.value.push({
      text: newQuoteText.value.trim(),
      author: newQuoteAuthor.value.trim() || 'Anonymous'
    })
    newQuoteText.value = ''
    newQuoteAuthor.value = ''
  }
}

function removeCustomQuote(index) {
  customQuotes.value.splice(index, 1)
}
</script>

<style scoped>
.current-quote {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 32px;
}

.quote-card {
  flex: 1;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--border-radius-md);
  padding: 20px;
}

.quote-text {
  font-size: 16px;
  font-style: italic;
  color: var(--color-text-primary);
  line-height: 1.6;
  margin-bottom: 12px;
}

.quote-author {
  font-size: 14px;
  color: var(--color-text-secondary);
  text-align: right;
}

.refresh-btn {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: var(--border-radius-md);
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.refresh-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: var(--color-text-primary);
  transform: rotate(180deg);
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.setting-description {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin-bottom: 16px;
  line-height: 1.4;
}

.select-input {
  padding: 6px 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--border-radius-sm);
  color: var(--color-text-primary);
  font-size: 12px;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
}

.category-option {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--color-text-secondary);
  cursor: pointer;
}

.category-option input[type="checkbox"] {
  accent-color: var(--color-primary);
}

.custom-quote-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.quote-input {
  width: 100%;
  height: 80px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--border-radius-sm);
  color: var(--color-text-primary);
  font-size: 14px;
  resize: vertical;
}

.author-input {
  width: 100%;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--border-radius-sm);
  color: var(--color-text-primary);
  font-size: 14px;
}

.add-btn {
  align-self: flex-start;
  padding: 8px 16px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--border-radius-sm);
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.add-btn:hover:not(:disabled) {
  background: var(--color-primary-dark);
}

.add-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.custom-quotes-list {
  max-height: 200px;
  overflow-y: auto;
}

.custom-quote-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: var(--border-radius-sm);
  margin-bottom: 8px;
}

.custom-quote-content {
  flex: 1;
}

.custom-quote-text {
  font-size: 13px;
  color: var(--color-text-primary);
  margin-bottom: 4px;
}

.custom-quote-author {
  font-size: 11px;
  color: var(--color-text-secondary);
}

.remove-btn {
  width: 20px;
  height: 20px;
  background: rgba(239, 68, 68, 0.2);
  border: none;
  border-radius: 50%;
  color: #FCA5A5;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.remove-btn:hover {
  background: rgba(239, 68, 68, 0.3);
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.2);
  transition: 0.2s;
  border-radius: 20px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  transition: 0.2s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: var(--color-primary);
}

input:checked + .slider:before {
  transform: translateX(20px);
}

h4 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
}
</style>
