import { ref } from 'vue';
import api from '../services/api';

export type RequestStatus = 'pending' | 'approved' | 'rejected';

export type VacationRequest = {
  id: number;
  startDate: string;
  endDate: string;
  reason: string;
  status: RequestStatus;
  user: {
    id: number;
    name: string;
    role: string;
  } | null;
};

const requests = ref<VacationRequest[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

export function useRequests() {
  const fetchRequests = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.get<VacationRequest[]>('/requests');
      requests.value = response.data;
    } catch (err) {
      error.value = 'Failed to load requests.';
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  const createRequest = async (payload: {
    userId: number;
    startDate: string;
    endDate: string;
    reason: string;
  }) => {
    try {
      const response = await api.post<VacationRequest>('/requests', payload);
      requests.value.unshift(response.data);
      return response.data;
    } catch (err) {
      console.error('Failed to create request', err);
      throw err;
    }
  };

  const updateRequestStatus = async (id: number, status: RequestStatus) => {
    try {
      await api.patch(`/requests/${id}`, { status });
      await fetchRequests();
    } catch (err) {
      console.error('Failed to update request status', err);
      throw err;
    }
  };

  const deleteRequest = async (id: number) => {
    try {
      await api.delete(`/requests/${id}`);
      await fetchRequests();
    } catch (err) {
      console.error('Failed to delete request', err);
      throw err;
    }
  };

  return {
    requests,
    loading,
    error,
    fetchRequests,
    createRequest,
    updateRequestStatus,
    deleteRequest,
  };
}
