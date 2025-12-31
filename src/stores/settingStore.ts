import { defineStore } from 'pinia'

export const useSettingStore = defineStore('settings', {
  state: () => ({
    cooldownDays: 3
  }),
  actions: {
    async loadSettings() {
      const stored = await window.openspecBridge.store.get('settings')
      if (stored) {
        if (stored.cooldownDays !== undefined) this.cooldownDays = stored.cooldownDays
      }
    },
    async setCooldownDays(days: number) {
      this.cooldownDays = days
      await window.openspecBridge.store.set('settings', { cooldownDays: days })
    }
  }
})