<template>
  <div id="app">
    <div v-if="store.Logged" class="main-container">
      <Nav />
      <div class="content-container">
        <router-view />
      </div>
    </div>
    <div v-else>
      <router-view :to="{ name: 'Login' }" />
    </div>
    <fotterContainer />
  </div>
</template>

<script setup>
import { UserStore } from './store/User';
import fotterContainer from './components/FooterComponent.vue';
import Nav from './components/NavigationComponent';

const store = UserStore();
</script>

<style>
html, body {
  height: 100%;
  margin: 0;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Contenedor principal con barra lateral y contenido */
.main-container {
  display: flex;
  flex: 1;
  height: 100vh; /* Asegura que ocupe toda la pantalla */
}

/* Contenedor del contenido principal */
.content-container {
  flex: 1; /* Ocupa el espacio restante después de la barra lateral */
  overflow-y: auto; /* Permite desplazamiento si el contenido es grande */
  background-color: #ffffff;
}

/* Footer */
.fotterContainer {
  text-align: center;
}

/* Navegación */
nav {
  padding: 50px;
}

nav a {
  font-weight: bold;
  color: #8bc2fa;
}

nav a.router-link-exact-active {
  color: #39a775;
}
</style>