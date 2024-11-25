<template>
  <div class="loading-spinner">
    <div class="spinner"></div>
  </div>
</template>


<style scoped>
.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.spinner {
  border: 8px solid #f3f3f3; /* Color de fondo */
  border-top: 8px solid #3498db; /* Color del spinner */
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
