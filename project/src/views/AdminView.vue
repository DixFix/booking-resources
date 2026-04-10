<template>
  <v-container>
    <div class="d-flex justify-space-between align-center mb-4">
      <h1 class="text-h4">Управление ресурсами</h1>
      <v-btn color="primary" prepend-icon="mdi-plus" @click="openEditDialog(null)">
        Добавить ресурс
      </v-btn>
    </div>


    <v-row>
      <v-col cols="12">
        <v-table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Название</th>
              <th>Тип</th>
              <th>Ответственный</th>
              <th>Цена</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="resource in resources" :key="resource.id">
              <td>{{ resource.id }}</td>
              <td>{{ resource.name }}</td>
              <td>{{ resource.typeName }}</td>
              <td>{{ resource.responsible }}</td>
              <td>{{ resource.price }} ₽/{{ resource.priceUnit }}</td>
              <td>
                <v-btn
                  icon="mdi-pencil"
                  size="small"
                  variant="text"
                  color="primary"
                  @click="openEditDialog(resource)"
                ></v-btn>
                <v-btn
                  icon="mdi-delete"
                  size="small"
                  variant="text"
                  color="error"
                  @click="confirmDelete(resource)"
                ></v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>


    <v-dialog v-model="dialogVisible" max-width="700">
      <v-card>
        <v-card-title>{{ editingResource ? 'Редактировать ресурс' : 'Добавить ресурс' }}</v-card-title>
        <v-card-text>
          <v-form ref="resourceForm">
            <v-text-field
              v-model="form.name"
              label="Название ресурса"
              required
              :rules="[v => !!v || 'Обязательное поле']"
            ></v-text-field>

            <v-textarea
              v-model="form.description"
              label="Описание"
              rows="3"
              required
              :rules="[v => !!v || 'Обязательное поле']"
            ></v-textarea>

            <v-row>
              <v-col cols="6">
                <v-select
                  v-model="form.type"
                  :items="resourceTypes"
                  item-title="title"
                  item-value="value"
                  label="Тип ресурса"
                  required
                  @update:model-value="form.typeName = resourceTypes.find(t => t.value === form.type)?.title || ''"
                ></v-select>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="form.typeName"
                  label="Название типа (отображается)"
                  required
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="4">
                <v-text-field
                  v-model.number="form.capacity"
                  label="Вместимость (чел.)"
                  type="number"
                  :rules="[v => v === null || v === '' || v > 0 || 'Должно быть положительным']"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model.number="form.price"
                  label="Цена"
                  type="number"
                  required
                  :rules="[v => v > 0 || 'Цена должна быть положительной']"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-select
                  v-model="form.priceUnit"
                  :items="['час', 'день', 'месяц']"
                  label="Единица измерения"
                  required
                ></v-select>
              </v-col>
            </v-row>

            <v-text-field
              v-model="form.responsible"
              label="Ответственный"
              required
              :rules="[v => !!v || 'Обязательное поле']"
            ></v-text-field>

            <v-text-field
              v-model="form.image"
              label="Ссылка на изображение"
              placeholder="https://placehold.co/600x400/..."
            ></v-text-field>

            <v-combobox
              v-model="form.equipment"
              label="Оснащение"
              multiple
              chips
              hint="Введите элемент и нажмите Enter"
              persistent-hint
            ></v-combobox>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="dialogVisible = false">Отмена</v-btn>
          <v-btn color="primary" @click="saveResource" :loading="saving">
            {{ editingResource ? 'Сохранить' : 'Добавить' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


    <v-dialog v-model="deleteDialogVisible" max-width="400">
      <v-card>
        <v-card-title class="text-h6">Подтверждение удаления</v-card-title>
        <v-card-text>
          Вы уверены, что хотите удалить ресурс "{{ resourceToDelete?.name }}"?
          Это действие нельзя отменить.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="deleteDialogVisible = false">Отмена</v-btn>
          <v-btn color="error" @click="deleteResource">Удалить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'AdminView',
  data() {
    return {
      dialogVisible: false,
      deleteDialogVisible: false,
      editingResource: null,
      resourceToDelete: null,
      saving: false,
      form: {
        name: '',
        description: '',
        type: 'meeting_room',
        typeName: 'Переговорная',
        capacity: null,
        price: null,
        priceUnit: 'час',
        responsible: '',
        image: 'https://placehold.co/600x400/1976d2/white?text=Resource',
        equipment: []
      },
      resourceTypes: [
        { title: 'Переговорная', value: 'meeting_room' },
        { title: 'Фотограф', value: 'photographer' },
        { title: 'Оборудование', value: 'equipment' }
      ]
    }
  },
  computed: {
    ...mapGetters(['allResources']),
    resources() {
      return this.allResources
    }
  },
  methods: {
    ...mapActions(['addResource', 'updateResource', 'deleteResource', 'loadResources']),
    
    openEditDialog(resource) {
      if (resource) {
        this.editingResource = resource
        this.form = { ...resource }
      } else {
        this.editingResource = null
        this.resetForm()
      }
      this.dialogVisible = true
    },
    
    resetForm() {
      this.form = {
        name: '',
        description: '',
        type: 'meeting_room',
        typeName: 'Переговорная',
        capacity: null,
        price: null,
        priceUnit: 'час',
        responsible: '',
        image: 'https://placehold.co/600x400/1976d2/white?text=Resource',
        equipment: []
      }
    },
    
    saveResource() {
      if (!this.form.name || !this.form.description || !this.form.responsible || !this.form.price) {
        alert('Пожалуйста, заполните все обязательные поля')
        return
      }
      
      this.saving = true
      
      if (this.editingResource) {
        this.updateResource({ ...this.form, id: this.editingResource.id })
      } else {
        this.addResource(this.form)
      }
      
      setTimeout(() => {
        this.saving = false
        this.dialogVisible = false
        this.loadResources()
      }, 300)
    },
    
    confirmDelete(resource) {
      this.resourceToDelete = resource
      this.deleteDialogVisible = true
    },
    
    deleteResource() {
      if (this.resourceToDelete) {
        this.deleteResource(this.resourceToDelete.id)
        this.deleteDialogVisible = false
        this.resourceToDelete = null
      }
    }
  },
  created() {
    this.loadResources()
  }
}
</script>