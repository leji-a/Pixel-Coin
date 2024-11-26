<template>
  <div class="imagen">
    <img src="../assets/Preview-removebg-preview.png" alt="Imagen logo" class="logo">
  </div>
  <div class="login-container">
    <div class="login-box">
      <h2 class="login-title">Iniciar sesión</h2>
      <input 
        type="text" 
        id="usuario" 
        v-model="nombre" 
        placeholder="Nombre de Usuario" 
        @keyup.enter="ingresar()" 
        class="input-field"> 
      <button 
        type="button" 
        @click="ingresar()" 
        class="btn-submit">Ingresar</button>
      <div class="containerError">
        <p v-if="!isValid" class="error">Introduzca un nombre de usuario que contenga letras, números y caracteres especiales</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { UserStore } from '../store/User';
import { useRouter } from 'vue-router';
import { ref, computed } from 'vue';

const store = UserStore();
const route = useRouter();
const nombre = ref('');

const isValid = computed(() => {
  const regex = /^(?=.[a-zA-Z])(?=.\d)[a-zA-Z0-9.]+$/;
  return regex.test(nombre.value);
});

const ingresar = () => {
    if (nombre.value === '') {
      isValid.value = false;
    } else {
      store.Login(nombre.value);
      route.push({ name: 'Home' });
      isValid.value = false;
    }
}
</script>

<style scoped>
/* Imagen del logo */
.imagen {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

.logo {
  max-width: 100%;
  height: auto;
  width: 200px; /* Tamaño ajustado */
  margin-bottom: 0rem;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.877);
}

/* Contenedor principal */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: url('../assets/a.avif') no-repeat center center;
  background-size: cover;
  background-attachment: fixed;
}

/* Caja de login */
.login-box {
  background-color: rgba(0, 0, 0, 0.692); /* Transparencia para mejor integración */
  padding: 40px 30px;
  border-radius: 15px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  text-align: center;
  width: 100%;
  max-width: 400px;
}

.login-title {
  font-size: 28px;
  color: #ffffff;
  margin-bottom: 25px;
  font-weight: bold;
}

/* Campo de texto */
.input-field {
  width: 90%;
  padding: 14px;
  margin: 15px 0;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  font-size: 16px;
  background-color: rgba(255, 255, 255, 0.9);
  color: #333;
  transition: border-color 0.3s, background-color 0.3s;
}

.input-field:focus {
  border-color: #4CAF50;
  background-color: #fff;
  outline: none;
}

/* Botón de login */
.btn-submit {
  padding: 14px 24px;
  background: linear-gradient(135deg, #235324, #3e8e41);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  width: 90%;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-submit:hover {
  background: linear-gradient(135deg, #45a049, #388e3c);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* Mensaje de error */
.error {
  color: #ff4d4d;
  margin-top: 10px;
  font-size: 14px;
}

.containerError {
  margin-top: 15px;
}
</style>