import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import ScoreModal from '../ScoreModal.svelte';

describe('ScoreModal Component (Dumb Component Unit Tests)', () => {
  const sampleReg = {
    id: 'DK01',
    studentId: 'SV01',
    studentName: 'Nguyễn Văn Nam',
    thesisId: 'DT01',
    thesisTitle: 'SOA Spring',
    advisorScore: 8.0,
    reviewerScore: 7.0,
    defenseScore: 9.0,
  };

  it('renders scores and calculates preview total score correctly', () => {
    // Formula: (8 * 0.2) + (7 * 0.3) + (9 * 0.5) = 1.6 + 2.1 + 4.5 = 8.20
    render(ScoreModal, {
      props: {
        registration: sampleReg,
        open: true,
      },
    });

    expect(screen.getByText('Đánh giá & Chấm điểm đồ án')).toBeInTheDocument();
    expect(screen.getByText('8.20')).toBeInTheDocument();
    expect(screen.getByText(/ĐẠT \(PASSED\)/i)).toBeInTheDocument();
  });

  it('submits updated scores via onSave callback', async () => {
    const onSaveMock = vi.fn();
    render(ScoreModal, {
      props: {
        registration: sampleReg,
        open: true,
        onSave: onSaveMock,
      },
    });

    const submitBtn = screen.getByRole('button', { name: /lưu kết quả chấm điểm/i });
    await fireEvent.click(submitBtn);

    expect(onSaveMock).toHaveBeenCalledWith(
      expect.objectContaining({
        advisorScore: 8,
        reviewerScore: 7,
        defenseScore: 9,
        totalScore: 8.2,
        passed: true,
      })
    );
  });

  it('validates scores out of range (greater than 10)', async () => {
    const onSaveMock = vi.fn();
    render(ScoreModal, {
      props: {
        registration: sampleReg,
        open: true,
        onSave: onSaveMock,
      },
    });

    const advisorInput = screen.getByLabelText(/điểm gv hướng dẫn/i);
    await fireEvent.input(advisorInput, { target: { value: '15' } });

    const submitBtn = screen.getByRole('button', { name: /lưu kết quả chấm điểm/i });
    await fireEvent.click(submitBtn);

    expect(screen.getByText(/điểm gv hướng dẫn phải từ 0 đến 10/i)).toBeInTheDocument();
    expect(onSaveMock).not.toHaveBeenCalled();
  });
});
