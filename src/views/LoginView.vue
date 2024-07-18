<template>
  <div>
    <label for="usuario">Ingrese un nombre de usuario: </label>
    <input type="text" id="usuario" v-model="nombre" placeholder="Nombre de Usuario" @keyup.enter="ingresar()">
    <button type="button" @click="ingresar()" >Ingresar</button>
  </div>
</template>

<script setup>
import { UserStore } from '../store/User';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const store = UserStore();
const route = useRouter();
const nombre = ref('');
let isValid = ref(false)

const checkUsername = (username) => {
  const regex = /^[a-zA-Z0-9.]+$/
  isValid = regex.test(username.value);
  return isValid;
}
const ingresar = () => {
  if (checkUsername(nombre) == true) {
    store.Login(nombre.value);
    route.push({ name: 'Home' });
  }
}
</script>
