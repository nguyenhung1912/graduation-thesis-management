<script>
  import { X } from "@lucide/svelte";

  let {
    open = false,
    title = "",
    onClose = undefined,
    children = undefined,
    footer = undefined,
  } = $props();

  function handleClose() {
    if (onClose) {
      onClose();
    }
  }

  function handleBackdropClick(event) {
    if (event.target === event.currentTarget) {
      handleClose();
    }
  }
</script>

{#if open}
  <dialog open onclick={handleBackdropClick}>
    <article>
      <header>
        <button
          type="button"
          aria-label="Đóng"
          class="modal-close-btn"
          onclick={handleClose}
        >
          <X size={18} />
        </button>
        <h3>{title}</h3>
      </header>

      <div class="modal-body">
        {#if children}
          {@render children()}
        {/if}
      </div>

      {#if footer}
        <footer>
          {@render footer()}
        </footer>
      {/if}
    </article>
  </dialog>
{/if}

<style>
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  header h3 {
    margin: 0;
    font-size: 1.25rem;
    order: 1;
  }
  .modal-close-btn {
    order: 2;
    background: transparent;
    border: none;
    padding: 0.25rem;
    margin: 0;
    width: auto;
    color: var(--pico-muted-color, #888);
    cursor: pointer;
    line-height: 1;
  }
  .modal-close-btn:hover {
    color: var(--pico-color, #111);
  }
  .modal-body {
    margin: 1rem 0;
  }
</style>
