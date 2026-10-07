import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import Input from '../input.svelte';

describe('Input Component (shadcn UI Primitives)', () => {
  it('renders input with placeholder and default styling', () => {
    render(Input, {
      props: {
        placeholder: 'Nhập tên đề tài...',
      },
    });

    const input = screen.getByPlaceholderText('Nhập tên đề tài...');
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass('border-zinc-200');
  });

  it('renders disabled input when disabled prop is true', () => {
    render(Input, {
      props: {
        placeholder: 'Mã số',
        disabled: true,
      },
    });

    const input = screen.getByPlaceholderText('Mã số');
    expect(input).toBeDisabled();
  });
});
