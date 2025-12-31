<template>
  <main class="container">
    <h1>SelectEatMenu</h1>
    <p>Electron + Vue3 + TS + Vite 框架已就绪</p>
    <button type="button" @click="ping">Ping Preload</button>
    <p v-if="pong">{{ pong }}</p>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const pong = ref('')

const ping = async () => {
  pong.value = await window.openspecBridge.ping()
}
</script>

<style scoped>
.container {
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, 'Apple Color Emoji',
    'Segoe UI Emoji';
  padding: 24px;
}
</style>

