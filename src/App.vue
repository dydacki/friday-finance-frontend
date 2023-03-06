<template>
  <div
    id="app"
    class="h-full overflow-y-auto">
    <NavBar />
    <div class="router">
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
</script>

<style scoped>
.router {
  margin-top: 46px;
}
</style>
