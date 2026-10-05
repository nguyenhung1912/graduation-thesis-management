import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import App from '../App.svelte';
import { thesisApi } from '../api/thesisApi.js';
import { studentApi } from '../api/studentApi.js';
import { registrationApi } from '../api/registrationApi.js';

describe('App Shell Integration Tests', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(thesisApi, 'getAll').mockResolvedValue([]);
    vi.spyOn(studentApi, 'getAll').mockResolvedValue([]);
    vi.spyOn(registrationApi, 'getAll').mockResolvedValue([]);
  });

  it('renders application header, brand title, and default tab (ThesisView)', async () => {
    render(App);

    expect(screen.getByText('HỆ THỐNG QUẢN LÝ ĐỒ ÁN TỐT NGHIỆP')).toBeInTheDocument();
    expect(screen.getByText(/quản lý đề tài tốt nghiệp/i)).toBeInTheDocument();
  });

  it('switches between tabs when clicking tab buttons', async () => {
    render(App);

    // Switch to Student tab
    const studentTabBtn = screen.getByRole('button', { name: /quản lý sinh viên/i });
    await fireEvent.click(studentTabBtn);

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 2, name: /quản lý sinh viên/i })).toBeInTheDocument();
      expect(screen.getByText(/student-service \(port 8081\)/i)).toBeInTheDocument();
    });

    // Switch to Registration tab
    const regTabBtn = screen.getByRole('button', { name: /đăng ký & tính điểm/i });
    await fireEvent.click(regTabBtn);

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 2, name: /đăng ký đề tài & tính điểm/i })).toBeInTheDocument();
      expect(screen.getByText(/registration-service \(:8083\)/i)).toBeInTheDocument();
    });
  });
});
