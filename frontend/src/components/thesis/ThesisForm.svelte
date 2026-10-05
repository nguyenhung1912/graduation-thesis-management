<script>
  import { Save, X } from '@lucide/svelte';

  /**
   * ThesisForm.svelte - Presentational Component (Dumb)
   * Quản lý nhập liệu và xác thực form Đề tài trước khi phát sự kiện onSubmit.
   */
  let {
    initialData = null,
    isEdit = false,
    isSubmitting = false,
    onSubmit = undefined,
    onCancel = undefined,
  } = $props();

  // svelte-ignore state_referenced_locally
  let id = $state(initialData?.id ?? '');
  // svelte-ignore state_referenced_locally
  let title = $state(initialData?.title ?? '');
  // svelte-ignore state_referenced_locally
  let instructor = $state(initialData?.instructor ?? '');
  // svelte-ignore state_referenced_locally
  let maxStudents = $state(initialData?.maxStudents ?? 3);
  let errorMessage = $state('');

  function handleSubmit(event) {
    event.preventDefault();
    errorMessage = '';

    const cleanId = id.trim().toUpperCase();
    const cleanTitle = title.trim();
    const cleanInstructor = instructor.trim();
    const numMax = Number(maxStudents);

    if (!cleanId) {
      errorMessage = 'Vui lòng nhập mã đề tài (ví dụ: DT01).';
      return;
    }
    if (!cleanTitle) {
      errorMessage = 'Vui lòng nhập tên đề tài.';
      return;
    }
    if (!cleanInstructor) {
      errorMessage = 'Vui lòng nhập tên giảng viên hướng dẫn.';
      return;
    }
    if (isNaN(numMax) || numMax < 1) {
      errorMessage = 'Số lượng sinh viên tối đa phải từ 1 trở lên.';
      return;
    }

    if (onSubmit) {
      onSubmit({
        id: cleanId,
        title: cleanTitle,
        instructor: cleanInstructor,
        maxStudents: numMax,
        currentStudents: initialData?.currentStudents ?? 0,
      });
    }
  }
</script>

<form novalidate onsubmit={handleSubmit} class="thesis-form space-y-4">
  {#if errorMessage}
    <p class="form-error rounded-md border border-rose-200 bg-rose-50/70 p-3 text-xs text-rose-700 font-medium" role="alert">
      {errorMessage}
    </p>
  {/if}

  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div>
      <label for="thesis-id" class="block text-xs font-medium text-zinc-700 mb-1.5">
        Mã đề tài <span class="required text-rose-500 font-bold">*</span>
      </label>
      <input
        type="text"
        id="thesis-id"
        placeholder="DT01, DT02..."
        bind:value={id}
        disabled={isEdit || isSubmitting}
        required
        class="h-9 w-full rounded-md border border-zinc-200 bg-white px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-950 disabled:bg-zinc-100 disabled:text-zinc-400"
      />
      {#if isEdit}
        <small class="hint block text-xs text-zinc-400 mt-1">Mã đề tài là khóa chính, không thể thay đổi khi sửa.</small>
      {/if}
    </div>

    <div>
      <label for="thesis-max" class="block text-xs font-medium text-zinc-700 mb-1.5">
        Số lượng sinh viên tối đa <span class="required text-rose-500 font-bold">*</span>
      </label>
      <input
        type="number"
        id="thesis-max"
        min="1"
        max="10"
        bind:value={maxStudents}
        disabled={isSubmitting}
        required
        class="h-9 w-full rounded-md border border-zinc-200 bg-white px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-950 disabled:bg-zinc-100 disabled:text-zinc-400"
      />
    </div>
  </div>

  <div>
    <label for="thesis-title" class="block text-xs font-medium text-zinc-700 mb-1.5">
      Tên đề tài đồ án tốt nghiệp <span class="required text-rose-500 font-bold">*</span>
    </label>
    <input
      type="text"
      id="thesis-title"
      placeholder="Nhập tên đề tài..."
      bind:value={title}
      disabled={isSubmitting}
      required
      class="h-9 w-full rounded-md border border-zinc-200 bg-white px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-950 disabled:bg-zinc-100 disabled:text-zinc-400"
    />
  </div>

  <div>
    <label for="thesis-instructor" class="block text-xs font-medium text-zinc-700 mb-1.5">
      Giảng viên hướng dẫn <span class="required text-rose-500 font-bold">*</span>
    </label>
    <input
      type="text"
      id="thesis-instructor"
      placeholder="Học hàm, học vị và họ tên (ví dụ: TS. Nguyễn Văn A)"
      bind:value={instructor}
      disabled={isSubmitting}
      required
      class="h-9 w-full rounded-md border border-zinc-200 bg-white px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-950 disabled:bg-zinc-100 disabled:text-zinc-400"
    />
  </div>

  <footer class="form-actions flex items-center justify-end gap-2.5 pt-4 mt-6 border-t border-zinc-100">
    {#if onCancel}
      <button
        type="button"
        class="secondary outline inline-flex items-center justify-center gap-1.5 h-9 px-4 rounded-md border border-zinc-200 bg-white text-sm font-medium text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer disabled:opacity-50"
        onclick={onCancel}
        disabled={isSubmitting}
      >
        <X size={15} /> Hủy bỏ
      </button>
    {/if}

    <button
      type="submit"
      aria-busy={isSubmitting}
      disabled={isSubmitting}
      class="inline-flex items-center justify-center gap-1.5 h-9 px-4 rounded-md bg-zinc-900 text-sm font-medium text-zinc-50 hover:bg-zinc-800 transition-colors shadow-sm cursor-pointer disabled:opacity-50"
    >
      <Save size={15} /> {isEdit ? 'Cập nhật đề tài' : 'Lưu đề tài'}
    </button>
  </footer>
</form>
