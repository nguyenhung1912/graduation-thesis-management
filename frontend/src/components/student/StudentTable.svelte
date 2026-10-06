<script>
  import Badge from '../common/Badge.svelte';
  import { Pencil, Trash2, Search } from '@lucide/svelte';

  /**
   * StudentTable.svelte - Presentational Component (Dumb)
   * Hiển thị danh sách sinh viên và trạng thái điều kiện làm đồ án tốt nghiệp.
   */
  let {
    students = [],
    onEdit = undefined,
    onDelete = undefined,
  } = $props();

  let searchTerm = $state('');

  let filteredStudents = $derived(
    students.filter((s) => {
      const term = searchTerm.toLowerCase().trim();
      if (!term) return true;
      return (
        s.studentId.toLowerCase().includes(term) ||
        s.fullName.toLowerCase().includes(term) ||
        (s.className && s.className.toLowerCase().includes(term)) ||
        (s.email && s.email.toLowerCase().includes(term))
      );
    })
  );

  function isEligible(student) {
    if (student.eligible !== undefined) return Boolean(student.eligible);
    if (student.gpa !== undefined) return student.gpa >= 2.5;
    return true;
  }
</script>

<div class="table-container w-full space-y-4">
  <div class="table-toolbar flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
    <div class="search-box relative w-full sm:w-80">
      <Search size={15} class="search-icon absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
      <input
        type="search"
        placeholder="Tìm kiếm MSSV, họ tên, lớp, email..."
        bind:value={searchTerm}
        aria-label="Tìm kiếm sinh viên"
        class="h-9 w-full rounded-md border border-zinc-200 bg-white pl-9 pr-3 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-950 transition-colors shadow-xs"
      />
    </div>
    <div class="count-badge text-sm text-zinc-600 font-medium">
      Hiển thị: <strong class="text-zinc-950 font-bold">{filteredStudents.length}</strong> / {students.length} sinh viên
    </div>
  </div>

  <div class="overflow-auto rounded-lg border border-zinc-200 bg-white shadow-xs">
    <table class="striped w-full text-left text-sm border-collapse">
      <thead>
        <tr class="border-b border-zinc-200 bg-zinc-50/75 text-xs font-medium text-zinc-600 uppercase tracking-wider">
          <th scope="col" class="px-4 py-3 font-semibold text-zinc-700 w-28">MSSV</th>
          <th scope="col" class="px-4 py-3 font-semibold text-zinc-700">Họ và tên</th>
          <th scope="col" class="px-4 py-3 font-semibold text-zinc-700 w-28">Lớp</th>
          <th scope="col" class="px-4 py-3 font-semibold text-zinc-700">Email</th>
          <th scope="col" class="px-4 py-3 font-semibold text-zinc-700 text-center w-24">GPA</th>
          <th scope="col" class="px-4 py-3 font-semibold text-zinc-700 text-center w-36">Điều kiện ĐATN</th>
          <th scope="col" class="px-4 py-3 font-semibold text-zinc-700 text-right w-28">Thao tác</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-zinc-100">
        {#if filteredStudents.length === 0}
          <tr>
            <td colspan="7" class="empty-state text-center py-10 px-4 text-zinc-400 italic text-sm">
              Không có sinh viên nào phù hợp.
            </td>
          </tr>
        {:else}
          {#each filteredStudents as student (student.studentId)}
            {@const eligible = isEligible(student)}
            <tr class="hover:bg-zinc-50/60 transition-colors">
              <td class="px-4 py-3.5 font-medium text-zinc-900 font-mono text-xs"><strong>{student.studentId}</strong></td>
              <td class="px-4 py-3.5 text-zinc-900 font-medium">{student.fullName}</td>
              <td class="px-4 py-3.5 text-zinc-600">
                <code class="rounded bg-zinc-100 px-2 py-0.5 text-xs text-zinc-700 font-mono">{student.className ?? 'N/A'}</code>
              </td>
              <td class="px-4 py-3.5 text-zinc-500 text-xs">{student.email ?? 'N/A'}</td>
              <td class="px-4 py-3.5 text-center text-xs font-semibold text-zinc-800">
                <strong>{student.gpa !== undefined ? Number(student.gpa).toFixed(2) : '-'}</strong>
              </td>
              <td class="px-4 py-3.5 text-center">
                {#if eligible}
                  <Badge variant="success" text="Đủ điều kiện" />
                {:else}
                  <Badge variant="danger" text="Chưa đủ ĐK" />
                {/if}
              </td>
              <td class="px-4 py-3.5 text-right">
                <div class="action-buttons inline-flex items-center gap-1.5 justify-end">
                  {#if onEdit}
                    <button
                      type="button"
                      class="outline action-btn h-8 w-8 inline-flex items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 transition-colors cursor-pointer"
                      aria-label="Sửa sinh viên {student.studentId}"
                      onclick={() => onEdit(student)}
                      title="Sửa sinh viên"
                    >
                      <Pencil size={14} />
                    </button>
                  {/if}
                  {#if onDelete}
                    <button
                      type="button"
                      class="outline secondary action-btn danger-btn h-8 w-8 inline-flex items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors cursor-pointer"
                      aria-label="Xóa sinh viên {student.studentId}"
                      onclick={() => onDelete(student)}
                      title="Xóa sinh viên"
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