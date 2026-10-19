import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import RegistrationTable from '../RegistrationTable.svelte';

describe('RegistrationTable Component (Dumb Component Unit Tests)', () => {
  const sampleRegistrations = [
    {
      id: 'DK01',
      studentId: 'SV01',
      studentName: 'Nguyễn Văn Nam',
      thesisId: 'DT01',
      thesisTitle: 'SOA Spring Boot',
      status: 'Chờ phê duyệt',
    },
    {
      id: 'DK02',
      studentId: 'SV02',
      studentName: 'Lê Thị Mai',
      thesisId: 'DT02',
      thesisTitle: 'Microservices Arch',
      status: 'Đã chấp nhận',
    },
  ];

  it('renders registration rows with student, thesis, and status', () => {
    render(RegistrationTable, {
      props: {
        registrations: sampleRegistrations,
      },
    });

    expect(screen.getByText('DK01')).toBeInTheDocument();
    expect(screen.getByText('Nguyễn Văn Nam')).toBeInTheDocument();
    expect(screen.getByText('SOA Spring Boot')).toBeInTheDocument();
    expect(screen.getByText('Chờ phê duyệt')).toBeInTheDocument();

    expect(screen.getByText('DK02')).toBeInTheDocument();
    expect(screen.getByText('Lê Thị Mai')).toBeInTheDocument();
    expect(screen.getByText('Đã chấp nhận')).toBeInTheDocument();
  });

  it('displays empty state when registrations array is empty', () => {
    render(RegistrationTable, {
      props: {
        registrations: [],
      },
    });

    expect(screen.getByText('Không có lượt đăng ký nào.')).toBeInTheDocument();
  });

  it('filters registrations by search query', async () => {
    render(RegistrationTable, {
      props: {
        registrations: sampleRegistrations,
      },
    });

    const searchInput = screen.getByRole('searchbox', { name: /tìm kiếm lượt đăng ký/i });
    await fireEvent.input(searchInput, { target: { value: 'Mai' } });

    expect(screen.queryByText('Nguyễn Văn Nam')).not.toBeInTheDocument();
    expect(screen.getByText('Lê Thị Mai')).toBeInTheDocument();
  });

  it('triggers onEdit and onDelete callbacks when clicking action buttons', async () => {
    let editedReg = null;
    let deletedReg = null;

    render(RegistrationTable, {
      props: {
        registrations: sampleRegistrations,
        onEdit: (reg) => {
          editedReg = reg;
        },
        onDelete: (reg) => {
          deletedReg = reg;
        },
      },
    });

    const editBtn = screen.getByRole('button', { name: /sửa trạng thái đăng ký DK01/i });
    await fireEvent.click(editBtn);
    expect(editedReg).toEqual(sampleRegistrations[0]);

    const deleteBtn = screen.getByRole('button', { name: /xóa đăng ký DK02/i });
    await fireEvent.click(deleteBtn);
    expect(deletedReg).toEqual(sampleRegistrations[1]);
  });
});
