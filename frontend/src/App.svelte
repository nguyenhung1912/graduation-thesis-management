<script>
  import ThesisView from "./views/ThesisView.svelte";
  import StudentView from "./views/StudentView.svelte";
  import RegistrationView from "./views/RegistrationView.svelte";
  import ServiceHealthMonitor from "./components/common/ServiceHealthMonitor.svelte";
  import {
    BookOpen,
    Users,
    ClipboardList,
    GraduationCap,
  } from "@lucide/svelte";

  let currentTab = $state("theses");
</script>

<div
  class="app-layout min-h-screen bg-white text-zinc-950 flex flex-col font-sans antialiased"
>
  <header
    class="app-header border-b border-zinc-200 bg-white/95 backdrop-blur-xs sticky top-0 z-40"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 space-y-3">
      <!-- Top header bar: Logo + Health monitor -->
      <nav class="flex items-center justify-between gap-4 flex-wrap">
        <div class="brand flex items-center gap-3">
          <div
            class="h-10 w-10 rounded-lg bg-zinc-900 flex items-center justify-center text-white shadow-xs"
          >
            <GraduationCap size={22} class="brand-icon" />
          </div>
          <div>
            <h1
              class="text-base sm:text-lg font-bold tracking-tight text-zinc-900 leading-none"
            >
              HỆ THỐNG QUẢN LÝ ĐỒ ÁN TỐT NGHIỆP
            </h1>
          </div>
        </div>

        <div class="header-right flex items-center">
          <ServiceHealthMonitor />
        </div>
      </nav>

      <!-- Segmented Tab navigation -->
      <nav class="tab-nav pt-1">
        <div
          class="inline-flex items-center rounded-lg bg-zinc-100 p-1 border border-zinc-200/80 gap-1"
        >
          <button
            type="button"
            class="tab-btn inline-flex items-center gap-2 rounded-md px-3.5 py-1.5 text-xs font-medium transition-all cursor-pointer {currentTab ===
            'theses'
              ? 'active bg-white text-zinc-950 shadow-xs font-semibold'
              : 'text-zinc-600 hover:text-zinc-900'}"
            onclick={() => (currentTab = "theses")}
          >
            <BookOpen size={15} /> Quản lý Đề tài
          </button>

          <button
            type="button"
            class="tab-btn inline-flex items-center gap-2 rounded-md px-3.5 py-1.5 text-xs font-medium transition-all cursor-pointer {currentTab ===
            'students'
              ? 'active bg-white text-zinc-950 shadow-xs font-semibold'
              : 'text-zinc-600 hover:text-zinc-900'}"
            onclick={() => (currentTab = "students")}
          >
            <Users size={15} /> Quản lý Sinh viên
          </button>

          <button
            type="button"
            class="tab-btn inline-flex items-center gap-2 rounded-md px-3.5 py-1.5 text-xs font-medium transition-all cursor-pointer {currentTab ===
            'registrations'
              ? 'active bg-white text-zinc-950 shadow-xs font-semibold'
              : 'text-zinc-600 hover:text-zinc-900'}"
            onclick={() => (currentTab = "registrations")}
          >
            <ClipboardList size={15} /> Đăng ký Đề tài
          </button>
        </div>
      </nav>
    </div>
  </header>

  <main class="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
    {#if currentTab === "theses"}
      <ThesisView />
    {:else if currentTab === "students"}
      <StudentView />
    {:else if currentTab === "registrations"}
      <RegistrationView />
    {/if}
  </main>
</div>
