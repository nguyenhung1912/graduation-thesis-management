import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import Badge from '../Badge.svelte';

describe('Badge Component (Dumb Component Unit Tests)', () => {
  it('renders badge text and specific variant class', () => {
    const { container } = render(Badge, {
      props: {
        variant: 'success',
        text: 'Còn chỗ',
      },
    });

    expect(screen.getByText('Còn chỗ')).toBeInTheDocument();
    const badgeSpan = container.querySelector('.badge-success');
    expect(badgeSpan).not.toBeNull();
  });

  it('renders secondary variant by default', () => {
    const { container } = render(Badge, {
      props: {
        text: 'Chờ duyệt',
      },
    });

    const badgeSpan = container.querySelector('.badge-secondary');
    expect(badgeSpan).not.toBeNull();
  });
});
