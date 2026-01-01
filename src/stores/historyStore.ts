import { defineStore } from 'pinia'
import { useSettingStore } from './settingStore'

export interface HistoryEntry {
  id: string
  menuItemId: string
  menuItemName: string
  eatenAt: string // ISO date
}

export const useHistoryStore = defineStore('history', {
  state: () => ({
    entries: [] as HistoryEntry[]
  }),
  actions: {
    async saveHistory() {
      await window.openspecBridge.store.set('historyEntries', JSON.parse(JSON.stringify(this.entries)))
    },
    pruneEntries(retentionDays: number) {
      if (!Number.isFinite(retentionDays) || retentionDays <= 0) return
      const now = Date.now()
      const keepMs = retentionDays * 24 * 60 * 60 * 1000
      this.entries = this.entries.filter(e => {
        const t = new Date(e.eatenAt).getTime()
        if (!Number.isFinite(t)) return false
        return now - t <= keepMs
      })
    },
    async applyRetentionPolicy() {
      const settingStore = useSettingStore()
      this.pruneEntries(settingStore.historyRetentionDays)
      await this.saveHistory()
    },
    async loadHistory() {
      const stored = await window.openspecBridge.store.get('historyEntries')
      if (stored) {
        this.entries = stored
      }
      await this.applyRetentionPolicy()
    },
    async addEntry(entry: HistoryEntry) {
      // Add to beginning
      this.entries.unshift(entry)
      await this.applyRetentionPolicy()
    },
    async clearHistory() {
      this.entries = []
      await window.openspecBridge.store.set('historyEntries', [])
    }
  }
})
