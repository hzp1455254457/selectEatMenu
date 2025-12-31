<script setup lang="ts">
import { onMounted } from 'vue'
import MenuList from './components/MenuList.vue'
import Randomizer from './components/Randomizer.vue'
import HistoryList from './components/HistoryList.vue'
import Settings from './components/Settings.vue'
import { useMenuStore } from './stores/menuStore'
import { useHistoryStore } from './stores/historyStore'
import { useSettingStore } from './stores/settingStore'

const menuStore = useMenuStore()
const historyStore = useHistoryStore()
const settingStore = useSettingStore()

onMounted(async () => {
  await Promise.all([
    menuStore.loadItems(),
    historyStore.loadHistory(),
    settingStore.loadSettings()
  ])
})
</script>

<template>
  <div class="app-container">
    <div class="main-panel">
      <Randomizer />
      <Settings />
    </div>
    <div class="side-panel">
      <MenuList />
      <HistoryList />
    </div>
  </div>
</template>

<style>
body {
  margin: 0;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  color: #2c3e50;
  overflow: hidden;
}

.app-container {
  display: flex;
  gap: 24px;
  padding: 24px;
  height: 100vh;
  box-sizing: border-box;
  overflow: hidden;
}

.main-panel {
  flex: 2;
  min-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  overflow-y: auto;
  padding-right: 4px; /* Space for scrollbar */
}

.side-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-width: 320px;
  height: 100%;
  overflow: hidden;
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}
</style>