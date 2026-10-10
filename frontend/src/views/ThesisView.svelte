<script>
  import { thesisApi } from "../modules/thesis/api/thesisApi.js";
  import ThesisTable from "../components/thesis/ThesisTable.svelte";
  import ThesisForm from "../components/thesis/ThesisForm.svelte";
  import Modal from "../components/common/Modal.svelte";
  import Alert from "../components/common/Alert.svelte";
  import Loading from "../components/common/Loading.svelte";
  import { Plus, RefreshCw, BookOpen, AlertTriangle, FileText } from "@lucide/svelte";
  import { reportApi } from "../modules/report/api/reportApi.js";

  let theses = $state([]);
  let isLoading = $state(false);
  let isSubmitting = $state(false);
  let alertMessage = $state("");
  let alertType = $state("info");

  let isFormModalOpen = $state(false);
  let selectedThesis = $state(null);
  let isEditMode = $derived(selectedThesis !== null);

  let isDeleteModalOpen = $state(false);
  let thesisToDelete = $state(null);

  async function loadTheses() {
    isLoading = true;
    alertMessage = "";
    try {
      const data = await thesisApi.getAll();
      theses = Array.isArray(data) ? data : [];
    } catch (err) {
      alertType = "danger";
      alertMessage =
        err?.message || "Không thể kết nối đến Thesis Service.";
    } finally {
      isLoading = false;
    }
  }

  loadTheses();

  function openCreateModal() {
    selectedThesis = null;
    isFormModalOpen = true;
  }

  function openEditModal(thesis) {
    selectedThesis = thesis;
    isFormModalOpen = true;
  }

  function closeFormModal() {
    isFormModalOpen = false;
    selectedThesis = null;
  }

  function openDeleteModal(thesis) {
    thesisToDelete = thesis;
    isDeleteModalOpen = true;
  }

  function closeDeleteModal() {
    isDeleteModalOpen = false;
    thesisToDelete = null;
  }

  async function handleFormSubmit(formData) {
    isSubmitting = true;
    alertMessage = "";
    try {
      if (isEditMode && selectedThesis) {
        await thesisApi.update(selectedThesis.id, formData);
        alertType = "success";
        alertMessage = `Cập nhật đề tài "${formData.title}" thành công.`;
      } else {
        await thesisApi.create(formData);
        alertType = "success";
        alertMessage = `Thêm mới đề tài "${formData.title}" thành công.`;
      }
      closeFormModal();
      await loadTheses();
    } catch (err) {
      alertType = "danger";
      alertMessage = err?.message || "Thao tác không thành công.";
    } finally {
      isSubmitting = false;
    }
  }

  async function handleConfirmDelete() {
    if (!thesisToDelete) return;
    isSubmitting = true;
    alertMessage = "";
    try {
      await thesisApi.delete(thesisToDelete.id);
      alertType = "success";
      alertMessage = `Đã xóa đề tài [${thesisToDelete.id}] ${thesisToDelete.title}.`;
      closeDeleteModal();
      await loadTheses();
    } catch (err) {
      alertType = "danger";
      alertMessage = err?.message || "Không thể xóa đề tài.";
    } finally {
      isSubmitting = false;
    }
  }
</script>

<section class="thesis-view space-y-6">
  <header
    class="view-header flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-zinc-200"
  >
    <div class="space-y-1">
      <h2
        class="flex items-center gap-2.5 text-2xl font-bold tracking-tight text-zinc-900"
      >
        <BookOpen size={24} class="header-icon text-zinc-900" /> Quản lý Đề tài Tốt
        nghiệp
      </h2>
      <p
        class="service-badge text-sm text-zinc-600 flex items-center gap-1.5 font-normal"
      >
        <span>Dịch vụ kết nối:</span>
        <code
          class="rounded-md bg-zinc-100 px-2.5 py-0.5 text-sm font-semibold text-zinc-900 font-mono border border-zinc-200 shadow-2xs"
          >thesis-service</code
        >
      </p>
    </div>

    <div class="view-actions flex items-center gap-2.5">
      <button
        type="button"
        class="outline secondary inline-flex items-center gap-1.5 h-9 px-3.5 rounded-md border border-zinc-200 bg-white text-xs font-medium text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer disabled:opacity-50"
        onclick={loadTheses}
        disabled={isLoading}
        aria-label="Tải lại danh sách"
      >
        <RefreshCw size={14} class={isLoading ? "animate-spin" : ""} />
        Làm mới
      </button>

      <a
        href={reportApi.getSummaryPdfUrl()}
        target="_blank"
        rel="noopener noreferrer"
        class="outline secondary inline-flex items-center gap-1.5 h-9 px-3.5 rounded-md border border-zinc-200 bg-white text-xs font-medium text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
        title="Xuất báo cáo tổng hợp danh sách đề tài toàn khoa (PDF)"
      >
        <FileText size={14} /> Xuất PDF tổng hợp
      </a>

      <button
        type="button"
        onclick={openCreateModal}
        class="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-md bg-zinc-900 text-xs font-medium text-zinc-50 hover:bg-zinc-800 transition-colors shadow-xs cursor-pointer"
      >
        <Plus size={15} /> Thêm đề tài mới
      </button>
    </div>
  </header>

  {#if alertMessage}
    <Alert
      type={alertType}
      message={alertMessage}
      dismissible={true}
      onDismiss={() => (alertMessage = "")}
    />
  {/if}

  {#if isLoading && theses.length === 0}
    <Loading text="Đang tải danh sách đề tài..." />
  {:else}
    <ThesisTable {theses} onEdit={openEditModal} onDelete={openDeleteModal} />
  {/if}
</section>

<!-- Modal Thêm / Sửa Đề tài -->
<Modal
  open={isFormModalOpen}
  title={isEditMode
    ? `Chỉnh sửa đề tài: ${selectedThesis?.id}`
    : "Thêm đề tài tốt nghiệp mới"}
  onClose={closeFormModal}
>
  {#if isFormModalOpen}
    <ThesisForm
      initialData={selectedThesis}
      isEdit={isEditMode}
      {isSubmitting}
      onSubmit={handleFormSubmit}
      onCancel={closeFormModal}
    />
  {/if}
</Modal>

<!-- Modal Xác nhận Xóa Đề tài -->
<Modal
  open={isDeleteModalOpen}
  title="Xác nhận xóa đề tài"
  onClose={closeDeleteModal}
>
  {#if thesisToDelete}
    <div class="confirm-delete-body text-center py-4 space-y-2">
      <div class="inline-flex p-3 rounded-full bg-rose-50 text-rose-600 mb-1">
        <AlertTriangle size={28} class="warning-icon" />
      </div>
      <p class="text-sm text-zinc-800">
        Bạn có chắc chắn muốn xóa đề tài <strong class="text-zinc-950"
          >[{thesisToDelete.id}] {thesisToDelete.title}</strong
        >?
      </p>
      <small class="delete-warning-hint block text-xs text-zinc-400"
        >Hành động này không thể hoàn tác.</small
      >
    </div>
    <footer
      class="confirm-delete-actions flex items-center justify-end gap-2.5 pt-3 border-t border-zinc-100"
    >
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
