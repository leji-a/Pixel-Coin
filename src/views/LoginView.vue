<template>
  <div>
   <form>
     <label for="Usuario">Ingrese un nombre de usuario: </label>
     <input type="text" id="Usuario" v-model="nombre" placeholder="Nombre de Usuario">
   </form>
    <button type="button" @click="ingresar()">Ingresar</button>
  </div>
</template>

<script setup>
import { UserStore } from '../store/User';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const store = UserStore();
const route = useRouter();
const nombre = ref('');


const ingresar = () => {
  store.Login(nombre.value); 
  route.push({name: 'Home'});
  }
</script>