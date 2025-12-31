import { defineStore } from 'pinia'

export interface MenuItem {
  id: string
  name: string
  tags?: string[]
}

export const useMenuStore = defineStore('menu', {
  state: () => ({
    items: [] as MenuItem[]
  }),
  actions: {
    async loadItems() {
      const stored = await window.openspecBridge.store.get('menuItems')
      if (stored) {
        this.items = stored
      }
    },
    async saveItems() {
      // Ensure we are saving a plain object, not a Proxy
      await window.openspecBridge.store.set('menuItems', JSON.parse(JSON.stringify(this.items)))
    },
    async importItems(newItems: MenuItem[]) {
      this.items = newItems
      await this.saveItems()
    },
    async addItem(item: MenuItem) {
      this.items.push(item)
      await this.saveItems()
    },
    async removeItem(id: string) {
      this.items = this.items.filter(i => i.id !== id)
      await this.saveItems()
    }
  }
})