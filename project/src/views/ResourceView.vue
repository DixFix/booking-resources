<template>
  <v-container>
    <h1>Страница ресурса</h1>
    <p>ID: {{ $route.params.id }}</p>
    <p>Здесь будет детальная информация о ресурсе и форма бронирования</p>
  </v-container>
</template>

<script>
export default {
  name: 'ResourceView'
}
</script>