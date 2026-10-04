<script>
  let { variant = "secondary", text = "", children = undefined } = $props();
</script>

<span class="badge badge-{variant}">
  {#if text}
    {text}
  {/if}
  {#if children}
    {@render children()}
  {/if}
</span>

<style>
  .badge {
    display: inline-block;
    padding: 0.2rem 0.55rem;
    font-size: 0.775rem;
    font-weight: 600;
    line-height: 1;
    text-align: center;
    white-space: nowrap;
    vertical-align: baseline;
    border-radius: 9999px;
  }

  .badge-secondary {
    background-color: var(--pico-secondary-background, #88888820);
    color: var(--pico-secondary, #666666);
  }

  .badge-success {
    background-color: rgba(46, 125, 50, 0.15);
    color: #2e7d32;
  }

  .badge-warning {
    background-color: rgba(237, 108, 2, 0.15);
    color: #d97706;
  }

  .badge-danger {
    background-color: rgba(211, 47, 47, 0.15);
    color: #d32f2f;
  }

  .badge-info {
    background-color: rgba(2, 136, 209, 0.15);
    color: #0288d1;
  }
</style>
