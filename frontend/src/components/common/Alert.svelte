<script>
  import {
    Info,
    CircleCheck,
    TriangleAlert,
    CircleAlert,
    X,
  } from '@lucide/svelte';

  let {
    type = 'info',
    message = '',
    dismissible = false,
    onDismiss = undefined,
    children = undefined,
  } = $props();

  function handleDismiss() {
    if (onDismiss) {
      onDismiss();
    }
  }
</script>

<div class="alert alert-{type}" role="alert">
  <div class="alert-icon">
    {#if type === 'success'}
      <CircleCheck size={18} />
    {:else if type === 'warning'}
      <TriangleAlert size={18} />
    {:else if type === 'danger'}
      <CircleAlert size={18} />
    {:else}
      <Info size={18} />
    {/if}
  </div>

  <div class="alert-content">
    {#if message}
      <span>{message}</span>
    {/if}
    {#if children}
      {@render children()}
    {/if}
  </div>

  {#if dismissible}
    <button
      type="button"
      class="close-btn"
      aria-label="Đóng thông báo"
      onclick={handleDismiss}
    >
      <X size={16} />
    </button>
  {/if}
</div>

<style>
  .alert {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    margin-bottom: 1rem;
    border-radius: var(--pico-border-radius, 0.25rem);
    font-size: 0.925rem;
    border-left: 4px solid currentColor;
  }

  .alert-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .alert-info {
    background-color: var(--pico-card-background-color, #f4f6f8);
    color: var(--pico-primary, #0070f3);
    border-left-color: var(--pico-primary, #0070f3);
  }

  .alert-success {
    background-color: rgba(46, 125, 50, 0.1);
    color: #2e7d32;
    border-left-color: #2e7d32;
  }

  .alert-warning {
    background-color: rgba(237, 108, 2, 0.1);
    color: #ed6c02;
    border-left-color: #ed6c02;
  }

  .alert-danger {
    background-color: rgba(211, 47, 47, 0.1);
    color: #d32f2f;
    border-left-color: #d32f2f;
  }

  .alert-content {
    flex: 1;
  }

  .close-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    color: currentColor;
    cursor: pointer;
    padding: 0.25rem;
    margin: 0;
    width: auto;
    border-radius: var(--pico-border-radius, 0.25rem);
    opacity: 0.75;
    transition: opacity 0.2s;
  }

  .close-btn:hover {
    opacity: 1;
  }
</style>
