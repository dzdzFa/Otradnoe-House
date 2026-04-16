<template>
  <div class="admin-goods-list">
    <div class="list-header">
      <h2>Все товары</h2>
      <button class="btn-add" @click="goToAdd">➕ Добавить товар</button>
    </div>

    <div class="goods-table-wrapper">
      <table class="goods-table">
        <thead>
          <tr>
            <th>Изображение</th>
            <th>Название</th>
            <th>Категория</th>
            <th>Цена</th>
            <th>Статус</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="good in goods" :key="good.id">
            <td>
              <div
                class="good-thumb"
                :style="{ backgroundImage: 'url(' + good.image + ')' }"
              ></div>
            </td>
            <td>{{ good.name }}</td>
            <td>
              <span class="category-badge">{{ good.category }}</span>
            </td>
            <td>{{ good.price }} ₽</td>
            <td>
              <span
                :class="[
                  'status-badge',
                  good.available ? 'available' : 'unavailable',
                ]"
              >
                {{ good.available ? "✓ Доступно" : "✕ Недоступно" }}
              </span>
            </td>
            <td>
              <div class="action-buttons">
                <button class="btn-edit" @click="goToEdit(good.id)">✏️</button>
                <button class="btn-delete" @click="deleteGood(good.id)">
                  🗑️
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="goods.length === 0" class="no-goods">
        <p>Товаров пока нет</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useGoods } from "../../composables/useGoods";
import { useNotification } from "../../composables/useNotification";

const router = useRouter();
const { getAllGoods, deleteGood: delGood, loadGoods } = useGoods();
const { success, error: showError } = useNotification();

const goods = ref([]);

const load = () => {
  loadGoods();
  goods.value = getAllGoods();
};

const goToAdd = () => router.push({ name: "admin-goods-add" });
const goToEdit = (id) =>
  router.push({ name: "admin-goods-edit", params: { id } });

const deleteGood = (id) => {
  if (confirm("Вы уверены, что хотите удалить этот товар?")) {
    const result = delGood(id);
    if (result.success) {
      success(result.message);
      load(); 
    } else {
      showError(result.message);
    }
  }
};

onMounted(load);

defineExpose({ refresh: load });
</script>

<style scoped>
.admin-goods-list {
  width: 100%;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.list-header h2 {
  margin: 0;
  font-size: 1.8rem;
}

.btn-add {
  background: var(--color-seafoam);
  padding: 0.8rem 1.5rem;
  border-radius: var(--radius-sm);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
}

.btn-add:hover {
  background: var(--color-sage);
  transform: translateY(-2px);
}

.goods-table-wrapper {
  overflow-x: auto;
  background: var(--color-white);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

.goods-table {
  width: 100%;
  border-collapse: collapse;
}

.goods-table th,
.goods-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid var(--color-border);
}

.goods-table th {
  background: var(--color-cream);
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
}

.good-thumb {
  width: 60px;
  height: 60px;
  border-radius: var(--radius-sm);
  background-size: cover;
  background-position: center;
}

.category-badge {
  background: var(--color-cream);
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.85rem;
  font-weight: 600;
}

.status-badge {
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.85rem;
  font-weight: 600;
}

.status-badge.available {
  background: rgba(184, 225, 221, 0.3);
  color: var(--color-sage);
}

.status-badge.unavailable {
  background: rgba(255, 182, 185, 0.3);
  color: var(--color-coral);
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn-edit,
.btn-delete {
  width: 35px;
  height: 35px;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
}

.btn-edit {
  background: var(--color-cream);
}

.btn-edit:hover {
  background: var(--color-seafoam);
}

.btn-delete {
  background: rgba(255, 182, 185, 0.3);
}

.btn-delete:hover {
  background: var(--color-coral);
}

.no-goods {
  text-align: center;
  padding: 3rem;
  color: var(--color-text-light);
}

@media (max-width: 768px) {
  .list-header {
    flex-direction: column;
    align-items: flex-start;
  }
  .btn-add {
    width: 100%;
    justify-content: center;
  }
}
</style>
