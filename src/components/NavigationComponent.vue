<template>
    <header class="bg-[#5F5F4F] text-white px-4 md:px-6 py-4 flex items-center justify-between">
        <router-link :to="{ name: 'Home' }" class="inline-flex items-center gap-2">
        </router-link>
       <div class="navContainer">
          <nav class="flex items-center gap-6">
            <img src="../assets/Preview-removebg-preview.png" alt="Imagen logo" class="logo-image">
             <router-link :to="{ name: 'Home' }" class="nav-link">Pantalla principal</router-link>
             <router-link :to="{ name: 'Operate' }" class="nav-link">Operar</router-link>
             <router-link :to="{ name: 'History' }" class="nav-link">Historial</router-link>
             <router-link :to="{ name: 'Control' }" class="nav-link">Panel de control</router-link>
             <router-link :to="{ name: 'Analysis' }" class="nav-link">Analisis de cuenta</router-link>
             <button type="button" @click="logOut()" class="nav-link">Cerrar Sesión</button>
           </nav>
       </div>
        
        
    </header>
</template>

<script setup>
import { UserStore } from '@/store/User'
import { useRouter } from 'vue-router'

const route = useRouter();
const logOut = () => {
    UserStore().Logout()
    route.push({ name: 'Login' })
}
</script>

<style scoped>

.logo-image {
    width: 50px; 
    height: auto;
}

.nav-link {
    display: inline-flex;
    height: 2.25rem;
    align-items: center;
    justify-content: center;
    border-radius: 0.375rem;
    background-color: #7F7F6F;
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: white;
    text-decoration: none;
    transition: background-color 0.3s;
}

.nav-link:hover {
    background-color: #6F6F5F;
}

.navContainer {
    background-color: #5F5F4F;
    justify-content: center;
    margin: 0 auto;
    display: flex;
    padding: 1rem;
    border: 2px solid #7F7F6F;
    border-radius: 0.375rem;
}

nav {
    display: flex;
    gap: 1rem;
}
</style>