<template>
    <div class="container">
        <div v-if="store.Logged" class="content">
            <div class="welcome">
                <h1>¡Bienvenido {{ store.Username }}!</h1>
                <p class="time">{{ currentTime }}</p>
                <p class="date">{{ currentDate }}</p>
            </div>
            <div class="prices-tables">
                <PricesComponent />
            </div>
        </div>
        <div v-else class="content">
            <h1 class="error-title">NO DEBERIAS ESTAR AQUI!!!!</h1>
            <h3 class="error-message">Debes logearte para poder utilizar la página</h3>
            <button @click="volverAlLogin()">Volver al inicio</button>
        </div>
    </div>
</template>

<script setup>
import { UserStore } from '../store/User';
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import PricesComponent from '@/components/PricesComponent.vue';

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
/* Contenedor principal */
.container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: linear-gradient(45deg, #4e63da, #8e24aa, #f44336);
    background-size: 400% 400%;
    animation: gradientMove 5s ease infinite;
    color: #fff;
    font-family: 'Roboto', sans-serif;
}

/* Animación del movimiento de gradiente */
@keyframes gradientMove {
    0% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0% 50%;
    }
}


/* Estilo para el contenido */
.content {
    position: relative;
    z-index: 10;
    background-color: rgba(0, 0, 0, 0.7);
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 50px 15px rgba(0, 0, 0, 0.363);
    text-align: center;
    width: 100%;
    max-width: 400px;
    opacity: 0;
    transform: translateY(50px);
    animation: fade-in 3s forwards;
    animation-delay: 0.5s;
}

@keyframes fade-in {
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Títulos */
h1 {
    font-size: 2.2rem;
    margin-bottom: 15px;
    font-weight: 600;
}

h3 {
    font-size: 1.2rem;
    margin-top: 10px;
}

/* Estilo para la hora y la fecha */
.time, .date {
    font-size: 1.5rem;
    margin: 10px 0;
    font-weight: 500;
    color: #ffeb3b;
}

/* Estilo para el mensaje de error */
.error-title {
    font-size: 2rem;
    color: #f44336;
    margin-bottom: 10px;
    font-weight: bold;
}

.error-message {
    font-size: 1.4rem;
    color: #fff;
    margin-top: 10px;
}

/* Botón */
button {
    background-color: #8e24aa;
    color: #fff;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.1s ease, transform 0.1s ease;
    margin-top: 20px;
}

button:hover {
    background-color: #7b1fa2;
    transform: scale(2);
}

/* Animación de escala al hacer hover */
button:active {
    transform: scale(0.98);
}
</style>