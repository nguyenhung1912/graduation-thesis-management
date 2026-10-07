<script>
  import {
    Info,
    CircleCheck,
    TriangleAlert,
    CircleAlert,
    X,
  } from "@lucide/svelte";
  import { cn } from "../../lib/utils.js";

  let {
    type = "info",
    message = "",
    dismissible = false,
    onDismiss = undefined,
    class: className = "",
    children = undefined,
  } = $props();

  function handleDismiss() {
    if (onDismiss) {
      onDismiss();
    }
  }

  const typeStyles = {
    info: "bg-zinc-50 border-zinc-200 text-zinc-900 [&>svg]:text-zinc-900",
    success: "bg-emerald-50/60 border-emerald-200 text-emerald-900 [&>svg]:text-emerald-700",
    warning: "bg-amber-50/60 border-amber-200 text-amber-900 [&>svg]:text-amber-700",
    danger: "bg-rose-50/60 border-rose-200 text-rose-900 [&>svg]:text-rose-700",
  };
</script>

<div
  role="alert"
  class={cn(
    "alert",
    `alert-${type}`,
    "relative flex w-full items-start gap-3 rounded-lg border p-3.5 text-sm shadow-xs transition-all",
    typeStyles[type] || typeStyles.info,
    className
  )}
>
  <div class="alert-icon flex shrink-0 items-center justify-center pt-0.5">
    {#if type === "success"}
      <CircleCheck size={18} />
    {:else if type === "warning"}
      <TriangleAlert size={18} />
    {:else if type === "danger"}
      <CircleAlert size={18} />
    {:else}
      <Info size={18} />
    {/if}
  </div>

  <div class="alert-content flex-1 leading-relaxed">
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
      class="close-btn shrink-0 rounded-md p-1 text-zinc-500 hover:text-zinc-900 hover:bg-black/5 transition-colors cursor-pointer"
      aria-label="Đóng thông báo"
      onclick={handleDismiss}
    >
      <X size={15} />
    </button>
  {/if}
</div>
