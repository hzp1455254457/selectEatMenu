<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMenuStore, type MenuItem } from '../stores/menuStore'
import { useHistoryStore } from '../stores/historyStore'
import { useSettingStore } from '../stores/settingStore'

const menuStore = useMenuStore()
const historyStore = useHistoryStore()
const settingStore = useSettingStore()

const currentRecommendation = ref<MenuItem | null>(null)
const message = ref('')

const selectedTag = ref('')

const availableTags = computed(() => {
  const tags = new Set<string>()
  menuStore.items.forEach(item => {
    item.tags?.forEach(t => tags.add(t))
  })
  return Array.from(tags)
})

const availableItems = computed(() => {
  const now = new Date().getTime()
  const cooldownMs = settingStore.cooldownDays * 24 * 60 * 60 * 1000
  
  // Find items recently eaten
  const recentItemIds = new Set<string>()
  historyStore.entries.forEach(entry => {
    const eatenTime = new Date(entry.eatenAt).getTime()
    if (now - eatenTime < cooldownMs) {
      recentItemIds.add(entry.menuItemId)
    }
  })
  
  return menuStore.items.filter(item => {
    const isNotCoolingDown = !recentItemIds.has(item.id)
    const matchesTag = !selectedTag.value || item.tags?.includes(selectedTag.value)
    return isNotCoolingDown && matchesTag
  })
})

const isRolling = ref(false)

const recommend = () => {
  if (menuStore.items.length === 0) {
    message.value = "请先导入或添加菜单！"
    currentRecommendation.value = null
    return
  }
  
  if (availableItems.value.length === 0) {
    message.value = selectedTag.value 
      ? `没有符合"${selectedTag.value}"标签的可选项目（可能都在冷却中）。`
      : "所有选项都在冷却中，请修改设置或清空历史。"
    currentRecommendation.value = null
    return
  }
  
  // Start Rolling Animation
  isRolling.value = true
  message.value = ""
  currentRecommendation.value = null
  
  let rollCount = 0
  const maxRolls = 20
  const interval = setInterval(() => {
    const randomIndex = Math.floor(Math.random() * availableItems.value.length)
    currentRecommendation.value = availableItems.value[randomIndex]
    rollCount++
    
    if (rollCount >= maxRolls) {
      clearInterval(interval)
      isRolling.value = false
    }
  }, 50)
}

const confirmEat = async () => {
  if (currentRecommendation.value) {
    await historyStore.addEntry({
      id: crypto.randomUUID(),
      menuItemId: currentRecommendation.value.id,
      menuItemName: currentRecommendation.value.name,
      eatenAt: new Date().toISOString()
    })
    message.value = `已记录：${currentRecommendation.value.name}`
    currentRecommendation.value = null
  }
}
</script>

<template>
  <div class="randomizer">
    <h1>今天吃什么？</h1>
    <div class="actions">
      <div class="filters" v-if="availableTags.length > 0">
        <select v-model="selectedTag">
          <option value="">全部标签</option>
          <option v-for="tag in availableTags" :key="tag" :value="tag">{{ tag }}</option>
        </select>
      </div>
      <button @click="recommend" class="primary-btn" :disabled="isRolling">
        {{ isRolling ? '随机中...' : '随机推荐' }}
      </button>
    </div>
    
    <div v-if="currentRecommendation" class="result" :class="{ rolling: isRolling }">
      <h2>{{ currentRecommendation.name }}</h2>
      <div class="result-actions" v-if="!isRolling">
        <button @click="confirmEat" class="confirm-btn">就吃这个</button>
        <button @click="recommend" class="retry-btn">换一个</button>
      </div>
    </div>
    
    <div v-if="message" class="message">{{ message }}</div>
    
    <div class="stats">
      <p>可用选项: {{ availableItems.length }} / {{ menuStore.items.length }}</p>
    </div>
  </div>
</template>

<style scoped>
.randomizer {
  text-align: center;
  padding: 2rem;
  border: 2px solid #42b883;
  border-radius: 12px;
  margin-bottom: 1rem;
  background: white;
}
.actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  margin-bottom: 20px;
}
.filters select {
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ddd;
  font-size: 1rem;
}
.primary-btn {
  font-size: 1.5rem;
  padding: 10px 20px;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}
.primary-btn:disabled {
  background-color: #a8dcc0;
  cursor: not-allowed;
}
.primary-btn:hover:not(:disabled) {
  background-color: #3aa876;
}
.result {
  margin-top: 20px;
  padding: 20px;
  background-color: #f0f9f5;
  border-radius: 8px;
  transition: transform 0.1s;
}
.result.rolling {
  transform: scale(1.05);
  background-color: #e6fffa;
}
.result h2 {
    font-size: 2rem;
    color: #35495e;
    margin: 10px 0;
}
.result-actions {
  display: flex;
  justify-content: center;
  gap: 15px;
}
.result-actions button {
    padding: 10px 20px;
    cursor: pointer;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
}
.confirm-btn {
  background-color: #35495e;
  color: white;
}
.retry-btn {
  background-color: #e0e0e0;
  color: #333;
}
.message {
    margin-top: 15px;
    color: #666;
    font-size: 1.1rem;
}
.stats {
  margin-top: 20px;
  color: #999;
  font-size: 0.9rem;
}
</style>