import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import Loading from '../Loading.svelte';

describe('Loading Component (Dumb Component Unit Tests)', () => {
  it('renders default loading text and aria-busy element', () => {
    const { container } = render(Loading);

    expect(screen.getByText('Đang tải dữ liệu...')).toBeInTheDocument();
    const busyElem = container.querySelector('[aria-busy="true"]');
    expect(busyElem).not.toBeNull();
  });

  it('renders custom loading text', () => {
    render(Loading, {
      props: {
        text: 'Đang kết nối tới Thesis Service...',
      },
    });

    expect(screen.getByText('Đang kết nối tới Thesis Service...')).toBeInTheDocument();
  });
});
