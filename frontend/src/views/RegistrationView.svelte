<script>
  import { registrationCompositeService } from "../modules/registration/services/registrationCompositeService.js";
  import RegistrationTable from "../components/registration/RegistrationTable.svelte";
  import RegistrationForm from "../components/registration/RegistrationForm.svelte";
  import Modal from "../components/common/Modal.svelte";
  import Alert from "../components/common/Alert.svelte";
  import Loading from "../components/common/Loading.svelte";
  import {
    ClipboardList,
    Plus,
    RefreshCw,
    AlertTriangle,
    Save,
  } from "@lucide/svelte";

  const STATUS_OPTIONS = [
    "Chờ duyệt",
    "Đã đăng ký",
    "Đã duyệt",
    "Từ chối",
    "Đã hủy",
  ];

  let registrations = $state([]);
  let students = $state([]);
  let theses = $state([]);
  let isLoading = $state(false);
  let isSubmitting = $state(false);
  let alertMessage = $state("");
  let alertType = $state("info");

  let isCreateModalOpen = $state(false);

  let isStatusModalOpen = $state(false);
  let selectedRegistration = $state(null);
  let selectedStatus = $state("Chờ duyệt");

  let isDeleteModalOpen = $state(false);
  let registrationToDelete = $state(null);

  let registeredStudentIds = $derived(registrations.map((r) => r.studentId));

  async function loadAllData() {
    isLoading = true;
    alertMessage = "";
    try {
      const data = await registrationCompositeService.loadDashboardData();
      students = data.students;
      theses = data.theses;
      registrations = data.registrations;

      if (data.warningMessage) {
        alertType = "warning";
        alertMessage = data.warningMessage;
      }
    } catch (err) {
      alertType = "danger";
      alertMessage =
        err?.message || "Có lỗi xảy ra khi nạp dữ liệu điều phối hệ thống.";
    } finally {
      isLoading = false;
    }
  }

  loadAllData();

  function openCreateModal() {
    isCreateModalOpen = true;
  }

  function closeCreateModal() {
    isCreateModalOpen = false;
  }

  function openEditStatusModal(reg) {
    selectedRegistration = reg;
    selectedStatus = STATUS_OPTIONS.includes(reg.status)
      ? reg.status
      : "Chờ duyệt";
    isStatusModalOpen = true;
  }

  function closeEditStatusModal() {
    isStatusModalOpen = false;
    selectedRegistration = null;
  }

  function openDeleteModal(reg) {
    registrationToDelete = reg;
    isDeleteModalOpen = true;
  }

  function closeDeleteModal() {
    isDeleteModalOpen = false;
    registrationToDelete = null;
  }

  async function handleRegisterSubmit(regData) {
    isSubmitting = true;
    alertMessage = "";
    try {
      await registrationCompositeService.registerThesis(regData);
      alertType = "success";
      alertMessage = `Đăng ký thành công đề tài [${regData.thesisId}] cho sinh viên [${regData.studentId}].`;
      closeCreateModal();
      await loadAllData();
    } catch (err) {
      alertType = "danger";
      alertMessage = err?.message || "Đăng ký đề tài thất bại.";
    } finally {
      isSubmitting = false;
    }
  }

  async function handleUpdateStatusSubmit(event) {
    event.preventDefault();
    if (!selectedRegistration) return;
    isSubmitting = true;
    alertMessage = "";
    try {
      await registrationCompositeService.updateRegistrationStatus(
        selectedRegistration.id,
        selectedStatus,
      );
      alertType = "success";
      alertMessage = `Đã cập nhật trạng thái đăng ký [${selectedRegistration.id}] thành "${selectedStatus}".`;
      closeEditStatusModal();
      await loadAllData();
    } catch (err) {
      alertType = "danger";
      alertMessage = err?.message || "Cập nhật trạng thái đăng ký thất bại.";
    } finally {
      isSubmitting = false;
    }
  }

  async function handleConfirmDelete() {
    if (!registrationToDelete) return;
    isSubmitting = true;
    alertMessage = "";
    try {
      await registrationCompositeService.deleteRegistration(
        registrationToDelete.id,
      );
      alertType = "success";
      alertMessage = `Đã xóa lượt đăng ký [${registrationToDelete.id}] của sinh viên ${registrationToDelete.studentName || registrationToDelete.studentId}.`;
      closeDeleteModal();
      await loadAllData();
    } catch (err) {
      alertType = "danger";
      alertMessage = err?.message || "Không thể xóa lượt đăng ký.";
    } finally {
      isSubmitting = false;
    }
  }
</script>

