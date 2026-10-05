import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import RegistrationForm from '../RegistrationForm.svelte';

describe('RegistrationForm Component (Dumb Component Unit Tests)', () => {
  const sampleStudents = [
    { id: 'SV01', fullName: 'Nguyễn Văn Nam', className: 'CNTT01', gpa: 3.5, eligible: true },
    { id: 'SV02', fullName: 'Lê Thị Mai', className: 'CNTT02', gpa: 3.8, eligible: true },
  ];

  const sampleTheses = [
    { id: 'DT01', title: 'SOA Spring', instructor: 'TS. A', maxStudents: 3, currentStudents: 1 },
    { id: 'DT02', title: 'Microservices', instructor: 'ThS. B', maxStudents: 2, currentStudents: 2 }, // Full!
  ];

  it('filters out already registered students and full theses', () => {
    render(RegistrationForm, {
      props: {
        students: sampleStudents,
        theses: sampleTheses,
        registeredStudentIds: ['SV01'], // SV01 already registered
      },
    });

    // Should only have SV02 in student dropdown
    const studentSelect = screen.getByLabelText(/chọn sinh viên đăng ký/i);
    expect(studentSelect).toBeInTheDocument();
    expect(screen.queryByText(/\[SV01\]/i)).not.toBeInTheDocument();
    expect(screen.getByText(/\[SV02\]/i)).toBeInTheDocument();

    // Should only have DT01 in thesis dropdown (DT02 is full)
    const thesisSelect = screen.getByLabelText(/chọn đề tài đồ án/i);
    expect(thesisSelect).toBeInTheDocument();
    expect(screen.getByText(/\[DT01\]/i)).toBeInTheDocument();
    expect(screen.queryByText(/\[DT02\]/i)).not.toBeInTheDocument();
  });

  it('validates selection and prevents submit when fields are empty', async () => {
    const onSubmitMock = vi.fn();
    render(RegistrationForm, {
      props: {
        students: sampleStudents,
        theses: sampleTheses,
        registeredStudentIds: [],
        onSubmit: onSubmitMock,
      },
    });

    const submitBtn = screen.getByRole('button', { name: /xác nhận đăng ký/i });
    await fireEvent.click(submitBtn);

    expect(screen.getByText(/vui lòng chọn sinh viên/i)).toBeInTheDocument();
    expect(onSubmitMock).not.toHaveBeenCalled();
  });

  it('triggers onSubmit with studentId and thesisId when selected', async () => {
    const onSubmitMock = vi.fn();
    render(RegistrationForm, {
      props: {
        students: sampleStudents,
        theses: sampleTheses,
        registeredStudentIds: [],
        onSubmit: onSubmitMock,
      },
    });

    const studentSelect = screen.getByLabelText(/chọn sinh viên đăng ký/i);
    await fireEvent.change(studentSelect, { target: { value: 'SV01' } });

    const thesisSelect = screen.getByLabelText(/chọn đề tài đồ án/i);
    await fireEvent.change(thesisSelect, { target: { value: 'DT01' } });

    const submitBtn = screen.getByRole('button', { name: /xác nhận đăng ký/i });
    await fireEvent.click(submitBtn);

    expect(onSubmitMock).toHaveBeenCalledWith(
      expect.objectContaining({
        studentId: 'SV01',
        thesisId: 'DT01',
      })
    );
  });

  it('triggers onCancel when clicking cancel button', async () => {
    const onCancelMock = vi.fn();
    render(RegistrationForm, {
      props: {
        students: sampleStudents,
        theses: sampleTheses,
        onCancel: onCancelMock,
      },
    });

    const cancelBtn = screen.getByRole('button', { name: /hủy bỏ/i });
    await fireEvent.click(cancelBtn);

    expect(onCancelMock).toHaveBeenCalledTimes(1);
  });
});
