<template>
  <v-app>
    <v-app-bar color="primary" density="compact">
      <v-app-bar-title>Бронирование ресурсов</v-app-bar-title>
      
      <v-btn to="/" text>Ресурсы</v-btn>
      <v-btn to="/bookings" text>Мои брони</v-btn>
      <v-btn to="/admin" text>Управление</v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  created() {
    this.$store.dispatch('loadBookingsFromStorage')
  }
}
</script>