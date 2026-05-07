<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useCurrentUser } from "../composables/useCurrentUser";
import { useRequests, type RequestStatus } from "../composables/useRequests";

const { currentUser } = useCurrentUser();
const { requests, loading, error, fetchRequests, createRequest, updateRequestStatus, deleteRequest } = useRequests();

const form = ref({
  startDate: "",
  endDate: "",
  reason: "",
});
const submitError = ref<string | null>(null);
const submitInProgress = ref(false);

const selectedUserName = computed(() => currentUser.value?.name ?? "No user selected");

const canApprove = (request: { status: RequestStatus }) => {
  return currentUser.value?.role === "validator" && request.status === "pending";
};

const submit = async () => {
  submitError.value = null;
  if (!currentUser.value) {
    submitError.value = "Please select a connected user before creating a request.";
    return;
  }

  if (!form.value.startDate || !form.value.endDate || !form.value.reason.trim()) {
    submitError.value = "Start date, end date, and reason are required.";
    return;
  }

  if (form.value.endDate < form.value.startDate) {
    submitError.value = "End date cannot be before start date.";
    return;
  }

  submitInProgress.value = true;

  try {
    await createRequest({
      userId: currentUser.value.id,
      startDate: form.value.startDate,
      endDate: form.value.endDate,
      reason: form.value.reason.trim(),
    });

    form.value = { startDate: "", endDate: "", reason: "" };
  } catch {
    submitError.value = "Unable to create the request. Please try again.";
  } finally {
    submitInProgress.value = false;
  }
};

const changeRequestStatus = async (id: number, status: RequestStatus) => {
  try {
    await updateRequestStatus(id, status);
  } catch (err) {
    console.error(err);
  }
};

const canDelete = () => currentUser.value?.role === "validator";

const removeRequest = async (id: number) => {
  try {
    await deleteRequest(id);
  } catch (err) {
    console.error(err);
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return dateString;
  }
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

onMounted(fetchRequests);
</script>

<template>
  <section class="page-shell">
    <div class="page-header">
      <div>
        <h1>Request Time Off</h1>
        <p class="muted">Connected user: <strong>{{ selectedUserName }}</strong></p>
      </div>
      <div class="status-pill" v-if="currentUser?.role">{{ currentUser?.role }}</div>
    </div>

    <div class="card request-panel">
      <h2>New vacation request</h2>
      <div class="form-grid">
        <label>
          Start date
          <input v-model="form.startDate" type="date" />
        </label>

        <label>
          End date
          <input v-model="form.endDate" type="date" />
        </label>

        <label class="full-width">
          Reason
          <textarea v-model="form.reason" rows="4" placeholder="Explain why you need time off"></textarea>
        </label>
      </div>

      <div class="form-actions">
        <button class="primary" @click="submit" :disabled="submitInProgress">
          {{ submitInProgress ? "Submitting..." : "Submit request" }}
        </button>
        <p class="error-message" v-if="submitError">{{ submitError }}</p>
      </div>
    </div>

    <div class="card requests-dashboard">
      <div class="dashboard-header">
        <h2>Requests dashboard</h2>
        <p class="muted">Only a validator can approve or reject pending requests.</p>
      </div>

      <div v-if="loading" class="empty-state">Loading requests…</div>
      <div v-else-if="error" class="error-message">{{ error }}</div>
      <div v-else-if="requests.length === 0" class="empty-state">No requests have been submitted yet.</div>

      <div class="request-list">
        <article v-for="request in requests" :key="request.id" class="request-card">
          <div class="request-meta">
            <div>
              <span class="request-user">{{ request.user?.name ?? "Unknown user" }}</span>
              <span class="request-status" :class="['status-' + request.status]">{{ request.status }}</span>
            </div>
          </div>

          <p class="request-reason">{{ request.reason }}</p>

          <div class="request-footer">
            <p class="request-dates">
              {{ formatDate(request.startDate) }} → {{ formatDate(request.endDate) }}
            </p>
            <button
              v-if="canDelete()"
              class="delete-button"
              @click="removeRequest(request.id)"
            >
              Remove
            </button>
          </div>

          <div class="request-actions">
            <button
              v-if="canApprove(request)"
              class="secondary"
              @click="changeRequestStatus(request.id, 'approved')"
            >
              Approve
            </button>
            <button
              v-if="canApprove(request)"
              class="secondary reject"
              @click="changeRequestStatus(request.id, 'rejected')"
            >
              Reject
            </button>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>