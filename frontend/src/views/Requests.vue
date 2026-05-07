<script setup lang="ts">
import { ref, onMounted } from "vue";
import api from "../services/api";

type Status = "pending" | "approved" | "rejected";

const requests = ref<any[]>([]);
const users = ref<{ id: number; name: string }[]>([]);

const form = ref({
  userId: "",
  startDate: "",
  endDate: "",
  reason: "",
});

const fetchRequests = async () => {
  const res = await api.get("/requests");
  requests.value = res.data;
};

const submit = async () => {
  await api.post("/requests", {
    ...form.value,
    userId: Number(form.value.userId),
  });
  form.value = { userId: "", startDate: "", endDate: "", reason: "" };
  fetchRequests();
};

const updateStatus = async (id: number, status: Status) => {
  await api.patch(`/requests/${id}`, { status });
  fetchRequests();
};

const fetchUsers = async () => {
  const res = await api.get(`/users/`);
  users.value = res.data;
};

onMounted(() => {
  fetchRequests();
  fetchUsers();
});
</script>

<template>
  <div>
    <h1>Vacation Requests</h1>

    <select v-model="form.userId">
      <option disabled value="">Select user</option>
      <option v-for="user in users" :key="user.id" :value="String(user.id)">
        {{ user.name }}
      </option>
    </select>

    <input v-model="form.startDate" type="date" />
    <input v-model="form.endDate" type="date" />
    <input v-model="form.reason" placeholder="Reason" />

    <button @click="submit">Create</button>

    <hr />

    <div
      v-for="r in requests"
      :key="r.id"
      style="border:1px solid #ccc; padding:10px; margin-bottom:10px;"
    >
      <p>
        <b>{{ r.user?.name }}</b> - {{ r.status }}
      </p>

      <p>{{ r.startDate }} → {{ r.endDate }}</p>

      <p>{{ r.reason }}</p>

      <button
        v-if="r.status === 'pending'"
        @click="updateStatus(r.id, 'approved')"
      >
        Approve
      </button>

      <button
        v-if="r.status === 'pending'"
        @click="updateStatus(r.id, 'rejected')"
      >
        Reject
      </button>
    </div>
  </div>
</template>