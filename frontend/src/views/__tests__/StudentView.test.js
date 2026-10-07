import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import StudentView from '../StudentView.svelte';
import { studentApi } from '../../api/studentApi.js';

describe('StudentView Container Component (Smart Component Tests)', () => {
  const sampleStudents = [
    { studentId: 'SV01', fullName: 'Nguyễn Văn Nam', className: 'CNTT01', email: 'nam@soa.edu.vn', gpa: 3.5, eligible: true },
  ];

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('explicitly loads and renders students from studentApi.getAll()', async () => {
    vi.spyOn(studentApi, 'getAll').mockResolvedValue(sampleStudents);

    render(StudentView);

    expect(studentApi.getAll).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(screen.getByText('Nguyễn Văn Nam')).toBeInTheDocument();
      expect(screen.getByText('SV01')).toBeInTheDocument();
    });
  });

  it('displays error alert when studentApi fails', async () => {
    vi.spyOn(studentApi, 'getAll').mockRejectedValue(new Error('Mất kết nối cổng 8081'));

    render(StudentView);

    await waitFor(() => {
      expect(screen.getByText(/mất kết nối cổng 8081/i)).toBeInTheDocument();
    });
  });

  it('opens create modal when clicking "Thêm sinh viên"', async () => {
    vi.spyOn(studentApi, 'getAll').mockResolvedValue(sampleStudents);

    render(StudentView);

    const createBtn = screen.getByRole('button', { name: /thêm sinh viên/i });
    await fireEvent.click(createBtn);

    expect(screen.getByText('Thêm sinh viên mới')).toBeInTheDocument();
  });

  it('triggers reload when clicking "Làm mới"', async () => {
    vi.spyOn(studentApi, 'getAll').mockResolvedValue(sampleStudents);

    render(StudentView);

    const refreshBtn = screen.getByRole('button', { name: /tải lại danh sách sinh viên/i });
    await fireEvent.click(refreshBtn);

    expect(studentApi.getAll).toHaveBeenCalledTimes(2);
  });
});