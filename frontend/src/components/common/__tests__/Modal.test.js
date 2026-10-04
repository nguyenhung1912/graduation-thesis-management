import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import Modal from '../Modal.svelte';

describe('Modal Component (Dumb Component Unit Tests)', () => {
  it('does not render dialog content when open is false', () => {
    const { container } = render(Modal, {
      props: {
        open: false,
        title: 'Thêm Đề Tài',
      },
    });

    expect(screen.queryByText('Thêm Đề Tài')).not.toBeInTheDocument();
    expect(container.querySelector('dialog')).toBeNull();
  });

  it('renders dialog and title when open is true, and handles close button click', async () => {
    const onCloseMock = vi.fn();
    render(Modal, {
      props: {
        open: true,
        title: 'Thêm Đề Tài',
        onClose: onCloseMock,
      },
    });

    expect(screen.getByText('Thêm Đề Tài')).toBeInTheDocument();
    const closeBtn = screen.getByRole('button', { name: /đóng/i });
    expect(closeBtn).toBeInTheDocument();

    await fireEvent.click(closeBtn);
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });
});
