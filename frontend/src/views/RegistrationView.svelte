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
  } from "@lucide/svelte";

  let registrations = $state([]);
  let students = $state([]);
  let theses = $state([]);
  let isLoading = $state(false);
  let isSubmitting = $state(false);
  let alertMessage = $state("");
  let alertType = $state("info");

  let isCreateModalOpen = $state(false);

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
