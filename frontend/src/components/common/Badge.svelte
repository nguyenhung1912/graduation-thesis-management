<script>
  import { cn } from "../../lib/utils.js";

  let {
    variant = "secondary",
    text = "",
    class: className = "",
    children = undefined,
  } = $props();

  const variantStyles = {
    secondary: "bg-zinc-100 text-zinc-800 border-zinc-200",
    success: "bg-emerald-50 text-emerald-800 border-emerald-200",
    warning: "bg-amber-50 text-amber-800 border-amber-200",
    danger: "bg-rose-50 text-rose-800 border-rose-200",
    info: "bg-zinc-100 text-zinc-900 border-zinc-300",
  };
</script>

<span
  class={cn(
    "badge",
    `badge-${variant}`,
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium tracking-tight transition-colors",
    variantStyles[variant] || variantStyles.secondary,
    className,
  )}
>
  {#if text}
    {text}
  {/if}
  {#if children}
    {@render children()}
  {/if}
</span>
