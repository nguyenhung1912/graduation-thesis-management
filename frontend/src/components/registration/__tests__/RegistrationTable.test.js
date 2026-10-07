import { describe, it, expect, vi } from 'vitest';
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
      registrationDate: '2026-10-05',
      advisorScore: 8.5,
      reviewerScore: 8.0,
      defenseScore: 9.0,
      totalScore: 8.6,
    },
    {
      id: 'DK02',
      studentId: 'SV02',
      studentName: 'Lê Thị Mai',
      thesisId: 'DT02',
      thesisTitle: 'Microservices Arch',
      registrationDate: '2026-10-05',
      totalScore: null,
    },
  ];

  it('renders registration rows with student, thesis, and scores', () => {
    render(RegistrationTable, {
      props: {
        registrations: sampleRegistrations,
      },
    });

    expect(screen.getByText('DK01')).toBeInTheDocument();
    expect(screen.getByText('Nguyễn Văn Nam')).toBeInTheDocument();
    expect(screen.getByText('SOA Spring Boot')).toBeInTheDocument();
    expect(screen.getByText('8.60')).toBeInTheDocument();
    expect(screen.getByText('Đạt')).toBeInTheDocument();

    expect(screen.getByText('DK02')).toBeInTheDocument();
    expect(screen.getByText('Lê Thị Mai')).toBeInTheDocument();
    expect(screen.getByText('Chờ chấm')).toBeInTheDocument();
  });

  it('displays empty state when registrations array is empty', () => {
    render(RegistrationTable, {
      props: {
        registrations: [],
      },
    });

    expect(screen.getByText('Không có lượt đăng ký nào.')).toBeInTheDocument();
  });

  it('triggers onGrade when clicking grade button', async () => {
    const onGradeMock = vi.fn();
    render(RegistrationTable, {
      props: {
        registrations: sampleRegistrations,
        onGrade: onGradeMock,
      },
    });

    const gradeBtn = screen.getByRole('button', { name: /chấm điểm đăng ký DK01/i });
    await fireEvent.click(gradeBtn);

    expect(onGradeMock).toHaveBeenCalledTimes(1);
    expect(onGradeMock).toHaveBeenCalledWith(sampleRegistrations[0]);
  });

  it('triggers onDelete when clicking cancel registration button', async () => {
    const onDeleteMock = vi.fn();
    render(RegistrationTable, {
      props: {
        registrations: sampleRegistrations,
        onDelete: onDeleteMock,
      },
    });

    const deleteBtn = screen.getByRole('button', { name: /hủy đăng ký DK02/i });
    await fireEvent.click(deleteBtn);

    expect(onDeleteMock).toHaveBeenCalledTimes(1);
    expect(onDeleteMock).toHaveBeenCalledWith(sampleRegistrations[1]);
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
});
