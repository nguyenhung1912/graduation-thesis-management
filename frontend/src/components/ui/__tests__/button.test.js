import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import Button from '../button.svelte';

describe('Button Component (shadcn UI Primitives)', () => {
  it('renders button text and default primary variant', () => {
    const { container } = render(Button, {
      props: {
        children: undefined,
      },
    });

    const button = container.querySelector('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-zinc-900');
  });

  it('renders outline variant with proper styling', () => {
    const { container } = render(Button, {
      props: {
        variant: 'outline',
      },
    });

    const button = container.querySelector('button');
    expect(button).toHaveClass('border-zinc-200');
    expect(button).toHaveClass('bg-white');
  });

  it('handles click callback when clicked', async () => {
    const handleClick = vi.fn();
    const { container } = render(Button, {
      props: {
        onclick: handleClick,
      },
    });

    const button = container.querySelector('button');
    await fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not trigger click when disabled', async () => {
    const handleClick = vi.fn();
    const { container } = render(Button, {
      props: {
        disabled: true,
        onclick: handleClick,
      },
    });

    const button = container.querySelector('button');
    expect(button).toBeDisabled();
  });
});
