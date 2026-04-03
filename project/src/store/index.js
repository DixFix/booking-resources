import { createStore } from 'vuex'

const mockResources = [
  {
    id: 1,
    name: 'Конференц-зал "Иркутский"',
    description: 'Просторный зал с панорамным окном. Подходит для встреч до 20 человек.',
    type: 'meeting_room',
    typeName: 'Переговорная',
    capacity: 20,
    equipment: ['Проектор', 'Доска', 'Интернет'],
    image: 'https://placehold.co/600x400/1976d2/white?text=IRK Room',
    responsible: 'Евгений Наумов',
    price: 1500,
    priceUnit: 'час'
  },
  {
    id: 2,
    name: 'Фотограф Аресений Кряк',
    description: 'Профессиональный фотограф. Портреты, мероприятия, предметная съемка.',
    type: 'photographer',
    typeName: 'Фотограф',
    capacity: null,
    equipment: ['Камера', 'Студийный свет', 'Объективы'],
    image: 'https://placehold.co/600x400/388e3c/white?text=Arseny Kryak',
    responsible: 'Арсений Кряк',
    price: 3000,
    priceUnit: 'час'
  },
  {
    id: 3,
    name: 'Проектор Prok-2.2',
    description: 'Лазерный проектор с сенсорным управлением. Отлично подходит для презентаций.',
    type: 'equipment',
    typeName: 'Оборудование',
    capacity: null,
    equipment: ['Пульт управления', 'Кабель'],
    image: 'https://placehold.co/600x400/f57c00/white?text=Projector Prok-2.2',
    responsible: 'Иван Иванов',
    price: 500,
    priceUnit: 'день'
  },
  {
    id: 4,
    name: 'Переговорная "Talks+"',
    description: 'Уютная комната для совещаний на 6-8 человек. Есть кулер с водой.',
    type: 'meeting_room',
    typeName: 'Переговорная',
    capacity: 8,
    equipment: ['Канцелярия', 'Интернет', 'Кондиционер'],
    image: 'https://placehold.co/600x400/9c27b0/white?text=Talks',
    responsible: 'IT Office',
    price: 800,
    priceUnit: 'час'
  }
]

export default createStore({
  state() {
    return {
      resources: [],      
      loading: false,     
      bookings: []
    }
  },
  mutations: {
    SET_RESOURCES(state, resources) {
      state.resources = resources
    },
    SET_LOADING(state, status) {
      state.loading = status
    },

    ADD_BOOKING(state, booking) {
      state.bookings.push(booking)

      localStorage.setItem('bookings', JSON.stringify(state.bookings))
    },
    LOAD_BOOKINGS_FROM_STORAGE(state) {
      const saved = localStorage.getItem('bookings')
      if (saved) {
        state.bookings = JSON.parse(saved)
      }
    }
  },
  actions: {
    loadResources({ commit }) {
      commit('SET_LOADING', true)
      
      setTimeout(() => {
        commit('SET_RESOURCES', mockResources)
        commit('SET_LOADING', false)
      }, 500)
    },

    addBooking({ commit }, booking) {
      commit('ADD_BOOKING', booking)
    },
    loadBookingsFromStorage({ commit }) {
      commit('LOAD_BOOKINGS_FROM_STORAGE')
    }
  },
  getters: {
    allResources: state => state.resources,
    isLoading: state => state.loading,

    allBookings: state => state.bookings,
    bookingsByResource: state => (resourceId) => {
      return state.bookings.filter(b => b.resourceId === resourceId)
    }
  }
})