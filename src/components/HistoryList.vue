<script setup lang="ts">
import { useHistoryStore } from '../stores/historyStore'

const historyStore = useHistoryStore()

const formatDate = (isoStr: string) => {
  return new Date(isoStr).toLocaleString()
}
</script>

<template>
  <div class="history-list">
    <div class="header">
        <h2>历史记录</h2>
        <button @click="historyStore.clearHistory" v-if="historyStore.entries.length > 0" class="clear-btn">清空历史</button>
    </div>
    <ul v-if="historyStore.entries.length > 0" class="history-container">
      <TransitionGroup name="list">
        <li v-for="entry in historyStore.entries" :key="entry.id" class="history-item">
          <span class="history-name">{{ entry.menuItemName }}</span>
          <span class="history-date">{{ formatDate(entry.eatenAt) }}</span>
        </li>
      </TransitionGroup>
    </ul>
    <p v-else>暂无记录</p>
  </div>
</template>

<style scoped>
.history-list {
  padding: 1.5rem;
  border-radius: 16px;
  background: white;
  display: flex;
  flex-direction: column;
  height: 100%;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid #f1f5f9;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-shrink: 0;
}

.header h2 {
  margin: 0;
  color: #1e293b;
  font-weight: 700;
}

.clear-btn {
  background: #ef4444;
  color: white;
  border: none;
  padding: 6px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
  font-size: 0.9rem;
}

.clear-btn:hover {
  background: #dc2626;
}

.history-container {
  flex: 1;
  overflow-y: auto;
  padding: 0;
  margin: 0;
  list-style: none;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  margin-bottom: 8px;
  background: #f8fafc;
  border-radius: 10px;
  border-left: 4px solid #cbd5e1;
  transition: all 0.2s;
}

.history-item:hover {
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  border-left-color: #667eea;
  transform: translateX(2px);
}

.history-name {
  font-weight: 600;
  color: #334155;
}

.history-date {
  font-size: 0.85rem;
  color: #94a3b8;
}

/* Transition Animations */
.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>