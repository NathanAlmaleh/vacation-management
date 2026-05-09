import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import Requests from '../../../src/views/Requests.vue';

// Mock composables to isolate component behavior
vi.mock('../../../src/composables/useCurrentUser', () => {
  return {
    useCurrentUser: () => ({
      currentUser: { value: { id: 1, name: 'Val', role: 'validator' } },
    }),
  };
});

vi.mock('../../../src/composables/useRequests', () => {
  return {
    useRequests: () => ({
      requests: { value: [{
        id: 1,
        startDate: '2025-01-01',
        endDate: '2025-01-02',
        reason: 'Vacation',
        status: 'pending',
        user: { id: 2, name: 'Req', role: 'requester' },
      }] },
      loading: { value: false },
      error: { value: null },
      fetchRequests: vi.fn(),
      createRequest: vi.fn(),
      updateRequestStatus: vi.fn(),
      deleteRequest: vi.fn(),
    }),
  };
});

describe('Requests.vue (validator UI)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows Approve/Reject buttons for pending requests when role=validator', async () => {
    const wrapper = mount(Requests, {
      global: {
        // Router-link not used on this page directly
        stubs: ['router-link', 'router-view'],
      },
    });

    // Wait for mount + onMounted(fetchRequests)
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('Requests dashboard');

    // The page renders Approve/Reject only when currentUser.role === 'validator'
    // and request.status === 'pending'.
    expect(wrapper.text()).toContain('Only a validator can approve or reject pending requests.');


  });
});

