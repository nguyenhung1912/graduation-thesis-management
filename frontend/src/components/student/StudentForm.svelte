<script>
  import { Save, X } from '@lucide/svelte';
  import { validateStudent, toStudentPayload } from '../../modules/student/dto/student.dto.js';
  
  let {
    initialData = null,
    isEdit = false,
    isSubmitting = false,
    onSubmit = undefined,
    onCancel = undefined,
  } = $props();

  // svelte-ignore state_referenced_locally
  let studentId = $state(initialData?.studentId ?? '');
  // svelte-ignore state_referenced_locally
  let fullName = $state(initialData?.fullName ?? '');
  // svelte-ignore state_referenced_locally
  let className = $state(initialData?.className ?? '');
  // svelte-ignore state_referenced_locally
  let email = $state(initialData?.email ?? '');
  // svelte-ignore state_referenced_locally
  let gpa = $state(initialData?.gpa ?? 3.0);
  let errorMessage = $state('');

  function handleSubmit(event) {
    event.preventDefault();
    errorMessage = '';

    const formData = {
      studentId,
      fullName,
      className,
      email,
      gpa,
    };

    const validation = validateStudent(formData);
    if (!validation.valid) {
      errorMessage = validation.errors[0];
      return;
    }

    if (onSubmit) {
      onSubmit(toStudentPayload(formData));
    }
  }
</script>

<form novalidate onsubmit={handleSubmit} class="student-form space-y-4">
  {#if errorMessage}
    <p class="form-error rounded-md border border-rose-200 bg-rose-50/70 p-3 text-xs text-rose-700 font-medium" role="alert">
      {errorMessage}
    </p>
  {/if}

  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div>
      <label for="student-id" class="block text-xs font-medium text-zinc-700 mb-1.5">
        Mã số sinh viên (MSSV) <span class="required text-rose-500 font-bold">*</span>
      </label>
      <input
        type="text"
        id="student-id"
        placeholder="SV01, 20210001..."
        bind:value={studentId}
        disabled={isEdit || isSubmitting}
        required
        class="h-9 w-full rounded-md border border-zinc-200 bg-white px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-950 disabled:bg-zinc-100 disabled:text-zinc-400"
      />
      {#if isEdit}
        <small class="hint block text-xs text-zinc-400 mt-1">MSSV là khóa chính, không thể thay đổi khi sửa.</small>
      {/if}
    </div>

    <div>
      <label for="student-class" class="block text-xs font-medium text-zinc-700 mb-1.5">
        Lớp sinh hoạt <span class="required text-rose-500 font-bold">*</span>
      </label>
      <input
        type="text"
        id="student-class"
        placeholder="CNTT01, K15-CNTT..."
        bind:value={className}
        disabled={isSubmitting}
        required
        class="h-9 w-full rounded-md border border-zinc-200 bg-white px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-950 disabled:bg-zinc-100 disabled:text-zinc-400"
      />
    </div>
  </div>

  <div>
    <label for="student-name" class="block text-xs font-medium text-zinc-700 mb-1.5">
      Họ và tên sinh viên <span class="required text-rose-500 font-bold">*</span>
    </label>
    <input
      type="text"
      id="student-name"
      placeholder="Nguyễn Văn A"
      bind:value={fullName}
      disabled={isSubmitting}
      required
      class="h-9 w-full rounded-md border border-zinc-200 bg-white px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-950 disabled:bg-zinc-100 disabled:text-zinc-400"
    />
  </div>

  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div>
      <label for="student-email" class="block text-xs font-medium text-zinc-700 mb-1.5">
        Địa chỉ Email
      </label>
      <input
        type="email"
        id="student-email"
        placeholder="sinhvien@soa.edu.vn"
        bind:value={email}
        disabled={isSubmitting}
        class="h-9 w-full rounded-md border border-zinc-200 bg-white px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-950 disabled:bg-zinc-100 disabled:text-zinc-400"
      />
    </div>

    <div>
      <label for="student-gpa" class="block text-xs font-medium text-zinc-700 mb-1.5">
        Điểm GPA tích lũy (thang 4.0) <span class="required text-rose-500 font-bold">*</span>
      </label>
      <input
        type="number"
        id="student-gpa"
        min="0"
        max="4.0"
        step="0.05"
        bind:value={gpa}
        disabled={isSubmitting}
        required
        class="h-9 w-full rounded-md border border-zinc-200 bg-white px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-950 disabled:bg-zinc-100 disabled:text-zinc-400"
      />
      <small class="hint block text-xs text-zinc-400 mt-1">GPA &ge; 2.5 đủ điều kiện đăng ký đồ án.</small>
    </div>
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
      <Save size={15} /> {isEdit ? 'Cập nhật sinh viên' : 'Lưu sinh viên'}
    </button>
  </footer>
</form>