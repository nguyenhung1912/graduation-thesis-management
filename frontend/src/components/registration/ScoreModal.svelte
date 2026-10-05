<script>
  import Modal from "../common/Modal.svelte";
  import Badge from "../common/Badge.svelte";
  import { Award, Save, X } from "@lucide/svelte";

  let {
    registration = null,
    open = false,
    isSubmitting = false,
    onSave = undefined,
    onClose = undefined,
  } = $props();

  // svelte-ignore state_referenced_locally
  let advisorScore = $state(registration?.advisorScore ?? 8.0);
  // svelte-ignore state_referenced_locally
  let reviewerScore = $state(registration?.reviewerScore ?? 8.0);
  // svelte-ignore state_referenced_locally
  let defenseScore = $state(registration?.defenseScore ?? 8.0);
  let errorMessage = $state("");

  // Điểm tổng kết = HD * 20% + PB * 30% + BV * 50%
  let calculatedTotal = $derived.by(() => {
    const adv = Number(advisorScore);
    const rev = Number(reviewerScore);
    const def = Number(defenseScore);
    if (isNaN(adv) || isNaN(rev) || isNaN(def)) return 0;
    const total = adv * 0.2 + rev * 0.3 + def * 0.5;
    return Number(total.toFixed(2));
  });

  let isPassed = $derived(calculatedTotal >= 5.0);

  function handleSubmit(event) {
    event.preventDefault();
    errorMessage = "";

    const adv = Number(advisorScore);
    const rev = Number(reviewerScore);
    const def = Number(defenseScore);

    if (isNaN(adv) || adv < 0 || adv > 10) {
      errorMessage = "Điểm GV hướng dẫn phải từ 0 đến 10.";
      return;
    }
    if (isNaN(rev) || rev < 0 || rev > 10) {
      errorMessage = "Điểm GV phản biện phải từ 0 đến 10.";
      return;
    }
    if (isNaN(def) || def < 0 || def > 10) {
      errorMessage = "Điểm Hội đồng bảo vệ phải từ 0 đến 10.";
      return;
    }

    if (onSave) {
      onSave({
        advisorScore: adv,
        reviewerScore: rev,
        defenseScore: def,
        totalScore: calculatedTotal,
        passed: isPassed,
      });
    }
  }
</script>

<Modal {open} title="Đánh giá & Chấm điểm đồ án" {onClose}>
  {#if registration}
    <form novalidate onsubmit={handleSubmit} class="score-form space-y-4">
      {#if errorMessage}
        <p
          class="form-error rounded-md border border-rose-200 bg-rose-50/70 p-3 text-xs text-rose-700 font-medium"
          role="alert"
        >
          {errorMessage}
        </p>
      {/if}

      <div
        class="reg-info-card rounded-lg border border-zinc-200 bg-zinc-50/75 p-3.5 text-xs text-zinc-700 space-y-1"
      >
        <p>
          <strong>Mã đăng ký:</strong>
          <code
            class="rounded bg-zinc-200/70 px-1.5 py-0.5 font-mono text-zinc-900"
            >{registration.id}</code
          >
        </p>
        <p>
          <strong>Sinh viên:</strong>
          <span class="font-medium text-zinc-900"
            >{registration.studentName ?? registration.studentId}</span
          >
        </p>
        <p>
          <strong>Đề tài:</strong>
          <span class="font-medium text-zinc-900"
            >{registration.thesisTitle ?? registration.thesisId}</span
          >
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label
            for="advisor-score"
            class="block text-xs font-medium text-zinc-700 mb-1.5"
          >
            Điểm GV Hướng dẫn (20%) <span
              class="required text-rose-500 font-bold">*</span
            >
          </label>
          <input
            type="number"
            id="advisor-score"
            min="0"
            max="10"
            step="0.1"
            bind:value={advisorScore}
            disabled={isSubmitting}
            required
            class="h-9 w-full rounded-md border border-zinc-200 bg-white px-3 py-1 text-sm shadow-xs transition-colors focus:outline-none focus:ring-1 focus:ring-zinc-950 disabled:bg-zinc-100 disabled:text-zinc-400 font-mono"
          />
        </div>

        <div>
          <label
            for="reviewer-score"
            class="block text-xs font-medium text-zinc-700 mb-1.5"
          >
            Điểm GV Phản biện (30%) <span
              class="required text-rose-500 font-bold">*</span
            >
          </label>
          <input
            type="number"
            id="reviewer-score"
            min="0"
            max="10"
            step="0.1"
            bind:value={reviewerScore}
            disabled={isSubmitting}
            required
            class="h-9 w-full rounded-md border border-zinc-200 bg-white px-3 py-1 text-sm shadow-xs transition-colors focus:outline-none focus:ring-1 focus:ring-zinc-950 disabled:bg-zinc-100 disabled:text-zinc-400 font-mono"
          />
        </div>

        <div>
          <label
            for="defense-score"
            class="block text-xs font-medium text-zinc-700 mb-1.5"
          >
            Điểm Hội đồng BV (50%) <span
              class="required text-rose-500 font-bold">*</span
            >
          </label>
          <input
            type="number"
            id="defense-score"
            min="0"
            max="10"
            step="0.1"
            bind:value={defenseScore}
            disabled={isSubmitting}
            required
            class="h-9 w-full rounded-md border border-zinc-200 bg-white px-3 py-1 text-sm shadow-xs transition-colors focus:outline-none focus:ring-1 focus:ring-zinc-950 disabled:bg-zinc-100 disabled:text-zinc-400 font-mono"
          />
        </div>
      </div>

      <!-- Preview kết quả tổng kết -->
      <div
        class="score-summary-card rounded-lg border border-zinc-300 bg-zinc-50 p-4 space-y-1.5 shadow-xs"
      >
        <div
          class="score-summary-header flex items-center justify-between gap-2 flex-wrap"
        >
          <div
            class="flex items-center gap-2 text-xs font-semibold text-zinc-700"
          >
            <Award size={18} class="award-icon text-zinc-900" />
            <span>Điểm tổng kết đồ án (Thang 10):</span>
          </div>
          <div class="flex items-center gap-2">
            <span
              class="total-score-badge text-xl font-bold font-mono text-zinc-900"
              >{calculatedTotal.toFixed(2)}</span
            >
            {#if isPassed}
              <Badge variant="success" text="ĐẠT (PASSED)" />
            {:else}
              <Badge variant="danger" text="KHÔNG ĐẠT" />
            {/if}
          </div>
        </div>
        <small class="formula-hint block text-xs text-zinc-500">
          Công thức: Tổng kết = (Điểm HD &times; 0.2) + (Điểm PB &times; 0.3) +
          (Điểm BV &times; 0.5)
        </small>
      </div>

      <footer
        class="form-actions flex items-center justify-end gap-2.5 pt-4 mt-6 border-t border-zinc-100"
      >
        {#if onClose}
          <button
            type="button"
            class="secondary outline inline-flex items-center justify-center gap-1.5 h-9 px-4 rounded-md border border-zinc-200 bg-white text-sm font-medium text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer disabled:opacity-50"
            onclick={onClose}
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
          <Save size={15} /> Lưu kết quả chấm điểm
        </button>
      </footer>
    </form>
  {/if}
</Modal>
