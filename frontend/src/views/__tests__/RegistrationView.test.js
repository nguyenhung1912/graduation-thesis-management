import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import RegistrationView from '../RegistrationView.svelte';
import { registrationApi } from '../../modules/registration/api/registrationApi.js';
import { studentApi } from '../../modules/student/api/studentApi.js';
import { thesisApi } from '../../modules/thesis/api/thesisApi.js';

describe('RegistrationView Container Component (Smart Component Tests)', () => {
  const sampleRegistrations = [
    { id: 'DK01', studentId: 'SV01', thesisId: 'DT01', registrationDate: '2026-10-05', totalScore: 8.5 },
  ];
  const sampleStudents = [
    { id: 'SV01', fullName: 'Nguyễn Văn Nam', className: 'CNTT01', gpa: 3.5, eligible: true },
  ];
  const sampleTheses = [
    { id: 'DT01', title: 'SOA Spring', instructor: 'TS. A', maxStudents: 3, currentStudents: 1 },
  ];

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('orchestrates data from all 3 services and displays combined table', async () => {
    vi.spyOn(registrationApi, 'getAll').mockResolvedValue(sampleRegistrations);
    vi.spyOn(studentApi, 'getAll').mockResolvedValue(sampleStudents);
    vi.spyOn(thesisApi, 'getAll').mockResolvedValue(sampleTheses);

    render(RegistrationView);

    expect(registrationApi.getAll).toHaveBeenCalledTimes(1);
    expect(studentApi.getAll).toHaveBeenCalledTimes(1);
    expect(thesisApi.getAll).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(screen.getByText('DK01')).toBeInTheDocument();
      expect(screen.getByText('Nguyễn Văn Nam')).toBeInTheDocument();
      expect(screen.getByText('SOA Spring')).toBeInTheDocument();
    });
  });

  it('displays warning when one of the microservices fails', async () => {
    vi.spyOn(registrationApi, 'getAll').mockResolvedValue(sampleRegistrations);
    vi.spyOn(studentApi, 'getAll').mockRejectedValue(new Error('Connection refused'));
    vi.spyOn(thesisApi, 'getAll').mockResolvedValue(sampleTheses);

    render(RegistrationView);

    await waitFor(() => {
      expect(screen.getByText(/không thể kết nối đến: student-service/i)).toBeInTheDocument();
    });
  });

  it('opens registration modal when clicking "Đăng ký đề tài"', async () => {
    vi.spyOn(registrationApi, 'getAll').mockResolvedValue(sampleRegistrations);
    vi.spyOn(studentApi, 'getAll').mockResolvedValue(sampleStudents);
    vi.spyOn(thesisApi, 'getAll').mockResolvedValue(sampleTheses);

    render(RegistrationView);

    const openBtn = screen.getByRole('button', { name: /đăng ký đề tài/i });
    await fireEvent.click(openBtn);

    expect(screen.getByText('Đăng ký Đề tài Tốt nghiệp')).toBeInTheDocument();
  });

  it('triggers reload when clicking "Làm mới"', async () => {
    vi.spyOn(registrationApi, 'getAll').mockResolvedValue(sampleRegistrations);
    vi.spyOn(studentApi, 'getAll').mockResolvedValue(sampleStudents);
    vi.spyOn(thesisApi, 'getAll').mockResolvedValue(sampleTheses);

    render(RegistrationView);

    const refreshBtn = screen.getByRole('button', { name: /tải lại dữ liệu đăng ký/i });
    await fireEvent.click(refreshBtn);

    expect(registrationApi.getAll).toHaveBeenCalledTimes(2);
  });

  it('correctly maps studentName when student object has studentId instead of id', async () => {
    const realStudents = [
      { studentId: 'SV01', fullName: 'Nguyễn Văn Nam', className: 'CNTT01', gpa: 3.5, eligible: true },
    ];
    vi.spyOn(registrationApi, 'getAll').mockResolvedValue(sampleRegistrations);
    vi.spyOn(studentApi, 'getAll').mockResolvedValue(realStudents);
    vi.spyOn(thesisApi, 'getAll').mockResolvedValue(sampleTheses);

    render(RegistrationView);

    await waitFor(() => {
      expect(screen.getByText('Nguyễn Văn Nam')).toBeInTheDocument();
    });
  });

  it('opens status update modal and calls registrationApi.updateStatus on submit', async () => {
    vi.spyOn(registrationApi, 'getAll').mockResolvedValue(sampleRegistrations);
    vi.spyOn(studentApi, 'getAll').mockResolvedValue(sampleStudents);
    vi.spyOn(thesisApi, 'getAll').mockResolvedValue(sampleTheses);
    const updateSpy = vi
      .spyOn(registrationApi, 'updateStatus')
      .mockResolvedValue({ ...sampleRegistrations[0], status: 'Đã duyệt' });

    render(RegistrationView);

    const editBtn = await screen.findByRole('button', { name: /sửa trạng thái đăng ký DK01/i });
    await fireEvent.click(editBtn);

    expect(screen.getByText('Cập nhật trạng thái đăng ký')).toBeInTheDocument();

    const selectEl = screen.getByLabelText(/^trạng thái đăng ký/i);
    await fireEvent.change(selectEl, { target: { value: 'Đã duyệt' } });

    const saveBtn = screen.getByRole('button', { name: /lưu trạng thái/i });
    await fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(updateSpy).toHaveBeenCalledWith('DK01', 'Đã duyệt');
    });
  });

  it('opens delete modal and calls registrationApi.delete on confirm', async () => {
    vi.spyOn(registrationApi, 'getAll').mockResolvedValue(sampleRegistrations);
    vi.spyOn(studentApi, 'getAll').mockResolvedValue(sampleStudents);
    vi.spyOn(thesisApi, 'getAll').mockResolvedValue(sampleTheses);
    const deleteSpy = vi.spyOn(registrationApi, 'delete').mockResolvedValue(null);

    render(RegistrationView);

    const deleteBtn = await screen.findByRole('button', { name: /xóa đăng ký DK01/i });
    await fireEvent.click(deleteBtn);

    expect(screen.getByText('Xác nhận xóa đăng ký')).toBeInTheDocument();

    const confirmBtn = screen.getByRole('button', { name: /xác nhận xóa/i });
    await fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(deleteSpy).toHaveBeenCalledWith('DK01');
    });
  });
});
