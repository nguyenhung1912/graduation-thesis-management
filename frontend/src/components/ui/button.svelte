<script>
  import { cn } from "../../lib/utils.js";

  /**
   * Button component (shadcn Minimalist Monochrome style)
   */
  let {
    variant = "default",
    size = "default",
    type = "button",
    disabled = false,
    class: className = "",
    onclick = undefined,
    children = undefined,
    ...restProps
  } = $props();

  const variantClasses = {
    default: "bg-zinc-900 text-zinc-50 hover:bg-zinc-800 shadow-sm active:scale-[0.99]",
    secondary: "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 active:scale-[0.99]",
    outline: "border border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-900 shadow-sm active:scale-[0.99]",
    ghost: "hover:bg-zinc-100 text-zinc-900 active:bg-zinc-200",
    destructive: "bg-red-600 text-white hover:bg-red-700 shadow-sm active:scale-[0.99]",
    link: "text-zinc-900 underline-offset-4 hover:underline p-0 h-auto",
  };

  const sizeClasses = {
    default: "h-9 px-4 py-2 text-sm",
    sm: "h-8 px-3 text-xs rounded-md",
    lg: "h-10 px-6 text-base rounded-md",
    icon: "h-9 w-9 p-0",
  };
</script>

<button
  {type}
  {disabled}
  class={cn(
    "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none",
    variantClasses[variant] || variantClasses.default,
    sizeClasses[size] || sizeClasses.default,
    className
  )}
  {onclick}
  {...restProps}
>
  {#if children}
    {@render children()}
  {/if}
</button>
