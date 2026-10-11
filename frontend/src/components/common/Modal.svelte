<script>
  import { X } from "@lucide/svelte";
  import { cn } from "../../lib/utils.js";

  let {
    open = false,
    title = "",
    onClose = undefined,
    children = undefined,
    footer = undefined,
    class: className = "",
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
  <dialog
    open
    onclick={handleBackdropClick}
    class="fixed inset-0 z-50 m-0 h-full w-full max-h-none max-w-none border-0 bg-black/40 backdrop-blur-xs p-4 flex items-center justify-center outline-none animate-in fade-in duration-150"
  >
    <article
      class={cn(
        "relative w-full max-w-lg rounded-xl border border-zinc-200 bg-white p-6 shadow-2xl text-zinc-900 transition-all",
        className,
      )}
    >
      <header
        class="flex items-center justify-between pb-3 border-b border-zinc-100"
      >
        <h3 class="text-lg font-semibold tracking-tight text-zinc-900 m-0">
          {title}
        </h3>
        <button
          type="button"
          aria-label="Đóng"
          class="modal-close-btn rounded-md p-1 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
          onclick={handleClose}
        >
          <X size={18} />
        </button>
      </header>

      <div class="modal-body py-4 text-sm text-zinc-700">
        {#if children}
          {@render children()}
        {/if}
      </div>

      {#if footer}
        <footer
          class="flex items-center justify-end gap-2.5 pt-3 border-t border-zinc-100"
        >
          {@render footer()}
        </footer>
      {/if}
    </article>
  </dialog>
{/if}
