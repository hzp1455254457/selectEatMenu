<script setup lang="ts">
import { useMenuStore, type MenuItem } from '../stores/menuStore'
import { computed, ref } from 'vue'

const menuStore = useMenuStore()
const fileInput = ref<HTMLInputElement | null>(null)

const isAdding = ref(false)
const newItemName = ref('')
const newItemTags = ref('')

const searchQuery = ref('')

const editingId = ref<string | null>(null)
const editName = ref('')
const editTags = ref('')

const importMessage = ref('')

const normalizeTags = (tags: string[]) => {
  const uniq = new Set<string>()
  tags.forEach(t => {
    const v = t.trim()
    if (v) uniq.add(v)
  })
  return Array.from(uniq)
}

const parseTags = (raw: string) => {
  return normalizeTags(raw.split(/[,，\s]+/).map(t => t.trim()).filter(Boolean))
}

const filteredItems = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return menuStore.items
  return menuStore.items.filter(item => {
    if (item.name.toLowerCase().includes(q)) return true
    return (item.tags ?? []).some(t => t.toLowerCase().includes(q))
  })
})

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    const file = target.files[0]
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const items = JSON.parse(content) as unknown
        if (Array.isArray(items)) {
          const seenNames = new Set<string>()
          const normalized: MenuItem[] = []

          for (const raw of items) {
            if (!raw || typeof raw !== 'object') continue
            const maybe = raw as any
            const name = typeof maybe.name === 'string' ? maybe.name.trim() : ''
            if (!name) continue

            const nameKey = name.toLowerCase()
            if (seenNames.has(nameKey)) continue
            seenNames.add(nameKey)

            const tags = Array.isArray(maybe.tags) ? normalizeTags(maybe.tags.map((t: any) => String(t))) : []
            normalized.push({
              id: typeof maybe.id === 'string' && maybe.id.trim() ? maybe.id : crypto.randomUUID(),
              name,
              tags: tags.length > 0 ? tags : undefined
            })
          }

          menuStore.importItems(normalized)
          importMessage.value = `导入完成：${normalized.length} 项`
        } else {
          importMessage.value = '格式错误：必须是数组'
        }
      } catch (err) {
        importMessage.value = '解析失败：文件不是合法 JSON'
      }
    }
    reader.readAsText(file)
  }
}

const addItem = async () => {
  if (!newItemName.value.trim()) return
  
  const tags = parseTags(newItemTags.value)
  
  await menuStore.addItem({
    id: crypto.randomUUID(),
    name: newItemName.value.trim(),
    tags: tags.length > 0 ? tags : undefined
  })
  
  newItemName.value = ''
  newItemTags.value = ''
  isAdding.value = false
}

const startEdit = (item: MenuItem) => {
  editingId.value = item.id
  editName.value = item.name
  editTags.value = (item.tags ?? []).join(' ')
}

const cancelEdit = () => {
  editingId.value = null
  editName.value = ''
  editTags.value = ''
}

const saveEdit = async (id: string) => {
  const name = editName.value.trim()
  if (!name) return
  const tags = parseTags(editTags.value)
  await menuStore.updateItem(id, { name, tags })
  cancelEdit()
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
      <input v-model="searchQuery" placeholder="搜索菜名/标签" class="input-search" />
      <span class="import-label">导入 JSON:</span>
      <input type="file" ref="fileInput" accept=".json" @change="handleFileUpload" />
    </div>

    <div v-if="importMessage" class="import-message">{{ importMessage }}</div>
    
    <div v-if="menuStore.items.length === 0">
      <p>暂无菜单，请添加或导入。</p>
    </div>
    <ul v-else class="items-container">
      <TransitionGroup name="list">
        <li v-for="item in filteredItems" :key="item.id" class="menu-item">
          <div class="item-info" v-if="editingId !== item.id">
            <span class="item-name">{{ item.name }}</span>
            <span v-if="item.tags" class="item-tags">
              <span v-for="tag in item.tags" :key="tag" class="tag">{{ tag }}</span>
            </span>
          </div>
          <div class="edit-row" v-else>
            <input v-model="editName" class="input-edit-name" @keyup.enter="saveEdit(item.id)" />
            <input v-model="editTags" class="input-edit-tags" @keyup.enter="saveEdit(item.id)" />
          </div>

          <div class="item-actions" v-if="editingId !== item.id">
            <button class="edit-btn" @click="startEdit(item)">编辑</button>
            <button @click="menuStore.removeItem(item.id)" class="del-btn">×</button>
          </div>
          <div class="item-actions" v-else>
            <button class="save-edit-btn" @click="saveEdit(item.id)" :disabled="!editName.trim()">保存</button>
            <button class="cancel-edit-btn" @click="cancelEdit">取消</button>
          </div>
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
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.input-search {
  flex: 1;
  min-width: 180px;
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  outline: none;
}

.input-search:focus {
  border-color: #667eea;
}

.import-message {
  margin-bottom: 12px;
  font-size: 0.9rem;
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
  gap: 12px;
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

.item-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.edit-btn {
  border: 1px solid #e2e8f0;
  background: white;
  color: #334155;
  padding: 6px 10px;
  border-radius: 8px;
  cursor: pointer;
}

.save-edit-btn {
  border: none;
  background: #42b883;
  color: white;
  padding: 6px 10px;
  border-radius: 8px;
  cursor: pointer;
}

.cancel-edit-btn {
  border: 1px solid #e2e8f0;
  background: white;
  color: #334155;
  padding: 6px 10px;
  border-radius: 8px;
  cursor: pointer;
}

.edit-row {
  display: flex;
  gap: 10px;
  flex: 1;
}

.input-edit-name, .input-edit-tags {
  padding: 8px 10px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  outline: none;
}

.input-edit-name {
  flex: 1;
  min-width: 140px;
}

.input-edit-tags {
  flex: 1;
  min-width: 140px;
}

.input-edit-name:focus, .input-edit-tags:focus {
  border-color: #667eea;
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
