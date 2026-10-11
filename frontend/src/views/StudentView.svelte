<script>
  import { studentApi } from '../modules/student/api/studentApi.js';
  import StudentTable from '../components/student/StudentTable.svelte';
  import StudentForm from '../components/student/StudentForm.svelte';
  import Modal from '../components/common/Modal.svelte';
  import Alert from '../components/common/Alert.svelte';
  import Loading from '../components/common/Loading.svelte';
  import { Users, Plus, RefreshCw, AlertTriangle } from '@lucide/svelte';

  let students = $state([]);
  let isLoading = $state(false);
  let isSubmitting = $state(false);
  let alertMessage = $state('');
  let alertType = $state('info');

  let isFormModalOpen = $state(false);
  let selectedStudent = $state(null);
  let isEditMode = $derived(selectedStudent !== null);

  let isDeleteModalOpen = $state(false);
  let studentToDelete = $state(null);

  async function loadStudents() {
    isLoading = true;
    alertMessage = '';
    try {
      const data = await studentApi.getAll();
      students = Array.isArray(data) ? data : [];
    } catch (err) {
      alertType = 'danger';
      alertMessage = err?.message || 'Không thể kết nối đến Student Service.';
    } finally {
      isLoading = false;
    }
  }

  loadStudents();

  function openCreateModal() {
    selectedStudent = null;
    isFormModalOpen = true;
  }

  function openEditModal(student) {
    selectedStudent = student;
    isFormModalOpen = true;
  }

  function closeFormModal() {
    isFormModalOpen = false;
    selectedStudent = null;
  }

  function openDeleteModal(student) {
    studentToDelete = student;
    isDeleteModalOpen = true;
  }

  function closeDeleteModal() {
    isDeleteModalOpen = false;
    studentToDelete = null;
  }

  async function handleFormSubmit(formData) {
    isSubmitting = true;
    alertMessage = '';
    try {
      if (isEditMode && selectedStudent) {
        await studentApi.update(selectedStudent.studentId, formData);
        alertType = 'success';
        alertMessage = `Cập nhật thông tin sinh viên [${formData.studentId}] thành công.`;
      } else {
        await studentApi.create(formData);
        alertType = 'success';
        alertMessage = `Thêm mới sinh viên "${formData.fullName}" (${formData.studentId}) thành công.`;
      }
      closeFormModal();
      await loadStudents();
    } catch (err) {
      alertType = 'danger';
      alertMessage = err?.message || 'Thao tác không thành công.';
    } finally {
      isSubmitting = false;
    }
  }

  async function handleConfirmDelete() {
    if (!studentToDelete) return;
    isSubmitting = true;
    alertMessage = '';
    try {
      await studentApi.delete(studentToDelete.studentId);
      alertType = 'success';
      alertMessage = `Đã xóa sinh viên [${studentToDelete.studentId}] ${studentToDelete.fullName}.`;
      closeDeleteModal();
      await loadStudents();
    } catch (err) {
      alertType = 'danger';
      alertMessage = err?.message || 'Không thể xóa sinh viên.';
    } finally {
      isSubmitting = false;
    }
  }
</script>

<section class="student-view space-y-6">
  <header class="view-header flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-zinc-200">
    <div class="space-y-1">
      <h2 class="flex items-center gap-2.5 text-2xl font-bold tracking-tight text-zinc-900">
        <Users size={24} class="header-icon text-zinc-900" /> Quản lý Sinh viên
      </h2>
      <p class="service-badge text-sm text-zinc-600 flex items-center gap-1.5 font-normal">
        <span>Dịch vụ kết nối:</span>
        <code class="rounded-md bg-zinc-100 px-2.5 py-0.5 text-sm font-semibold text-zinc-900 font-mono border border-zinc-200 shadow-2xs">student-service</code>
      </p>
    </div>

    <div class="view-actions flex items-center gap-2.5">
      <button
        type="button"
        class="outline secondary inline-flex items-center gap-1.5 h-9 px-3.5 rounded-md border border-zinc-200 bg-white text-xs font-medium text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer disabled:opacity-50"
        onclick={loadStudents}
        disabled={isLoading}
        aria-label="Tải lại danh sách sinh viên"
      >
        <RefreshCw size={14} class={isLoading ? 'animate-spin' : ''} />
        Làm mới
      </button>

      <button
        type="button"
        onclick={openCreateModal}
        class="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-md bg-zinc-900 text-xs font-medium text-zinc-50 hover:bg-zinc-800 transition-colors shadow-xs cursor-pointer"
      >
        <Plus size={15} /> Thêm sinh viên
      </button>
    </div>
  </header>

  {#if alertMessage}
    <Alert
      type={alertType}
      message={alertMessage}
      dismissible={true}
      onDismiss={() => (alertMessage = '')}
    />
  {/if}

  {#if isLoading && students.length === 0}
    <Loading text="Đang tải danh sách sinh viên..." />
  {:else}
    <StudentTable
      {students}
      onEdit={openEditModal}
      onDelete={openDeleteModal}
    />
  {/if}
</section>

<!-- Modal Thêm / Sửa Sinh viên -->
<Modal
  open={isFormModalOpen}
  title={isEditMode ? `Chỉnh sửa sinh viên: ${selectedStudent?.studentId}` : 'Thêm sinh viên mới'}
  onClose={closeFormModal}
>
  {#if isFormModalOpen}
    <StudentForm
      initialData={selectedStudent}
      isEdit={isEditMode}
      {isSubmitting}
      onSubmit={handleFormSubmit}
      onCancel={closeFormModal}
    />
  {/if}
</Modal>

<!-- Modal Xác nhận Xóa Sinh viên -->
<Modal
  open={isDeleteModalOpen}
  title="Xác nhận xóa sinh viên"
  onClose={closeDeleteModal}
>
  {#if studentToDelete}
    <div class="confirm-delete-body text-center py-4 space-y-2">
      <div class="inline-flex p-3 rounded-full bg-rose-50 text-rose-600 mb-1">
        <AlertTriangle size={28} class="warning-icon" />
      </div>
      <p class="text-sm text-zinc-800">
        Bạn có chắc chắn muốn xóa sinh viên <strong class="text-zinc-950">[{studentToDelete.studentId}] {studentToDelete.fullName}</strong>?
      </p>
      <small class="delete-warning-hint block text-xs text-zinc-400">Hành động này không thể hoàn tác.</small>
    </div>
    <footer class="confirm-delete-actions flex items-center justify-end gap-2.5 pt-3 border-t border-zinc-100">
      <button
        type="button"
        class="secondary outline inline-flex items-center justify-center h-9 px-4 rounded-md border border-zinc-200 bg-white text-xs font-medium text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
        onclick={closeDeleteModal}
        disabled={isSubmitting}
      >
        Hủy bỏ
      </button>
      <button
        type="button"
        class="danger-btn inline-flex items-center justify-center h-9 px-4 rounded-md bg-rose-600 text-xs font-medium text-white hover:bg-rose-700 transition-colors cursor-pointer disabled:opacity-50"
        onclick={handleConfirmDelete}
        aria-busy={isSubmitting}
        disabled={isSubmitting}
      >
        Xác nhận xóa
      </button>
    </footer>
  {/if}
</Modal>