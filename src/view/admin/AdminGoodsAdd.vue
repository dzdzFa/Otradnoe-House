<template>
  <div class="admin-goods-form">
    <h2>Добавить новый товар</h2>
    <form @submit.prevent="submitForm" novalidate>
      <div class="form-group">
        <label>Название *</label>
        <input
          type="text"
          v-model.trim="form.name"
          placeholder="Например: Завтрак в номер"
        />
        <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
      </div>

      <div class="form-group">
        <label>Описание *</label>
        <textarea
          v-model.trim="form.description"
          placeholder="Опишите товар подробно..."
          rows="4"
        ></textarea>
        <span v-if="errors.description" class="error-message">{{
          errors.description
        }}</span>
      </div>

      <div class="form-group">
        <label>Категория *</label>
        <select v-model="form.category" required>
          <option value="" disabled>Выберите категорию</option>
          <option value="Питание">Питание</option>
          <option value="Развлечения">Развлечения</option>
          <option value="SPA">SPA</option>
          <option value="Экскурсии">Экскурсии</option>
          <option value="Трансфер">Трансфер</option>
          <option value="Другое">Другое</option>
        </select>
        <span v-if="errors.category" class="error-message">{{
          errors.category
        }}</span>
      </div>

      <div class="form-group">
        <label>Цена (₽) *</label>
        <input
          type="number"
          v-model.number="form.price"
          placeholder="1500"
          min="0"
        />
        <span v-if="errors.price" class="error-message">{{
          errors.price
        }}</span>
      </div>

      <div class="form-group">
        <label>URL изображения *</label>
        <input
          type="text"
          v-model.trim="form.image"
          placeholder="/src/assets/img/good.jpg"
        />
        <span v-if="errors.image" class="error-message">{{
          errors.image
        }}</span>
      </div>

      <div class="form-group">
        <label class="checkbox">
          <input type="checkbox" v-model="form.available" />
          <span>Товар доступен для заказа</span>
        </label>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn-submit" :disabled="loading">
          {{ loading ? "Сохранение..." : "Сохранить товар" }}
        </button>
        <button type="button" class="btn-cancel" @click="goBack">Отмена</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useGoods } from "../../composables/useGoods";
import { useNotification } from "../../composables/useNotification";

const router = useRouter();
const { addGood } = useGoods();
const { success, error: showError } = useNotification();

const loading = ref(false);
const form = ref({
  name: "",
  description: "",
  category: "",
  price: "",
  image: "",
  available: true,
});
const errors = ref({});

const submitForm = () => {
  errors.value = {};
  let isValid = true;

  if (!form.value.name.trim()) {
    errors.value.name = "Название обязательно";
    isValid = false;
  } else if (form.value.name.length < 3) {
    errors.value.name = "Минимум 3 символа";
    isValid = false;
  }

  if (!form.value.description.trim()) {
    errors.value.description = "Описание обязательно";
    isValid = false;
  } else if (form.value.description.length < 10) {
    errors.value.description = "Минимум 10 символов";
    isValid = false;
  }

  if (!form.value.category) {
    errors.value.category = "Выберите категорию";
    isValid = false;
  }

  if (form.value.price === "" || form.value.price < 0) {
    errors.value.price = "Укажите корректную цену";
    isValid = false;
  }

  if (!form.value.image.trim()) {
    errors.value.image = "URL изображения обязателен";
    isValid = false;
  }

  if (!isValid) {
    showError("Пожалуйста, исправьте ошибки");
    return;
  }

  loading.value = true;

  const result = addGood({
    name: form.value.name,
    description: form.value.description,
    category: form.value.category,
    price: Number(form.value.price),
    image: form.value.image,
    available: form.value.available,
  });

  if (result.success) {
    success(result.message);
    router.push({ name: "admin-goods-list" });
  } else {
    showError(result.message);
  }

  loading.value = false;
};

const goBack = () => {
  router.push({ name: "admin-goods-list" });
};
</script>

<style scoped>
.admin-goods-form h2 {
  margin-bottom: 2rem;
  font-size: 1.8rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 1rem;
  font-family: inherit;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--color-seafoam);
}

.checkbox {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  cursor: pointer;
}

.checkbox input {
  width: 20px;
  height: 20px;
  accent-color: var(--color-seafoam);
}

.error-message {
  display: block;
  color: var(--color-coral);
  font-size: 0.85rem;
  margin-top: 0.3rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-submit,
.btn-cancel {
  padding: 0.8rem 2rem;
  border-radius: var(--radius-sm);
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: var(--transition);
}

.btn-submit {
  background: var(--color-seafoam);
  color: var(--color-text-dark);
}

.btn-submit:hover:not(:disabled) {
  background: var(--color-sage);
  transform: translateY(-2px);
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-cancel {
  background: var(--color-cream);
  border: 1px solid var(--color-border);
}

.btn-cancel:hover {
  background: var(--color-border);
}

@media (max-width: 768px) {
  .form-actions {
    flex-direction: column;
  }

  .btn-submit,
  .btn-cancel {
    width: 100%;
  }
}
</style>
