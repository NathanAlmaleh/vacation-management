<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <h2 class="sidebar-label">Connected user</h2>
      <select
        v-model="selectedUserId"
        @change="onUserChange"
        class="user-select"
      >
        <option value="">Select user</option>
        <option v-for="user in users" :key="user.id" :value="String(user.id)">
          {{ user.name }} — {{ user.role }}
        </option>
      </select>
      <div v-if="currentUser" class="current-user-meta">
        <img :src="avatar" alt="User Avatar" class="current-user-avatar" />
        <span class="current-user-name">{{ currentUser.name }}</span>
        <small class="current-user-role">{{ currentUser.role }}</small>
      </div>
      <div v-if="loading" class="sidebar-note">Loading users…</div>
      <div v-if="error" class="sidebar-error">{{ error }}</div>
    </div>

    <nav class="sidebar-nav">
      <h2 class="nav-title">Navigation</h2>
      <router-link to="/requests" class="nav-link" active-class="active-link"
        >📊 Requests Dashboard</router-link
      >
      <router-link to="/users" class="nav-link" active-class="active-link"
        >👥 Users Management</router-link
      >
    </nav>
  </aside>
</template>

<script setup lang="ts">
import avatar from '../assets/default-avatar.jpg';
import { onMounted, ref, watch } from 'vue';
import { useUsers } from '../composables/useUsers';
import { useCurrentUser } from '../composables/useCurrentUser';

const { users, loading, error, fetchUsers, findUserById } = useUsers();
const { currentUser, setCurrentUser, loadCurrentUser } = useCurrentUser();
const selectedUserId = ref<string>('');

const onUserChange = () => {
  const id = Number(selectedUserId.value);
  const user = findUserById(id);
  setCurrentUser(user);
};

onMounted(async () => {
  loadCurrentUser();
  await fetchUsers();

  if (currentUser.value) {
    selectedUserId.value = String(currentUser.value.id);
  } else if (users.value.length > 0) {
    setCurrentUser(users.value[0]);
    selectedUserId.value = String(users.value[0].id);
  }
});

watch(users, (newUsers) => {
  if (!currentUser.value && newUsers.length > 0) {
    setCurrentUser(newUsers[0]);
    selectedUserId.value = String(newUsers[0].id);
  }
});

watch(currentUser, (current) => {
  selectedUserId.value = current ? String(current.id) : '';
});
</script>
