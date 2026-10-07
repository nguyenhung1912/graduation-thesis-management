import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import StudentTable from '../StudentTable.svelte';

describe('StudentTable Component (Dumb Component Unit Tests)', () => {
  const sampleStudents = [
    { id: 'SV01', fullName: 'Trần Văn An', className: 'CNTT01', email: 'an@soa.edu.vn', gpa: 3.2, eligible: true },
    { id: 'SV02', fullName: 'Lê Thị Bình', className: 'CNTT02', email: 'binh@soa.edu.vn', gpa: 2.1, eligible: false },
  ];

  it('renders student data and calculates eligibility badge', () => {
    render(StudentTable, {
      props: {
        students: sampleStudents,
      },
    });

    expect(screen.getByText('SV01')).toBeInTheDocument();
    expect(screen.getByText('Trần Văn An')).toBeInTheDocument();
    expect(screen.getByText('3.20')).toBeInTheDocument();
    expect(screen.getByText('Đủ điều kiện')).toBeInTheDocument();

    expect(screen.getByText('SV02')).toBeInTheDocument();
    expect(screen.getByText('2.10')).toBeInTheDocument();
    expect(screen.getByText('Chưa đủ ĐK')).toBeInTheDocument();
  });

  it('displays empty state when student list is empty', () => {
    render(StudentTable, {
      props: {
        students: [],
      },
    });

    expect(screen.getByText('Không có sinh viên nào phù hợp.')).toBeInTheDocument();
  });

  it('triggers onEdit callback when clicking edit button', async () => {
    const onEditMock = vi.fn();
    render(StudentTable, {
      props: {
        students: sampleStudents,
        onEdit: onEditMock,
      },
    });

    const editBtn = screen.getByRole('button', { name: /sửa sinh viên SV01/i });
    await fireEvent.click(editBtn);

    expect(onEditMock).toHaveBeenCalledTimes(1);
    expect(onEditMock).toHaveBeenCalledWith(sampleStudents[0]);
  });

  it('triggers onDelete callback when clicking delete button', async () => {
    const onDeleteMock = vi.fn();
    render(StudentTable, {
      props: {
        students: sampleStudents,
        onDelete: onDeleteMock,
      },
    });

    const deleteBtn = screen.getByRole('button', { name: /xóa sinh viên SV02/i });
    await fireEvent.click(deleteBtn);

    expect(onDeleteMock).toHaveBeenCalledTimes(1);
    expect(onDeleteMock).toHaveBeenCalledWith(sampleStudents[1]);
  });

  it('filters students by search input', async () => {
    render(StudentTable, {
      props: {
        students: sampleStudents,
      },
    });

    const searchInput = screen.getByRole('searchbox', { name: /tìm kiếm sinh viên/i });
    await fireEvent.input(searchInput, { target: { value: 'Bình' } });

    expect(screen.queryByText('Trần Văn An')).not.toBeInTheDocument();
    expect(screen.getByText('Lê Thị Bình')).toBeInTheDocument();
  });
});
