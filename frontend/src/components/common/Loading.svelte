<script>
  import { Loader2 } from "@lucide/svelte";
  import { cn } from "../../lib/utils.js";

  let { text = "Đang tải dữ liệu...", inline = false, class: className = "" } = $props();
</script>

<div
  class={cn(
    "loading-wrapper flex items-center justify-center gap-2.5 text-zinc-500 text-sm",
    inline ? "inline-flex py-0 px-1" : "py-8 px-4",
    className
  )}
  role="status"
>
  <span aria-busy="true" class="inline-flex items-center justify-center">
    <Loader2 size={18} class="animate-spin text-zinc-800" />
  </span>
  {#if text}
    <span class="loading-text italic text-zinc-600 font-normal">{text}</span>
  {/if}
</div>
