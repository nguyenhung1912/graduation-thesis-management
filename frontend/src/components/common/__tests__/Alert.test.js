import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import Alert from '../Alert.svelte';

describe('Alert Component (Dumb Component Unit Tests)', () => {
  it('renders message text and default alert class', () => {
    const { container } = render(Alert, {
      props: {
        type: 'danger',
        message: 'Có lỗi xảy ra khi kết nối Service',
      },
    });

    expect(screen.getByText('Có lỗi xảy ra khi kết nối Service')).toBeInTheDocument();
    const alertDiv = container.querySelector('.alert-danger');
    expect(alertDiv).not.toBeNull();
  });

  it('renders dismiss button when dismissible is true and calls onDismiss', async () => {
    const onDismissMock = vi.fn();
    render(Alert, {
      props: {
        type: 'success',
        message: 'Lưu thành công',
        dismissible: true,
        onDismiss: onDismissMock,
      },
    });

    const closeBtn = screen.getByRole('button', { name: /đóng thông báo/i });
    expect(closeBtn).toBeInTheDocument();

    await fireEvent.click(closeBtn);
    expect(onDismissMock).toHaveBeenCalledTimes(1);
  });
});
