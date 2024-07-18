<template>
    <div class="container">
        <div v-if="store.Logged" class="content">
            <h1>Bienvenido {{ store.Username }}</h1>
            <p>{{ currentTime }}</p>
            <p>{{ currentDate }}</p>
        </div>
        <div v-else class="content">
            <h1>NO DEBERIAS ESTAR AQUI!!!!</h1>
            <h3>Debes logearte para poder utilizar la pagina</h3>
            <button @click="volverAlLogin()">Volver al inicio</button>
        </div>
    </div>
</template>

<script setup>
import { UserStore } from '../store/User';
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';

const store = UserStore();
const route = useRouter();

const volverAlLogin = () => {
    route.push({ name: 'Login' });
};

const currentTime = ref('');
const currentDate = ref('');

const updateTimeAndDate = () => {
    const now = new Date();
    currentTime.value = now.toLocaleTimeString();
    currentDate.value = now.toLocaleDateString();
};

onMounted(() => {
    updateTimeAndDate();
    setInterval(updateTimeAndDate, 1000);
});
</script>

<style scoped>
.container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #5F5F4F;
    color: #FFFFFF;
    text-align: center;
}

.content {
    background-color: #4F4F3F;
    padding: 20px;
    border-radius: 10px;
}

button {
    background-color: #3F3F2F;
    color: #FFFFFF;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
}

button:hover {
    background-color: #2F2F1F;
}
</style>