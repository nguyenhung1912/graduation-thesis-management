<script>
  import { Save, X, AlertCircle } from '@lucide/svelte';

  /**
   * RegistrationForm.svelte - Presentational Component (Dumb)
   * Form đăng ký đề tài đồ án tốt nghiệp phối hợp dữ liệu Sinh viên & Đề tài.
   */
  let {
    students = [],
    theses = [],
    registeredStudentIds = [],
    isSubmitting = false,
    onSubmit = undefined,
    onCancel = undefined,
  } = $props();

  let selectedStudentId = $state('');
  let selectedThesisId = $state('');
  let registrationDate = $state(new Date().toISOString().split('T')[0]);
  let errorMessage = $state('');

  // Lọc sinh viên đủ điều kiện và chưa có đề tài
  let availableStudents = $derived(
    students.filter((s) => {
      const isEligible = s.eligible !== false && (s.gpa === undefined || s.gpa >= 2.5);
      const studentKey = s.studentId || s.id;
      const notRegistered = !registeredStudentIds.includes(studentKey);
      return isEligible && notRegistered;
    })
  );

  // Lọc các đề tài còn slot nhận sinh viên
  let availableTheses = $derived(
    theses.filter((t) => (t.currentStudents ?? 0) < (t.maxStudents ?? 1))
  );

  function handleSubmit(event) {
    event.preventDefault();
    errorMessage = '';

    if (!selectedStudentId) {
      errorMessage = 'Vui lòng chọn sinh viên đăng ký.';
      return;
    }
    if (!selectedThesisId) {
      errorMessage = 'Vui lòng chọn đề tài đồ án còn slot.';
      return;
    }

    const student = students.find((s) => (s.studentId || s.id) === selectedStudentId);
    const thesis = theses.find((t) => t.id === selectedThesisId);

    if (onSubmit) {
      onSubmit({
        studentId: selectedStudentId,
        studentName: student?.fullName ?? selectedStudentId,
        thesisId: selectedThesisId,
        thesisTitle: thesis?.title ?? selectedThesisId,
        registrationDate,
      });
    }
  }
</script>

<form novalidate onsubmit={handleSubmit} class="registration-form space-y-4">
  {#if errorMessage}
    <p class="form-error rounded-md border border-rose-200 bg-rose-50/70 p-3 text-xs text-rose-700 font-medium" role="alert">
      {errorMessage}
    </p>
  {/if}

  {#if availableStudents.length === 0}
    <div class="empty-warning flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50/70 p-3 text-xs text-amber-800 font-medium">
      <AlertCircle size={16} class="shrink-0 text-amber-700" />
      <span>Không có sinh viên nào đủ điều kiện hoặc tất cả đã đăng ký đề tài.</span>
    </div>
  {/if}

  {#if availableTheses.length === 0}
    <div class="empty-warning flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50/70 p-3 text-xs text-amber-800 font-medium">
      <AlertCircle size={16} class="shrink-0 text-amber-700" />
      <span>Tất cả các đề tài hiện tại đều đã đủ số lượng sinh viên tối đa.</span>
    </div>
  {/if}

  <div>
    <label for="reg-student" class="block text-xs font-medium text-zinc-700 mb-1.5">
      Chọn Sinh viên đăng ký <span class="required text-rose-500 font-bold">*</span>
    </label>
    <select
      id="reg-student"
      bind:value={selectedStudentId}
      disabled={isSubmitting || availableStudents.length === 0}
      required
      class="h-9 w-full rounded-md border border-zinc-200 bg-white px-3 py-1 text-sm shadow-xs transition-colors focus:outline-none focus:ring-1 focus:ring-zinc-950 disabled:bg-zinc-100 disabled:text-zinc-400 cursor-pointer"
    >
      <option value="">-- Chọn sinh viên đủ điều kiện --</option>
      {#each availableStudents as s (s.studentId || s.id)}
        {@const sId = s.studentId || s.id}
        <option value={sId}>
          [{sId}] {s.fullName} - {s.className ?? ''} (GPA: {s.gpa ?? '-'})
        </option>
      {/each}
    </select>
  </div>

  <div>
    <label for="reg-thesis" class="block text-xs font-medium text-zinc-700 mb-1.5">
      Chọn Đề tài đồ án tốt nghiệp <span class="required text-rose-500 font-bold">*</span>
    </label>
    <select
      id="reg-thesis"
      bind:value={selectedThesisId}
      disabled={isSubmitting || availableTheses.length === 0}
      required
      class="h-9 w-full rounded-md border border-zinc-200 bg-white px-3 py-1 text-sm shadow-xs transition-colors focus:outline-none focus:ring-1 focus:ring-zinc-950 disabled:bg-zinc-100 disabled:text-zinc-400 cursor-pointer"
    >
      <option value="">-- Chọn đề tài còn chỗ trống --</option>
      {#each availableTheses as t (t.id)}
        {@const remaining = (t.maxStudents ?? 0) - (t.currentStudents ?? 0)}
        <option value={t.id}>
          [{t.id}] {t.title} - GV: {t.instructor} (Còn {remaining} chỗ)
        </option>
      {/each}
    </select>
  </div>

  <div>
    <label for="reg-date" class="block text-xs font-medium text-zinc-700 mb-1.5">
      Ngày đăng ký
    </label>
    <input
      type="date"
      id="reg-date"
      bind:value={registrationDate}
      disabled={isSubmitting}
      class="h-9 w-full rounded-md border border-zinc-200 bg-white px-3 py-1 text-sm shadow-xs transition-colors focus:outline-none focus:ring-1 focus:ring-zinc-950 disabled:bg-zinc-100 disabled:text-zinc-400"
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
      disabled={isSubmitting || availableStudents.length === 0 || availableTheses.length === 0}
      class="inline-flex items-center justify-center gap-1.5 h-9 px-4 rounded-md bg-zinc-900 text-sm font-medium text-zinc-50 hover:bg-zinc-800 transition-colors shadow-sm cursor-pointer disabled:opacity-50"
    >
      <Save size={15} /> Xác nhận đăng ký
    </button>
  </footer>
</form>
