<script setup lang="ts">
import { useMenuStore, type MenuItem } from '../stores/menuStore'
import { ref } from 'vue'

const menuStore = useMenuStore()
const fileInput = ref<HTMLInputElement | null>(null)

// Add Item Form
const isAdding = ref(false)
const newItemName = ref('')
const newItemTags = ref('')

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    const file = target.files[0]
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const items = JSON.parse(content) as MenuItem[]
        if (Array.isArray(items)) {
          // Simple validation: check if items have name
          const validItems = items.filter(i => i.name)
          // Assign IDs if missing
          validItems.forEach(i => {
             if (!i.id) i.id = i.name + '-' + Math.random().toString(36).substr(2, 9)
          })
          menuStore.importItems(validItems)
          alert(`成功导入 ${validItems.length} 个菜单项`)
        } else {
          alert('格式错误：必须是数组')
        }
      } catch (err) {
        alert('解析失败：' + err)
      }
    }
    reader.readAsText(file)
  }
}

const addItem = async () => {
  if (!newItemName.value.trim()) return
  
  const tags = newItemTags.value.split(/[,，\s]+/).filter(t => t.trim())
  
  await menuStore.addItem({
    id: crypto.randomUUID(),
    name: newItemName.value.trim(),
    tags: tags.length > 0 ? tags : undefined
  })
  
  newItemName.value = ''
  newItemTags.value = ''
  isAdding.value = false
}
</script>

<template>
  <div class="menu-list">
    <div class="header">
      <h2>菜单管理</h2>
      <button class="add-btn" @click="isAdding = !isAdding">{{ isAdding ? '取消' : '添加' }}</button>
    </div>
    
    <div v-if="isAdding" class="add-form">
      <input v-model="newItemName" placeholder="菜名 (如: 红烧肉)" class="input-name" @keyup.enter="addItem" />
      <input v-model="newItemTags" placeholder="标签 (空格分隔)" class="input-tags" @keyup.enter="addItem" />
      <button @click="addItem" class="save-btn" :disabled="!newItemName">保存</button>
    </div>

    <div class="actions">
       <span class="import-label">或导入JSON:</span>
       <input type="file" ref="fileInput" accept=".json" @change="handleFileUpload" />
    </div>
    
    <div v-if="menuStore.items.length === 0">
      <p>暂无菜单，请添加或导入。</p>
    </div>
    <ul v-else class="items-container">
      <TransitionGroup name="list">
        <li v-for="item in menuStore.items" :key="item.id" class="menu-item">
          <div class="item-info">
            <span class="item-name">{{ item.name }}</span>
            <span v-if="item.tags" class="item-tags">
              <span v-for="tag in item.tags" :key="tag" class="tag">{{ tag }}</span>
            </span>
          </div>
          <button @click="menuStore.removeItem(item.id)" class="del-btn">×</button>
        </li>
      </TransitionGroup>
    </ul>
  </div>
</template>

<style scoped>
.menu-list {
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
}

.header h2 {
  margin: 0;
  color: #1e293b;
  font-weight: 700;
}

.add-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 6px rgba(118, 75, 162, 0.3);
}

.add-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 8px rgba(118, 75, 162, 0.4);
}

.add-form {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  background: #f8fafc;
  padding: 15px;
  border-radius: 12px;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.input-name, .input-tags {
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  outline: none;
  transition: border-color 0.2s;
}

.input-name:focus, .input-tags:focus {
  border-color: #667eea;
}

.save-btn {
  background: #42b883;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
}

.actions {
  margin-bottom: 15px;
  font-size: 0.9rem;
  color: #64748b;
}

.items-container {
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1;
  overflow-y: auto;
}

.menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  margin-bottom: 8px;
  background: #f8fafc;
  border-radius: 10px;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.menu-item:hover {
  background: white;
  border-color: #e2e8f0;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  transform: translateX(4px);
}

.item-name {
  font-weight: 600;
  color: #334155;
}

.item-tags {
  margin-left: 10px;
}

.tag {
  font-size: 0.8rem;
  background: #e2e8f0;
  color: #64748b;
  padding: 2px 8px;
  border-radius: 6px;
  margin-right: 4px;
}

.del-btn {
  background: transparent;
  color: #cbd5e1;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  transition: color 0.2s;
  padding: 0 8px;
}

.del-btn:hover {
  color: #ef4444;
}

/* Transition Animations */
.list-enter-active,
.list-leave-active {
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.5, 1);
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>