<script>
  import { cn } from "../../lib/utils.js";

  /**
   * Input component (shadcn Minimalist Monochrome style)
   */
  let {
    type = "text",
    value = $bindable(""),
    placeholder = "",
    disabled = false,
    required = false,
    class: className = "",
    ...restProps
  } = $props();
</script>

<input
  {type}
  bind:value
  {placeholder}
  {disabled}
  {required}
  class={cn(
    "flex h-9 w-full rounded-md border border-zinc-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:cursor-not-allowed disabled:opacity-50",
    className
  )}
  {...restProps}
/>
