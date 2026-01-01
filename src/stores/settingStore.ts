import { defineStore } from 'pinia'

export const useSettingStore = defineStore('settings', {
  state: () => ({
    cooldownDays: 3,
    historyRetentionDays: 90
  }),
  actions: {
    async loadSettings() {
      const stored = await window.openspecBridge.store.get('settings')
      if (stored) {
        if (stored.cooldownDays !== undefined) this.cooldownDays = stored.cooldownDays
        if (stored.historyRetentionDays !== undefined) this.historyRetentionDays = stored.historyRetentionDays
      }
    },
    async persist() {
      await window.openspecBridge.store.set('settings', {
        cooldownDays: this.cooldownDays,
        historyRetentionDays: this.historyRetentionDays
      })
    },
    async setCooldownDays(days: number) {
      this.cooldownDays = days
      await this.persist()
    },
    async setHistoryRetentionDays(days: number) {
      this.historyRetentionDays = days
      await this.persist()
    }
  }
})
