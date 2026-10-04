<script>
  let { text = "Đang tải dữ liệu...", inline = false } = $props();
</script>

<div class="loading-wrapper" class:inline role="status">
  <span aria-busy="true"></span>
  {#if text}
    <span class="loading-text">{text}</span>
  {/if}
</div>

<style>
  .loading-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    padding: 2rem 1rem;
    color: var(--pico-muted-color, #718096);
    font-size: 0.95rem;
  }

  .loading-wrapper.inline {
    display: inline-flex;
    padding: 0;
  }

  .loading-text {
    font-style: italic;
  }
</style>
