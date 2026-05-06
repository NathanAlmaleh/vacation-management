<script setup lang="ts">
import { ref } from "vue";

type Role = "requester" | "validator";

const users = ref([
  { id: 1, name: "Alice", role: "requester" },
  { id: 2, name: "Bob", role: "validator" },
]);

const newUser = ref({
  name: "",
  role: "requester" as Role,
});

const createUser = () => {
  users.value.push({
    id: users.value.length + 1,
    name: newUser.value.name,
    role: newUser.value.role,
  });

  newUser.value = { name: "", role: "requester" };
};
</script>

<template>
  <div>
    <h1>Users</h1>

    <input v-model="newUser.name" placeholder="Name" />

    <select v-model="newUser.role">
      <option value="requester">Requester</option>
      <option value="validator">Validator</option>
    </select>

    <button @click="createUser">Create User</button>

    <hr />

    <ul>
      <li v-for="u in users" :key="u.id">
        {{ u.name }} - {{ u.role }}
      </li>
    </ul>
  </div>
</template>