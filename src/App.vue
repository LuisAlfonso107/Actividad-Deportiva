<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { storeToRefs } from 'pinia'
import HelloWorld from './components/HelloWorld.vue'
import { useApiErrorStore } from './stores/apiError'

const apiError = useApiErrorStore()
const { message: apiErrorMessage, isLimitError } = storeToRefs(apiError)
</script>

<template>
  <div v-if="apiErrorMessage" class="api-alert" :class="{ 'api-alert--limit': isLimitError }">
    <span class="api-alert-text">{{ apiErrorMessage }}</span>
    <button type="button" class="api-alert-dismiss" aria-label="Dismiss" @click="apiError.clearError">×</button>
  </div>
  <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="Favorite Football Players" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/laliga2">La Liga 2</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
.api-alert {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 0.6rem 1rem;
  background: #d32f2f;
  color: #fff;
  font-size: 0.9rem;
  text-align: center;
}
.api-alert--limit {
  background: #f57c00;
}
.api-alert-text {
  flex: 1;
}
.api-alert-dismiss {
  background: transparent;
  border: none;
  color: inherit;
  font-size: 1.4rem;
  line-height: 1;
  cursor: pointer;
  padding: 0 0.25rem;
  opacity: 0.9;
}
.api-alert-dismiss:hover {
  opacity: 1;
}
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
