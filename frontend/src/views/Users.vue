<script setup lang="ts">
import { ref, onMounted} from "vue";
import api from "../services/api";


type Role = "requester" | "validator";

type User = {
  id: number;
  name: string;
  role: Role;
};

const users = ref<User[]>([]);

const newUser = ref({
  name: "",
  role: "requester" as Role,
});

/** Fetch users from backend */
const fetchUsers = async () => {
  const res = await api.get("/users");
  users.value = res.data;
};

/** Create user */
const createUser = async () => {
  try {
    if (!newUser.value.name.trim()) {
      return;
    }

    const res = await api.post("/users", {
      name: newUser.value.name,
      role: newUser.value.role,
    });

    // add newly created user to list
    users.value.push(res.data);

    // reset form
    newUser.value = {
      name: "",
      role: "requester",
    };
  } catch (err) {
    console.error("Failed to create user", err);
  }
};

onMounted(fetchUsers);

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