<section class="registration-view space-y-6">
  <header
    class="view-header flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-zinc-200"
  >
    <div class="space-y-1">
      <h2
        class="flex items-center gap-2.5 text-2xl font-bold tracking-tight text-zinc-900"
      >
        <ClipboardList size={24} class="header-icon text-zinc-900" /> Đăng ký Đề tài
      </h2>
      <p
        class="service-badge text-sm text-zinc-600 flex items-center gap-1.5 font-normal flex-wrap"
      >
        <span>Dịch vụ kết nối:</span>
        <code
          class="rounded-md bg-zinc-100 px-2.5 py-0.5 text-sm font-semibold text-zinc-900 font-mono border border-zinc-200 shadow-2xs"
          >registration-service</code
        >
      </p>
    </div>

    <div class="view-actions flex items-center gap-2.5">
      <button
        type="button"
        class="outline secondary inline-flex items-center gap-1.5 h-9 px-3.5 rounded-md border border-zinc-200 bg-white text-xs font-medium text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer disabled:opacity-50"
        onclick={loadAllData}
        disabled={isLoading}
        aria-label="Tải lại dữ liệu đăng ký"
      >
        <RefreshCw size={14} class={isLoading ? "animate-spin" : ""} />
        Làm mới
      </button>

      <button
        type="button"
        onclick={openCreateModal}
        class="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-md bg-zinc-900 text-xs font-medium text-zinc-50 hover:bg-zinc-800 transition-colors shadow-xs cursor-pointer"
      >
        <Plus size={15} /> Đăng ký đề tài
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

  {#if isLoading && registrations.length === 0}
    <Loading text="Đang đồng bộ dữ liệu từ các dịch vụ..." />
  {:else}
    <RegistrationTable
      {registrations}
      onEdit={openEditStatusModal}
      onDelete={openDeleteModal}
    />
  {/if}
</section>

<!-- Modal Đăng ký Đề tài Mới -->
<Modal
  open={isCreateModalOpen}
  title="Đăng ký Đề tài Tốt nghiệp"
  onClose={closeCreateModal}
>
  {#if isCreateModalOpen}
    <RegistrationForm
      {students}
      {theses}
      {registeredStudentIds}
      {isSubmitting}
      onSubmit={handleRegisterSubmit}
      onCancel={closeCreateModal}
    />
  {/if}
</Modal>

<!-- Modal Cập nhật Trạng thái Đăng ký -->
<Modal
  open={isStatusModalOpen}
  title="Cập nhật trạng thái đăng ký"
  onClose={closeEditStatusModal}
>
  {#if selectedRegistration}
    <form onsubmit={handleUpdateStatusSubmit} class="space-y-4">
      <div class="rounded-md bg-zinc-50 p-3 border border-zinc-200 text-xs space-y-1.5">
        <div>
          <span class="text-zinc-500">Mã đăng ký:</span>
          <strong class="font-mono text-zinc-900 ml-1">{selectedRegistration.id}</strong>
        </div>
        <div>
          <span class="text-zinc-500">Sinh viên:</span>
          <strong class="text-zinc-900 ml-1">
            {selectedRegistration.studentName ?? selectedRegistration.studentId} ({selectedRegistration.studentId})
          </strong>
        </div>
        <div>
          <span class="text-zinc-500">Đề tài:</span>
          <strong class="text-zinc-900 ml-1">
            {selectedRegistration.thesisTitle ?? selectedRegistration.thesisId} ({selectedRegistration.thesisId})
          </strong>
        </div>
      </div>

      <div class="space-y-1.5">
        <label
          for="registration-status-select"
          class="block text-xs font-semibold text-zinc-700"
        >
          Trạng thái đăng ký <span class="text-rose-500">*</span>
        </label>
        <select
          id="registration-status-select"
          bind:value={selectedStatus}
          disabled={isSubmitting}
          class="h-9 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-950 transition-colors"
        >
          {#each STATUS_OPTIONS as statusOption}
            <option value={statusOption}>{statusOption}</option>
          {/each}
        </select>
      </div>

      <footer
        class="flex items-center justify-end gap-2.5 pt-3 border-t border-zinc-100"
      >
        <button
          type="button"
          class="secondary outline inline-flex items-center justify-center h-9 px-4 rounded-md border border-zinc-200 bg-white text-xs font-medium text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
          onclick={closeEditStatusModal}
          disabled={isSubmitting}
        >
          Hủy bỏ
        </button>
        <button
          type="submit"
          class="inline-flex items-center gap-1.5 justify-center h-9 px-4 rounded-md bg-zinc-900 text-xs font-medium text-white hover:bg-zinc-800 transition-colors cursor-pointer disabled:opacity-50"
          aria-busy={isSubmitting}
          disabled={isSubmitting}
        >
          <Save size={14} /> Lưu trạng thái
        </button>
      </footer>
    </form>
  {/if}
</Modal>

<!-- Modal Xác nhận Xóa Đăng ký -->
<Modal
  open={isDeleteModalOpen}
  title="Xác nhận xóa đăng ký"
  onClose={closeDeleteModal}
>
  {#if registrationToDelete}
    <div class="confirm-delete-body text-center py-4 space-y-2">
      <div class="inline-flex p-3 rounded-full bg-rose-50 text-rose-600 mb-1">
        <AlertTriangle size={28} class="warning-icon" />
      </div>
      <p class="text-sm text-zinc-800">
        Bạn có chắc chắn muốn xóa lượt đăng ký <strong class="text-zinc-950"
          >[{registrationToDelete.id}]</strong
        >
        của sinh viên
        <strong class="text-zinc-950"
          >{registrationToDelete.studentName ??
            registrationToDelete.studentId}</strong
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
