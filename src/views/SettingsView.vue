<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

router.push('/profile')
</script>

<template>
  <div class="min-h-screen flex items-center justify-center">
    <span class="material-symbols-rounded animate-spin text-4xl text-primary">sync</span>
  </div>
</template>
