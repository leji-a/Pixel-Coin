<template>
  <div class="imagen">
    <img src="../assets/Preview-removebg-preview.png" alt="Imagen logo">
  </div>
  <div class="login-container">
    <div class="login-box">
      <input type="text" id="usuario" v-model="nombre" placeholder="Nombre de Usuario" @keyup.enter="ingresar()"> <br>
      <button type="button" @click="ingresar()">Ingresar</button>
      <div class="containerError">
        <p v-if="!isValid" class="error">Introduzca un nombre de usuario que contenga letras , numeros y caracteres especiales</p>
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
  // Actualiza la expresión regular para permitir caracteres especiales como '.'
  const regex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z0-9.]+$/;
  return regex.test(nombre.value);
});

const ingresar = () => {
    if (nombre.value === '') {
      isValid.value = false
    } else {
      store.Login(nombre.value);
      route.push({ name: 'Home' });
      isValid.value = false;
    }
}
</script>

<style scoped>
.imagen {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  background-color: white; /* Ajusta el margen superior según sea necesario */
}

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 97.7vh;
  background-color: rgba(0, 0, 0, 0.5);
}

.login-box {
  background-color: #5F5F4F;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  text-align: center;
}

input[type="text"] {
  width: 70%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #45a049;
}

.error {
  color: red;
  margin-top: 10px;
  font-size: 15px;
}
</style>