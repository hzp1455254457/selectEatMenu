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
      <li v-for="item in menuStore.items" :key="item.id" class="menu-item">
        <div class="item-info">
          <span class="item-name">{{ item.name }}</span>
          <span v-if="item.tags" class="item-tags">
            <span v-for="tag in item.tags" :key="tag" class="tag">{{ tag }}</span>
          </span>
        </div>
        <button @click="menuStore.removeItem(item.id)" class="del-btn">×</button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.menu-list {
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: white;
  display: flex;
  flex-direction: column;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.add-btn {
  background: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
}
.add-form {
  display: flex;
  gap: 5px;
  margin-bottom: 10px;
  padding: 10px;
  background: #f9f9f9;
  border-radius: 4px;
}
.input-name { flex: 2; }
.input-tags { flex: 1; }
.save-btn {
  background: #35495e;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.save-btn:disabled { background: #ccc; }

.actions {
  margin-bottom: 10px;
  font-size: 0.9rem;
}
.import-label { margin-right: 5px; color: #666; }

.items-container {
  max-height: 400px;
  overflow-y: auto;
  padding: 0;
  margin: 0;
  list-style: none;
}
.menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 5px;
  border-bottom: 1px solid #eee;
}
.item-info {
  display: flex;
  flex-direction: column;
}
.item-name { font-weight: bold; }
.item-tags { display: flex; gap: 4px; margin-top: 2px; }
.tag {
  font-size: 0.75rem;
  background: #eee;
  padding: 1px 4px;
  border-radius: 3px;
  color: #666;
}
.del-btn {
  background: transparent;
  border: none;
  color: #999;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0 5px;
}
.del-btn:hover { color: #ff4757; }
</style>