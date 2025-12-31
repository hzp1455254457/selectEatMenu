<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMenuStore, type MenuItem } from '../stores/menuStore'
import { useHistoryStore } from '../stores/historyStore'
import { useSettingStore } from '../stores/settingStore'
import confetti from 'canvas-confetti'

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
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
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
      <div class="result-card">
        <h2>{{ currentRecommendation.name }}</h2>
        <div v-if="currentRecommendation.tags" class="tags">
          <span v-for="tag in currentRecommendation.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>
      </div>
      <div class="result-actions" v-if="!isRolling">
        <button @click="confirmEat" class="confirm-btn">就吃这个！</button>
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
  border-radius: 16px;
  margin-bottom: 1rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
  margin-bottom: 25px;
}

.filters select {
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  font-size: 1rem;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  outline: none;
  transition: all 0.2s;
}

.filters select:focus {
  border-color: #4facfe;
  box-shadow: 0 0 0 3px rgba(79, 172, 254, 0.2);
}

.primary-btn {
  font-size: 1.5rem;
  padding: 12px 32px;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 15px rgba(0, 242, 254, 0.3);
  font-weight: bold;
  letter-spacing: 1px;
}

.primary-btn:disabled {
  background: #cbd5e0;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.primary-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 242, 254, 0.4);
}

.primary-btn:active:not(:disabled) {
  transform: translateY(1px);
}

.result {
  margin-top: 30px;
  animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes popIn {
  0% { opacity: 0; transform: scale(0.8); }
  100% { opacity: 1; transform: scale(1); }
}

.result-card {
  padding: 30px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  margin-bottom: 20px;
  border: 1px solid #e2e8f0;
}

.result.rolling .result-card {
  animation: shake 0.5s infinite;
}

@keyframes shake {
  0% { transform: translate(1px, 1px) rotate(0deg); }
  10% { transform: translate(-1px, -2px) rotate(-1deg); }
  20% { transform: translate(-3px, 0px) rotate(1deg); }
  30% { transform: translate(3px, 2px) rotate(0deg); }
  40% { transform: translate(1px, -1px) rotate(1deg); }
  50% { transform: translate(-1px, 2px) rotate(-1deg); }
  60% { transform: translate(-3px, 1px) rotate(0deg); }
  70% { transform: translate(3px, 1px) rotate(-1deg); }
  80% { transform: translate(-1px, -1px) rotate(1deg); }
  90% { transform: translate(1px, 2px) rotate(0deg); }
  100% { transform: translate(1px, -2px) rotate(-1deg); }
}

.result h2 {
    font-size: 2.5rem;
    color: #2d3748;
    margin: 10px 0;
    font-weight: 800;
}

.result-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.confirm-btn {
  padding: 10px 24px;
  background: linear-gradient(135deg, #42b883 0%, #3aa876 100%);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 600;
  transition: all 0.2s;
  box-shadow: 0 4px 10px rgba(66, 184, 131, 0.3);
}

.confirm-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(66, 184, 131, 0.4);
}

.retry-btn {
  padding: 10px 24px;
  background: white;
  color: #718096;
  border: 1px solid #cbd5e0;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 600;
  transition: all 0.2s;
}

.retry-btn:hover {
  background: #f7fafc;
  color: #4a5568;
}

.tag {
  display: inline-block;
  background: #edf2f7;
  color: #4a5568;
  padding: 4px 12px;
  border-radius: 12px;
  margin: 0 4px;
  font-size: 0.9rem;
  font-weight: 500;
}

.message {
  margin-top: 20px;
  padding: 12px;
  border-radius: 8px;
  background-color: #fff5f5;
  color: #c53030;
  animation: fadeIn 0.3s ease;
}

.stats {
  margin-top: 2rem;
  color: #718096;
  font-size: 0.9rem;
}
</style>