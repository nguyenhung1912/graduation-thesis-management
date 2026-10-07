<script>
  import Badge from '../common/Badge.svelte';
  import { Award, Trash2, Search } from '@lucide/svelte';

  /**
   * RegistrationTable.svelte - Presentational Component (Dumb)
   * Hiển thị bảng đăng ký đồ án và kết quả chấm điểm tốt nghiệp.
   */
  let {
    registrations = [],
    onGrade = undefined,
    onDelete = undefined,
  } = $props();

  let searchTerm = $state('');

  let filteredRegistrations = $derived(
    registrations.filter((r) => {
      const term = searchTerm.toLowerCase().trim();
      if (!term) return true;
      return (
        r.id.toLowerCase().includes(term) ||
        r.studentId.toLowerCase().includes(term) ||
        (r.studentName && r.studentName.toLowerCase().includes(term)) ||
        r.thesisId.toLowerCase().includes(term) ||
        (r.thesisTitle && r.thesisTitle.toLowerCase().includes(term))
      );
    })
  );
</script>

<div class="table-container w-full space-y-4">
  <div class="table-toolbar flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
    <div class="search-box relative w-full sm:w-80">
      <Search size={15} class="search-icon absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
      <input
        type="search"
        placeholder="Tìm kiếm mã ĐK, MSSV, tên SV, mã ĐT..."
        bind:value={searchTerm}
        aria-label="Tìm kiếm lượt đăng ký"
        class="h-9 w-full rounded-md border border-zinc-200 bg-white pl-9 pr-3 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-950 transition-colors shadow-xs"
      />
    </div>
    <div class="count-badge text-sm text-zinc-600 font-medium">
      Hiển thị: <strong class="text-zinc-950 font-bold">{filteredRegistrations.length}</strong> / {registrations.length} đăng ký
    </div>
  </div>

  <div class="overflow-auto rounded-lg border border-zinc-200 bg-white shadow-xs">
    <table class="striped w-full text-left text-sm border-collapse">
      <thead>
        <tr class="border-b border-zinc-200 bg-zinc-50/75 text-xs font-medium text-zinc-600 uppercase tracking-wider">
          <th scope="col" class="px-4 py-3 font-semibold text-zinc-700 w-24">Mã ĐK</th>
          <th scope="col" class="px-4 py-3 font-semibold text-zinc-700">Sinh viên</th>
          <th scope="col" class="px-4 py-3 font-semibold text-zinc-700">Đề tài đồ án</th>
          <th scope="col" class="px-4 py-3 font-semibold text-zinc-700 w-28">Ngày ĐK</th>
          <th scope="col" class="px-4 py-3 font-semibold text-zinc-700 text-center w-20" title="Điểm Hướng Dẫn (20%)">Điểm HD</th>
          <th scope="col" class="px-4 py-3 font-semibold text-zinc-700 text-center w-20" title="Điểm Phản Biện (30%)">Điểm PB</th>
          <th scope="col" class="px-4 py-3 font-semibold text-zinc-700 text-center w-20" title="Điểm Bảo Vệ Hội Đồng (50%)">Điểm BV</th>
          <th scope="col" class="px-4 py-3 font-semibold text-zinc-700 text-center w-36">Điểm TK & Kết quả</th>
          <th scope="col" class="px-4 py-3 font-semibold text-zinc-700 text-right w-24">Thao tác</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-zinc-100">
        {#if filteredRegistrations.length === 0}
          <tr>
            <td colspan="9" class="empty-state text-center py-10 px-4 text-zinc-400 italic text-sm">
              Không có lượt đăng ký nào.
            </td>
          </tr>
        {:else}
          {#each filteredRegistrations as reg (reg.id)}
            {@const hasScore = reg.totalScore !== undefined && reg.totalScore !== null}
            {@const passed = hasScore && Number(reg.totalScore) >= 5.0}
            <tr class="hover:bg-zinc-50/60 transition-colors">
              <td class="px-4 py-3.5 font-medium text-zinc-900 font-mono text-xs"><strong>{reg.id}</strong></td>
              <td class="px-4 py-3.5 text-zinc-900">
                <strong class="font-medium">{reg.studentName ?? reg.studentId}</strong>
                {#if reg.studentName}
                  <br /><small class="sub-text text-zinc-400 text-xs font-mono">{reg.studentId}</small>
                {/if}
              </td>
              <td class="px-4 py-3.5 text-zinc-800">
                <span class="font-medium">{reg.thesisTitle ?? reg.thesisId}</span>
                {#if reg.thesisTitle}
                  <br /><small class="sub-text text-zinc-400 text-xs font-mono">Mã ĐT: {reg.thesisId}</small>
                {/if}
              </td>
              <td class="px-4 py-3.5 text-zinc-500 text-xs">{reg.registrationDate ?? 'Hôm nay'}</td>
              <td class="px-4 py-3.5 text-center text-xs text-zinc-700 font-mono">
                {reg.advisorScore !== undefined && reg.advisorScore !== null ? Number(reg.advisorScore).toFixed(1) : '-'}
              </td>
              <td class="px-4 py-3.5 text-center text-xs text-zinc-700 font-mono">
                {reg.reviewerScore !== undefined && reg.reviewerScore !== null ? Number(reg.reviewerScore).toFixed(1) : '-'}
              </td>
              <td class="px-4 py-3.5 text-center text-xs text-zinc-700 font-mono">
                {reg.defenseScore !== undefined && reg.defenseScore !== null ? Number(reg.defenseScore).toFixed(1) : '-'}
              </td>
              <td class="px-4 py-3.5 text-center">
                {#if hasScore}
                  <div class="inline-flex items-center gap-1.5 justify-center">
                    <span class="total-score-text font-bold text-zinc-900 font-mono">{Number(reg.totalScore).toFixed(2)}</span>
                    {#if passed}
                      <Badge variant="success" text="Đạt" />
                    {:else}
                      <Badge variant="danger" text="Không đạt" />
                    {/if}
                  </div>
                {:else}
                  <Badge variant="secondary" text="Chờ chấm" />
                {/if}
              </td>
              <td class="px-4 py-3.5 text-right">
                <div class="action-buttons inline-flex items-center gap-1.5 justify-end">
                  {#if onGrade}
                    <button
                      type="button"
                      class="outline action-btn h-8 w-8 inline-flex items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 transition-colors cursor-pointer"
                      aria-label="Chấm điểm đăng ký {reg.id}"
                      onclick={() => onGrade(reg)}
                      title="Nhập / Sửa điểm"
                    >
                      <Award size={14} />
                    </button>
                  {/if}
                  {#if onDelete}
                    <button
                      type="button"
                      class="outline secondary action-btn danger-btn h-8 w-8 inline-flex items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors cursor-pointer"
                      aria-label="Hủy đăng ký {reg.id}"
                      onclick={() => onDelete(reg)}
                      title="Hủy đăng ký"
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
