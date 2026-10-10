<script>
  import { httpClient } from "../../core/http/httpClient.js";
  import { API_BASE } from "../../core/gateway/config.js";
  import { reportApi } from "../../modules/report/api/reportApi.js";
  import { Activity, RefreshCw } from "@lucide/svelte";

  let services = $state([
    {
      id: "student",
      name: "Student Service",
      port: "8081",
      url: API_BASE.STUDENT,
      status: "unknown", // 'online' | 'offline' | 'checking'
      latency: null,
    },
    {
      id: "thesis",
      name: "Thesis Service",
      port: "8082",
      url: API_BASE.THESIS,
      status: "unknown",
      latency: null,
    },
    {
      id: "registration",
      name: "Registration Service",
      port: "8083",
      url: API_BASE.REGISTRATION,
      status: "unknown",
      latency: null,
    },
    {
      id: "report",
      name: "Report Service",
      port: "8084",
      url: reportApi.getHealthUrl(),
      status: "unknown",
      latency: null,
    },
  ]);

  let isChecking = $state(false);

  /**
   * ping từng microservice với timeout ngắn (2.5s) để xác định status
   */
  export async function checkAllServices() {
    isChecking = true;

    await Promise.all(
      services.map(async (svc, index) => {
        services[index].status = "checking";
        const startTime = performance.now();
        try {
          await httpClient.get(svc.url, { timeout: 2500 });
          const elapsed = Math.round(performance.now() - startTime);
          services[index].status = "online";
          services[index].latency = elapsed;
        } catch (error) {
          const elapsed = Math.round(performance.now() - startTime);
          const isDown =
            !error?.status || [0, 502, 503, 504].includes(error.status);
          if (!isDown) {
            services[index].status = "online";
            services[index].latency = elapsed;
          } else {
            services[index].status = "offline";
            services[index].latency = null;
          }
        }
      }),
    );

    isChecking = false;
  }

  checkAllServices();
</script>

<div
  class="health-monitor-container inline-flex items-center gap-2.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 shadow-xs"
>
  <div
    class="monitor-label inline-flex items-center gap-1.5 text-zinc-900 font-semibold text-xs select-none"
  >
    <Activity size={15} class="activity-icon text-zinc-900 stroke-[2.2]" />
    <span>Trạng thái Services:</span>
  </div>

  <div class="chips-group inline-flex items-center gap-2">
    {#each services as svc (svc.id)}
      {@const isOnline = svc.status === "online"}
      {@const isOffline = svc.status === "offline"}
      <div
        class="service-badge status-{svc.status} inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-mono transition-colors shadow-2xs {isOnline
          ? 'border-emerald-200 bg-emerald-50/70 text-zinc-900'
          : isOffline
            ? 'border-rose-200 bg-rose-50/60 text-zinc-900'
            : 'border-zinc-200 bg-zinc-50 text-zinc-700'}"
        title="{svc.name} (: {svc.port}) - Trạng thái: {svc.status} {svc.latency
          ? `(${svc.latency}ms)`
          : ''}"
        role="status"
        aria-label="{svc.name} :{svc.port} {svc.status}"
      >
        <span
          class="indicator-dot h-2 w-2 rounded-full shrink-0 {isOnline
            ? 'bg-emerald-500 ring-2 ring-emerald-200'
            : isOffline
              ? 'bg-rose-500 ring-2 ring-rose-200'
              : 'bg-amber-400 ring-2 ring-amber-200'}"
        ></span>

        <span class="service-port font-bold text-zinc-900 text-xs"
          >:{svc.port}</span
        >

        <span
          class="service-state font-bold text-[11px] px-1.5 py-0.2 rounded tracking-tight {isOnline
            ? 'bg-emerald-100 text-emerald-800'
            : isOffline
              ? 'bg-rose-100 text-rose-700'
              : 'bg-zinc-200 text-zinc-600'}"
        >
          {#if isOnline}
            {svc.latency ? `${svc.latency}ms` : "ON"}
          {:else if isOffline}
            OFF
          {:else}
            ...
          {/if}
        </span>
      </div>
    {/each}
  </div>

  <button
    type="button"
    class="reping-btn inline-flex items-center justify-center p-1.5 rounded-md text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer border border-transparent hover:border-zinc-200 bg-transparent"
    onclick={checkAllServices}
    disabled={isChecking}
    title="Kiểm tra lại trạng thái kết nối tất cả các service"
    aria-label="Kiểm tra lại kết nối service"
  >
    <RefreshCw size={13} class={isChecking ? "animate-spin" : ""} />
  </button>
</div>
