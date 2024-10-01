<template>
  <div v-if="store.Logged">
    <Nav />
    <router-view />
  </div>
  <div v-else>
    <router-view :to="{ name: 'Login' }"></router-view>
  </div>
  <fotterContainer/>
</template>

<script setup>
import { UserStore } from './store/User';
import fotterContainer from './components/FooterComponent.vue'
import Nav from './components/NavigationComponent';
const store = UserStore();
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
