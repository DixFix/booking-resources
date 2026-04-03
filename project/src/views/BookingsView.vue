<template>
  <v-container>
    <h1 class="text-h4 mb-4">Мои бронирования</h1>

    <v-row v-if="bookings.length === 0">
      <v-col class="text-center">
        <v-icon size="64" color="grey">mdi-calendar-blank</v-icon>
        <p class="text-h6 text-grey mt-4">У вас пока нет бронирований</p>
        <v-btn color="primary" to="/">Перейти к ресурсам</v-btn>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col
        v-for="booking in bookings"
        :key="booking.id"
        cols="12"
        md="6"
        lg="4"
      >
        <v-card>
          <v-card-title class="text-subtitle-1 font-weight-bold">
            {{ booking.resourceName }}
          </v-card-title>
          
          <v-card-text>
            <v-list density="compact">
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon size="small">mdi-calendar</v-icon>
                </template>
                <v-list-item-title>Дата: {{ booking.date }}</v-list-item-title>
              </v-list-item>
              
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon size="small">mdi-clock</v-icon>
                </template>
                <v-list-item-title>
                  Время: {{ booking.startTime }} – {{ booking.endTime }}
                </v-list-item-title>
              </v-list-item>
              
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon size="small">mdi-account</v-icon>
                </template>
                <v-list-item-title>{{ booking.clientName }}</v-list-item-title>
              </v-list-item>
            </v-list>
            
            <v-divider class="my-3"></v-divider>
            
            <div class="text-caption text-grey">
              Забронировано: {{ formatDate(booking.createdAt) }}
            </div>
          </v-card-text>
          
          <v-card-actions>
            <v-btn
              color="primary"
              variant="text"
              size="small"
              :to="`/resource/${booking.resourceId}`"
            >
              Перейти к ресурсу
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'BookingsView',
  computed: {
    ...mapGetters(['allBookings']),
    bookings() {
      return [...this.allBookings].reverse()
    }
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return 'только что'
      const date = new Date(dateString)
      return date.toLocaleString('ru-RU')
    }
  }
}
</script>