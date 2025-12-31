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
  background-color: #f5f7fa;
}

.app-container {
  display: flex;
  gap: 20px;
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
  min-height: 100vh;
}

.main-panel {
  flex: 2;
  min-width: 0;
}

.side-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 300px;
}
</style>