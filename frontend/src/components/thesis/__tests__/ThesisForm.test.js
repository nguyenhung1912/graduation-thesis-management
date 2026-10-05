import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import ThesisForm from '../ThesisForm.svelte';

describe('ThesisForm Component (Dumb Component Unit Tests)', () => {
  it('renders form fields with default values for new thesis', () => {
    render(ThesisForm);

    expect(screen.getByLabelText(/mã đề tài/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tên đề tài/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/giảng viên hướng dẫn/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /lưu đề tài/i })).toBeInTheDocument();
  });

  it('renders initialData and disables ID input when isEdit is true', () => {
    const existing = {
      id: 'DT01',
      title: 'Hệ thống SOA',
      instructor: 'TS. Nguyễn Văn A',
      maxStudents: 3,
      currentStudents: 1,
    };

    render(ThesisForm, {
      props: {
        initialData: existing,
        isEdit: true,
      },
    });

    const idInput = screen.getByLabelText(/mã đề tài/i);
    expect(idInput).toHaveValue('DT01');
    expect(idInput).toBeDisabled();
    expect(screen.getByLabelText(/tên đề tài/i)).toHaveValue('Hệ thống SOA');
    expect(screen.getByRole('button', { name: /cập nhật đề tài/i })).toBeInTheDocument();
  });

  it('validates empty inputs and prevents submit', async () => {
    const onSubmitMock = vi.fn();
    render(ThesisForm, {
      props: {
        onSubmit: onSubmitMock,
      },
    });

    const submitBtn = screen.getByRole('button', { name: /lưu đề tài/i });
    await fireEvent.click(submitBtn);

    expect(screen.getByText(/vui lòng nhập mã đề tài/i)).toBeInTheDocument();
    expect(onSubmitMock).not.toHaveBeenCalled();
  });

  it('triggers onSubmit with clean data when valid', async () => {
    const onSubmitMock = vi.fn();
    render(ThesisForm, {
      props: {
        onSubmit: onSubmitMock,
      },
    });

    await fireEvent.input(screen.getByLabelText(/mã đề tài/i), { target: { value: 'dt05' } });
    await fireEvent.input(screen.getByLabelText(/tên đề tài/i), { target: { value: 'Big Data Processing' } });
    await fireEvent.input(screen.getByLabelText(/giảng viên hướng dẫn/i), { target: { value: 'PGS. TS. Trần' } });
    await fireEvent.input(screen.getByLabelText(/số lượng sinh viên tối đa/i), { target: { value: '4' } });

    const submitBtn = screen.getByRole('button', { name: /lưu đề tài/i });
    await fireEvent.click(submitBtn);

    expect(onSubmitMock).toHaveBeenCalledWith({
      id: 'DT05',
      title: 'Big Data Processing',
      instructor: 'PGS. TS. Trần',
      maxStudents: 4,
      currentStudents: 0,
    });
  });

  it('triggers onCancel when clicking cancel button', async () => {
    const onCancelMock = vi.fn();
    render(ThesisForm, {
      props: {
        onCancel: onCancelMock,
      },
    });

    const cancelBtn = screen.getByRole('button', { name: /hủy bỏ/i });
    await fireEvent.click(cancelBtn);

    expect(onCancelMock).toHaveBeenCalledTimes(1);
  });
});
