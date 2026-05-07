<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUsers } from '../composables/useUsers';

const { users, loading, error, fetchUsers, createUser, deleteUser } =
  useUsers();

const newUser = ref({
  name: '',
  role: 'requester' as const,
});
const formError = ref<string | null>(null);
const submitInProgress = ref(false);

const handleCreateUser = async () => {
  formError.value = null;
  if (!newUser.value.name.trim()) {
    formError.value = 'Please enter a user name.';
    return;
  }

  submitInProgress.value = true;
  try {
    await createUser({
      name: newUser.value.name.trim(),
      role: newUser.value.role,
    });

    newUser.value = {
      name: '',
      role: 'requester',
    };
  } catch {
    formError.value = 'Unable to create the user. Please try again.';
  } finally {
    submitInProgress.value = false;
  }
};

onMounted(fetchUsers);
</script>

<template>
  <section class="page-shell">
    <div class="page-header">
      <div>
        <h1>Users Management</h1>
        <p class="muted">
          Add new users and see the full list of everyone in the system.
        </p>
      </div>
    </div>

    <div class="card user-panel">
      <h2>Create a new user</h2>
      <div class="form-grid two-columns">
        <label>
          Name
          <input v-model="newUser.name" type="text" placeholder="Enter name" />
        </label>

        <label>
          Role
          <select v-model="newUser.role">
            <option value="requester">Requester</option>
            <option value="validator">Validator</option>
          </select>
        </label>
      </div>

      <div class="form-actions">
        <button
          class="primary"
          @click="handleCreateUser"
          :disabled="submitInProgress"
        >
          {{ submitInProgress ? 'Saving...' : 'Create user' }}
        </button>
        <p class="error-message" v-if="formError">{{ formError }}</p>
      </div>
    </div>

    <div class="card users-list-panel">
      <div class="dashboard-header">
        <h2>All users</h2>
        <p class="muted">
          The user selector in the left sidebar will choose the current active
          user.
        </p>
      </div>

      <div v-if="loading" class="empty-state">Loading users…</div>
      <div v-else-if="error" class="error-message">{{ error }}</div>
      <ul v-else class="user-list">
        <li v-for="user in users" :key="user.id" class="user-list-item">
          <div class="user-list-details">
            <p class="user-name">{{ user.name }}</p>
            <span class="user-role badge" :class="user.role">{{
              user.role
            }}</span>
          </div>
          <button class="delete-button" @click="deleteUser(user.id)">
            Delete
          </button>
        </li>
      </ul>
    </div>
  </section>
</template>
