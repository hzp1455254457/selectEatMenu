import { defineStore } from 'pinia'

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
    async loadHistory() {
      const stored = await window.openspecBridge.store.get('historyEntries')
      if (stored) {
        this.entries = stored
      }
    },
    async addEntry(entry: HistoryEntry) {
      // Add to beginning
      this.entries.unshift(entry)
      await window.openspecBridge.store.set('historyEntries', this.entries)
    },
    async clearHistory() {
      this.entries = []
      await window.openspecBridge.store.set('historyEntries', this.entries)
    }
  }
})