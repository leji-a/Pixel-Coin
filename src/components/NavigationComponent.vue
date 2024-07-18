<template>
    <div class="nav">
        <nav>
            <router-link :to="{ name: 'Home' }">Pantalla principal</router-link>
            <router-link :to="{ name: 'Operate' }">Compra/Venta</router-link>
            <router-link :to="{ name: 'History' }">Historial</router-link>
            <router-link :to="{ name: 'Balance' }">Balance</router-link>
            <router-link :to="{ name: 'About' }">Sobre nosotros</router-link>
            <button type="button" @click="logOut()">Cerrar Sesión</button>
        </nav>
    </div>
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

</style>