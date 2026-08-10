<template>
  <footer class="bg-[#111] py-10 text-white sm:py-14">
    <div class="page-shell">
      <div class="grid gap-10 border-b border-white/15 pb-10 md:grid-cols-[1fr_auto] md:items-end">
        <div class="max-w-xl">
          <div class="flex items-center gap-3">
            <img src="@/assets/brand-mark.webp" alt="" class="size-12 object-cover" />
            <p class="text-lg font-black leading-none tracking-[-0.04em]">BONKEY<br><span class="text-accent">STREAMV2</span></p>
          </div>
          <p class="mt-5 max-w-lg text-sm font-medium leading-6 text-white/70">
            A personal anime index for discovery, playback, local favorites, and viewing progress. Media availability comes from external sources.
          </p>
        </div>
        <nav class="flex flex-wrap gap-x-6 gap-y-3 text-xs font-bold" aria-label="Footer navigation">
          <RouterLink to="/" class="hover:text-accent">Home</RouterLink>
          <RouterLink to="/browse" class="hover:text-accent">Browse</RouterLink>
          <RouterLink to="/favorites" class="hover:text-accent">Favorites</RouterLink>
          <RouterLink to="/history" class="hover:text-accent">History</RouterLink>
        </nav>
      </div>
      <div class="flex flex-col gap-2 pt-6 text-xs font-medium text-white/60 sm:flex-row sm:items-center sm:justify-between">
        <p>BONKEY STREAMV2 / PERSONAL PROJECT</p>
        <p>No account. No cloud sync. Local library data stays in this browser.</p>
      </div>
    </div>
  </footer>
</template>
