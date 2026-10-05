<script>
  import Badge from "../common/Badge.svelte";
  import { Pencil, Trash2, Search } from "@lucide/svelte";

  /**
   * ThesisTable.svelte - Presentational Component (Dumb)
   * Hiển thị bảng danh sách đề tài và phát sự kiện sửa/xóa.
   */
  let { theses = [], onEdit = undefined, onDelete = undefined } = $props();

  let searchTerm = $state("");

  let filteredTheses = $derived(
    theses.filter((item) => {
      const term = searchTerm.toLowerCase().trim();
      if (!term) return true;
      return (
        item.id.toLowerCase().includes(term) ||
        item.title.toLowerCase().includes(term) ||
        item.instructor.toLowerCase().includes(term)
      );
    }),
  );
</script>

<div class="table-container w-full space-y-4">
  <div
    class="table-toolbar flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
  >
    <div class="search-box relative w-full sm:w-80">
      <Search
        size={15}
        class="search-icon absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
      />
      <input
        type="search"
        placeholder="Tìm kiếm mã, tên đề tài, giảng viên..."
        bind:value={searchTerm}
        aria-label="Tìm kiếm đề tài"
        class="h-9 w-full rounded-md border border-zinc-200 bg-white pl-9 pr-3 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-950 transition-colors shadow-xs"
      />
    </div>
    <div class="count-badge text-sm text-zinc-600 font-medium">
      Hiển thị: <strong class="text-zinc-950 font-bold"
        >{filteredTheses.length}</strong
      >
      / {theses.length} đề tài
    </div>
  </div>

  <div
    class="overflow-auto rounded-lg border border-zinc-200 bg-white shadow-xs"
  >
    <table class="striped w-full text-left text-sm border-collapse">
      <thead>
        <tr
          class="border-b border-zinc-200 bg-zinc-50/75 text-xs font-medium text-zinc-600 uppercase tracking-wider"
        >
          <th scope="col" class="px-4 py-3 font-semibold text-zinc-700 w-28"
            >Mã ĐT</th
          >
          <th scope="col" class="px-4 py-3 font-semibold text-zinc-700"
            >Tên đề tài</th
          >
          <th scope="col" class="px-4 py-3 font-semibold text-zinc-700"
            >Giảng viên HD</th
          >
          <th
            scope="col"
            class="px-4 py-3 font-semibold text-zinc-700 text-center w-32"
            >Số lượng SV</th
          >
          <th
            scope="col"
            class="px-4 py-3 font-semibold text-zinc-700 text-center w-32"
            >Trạng thái</th
          >
          <th
            scope="col"
            class="px-4 py-3 font-semibold text-zinc-700 text-right w-28"
            >Thao tác</th
          >
        </tr>
      </thead>
      <tbody class="divide-y divide-zinc-100">
        {#if filteredTheses.length === 0}
          <tr>
            <td
              colspan="6"
              class="empty-state text-center py-10 px-4 text-zinc-400 italic text-sm"
            >
              Không có đề tài nào phù hợp.
            </td>
          </tr>
        {:else}
          {#each filteredTheses as thesis (thesis.id)}
            {@const isFull =
              (thesis.currentStudents ?? 0) >= (thesis.maxStudents ?? 0)}
            <tr class="hover:bg-zinc-50/60 transition-colors">
              <td
                class="px-4 py-3.5 font-medium text-zinc-900 font-mono text-xs"
                ><strong>{thesis.id}</strong></td
              >
              <td class="px-4 py-3.5 text-zinc-900 font-medium"
                >{thesis.title}</td
              >
              <td class="px-4 py-3.5 text-zinc-600 text-xs"
                >{thesis.instructor}</td
              >
              <td class="px-4 py-3.5 text-center">
                <code
                  class="rounded bg-zinc-100 px-2 py-0.5 text-xs text-zinc-800 font-mono"
                  >{thesis.currentStudents ?? 0} / {thesis.maxStudents}</code
                >
              </td>
              <td class="px-4 py-3.5 text-center">
                {#if isFull}
                  <Badge variant="danger" text="Đã đủ" />
                {:else}
                  <Badge variant="success" text="Còn nhận" />
                {/if}
              </td>
              <td class="px-4 py-3.5 text-right">
                <div
                  class="action-buttons inline-flex items-center gap-1.5 justify-end"
                >
                  {#if onEdit}
                    <button
                      type="button"
                      class="outline action-btn h-8 w-8 inline-flex items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 transition-colors cursor-pointer"
                      aria-label="Sửa đề tài {thesis.id}"
                      onclick={() => onEdit(thesis)}
                      title="Sửa đề tài"
                    >
                      <Pencil size={14} />
                    </button>
                  {/if}
                  {#if onDelete}
                    <button
                      type="button"
                      class="outline secondary action-btn danger-btn h-8 w-8 inline-flex items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors cursor-pointer"
                      aria-label="Xóa đề tài {thesis.id}"
                      onclick={() => onDelete(thesis)}
                      title="Xóa đề tài"
                    >
                      <Trash2 size={14} />
                    </button>
                  {/if}
                </div>
              </td>
            </tr>
          {/each}
        {/if}
      </tbody>
    </table>
  </div>
</div>
