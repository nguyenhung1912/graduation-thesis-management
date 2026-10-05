import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import ServiceHealthMonitor from '../ServiceHealthMonitor.svelte';
import { httpClient, ApiError } from '../../../api/httpClient.js';

describe('ServiceHealthMonitor Component (Bonus Feature Tests)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders all 3 microservice chips (:8081, :8082, :8083)', async () => {
    vi.spyOn(httpClient, 'get').mockResolvedValue([]);

    render(ServiceHealthMonitor);

    await waitFor(() => {
      expect(screen.getByText(':8081')).toBeInTheDocument();
      expect(screen.getByText(':8082')).toBeInTheDocument();
      expect(screen.getByText(':8083')).toBeInTheDocument();
    });
  });

  it('sets status to offline when service is down (status 0)', async () => {
    vi.spyOn(httpClient, 'get').mockRejectedValue(new ApiError(0, 'Connection refused'));

    render(ServiceHealthMonitor);

    await waitFor(() => {
      const offBadges = screen.getAllByText('OFF');
      expect(offBadges.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('triggers re-check when clicking reping button', async () => {
    vi.spyOn(httpClient, 'get').mockResolvedValue([]);

    render(ServiceHealthMonitor);

    const refreshBtn = screen.getByRole('button', { name: /kiểm tra lại kết nối service/i });
    await fireEvent.click(refreshBtn);

    // Initial check (3 calls) + Reping (3 calls) = 6 calls
    expect(httpClient.get).toHaveBeenCalledTimes(6);
  });
});
