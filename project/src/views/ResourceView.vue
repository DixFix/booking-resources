<template>
  <v-container>
    
    <v-row v-if="loading">
      <v-col class="text-center">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
        <p class="mt-2">Загрузка...</p>
      </v-col>
    </v-row>

    
    <v-row v-else-if="!resource">
      <v-col>
        <v-alert type="error" variant="tonal">
          Ресурс не найден
        </v-alert>
        <v-btn to="/" color="primary" class="mt-4">Вернуться к списку</v-btn>
      </v-col>
    </v-row>

    
    <v-row v-else>
      
      <v-col cols="12" md="5">
        <v-img
          :src="resource.image"
          height="300"
          cover
          rounded
          class="mb-4"
        ></v-img>
        
        
        <v-card v-if="resource.equipment && resource.equipment.length" variant="outlined">
          <v-card-title class="text-subtitle-1">
            <v-icon size="small" class="mr-2">mdi-wrench</v-icon>
            Оснащение
          </v-card-title>
          <v-card-text>
            <v-chip
              v-for="item in resource.equipment"
              :key="item"
              class="mr-2 mb-2"
              size="small"
              color="primary"
              variant="outlined"
            >
              {{ item }}
            </v-chip>
          </v-card-text>
        </v-card>
      </v-col>

      
      <v-col cols="12" md="7">
        <h1 class="text-h4 mb-2">{{ resource.name }}</h1>
        
        <v-chip class="mb-4" color="primary">
          {{ resource.typeName }}
        </v-chip>

        
        <p class="text-body-1 mb-4">{{ resource.description }}</p>

        
        <v-list class="mb-4" bg-color="transparent">
          <v-list-item v-if="resource.capacity">
            <template v-slot:prepend>
              <v-icon>mdi-account-group</v-icon>
            </template>
            <v-list-item-title>Вместимость: до {{ resource.capacity }} человек</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <template v-slot:prepend>
              <v-icon>mdi-currency-rub</v-icon>
            </template>
            <v-list-item-title>
              Стоимость: {{ resource.price }} ₽/{{ resource.priceUnit }}
            </v-list-item-title>
          </v-list-item>

          <v-list-item>
            <template v-slot:prepend>
              <v-icon>mdi-account-tie</v-icon>
            </template>
            <v-list-item-title>Ответственный: {{ resource.responsible }}</v-list-item-title>
          </v-list-item>
        </v-list>

        
        <v-btn
          color="success"
          size="large"
          prepend-icon="mdi-calendar-plus"
          @click="showBookingDialog = true"
        >
          Забронировать
        </v-btn>
      </v-col>
    </v-row>

    
    <v-dialog v-model="showBookingDialog" max-width="600">
      <v-card>
        <v-card-title class="text-h6">
          Бронирование: {{ resource?.name }}
        </v-card-title>
        
        <v-card-text>
          <v-form ref="bookingForm">
            <v-text-field
              v-model="booking.clientName"
              label="Ваше имя"
              required
              :rules="[v => !!v || 'Обязательное поле']"
            ></v-text-field>

            <v-text-field
              v-model="booking.clientEmail"
              label="Email"
              type="email"
              required
              :rules="[v => !!v || 'Обязательное поле']"
            ></v-text-field>

            <v-text-field
              v-model="booking.phone"
              label="Телефон"
              required
              :rules="[v => !!v || 'Обязательное поле']"
            ></v-text-field>

            <v-text-field
              v-model="booking.date"
              label="Дата"
              type="date"
              required
              :rules="[v => !!v || 'Обязательное поле']"
            ></v-text-field>

            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model="booking.startTime"
                  label="Время начала"
                  type="time"
                  required
                  :rules="[v => !!v || 'Обязательное поле']"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="booking.endTime"
                  label="Время окончания"
                  type="time"
                  required
                  :rules="[v => !!v || 'Обязательное поле']"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-textarea
              v-model="booking.comment"
              label="Комментарий (необязательно)"
              rows="2"
            ></v-textarea>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="closeBookingDialog">Отмена</v-btn>
          <v-btn color="success" @click="submitBooking" :loading="submitting">
            Забронировать
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    
    <v-snackbar
      v-model="showSuccessNotification"
      timeout="3000"
      color="success"
    >
      <v-icon class="mr-2">mdi-check-circle</v-icon>
      Бронирование создано! Скоро с вами свяжутся.
      <template v-slot:actions>
        <v-btn color="white" variant="text" @click="showSuccessNotification = false">
          Закрыть
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'ResourceView',
  data() {
    return {
      resource: null,
      loading: true,
      showBookingDialog: false,
      showSuccessNotification: false,
      submitting: false,
      booking: {
        resourceId: null,
        resourceName: null,
        clientName: '',
        clientEmail: '',
        phone: '',
        date: '',
        startTime: '',
        endTime: '',
        comment: ''
      }
    }
  },
  computed: {
    ...mapGetters(['allResources'])
  },
  methods: {
    ...mapActions(['loadResources', 'addBooking']),
    
    loadResource() {
      const id = parseInt(this.$route.params.id)
      this.resource = this.allResources.find(r => r.id === id) || null
      this.loading = false
    },
    
    closeBookingDialog() {
      this.showBookingDialog = false
      this.resetBookingForm()
    },
    
    resetBookingForm() {
      this.booking = {
        resourceId: this.resource?.id || null,
        resourceName: this.resource?.name || null,
        clientName: '',
        clientEmail: '',
        phone: '',
        date: '',
        startTime: '',
        endTime: '',
        comment: ''
      }
    },
    
    submitBooking() {
      
      if (!this.booking.clientName || !this.booking.clientEmail || 
          !this.booking.phone || !this.booking.date || 
          !this.booking.startTime || !this.booking.endTime) {
        alert('Пожалуйста, заполните все обязательные поля')
        return
      }
      
      this.submitting = true
      
      
      const newBooking = {
        id: Date.now(), 
        resourceId: this.resource.id,
        resourceName: this.resource.name,
        clientName: this.booking.clientName,
        clientEmail: this.booking.clientEmail,
        phone: this.booking.phone,
        date: this.booking.date,
        startTime: this.booking.startTime,
        endTime: this.booking.endTime,
        comment: this.booking.comment,
        createdAt: new Date().toISOString()
      }
      
      
      this.addBooking(newBooking)
      
      
      this.submitting = false
      this.showBookingDialog = false
      this.showSuccessNotification = true
      
      
      this.resetBookingForm()
    }
  },
  watch: {
    '$route.params.id': 'loadResource'
  },
  created() {
    this.loadResource()
  }
}
</script>