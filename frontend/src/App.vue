<template>
  <div style="font-family: sans-serif;">
    <nav style="display:flex; gap:10px; padding:10px; border-bottom:1px solid #ccc;">
      <router-link to="/requests">Requests time off</router-link>
      <router-link to="/users">Add Users</router-link>
    </nav>

    <div style="padding: 20px;">
      <router-view />
    </div>
  </div>
</template>