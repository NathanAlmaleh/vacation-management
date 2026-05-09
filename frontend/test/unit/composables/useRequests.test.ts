import { describe, it, expect, vi, beforeEach } from 'vitest';
import api from '../../../src/services/api';
import { useRequests } from '../../../src/composables/useRequests';

vi.mock('../../../src/services/api', () => {
  return {
    default: {
      get: vi.fn(),
      post: vi.fn(),
      patch: vi.fn(),
      delete: vi.fn(),
    },
  };
});

describe('useRequests', () => {
  const mockedApi = api as unknown as {
    get: ReturnType<typeof vi.fn>;
    post: ReturnType<typeof vi.fn>;
    patch: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    mockedApi.get.mockReset();
    mockedApi.post.mockReset();
    mockedApi.patch.mockReset();
    mockedApi.delete.mockReset();
  });

  it('fetchRequests loads requests into state', async () => {
    mockedApi.get.mockResolvedValueOnce({
      data: [
        {
          id: 1,
          startDate: '2025-01-01',
          endDate: '2025-01-02',
          reason: 'Vacation',
          status: 'pending',
          user: { id: 10, name: 'Alice', role: 'requester' },
        },
      ],
    });

    const { fetchRequests, requests } = useRequests();
    await fetchRequests();

    expect(requests.value).toHaveLength(1);
    expect(requests.value[0].id).toBe(1);
  });

  it('createRequest posts and unshifts created request', async () => {
    mockedApi.post.mockResolvedValueOnce({
      data: {
        id: 2,
        startDate: '2025-02-01',
        endDate: '2025-02-03',
        reason: 'Trip',
        status: 'pending',
        user: { id: 1, name: 'Bob', role: 'requester' },
      },
    });

    mockedApi.get.mockResolvedValueOnce({ data: [] });

    const { createRequest, requests } = useRequests();
    await createRequest({
      userId: 1,
      startDate: '2025-02-01',
      endDate: '2025-02-03',
      reason: 'Trip',
    });

    expect(requests.value[0].id).toBe(2);
  });
});
