<template>
  <v-container>
    
    <v-row class="mb-6">
      <v-col>
        <h1 class="text-h4">Бронирование общих ресурсов</h1>
        <p class="text-subtitle-1">Конференц-залы, оборудование, фотографы</p>
      </v-col>
    </v-row>

    
    <v-row v-if="isLoading">
      <v-col class="text-center">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
        <p class="mt-2">Загружаем ресурсы...</p>
      </v-col>
    </v-row>

    
    <v-row v-else>
      <v-col
        v-for="resource in resources"
        :key="resource.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card class="h-100" :to="`/resource/${resource.id}`">
          <v-img
            :src="resource.image"
            height="150"
            cover
          ></v-img>
          
          <v-card-title class="text-subtitle-1 font-weight-bold">
            {{ resource.name }}
          </v-card-title>
          
          <v-card-subtitle class="pb-2">
            <v-icon size="small" class="mr-1">mdi-tag</v-icon>
            {{ resource.typeName }}
          </v-card-subtitle>
          
          <v-card-text>
            <v-row dense>
              <v-col cols="12" v-if="resource.capacity">
                <v-icon size="small" class="mr-1">mdi-account-group</v-icon>
                Вместимость: до {{ resource.capacity }} чел.
              </v-col>
              <v-col cols="12">
                <v-icon size="small" class="mr-1">mdi-currency-rub</v-icon>
                {{ resource.price }} ₽/{{ resource.priceUnit }}
              </v-col>
              <v-col cols="12" class="mt-2">
                <v-chip
                  v-for="item in resource.equipment.slice(0, 2)"
                  :key="item"
                  size="x-small"
                  class="mr-1"
                >
                  {{ item }}
                </v-chip>
                <v-chip v-if="resource.equipment.length > 2" size="x-small">
                  +{{ resource.equipment.length - 2 }}
                </v-chip>
              </v-col>
            </v-row>
          </v-card-text>
          
          <v-card-actions>
            <v-btn
              color="primary"
              variant="tonal"
              size="small"
              :to="`/resource/${resource.id}`"
            >
              Подробнее
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'HomeView',
  computed: {
    ...mapGetters(['allResources', 'isLoading']),
    resources() {
      return this.allResources
    }
  },
  methods: {
    ...mapActions(['loadResources'])
  },
  created() {
    this.loadResources()
  }
}
</script>

<style scoped>
.h-100 {
  height: 100%;
}
</style>