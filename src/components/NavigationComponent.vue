<template>
    <div class="sidebar-container">
      <header class="sidebar">
        <router-link :to="{ name: 'Home' }" class="logo-container">
          <img src="../assets/Preview-removebg-preview.png" alt="Imagen logo" class="logo-image">
        </router-link>
        <nav class="nav-links">
          <router-link :to="{ name: 'Home' }" class="nav-link">Pantalla principal</router-link>
          <router-link :to="{ name: 'Operate' }" class="nav-link">Operar</router-link>
          <router-link :to="{ name: 'History' }" class="nav-link">Historial</router-link>
          <router-link :to="{ name: 'Control' }" class="nav-link">Panel de control</router-link>
          <button type="button" @click="logOut" class="nav-link logout-btn">Cerrar Sesión</button>
        </nav>
      </header>
      <main class="content">
        <slot />
      </main>
    </div>
  </template>
  
  <script setup>
  import { UserStore } from '@/store/User';
  import { useRouter } from 'vue-router';
  
  const route = useRouter();
  const logOut = () => {
    UserStore().Logout();
    route.push({ name: 'Login' });
  };
  </script>
  
  <style scoped>
  /* Contenedor principal */
  .sidebar-container {
    display: flex;
    height: 100vh;
    overflow: hidden;
  }
  
  /* Barra lateral */
  .sidebar {
    background-color: #12293fee;
    color: white;
    width: 250px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 30px 0;
    box-shadow: 2px 0 12px rgba(0, 0, 0, 0.1);
  }
  
  /* Logo */
  .logo-container {
    margin-bottom: 24px;
  }
  
  .logo-image {
    width: 90px;
    height: auto;
    border-radius: 8px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.733);
  }
  
  /* Enlaces de navegación */
  .nav-links {
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 85%;
    align-items: center;
  }
  
  .nav-link {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 90%;
    padding: 12px;
    font-size: 16px;
    font-weight: 600;
    text-decoration: none;
    border-radius: 8px;
    background-color: #ffffff;
    color: rgb(0, 0, 0);
    transition: background-color 0.3s, transform 0.3s ease;
  }
  
  .nav-link:hover {
    background-color: #a4b4c2;
    transform: scale(1.05);
  }
  
  /* Botón de cerrar sesión */
  .logout-btn {
    background-color: #85000b;
    font-weight: bold;
    color: white;
    transition: background-color 0.3s, transform 0.3s ease;
  }
  
  .logout-btn:hover {
    background-color: #d63031;
    transform: scale(1.05);
  }
  
  /* Contenido principal */
  .content {
    flex: 1;
    overflow-y: auto;
  }
  </style>