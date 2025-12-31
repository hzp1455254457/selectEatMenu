<script setup lang="ts">
import { useSettingStore } from '../stores/settingStore'

const settingStore = useSettingStore()
</script>

<template>
  <div class="settings">
    <h2>设置</h2>
    <label class="setting-item">
      <span>冷却天数 (N天内不重复):</span>
      <input type="number" v-model.number="settingStore.cooldownDays" @change="settingStore.setCooldownDays(settingStore.cooldownDays)" min="0" />
    </label>
  </div>
</template>

<style scoped>
.settings {
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-top: 1rem;
  background: white;
}
.setting-item {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>