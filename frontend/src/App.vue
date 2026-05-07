<script setup lang="ts">
import Sidebar from './components/Sidebar.vue';
</script>

<template>
  <div class="app-shell">
    <Sidebar />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>
