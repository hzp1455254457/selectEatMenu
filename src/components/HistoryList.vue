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
      <li v-for="entry in historyStore.entries" :key="entry.id">
        {{ entry.menuItemName }} - <small>{{ formatDate(entry.eatenAt) }}</small>
      </li>
    </ul>
    <p v-else>暂无记录</p>
  </div>
</template>

<style scoped>
.history-list {
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-top: 1rem;
  background: white;
}
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}
.clear-btn {
  background: #ff4757;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
}
.history-container {
  max-height: 300px;
  overflow-y: auto;
  padding-left: 20px;
}
</style>