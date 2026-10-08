<script>
  import { registrationApi } from "../api/registrationApi.js";
  import { studentApi } from "../api/studentApi.js";
  import { thesisApi } from "../api/thesisApi.js";
  import RegistrationTable from "../components/registration/RegistrationTable.svelte";
  import RegistrationForm from "../components/registration/RegistrationForm.svelte";
  import ScoreModal from "../components/registration/ScoreModal.svelte";
  import Modal from "../components/common/Modal.svelte";
  import Alert from "../components/common/Alert.svelte";
  import Loading from "../components/common/Loading.svelte";
  import {
    ClipboardList,
    Plus,
    RefreshCw,
    AlertTriangle,
  } from "@lucide/svelte";

  let registrations = $state([]);
  let students = $state([]);
  let theses = $state([]);
  let isLoading = $state(false);
  let isSubmitting = $state(false);
  let alertMessage = $state("");
  let alertType = $state("info");

  let isCreateModalOpen = $state(false);

  let isGradeModalOpen = $state(false);
  let selectedRegistrationForGrading = $state(null);

  let isCancelModalOpen = $state(false);
  let registrationToCancel = $state(null);

  let registeredStudentIds = $derived(registrations.map((r) => r.studentId));

  async function loadAllData() {
    isLoading = true;
    alertMessage = "";
    try {
      const [regsRes, studentsRes, thesesRes] = await Promise.allSettled([
        registrationApi.getAll(),
        studentApi.getAll(),
        thesisApi.getAll(),
      ]);

      const rawStudents =
        studentsRes.status === "fulfilled" && Array.isArray(studentsRes.value)
          ? studentsRes.value
          : [];
      const rawTheses =
        thesesRes.status === "fulfilled" && Array.isArray(thesesRes.value)
          ? thesesRes.value
          : [];
      const rawRegs =
        regsRes.status === "fulfilled" && Array.isArray(regsRes.value)
          ? regsRes.value
          : [];

      students = rawStudents;
      theses = rawTheses;

      const studentMap = new Map(rawStudents.map((s) => [s.studentId || s.id, s.fullName]));
      const thesisMap = new Map(rawTheses.map((t) => [t.id, t.title]));

      registrations = rawRegs.map((r) => ({
        ...r,
        studentName:
          r.studentName || studentMap.get(r.studentId) || r.studentId,
        thesisTitle: r.thesisTitle || thesisMap.get(r.thesisId) || r.thesisId,
      }));

      const failedServices = [];
      if (regsRes.status === "rejected")
        failedServices.push("registration-service (:8083)");
      if (studentsRes.status === "rejected")
        failedServices.push("student-service (:8081)");
      if (thesesRes.status === "rejected")
        failedServices.push("thesis-service (:8082)");

      if (failedServices.length > 0) {
        alertType = "warning";
        alertMessage = `Không thể kết nối đến: ${failedServices.join(", ")}. Hãy kiểm tra các service đang chạy.`;
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

  function openGradeModal(reg) {
    selectedRegistrationForGrading = reg;
    isGradeModalOpen = true;
  }

  function closeGradeModal() {
    isGradeModalOpen = false;
    selectedRegistrationForGrading = null;
  }

  function openCancelModal(reg) {
    registrationToCancel = reg;
    isCancelModalOpen = true;
  }

  function closeCancelModal() {
    isCancelModalOpen = false;
    registrationToCancel = null;
  }

  async function handleRegisterSubmit(regData) {
    isSubmitting = true;
    alertMessage = "";
    try {
      await registrationApi.create(regData);
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

  async function handleSaveScores(scoreData) {
    if (!selectedRegistrationForGrading) return;
    isSubmitting = true;
    alertMessage = "";
    try {
      await registrationApi.updateScores(
        selectedRegistrationForGrading.id,
        scoreData,
      );
      alertType = "success";
      alertMessage = `Cập nhật điểm thành công cho đăng ký [${selectedRegistrationForGrading.id}]. Điểm tổng kết: ${scoreData.totalScore}.`;
      closeGradeModal();
      await loadAllData();
    } catch (err) {
      alertType = "danger";
      alertMessage = err?.message || "Không thể lưu kết quả chấm điểm.";
    } finally {
      isSubmitting = false;
    }
  }

  async function handleConfirmCancel() {
    if (!registrationToCancel) return;
    isSubmitting = true;
    alertMessage = "";
    try {
      await registrationApi.delete(registrationToCancel.id);
      alertType = "success";
      alertMessage = `Đã hủy lượt đăng ký [${registrationToCancel.id}].`;
      closeCancelModal();
      await loadAllData();
    } catch (err) {
      alertType = "danger";
      alertMessage = err?.message || "Không thể hủy lượt đăng ký.";
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
        <ClipboardList size={24} class="header-icon text-zinc-900" /> Đăng ký Đề
        tài & Tính điểm
      </h2>
      <p
        class="service-badge text-sm text-zinc-600 flex items-center gap-1.5 font-normal flex-wrap"
      >
        <span>Điều phối dịch vụ:</span>
        <code
          class="rounded-md bg-zinc-100 px-2.5 py-0.5 text-sm font-semibold text-zinc-900 font-mono border border-zinc-200 shadow-2xs"
          >registration-service (:8083)</code
        >
        <span class="text-zinc-400 font-bold">&harr;</span>
        <code
          class="rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-800 font-mono border border-zinc-200"
          >:8081</code
        >
        <span class="text-zinc-400">&</span>
        <code
          class="rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-800 font-mono border border-zinc-200"
          >:8082</code
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
      onGrade={openGradeModal}
      onDelete={openCancelModal}
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

<!-- Modal Chấm điểm Đồ án -->
{#if isGradeModalOpen && selectedRegistrationForGrading}
  <ScoreModal
    registration={selectedRegistrationForGrading}
    open={isGradeModalOpen}
    {isSubmitting}
    onSave={handleSaveScores}
    onClose={closeGradeModal}
  />
{/if}

<!-- Modal Xác nhận Hủy Đăng ký -->
<Modal
  open={isCancelModalOpen}
  title="Xác nhận hủy đăng ký đề tài"
  onClose={closeCancelModal}
>
  {#if registrationToCancel}
    <div class="confirm-cancel-body text-center py-4 space-y-2">
      <div class="inline-flex p-3 rounded-full bg-rose-50 text-rose-600 mb-1">
        <AlertTriangle size={28} class="warning-icon" />
      </div>
      <p class="text-sm text-zinc-800">
        Bạn có chắc muốn hủy đăng ký mã <strong class="text-zinc-950"
          >[{registrationToCancel.id}]</strong
        >
        của sinh viên
        <strong class="text-zinc-950">{registrationToCancel.studentName}</strong
        >?
      </p>
      <small class="cancel-warning-hint block text-xs text-zinc-400"
        >Slot của đề tài sẽ được giải phóng lại.</small
      >
    </div>
    <footer
      class="confirm-cancel-actions flex items-center justify-end gap-2.5 pt-3 border-t border-zinc-100"
    >
      <button
        type="button"
        class="secondary outline inline-flex items-center justify-center h-9 px-4 rounded-md border border-zinc-200 bg-white text-xs font-medium text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
        onclick={closeCancelModal}
        disabled={isSubmitting}
      >
        Hủy bỏ
      </button>
      <button
        type="button"
        class="danger-btn inline-flex items-center justify-center h-9 px-4 rounded-md bg-rose-600 text-xs font-medium text-white hover:bg-rose-700 transition-colors cursor-pointer disabled:opacity-50"
        onclick={handleConfirmCancel}
        aria-busy={isSubmitting}
        disabled={isSubmitting}
      >
        Xác nhận hủy
      </button>
    </footer>
  {/if}
</Modal>
