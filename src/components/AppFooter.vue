<template>
  <footer class="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col md:flex-row justify-between items-center gap-8">
        <div>
          <RouterLink to="/" class="text-2xl font-black font-display tracking-tighter text-secondary dark:text-white">
            KABOOM<span class="text-primary">FOT</span>
          </RouterLink>
          <p class="text-slate-500 text-sm mt-2">© 2024 Kaboomfot Recruitment S.L. Todos los derechos reservados.</p>
        </div>
        <div class="flex gap-8 text-sm font-semibold text-slate-500">
          <a href="#" class="hover:text-primary transition-colors">Privacidad</a>
          <a href="#" class="hover:text-primary transition-colors">Términos</a>
          <a href="#" class="hover:text-primary transition-colors">Contacto</a>
          <a href="#" class="hover:text-primary transition-colors">Publicidad</a>
        </div>
        <div class="flex gap-4">
          <a class="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-primary hover:text-white transition-all" href="#">
            <span class="material-symbols-rounded">share</span>
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>
