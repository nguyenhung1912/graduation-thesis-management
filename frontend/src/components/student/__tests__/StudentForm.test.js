import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import StudentForm from '../StudentForm.svelte';

describe('StudentForm Component (Dumb Component Unit Tests)', () => {
  it('renders form fields with default values for new student', () => {
    render(StudentForm);

    expect(screen.getByLabelText(/mã số sinh viên/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/họ và tên sinh viên/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/lớp sinh hoạt/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/điểm gpa/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /lưu sinh viên/i })).toBeInTheDocument();
  });

  it('renders initialData and disables ID input when isEdit is true', () => {
    const existing = {
      studentId: 'SV01',
      fullName: 'Trần Văn An',
      className: 'CNTT01',
      email: 'an@soa.edu.vn',
      gpa: 3.2,
      eligible: true,
    };

    render(StudentForm, {
      props: {
        initialData: existing,
        isEdit: true,
      },
    });

    const idInput = screen.getByLabelText(/mã số sinh viên/i);
    expect(idInput).toHaveValue('SV01');
    expect(idInput).toBeDisabled();
    expect(screen.getByLabelText(/họ và tên sinh viên/i)).toHaveValue('Trần Văn An');
    expect(screen.getByRole('button', { name: /cập nhật sinh viên/i })).toBeInTheDocument();
  });

  it('validates empty inputs and shows error message', async () => {
    const onSubmitMock = vi.fn();
    render(StudentForm, {
      props: {
        onSubmit: onSubmitMock,
      },
    });

    const submitBtn = screen.getByRole('button', { name: /lưu sinh viên/i });
    await fireEvent.click(submitBtn);

    expect(screen.getByText(/vui lòng nhập mã số sinh viên/i)).toBeInTheDocument();
    expect(onSubmitMock).not.toHaveBeenCalled();
  });

  it('triggers onSubmit with clean data when inputs are valid', async () => {
    const onSubmitMock = vi.fn();
    render(StudentForm, {
      props: {
        onSubmit: onSubmitMock,
      },
    });

    await fireEvent.input(screen.getByLabelText(/mã số sinh viên/i), { target: { value: 'sv10' } });
    await fireEvent.input(screen.getByLabelText(/họ và tên sinh viên/i), { target: { value: 'Phạm Đức Trọng' } });
    await fireEvent.input(screen.getByLabelText(/lớp sinh hoạt/i), { target: { value: 'cntt03' } });
    await fireEvent.input(screen.getByLabelText(/điểm gpa/i), { target: { value: '3.6' } });

    const submitBtn = screen.getByRole('button', { name: /lưu sinh viên/i });
    await fireEvent.click(submitBtn);

    expect(onSubmitMock).toHaveBeenCalledWith({
      studentId: 'SV10',
      fullName: 'Phạm Đức Trọng',
      className: 'CNTT03',
      email: 'sv10@soa.edu.vn',
      gpa: 3.6,
      eligible: true,
    });
  });

  it('triggers onCancel when clicking cancel button', async () => {
    const onCancelMock = vi.fn();
    render(StudentForm, {
      props: {
        onCancel: onCancelMock,
      },
    });

    const cancelBtn = screen.getByRole('button', { name: /hủy bỏ/i });
    await fireEvent.click(cancelBtn);

    expect(onCancelMock).toHaveBeenCalledTimes(1);
  });
});