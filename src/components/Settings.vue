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
  padding: 1.5rem;
  border-radius: 16px;
  background: white;
  margin-top: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid #f1f5f9;
}

.settings h2 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #1e293b;
  font-size: 1.5rem;
}

.setting-item {
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 1rem;
  color: #4a5568;
}

.setting-item input {
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  width: 80px;
  font-size: 1rem;
  outline: none;
  transition: all 0.2s;
}

.setting-item input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}
</style>