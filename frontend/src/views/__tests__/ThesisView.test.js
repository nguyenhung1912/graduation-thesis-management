import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import ThesisView from '../ThesisView.svelte';
import { thesisApi } from '../../api/thesisApi.js';

describe('ThesisView Container Component (Smart Component Tests)', () => {
  const sampleTheses = [
    { id: 'DT01', title: 'Hệ thống SOA', instructor: 'TS. A', maxStudents: 3, currentStudents: 1 },
  ];

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('explicitly loads and renders theses from thesisApi.getAll()', async () => {
    vi.spyOn(thesisApi, 'getAll').mockResolvedValue(sampleTheses);

    render(ThesisView);

    expect(thesisApi.getAll).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(screen.getByText('Hệ thống SOA')).toBeInTheDocument();
      expect(screen.getByText('DT01')).toBeInTheDocument();
    });
  });

  it('displays error alert when API call fails', async () => {
    vi.spyOn(thesisApi, 'getAll').mockRejectedValue(new Error('Mất kết nối cổng 8082'));

    render(ThesisView);

    await waitFor(() => {
      expect(screen.getByText(/mất kết nối cổng 8082/i)).toBeInTheDocument();
    });
  });

  it('opens create modal when clicking "Thêm đề tài mới"', async () => {
    vi.spyOn(thesisApi, 'getAll').mockResolvedValue(sampleTheses);

    render(ThesisView);

    const createBtn = screen.getByRole('button', { name: /thêm đề tài mới/i });
    await fireEvent.click(createBtn);

    expect(screen.getByText('Thêm đề tài tốt nghiệp mới')).toBeInTheDocument();
  });

  it('triggers reload when clicking "Làm mới"', async () => {
    vi.spyOn(thesisApi, 'getAll').mockResolvedValue(sampleTheses);

    render(ThesisView);

    const refreshBtn = screen.getByRole('button', { name: /tải lại danh sách/i });
    await fireEvent.click(refreshBtn);

    expect(thesisApi.getAll).toHaveBeenCalledTimes(2);
  });
});
