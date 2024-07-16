<template>
  <div v-if="store.Logged">
    <Nav />
    <router-view />
  </div>
  <div v-else>
    <router-view :to="{ name: 'Login' }"></router-view>
  </div>
</template>

<script setup>
import { useUserStore } from './store/User';
import Nav from './components/NavComponent';
const store = useUserStore();
</script>

<style>
nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
